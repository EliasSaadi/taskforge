// Interfaces liées aux tâches

export interface Tache {
  id: number;
  titre: string;
  description: string;
  statut: 'à faire' | 'en cours' | 'terminé'; // enum de statut
  dateLimite: string;
  dateDebut: string;
  id_projet: number;
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

export interface Assigner {
  id_utilisateur: number;
  id_tache: number;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}
