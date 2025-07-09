import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { projectService } from '@/services/projectService';
import type { Projet } from '@/interfaces/data';

interface ProjectContextType {
  projects: Projet[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => void;
  addProject: (project: Projet) => void;
  removeProject: (projectId: number) => void;
  updateProject: (project: Projet) => void;
  clearError: () => void;
  getProjectProgress: (project: Projet) => number;
  getProjectStatus: (project: Projet) => 'à faire' | 'en cours' | 'terminé';
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
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
      console.error('Erreur dans ProjectContext:', err);
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

  /**
   * Calculer le pourcentage de progression d'un projet
   * Si les données sont disponibles depuis l'API, les utiliser, sinon utiliser 32% par défaut
   */
  const getProjectProgress = (project: Projet): number => {
    if (typeof project.progressPercentage === 'number') {
      return project.progressPercentage;
    }
    // Valeur par défaut pour les pages de démo ou les projets sans données
    return 32;
  };

  /**
   * Déterminer le statut d'un projet basé sur les dates
   */
  const getProjectStatus = (project: Projet): 'à faire' | 'en cours' | 'terminé' => {
    const today = new Date();
    const startDate = new Date(project.dateDebut);
    const endDate = new Date(project.dateFin);

    if (today > endDate) {
      return 'terminé';
    } else if (today >= startDate) {
      return 'en cours';
    } else {
      return 'à faire';
    }
  };

  // Charger les projets au montage du composant
  useEffect(() => {
    loadProjects();
  }, []);

  const value: ProjectContextType = {
    projects,
    loading,
    error,
    refreshProjects,
    addProject,
    removeProject,
    updateProject,
    clearError,
    getProjectProgress,
    getProjectStatus
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectProvider;
