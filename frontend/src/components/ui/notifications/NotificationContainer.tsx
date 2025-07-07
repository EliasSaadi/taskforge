import React from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { Notification } from './Notification';

/**
 * Conteneur pour afficher toutes les notifications actives
 */
export const NotificationContainer: React.FC = () => {
  const { notifications, closeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          title={notification.title}
          onClose={() => closeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
