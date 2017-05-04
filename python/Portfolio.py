from Util import *
from Stock import Stock



class Portfolio:
    def __init__(self, startingMoney):
        # all the stocks owned
        self.stocks = []
        self.cash = startingMoney
    
    
    
    def __str__(self):
        string = '---------------------------------------------\nTicker\tAmount\tTotal value\tTotal profit\n'
        for s in self.stocks:
            # print(s.buyDates)
            for bd in s.buyDates:
                string = string + '{}\t{}\t{}\t\t{}\n'.format(
                    s.ticker,
                    round(bd[1], 2),
                    round(s.getValue() / s.amount * bd[1], 2),
                    round(s.getProfit() / s.amount * bd[1], 2)
                )
        return string + 'Cash: ' + str(round(self.cash, 2)) + '\n---------------------------------------------'


    
    """
    Buys amount of any stock
    
    Buys an amount of any stock. Will throw error if not enough cash.
    
    Args:
        ticker (string): Ticker of the stock to buy
        amount (integer): Number of stock to buy
        date (date): Date on which to buy the stock
    
    Raises:
        ValueError: Throws error if insufficient cash
    """
    def buy(self, ticker, amount, date=getLastTradeDay()):
        date = getLastTradeDay(date)
        cost = amount * getStockClose(ticker, date)
        
        if cost > self.cash:
            raise ValueError('Not enough cash!')
        
        # buy stock if already in stock list
        for s in self.stocks:
            if s.ticker == ticker:
                self.cash = self.cash - s.buy(amount, date)
                return
        
        # add stock to stock list if not there
        stock = Stock(ticker)
        self.cash = self.cash - stock.buy(amount, date)
        self.stocks.append(stock)


    
    """
    Sell amount of any stock
    
    Sells amount of any stock. Code that checks validity of stock sells are in 
    Stock class
    
    Args:
        ticker (string): Ticker of the stock to buy
        amount (integer): Number of stock to buy. Must be more than you have.
        date (date): Optional. Date on which to buy the stock. Must be after stock was bought.
    """
    def sell(self, ticker, amount, date=getLastTradeDay()):
        date = getLastTradeDay(date)
        
        # find Stock and sell
        for s in self.stocks:
            if s.ticker == ticker:
                cashAndProfit = s.sell(amount, date)
                self.cash = self.cash + cashAndProfit[0]
                print(cashAndProfit[1])
    