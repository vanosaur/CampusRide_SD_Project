"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FareSplitter = void 0;
class FareSplitter {
    static calculate(totalFare, count) {
        if (count <= 0)
            return totalFare;
        return this.roundToNearest(totalFare / count);
    }
    static recalculate(totalFare, count) {
        return this.calculate(totalFare, count);
    }
    static roundToNearest(val) {
        return Math.round(val * 100) / 100;
    }
}
exports.FareSplitter = FareSplitter;
