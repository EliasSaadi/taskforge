# Contexts - Architecture modulaire

Cette architecture modulaire sépare les responsabilités entre différents contexts spécialisés, orchestrés par un context principal.

## Structure

### 🎯 Contexts spécialisés

- **`MemberContext`** - Gestion des membres des projets
  - Chargement, ajout, modification, suppression des membres
  - Gestion des rôles des membres
  - Hook : `useMembers()`

- **`TaskContext`** - Gestion des tâches des projets
  - CRUD des tâches
  - Changement de statut
  - Assignation/désassignation des utilisateurs
  - Calcul des statistiques
  - Hook : `useTasks()`

- **`MessageContext`** - Gestion des messages des projets
  - Envoi, modification, suppression des messages
  - Récupération des réponses
  - Hook : `useMessages()`

### 🎼 Context orchestrateur

- **`ProjectContextOrchestrator`** - Orchestration générale
  - Gestion des projets
  - Coordination des contexts spécialisés
  - Méthode `loadCompleteProject()` pour charger toutes les données
  - Hook : `useProjects()`

### 🌐 Provider global

- **`GlobalProjectProvider`** - Englobe tous les contexts
  - Ordre correct pour éviter les dépendances circulaires
  - Point d'entrée unique pour l'application

## Services correspondants

### 🔧 Services spécialisés

- **`memberService`** - API pour les membres
- **`taskService`** - API pour les tâches  
- **`messageService`** - API pour les messages
- **`projectService`** - API pour les projets

## Utilisation

### Configuration dans App.tsx

```typescript
import { GlobalProjectProvider } from '@/contexts';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <GlobalProjectProvider>
          <DeleteProvider>
            <RouterProvider router={router} />
            <NotificationContainer />
          </DeleteProvider>
        </GlobalProjectProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
```

### Utilisation dans les composants

```typescript
import { useProjects, useMembers, useTasks, useMessages } from '@/contexts';

const ProjectDetail = () => {
  const { loadCompleteProject } = useProjects();
  const { members, loadMembers } = useMembers();
  const { tasks, loadTasks } = useTasks();
  const { messages, loadMessages } = useMessages();
  
  // Chargement optimisé - toutes les données en une fois
  const project = await loadCompleteProject(projectId);
  
  // Ou chargement séparé si nécessaire
  await Promise.all([
    loadMembers(projectId),
    loadTasks(projectId),
    loadMessages(projectId)
  ]);
};
```

## Avantages

1. **Séparation des responsabilités** - Chaque context a un rôle précis
2. **Réutilisabilité** - Les contexts peuvent être utilisés indépendamment
3. **Optimisation** - Chargement groupé ou séparé selon les besoins
4. **Maintenabilité** - Code plus facile à maintenir et à tester
5. **Évolutivité** - Facile d'ajouter de nouveaux contexts spécialisés

## Flux de données

```
App
├── GlobalProjectProvider
│   ├── MemberProvider (état: membres)
│   ├── TaskProvider (état: tâches)
│   ├── MessageProvider (état: messages)
│   └── ProjectProvider (orchestration)
│       └── Components
│           ├── useMembers() → MemberContext
│           ├── useTasks() → TaskContext
│           ├── useMessages() → MessageContext
│           └── useProjects() → ProjectContext
```

## Backend requis

L'architecture utilise ces endpoints :

- `GET /api/projects/{id}/members` - Membres d'un projet
- `GET /api/projects/{id}/tasks` - Tâches d'un projet
- `GET /api/projects/{id}/messages` - Messages d'un projet

Le système charge toutes les données en parallèle pour optimiser les performances.
