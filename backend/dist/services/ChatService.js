"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const Message_1 = require("../models/Message");
const SocketManager_1 = require("../patterns/SocketManager");
class ChatService {
    static async getMessages(rideId) {
        return Message_1.Message.find({ rideId }).populate('senderId', 'name profilePhoto').sort({ sentAt: 1 });
    }
    static async sendMessage(rideId, senderId, content) {
        let message = await Message_1.Message.create({
            rideId,
            senderId,
            content
        });
        message = await message.populate('senderId', 'name profilePhoto');
        // Emit message to everyone in the ride chat room
        SocketManager_1.SocketManager.getInstance().emitToRoom(`ride_${rideId}`, 'newMessage', message);
        return message;
    }
    static async pinMessage(messageId) {
        const message = await Message_1.Message.findByIdAndUpdate(messageId, { isPinned: true }, { new: true });
        if (message) {
            SocketManager_1.SocketManager.getInstance().emitToRoom(`ride_${message.rideId}`, 'messagePinned', message);
        }
        return message;
    }
}
exports.ChatService = ChatService;
