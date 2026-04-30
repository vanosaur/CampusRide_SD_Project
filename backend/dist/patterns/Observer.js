"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideEvents = exports.RideEventEmitter = void 0;
const events_1 = require("events");
class RideEventEngine extends events_1.EventEmitter {
}
exports.RideEventEmitter = new RideEventEngine();
var RideEvents;
(function (RideEvents) {
    RideEvents["JOINED"] = "RIDE_JOINED";
    RideEvents["CONFIRMED"] = "RIDE_CONFIRMED";
    RideEvents["CANCELLED"] = "RIDE_CANCELLED";
    RideEvents["REQUEST_ACCEPTED"] = "RIDE_REQUEST_ACCEPTED";
    RideEvents["REQUEST_REJECTED"] = "RIDE_REQUEST_REJECTED";
})(RideEvents || (exports.RideEvents = RideEvents = {}));
