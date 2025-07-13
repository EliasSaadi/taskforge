import api from '../api';
import type { MembreProjet } from '@/interfaces';

/**
 * Service pour la gestion des membres des projets
 */
export const memberService = {
  /**
   * Récupérer les membres d'un projet
   */
  getProjectMembers: async (projectId: number): Promise<MembreProjet[]> => {
    try {
      const response = await api.get(`/api/projects/${projectId}/members`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des membres du projet ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Ajouter un membre à un projet
   */
  addMember: async (projectId: number, userId: number, roleId: number): Promise<MembreProjet> => {
    try {
      const response = await api.post(`/api/projects/${projectId}/members`, {
        user_id: userId,
        role_id: roleId
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de l'ajout du membre au projet ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Modifier le rôle d'un membre
   */
  updateMemberRole: async (projectId: number, userId: number, roleId: number): Promise<MembreProjet> => {
    try {
      const response = await api.put(`/api/projects/${projectId}/members/${userId}`, {
        role_id: roleId
      });
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la modification du rôle du membre ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Retirer un membre d'un projet
   */
  removeMember: async (projectId: number, userId: number): Promise<void> => {
    try {
      await api.delete(`/api/projects/${projectId}/members/${userId}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du membre ${userId} du projet ${projectId}:`, error);
      throw error;
    }
  }
};

export default memberService;
