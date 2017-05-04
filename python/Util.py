import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from dateutil.parser import parse




"""
Get last trading day

Gets the last trading day starting from date and going back. A trading day is
Monday - Friday (does not take into account holidays).

Args:
    date (date): Going back from this day

Returns:
    datetime: The last trade day

"""
# get last trade day going back from date
def getLastTradeDay(date=None):
    if date is None:
        if datetime.now().hour < 16:
            date = datetime.now()-timedelta(days=1)
        else:
            date = datetime.now()
    
    # 0 is monday 4 is friday (weekday)
    if date.weekday() < 5:
        return date
    # weekend
    else:
        curDate = date
        while curDate.weekday() > 4:
            curDate = curDate - timedelta(days=1)
        return curDate



"""
Gets the price of a stock.

Gets prices of ticker from begin to end with date, open, high, low, close,
volume, and adjusted close.

Args:
    ticker (str): Ticker of the stock
    begin (date): Beginning of the date range for the stock price
    end (date): End of the date range for the stock price. End >= begin

Returns:
    float[][]: 2d array of date, open, high, low, close, volume, and adj close.
        Date will be in datetime format.
"""
def getStockPrice(ticker, begin, end):
    begin = getLastTradeDay(begin)
    end = getLastTradeDay(end)
    
    # https://greenido.wordpress.com/2009/12/22/work-like-a-pro-with-yahoo-finance-hidden-api/
    # month starts at 0
    url = 'http://ichart.finance.yahoo.com/table.csv?s={}&a={}&b={}&c={}&d={}&e={}&f={}&g=d&ignore=.csv'.format(
        ticker,
        begin.month - 1,
        begin.day,
        begin.year,
        end.month - 1,
        end.day,
        end.year,
    )
    
    
    try:
        # request url, splitting csv by newline and remove header and last newline
        response = urllib.request.urlopen(url).read().decode('utf-8').split('\n')[1:-1]
    except urllib.error.HTTPError:
        print('ERROR!: ', url)
    
    # split each line by a comma
    processed = [r.split(',') for r in response]
    # turn the first element into a date
    processed = [[parse(r[0])] + r[1:] for r in processed]
    # round numbers for consistency
    processed = [[round(float(item), 2) if not isinstance(item, datetime) else item for item in r] for r in processed]
    
    return processed



"""
Gets closing prices of stock.

Gets prices of ticker from begin to end of only closing price. If end is None,
will return the prices of stock at beginning as a float.

Args:
    ticker (str): Ticker of the stock
    begin (date): Beginning of the date range for the stock price
    end (date): End of the date range for the stock price. End >= begin

Returns:
    float: Closing ticker price
    -or-
    float[]: Closing ticker prices
"""
def getStockClose(ticker, begin, end=None):
    if end is None:
        prices = getStockPrice(ticker, begin, begin)
        return prices[0][4]
    else:
        prices = getStockPrice(ticker, begin, end)
        return [p[4] for p in prices]



"""
Pretty prints 2d arrays

Pretty prints 2d arrays by adding equals signs before and after and aligning the
values into a table.
http://stackoverflow.com/questions/13214809/pretty-print-2d-python-list

Args:
    headers (str[]): Headers of the table to print
    matrix ([][]): 2d array of values to print in the table. Size of each
        individual array must equal the size of headers.

"""
def prettyPrint(headers, matrix):
    if len(matrix) == 0:
        return
    
    matrix = [headers] + matrix
    s = [[str(e) for e in row] for row in matrix]
    lens = [max(map(len, col)) for col in zip(*s)]
    fmt = '\t'.join('{{:{}}}'.format(x) for x in lens)
    table = [fmt.format(*row) for row in s]
    
    print('=' * 8 * sum([l // 8 + 1 for l in lens]))
    print('\n'.join(table))
    print('=' * 8 * sum([l // 8 + 1 for l in lens]))
