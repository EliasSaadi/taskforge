import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { projectService } from '@/services/project/projectService';
import { memberService } from '@/services/project/memberService';
import { taskService } from '@/services/project/taskService';
import { messageService } from '@/services/project/messageService';
import { useAuth } from '@/contexts/core/AuthContext';
import type { Projet, ProjetComplet, ProjectStats } from '@/interfaces';

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
  loadCompleteProject: (projectId: number) => Promise<ProjetComplet>;
  getProjectStats: (projectId: number) => ProjectStats;
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
  
  // Pour getProjectStats, nous utiliserons une approche simple
  // puisque nous n'avons plus accès aux contexts de données

  /**
   * Charger les projets de l'utilisateur
   */
  const loadProjects = useCallback(async () => {
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
  }, []);

  /**
   * Récupérer un projet par son ID
   */
  const getProjectById = useCallback(async (projectId: number): Promise<Projet | null> => {
    try {
      // Chercher d'abord dans la liste locale
      const localProject = projects.find(p => p.id === projectId);
      if (localProject) return localProject;
      
      // Sinon, récupérer depuis l'API
      const project = await projectService.getProject(projectId);
      return project;
    } catch (err) {
      console.error(`Erreur lors de la récupération du projet ${projectId}:`, err);
      return null;
    }
  }, [projects]);

  /**
   * Charger un projet complet avec toutes ses données
   */
  const loadCompleteProject = useCallback(async (projectId: number): Promise<ProjetComplet> => {
    try {
      setError(null);
      
      // Récupérer le projet de base
      const project = await getProjectById(projectId);
      if (!project) {
        throw new Error('Projet non trouvé');
      }
      
      // Charger toutes les données en parallèle directement depuis les services
      const [membersResult, tasksResult, messagesResult] = await Promise.allSettled([
        memberService.getProjectMembers(projectId).catch(err => {
          console.warn('Erreur lors du chargement des membres:', err);
          return [];
        }),
        taskService.getProjectTasks(projectId).catch(err => {
          console.warn('Erreur lors du chargement des tâches:', err);
          return [];
        }),
        messageService.getProjectMessages(projectId).catch(err => {
          console.warn('Erreur lors du chargement des messages:', err);
          return [];
        })
      ]);
      
      // Extraire les données des résultats
      const projectMembers = membersResult.status === 'fulfilled' ? membersResult.value : [];
      const projectTasks = tasksResult.status === 'fulfilled' ? tasksResult.value : [];
      const projectMessages = messagesResult.status === 'fulfilled' ? messagesResult.value : [];
      
      // Calculer les statistiques avec les données chargées
      const totalTasks = projectTasks.length;
      const completedTasks = projectTasks.filter(t => t.statut === 'terminé').length;
      const inProgressTasks = projectTasks.filter(t => t.statut === 'en cours').length;
      const todoTasks = projectTasks.filter(t => t.statut === 'à faire').length;
      
      const stats: ProjectStats = {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        totalMembers: projectMembers.length,
        progressPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        daysRemaining: Math.ceil((new Date(project.dateFin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        isOverdue: new Date() > new Date(project.dateFin)
      };
      
      // Construire l'objet ProjetComplet avec les vraies données
      return {
        ...project,
        membres: projectMembers,
        taches: projectTasks,
        messages: projectMessages,
        stats
      };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors du chargement complet du projet';
      setError(message);
      throw err;
    }
  }, [getProjectById]);

  /**
   * Obtenir les statistiques d'un projet
   * Note: Cette fonction est simplifiée car nous n'avons plus accès aux contexts
   */
  const getProjectStats = useCallback((projectId: number): ProjectStats => {
    const project = projects.find(p => p.id === projectId);
    
    return {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      todoTasks: 0,
      totalMembers: 0,
      progressPercentage: 0,
      daysRemaining: project ? Math.ceil((new Date(project.dateFin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0,
      isOverdue: project ? new Date() > new Date(project.dateFin) : false
    };
  }, [projects]);

  /**
   * Recharger les projets
   */
  const refreshProjects = useCallback(() => {
    loadProjects();
  }, []);

  /**
   * Ajouter un projet à la liste locale
   */
  const addProject = useCallback((newProject: Projet) => {
    setProjects(prev => [newProject, ...prev]);
  }, []);

  /**
   * Supprimer un projet de la liste locale
   */
  const removeProject = useCallback((projectId: number) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  }, []);

  /**
   * Mettre à jour un projet dans la liste locale
   */
  const updateProject = useCallback((updatedProject: Projet) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  }, []);

  /**
   * Effacer l'erreur
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Calculer le pourcentage de progression d'un projet
   */
  const getProjectProgress = useCallback((project: Projet): number => {
    if (!project.totalTasks || project.totalTasks === 0) return 0;
    return Math.round((project.completedTasks || 0) / project.totalTasks * 100);
  }, []);

  /**
   * Déterminer le statut d'un projet basé sur les dates
   */
  const getProjectStatus = useCallback((project: Projet): 'à faire' | 'en cours' | 'terminé' => {
    const today = new Date();
    const startDate = new Date(project.dateDebut);
    const endDate = new Date(project.dateFin);
    
    if (today > endDate) return 'terminé';
    if (today >= startDate) return 'en cours';
    return 'à faire';
  }, []);

  // Charger les projets au montage si l'utilisateur est authentifié
  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadProjects();
    }
  }, [isAuthenticated, authLoading]);

  return (
    <ProjectContext.Provider value={{
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
      getProjectById,
      loadCompleteProject,
      getProjectStats
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
