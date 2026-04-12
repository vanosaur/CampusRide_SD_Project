export class FareSplitter {
  public static calculate(totalFare: number, count: number): number {
    if (count <= 0) return totalFare;
    return this.roundToNearest(totalFare / count);
  }

  public static recalculate(totalFare: number, count: number): number {
    return this.calculate(totalFare, count);
  }

  private static roundToNearest(val: number): number {
    return Math.round(val * 100) / 100;
  }
}
