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
    static getTickerFromName(stockName, callback = function() {}) {
        PreUtil.runOnceTickerCsvLoaded(function() {
            var allCsv = PreUtil.getTickerCsv();
            
            for (var i = 0; i < allCsv.length; i++) {
                if (allCsv[i][1].toLowerCase().indexOf(stockName.toLowerCase()) > -1) {
                    callback(allCsv[i]);
                }
            }
        });
    }



    static getStockPriceDatabase(begin, end, ticker, type, callback = function() {}) {
        // http://stackoverflow.com/questions/885456/stock-ticker-symbol-lookup-api
        // http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=toyota&region=1&lang=en&callback=main
        jsonp('http://query.yahooapis.com/v1/public/yql?' +
            'q=' +
            encodeURIComponent('select * from yahoo.finance.historicaldata where symbol in ("' +
                ticker +
                '") and endDate = "' +
                end.toISOString().slice(0, 10) +
                '" and startDate = "' +
                begin.toISOString().slice(0, 10) +
                '"') +
            "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json",
            function(resp) {
                // console.log(resp);
                if (!resp.query || !resp.query.results) {
                    throw new Error('No entry found for date range ' + begin.toDateString() + ' to ' + end.toDateString());
                }
                if (Array.isArray(resp.query.results.quote)) {
                    var quotes = resp.query.results.quote;

                    var data = [];
                    for (var i = 0; i < quotes.length; i++) {
                        // round numbers for consistency
                        data.push(Util.round(quotes[i][type]));
                    }
                    
                    callback(data, resp);
                } else {
                    // round numbers for consistency
                    callback([Util.round(resp.query.results.quote[type])], resp);
                }
            }
        );
        
        
        function jsonp(url, callback = function() {}) {
            var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
            window[callbackName] = function(data) {
                delete window[callbackName];
                document.body.removeChild(script);
                callback(data);
            };
    
            var script = document.createElement('script');
            script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
            document.body.appendChild(script);
        }
    }
    
    
    static getStockPriceFromTimeRange(begin, end, ticker, type, callback = function() {}) {
        if (typeof type === 'function') {
            callback = type;
            type = this.tickerTypes().close;
        }
        
        this.getStockPriceAndTimestamp(begin, end, ticker, type, (function(callback) {
            return function(prices) {
                var data = [];
                for (var i = 0; i < prices.length; i++) {
                    data.push(prices[i][1]);
                }
                
                callback(data);
            };
        }(callback)));
    }
    
    
    
    static getStockPriceAndTimestamp(begin, end, ticker, type, callback = function() {}) {
        if (typeof type === 'function') {
            callback = type;
            type = this.tickerTypes().close;
        }
        this.getStockPriceDatabase(begin, end, ticker, type, function(data, rawResp) {
            // array of 2 elements within array
            var newData = [];
            for (var i = 0; i < data.length; i++) {
                // element 0 is the timestamp, and element 1 is the data
                newData.push([new Date(rawResp.query.results.quote[i].Date).getTime(), parseFloat(data[i])]);
            }
            
            callback(newData.reverse());
        });
    }
    
    
    
    static getStockPriceFromTimestamp(time, ticker, type, callback = function() {}) {
        if (this.isMarketClosed(time)) throw new Error('Market is not open on ' + time.toDateString());
        if (typeof type === 'function') {
            callback = type;
            type = this.tickerTypes().close;
        }
        
        this.getStockPriceDatabase(this.getLastValidDate(this.subtractDate(time, 1)), time, ticker, type, function(data) {
            // return the price of the stock
            callback(data[0]);
        });
    }
    
    
    
    static getStockOHLCFromTimeRange(begin, end, ticker, callback = function() {}) {
        var ohlcData = [];
        
        this.getStockPriceDatabase(begin, end, ticker, this.tickerTypes().open, function(data) {
            console.log(data);
            ohlcData.push(data);
            
            if (ohlcData.length === 4) allDone();
        });
        this.getStockPriceDatabase(begin, end, ticker, this.tickerTypes().high, function(data) {
            console.log(data);
            ohlcData.push(data);
            
            if (ohlcData.length === 4) allDone();
        });
        this.getStockPriceDatabase(begin, end, ticker, this.tickerTypes().low, function(data) {
            console.log(data);
            ohlcData.push(data);
            
            if (ohlcData.length === 4) allDone();
        });
        this.getStockPriceDatabase(begin, end, ticker, this.tickerTypes().close, function(data) {
            console.log(data);
            ohlcData.push(data);
            
            if (ohlcData.length === 4) allDone();
        });
        
        
        function allDone() {
            console.log(ohlcData);
            var ohlc = [];
            
            // loop through all data and combine together
            for (var i = 0; i < ohlcData[0].length; i++) {
                ohlc.push([ohlcData[0][i], ohlcData[1][i], ohlcData[2][i], ohlcData[3][i]]);
            }
            
            callback(ohlc);
        }
    }
    
    
    
    static drawChart(startDate, endDate, ticker, type) {
        this.getStockPriceAndTimestamp(startDate, endDate, ticker, type, function(data) {
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
    
    
    
    static XMLHttpRequest(url, callback = function() {}) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        
        request.onload = function() {
            if (request.status == 200 && request.readyState === 4) {
                callback(request.responseText);
            }
        };
        
        request.send();
    }



    static isMarketClosed(date) {
        // saturday (6) or sunday (0)
        return date.getDay() % 6 === 0;
    }
    
    
    
    static getLastValidDate(startingDate = new Date()) {
        // copy startingDate
        var yesterday = new Date(startingDate.getTime());
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
         var currentTime = new Date().getTime();
    
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
        var refDate = new Date(date.getTime());
        return new Date(refDate.setDate(date.getDate() + days));
    }
    
    static subtractDate(date, days) {
        // cannot set date directly
        var refDate = new Date(date.getTime());
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
        
        
        Util.XMLHttpRequest('data/all.csv', (function(self) {
            return function(allText) {
                var allTextLines = allText.split(/\r\n|\n/);
                var headers = allTextLines[0]
                        .slice(1, -2)           // remove leading " and trailing ",
                        .split('","');          // split with ","
                var lines = [];
            
                for (var i = 1; i < allTextLines.length; i++) {
                    var data = allTextLines[i]
                        .slice(1, -2)           // remove leading " and trailing ",
                        .split('","');          // split with ","
                    if (data.length === headers.length) {
            
                        var tarr = [];
                        for (var j = 0; j < headers.length; j++) {
                            tarr.push(data[j]);
                        }
                        lines.push(tarr);
                    } else {
                    }
                }
                self.allCsv = lines;
                self.allTickerCsvLoaded = true;
            };
        }(this)));
    }
    
    
    
    static getTickerCsv() {
        return this.allCsv;
    }
    
    
    
    static runOnceTickerCsvLoaded(callback = function() {}) {
        var timer = setInterval((function(self) {
            return function() {
                if (self.allTickerCsvLoaded) {
                    callback();
                    clearInterval(timer);
                }
            };
        }(this)), 20);
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