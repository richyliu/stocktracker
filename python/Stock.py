from Util import *



"""
Tracks stocks bought and sold for one stock ticker
"""
class Stock:
    def __init__(self, ticker):
        # Ticker of the stock
        self.ticker = ticker
        # When the stock was bought and amount (datetime, amount)
        self.buyDates = []
        # sum of buyDates amounts
        self.amount = 0
    
    
    def __str__(self):
        return """
        ---------------------------------------------------------
        Ticker: \t{} 
        Last buy date: \t{}
        Amount: \t{}
        Value: \t\t{}
        Profit: \t{}
        Total value: \t{}
        Total profit: \t{}
        ---------------------------------------------------------
        """.format(
            self.ticker,
            self.buyDates[-1][0].strftime('%Y-%m-%d %H:%M:%S'),
            self.amount,
            round(self.getValue() / self.amount, 2),
            round(self.getProfit() / self.amount, 2),
            round(self.getValue(), 2),
            round(self.getProfit(), 2),
        )
    
        
    """
    Gets the value of number of stocks on a date
    
    Args:
        count (integer): Optional. number of stock
        date (date): Optional
    
    Returns:
        float: Value of all stock
    """
    def getValue(self, count=None, date=getLastTradeDay()):
        if count is None:
            count = self.amount
        date = getLastTradeDay(date)
        
        return count * getStockClose(self.ticker, date)
    
    
    """
    Gets the profit of number of stocks on a date
    
    Calculates profit by subtracting stock close price on buy date from current
    date.
    
    Args:
        count (integer): number of stock
        date (date): Optional
    
    Returns:
        float: Value of all stock. May be negative
    """
    def getProfit(self, count=None, date=getLastTradeDay()):
        if count is None:
            count = self.amount
        date = getLastTradeDay(date)
        
        # costs of all the shares of the stocks that were bough on different days
        allStockCosts = sum([bd[1] * getStockClose(self.ticker, bd[0]) for bd in self.buyDates])
        
        return count * getStockClose(self.ticker, date) - allStockCosts
    
    
    """
    Buy number of stock
    
    Buys number of stocks on a certain date.
    
    Args:
        count (integer): Number of stocks to buy
        date (date): Date to buy the stocks on (optional)
    
    Returns:
        integer: cost to buy stocks
    """
    def buy(self, count, date=getLastTradeDay()):
        date = getLastTradeDay(date)
        self.amount = self.amount + count
        self.buyDates.append([date, count])
        
        return count * getStockClose(self.ticker, date)
    
    
    """
    Sell number of stock
    
    Sells number of stocks on a certain date. Starts selling from oldest stock,
    then selling newer and newer stocks (although order should not matter)
    
    Args:
        count (integer): Number of stocks to sell
        date (date): Date to sell the stocks on (optional). Must be after stocks
        were bought, otherwise throw error. If not enough stocks to sell, it
        sells all of them.
    
    Returns:
        integer[]: 1: money made, 2: profit
    """
    def sell(self, count, date=getLastTradeDay()):
        date = getLastTradeDay(date)
        
        
        curCount = count
        originalCost = 0 # original cost of the stocks
        removeList = [] # buyDate that need to be removed
        
        # starts looping from oldest buy date
        for bd in self.buyDates:
            # if stock bought after sell date
            if bd[0] > date:
                # break because all other stocks will be newer than this one
                break
            self.amount = self.amount - min(bd[1], curCount)
            originalCost = originalCost + min(bd[1], curCount) * getStockClose(self.ticker, bd[0])
            
            # subtract buyDate amount from curCount and curCount from buyDate
            tempcount = curCount
            curCount = curCount - bd[1]
            bd[1] = bd[1] - tempcount # might be negative if bd[1] < curCount, but is removed anyways
            
            
            # sell all of the buyDate, potentialy more
            if bd[1] <= 0:
                # need to remove, set to None
                removeList.append(bd)
                # if no more to sell
                if curCount == 0:
                    break
            # no more to sell
            else:
                break
        
        # remove buyDate that need to be removed
        for item in removeList:
            self.buyDates.remove(item)
        
        
        
        # 1: money made, 2: profit
        return [count * getStockClose(self.ticker, date), count * getStockClose(self.ticker, date) - originalCost]
