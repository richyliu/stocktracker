from datetime import datetime, timedelta    
from Util import getLastTradeDay, getStockPrice


# Tracks value of set amount of stock bought on a certain date
class Slot:
    def __init__(self, ticker, date):
        # Ticker of the stock
        self.ticker = ticker
        # When the stock was bought, datetime object
        self.buyDate = date
    
    def __str__(self):
        return 'Ticker: ' + self.ticker + ' Buy date: ' + self.buyDate.strftime('%Y-%m-%d %H:%M:%S')
        
    # get value of stock on date
    def getValue(self, date=datetime.now()-timedelta(days=40)):
        date = getLastTradeDay(date)
        
        return getStockPrice(self.ticker, date, date)
