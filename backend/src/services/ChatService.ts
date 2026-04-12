import { Message, IMessage } from '../models/Message';
import { SocketManager } from '../patterns/SocketManager';
import mongoose from 'mongoose';

export class ChatService {
  public static async getMessages(rideId: mongoose.Types.ObjectId) {
    return Message.find({ rideId }).populate('senderId', 'name profilePhoto').sort({ sentAt: 1 });
  }

  public static async sendMessage(rideId: mongoose.Types.ObjectId, senderId: mongoose.Types.ObjectId, content: string): Promise<IMessage> {
    let message = await Message.create({
      rideId,
      senderId,
      content
    });

    message = await message.populate('senderId', 'name profilePhoto');
    
    // Emit message to everyone in the ride chat room
    SocketManager.getInstance().emitToRoom(`ride_${rideId}`, 'newMessage', message);
    return message;
  }

  public static async pinMessage(messageId: mongoose.Types.ObjectId): Promise<IMessage | null> {
    const message = await Message.findByIdAndUpdate(messageId, { isPinned: true }, { new: true });
    if (message) {
      SocketManager.getInstance().emitToRoom(`ride_${message.rideId}`, 'messagePinned', message);
    }
    return message;
  }
}
