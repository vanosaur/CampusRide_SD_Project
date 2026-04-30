import { Ride } from '../types';

export interface RideFilter {
  apply(rides: Ride[]): Ride[];
}

export class DestinationFilter implements RideFilter {
  private destination: string;

  constructor(destination: string) {
    this.destination = destination;
  }

  public apply(rides: Ride[]): Ride[] {
    if (this.destination === 'All Rides') return rides;
    return rides.filter(ride => ride.destination === this.destination);
  }
}

export class DateFilter implements RideFilter {
  private date: string;

  constructor(date: string) {
    this.date = date;
  }

  public apply(rides: Ride[]): Ride[] {
    // Simple mock logic: check if ride date matches
    return rides.filter(ride => ride.date === this.date);
  }
}
