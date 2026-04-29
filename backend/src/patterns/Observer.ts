import { EventEmitter } from 'events';

class RideEventEngine extends EventEmitter {}

export const RideEventEmitter = new RideEventEngine();

export enum RideEvents {
  JOINED = 'RIDE_JOINED',
  CONFIRMED = 'RIDE_CONFIRMED',
  CANCELLED = 'RIDE_CANCELLED',
  REQUEST_ACCEPTED = 'RIDE_REQUEST_ACCEPTED',
  REQUEST_REJECTED = 'RIDE_REQUEST_REJECTED'
}
