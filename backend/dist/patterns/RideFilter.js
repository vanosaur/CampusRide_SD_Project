"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusFilter = exports.GenderPreferenceFilter = exports.TimeRangeFilter = exports.DateFilter = exports.DestinationFilter = void 0;
const Ride_1 = require("../models/Ride");
// ─────────────────────────────────────────────────────────────────────────────
//  Existing Filters
// ─────────────────────────────────────────────────────────────────────────────
class DestinationFilter {
    constructor(destination) {
        this.destination = destination.toLowerCase();
    }
    apply(rides) {
        if (!this.destination)
            return rides;
        return rides.filter(r => r.destination.toLowerCase().includes(this.destination));
    }
}
exports.DestinationFilter = DestinationFilter;
class DateFilter {
    constructor(date) {
        this.date = date;
    }
    apply(rides) {
        if (!this.date)
            return rides;
        return rides.filter(r => r.date === this.date);
    }
}
exports.DateFilter = DateFilter;
// ─────────────────────────────────────────────────────────────────────────────
//  New Filters
// ─────────────────────────────────────────────────────────────────────────────
/**
 * TimeRangeFilter
 * Filters rides whose departureTime falls within [timeFrom, timeTo] (HH:MM, 24h).
 * Both bounds are inclusive. Either bound is optional.
 */
class TimeRangeFilter {
    constructor(timeFrom, timeTo) {
        this.timeFrom = timeFrom ? TimeRangeFilter.toMinutes(timeFrom) : undefined;
        this.timeTo = timeTo ? TimeRangeFilter.toMinutes(timeTo) : undefined;
    }
    static toMinutes(hhmm) {
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
    }
    apply(rides) {
        if (this.timeFrom === undefined && this.timeTo === undefined)
            return rides;
        return rides.filter(ride => {
            const dep = new Date(ride.departureTime);
            const rideMinutes = dep.getHours() * 60 + dep.getMinutes();
            if (this.timeFrom !== undefined && rideMinutes < this.timeFrom)
                return false;
            if (this.timeTo !== undefined && rideMinutes > this.timeTo)
                return false;
            return true;
        });
    }
}
exports.TimeRangeFilter = TimeRangeFilter;
/**
 * GenderPreferenceFilter
 * Keeps rides that are either open to ANY or match the requested preference.
 */
class GenderPreferenceFilter {
    constructor(preference) {
        this.preference = preference;
    }
    apply(rides) {
        if (!this.preference || this.preference === Ride_1.GenderPreference.ANY)
            return rides;
        return rides.filter(r => r.genderPreference === Ride_1.GenderPreference.ANY || r.genderPreference === this.preference);
    }
}
exports.GenderPreferenceFilter = GenderPreferenceFilter;
/**
 * StatusFilter
 * Filters rides by their status (OPEN, FULL, CONFIRMED, COMPLETED, CANCELLED).
 * Overrides the default OPEN-only query when explicitly provided.
 */
class StatusFilter {
    constructor(status) {
        this.status = status.toUpperCase();
    }
    apply(rides) {
        if (!this.status)
            return rides;
        return rides.filter(r => r.status === this.status);
    }
}
exports.StatusFilter = StatusFilter;
