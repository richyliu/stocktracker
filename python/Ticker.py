from datetime import datetime, timedelta    
from Util import *



"""
Tracks stocks bought and sold for one stock ticker
"""
class Ticker:
    def __init__(self, ticker, amount, date):
        # Ticker of the stock
        self.ticker = ticker
        # When the stock was bought and amount (datetime, amount)
        self.buyDates = [[date, amount]]
    
    
    def __str__(self):
        amount = sum([bd[1] for bd in self.buyDates])
        
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
            amount,
            round(self.getValue() / amount, 2),
            round(self.getProfit() / amount, 2),
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
    def getValue(self, count=None, date=None):
        if count is None:
            count = sum([item[1] for item in self.buyDates])
        if date is None:
            if datetime.now().hour < 16:
                date = datetime.now()-timedelta(days=1)
            else:
                date = datetime.now()
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
    def getProfit(self, count=None, date=None):
        if count is None:
            count = sum([item[1] for item in self.buyDates])
        # TODO: put this in util.getLastTradeDay
        if date is None:
            if datetime.now().hour < 16:
                date = datetime.now()-timedelta(days=1)
            else:
                date = datetime.now()
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
    def buy(self, count, date=None):
        if date is None:
            if datetime.now().hour < 16:
                date = datetime.now()-timedelta(days=1)
            else:
                date = datetime.now()
        
        self.buyDates.append([date, count])
        
        return count * getStockClose(self.ticker, date)
    
    
    """
    Sell number of stock
    
    Sells number of stocks on a certain date. Starts selling from oldest stock,
    then selling newer and newer stocks (although order should not matter)
    
    Args:
        count (integer): Number of stocks to sell
        date (date): Date to sell the stocks on (optional)
    
    Returns:
        integer: money made from selling stocks
    """
    def sell(self, count, date=None):
        if date is None:
            if datetime.now().hour < 16:
                date = datetime.now()-timedelta(days=1)
            else:
                date = datetime.now()
        
        # starts looping from oldest buy date
        curCount = count
        for bd in self.buyDates:
            tempcount = curCount
            curCount = curCount - bd[1]
            bd[1] = bd[1] - tempcount
            # sell only part of this buyDate
            if bd[1] > curCount:
                break
            # sell all of the buyDate, potentialy more
            else:
                self.buyDates.remove(bd)
                # if no more to sell
                if curCount == 0:
                    break
        
        # print(self.buyDates)
        
        return count * getStockClose(self.ticker, date)
