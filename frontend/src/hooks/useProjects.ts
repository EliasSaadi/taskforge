import { useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';
import type { Projet } from '@/interfaces/data';

/**
 * Hook personnalisé pour gérer les projets de l'utilisateur
 */
export const useProjects = () => {
  const [projects, setProjects] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger les projets de l'utilisateur
   */
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const userProjects = await projectService.getUserProjects();
      setProjects(userProjects);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors du chargement des projets';
      setError(message);
      console.error('Erreur dans useProjects:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Recharger les projets
   */
  const refreshProjects = () => {
    loadProjects();
  };

  /**
   * Ajouter un projet à la liste locale
   */
  const addProject = (newProject: Projet) => {
    setProjects(prevProjects => [newProject, ...prevProjects]);
  };

  /**
   * Supprimer un projet de la liste locale
   */
  const removeProject = (projectId: number) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
  };

  /**
   * Mettre à jour un projet dans la liste locale
   */
  const updateProject = (updatedProject: Projet) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  /**
   * Effacer l'erreur
   */
  const clearError = () => {
    setError(null);
  };

  // Charger les projets au montage du composant
  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    refreshProjects,
    addProject,
    removeProject,
    updateProject,
    clearError
  };
};

export default useProjects;
