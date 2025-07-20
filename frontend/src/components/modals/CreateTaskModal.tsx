import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, Type, Users } from 'lucide-react';
import { LoaderDots } from '@/components/ui';
import type { MembreProjet } from '@/interfaces';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    titre: string;
    description: string;
    statut: 'à faire' | 'en cours' | 'terminé';
    date_debut: string;
    date_limite: string;
    project_id: number;
    assignedUsers?: number[];
  }) => Promise<void>;
  projectId: number;
  projectMembers?: MembreProjet[];
  isLoading?: boolean;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  projectMembers = [],
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    statut: 'à faire' as const,
    date_debut: '',
    date_limite: '',
    assignedUsers: [] as number[]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset du formulaire quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      setFormData({
        titre: '',
        description: '',
        statut: 'à faire',
        date_debut: today,
        date_limite: nextWeek,
        assignedUsers: []
      });
      setErrors({});
    }
  }, [isOpen]);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre de la tâche est obligatoire';
    } else if (formData.titre.length < 3) {
      newErrors.titre = 'Le titre doit contenir au moins 3 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.date_debut) {
      newErrors.date_debut = 'La date de début est obligatoire';
    }

    if (!formData.date_limite) {
      newErrors.date_limite = 'La date limite est obligatoire';
    }

    if (formData.date_debut && formData.date_limite) {
      const dateDebut = new Date(formData.date_debut);
      const dateLimite = new Date(formData.date_limite);
      
      if (dateDebut >= dateLimite) {
        newErrors.date_limite = 'La date limite doit être après la date de début';
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
      await onSubmit({
        ...formData,
        project_id: projectId,
        assignedUsers: formData.assignedUsers
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
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

  // Gestion de l'assignation des utilisateurs
  const toggleUserAssignment = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter(id => id !== userId)
        : [...prev.assignedUsers, userId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="tf-text-h2 text-tf-night font-bold">
            Créer une nouvelle tâche
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
          {/* Titre de la tâche */}
          <div>
            <label className="flex items-center gap-2 tf-text-base font-medium text-tf-night mb-2">
              <Type size={16} />
              Titre de la tâche
            </label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => handleChange('titre', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tf-dodger
                ${errors.titre ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Entrez le titre de la tâche"
              disabled={isLoading}
            />
            {errors.titre && (
              <p className="tf-text-small text-red-600 mt-1">{errors.titre}</p>
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
              placeholder="Décrivez la tâche"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="tf-text-small text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Statut */}
          <div>
            <label className="tf-text-base font-medium text-tf-night mb-2 block">
              Statut initial
            </label>
            <select
              value={formData.statut}
              onChange={(e) => handleChange('statut', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tf-dodger"
              disabled={isLoading}
            >
              <option value="à faire">À faire</option>
              <option value="en cours">En cours</option>
              <option value="terminé">Terminé</option>
            </select>
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
                Date limite
              </label>
              <input
                type="date"
                value={formData.date_limite}
                onChange={(e) => handleChange('date_limite', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tf-dodger
                  ${errors.date_limite ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isLoading}
              />
              {errors.date_limite && (
                <p className="tf-text-small text-red-600 mt-1">{errors.date_limite}</p>
              )}
            </div>
          </div>

          {/* Assignation des membres */}
          {projectMembers.length > 0 && (
            <div>
              <label className="flex items-center gap-2 tf-text-base font-medium text-tf-night mb-2">
                <Users size={16} />
                Assigner aux membres (optionnel)
              </label>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                {projectMembers.map((member) => (
                  <label key={member.id} className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.assignedUsers.includes(member.id)}
                      onChange={() => toggleUserAssignment(member.id)}
                      className="rounded"
                      disabled={isLoading}
                    />
                    <div className="w-6 h-6 bg-tf-fuschia text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {member.prenom.charAt(0).toUpperCase()}
                    </div>
                    <span className="tf-text-small">
                      {member.prenom} {member.nom} - {member.role}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

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
                'Créer la tâche'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
