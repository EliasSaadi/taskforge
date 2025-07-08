import React, { useState, useRef, useEffect } from 'react';

export interface StatusSelectProps {
  value: 'à faire' | 'en cours' | 'terminé';
  onChange?: (value: 'à faire' | 'en cours' | 'terminé') => void;
  disabled?: boolean;
}

const statusConfig = {
  'à faire': {
    label: 'À faire',
    bgColor: 'bg-tf-dodger', // Dodger blue
    textColor: 'text-tf-night'
  },
  'en cours': {
    label: 'En cours',
    bgColor: 'bg-tf-saffron', // Safran
    textColor: 'text-tf-night'
  },
  'terminé': {
    label: 'Terminé',
    bgColor: 'bg-tf-erin', // Erin
    textColor: 'text-tf-night'
  }
};

// Fonction pour capitaliser la première lettre
const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const currentStatus = statusConfig[value];

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusChange = (newStatus: 'à faire' | 'en cours' | 'terminé') => {
    if (!disabled && onChange) {
      onChange(newStatus);
      setIsOpen(false);
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={selectRef}>
      {/* Bouton principal */}
      <div>
        <button
          type="button"
          className={`
            tf-text-button
            px-3 py-1 rounded-md
            shadow-[3px_3px_6px_rgba(0,0,0,0.25)]
            ${currentStatus.bgColor} ${currentStatus.textColor}
            ${!disabled ? 'hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3)] hover:scale-110 transition-all duration-200 cursor-pointer' : 'opacity-75 cursor-not-allowed'}
            min-w-[100px] text-center
          `}
          onClick={handleToggle}
          disabled={disabled}
        >
          {capitalizeFirst(currentStatus.label)}
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 min-w-[100px] shadow-[3px_3px_6px_rgba(0,0,0,0.25)] z-50">
          <div className="py-1" role="menu">
            {Object.entries(statusConfig).map(([statusKey, config]) => (
              <button
                key={statusKey}
                className={`
                  tf-text-button
                  ${config.bgColor} ${config.textColor}
                  block w-full text-center px-3 py-1
                  hover:shadow-[2px_2px_4px_rgba(0,0,0,0.2)] transition-all duration-150
                  ${statusKey === value ? '' : ''}
                `}
                role="menuitem"
                onClick={() => handleStatusChange(statusKey as 'à faire' | 'en cours' | 'terminé')}
              >
                {capitalizeFirst(config.label)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusSelect;