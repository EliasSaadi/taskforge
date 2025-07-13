import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { projectService } from '@/services/projectService';
import { useAuth } from '@/contexts/AuthContext';
import type { Projet } from '@/interfaces';

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
  getProjectById: (projectId: number) => Promise<Projet | null>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

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

  /**
   * Récupérer un projet spécifique par ID
   * Cherche d'abord dans la liste locale, puis via l'API si nécessaire
   */
  const getProjectById = async (projectId: number): Promise<Projet | null> => {
    try {
      // D'abord, chercher dans la liste locale
      const localProject = projects.find(project => project.id === projectId);
      if (localProject) {
        return localProject;
      }

      // Si pas trouvé localement et qu'on n'est pas en train de charger, faire un appel API
      if (!loading) {
        console.log(`Projet ${projectId} non trouvé localement, récupération via API...`);
        const projectFromApi = await projectService.getProject(projectId);
        
        // Ajouter le projet récupéré à la liste locale pour éviter les futurs appels API
        if (projectFromApi) {
          addProject(projectFromApi);
          return projectFromApi;
        }
      }

      return null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du projet ${projectId}:`, error);
      return null;
    }
  };

  // Charger les projets au montage du composant, seulement si authentifié
  useEffect(() => {
    // Ne charger les projets que si l'utilisateur est authentifié
    // et que l'AuthContext a fini son loading initial
    if (!authLoading && isAuthenticated) {
      loadProjects();
    } else if (!authLoading && !isAuthenticated) {
      // Si pas authentifié, réinitialiser l'état
      setProjects([]);
      setLoading(false);
      setError(null);
    }
  }, [isAuthenticated, authLoading]);

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
    getProjectStatus,
    getProjectById
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
