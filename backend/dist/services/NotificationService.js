"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const NotificationFactory_1 = require("../patterns/NotificationFactory");
const SocketManager_1 = require("../patterns/SocketManager");
const Notification_1 = require("../models/Notification");
class NotificationService {
    static async notify(type, payload) {
        const notificationObj = NotificationFactory_1.NotificationFactory.create(type, payload);
        const dbNotification = await notificationObj.send();
        // Emit real-time notification to the target user via SocketManager
        SocketManager_1.SocketManager.getInstance().emitToRoom(`user_${payload.userId}`, 'newNotification', dbNotification);
    }
    static async markAllRead(userId) {
        await Notification_1.Notification.updateMany({ userId, isRead: false }, { isRead: true });
    }
    static async getUnread(userId) {
        return Notification_1.Notification.find({ userId, isRead: false }).sort({ createdAt: -1 });
    }
}
exports.NotificationService = NotificationService;
