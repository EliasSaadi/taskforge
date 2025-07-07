import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { LoaderDots } from '@/components/ui';

interface DeleteModalProps {
  /** Si la modale est ouverte */
  isOpen: boolean;
  /** Fonction pour fermer la modale */
  onClose: () => void;
  /** Fonction appelée lors de la confirmation de suppression */
  onConfirm: () => void;
  /** Type d'élément à supprimer */
  itemType: 'utilisateur' | 'projet' | 'tâche';
  /** Nom de l'élément à supprimer (optionnel) */
  itemName?: string;
  /** État de chargement pendant la suppression */
  isLoading?: boolean;
}

/**
 * Modale de confirmation de suppression réutilisable
 */
export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  itemName,
  isLoading = false
}) => {
  // Configuration selon le type d'élément
  const getItemConfig = () => {
    switch (itemType) {
      case 'utilisateur':
        return {
          title: 'Supprimer l\'utilisateur',
          message: itemName 
            ? `Êtes-vous sûr de vouloir supprimer l'utilisateur "${itemName}" ?`
            : 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
          warning: 'Cette action supprimera définitivement l\'utilisateur et toutes ses données associées.',
          confirmText: 'Oui, supprimer l\'utilisateur',
          confirmClass: 'bg-red-600 hover:bg-red-800 focus:ring-red-300'
        };
      case 'projet':
        return {
          title: 'Supprimer le projet',
          message: itemName 
            ? `Êtes-vous sûr de vouloir supprimer le projet "${itemName}" ?`
            : 'Êtes-vous sûr de vouloir supprimer ce projet ?',
          warning: 'Cette action supprimera définitivement le projet et toutes les tâches associées.',
          confirmText: 'Oui, supprimer le projet',
          confirmClass: 'bg-red-600 hover:bg-red-800 focus:ring-red-300'
        };
      case 'tâche':
        return {
          title: 'Supprimer la tâche',
          message: itemName 
            ? `Êtes-vous sûr de vouloir supprimer la tâche "${itemName}" ?`
            : 'Êtes-vous sûr de vouloir supprimer cette tâche ?',
          warning: 'Cette action supprimera définitivement la tâche.',
          confirmText: 'Oui, supprimer la tâche',
          confirmClass: 'bg-red-600 hover:bg-red-800 focus:ring-red-300'
        };
      default:
        return {
          title: 'Supprimer l\'élément',
          message: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
          warning: 'Cette action est irréversible.',
          confirmText: 'Oui, supprimer',
          confirmClass: 'bg-red-600 hover:bg-red-800 focus:ring-red-300'
        };
    }
  };

  const config = getItemConfig();

  // Gestion de la fermeture avec Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md p-4 mx-4">
        <div className="relative bg-white rounded-lg shadow-lg">
          {/* Bouton de fermeture */}
          <button
            type="button"
            onClick={!isLoading ? onClose : undefined}
            disabled={isLoading}
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-3 h-3" />
            <span className="sr-only">Fermer la modale</span>
          </button>

          {/* Contenu */}
          <div className="p-6 text-center">
            {/* Icône d'avertissement */}
            <div className="mx-auto mb-4 text-red-600 w-12 h-12 flex items-center justify-center">
              <AlertTriangle className="w-12 h-12" />
            </div>

            {/* Titre */}
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              {config.title}
            </h3>

            {/* Message principal */}
            <p className="mb-3 text-base text-gray-500">
              {config.message}
            </p>

            {/* Avertissement */}
            <p className="mb-6 text-sm text-gray-400">
              {config.warning}
            </p>

            {/* Boutons d'action */}
            <div className="flex justify-center gap-3">
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`
                  text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center
                  focus:ring-4 focus:outline-none
                  disabled:opacity-50 disabled:cursor-not-allowed
                  inline-flex items-center justify-center gap-2
                  ${config.confirmClass}
                `}
              >
                {isLoading ? (
                  <LoaderDots size="sm" color="custom" customColor="bg-white" />
                ) : (
                  config.confirmText
                )}
              </button>
              
              <button
                onClick={onClose}
                disabled={isLoading}
                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-4 focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;