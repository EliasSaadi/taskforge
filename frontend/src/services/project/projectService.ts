import api from '../api';
import type { Projet, ProjetComplet } from '@/interfaces';

/**
 * Service pour la gestion des projets
 */
export const projectService = {
  /**
   * Récupérer tous les projets de l'utilisateur connecté
   * (projets où l'utilisateur est membre ou chef de projet)
   */
  getUserProjects: async (): Promise<Projet[]> => {
    try {
      const response = await api.get('/api/my-projects');
      return response.data?.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      throw error;
    }
  },

  /**
   * Récupérer un projet spécifique par son ID
   */
  getProject: async (id: number): Promise<Projet> => {
    try {
      const response = await api.get(`/api/projects/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du projet ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupérer un projet complet avec toutes ses données (membres, tâches, messages)
   */
  getProjectComplete: async (id: number): Promise<ProjetComplet> => {
    try {
      const response = await api.get(`/api/projects/${id}/complete`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération complète du projet ${id}:`, error);
      throw error;
    }
  },

  /**
   * Créer un nouveau projet
   */
  createProject: async (projectData: Partial<Projet>): Promise<Projet> => {
    try {
      const response = await api.post('/api/projects', projectData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un projet
   */
  updateProject: async (id: number, projectData: Partial<Projet>): Promise<Projet> => {
    try {
      const response = await api.put(`/api/projects/${id}`, projectData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du projet ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprimer un projet
   */
  deleteProject: async (id: number): Promise<void> => {
    try {
      await api.delete(`/api/projects/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du projet ${id}:`, error);
      throw error;
    }
  }
};

export default projectService;
