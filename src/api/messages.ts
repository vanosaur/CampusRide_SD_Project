// import api from './axios'
import { Message, User } from '../types';

export interface MessagesResponse {
  data: {
    messages?: Message[];
    message?: Message | string;
  };
}

const mockUser = (id: string, name: string): User => ({
  id,
  name,
  email: `${name.toLowerCase().replace(' ', '.')}@university.edu`,
  isVerified: true,
  createdAt: new Date().toISOString()
});

const mockMessages: Message[] = [
  {
    id: '1',
    rideId: '1',
    senderId: 'rahul1',
    sender: mockUser('rahul1', 'Rahul S.'),
    content: "Hey everyone! I'll be driving a white Swift (TS 08 AB 1234). Just parked near the pharmacy.",
    isPinned: false,
    sentAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    rideId: '1',
    senderId: 'u1',
    sender: mockUser('u1', 'Priya Sharma'),
    content: "Perfect! I'm just leaving the lab, should be there in 5 minutes.",
    isPinned: false,
    sentAt: new Date(Date.now() - 3000000).toISOString()
  }
];

export const getMessages = (rideId: string): Promise<MessagesResponse> => {
  console.log('Mock Get Messages:', rideId);
  return Promise.resolve({ data: { messages: mockMessages } });
};

export const sendMessage = (rideId: string, data: { content: string }): Promise<MessagesResponse> => {
  console.log('Mock Send Message:', rideId, data);
  const newMessage: Message = {
    id: Date.now().toString(),
    rideId,
    senderId: 'u1',
    sender: mockUser('u1', 'Priya Sharma'),
    content: data.content,
    isPinned: false,
    sentAt: new Date().toISOString()
  };
  return Promise.resolve({ data: { message: newMessage } });
};

export const pinMessage = (rideId: string, messageId: string): Promise<MessagesResponse> => {
  console.log('Mock Pin Message:', rideId, messageId);
  return Promise.resolve({ data: { message: 'Message pinned' } });
};
