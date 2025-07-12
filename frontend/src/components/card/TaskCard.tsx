import React, { useState } from 'react';
import { Calendar, Edit, Trash2, ScanEye } from 'lucide-react';
import { StatusSelect, LoaderDots } from '@/components/ui';
import { useDelete } from '@/contexts/DeleteContext';

interface TaskCardProps {
  task: {
    id: number;
    titre: string;
    description: string;
    statut: 'à faire' | 'en cours' | 'terminé';
    dateLimite: string;
    assignedUsers: Array<{
      id: number;
      prenom: string;
      nom: string;
    }>;
  };
  userRole: 'Chef de Projet' | 'Assistant' | 'Membre';
  isAssignedToUser: boolean;
  onTaskStatusChange?: (taskId: number, newStatus: 'à faire' | 'en cours' | 'terminé') => void;
  onTaskView?: (taskId: number) => void;
  onTaskEdit?: (taskId: number) => void;
  onTaskDelete?: (taskId: number) => void;
}

/**
 * Composant carte tâche pour afficher les informations d'une tâche
 * avec gestion des actions selon les permissions
 */
export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  userRole,
  isAssignedToUser,
  onTaskStatusChange,
  onTaskView,
  onTaskEdit,
  onTaskDelete
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteTask, isDeletingItem } = useDelete();

  // Vérifier si cette tâche spécifique est en cours de suppression
  const isThisTaskDeleting = isDeletingItem('tâche', task.id);

  // Permissions pour modifier le statut
  const canModifyStatus = isAssignedToUser || userRole === 'Chef de Projet' || userRole === 'Assistant';
  
  // Permissions pour modifier/supprimer
  const canModifyTask = userRole === 'Chef de Projet' || userRole === 'Assistant';

  // Fonction pour obtenir la couleur selon le statut
  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'terminé':
        return 'border-green-500';
      case 'en cours':
        return 'border-orange-500';
      default:
        return 'border-gray-500';
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fonction pour vérifier si la date limite est proche ou dépassée
  const getDateStatus = (dateLimite: string) => {
    const today = new Date();
    const limitDate = new Date(dateLimite);
    const diffTime = limitDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { color: 'text-red-600'};
    } else if (diffDays <= 3) {
      return { color: 'text-orange-600'};
    } else {
      return { color: 'text-tf-night'};
    }
  };

  const dateStatus = getDateStatus(task.dateLimite);

  // Gestion du changement de statut
  const handleStatusChange = (newStatus: 'à faire' | 'en cours' | 'terminé') => {
    if (onTaskStatusChange) {
      onTaskStatusChange(task.id, newStatus);
    }
  };

  // Gestion de la suppression
  const handleDelete = async () => {
    if (onTaskDelete) {
      await deleteTask(task.id);
      onTaskDelete(task.id);
    }
    setShowDeleteModal(false);
  };

  // Empêcher la propagation du clic sur les boutons
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div 
        className={`rounded-lg p-4 border-2 ${getStatusColor(task.statut)} bg-tf-platinum
          shadow-[3px_3px_6px_rgba(0,0,0,0.25)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3)] 
          hover:scale-[1.01] transition-all duration-300 w-full h-[120px]
          flex justify-between
          relative
        `}
      >
        {/* Header avec titre et description */}
        <div className="flex flex-col w-5/12 gap-2">
            <h3 className="tf-text-h4 font-semibold">
                {task.titre}
            </h3>
            <p className="tf-text-secondaire line-clamp-2">
                {task.description}
            </p>
        </div>

        {/* Utilisateurs assignés */}
        <div className="grid grid-cols-2 justify-center items-center gap-2">
            {task.assignedUsers.map((user) => (
                <div 
                    key={user.id}
                    className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-tf-battleship"
                >
                    <div className="w-6 h-6 bg-tf-fuschia text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {user.prenom.charAt(0).toUpperCase()}
                    </div>
                    <span className="tf-text-small text-tf-night">
                        {user.prenom} {user.nom.charAt(0).toUpperCase()}.
                    </span>
                </div>
            ))}
        </div>

        {/* Date limite et statut */}
        <div className="flex flex-col justify-center items-center gap-2">
            <div onClick={stopPropagation}>
                <StatusSelect 
                    value={task.statut}
                    onChange={canModifyStatus ? handleStatusChange : undefined}
                    disabled={!canModifyStatus}
                />
            </div>
            <div className="flex items-center gap-2">
                <Calendar size={16} className={dateStatus.color} />
                <span className={`tf-text-small ${dateStatus.color}`}>
                    {formatDate(task.dateLimite)}
                </span>
            </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center gap-3">
          <button
            onClick={(e) => {
              stopPropagation(e);
              if (onTaskView) onTaskView(task.id);
            }}
            className="flex justify-center items-center h-max w-max p-1 bg-tf-dodger text-tf-night rounded-sm
                        hover:scale-110 transition-all duration-300"
          >
            <ScanEye />
          </button>

          {canModifyTask && (
            <div className="flex flex-col gap-3">
              <button
                onClick={(e) => {
                  stopPropagation(e);
                  if (onTaskEdit) onTaskEdit(task.id);
                }}
                className="flex justify-center items-center h-max w-max p-1 bg-tf-saffron text-tf-night rounded-sm
                            hover:scale-110 transition-all duration-300"
              >
                <Edit />
              </button>
              
              <button
                onClick={(e) => {
                  stopPropagation(e);
                  setShowDeleteModal(true);
                }}
                disabled={isThisTaskDeleting}
                className="flex justify-center items-center h-max w-max p-1 bg-tf-folly text-tf-night rounded-sm
                            hover:scale-110 transition-all duration-300"
              >
                <Trash2 />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="tf-text-h3 text-tf-night mb-4">
              Confirmer la suppression
            </h3>
            <p className="tf-text-base text-tf-battleship mb-6">
              Êtes-vous sûr de vouloir supprimer la tâche "{task.titre}" ? 
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isThisTaskDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isThisTaskDeleting ? (
                  <>
                    <LoaderDots size="sm" />
                  </>
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
