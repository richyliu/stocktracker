from datetime import date
from Stock import Stock
from Util import getStockPrice, prettyPrint
from Portfolio import Portfolio


print('\n\n############################################################################################')
# stock = Stock('AAPL')
# stock.buy(10, date(2017, 2, 9))
# print(stock)
# stock.sell(3, date(2017, 3, 1))
# print(stock)
# stock.buy(13, date(2017, 4, 27))
# print(stock)

account = Portfolio(1000000)
account.buy('AAPL', 20, date(2016, 12, 6))
account.sell('AAPL', 20, date(2017, 3, 31))
# account.buy('GOOG', 10, date(2017, 1, 9))
# account.buy('GOOG', 25, date(2017, 1, 21))
# account.buy('GOOG', 17, date(2017, 4, 5))
print(account)

print('############################################################################################')
