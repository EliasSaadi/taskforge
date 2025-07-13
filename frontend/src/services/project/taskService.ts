import api from '../api';
import type { TacheComplete } from '@/interfaces';

/**
 * Service pour la gestion des tâches
 */
export const taskService = {
  /**
   * Récupérer les tâches d'un projet
   */
  getProjectTasks: async (projectId: number): Promise<TacheComplete[]> => {
    try {
      const response = await api.get(`/api/projects/${projectId}/tasks`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des tâches du projet ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Créer une nouvelle tâche
   */
  createTask: async (taskData: Partial<TacheComplete>): Promise<TacheComplete> => {
    try {
      const response = await api.post('/api/tasks', taskData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une tâche
   */
  updateTask: async (taskId: number, taskData: Partial<TacheComplete>): Promise<TacheComplete> => {
    try {
      const response = await api.put(`/api/tasks/${taskId}`, taskData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la tâche ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Supprimer une tâche
   */
  deleteTask: async (taskId: number): Promise<void> => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la tâche ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Mettre à jour le statut d'une tâche
   */
  updateTaskStatus: async (taskId: number, status: 'à faire' | 'en cours' | 'terminé'): Promise<TacheComplete> => {
    try {
      const response = await api.patch(`/api/tasks/${taskId}/status`, { statut: status });
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de la tâche ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Assigner un utilisateur à une tâche
   */
  assignUserToTask: async (taskId: number, userId: number): Promise<void> => {
    try {
      await api.post(`/api/tasks/${taskId}/assign/${userId}`);
    } catch (error) {
      console.error(`Erreur lors de l'assignation de l'utilisateur ${userId} à la tâche ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Désassigner un utilisateur d'une tâche
   */
  unassignUserFromTask: async (taskId: number, userId: number): Promise<void> => {
    try {
      await api.delete(`/api/tasks/${taskId}/unassign/${userId}`);
    } catch (error) {
      console.error(`Erreur lors de la désassignation de l'utilisateur ${userId} de la tâche ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Récupérer les utilisateurs assignés à une tâche
   */
  getTaskUsers: async (taskId: number): Promise<Array<{ id: number; prenom: string; nom: string }>> => {
    try {
      const response = await api.get(`/api/tasks/${taskId}/users`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des utilisateurs de la tâche ${taskId}:`, error);
      throw error;
    }
  }
};

export default taskService;
