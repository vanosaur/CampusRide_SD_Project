"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinMessage = exports.sendMessage = exports.getMessages = void 0;
const ChatService_1 = require("../services/ChatService");
const getMessages = async (req, res) => {
    try {
        const messages = await ChatService_1.ChatService.getMessages(req.params.rideId);
        res.status(200).json({ messages });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMessages = getMessages;
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const message = await ChatService_1.ChatService.sendMessage(req.params.rideId, senderId, req.body.content);
        res.status(201).json({ message });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.sendMessage = sendMessage;
const pinMessage = async (req, res) => {
    try {
        const message = await ChatService_1.ChatService.pinMessage(req.params.messageId);
        res.status(200).json({ message });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.pinMessage = pinMessage;
