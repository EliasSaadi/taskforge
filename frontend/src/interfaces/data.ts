// src/interfaces.ts

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  mdp: string;
  actif: boolean;
  theme: string;
  created_at: string; // Date de création (format ISO)
  updated_at: string; // Date de mise à jour (format ISO)
}

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

export interface Tache {
  id: number;
  titre: string;
  description: string;
  statut: 'A faire' | 'En cours' | 'Terminé'; // enum de statut
  dateLimite: string;
  dateDebut: string;
  id_projet: number;
}

export interface Message {
  id: number;
  contenu: string;
  date_: string;
  id_projet: number;
  id_utilisateur: number;
}

export interface Role {
  id: number;
  nom: string;
}

export interface Detenir {
  id_utilisateur: number;
  id_projet: number;
  id_role: number;
}

export interface Assigner {
  id_utilisateur: number;
  id_tache: number;
}

// Interfaces pour les composants Card
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

export interface TacheComplete {
  id: number;
  titre: string;
  description: string;
  statut: 'à faire' | 'en cours' | 'terminé';
  dateLimite: string;
  dateDebut: string;
  id_projet: number;
  assignedUsers: Array<{
    id: number;
    prenom: string;
    nom: string;
  }>;
}

// Types pour les statistiques
export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}
