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
    
    
    
    buy(ticker, amount, date, callback = function() {}) {
        if (typeof date === 'function') {
            callback = date;
            date = Util.getLastValidDate();
        }
        
        for (var i = 0; this.stockTrackers[i]; i++) {
            if (this.stockTrackers[i].getTicker() === ticker) {
                this.stockTrackers[i].buy(amount, date, (function(self, callback) {
                    return function(cost) {
                        // deduct cost from cash
                        self.cash -= cost;
                        callback();
                    };
                }(this, callback)));
                return; // exit once bought stock
            }
        }
        
        // create stocktracker if it doesn't exist
        this.addStockTracker(new multipleTimeslotStockTracker(ticker));
        this.buy(ticker, amount, date);
    }
    
    
    
    sell(ticker, amount, date, callback = function() {}) {
        if (typeof date === 'function') {
            callback = date;
            date = Util.getLastValidDate();
        }
        
        for (var i = 0; this.stockTrackers[i]; i++) {
            if (this.stockTrackers[i].getTicker() === ticker) {
                this.stockTrackers[i].sell(amount, date, (function(self, callback) {
                    return function(profit, money) {
                        // add money to cash
                        self.cash += money;
                        callback();
                    };
                }(this, callback)));
            }
        }
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
            this.stockTrackers[i].getTotalMoney(function(money) {
                totalStockMoney += money;
                totalStockMoneyCalculated[i] = true;
                
                
            });
        }
        
        return totalStockMoney;
    }
    
    
    
    getTotalStockProfit() {
        var totalStockProfit = 0;
        for (var i = 0; i < this.stockTrackers.length; i++) {
            this.stockTrackers[i].getTotalProfit(function(money) {
                totalStockProfit += money;
            });
        }
        
        return totalStockProfit;
    }
}