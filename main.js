/* global StockTracker */
/* global multipleTimeslotStockTracker */
/* global Portfolio */
/* global Util */
/* global PreUtil */
/* global MAPattern */



PreUtil.loadAll();


function uno() {
    var portfolio = new Portfolio(10000);

    var stock = new StockTracker(1, 'AAPL', new Date('2016-01-01'));
    stock.getStockAmountEarned((total) => {
        console.log('amount earned ' + total);
    });

    stock.getInitialStockTotal((total) => {
        console.log('initial stock total ' + total);
    });

    stock.getCurrentStockTotal((total) => {
        console.log('current stock total ' + total);
    });

    portfolio.addStockTracker(stock);



    Util.drawChart(new Date('2016-01-01'), new Date('2016-9-3'), 'AAPL', Util.TYPES().CLOSE);
}




function dos() {
    var stock = new multipleTimeslotStockTracker('AAPL');

    stock.buy(5, new Date('2016-1-4')).then((price) => {
        console.log('Paying: $' + price + ' for 5 AAPL stocks on 1/4/2016');
    });

    stock.buy(5, new Date('2016-5-2')).then((price) => {
        console.log('Paying: $' + price + ' for 5 AAPL stocks on 5/2/2016');
    });


    // Util.getStockPriceFromTimestamp(new Date('2016-1-4'), stock.getTicker()).then((price) => {
    //     console.log('AAPL stocks cost: $' + price + ' on 1/4/2016');
    // });

    // Util.getStockPriceFromTimestamp(new Date('2016-5-2'), stock.getTicker()).then((price) => {
    //     console.log('AAPL stocks cost: $' + price + ' on 5/2/2016');
    // });

    // Util.getStockPriceFromTimestamp(new Date('2016-7-25'), stock.getTicker()).then((price) => {
    //     console.log('AAPL stocks cost: $' + price + ' on 7/25/2016');
    // });


    stock.sell(6, new Date('2016-7-25')).then((profit) => {
        console.log('Profit: $' + profit);
    });
}


function tres() {
    Util.getStockOHLCAndTimestamp(new Date('2016-1-4'), new Date('2016-1-9'), 'aapl')
}


function cuatro() {
    var sma30 = new MAPattern(50, 0.1);

    sma30.apply('aapl', new Date('2016-7-18')).then((decider) => {
        console.log(decider);
    });
}


// uno();
// dos();
// tres();
cuatro();
