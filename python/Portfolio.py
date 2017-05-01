class Portfolio:
    def __init__(self, startingMoney):
        self.stockTrackers = []
        self.cash = startingMoney



    def getCash(self):
        return self.cash



    # debug only
    def setCash(self, cash):
        self.cash = cash


    def getStockTrackers(self):
        return self.stockTrackers



    def buy(self, ticker, amount, date=Util.getLastValidDate()):
        return new Promise((resolve, reject) => {
            for stockTracker in self.stockTrackers:
                if stockTracker.getTicker() === ticker:
                    stockTracker.buy(amount, date).then((self, resolve) => {
                        return cost => {
                            // deduct cost from cash
                            self.cash -= cost;
                            resolve();
                        };
                    }(this, resolve));
                    break # exit once bought stock

            # create stocktracker if it doesn't exist
            self.addStockTracker(self, new multipleTimeslotStockTracker(ticker));
            self.buy(self, ticker, amount, date);
        });
    }



    sell(ticker, amount, date = Util.getLastValidDate(), callback) {
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
        })



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