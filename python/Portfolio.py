class Portfolio:
    def __init__(self, startingMoney):
        # all the stocks owned
        self.ticker = []
        self.cash = startingMoney



    def buy(self, ticker, amount, date=Util.getLastValidDate()):
        
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