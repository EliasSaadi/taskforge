import api from '../api';
import type { MessageComplet } from '@/interfaces';

/**
 * Service pour la gestion des messages des projets
 */
export const messageService = {
  /**
   * Récupérer les messages d'un projet
   */
  getProjectMessages: async (projectId: number): Promise<MessageComplet[]> => {
    try {
      const response = await api.get(`/api/projects/${projectId}/messages`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des messages du projet ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Envoyer un message dans un projet
   */
  sendMessage: async (projectId: number, contenu: string): Promise<MessageComplet> => {
    try {
      const response = await api.post(`/api/projects/${projectId}/messages`, {
        contenu
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de l'envoi du message dans le projet ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Supprimer un message
   */
  deleteMessage: async (messageId: number): Promise<void> => {
    try {
      await api.delete(`/api/messages/${messageId}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du message ${messageId}:`, error);
      throw error;
    }
  },

  /**
   * Modifier un message
   */
  updateMessage: async (messageId: number, contenu: string): Promise<MessageComplet> => {
    try {
      const response = await api.put(`/api/messages/${messageId}`, {
        contenu
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la modification du message ${messageId}:`, error);
      throw error;
    }
  },

  /**
   * Récupérer les réponses à un message
   */
  getMessageReplies: async (messageId: number): Promise<MessageComplet[]> => {
    try {
      const response = await api.get(`/api/messages/${messageId}/replies`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des réponses au message ${messageId}:`, error);
      throw error;
    }
  }
};

export default messageService;
