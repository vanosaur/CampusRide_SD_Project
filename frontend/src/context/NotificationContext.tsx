import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useSocketContext } from './SocketContext';
import { getNotifications, markAllRead as apiMarkAllRead } from '../api/notifications';
import { useAuth } from './AuthContext';
import { Notification } from '../types';

interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  markAllRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocketContext();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      getNotifications().then(res => {
        const notifs = res.data.notifications || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.isRead).length);
      }).catch(err => console.error("Error fetching notifications", err));
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('new_notification', (data: Notification) => {
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        socket.off('new_notification');
      };
    }
  }, [socket]);

  const markAllRead = async () => {
    try {
      await apiMarkAllRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, notifications, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
