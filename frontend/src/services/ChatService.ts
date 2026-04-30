import { Message, User } from '../types';

export interface ChatResponse {
  data: {
    messages?: Message[];
    message?: Message;
    status?: string;
  };
}

const mockUser = (id: string, name: string): User => ({
  id,
  name,
  email: `${name.toLowerCase().replace(' ', '.')}@university.edu`,
  isVerified: true,
  createdAt: new Date().toISOString()
});

class ChatService {
  private messages: Message[] = [];

  public async getMessages(rideId: string): Promise<ChatResponse> {
    console.log('ChatService.getMessages:', rideId);
    return { data: { messages: this.messages.filter(m => m.rideId === rideId) } };
  }

  public async sendMessage(rideId: string, userId: string, txt: string): Promise<ChatResponse> {
    console.log('ChatService.sendMessage:', rideId, userId, txt);
    const newMessage: Message = {
      id: Date.now().toString(),
      rideId,
      senderId: userId,
      sender: mockUser(userId, 'User'),
      content: txt,
      isPinned: false,
      sentAt: new Date().toISOString()
    };
    this.messages.push(newMessage);
    return { data: { message: newMessage } };
  }

  public async pinMessage(messageId: string): Promise<ChatResponse> {
    console.log('ChatService.pinMessage:', messageId);
    const msg = this.messages.find(m => m.id === messageId);
    if (msg) msg.isPinned = true;
    return { data: { status: 'success' } };
  }
}

export const chatService = new ChatService();
export default ChatService;
