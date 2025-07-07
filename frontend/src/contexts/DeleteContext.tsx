import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { DeleteService } from '@/services/deleteService';

interface DeleteContextType {
  /** État de chargement global pour les suppressions */
  isDeleting: boolean;
  /** Erreur de suppression */
  error: string | null;
  /** Type d'élément en cours de suppression */
  deletingType: 'utilisateur' | 'projet' | 'tâche' | null;
  /** ID de l'élément en cours de suppression */
  deletingId: number | null;
  
  /** Supprimer un utilisateur */
  deleteUser: (userId: number) => Promise<boolean>;
  /** Supprimer un projet */
  deleteProject: (projectId: number) => Promise<boolean>;
  /** Supprimer une tâche */
  deleteTask: (taskId: number) => Promise<boolean>;
  /** Supprimer le compte utilisateur actuel */
  deleteCurrentAccount: (userId: number) => Promise<boolean>;
  /** Réinitialiser l'erreur */
  clearError: () => void;
  /** Vérifier si un élément spécifique est en cours de suppression */
  isDeletingItem: (type: 'utilisateur' | 'projet' | 'tâche', id: number) => boolean;
}

const DeleteContext = createContext<DeleteContextType | undefined>(undefined);

interface DeleteProviderProps {
  children: ReactNode;
}

/**
 * Provider pour gérer les suppressions dans toute l'application
 */
export const DeleteProvider: React.FC<DeleteProviderProps> = ({ children }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingType, setDeletingType] = useState<'utilisateur' | 'projet' | 'tâche' | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /**
   * Fonction générique pour gérer les suppressions
   */
  const handleDelete = async (
    type: 'utilisateur' | 'projet' | 'tâche',
    id: number | undefined,
    deleteFunction: () => Promise<void>
  ): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    setDeletingType(type);
    setDeletingId(id || null);

    try {
      await deleteFunction();
      console.log(`${type} ${id ? `(ID: ${id})` : ''} supprimé avec succès`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de la suppression';
      setError(errorMessage);
      console.error(`Erreur lors de la suppression du ${type}:`, err);
      return false;
    } finally {
      setIsDeleting(false);
      setDeletingType(null);
      setDeletingId(null);
    }
  };

  /**
   * Supprimer un utilisateur
   */
  const deleteUser = async (userId: number): Promise<boolean> => {
    return handleDelete('utilisateur', userId, () => DeleteService.deleteUser(userId));
  };

  /**
   * Supprimer un projet
   */
  const deleteProject = async (projectId: number): Promise<boolean> => {
    return handleDelete('projet', projectId, () => DeleteService.deleteProject(projectId));
  };

  /**
   * Supprimer une tâche
   */
  const deleteTask = async (taskId: number): Promise<boolean> => {
    return handleDelete('tâche', taskId, () => DeleteService.deleteTask(taskId));
  };

  /**
   * Supprimer le compte utilisateur actuel
   */
  const deleteCurrentAccount = async (userId: number): Promise<boolean> => {
    return handleDelete('utilisateur', userId, () => DeleteService.deleteCurrentUserAccount(userId));
  };

  /**
   * Réinitialiser l'erreur
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Vérifier si un élément spécifique est en cours de suppression
   */
  const isDeletingItem = (type: 'utilisateur' | 'projet' | 'tâche', id: number): boolean => {
    return isDeleting && deletingType === type && deletingId === id;
  };

  const value: DeleteContextType = {
    isDeleting,
    error,
    deletingType,
    deletingId,
    deleteUser,
    deleteProject,
    deleteTask,
    deleteCurrentAccount,
    clearError,
    isDeletingItem
  };

  return (
    <DeleteContext.Provider value={value}>
      {children}
    </DeleteContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte de suppression
 */
export const useDelete = (): DeleteContextType => {
  const context = useContext(DeleteContext);
  if (!context) {
    throw new Error('useDelete doit être utilisé dans un DeleteProvider');
  }
  return context;
};

export default DeleteProvider;
