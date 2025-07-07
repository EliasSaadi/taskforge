import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface NotificationData {
  id: string;
  type: 'success' | 'error';
  message: string;
  title?: string;
}

interface NotificationContextType {
  /** Afficher une notification de succès */
  showSuccess: (message: string, title?: string) => void;
  /** Afficher une notification d'erreur */
  showError: (message: string, title?: string) => void;
  /** Fermer une notification par son ID */
  closeNotification: (id: string) => void;
  /** Liste des notifications actives */
  notifications: NotificationData[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * Provider pour gérer les notifications dans toute l'application
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  /**
   * Générer un ID unique pour une notification
   */
  const generateId = () => Date.now().toString();

  /**
   * Ajouter une notification
   */
  const addNotification = (type: 'success' | 'error', message: string, title?: string) => {
    const id = generateId();
    const notification: NotificationData = { id, type, message, title };
    
    setNotifications(prev => [...prev, notification]);

    // Auto-fermeture après 5 secondes
    setTimeout(() => {
      closeNotification(id);
    }, 5000);
  };

  /**
   * Afficher une notification de succès
   */
  const showSuccess = (message: string, title?: string) => {
    addNotification('success', message, title);
  };

  /**
   * Afficher une notification d'erreur
   */
  const showError = (message: string, title?: string) => {
    addNotification('error', message, title);
  };

  /**
   * Fermer une notification
   */
  const closeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const value: NotificationContextType = {
    showSuccess,
    showError,
    closeNotification,
    notifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte de notification
 */
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification doit être utilisé dans un NotificationProvider');
  }
  return context;
};

export default NotificationProvider;
