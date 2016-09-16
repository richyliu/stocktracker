/* global StockTracker */
/* global multipleTimeslotStockTracker */
/* global Portfolio */
/* global Util */
/* global PreUtil */



PreUtil.loadAll();


function main() {
    var portfolio = new Portfolio(10000);
    
    var stock = new StockTracker(1, 'AAPL', new Date('2016-01-01'));
    stock.getStockAmountEarned(function(total) {
        console.log('amount earned ' + total);
    });
    
    stock.getInitialStockTotal(function(total) {
        console.log('initial stock total ' + total);
    });
    
    stock.getCurrentStockTotal(function(total) {
        console.log('current stock total ' + total);
    });
    
    portfolio.addStockTracker(stock);
    
    
    
    Util.drawChart(new Date('2016-01-01'), new Date('2016-9-3'), 'AAPL', Util.TYPES().CLOSE);
}




function another() {
    var stock = new multipleTimeslotStockTracker('AAPL');
    
    stock.buy(5, new Date('2016-1-4'), function(price) {
        console.log('Paying: $' + price + ' for 5 AAPL stocks on 1/4/2016');
    });
    
    stock.buy(5, new Date('2016-5-2'), function(price) {
        console.log('Paying: $' + price + ' for 5 AAPL stocks on 5/2/2016');
    });
    
    
    // Util.getStockPriceFromTimestamp(new Date('2016-1-4'), stock.getTicker(), function(price) {
    //     console.log('AAPL stocks cost: $' + price + ' on 1/4/2016');
    // });
    
    // Util.getStockPriceFromTimestamp(new Date('2016-5-2'), stock.getTicker(), function(price) {
    //     console.log('AAPL stocks cost: $' + price + ' on 5/2/2016');
    // });
    
    // Util.getStockPriceFromTimestamp(new Date('2016-7-25'), stock.getTicker(), function(price) {
    //     console.log('AAPL stocks cost: $' + price + ' on 7/25/2016');
    // });
    
    
    stock.sell(6, new Date('2016-7-25'), function(profit) {
        console.log('Profit: $' + profit);
    });
}



// main();
// test();
// another();