import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from dateutil.parser import parse



# get last trade day going back from date
def getLastTradeDay(date=datetime.now().date()):
    # 0 is monday 4 is friday (weekday)
    if date.weekday() < 5:
        return date
    # weekend
    else:
        curDate = date
        while curDate.weekday() > 4:
            curDate = curDate - timedelta(days=1)
        return curDate



# gets stock prices of ticker from begin to end
# returns 2d array of date, open, high, low, close, volume, and adj close for each day
# can only access data a month ago!
def getStockPrice(ticker, begin, end):
    begin = getLastTradeDay(begin)
    end = getLastTradeDay(end)
    
    # https://greenido.wordpress.com/2009/12/22/work-like-a-pro-with-yahoo-finance-hidden-api/
    url = 'http://ichart.finance.yahoo.com/table.csv?s={}{}{}&g=d&ignore=.csv'.format(ticker, begin.strftime('&a=%m&b=%d&c=%Y'), end.strftime('&d=%m&e=%d&f=%Y'))
    print(url)
    
    # request url, splitting csv by newline and remove header and last newline
    response = urllib.request.urlopen(url).read().decode('utf-8').split('\n')[1:-1]
    # split each line by a comma
    processed = [r.split(',') for r in response]
    # turn the first element into a date
    processed = [[parse(r[0])] + r[1:] for r in processed]
    # round numbers for consistency
    processed = [[round(float(item), 2) if not isinstance(item, datetime) else item for item in r] for r in processed]
    
    # print(processed)
    
    return processed




# pretty prints 2d arrays
# http://stackoverflow.com/questions/13214809/pretty-print-2d-python-list
def prettyPrint(headers, matrix):
    matrix = [headers] + matrix
    s = [[str(e) for e in row] for row in matrix]
    lens = [max(map(len, col)) for col in zip(*s)]
    fmt = '\t'.join('{{:{}}}'.format(x) for x in lens)
    table = [fmt.format(*row) for row in s]
    
    print('=' * 8 * sum([l // 8 + 1 for l in lens]))
    print('\n'.join(table))
    print('=' * 8 * sum([l // 8 + 1 for l in lens]))
