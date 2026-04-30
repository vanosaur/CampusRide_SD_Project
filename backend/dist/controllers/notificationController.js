"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllRead = exports.getNotifications = void 0;
const NotificationService_1 = require("../services/NotificationService");
const Notification_1 = require("../models/Notification");
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification_1.Notification.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getNotifications = getNotifications;
const markAllRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await NotificationService_1.NotificationService.markAllRead(userId);
        res.status(200).json({ message: 'All notifications marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.markAllRead = markAllRead;
