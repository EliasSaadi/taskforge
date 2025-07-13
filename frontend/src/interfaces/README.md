# Interfaces TypeScript - TaskForge

Ce dossier contient toutes les interfaces TypeScript organisées par domaine fonctionnel.

## Structure

### 📁 Fichiers principaux

- **`index.ts`** - Point d'entrée centralisé qui exporte toutes les interfaces
- **`composed.ts`** - Interfaces composées qui utilisent plusieurs domaines

### 📄 Domaines fonctionnels

- **`user.ts`** - Interfaces liées aux utilisateurs et rôles
  - `Utilisateur` : Informations complètes d'un utilisateur
  - `Role` : Rôles dans l'application
  - `Detenir` : Relation utilisateur/projet/rôle
  - `UserRole` : Rôle simple utilisateur/projet
  - `UtilisateurAvecRole` : Utilisateur avec son rôle

- **`project.ts`** - Interfaces liées aux projets
  - `Projet` : Informations de base d'un projet
  - `MembreProjet` : Membre d'un projet avec ses statistiques
  - `ProjectStats` : Statistiques d'un projet

- **`task.ts`** - Interfaces liées aux tâches
  - `Tache` : Informations de base d'une tâche
  - `TacheComplete` : Tâche avec les utilisateurs assignés
  - `Assigner` : Relation utilisateur/tâche
  - `TaskStats` : Statistiques des tâches

- **`message.ts`** - Interfaces liées aux messages
  - `Message` : Message de base
  - `MessageComplet` : Message avec auteur et réponses

- **`auth.ts`** - Interfaces liées à l'authentification
  - `AuthContextType` : Type du contexte d'authentification
  - `AuthProviderProps` : Props du provider d'authentification

### 🔄 Interfaces composées

- **`ProjetComplet`** - Projet avec tous ses membres, tâches et messages

## Utilisation

```typescript
// Import depuis l'index centralisé
import type { Projet, Utilisateur, TacheComplete } from '@/interfaces';

// Ou import spécifique si nécessaire
import type { ProjectStats } from '@/interfaces/project';
```

## Bonnes pratiques

1. **Utiliser l'index centralisé** : Toujours importer depuis `@/interfaces` quand possible
2. **Noms clairs** : Les interfaces utilisent des noms français cohérents avec le backend
3. **Séparation des domaines** : Chaque domaine a son propre fichier
4. **Interfaces composées** : Les interfaces qui mélangent plusieurs domaines sont dans `composed.ts`
5. **Documentation** : Chaque interface complexe est documentée avec des commentaires
