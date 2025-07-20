import React, { useState } from 'react';
import { X, Calendar, FileText, Type } from 'lucide-react';
import { LoaderDots } from '@/components/ui';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: {
    nom: string;
    description: string;
    date_debut: string;
    date_fin: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    date_debut: '',
    date_fin: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom du projet est obligatoire';
    } else if (formData.nom.length < 3) {
      newErrors.nom = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.date_debut) {
      newErrors.date_debut = 'La date de début est obligatoire';
    }

    if (!formData.date_fin) {
      newErrors.date_fin = 'La date de fin est obligatoire';
    }

    if (formData.date_debut && formData.date_fin) {
      const dateDebut = new Date(formData.date_debut);
      const dateFin = new Date(formData.date_fin);
      
      if (dateDebut >= dateFin) {
        newErrors.date_fin = 'La date de fin doit être après la date de début';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de la soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      // Reset du formulaire après succès
      setFormData({
        nom: '',
        description: '',
        date_debut: '',
        date_fin: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
    }
  };

  // Gestion des changements dans les champs
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="tf-text-h2 text-tf-night font-bold">
            Créer un nouveau projet
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom du projet */}
          <div>
            <label className="flex items-center gap-2 tf-text-base font-medium text-tf-night mb-2">
              <Type size={16} />
              Nom du projet
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tf-dodger
                ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Entrez le nom du projet"
              disabled={isLoading}
            />
            {errors.nom && (
              <p className="tf-text-small text-red-600 mt-1">{errors.nom}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 tf-text-base font-medium text-tf-night mb-2">
              <FileText size={16} />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tf-dodger resize-none
                ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Décrivez votre projet"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="tf-text-small text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 tf-text-base font-medium text-tf-night mb-2">
                <Calendar size={16} />
                Date de début
              </label>
              <input
                type="date"
                value={formData.date_debut}
                onChange={(e) => handleChange('date_debut', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tf-dodger
                  ${errors.date_debut ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isLoading}
              />
              {errors.date_debut && (
                <p className="tf-text-small text-red-600 mt-1">{errors.date_debut}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 tf-text-base font-medium text-tf-night mb-2">
                <Calendar size={16} />
                Date de fin
              </label>
              <input
                type="date"
                value={formData.date_fin}
                onChange={(e) => handleChange('date_fin', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tf-dodger
                  ${errors.date_fin ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isLoading}
              />
              {errors.date_fin && (
                <p className="tf-text-small text-red-600 mt-1">{errors.date_fin}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-tf-dodger text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoaderDots size="sm" />
                  Création...
                </>
              ) : (
                'Créer le projet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
