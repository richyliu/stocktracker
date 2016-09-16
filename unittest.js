/* global QUnit */
/* global multipleTimeslotStockTracker */
/* global singleTimeslotStockTracker */
/* global Portfolio */
/* global Util */
/* global PreUtil */




PreUtil.loadAll();


QUnit.module('basic functions', function() {
    QUnit.test('multipleTimeslotStockTracker buy', function(assert) {
        var stock = new multipleTimeslotStockTracker('AAPL');
    
        stock.buy(5, new Date('2016-1-4'));
        stock.buy(5, new Date('2016-5-2'));
    
        assert.equal(JSON.stringify(stock.getTotal()), '[{"time":"2016-01-04T08:00:00.000Z","amount":5,"ticker":"AAPL"},{"time":"2016-05-02T07:00:00.000Z","amount":5,"ticker":"AAPL"}]');
    });
    
    
    
    QUnit.test('multipleTimeslotStockTracker sell', function(assert) {
        var done = assert.async();
        
        var stock = new multipleTimeslotStockTracker('AAPL');
    
        stock.buy(5, new Date('2016-1-4'));
        stock.buy(9, new Date('2016-5-2'));
        stock.buy(3, new Date('2016-6-2'));
    
        stock.sell(3, new Date('2016-7-25'));
    
        assert.equal(JSON.stringify(stock.getTotal()), '[{"time":"2016-01-04T08:00:00.000Z","amount":2,"ticker":"AAPL"},{"time":"2016-05-02T07:00:00.000Z","amount":9,"ticker":"AAPL"},{"time":"2016-06-02T07:00:00.000Z","amount":3,"ticker":"AAPL"}]');
    
        stock.sell(9, new Date('2016-9-9'), function(price) {
            assert.equal(price, 61.99);
            done();
        });
    });
    
    
    
    QUnit.test('multipleTimeslotStockTracker getTotalMoney,getTotalProfit', function(assert) {
        var done1 = assert.async();
        var done2 = assert.async();
        
        var stock = new multipleTimeslotStockTracker('AAPL');
    
        stock.buy(5, new Date('2016-1-4'));
        stock.buy(9, new Date('2016-5-2'));
        stock.buy(3, new Date('2016-6-2'));
        
        stock.sell(3, new Date('2016-7-25'));
    
    
        stock.getTotalMoney(function(money) {
            assert.equal(money, 1617.98);
            done1();
        });
        
        stock.getTotalProfit(function(profit) {
            assert.equal(profit, 271.36);
            done2();
        });
    });
    
    
    
    QUnit.test('singeTimeslotStockTracker', function(assert) {
        var s = new singleTimeslotStockTracker(10, 'aapl', new Date('2016-1-4'));
    
        assert.equal(JSON.stringify(s.getDate()), '\"2016-01-04T08:00:00.000Z\"');
        assert.equal(s.getAmount(), 10);
        assert.equal(s.getTicker(), 'aapl');
    });
    
    
    
    QUnit.skip('Util getTickerFromName', function(assert) {
        console.log(Util.getTickerFromName('apple'));
        
        assert.equal(Util.getTickerFromName('microsoft'), 10);
    });
});




QUnit.module('Portfolio', function() {
    QUnit.test('buy', function(assert) {
        var p = new Portfolio(10000);
        
        p.buy('aapl', 10, new Date('2016-1-4'));
        p.buy('aapl', 20, new Date('2016-5-2'));
        p.buy('aapl', 10, new Date('2016-6-2'));
        
        p.sell('aapl', 15, new Date('2016-7-25'));
        
        
        Util.wait(function() {
            console.log(p.getCash());
        }, 1);
    });
});
