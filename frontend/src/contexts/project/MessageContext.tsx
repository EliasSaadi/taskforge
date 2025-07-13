import React, { createContext, useContext, useState, useCallback } from 'react';
import { messageService } from '@/services/project/messageService';
import type { MessageComplet } from '@/interfaces';

interface MessageContextType {
  messages: MessageComplet[];
  loading: boolean;
  error: string | null;
  loadMessages: (projectId: number) => Promise<void>;
  sendMessage: (projectId: number, contenu: string) => Promise<void>;
  updateMessage: (messageId: number, contenu: string) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface MessageProviderProps {
  children: React.ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<MessageComplet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async (projectId: number) => {
    try {
      setLoading(true);
      setError(null);
      const projectMessages = await messageService.getProjectMessages(projectId);
      setMessages(projectMessages);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors du chargement des messages';
      setError(message);
      console.error('Erreur dans MessageContext:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (projectId: number, contenu: string) => {
    try {
      setError(null);
      const newMessage = await messageService.sendMessage(projectId, contenu);
      setMessages(prev => [...prev, newMessage]);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de l\'envoi du message';
      setError(message);
      throw err;
    }
  }, []);

  const updateMessage = useCallback(async (messageId: number, contenu: string) => {
    try {
      setError(null);
      const updatedMessage = await messageService.updateMessage(messageId, contenu);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? updatedMessage : msg
      ));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la modification du message';
      setError(message);
      throw err;
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: number) => {
    try {
      setError(null);
      await messageService.deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la suppression du message';
      setError(message);
      throw err;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <MessageContext.Provider value={{
      messages,
      loading,
      error,
      loadMessages,
      sendMessage,
      updateMessage,
      deleteMessage,
      clearMessages,
      clearError
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
