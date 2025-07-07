import { useState } from 'react';
import { DeleteService } from '@/services/deleteService';

/**
 * Hook pour gérer les suppressions avec état de chargement et gestion d'erreurs
 */
export const useDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Supprimer un utilisateur
   */
  const deleteUser = async (userId: number): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await DeleteService.deleteUser(userId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Supprimer un projet
   */
  const deleteProject = async (projectId: number): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await DeleteService.deleteProject(projectId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Supprimer une tâche
   */
  const deleteTask = async (taskId: number): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await DeleteService.deleteTask(taskId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Supprimer le compte utilisateur actuel
   */
  const deleteCurrentAccount = async (idUser: number): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await DeleteService.deleteCurrentUserAccount(idUser);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Réinitialiser l'erreur
   */
  const clearError = () => setError(null);

  return {
    isDeleting,
    error,
    deleteUser,
    deleteProject,
    deleteTask,
    deleteCurrentAccount,
    clearError
  };
};
