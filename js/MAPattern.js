/* global OHLC */
/* global Util */




class MAPattern {
    constructor(length, comparePrecision, patternType, type) {
        this.numDays = length;
        this.comparePrecision = comparePrecision;
        this.patternType = patternType || this.types().simple;
        this.type = type || Util.tickerTypes().close;
    }
    
    
    types() {
        return {
            'simple': Symbol('simple'),
            'exponential': Symbol('exponential'),
            'squareroot': Symbol('squareroot')
        }
    }
    
    
    // should I buy or sell this stock at this time?
    apply(ticker, time, callback) {
        // calculate moving average
        this.calculateMovingAverage(ticker, time, function(average) {
            // compare moving average to current price
            Util.getStockPriceFromTimestamp(time, ticker, function(price) {
                console.log(average);
                console.log(price);
                if (price < average) {
                    // sell
                    callback(Util.deciderTypes().sell);
                } else if (price > average) {
                    // buy
                    callback(Util.deciderTypes().buy);
                }
            });
        });
    }
    
    
    calculateMovingAverage(ticker, time, callback) {
        Util.getStockPriceFromTimeRange(Util.getLastValidDate(Util.subtractDate(time, this.numDays)), time, ticker, function(data) {
            // calculate average
            var total = 0;
            for (var i = 0; i < data.length; i++) {
                total += data[i];
            }
            
            callback(Util.round(total / data.length));
        });
    }
}