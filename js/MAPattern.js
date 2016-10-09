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
        };
    }
    
    
    // should I buy or sell this stock at this time?
    apply(ticker, time, callback) {
        Util.getStockPriceFromTimeRange(Util.getLastValidDate(Util.subtractDate(time, this.numDays)), time, ticker, function(data) {
            // calculate mvoing average
            var total = 0;
            for (var i = 0; i < data.length; i++) {
                total += data[i];
            }
            var average = Util.round(total / data.length);
            var price = data[0];
            
            console.log(average);
            console.log(price);
            // compare moving average to current price
            if (price < average) {
                // sell
                callback(Util.deciderTypes().sell);
            } else if (price > average) {
                // buy
                callback(Util.deciderTypes().buy);
            }
        });
    }
}