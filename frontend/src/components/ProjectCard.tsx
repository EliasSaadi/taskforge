import React, { useState } from 'react';
import { DeleteModal } from '@/components/modals/Delete';
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

  return (
    <div 
      className="rounded-lg p-3 border-2 border-tf-battleship bg-tf-platinum
        shadow-[3px_3px_6px_rgba(0,0,0,0.25)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3)] 
        hover:scale-[1.01] transition-all duration-300 cursor-pointer
        w-[512px] min-h-[192px] max-h-[256px]
        flex flex-col justify-between items-start
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
        <button 
          onClick={() => setShowDeleteModal(true)}
          className="bg-tf-folly p-1 rounded-sm flex items-center justify-center"
          disabled={isThisProjectDeleting}
        >
          {isThisProjectDeleting ? <LoaderSpin size='lg'/> : <Trash2 size={32}/>}
        </button>
      </div>

      {/* Modale de suppression */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleDeleteProject}
        itemType="projet"
        itemName={project.nom}
        isLoading={isThisProjectDeleting}
      />
    </div>
  );
};

export default ProjectCard;