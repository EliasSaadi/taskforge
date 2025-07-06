// src/interfaces.ts

export interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  mdp: string;
  actif: boolean;
  theme: string;
  dateCreation: string;
}

export interface Projet {
  id_projet: number;
  dateDebut: string;
  dateFin: string;
  nom: string;
  dateCreation: string;
  description: string;
}

export interface Tache {
  id_tache: number;
  titre: string;
  description: string;
  statut: 'A faire' | 'En cours' | 'Terminé'; // enum de statut
  dateLimite: string;
  dateDebut: string;
  id_projet: number;
}

export interface Message {
  id_message: number;
  contenu: string;
  date_: string;
  id_projet: number;
  id_utilisateur: number;
}

export interface Role {
  id_role: number;
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
