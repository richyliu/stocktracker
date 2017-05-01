from datetime import datetime
from Slot import Slot
from Util import getStockPrice, prettyPrint



s = Slot('AAPL', datetime(2010, 5, 17))
prettyPrint(['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Adj Close'], s.getValue())

# prettyPrint(['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Adj Close'], getStockPrice('AAPL', datetime(2017, 4, 23), datetime(2017, 4, 29)))
