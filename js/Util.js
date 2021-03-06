/* global Highcharts */




class Util {
    static tickerTypes() {
        return {
            open: 'Open',
            high: 'High',
            low: 'Low',
            close: 'Close'
        };
    }


    static deciderTypes() {
        return {
            buy: Symbol('buy'),
            sell: Symbol('sell'),
            hold: Symbol('hold')
        };
    }



    // WIP
    static getTickerFromName(stockName) {
        return new Promise((resolve, reject) => {
            PreUtil.runOnceTickerCsvLoaded().then((resolve => {
                let allCsv = PreUtil.getTickerCsv();

                allCsv.forEach(curCsv => {
                    if (curCsv[1].toLowerCase().indexOf(stockName.toLowerCase()) > -1) {
                        resolve(curCsv);
                    }
                });
            }(resolve)));
        });

    }



    static getStockPriceDatabase(begin, end, ticker, type = this.tickerTypes().close) {
        // http://stackoverflow.com/questions/885456/stock-ticker-symbol-lookup-api
        // http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=toyota&region=1&lang=en&callback=main
        let url = 'http://query.yahooapis.com/v1/public/yql?q=' +
            encodeURIComponent('select * from yahoo.finance.historicaldata where symbol in ("' +
                ticker + '") and endDate = "' +
                end.toISOString().slice(0, 10) + '" and startDate = "' +
                begin.toISOString().slice(0, 10) + '"') +
            '&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';

        let callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());

        let script = document.createElement('script');
        script.src = url + '&callback=' + callbackName;
        document.body.appendChild(script);

        return new Promise((resolve, reject) => {
            window[callbackName] = resp => {
                delete window[callbackName];
                document.body.removeChild(script);

                // console.log(resp);
                if (!resp.query || !resp.query.results) {
                    console.log(resp);
                    reject('No entry found for date range ' + begin.toDateString() + ' to ' + end.toDateString());
                    throw new Error('No entry found for date range ' + begin.toDateString() + ' to ' + end.toDateString());
                }
                if (Array.isArray(resp.query.results.quote)) {
                    let quotes = resp.query.results.quote;

                    let data = [];
                    quotes.forEach(quote => {
                        // round numbers for consistency
                        data.push(Util.round(quote[type]));
                    });

                    resolve(data, resp);
                } else {
                    // round numbers for consistency
                    resolve([Util.round(resp.query.results.quote[type])], resp);
                }
            };
        });
    }


    static getStockPriceFromTimeRange(begin, end, ticker, type = this.tickerTypes().close) {
        return new Promise((resolve, reject) => {
            this.getStockPriceAndTimestamp(begin, end, ticker, type).then(prices => {
                let data = [];
                prices.forEach(price => {
                    data.push(price[1]);
                });

                resolve(data);
            });
        });
    }



    static getStockPriceAndTimestamp(begin, end, ticker, type = this.tickerTypes().close) {
        return new Promise((resolve, reject) => {
            this.getStockPriceDatabase(begin, end, ticker, type).then((data, rawResp) => {
                // array of 2 elements within array
                let newData = [];
                data.forEach(curData => {
                    // element 0 is the timestamp, and element 1 is the data
                    newData.push([new Date(rawResp.query.results.quote[i].Date).getTime(), parseFloat(curData)]);
                });

                resolve(newData.reverse());
            });
        });
    }



    static getStockPriceFromTimestamp(time, ticker, type = this.tickerTypes().close) {
        if (this.isMarketClosed(time)) throw new Error('Market is not open on ' + time.toDateString());

        return new Promise((resolve, reject) => {
            this.getStockPriceDatabase(this.getLastValidDate(this.subtractDate(time, 1)), time, ticker, type).then(data => {
                // return the price of the stock
                resolve(data[0]);
            });
        });
    }



    static getStockOHLCFromTimeRange(begin, end, ticker) {
        return new Promise((resolve, reject) => {
            let ohlcData = [];

            this.getStockPriceDatabase(begin, end, ticker, this.tickerTypes().open).then(data => {
                console.log(data);
                ohlcData.push(data);

                if (ohlcData.length === 4) allDone();
            });
            this.getStockPriceDatabase(begin, end, ticker, this.tickerTypes().high).then(data => {
                console.log(data);
                ohlcData.push(data);

                if (ohlcData.length === 4) allDone();
            });
            this.getStockPriceDatabase(begin, end, ticker, this.tickerTypes().low).then(data => {
                console.log(data);
                ohlcData.push(data);

                if (ohlcData.length === 4) allDone();
            });
            this.getStockPriceDatabase(begin, end, ticker, this.tickerTypes().close).then(data => {
                console.log(data);
                ohlcData.push(data);

                if (ohlcData.length === 4) allDone();
            });


            function allDone() {
                console.log(ohlcData);
                let ohlc = [];

                // loop through all data and combine together
                for (let i = 0; i < ohlcData[0].length; i++) {
                    ohlc.push([ohlcData[0][i], ohlcData[1][i], ohlcData[2][i], ohlcData[3][i]]);
                }

                resolve(ohlc);
            }
        });
    }



    static drawChart(startDate, endDate, ticker, type) {
        this.getStockPriceAndTimestamp(startDate, endDate, ticker, type).then(data => {
            // console.log(data);


            new Highcharts.StockChart({
                chart: {
                    renderTo: 'graph'
                },
                rangeSelector: {
                    selected: 1
                },
                title: {
                    text: ticker + ' Stock Price'
                },
                series: [{
                    name: ticker,
                    data: data,
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            });
        });
    }



    static XMLHttpRequest(url) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', url, true);

            request.onload = () => {
                if (request.status == 200 && request.readyState === 4) {
                    resolve(request.responseText);
                } else {
                    reject();
                }
            };

            request.send();
        });
    }



    static isMarketClosed(date) {
        // saturday (6) or sunday (0)
        return date.getDay() % 6 === 0;
    }



    static getLastValidDate(startingDate = new Date()) {
        // copy startingDate
        let yesterday = new Date(startingDate.getTime());
        // keep on going back a day until found an open date
        while(this.isMarketClosed(yesterday)) {
            yesterday = Util.subtractDate(yesterday, 1);
        }

        return yesterday;
    }


    static today() {
        return this.getLastValidDate();
    }



    static sleep(miliseconds) {
         let currentTime = new Date().getTime();

         while (currentTime + miliseconds >= new Date().getTime()) {}
    }



    static wait(func, seconds) {
        setTimeout(func, seconds * 1000);
    }



    static round(number, decimalPoints = 4) {
        return parseFloat(parseFloat(number).toFixed(decimalPoints));
    }



    static printStackTrace() {
        console.log((new Error()).stack);
    }


    static addDate(date, days) {
        // cannot set date directly
        let refDate = new Date(date.getTime());
        return new Date(refDate.setDate(date.getDate() + days));
    }

    static subtractDate(date, days) {
        // cannot set date directly
        let refDate = new Date(date.getTime());
        return new Date(refDate.setDate(date.getDate() - days));
    }
}




class PreUtil {
    static loadAll () {
        this.loadTickerCsv();
        this.allTickerCsvLoaded = false;
    }



    static loadTickerCsv() {
        // http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NASDAQ&render=download
        // http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NYSE&render=download


        Util.XMLHttpRequest('data/all.csv').then(allText => {
            let allTextLines = allText.split(/\r\n|\n/);
            let headers = allTextLines[0]
                    .slice(1, -2)           // remove leading " and trailing ",
                    .split('","');          // split with ","
            let lines = [];

            allTextLines.forEach(textLine => {
                let data = textLine
                    .slice(1, -2)           // remove leading " and trailing ",
                    .split('","');          // split with ","
                if (data.length === headers.length) {
                    let tarr = [];
                    data.forEach(curData => {
                        tarr.push(curData);
                    });
                    lines.push(tarr);
                }
            });
            PreUtil.allCsv = lines;
            PreUtil.allTickerCsvLoaded = true;
        });
    }



    static getTickerCsv() {
        return this.allCsv;
    }



    static runOnceTickerCsvLoaded() {
        return new Promise((resolve, reject) => {
            let timer = setInterval(((self, resolve) => {
                return () => {
                    if (self.allTickerCsvLoaded) {
                        resolve();
                        clearInterval(timer);
                    }
                };
            }(this, resolve)), 20);
        });
    }
}




class OHLC {
    constructor(ohlc) {
        this.open = ohlc[0];
        this.high = ohlc[1];
        this.low = ohlc[2];
        this.close = ohlc[3];
    }



    getRawOHLC() {
        return [this.open, this.high, this.low, this.close];
    }



    getBodyLength() {
        return Math.abs(this.open - this.close);
    }



    // is body white (true = white; false = black)
    isUpDay() {
        return this.open < this.close;
    }



    getTopShadowLength() {
        if (this.high === this.open || this.high === this.close) {
            return 0;
        }

        if (this.isUpDay()) {
            return this.high - this.close;
        } else {
            return this.high - this.open;
        }
    }



    getBotttomShadowLength() {
        if (this.low === this.open || this.low === this.close) {
            return 0;
        }

        if (this.isUpDay()) {
            return this.open - this.low;
        } else {
            return this.close - this.low;
        }
    }
}
