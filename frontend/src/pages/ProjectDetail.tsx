import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts/project/ProjectContext';
import { LoaderSpin, StatusSelect } from '@/components/ui';
import type { Projet } from '@/interfaces';
import { ArrowLeft, Calendar, Crown, Users, User, Clock, Target } from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { projectNameId } = useParams<{ projectNameId: string }>();
  const navigate = useNavigate();
  const { getProjectById } = useProjects();
  const [project, setProject] = useState<Projet | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectNameId) {
        setProjectLoading(false);
        return;
      }

      try {
        setProjectLoading(true);
        
        // Extraire l'ID du paramètre combiné (format: nom-du-projet_123)
        const lastUnderscoreIndex = projectNameId.lastIndexOf('_');
        if (lastUnderscoreIndex === -1) {
          console.error('Format d\'URL invalide, ID manquant');
          setProjectLoading(false);
          return;
        }
        
        const projectIdStr = projectNameId.substring(lastUnderscoreIndex + 1);
        const projectId = parseInt(projectIdStr, 10);
        
        if (isNaN(projectId)) {
          console.error('ID de projet invalide:', projectIdStr);
          setProjectLoading(false);
          return;
        }

        console.log('Recherche du projet avec ID:', projectId);
        
        // Récupérer le projet via le contexte (avec fallback API)
        const foundProject = await getProjectById(projectId);
        setProject(foundProject);
        
      } catch (error) {
        console.error('Erreur lors du chargement du projet:', error);
      } finally {
        setProjectLoading(false);
      }
    };

    loadProject();
  }, [projectNameId, getProjectById]);

  // Fonction pour obtenir l'icône et la couleur selon le rôle
  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case 'Chef de Projet':
        return { 
          icon: <Crown size={20} className="text-tf-fuschia" />, 
          color: 'text-tf-fuschia',
          label: 'Chef de Projet'
        };
      case 'Assistant':
        return { 
          icon: <Users size={20} className="text-tf-erin" />, 
          color: 'text-tf-erin',
          label: 'Assistant'
        };
      default:
        return { 
          icon: <User size={20} className="text-tf-battleship" />, 
          color: 'text-tf-battleship',
          label: 'Membre'
        };
    }
  };

  // Calculer le statut du projet basé sur les dates
  const getProjectStatus = (project: Projet): 'à faire' | 'en cours' | 'terminé' => {
    const today = new Date();
    const startDate = new Date(project.dateDebut);
    const endDate = new Date(project.dateFin);
    
    if (today > endDate) return 'terminé';
    if (today >= startDate) return 'en cours';
    return 'à faire';
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-tf-platinum flex items-center justify-center">
        <LoaderSpin size="xl" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-tf-platinum flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="tf-text-h1 text-tf-night mb-4">Projet non trouvé</h1>
          <p className="tf-text-base text-tf-battleship mb-6">
            Le projet demandé n'existe pas ou vous n'avez pas les permissions pour le voir.
          </p>
          <button
            onClick={handleGoBack}
            className="tf-button-primary flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const roleDisplay = getRoleDisplay(project.user_role);
  const projectStatus = getProjectStatus(project);
  const progressPercentage = project.progressPercentage ?? 0;

  // Calculer la durée du projet
  const startDate = new Date(project.dateDebut);
  const endDate = new Date(project.dateFin);
  const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculer les jours restants
  const today = new Date();
  const remainingDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-tf-platinum p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header avec bouton retour */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleGoBack}
            className="tf-button-secondary flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
          <div className="flex items-center gap-3">
            <h1 className="tf-text-h1 text-tf-night">{project.nom}</h1>
            {roleDisplay.icon}
          </div>
        </div>

        {/* Carte principale du projet */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-tf-battleship p-8 mb-6">
          {/* En-tête de la carte */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {roleDisplay.icon}
                <span className={`tf-text-h3 ${roleDisplay.color}`}>
                  {roleDisplay.label}
                </span>
              </div>
              <StatusSelect value={projectStatus} disabled={true} />
            </div>
          </div>

          {/* Description du projet */}
          <div className="mb-8">
            <h2 className="tf-text-h2 text-tf-night mb-4">Description</h2>
            <p className="tf-text-base text-tf-battleship leading-relaxed">
              {project.description || "Aucune description disponible pour ce projet."}
            </p>
          </div>

          {/* Progression */}
          <div className="mb-8">
            <h2 className="tf-text-h2 text-tf-night mb-4">Progression</h2>
            <div className="w-full h-8 bg-tf-platinum rounded-full border border-tf-battleship mb-2">
              {progressPercentage > 0 && (
                <div 
                  className="flex items-center justify-center bg-tf-fuschia h-full tf-text-base text-white rounded-s-full font-semibold" 
                  style={{width: `${progressPercentage}%`, minWidth: progressPercentage > 0 ? '60px' : '0px'}}
                > 
                  {progressPercentage}%
                </div>
              )}
            </div>
            <p className="tf-text-small text-tf-battleship">
              {progressPercentage === 100 ? 'Projet terminé' : 
               progressPercentage > 0 ? `${progressPercentage}% du projet complété` : 
               'Projet non démarré'}
            </p>
          </div>

          {/* Informations temporelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dates */}
            <div className="bg-tf-platinum rounded-lg p-6">
              <h3 className="tf-text-h3 text-tf-night mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Planification
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="tf-text-small text-tf-battleship">Date de début</span>
                  <p className="tf-text-base text-tf-night">
                    {startDate.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <span className="tf-text-small text-tf-battleship">Date de fin</span>
                  <p className="tf-text-base text-tf-night">
                    {endDate.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Durée et temps restant */}
            <div className="bg-tf-platinum rounded-lg p-6">
              <h3 className="tf-text-h3 text-tf-night mb-4 flex items-center gap-2">
                <Clock size={20} />
                Durée
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="tf-text-small text-tf-battleship">Durée totale</span>
                  <p className="tf-text-base text-tf-night">
                    {durationInDays} jour{durationInDays > 1 ? 's' : ''}
                  </p>
                </div>
                <div>
                  <span className="tf-text-small text-tf-battleship">Temps restant</span>
                  <p className={`tf-text-base ${remainingDays < 0 ? 'text-tf-folly' : remainingDays < 7 ? 'text-orange-500' : 'text-tf-night'}`}>
                    {remainingDays < 0 
                      ? `Dépassé de ${Math.abs(remainingDays)} jour${Math.abs(remainingDays) > 1 ? 's' : ''}`
                      : remainingDays === 0 
                        ? "Se termine aujourd'hui"
                        : `${remainingDays} jour${remainingDays > 1 ? 's' : ''} restant${remainingDays > 1 ? 's' : ''}`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions (si chef de projet) */}
          {project.user_role === 'Chef de Projet' && (
            <div className="mt-8 pt-6 border-t border-tf-battleship">
              <h3 className="tf-text-h3 text-tf-night mb-4 flex items-center gap-2">
                <Target size={20} />
                Actions
              </h3>
              <div className="flex gap-4">
                <button className="tf-button-primary">
                  Modifier le projet
                </button>
                <button className="tf-button-secondary">
                  Gérer les tâches
                </button>
                <button className="tf-button-secondary">
                  Gérer l'équipe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
