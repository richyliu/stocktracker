from datetime import date
from Ticker import Ticker
from Util import getStockPrice, prettyPrint


print('\n\n############################################################################################')
ticker = Ticker('AAPL', 10, date(2017, 2, 9))
print(ticker)
ticker.sell(3, date(2017, 3, 1))
print(ticker)
ticker.buy(13, date(2017, 4, 27))
print(ticker)

# prettyPrint(['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Adj Close'], getStockPrice('AAPL', datetime(2017, 4, 23), datetime(2017, 4, 29)))

print('############################################################################################')
