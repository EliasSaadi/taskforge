import React, { useState } from 'react';
import { DeleteModal } from '@/components/modals/Delete';
import { useDelete } from '@/contexts/DeleteContext';

interface Project {
  id: number;
  name: string;
  description: string;
}

interface ProjectCardProps {
  project: Project;
  onProjectDeleted: (projectId: number) => void;
}

/**
 * Exemple de composant carte projet avec suppression utilisant le contexte
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onProjectDeleted }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteProject, isDeletingItem } = useDelete();

  // Vérifier si ce projet spécifique est en cours de suppression
  const isThisProjectDeleting = isDeletingItem('projet', project.id);

  const handleDeleteProject = async () => {
    const success = await deleteProject(project.id);
    
    if (success) {
      console.log(`Projet "${project.name}" supprimé avec succès`);
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
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      
      <div className="flex justify-between items-center">
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          Modifier
        </button>
        <button 
          onClick={() => setShowDeleteModal(true)}
          className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
          disabled={isThisProjectDeleting}
        >
          {isThisProjectDeleting ? 'Suppression...' : 'Supprimer'}
        </button>
      </div>

      {/* Modale de suppression */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleDeleteProject}
        itemType="projet"
        itemName={project.name}
        isLoading={isThisProjectDeleting}
      />
    </div>
  );
};
