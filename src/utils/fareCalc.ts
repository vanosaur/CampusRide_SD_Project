/**
 * Calculates the fare per person
 * @param totalFare The total fare of the cab
 * @param occupantCount Total number of people sharing the cab (including host)
 */
export const calculateFareSplit = (totalFare: number, occupantCount: number): number => {
  if (!totalFare || occupantCount <= 0) return 0;
  return Math.ceil(totalFare / occupantCount);
};
