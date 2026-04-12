import { IRide } from '../models/Ride';

export interface RideFilter {
  apply(rides: IRide[]): IRide[];
}

export class DestinationFilter implements RideFilter {
  private destination: string;

  constructor(destination: string) {
    this.destination = destination.toLowerCase();
  }

  public apply(rides: IRide[]): IRide[] {
    if (!this.destination) return rides;
    return rides.filter(r => r.destination.toLowerCase().includes(this.destination));
  }
}

export class DateFilter implements RideFilter {
  private date: string;

  constructor(date: string) {
    this.date = date;
  }

  public apply(rides: IRide[]): IRide[] {
    if (!this.date) return rides;
    return rides.filter(r => r.date === this.date);
  }
}
