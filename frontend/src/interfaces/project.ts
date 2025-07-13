// Interfaces liées aux projets

export interface Projet {
  id: number;
  dateDebut: string;
  dateFin: string;
  nom: string;
  dateCreation: string;
  description: string;
  user_role?: string; // Rôle de l'utilisateur actuel dans ce projet
  progressPercentage?: number; // Pourcentage de tâches terminées
  totalTasks?: number; // Nombre total de tâches
  completedTasks?: number; // Nombre de tâches terminées
}

export interface MembreProjet {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  role: 'Chef de Projet' | 'Assistant' | 'Membre';
  tasksStats: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
  };
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  totalMembers: number;
  progressPercentage: number;
  daysRemaining: number;
  isOverdue: boolean;
}
