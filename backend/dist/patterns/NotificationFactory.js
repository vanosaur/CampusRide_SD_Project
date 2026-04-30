"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationFactory = exports.RideFullNotification = exports.RideRequestNotification = exports.RideCancelledNotification = exports.RideConfirmedNotification = exports.RideJoinedNotification = exports.BaseNotification = void 0;
const Notification_1 = require("../models/Notification");
class BaseNotification {
    constructor(userId, relatedRideId) {
        this.userId = userId;
        this.relatedRideId = relatedRideId;
    }
}
exports.BaseNotification = BaseNotification;
class RideJoinedNotification extends BaseNotification {
    constructor(userId, rideName, relatedRideId) {
        super(userId, relatedRideId);
        this.rideName = rideName;
    }
    async send() {
        return Notification_1.Notification.create({
            userId: this.userId,
            type: Notification_1.NotificationType.INFO,
            message: `You successfully joined the ride to ${this.rideName}.`,
            relatedRideId: this.relatedRideId
        });
    }
}
exports.RideJoinedNotification = RideJoinedNotification;
class RideConfirmedNotification extends BaseNotification {
    constructor(userId, destination, relatedRideId) {
        super(userId, relatedRideId);
        this.destination = destination;
    }
    async send() {
        return Notification_1.Notification.create({
            userId: this.userId,
            type: Notification_1.NotificationType.SUCCESS,
            message: `Your ride to ${this.destination} has been confirmed!`,
            relatedRideId: this.relatedRideId
        });
    }
}
exports.RideConfirmedNotification = RideConfirmedNotification;
class RideCancelledNotification extends BaseNotification {
    constructor(userId, reason, relatedRideId) {
        super(userId, relatedRideId);
        this.reason = reason;
    }
    async send() {
        return Notification_1.Notification.create({
            userId: this.userId,
            type: Notification_1.NotificationType.WARNING,
            message: `Ride cancelled: ${this.reason}`,
            relatedRideId: this.relatedRideId
        });
    }
}
exports.RideCancelledNotification = RideCancelledNotification;
class RideRequestNotification extends BaseNotification {
    constructor(userId, rideName, status, relatedRideId) {
        super(userId, relatedRideId);
        this.rideName = rideName;
        this.status = status;
    }
    async send() {
        return Notification_1.Notification.create({
            userId: this.userId,
            type: this.status === 'ACCEPTED' ? Notification_1.NotificationType.SUCCESS : Notification_1.NotificationType.WARNING,
            message: `Your request to join the ride to ${this.rideName} was ${this.status.toLowerCase()}.`,
            relatedRideId: this.relatedRideId
        });
    }
}
exports.RideRequestNotification = RideRequestNotification;
class RideFullNotification extends BaseNotification {
    constructor(userId, rideName, relatedRideId) {
        super(userId, relatedRideId);
        this.rideName = rideName;
    }
    async send() {
        return Notification_1.Notification.create({
            userId: this.userId,
            type: Notification_1.NotificationType.WARNING,
            message: `The ride to ${this.rideName} is now FULL!`,
            relatedRideId: this.relatedRideId
        });
    }
}
exports.RideFullNotification = RideFullNotification;
class NotificationFactory {
    static create(type, payload) {
        if (type === 'JOINED') {
            return new RideJoinedNotification(payload.userId, payload.rideName, payload.relatedRideId);
        }
        else if (type === 'CONFIRMED') {
            return new RideConfirmedNotification(payload.userId, payload.rideName || payload.destination, payload.relatedRideId);
        }
        else if (type === 'CANCELLED') {
            return new RideCancelledNotification(payload.userId, payload.reason, payload.relatedRideId);
        }
        else if (type === 'ACCEPTED' || type === 'REJECTED') {
            return new RideRequestNotification(payload.userId, payload.rideName, type, payload.relatedRideId);
        }
        else if (type === 'FULL') {
            return new RideFullNotification(payload.userId, payload.rideName, payload.relatedRideId);
        }
        throw new Error('Unknown notification type');
    }
}
exports.NotificationFactory = NotificationFactory;
