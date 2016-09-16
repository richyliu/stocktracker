/* global Highcharts */




class Util {
    static TYPES() {
        return {
            OPEN: 'Open',
            HIGH: 'High',
            LOW: 'Low',
            CLOSE: 'Close'
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



    static getStockPriceFromTimeRange(begin, end, ticker, type, callback = function() {}) {
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
                if (!resp.query.results) throw new Error('No entry found for date range ' + begin.toDateString() + ' to ' + end.toDateString());
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
    
    
    
    static getStockPriceAndTimestamp(begin, end, ticker, type, callback = function() {}) {
        this.getStockPriceFromTimeRange(begin, end, ticker, type, function(data, rawResp) {
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
        // if no type, shift arguments and default type to 'close'
        if (typeof type === 'function') {
            callback = type;
            type = this.TYPES().CLOSE;
        }
        
        this.getStockPriceFromTimeRange(time, time, ticker, type, function(data) {
            // return the price of the stock
            callback(data[0]);
        });
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
        return date.getDate() % 6 === 0;
    }
    
    
    
    static getLastValidDate(startingDate = (new Date())) {
        // keep on going back a day until found an open date
        var yesterday = new Date(startingDate.setDate(startingDate.getDate() - 1));
        while(this.isMarketClosed(yesterday)) {
            yesterday = new Date(yesterday.setDate(yesterday.getDate() - 1));
        }
        
        return yesterday;
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