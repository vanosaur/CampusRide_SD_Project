import api from './axios';
import { Message } from '../types';

export interface MessagesResponse {
  data: {
    messages?: Message[];
    message?: Message | string;
  };
}

export const getMessages = (rideId: string): Promise<MessagesResponse> => {
  return api.get(`/rides/${rideId}/messages`);
};

export const sendMessage = (rideId: string, data: { content: string }): Promise<MessagesResponse> => {
  return api.post(`/rides/${rideId}/messages`, data);
};

export const pinMessage = (rideId: string, messageId: string): Promise<MessagesResponse> => {
  return api.put(`/rides/messages/${messageId}/pin`);
};
