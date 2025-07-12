import React from 'react';
import { User, CheckCircle, Clock, Circle } from 'lucide-react';

interface MemberCardProps {
  member: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    role: 'Chef de Projet' | 'Assistant' | 'Membre';
    tasksStats: {
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

  // Calculer le pourcentage de progression
  const progressPercentage = member.tasksStats.total > 0 
    ? Math.round((member.tasksStats.completed / member.tasksStats.total) * 100)
    : 0;

  const handleCardClick = () => {
    if (onMemberClick) {
      onMemberClick(member.id);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`rounded-lg p-4 border-2 border-tf-battleship bg-tf-platinum
        shadow-[3px_3px_6px_rgba(0,0,0,0.25)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3)] 
        hover:scale-[1.02] transition-all duration-300 
        w-[320px] min-h-[180px]
        flex flex-col justify-between
        relative ${onMemberClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Header avec nom et rôle */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${roleDisplay.color} flex items-center justify-center`}>
            <User size={20} />
          </div>
          <div>
            <h3 className="tf-text-h4 text-tf-night font-semibold">
              {member.prenom} {member.nom}
            </h3>
            <p className="tf-text-small text-tf-battleship">
              {member.email}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium min-w-max ${roleDisplay.color}`}>
          {roleDisplay.label}
        </div>
      </div>

      {/* Statistiques des tâches */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="tf-text-base text-tf-night">
            Tâches assignées
          </span>
          <span className="tf-text-base font-semibold text-tf-night">
            {member.tasksStats.total}
          </span>
        </div>

        {/* Barre de progression */}
        <div className="w-full h-2 bg-white rounded-full border border-tf-night">
          {progressPercentage > 0 && (
            <div 
              className="bg-tf-fuschia h-full rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          )}
        </div>

        {/* Répartition des tâches */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle size={12} className="text-green-600" />
            <span className="text-tf-night">
              {member.tasksStats.completed} terminées
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-orange-600" />
            <span className="text-tf-night">
              {member.tasksStats.inProgress} en cours
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Circle size={12} className="text-gray-600" />
            <span className="text-tf-night">
              {member.tasksStats.todo} à faire
            </span>
          </div>
        </div>

        {/* Pourcentage de progression */}
        <div className="text-center">
          <span className="tf-text-small font-medium text-tf-battleship">
            {progressPercentage}% de progression
          </span>
        </div>
      </div>
    </div>
  );
};
