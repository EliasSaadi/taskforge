import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export interface NotificationProps {
  /** Type de notification */
  type: 'success' | 'error';
  /** Message à afficher */
  message: string;
  /** Fonction pour fermer la notification */
  onClose: () => void;
  /** Titre optionnel (par défaut selon le type) */
  title?: string;
}

/**
 * Composant de notification réutilisable pour afficher des messages de succès ou d'erreur
 */
export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  onClose,
  title
}) => {
  // Configuration selon le type
  const config = {
    success: {
      bgColor: 'bg-green-100',
      borderColor: 'border-green-400',
      textColor: 'text-green-700',
      iconColor: 'text-green-500',
      buttonHover: 'hover:text-green-700',
      icon: CheckCircle,
      defaultTitle: 'Succès'
    },
    error: {
      bgColor: 'bg-red-100',
      borderColor: 'border-red-400',
      textColor: 'text-red-700',
      iconColor: 'text-red-500',
      buttonHover: 'hover:text-red-700',
      icon: AlertCircle,
      defaultTitle: 'Erreur'
    }
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;
  const displayTitle = title || currentConfig.defaultTitle;

  return (
    <div className={`
      ${currentConfig.bgColor} ${currentConfig.borderColor} ${currentConfig.textColor}
      border px-4 py-3 rounded-lg shadow-lg flex items-start gap-3
      animate-in slide-in-from-right duration-300
    `}>
      <Icon className={`w-5 h-5 ${currentConfig.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <strong className="font-bold">{displayTitle}</strong>
        <p className="text-sm mt-1">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className={`${currentConfig.iconColor} ${currentConfig.buttonHover} flex-shrink-0 transition-colors`}
        aria-label="Fermer la notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notification;
