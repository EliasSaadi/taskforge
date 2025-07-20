import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts';
import { LoaderSpin } from '@/components/ui';
import { MemberCard, TaskCard } from '@/components/card';
import type { ProjetComplet } from '@/interfaces';
import { Calendar, Clock, Filter } from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { projectNameId } = useParams<{ projectNameId: string }>();
  const navigate = useNavigate();
  
  // Utilisation de l'architecture orchestrateur
  const { loadCompleteProject } = useProjects();
  
  // État local - utilisation de ProjetComplet au lieu de Projet
  const [projectData, setProjectData] = useState<ProjetComplet | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'infos' | 'taches' | 'membres'>('infos');

  useEffect(() => {
    const loadProject = async () => {
      if (!projectNameId) {
        setProjectLoading(false);
        return;
      }

      try {
        setProjectLoading(true);
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

        // Utiliser l'orchestrateur pour charger toutes les données d'un coup
        const completeProject = await loadCompleteProject(projectId);
        setProjectData(completeProject);
        
      } catch (error) {
        console.error('Erreur lors du chargement du projet:', error);
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
      } finally {
        setProjectLoading(false);
      }
    };

    loadProject();
  }, [projectNameId]); // Suppression de loadCompleteProject des dépendances

  const handleTabChange = (tab: 'infos' | 'taches' | 'membres') => {
    setActiveTab(tab);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} jours`;
  };

  const calculateRemainingTime = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Terminé depuis ${Math.abs(diffDays)} jours`;
    }
    return `${diffDays} jours`;
  };

  if (projectLoading) {
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
          className="mt-4 bg-tf-erin px-6 py-3 rounded-lg text-white hover:bg-tf-lime transition-colors"
        >
          Retour au Dashboard
        </button>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Projet non trouvé</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-tf-erin px-6 py-3 rounded-lg text-white hover:bg-tf-lime transition-colors"
        >
          Retour au Dashboard
        </button>
      </div>
    );
  }

  const progressPercentage = projectData.stats.progressPercentage || 10;

  return (
    <div className="min-h-screen p-6 w-full flex justify-center">
      {/* Main Content */}
      <main className="max-w-7xl flex flex-col gap-2 w-full">
        {/* Titre du projet */}
        <h1 className="text-4xl font-bold text-tf-night pb-8">
          {projectData.nom}
        </h1>

        {/* Navigation par onglets */}
        <div className="flex justify-around w-full">
          <button
            onClick={() => handleTabChange('infos')}
            className={`w-64 py-3 rounded-t-2xl transition-colors text-xl font-bold ${
              activeTab === 'infos'
                ? 'bg-tf-fuschia text-white'
                : 'text-tf-fuschia hover:text-white hover:bg-tf-fuschia'
            }`}
          >
            Infos
          </button>
          <button
            onClick={() => handleTabChange('taches')}
            className={`w-64 py-3 rounded-t-2xl transition-colors text-xl font-bold ${
              activeTab === 'taches'
                ? 'bg-tf-fuschia text-white'
                : 'text-tf-fuschia hover:text-white hover:bg-tf-fuschia'
            }`}
          >
            Tâches
          </button>
          <button
            onClick={() => handleTabChange('membres')}
            className={`w-64 py-3 rounded-t-2xl transition-colors text-xl font-bold ${
              activeTab === 'membres'
                ? 'bg-tf-fuschia text-white'
                : 'text-tf-fuschia hover:text-white hover:bg-tf-fuschia'
            }`}
          >
            Membres
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'infos' && (
          <div className="space-y-6">
            {/* Chef de projet */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-tf-night">Nom du chef de projet</h2>
              <span className="bg-tf-erin text-white px-3 py-1 rounded-full text-sm font-medium">
                Chef de Projet
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-tf-night mb-3">Description :</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-tf-battleship leading-relaxed">
                  {projectData.description || "Description de base du projet - Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
                </p>
              </div>
            </div>

            {/* Progression */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-tf-night mb-3">Progression :</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-tf-battleship">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-tf-fuschia h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cartes Planification et Durée */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Planification */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="text-tf-battleship" size={20} />
                  <h3 className="text-lg font-semibold text-tf-night">Planification</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-tf-battleship mb-1">Date de début</p>
                    <p className="text-tf-night font-medium">{formatDate(projectData.dateDebut)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-tf-battleship mb-1">Date de fin</p>
                    <p className="text-tf-night font-medium">{formatDate(projectData.dateFin)}</p>
                  </div>
                </div>
              </div>

              {/* Durée */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-tf-battleship" size={20} />
                  <h3 className="text-lg font-semibold text-tf-night">Durée</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-tf-battleship mb-1">Durée totale</p>
                    <p className="text-tf-night font-medium">{calculateDuration(projectData.dateDebut, projectData.dateFin)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-tf-battleship mb-1">Temps restant</p>
                    <p className="text-tf-night font-medium">{calculateRemainingTime(projectData.dateFin)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'taches' && (
          <div>
            {/* Bouton Filtres */}
            <div className="flex justify-end mb-6">
              <button className="bg-tf-erin text-white px-6 py-2 rounded-lg hover:bg-tf-lime transition-colors flex items-center gap-2">
                <Filter size={16} />
                Filtres
              </button>
            </div>

            {/* Liste des tâches */}
            <div className="space-y-4">
              {projectData.taches.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  userRole="Chef de Projet" // À adapter selon l'utilisateur connecté
                  isAssignedToUser={false} // À adapter selon l'utilisateur connecté
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'membres' && (
          <div>
            {/* Liste des membres */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectData.membres.map(member => (
                <MemberCard
                  key={member.id}
                  member={member}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectDetail;
