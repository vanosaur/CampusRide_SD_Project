import api from './axios';
import { Notification } from '../types';

export interface NotificationsResponse {
  data: {
    notifications?: Notification[];
    message?: string;
  };
}

export const getNotifications = (): Promise<NotificationsResponse> => {
  return api.get('/notifications');
};

export const markAllRead = (): Promise<NotificationsResponse> => {
  return api.put('/notifications/mark-read');
};
