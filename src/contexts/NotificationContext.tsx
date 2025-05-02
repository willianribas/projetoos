
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the notification type
export interface CustomNotification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: CustomNotification[];
  addNotification: (title: string, description: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<CustomNotification[]>(() => {
    // Load from localStorage on initial render
    const savedNotifications = localStorage.getItem('customNotifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('customNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (title: string, description: string) => {
    const newNotification: CustomNotification = {
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date().toISOString(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
