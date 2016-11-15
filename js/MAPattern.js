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
    apply(ticker, time) {
        return new Promise((resolve, reject) => {
            Util.getStockPriceFromTimeRange(Util.getLastValidDate(Util.subtractDate(time, this.numDays + 5)), time, ticker).then(data => {
                // flip array so first is earlier days and last is later days
                data.reverse();

                // calculate moving average for past 5 days
                const extraDayLength = 5;


                for (let i = 0; i < extraDayLength; i++) {
                    let total = 0;
                    let times = 0;

                    for (let j = i; j < data.length - (extraDayLength - i); j++) {
                        total += data[j];
                        times++;
                    }
                    console.log(times);
                    let average = Util.round(total / data.length);
                    let price = data[i];
                    
                    console.log(average);
                    console.log(price);
                    // compare moving average to current price
                    if (price < average) {
                        // sell
                        resolve(Util.deciderTypes().sell);
                    } else if (price > average) {
                        // buy
                        resolve(Util.deciderTypes().buy);
                    }
                }
            });
        });
    }
}
