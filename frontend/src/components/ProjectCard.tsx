import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDelete } from '@/contexts/DeleteContext';
import { StatusSelect, LoaderSpin } from './ui';
import type { Projet } from '@/interfaces/data';
import { Trash2, ArrowRight, Crown, Users, User } from 'lucide-react';

interface ProjectCardProps {
  project: Projet;
  onProjectDeleted: (projectId: number) => void;
}

// Composant ProjectCard pour afficher un projet
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onProjectDeleted }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteProject, isDeletingItem } = useDelete();
  const navigate = useNavigate();
  
  // Vérifier si ce projet spécifique est en cours de suppression
  const isThisProjectDeleting = isDeletingItem('projet', project.id);

  // Utiliser les valeurs calculées par le backend, avec fallback pour les pages démo
  const progressPercentage = project.progressPercentage ?? 32;
  
  // Calculer le statut du projet basé sur les dates
  const getProjectStatus = (project: Projet): 'à faire' | 'en cours' | 'terminé' => {
    const today = new Date();
    const startDate = new Date(project.dateDebut);
    const endDate = new Date(project.dateFin);
    
    if (today > endDate) return 'terminé';
    if (today >= startDate) return 'en cours';
    return 'à faire';
  };
  
  const projectStatus = getProjectStatus(project);

  // Fonction pour obtenir l'icône et la couleur selon le rôle
  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case 'Chef de Projet':
        return { 
          icon: <Crown size={16} className="text-tf-fuschia" />, 
          color: 'text-tf-fuschia',
          label: 'Chef de Projet'
        };
      case 'Assistant':
        return { 
          icon: <Users size={16} className="text-tf-erin" />, 
          color: 'text-tf-erin',
          label: 'Assistant'
        };
      default:
        return { 
          icon: <User size={16} className="text-tf-battleship" />, 
          color: 'text-tf-battleship',
          label: 'Membre'
        };
    }
  };

  const roleDisplay = getRoleDisplay(project.user_role);

  const handleDeleteProject = async () => {
    const success = await deleteProject(project.id);
    
    if (success) {
      console.log(`Projet "${project.nom}" supprimé avec succès`);
      onProjectDeleted(project.id);
    }
    // Les erreurs sont gérées automatiquement par le contexte
    
    setShowDeleteModal(false);
  };

  const handleCloseModal = () => {
    if (!isThisProjectDeleting) {
      setShowDeleteModal(false);
    }
  };

  // Fonction pour naviguer vers la page de détail du projet
  const handleCardClick = (e: React.MouseEvent) => {
    // Empêcher la navigation si on clique sur les boutons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    // Créer un nom de projet formaté pour l'URL (slug)
    const projectSlug = project.nom
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '_') // Remplacer les espaces par des underscores
      .trim();
    
    navigate(`/dashboard/${projectSlug}_${project.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="rounded-lg p-3 border-2 border-tf-battleship bg-tf-platinum
        shadow-[3px_3px_6px_rgba(0,0,0,0.25)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3)] 
        hover:scale-[1.01] transition-all duration-300 cursor-pointer
        w-[512px] min-h-[192px] max-h-[256px]
        flex flex-col justify-between items-start
        relative
      ">
      <div className="flex flex-col w-full gap-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <h3 className="tf-text-h3">{project.nom}</h3>
            <div className="flex items-center gap-1">
              {roleDisplay.icon}
            </div>
          </div>
          <StatusSelect 
            value={projectStatus} 
            disabled={true}
          />
        </div>

        <div className="flex justify-start items-center gap-2 tf-text-base">
          <span>{new Date(project.dateDebut).toLocaleDateString('fr-FR')}</span>
          <ArrowRight />
          <span>{new Date(project.dateFin).toLocaleDateString('fr-FR')}</span>
        </div>
        
        <div className="w-[384px] h-[20px] bg-white rounded-full border border-tf-night">
          {progressPercentage > 0 && (
            <div 
              className="flex items-center justify-center bg-tf-fuschia h-full tf-text-label text-tf-night rounded-s-full" 
              style={{width: `${progressPercentage}%`, minWidth: progressPercentage > 0 ? '40px' : '0px'}}
            > 
              {progressPercentage}%
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-end w-full">
        <div className="flex items-center gap-2 text-tf-night">
          {roleDisplay.icon}
          <span className={`tf-text-base font-medium ${roleDisplay.color}`}>
            {roleDisplay.label}
          </span>
        </div>
        {/* Bouton de suppression visible uniquement pour les chefs de projet */}
        {project.user_role === 'Chef de Projet' && (
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="bg-tf-folly p-1 rounded-sm flex items-center justify-center hover:bg-red-600 transition-colors"
            disabled={isThisProjectDeleting}
            title="Supprimer le projet"
          >
            {isThisProjectDeleting ? <LoaderSpin size='lg'/> : <Trash2 size={32}/>}
          </button>
        )}
      </div>

      {/* Modale de suppression positionnée dans la carte */}
      {showDeleteModal && (
        <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-lg shadow-lg p-6 mx-4 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton de fermeture */}
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isThisProjectDeleting}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              ✕
            </button>

            {/* Contenu de la modal */}
            <div className="text-center">
              {/* Icône d'avertissement */}
              <div className="mx-auto mb-4 text-red-600 w-8 h-8 flex items-center justify-center">
                ⚠️
              </div>

              {/* Titre */}
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Supprimer le projet
              </h3>

              {/* Message */}
              <p className="mb-3 text-sm text-gray-600">
                Êtes-vous sûr de vouloir supprimer le projet "{project.nom}" ?
              </p>

              <p className="mb-6 text-xs text-gray-400">
                Cette action supprimera définitivement le projet et toutes les tâches associées.
              </p>

              {/* Boutons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleDeleteProject}
                  disabled={isThisProjectDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isThisProjectDeleting ? (
                    <>
                      <LoaderSpin size="sm" />
                      Suppression...
                    </>
                  ) : (
                    'Oui, supprimer'
                  )}
                </button>
                
                <button
                  onClick={handleCloseModal}
                  disabled={isThisProjectDeleting}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;