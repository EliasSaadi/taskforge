import React from 'react';
import { useDelete } from '@/contexts/DeleteContext';
import { X, AlertCircle } from 'lucide-react';

/**
 * Composant pour afficher les notifications d'erreur de suppression
 */
export const DeleteErrorNotification: React.FC = () => {
  const { error, clearError } = useDelete();

  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <strong className="font-bold">Erreur de suppression</strong>
          <p className="text-sm mt-1">{error}</p>
        </div>
        <button 
          onClick={clearError}
          className="text-red-500 hover:text-red-700 flex-shrink-0"
          aria-label="Fermer la notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DeleteErrorNotification;
