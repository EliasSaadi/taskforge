import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects, useMembers, useTasks, useMessages } from '@/contexts';
import { LoaderSpin } from '@/components/ui';
import { MemberCard, TaskCard } from '@/components/card';
import type { ProjetComplet } from '@/interfaces';
import { ArrowLeft, Calendar, Users, Clock, Info, CheckSquare } from 'lucide-react';

export const ProjectDetailWithOrchestrator: React.FC = () => {
  const { projectNameId } = useParams<{ projectNameId: string }>();
  const navigate = useNavigate();
  
  // Utilisation des contexts modulaires
  const { loadCompleteProject } = useProjects();
  const { members } = useMembers();
  const { tasks } = useTasks();
  const { messages } = useMessages();
  
  // État local
  const [projectData, setProjectData] = useState<ProjetComplet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'infos' | 'taches' | 'membres'>('infos');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fonction pour changer d'onglet avec animation
  const handleTabChange = (newTab: 'infos' | 'taches' | 'membres') => {
    if (newTab === activeTab) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTransitioning(false);
    }, 150);
  };

  // Charger le projet complet
  useEffect(() => {
    const loadProject = async () => {
      if (!projectNameId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Extraire l'ID du paramètre combiné
        const lastUnderscoreIndex = projectNameId.lastIndexOf('_');
        if (lastUnderscoreIndex === -1) {
          throw new Error('Format d\'URL invalide, ID manquant');
        }
        
        const projectIdStr = projectNameId.substring(lastUnderscoreIndex + 1);
        const projectId = parseInt(projectIdStr, 10);
        
        if (isNaN(projectId)) {
          throw new Error('ID de projet invalide');
        }

        // Utiliser le context orchestrateur pour charger toutes les données
        const completeProject = await loadCompleteProject(projectId);
        setProjectData(completeProject);
        
      } catch (error) {
        console.error('Erreur lors du chargement du projet:', error);
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectNameId, loadCompleteProject]);

  // Calculer le statut du projet
  const getProjectStatus = (project: ProjetComplet): 'à faire' | 'en cours' | 'terminé' => {
    const today = new Date();
    const startDate = new Date(project.dateDebut);
    const endDate = new Date(project.dateFin);
    
    if (today > endDate) return 'terminé';
    if (today >= startDate) return 'en cours';
    return 'à faire';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderSpin size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-4">Erreur</h2>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-tf-dodger text-white rounded hover:bg-tf-dodger/80"
        >
          Retour au dashboard
        </button>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-tf-battleship text-center">
          <h2 className="text-2xl font-bold mb-4">Projet non trouvé</h2>
          <p>Le projet demandé n'existe pas ou vous n'avez pas les permissions pour y accéder.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-tf-dodger text-white rounded hover:bg-tf-dodger/80"
        >
          Retour au dashboard
        </button>
      </div>
    );
  }

  const status = getProjectStatus(projectData);

  return (
    <div className="min-h-screen bg-tf-platinum">
      {/* En-tête du projet */}
      <div className="bg-white shadow-sm border-b border-tf-davys">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-tf-battleship hover:text-tf-night"
              >
                <ArrowLeft size={20} />
                <span>Retour</span>
              </button>
              <div className="h-6 w-px bg-tf-davys" />
              <h1 className="text-xl font-bold text-tf-night">{projectData.nom}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-tf-battleship" />
                <span className="text-sm text-tf-battleship">
                  {new Date(projectData.dateDebut).toLocaleDateString()} - {new Date(projectData.dateFin).toLocaleDateString()}
                </span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === 'terminé' ? 'bg-tf-erin/20 text-tf-erin' :
                status === 'en cours' ? 'bg-tf-dodger/20 text-tf-dodger' :
                'bg-tf-battleship/20 text-tf-battleship'
              }`}>
                {status}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'infos', label: 'Informations', icon: Info },
              { id: 'taches', label: 'Tâches', icon: CheckSquare },
              { id: 'membres', label: 'Membres', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as 'infos' | 'taches' | 'membres')}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-tf-dodger text-tf-dodger'
                    : 'border-transparent text-tf-battleship hover:text-tf-night hover:border-tf-davys'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {activeTab === 'infos' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-tf-davys p-6">
                <h2 className="text-lg font-semibold text-tf-night mb-4">Description du projet</h2>
                <p className="text-tf-battleship">{projectData.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-tf-davys p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckSquare size={20} className="text-tf-dodger" />
                    <h3 className="font-medium text-tf-night">Tâches</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-tf-battleship">Total</span>
                      <span className="font-medium">{projectData.stats.totalTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tf-battleship">Terminées</span>
                      <span className="font-medium text-tf-erin">{projectData.stats.completedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tf-battleship">En cours</span>
                      <span className="font-medium text-tf-dodger">{projectData.stats.inProgressTasks}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-tf-davys p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users size={20} className="text-tf-fuschia" />
                    <h3 className="font-medium text-tf-night">Équipe</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-tf-battleship">Membres</span>
                      <span className="font-medium">{projectData.stats.totalMembers}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-tf-davys p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock size={20} className="text-tf-battleship" />
                    <h3 className="font-medium text-tf-night">Progression</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-tf-battleship">Avancement</span>
                      <span className="font-medium">{projectData.stats.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-tf-davys/20 rounded-full h-2">
                      <div 
                        className="bg-tf-erin h-2 rounded-full transition-all duration-300"
                        style={{ width: `${projectData.stats.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'taches' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-tf-night">Tâches du projet</h2>
                <button className="bg-tf-dodger text-white px-4 py-2 rounded-lg hover:bg-tf-dodger/80">
                  Nouvelle tâche
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectData.taches.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    userRole="Membre" 
                    isAssignedToUser={false}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'membres' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-tf-night">Membres du projet</h2>
                <button className="bg-tf-fuschia text-white px-4 py-2 rounded-lg hover:bg-tf-fuschia/80">
                  Inviter un membre
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectData.membres.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailWithOrchestrator;
