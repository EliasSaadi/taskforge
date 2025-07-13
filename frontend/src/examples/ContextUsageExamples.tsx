// Exemple d'utilisation des contexts modulaires

import React, { useEffect, useState } from 'react';
import { useMembers, useTasks, useMessages, useProjects } from '@/contexts';
import type { ProjetComplet } from '@/interfaces';

// Exemple 1: Utilisation individuelle des contexts
export const MemberManager: React.FC<{ projectId: number }> = ({ projectId }) => {
  const { members, loading, error, loadMembers, addMember, removeMember } = useMembers();

  useEffect(() => {
    loadMembers(projectId);
  }, [projectId, loadMembers]);

  if (loading) return <div>Chargement des membres...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h2>Membres du projet</h2>
      <ul>
        {members.map(member => (
          <li key={member.id}>
            {member.prenom} {member.nom} - {member.role}
            <button onClick={() => removeMember(projectId, member.id)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => addMember(projectId, 1, 1)}>
        Ajouter un membre
      </button>
    </div>
  );
};

// Exemple 2: Utilisation combinée des contexts
export const ProjectOverview: React.FC<{ projectId: number }> = ({ projectId }) => {
  const { members, loadMembers } = useMembers();
  const { tasks, loadTasks, getTaskStats } = useTasks();
  const { messages, loadMessages } = useMessages();

  useEffect(() => {
    // Charger toutes les données en parallèle
    Promise.all([
      loadMembers(projectId),
      loadTasks(projectId),
      loadMessages(projectId)
    ]);
  }, [projectId, loadMembers, loadTasks, loadMessages]);

  const taskStats = getTaskStats();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3>Membres</h3>
        <p>{members.length} membres</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3>Tâches</h3>
        <p>{taskStats.total} tâches</p>
        <p>{taskStats.completed} terminées</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3>Messages</h3>
        <p>{messages.length} messages</p>
      </div>
    </div>
  );
};

// Exemple 3: Utilisation du context orchestrateur
export const ProjectDetailOptimized: React.FC<{ projectId: number }> = ({ projectId }) => {
  const { loadCompleteProject } = useProjects();
  const [project, setProject] = useState<ProjetComplet | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const completeProject = await loadCompleteProject(projectId);
        setProject(completeProject);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      }
    };

    loadProject();
  }, [projectId, loadCompleteProject]);

  if (!project) return <div>Chargement...</div>;

  return (
    <div>
      <h1>{project.nom}</h1>
      <p>{project.description}</p>
      
      <div className="mt-4">
        <h2>Statistiques</h2>
        <p>Progression: {project.stats.progressPercentage}%</p>
        <p>Membres: {project.stats.totalMembers}</p>
        <p>Tâches: {project.stats.totalTasks}</p>
      </div>

      <div className="mt-4">
        <h2>Membres</h2>
        <ul>
          {project.membres.map(member => (
            <li key={member.id}>
              {member.prenom} {member.nom} - {member.role}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h2>Tâches</h2>
        <ul>
          {project.taches.map(task => (
            <li key={task.id}>
              {task.titre} - {task.statut}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
