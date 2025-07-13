// Index central pour toutes les interfaces

// Exports depuis user.ts
export type { 
  Utilisateur, 
  Role, 
  Detenir, 
  UserRole, 
  UtilisateurAvecRole 
} from './user';

// Exports depuis project.ts
export type { 
  Projet, 
  MembreProjet, 
  ProjectStats 
} from './project';

// Exports depuis task.ts
export type { 
  Tache, 
  TacheComplete, 
  Assigner, 
  TaskStats 
} from './task';

// Exports depuis message.ts
export type { 
  Message, 
  MessageComplet 
} from './message';

// Exports depuis auth.ts
export type { 
  AuthContextType, 
  AuthProviderProps 
} from './auth';

// Exports depuis composed.ts (interfaces composées)
export type { 
  ProjetComplet 
} from './composed';
