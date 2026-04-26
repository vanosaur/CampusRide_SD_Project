import { IRide, GenderPreference } from '../models/Ride';

// ─────────────────────────────────────────────────────────────────────────────
//  Strategy Interface
// ─────────────────────────────────────────────────────────────────────────────

export interface RideFilter {
  apply(rides: IRide[]): IRide[];
}

// ─────────────────────────────────────────────────────────────────────────────
//  Existing Filters
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
//  New Filters
// ─────────────────────────────────────────────────────────────────────────────

/**
 * TimeRangeFilter
 * Filters rides whose departureTime falls within [timeFrom, timeTo] (HH:MM, 24h).
 * Both bounds are inclusive. Either bound is optional.
 */
export class TimeRangeFilter implements RideFilter {
  private timeFrom?: number; // minutes since midnight
  private timeTo?: number;

  constructor(timeFrom?: string, timeTo?: string) {
    this.timeFrom = timeFrom ? TimeRangeFilter.toMinutes(timeFrom) : undefined;
    this.timeTo   = timeTo   ? TimeRangeFilter.toMinutes(timeTo)   : undefined;
  }

  private static toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }

  public apply(rides: IRide[]): IRide[] {
    if (this.timeFrom === undefined && this.timeTo === undefined) return rides;

    return rides.filter(ride => {
      const dep = new Date(ride.departureTime);
      const rideMinutes = dep.getHours() * 60 + dep.getMinutes();

      if (this.timeFrom !== undefined && rideMinutes < this.timeFrom) return false;
      if (this.timeTo   !== undefined && rideMinutes > this.timeTo)   return false;
      return true;
    });
  }
}

/**
 * GenderPreferenceFilter
 * Keeps rides that are either open to ANY or match the requested preference.
 */
export class GenderPreferenceFilter implements RideFilter {
  private preference: GenderPreference;

  constructor(preference: string) {
    this.preference = preference as GenderPreference;
  }

  public apply(rides: IRide[]): IRide[] {
    if (!this.preference || this.preference === GenderPreference.ANY) return rides;
    return rides.filter(
      r => r.genderPreference === GenderPreference.ANY || r.genderPreference === this.preference
    );
  }
}

/**
 * StatusFilter
 * Filters rides by their status (OPEN, FULL, CONFIRMED, COMPLETED, CANCELLED).
 * Overrides the default OPEN-only query when explicitly provided.
 */
export class StatusFilter implements RideFilter {
  private status: string;

  constructor(status: string) {
    this.status = status.toUpperCase();
  }

  public apply(rides: IRide[]): IRide[] {
    if (!this.status) return rides;
    return rides.filter(r => r.status === this.status);
  }
}
