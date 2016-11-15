/* global Util */
/* jshint -W083 */




class singleTimeslotStockTracker {
    constructor(amount, ticker, time) {
        this.time = time || Util.getLastValidDate();
        this.amount = amount;
        this.ticker = ticker;
        Util.getStockPriceFromTimestamp(this.time, this.ticker).then(self => {
            return price => {
                self.price = price;
            };
        }(this));
    }



    getDate() {
        return this.time;
    }



    getAmount() {
        return this.amount;
    }



    getTicker() {
        return this.ticker;
    }



    getPrice() {
        return this.price;
    }
}




class multipleTimeslotStockTracker {
    constructor(ticker) {
        this.ticker = ticker;
        this.totalStock = [];
    }



    getTicker() {
        return this.ticker;
    }



    getTotal() {
        return this.totalStock;
    }



    getTotalMoney(date = Util.getLastValidDate()) {
        return new Promise((resolve, reject) => {
            let totalMoney = 0;
            let totalMoneyCalculated = new Array(this.totalStock.length).fill(false);

            this.totalStock.forEach(curStock => {
                Util.getStockPriceFromTimestamp(date, this.ticker).then((i, curStock, resolve) => {
                    return price => {
                        totalMoney += price * curStock.getAmount();
                        totalMoneyCalculated[i] = true;

                        for (let j = 0; j < totalMoneyCalculated.length; j++) {
                            if (!totalMoneyCalculated[j]) return;
                        }

                        // all stock price calculated
                        resolve(Util.round(totalMoney));
                    };
                }(i, curStock, resolve));
            });
        });
    }



    getTotalProfit() {
        return new Promise((resolve, reject) => {
            this.getTotalMoney().then((self, resolve) => {
                return totalMoney => {
                    let totalPrevMoney = 0;

                    self.totalStock.forEach(curStock => {
                        totalPrevMoney += curStock.getPrice() * curStock.getAmount();
                    });

                    resolve(Util.round(totalMoney - totalPrevMoney));
                };
            }(this, resolve));
        });
    }



    buy(amount, date = Util.getLastValidDate()) {
        return new Promise((resolve, reject) => {
            this.totalStock.push(new singleTimeslotStockTracker(amount, this.ticker, date));

            // how much stock costs
            Util.getStockPriceFromTimestamp(date, this.ticker).then(price => {
                resolve(Util.round(amount * price));
            });
        });
    }



    sell(amount, date = Util.getLastValidDate()) {
        return new Promise((resolve, reject) => {
            let amountNeedToSell = amount;
            let soldStocks = [];

            for (let curStock of this.totalStock) {
                if (!curStock.amount) continue;
                
                if (amountNeedToSell < curStock.getAmount()) {
                    // subtract amountNeedToSell from the first totalStock
                    let swap = new singleTimeslotStockTracker(
                        curStock.getAmount() - amountNeedToSell,
                        this.ticker,
                        curStock.getDate()
                    );
                    curStock = swap;

                    soldStocks.push(new singleTimeslotStockTracker(amountNeedToSell, this.ticker, curStock.getDate()));
                    // sold all that needs to be sold
                    amountNeedToSell = 0;
                    break;
                }
                // if need more than one singeTimeslotStockTracker
                soldStocks.push(new singleTimeslotStockTracker(curStock.getAmount(), this.ticker, curStock.getDate()));
                // deduct amountNeedToSell from amount already sold
                amountNeedToSell -= curStock.getAmount();
                // proceed to next totalStock
                curStock = null;
            }
            if (amountNeedToSell > 0) {
                throw new Error('Not enough existing stocks to make sale!');
            }


            let totalCurrent = 0;
            let totalPast = 0;
            let soldStocksCalculated = new Array(soldStocks.length).fill(false);
            let self = this;

            // loop through all soldStocks to calculate profit
            soldStocks.forEach(soldStock => {
                // wrap in iife in order for soldStock[i].getAmount() to be used
                Util.getStockPriceFromTimestamp(soldStock.getDate(), this.ticker).then((currentSoldStockAmount, i, resolve) => {
                    return pastPrice => {
                        // use self bc "this" referes to the function() {} scope
                        Util.getStockPriceFromTimestamp(date, self.ticker).then((currentSoldStockAmount, i, resolve) => {
                            return curPrice => {
                                totalCurrent += curPrice * currentSoldStockAmount;
                                totalPast += pastPrice * currentSoldStockAmount;
                                soldStocksCalculated[i] = true;

                                for (let j = 0; j < soldStocksCalculated.length; j++) {
                                    if (!soldStocksCalculated[j]) return;
                                }

                                // all soldStocks calculated
                                resolve(Util.round(totalCurrent - totalPast), totalCurrent);
                            };
                        }(currentSoldStockAmount, i, resolve));
                    };
                }(soldStock.getAmount(), i, resolve));
            });
        });
    }
}
