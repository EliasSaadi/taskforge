import React from 'react';
import { User, CheckCircle, Clock, Circle } from 'lucide-react';

interface MemberCardProps {
  member: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    role: string;
    tasksStats?: {
      total: number;
      completed: number;
      inProgress: number;
      todo: number;
    };
  };
  onMemberClick?: (memberId: number) => void;
}

/**
 * Composant carte membre pour afficher les informations d'un membre du projet
 * avec ses statistiques de tâches
 */
export const MemberCard: React.FC<MemberCardProps> = ({ 
  member, 
  onMemberClick 
}) => {
  // Fonction pour obtenir l'icône et la couleur selon le rôle
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'Chef de Projet':
        return { 
          color: 'bg-tf-fuschia text-white',
          textColor: 'text-tf-fuschia',
          label: 'Chef de Projet'
        };
      case 'Assistant':
        return { 
          color: 'bg-tf-erin text-white',
          textColor: 'text-tf-erin',
          label: 'Assistant'
        };
      default:
        return { 
          color: 'bg-tf-battleship text-white',
          textColor: 'text-tf-battleship',
          label: 'Membre'
        };
    }
  };

  const roleDisplay = getRoleDisplay(member.role);

  // Calculer le pourcentage de progression avec gestion de l'absence de tasksStats
  const tasksStats = member.tasksStats || { total: 0, completed: 0, inProgress: 0, todo: 0 };
  const progressPercentage = tasksStats.total > 0 
    ? Math.round((tasksStats.completed / tasksStats.total) * 100)
    : 0;

  const handleCardClick = () => {
    if (onMemberClick) {
      onMemberClick(member.id);
    }
  };

  return (
    <div 
      className="bg-tf-silver border border-tf-night rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header avec avatar et nom */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-tf-night rounded-full flex items-center justify-center">
          <User className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-tf-night">
            {member.prenom} {member.nom}
          </h3>
          <p className="text-sm text-tf-battleship">
            {member.email}
          </p>
        </div>
      </div>

      {/* Badge de rôle */}
      <div className="mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleDisplay.color}`}>
          {roleDisplay.label}
        </span>
      </div>

      {/* Section statistiques des tâches */}
      <div className="space-y-3">
        {/* Total des tâches */}
        <div className="flex items-center justify-between">
          <span className="text-base text-tf-night">
            Tâches assignées
          </span>
          <span className="text-base font-semibold text-tf-night">
            {tasksStats.total}
          </span>
        </div>

        {/* Barre de progression */}
        <div className="w-full h-2 bg-white rounded-full border border-tf-night">
          <div 
            className="h-full bg-gradient-to-r from-tf-fuschia to-tf-erin rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Détail des statistiques */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle size={12} className="text-green-600" />
            <span className="text-tf-night">
              {tasksStats.completed} terminées
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-orange-600" />
            <span className="text-tf-night">
              {tasksStats.inProgress} en cours
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Circle size={12} className="text-gray-600" />
            <span className="text-tf-night">
              {tasksStats.todo} à faire
            </span>
          </div>
        </div>

        {/* Pourcentage de progression */}
        <div className="text-right">
          <span className={`text-sm font-medium ${roleDisplay.textColor}`}>
            {progressPercentage}% complété
          </span>
        </div>
      </div>
    </div>
  );
};
