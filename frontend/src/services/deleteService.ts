import api from './api';

/**
 * Service pour les opérations de suppression
 */
export class DeleteService {
  /**
   * Supprimer un utilisateur
   */
  static async deleteUser(userId: number): Promise<void> {
    try {
      await api.delete(`api/user/${userId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw new Error('Impossible de supprimer l\'utilisateur');
    }
  }

  /**
   * Supprimer un projet
   */
  static async deleteProject(projectId: number): Promise<void> {
    try {
      await api.delete(`api/projects/${projectId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      throw new Error('Impossible de supprimer le projet');
    }
  }

  /**
   * Supprimer une tâche
   */
  static async deleteTask(taskId: number): Promise<void> {
    try {
      await api.delete(`api/tasks/${taskId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      throw new Error('Impossible de supprimer la tâche');
    }
  }

  /**
   * Supprimer le compte utilisateur actuel (nécessite une déconnexion après)
   */
  static async deleteCurrentUserAccount(idUser: number): Promise<void> {
    try {
      console.log('Suppression de l\'utilisateur avec ID:', idUser);
      console.log('URL appelée:', `/user/${idUser}/delete`);
      await api.delete(`api/user/${idUser}/delete`);
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      throw new Error('Impossible de supprimer le compte');
    }
  }
}
