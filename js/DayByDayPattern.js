/* global Util */
/* global OHLC */




class PatternDatabase {
    static setup() {
        this.patterns = [];

        // harami +
        this.patterns.push(new Pattern(Pattern.TRENDS().bear, (dayOne, dayTwo) => {
            return  !dayOne.isUpDay() &&                            // first day down
                    dayTwo.isUpDay() &&                             // second day up
                    dayOne.getBodyLength() > dayTwo.getBodyLength;  // first day "engulfs" the second day
        }));
    }
}




class Pattern {
    constructor(requiredTrend, matchDays) {
        this.trend = requiredTrend;
        this.matchDays = matchDays;
    }



    static TRENDS() {
        return {
            'bull': 1,
            'bear': -1,
            'neutral': 0,
            'none': null
        };
    }



    match(dayRange) {
        // 7 day dayRange from old to new
        if (this.trend === this.getTrend(dayRange.slice(0, 5))) {
            // trend matches

            // do the days match?
            return this.matchDays(new Pattern(dayRange[5]), new Pattern(dayRange[6]));
        }
    }



    getTrend(dayRange) {
        // 5 day dayRange

        // if last day open > first day open
        if (dayRange[4][0] > dayRange[0][0]) {
            return Pattern.TRENDS().bull;
        }
        // if last day open < first day open
        if (dayRange[4][0] > dayRange[0][0]) {
            return Pattern.TRENDS().bear;
        }
        // if abs(last day body + first day body) * 2 < abs(last day open - first day open)
        if (Math.abs((dayRange[4][0] - dayRange[4][3]) + (dayRange[0][0] - dayRange[0][3])) * 2 < Math.abs(dayRange[4][0] - dayRange[0][0]) ) {
            return Pattern.TRENDS().none;
        }

        return Pattern.TRENDS().none;
    }
}




class PatternLookup {
    static lookupPattern(pattern, begin, end, ticker) {
        if (!pattern instanceof Pattern) return;

        Util.getStockOHLCFromTimeRange(this.begin, this.end, this.ticker).then((ohlc) => {

        });
    }

}
