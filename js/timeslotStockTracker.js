/* global Util */




class singleTimeslotStockTracker {
    constructor(amount, ticker, time) {
        this.time = time || Util.getLastValidDate();
        this.amount = amount;
        this.ticker = ticker;
        Util.getStockPriceFromTimestamp(this.time, this.ticker).then((self) => {
            return (price) => {
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
            var totalMoney = 0;
            var totalMoneyCalculated = new Array(this.totalStock.length).fill(false);

            for (var i = 0; i < this.totalStock.length; i++) {
                Util.getStockPriceFromTimestamp(date, this.ticker).then((i, self, resolve) => {
                    return (price) => {
                        totalMoney += price * self.totalStock[i].getAmount();
                        totalMoneyCalculated[i] = true;

                        for (var j = 0; j < totalMoneyCalculated.length; j++) {
                            if (!totalMoneyCalculated[j]) return;
                        }

                        // all stock price calculated
                        resolve(Util.round(totalMoney));
                    };
                }(i, this, resolve));
            }
        });
    }



    getTotalProfit() {
        return new Promise((resolve, reject) => {
            this.getTotalMoney().then((self, resolve) => {
                return (totalMoney) => {
                    var totalPrevMoney = 0;

                    for (var i = 0; i < self.totalStock.length; i++) {
                        totalPrevMoney += self.totalStock[i].getPrice() * self.totalStock[i].getAmount();
                    }

                    resolve(Util.round(totalMoney - totalPrevMoney));
                };
            }(this, resolve));
        });
    }



    buy(amount, date = Util.getLastValidDate()) {
        return new Promise((resolve, reject) => {
            this.totalStock.push(new singleTimeslotStockTracker(amount, this.ticker, date));

            // how much stock costs
            Util.getStockPriceFromTimestamp(date, this.ticker).then((price) => {
                resolve(Util.round(amount * price));
            });
        });
    }



    sell(amount, date = Util.getLastValidDate()) {
        return new Promise((resolve, reject) => {
            var amountNeedToSell = amount;
            var soldStocks = [];

            for (var i = 0; i < this.totalStock.length; i++) {
                if (!this.totalStock[i].amount) {
                    continue;
                }
                if (amountNeedToSell < this.totalStock[i].getAmount()) {
                    // subtract amountNeedToSell from the first totalStock
                    var swap = new singleTimeslotStockTracker(
                        this.totalStock[i].getAmount() - amountNeedToSell,
                        this.ticker,
                        this.totalStock[i].getDate()
                    );
                    this.totalStock[i] = swap;

                    soldStocks.push(new singleTimeslotStockTracker(amountNeedToSell, this.ticker, this.totalStock[i].getDate()));
                    // sold all that needs to be sold
                    amountNeedToSell = 0;
                    break;
                }
                // if need more than one singeTimeslotStockTracker
                soldStocks.push(new singleTimeslotStockTracker(this.totalStock[i].getAmount(), this.ticker, this.totalStock[i].getDate()));
                // deduct amountNeedToSell from amount already sold
                amountNeedToSell -= this.totalStock[i].getAmount();
                // proceed to next totalStock
                this.totalStock[i] = null;
            }
            if (amountNeedToSell > 0) {
                throw new Error('Not enough existing stocks to make sale!');
            }


            var totalCurrent = 0;
            var totalPast = 0;
            var soldStocksCalculated = new Array(soldStocks.length).fill(false);
            var self = this;

            // loop through all soldStocks to calculate profit
            for (var i = 0; i < soldStocks.length; i++) {
                // wrap in iife in order for soldStock[i].getAmount() to be used
                Util.getStockPriceFromTimestamp(soldStocks[i].getDate(), this.ticker).then((currentSoldStockAmount, i, resolve) => {
                    return (pastPrice) => {
                        // use self bc "this" referes to the function() {} scope
                        Util.getStockPriceFromTimestamp(date, self.ticker).then((currentSoldStockAmount, i, resolve) => {
                            return (curPrice) => {
                                totalCurrent += curPrice * currentSoldStockAmount;
                                totalPast += pastPrice * currentSoldStockAmount;
                                soldStocksCalculated[i] = true;

                                for (var j = 0; j < soldStocksCalculated.length; j++) {
                                    if (!soldStocksCalculated[j]) return;
                                }

                                // all soldStocks calculated
                                resolve(Util.round(totalCurrent - totalPast), totalCurrent);
                            };
                        }(currentSoldStockAmount, i, resolve));
                    };
                }(soldStocks[i].getAmount(), i, resolve));
            }
        });
    }
}
