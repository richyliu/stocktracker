/* global multipleTimeslotStockTracker */
/* global Util */
/* jshint -W083 */




class Portfolio {
    constructor(startingMoney) {
        this.stockTrackers = [];
        this.cash = startingMoney;
    }



    getCash() {
        return this.cash;
    }



    // debug only
    setCash(cash) {
        this.cash = cash;
    }


    getStockTrackers() {
        return this.stockTrackers;
    }



    buy(ticker, amount, date = Util.getLastValidDate()) {
        return new Promise((resolve, reject) => {
            this.stockTrackers.forEach(stockTracker => {
                if (stockTracker.getTicker() === ticker) {
                    stockTracker.buy(amount, date).then((self, resolve) => {
                        return cost => {
                            // deduct cost from cash
                            self.cash -= cost;
                            resolve();
                        };
                    }(this, resolve));
                    return; // exit once bought stock
                }
            });

            // create stocktracker if it doesn't exist
            this.addStockTracker(new multipleTimeslotStockTracker(ticker));
            this.buy(ticker, amount, date);
        });
    }



    sell(ticker, amount, date = Util.getLastValidDate()) {
        return new Promise((resolve, reject) => {
            this.stockTrackers.forEach(stockTracker => {
                if (stockTracker.getTicker() === ticker) {
                    stockTracker.sell(amount, date).then((self, callback) => {
                        return (profit, money) => {
                            // add money to cash
                            self.cash += money;
                            callback();
                        };
                    }(this, callback));
                }
            });
        });
    }



    addStockTracker(stockTracker) {
        if (stockTracker instanceof multipleTimeslotStockTracker) {
            this.stockTrackers.push(stockTracker);
            console.log(stockTracker);
        }
    }




    getTotalStockMoney() {
        let totalStockMoney = 0;
        let totalStockMoneyCalculated = new Array(this.totalStock.length).fill(false);

        this.stockTrackers.forEach(stockTracker => {
            stockTracker.getTotalMoney().then(money => {
                totalStockMoney += money;
                totalStockMoneyCalculated[i] = true;


            });
        });

        return totalStockMoney;
    }



    getTotalStockProfit() {
        let totalStockProfit = 0;
        this.stockTrackers.forEach(stockTracker => {
            stockTracker.getTotalProfit().then(money => {
                totalStockProfit += money;
            });
        });

        return totalStockProfit;
    }
}
