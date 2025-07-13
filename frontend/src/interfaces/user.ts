// Interfaces liées aux utilisateurs et à l'authentification

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

export interface Role {
  id: number;
  nom: string;
}

export interface Detenir {
  id_utilisateur: number;
  id_projet: number;
  id_role: number;
}

export interface UserRole {
  userId: number;
  projectId: number;
  roleId: number;
}

// Interface pour les utilisateurs avec leur rôle dans un projet
export interface UtilisateurAvecRole extends Utilisateur {
  role?: string;
}
