/* global multipleTimeslotStockTracker */
/* global Util */




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
            for (var i = 0; this.stockTrackers[i]; i++) {
                if (this.stockTrackers[i].getTicker() === ticker) {
                    this.stockTrackers[i].buy(amount, date).then((self, resolve) => {
                        return (cost) => {
                            // deduct cost from cash
                            self.cash -= cost;
                            resolve();
                        };
                    }(this, resolve));
                    return; // exit once bought stock
                }
            }

            // create stocktracker if it doesn't exist
            this.addStockTracker(new multipleTimeslotStockTracker(ticker));
            this.buy(ticker, amount, date);
        });
    }



    sell(ticker, amount, date = Util.getLastValidDate()) {
        return new Promise((resolve, reject) => {
            for (var i = 0; this.stockTrackers[i]; i++) {
                if (this.stockTrackers[i].getTicker() === ticker) {
                    this.stockTrackers[i].sell(amount, date).then((self, callback) => {
                        return (profit, money) => {
                            // add money to cash
                            self.cash += money;
                            callback();
                        };
                    }(this, callback));
                }
            }
        });
    }



    addStockTracker(stockTracker) {
        if (stockTracker instanceof multipleTimeslotStockTracker) {
            this.stockTrackers.push(stockTracker);
            console.log(stockTracker);
        }
    }




    getTotalStockMoney() {
        var totalStockMoney = 0;
        var totalStockMoneyCalculated = new Array(this.totalStock.length).fill(false);

        for (var i = 0; i < this.stockTrackers.length; i++) {
            this.stockTrackers[i].getTotalMoney().then((money) => {
                totalStockMoney += money;
                totalStockMoneyCalculated[i] = true;


            });
        }

        return totalStockMoney;
    }



    getTotalStockProfit() {
        var totalStockProfit = 0;
        for (var i = 0; i < this.stockTrackers.length; i++) {
            this.stockTrackers[i].getTotalProfit().then((money) => {
                totalStockProfit += money;
            });
        }

        return totalStockProfit;
    }
}
