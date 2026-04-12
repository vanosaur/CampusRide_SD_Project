// import api from './axios'
import { Notification } from '../types';

export interface NotificationsResponse {
  data: {
    notifications?: Notification[];
    message?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'u1',
    type: 'SUCCESS',
    message: 'Your ride request to Terminal 3 has been accepted!',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    userId: 'u1',
    type: 'WARNING',
    message: 'Fare update: Ride to New Delhi Station is now ₹180 per person.',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const getNotifications = (): Promise<NotificationsResponse> => {
  console.log('Mock Get Notifications');
  return Promise.resolve({ data: { notifications: mockNotifications } });
};

export const markAllRead = (): Promise<NotificationsResponse> => {
  console.log('Mock Mark All Read');
  return Promise.resolve({ data: { message: 'All notifications marked as read' } });
};
