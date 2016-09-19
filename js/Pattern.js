/* global Util */




class PatternDatabase {
    
}



class Pattern {
    
}




class PatternLookup {
    static setTargetTimeAndTicker(begin, end, ticker) {
        this.begin = begin;
        this.end = end;
        this.ticker = ticker;
    }
    
    
    static recognizePattern(pattern) {
        if (!pattern instanceof Pattern) return;
        
        Util.getStockOHLCFromTimeRange(this.begin, this.end, this.ticker, function() {
            
        });
    }
    
}