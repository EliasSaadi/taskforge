import React, { useState, useRef, useEffect } from 'react';

export interface RoleSelectProps {
  value: 'Chef de Projet' | 'Assistant' | 'Membre';
  onChange?: (value: 'Chef de Projet' | 'Assistant' | 'Membre') => void;
  disabled?: boolean;
}

const roleConfig = {
  'Chef de Projet': {
    label: 'Chef de Projet',
    bgColor: 'bg-tf-fuschia',
    textColor: 'text-tf-night'
  },
  'Assistant': {
    label: 'Assistant',
    bgColor: 'bg-tf-erin',
    textColor: 'text-tf-night'
  },
  'Membre': {
    label: 'Membre',
    bgColor: 'bg-tf-battleship',
    textColor: 'text-tf-night'
  }
};

// Fonction pour capitaliser la première lettre
const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const RoleSelect: React.FC<RoleSelectProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const currentRole = roleConfig[value];

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

  const handleRoleChange = (newRole: 'Chef de Projet' | 'Assistant' | 'Membre') => {
    if (!disabled && onChange) {
      onChange(newRole);
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
            px-3 py-1 rounded-full
            shadow-[3px_3px_6px_rgba(0,0,0,0.25)]
            ${currentRole.bgColor} ${currentRole.textColor}
            ${!disabled ? 'hover:shadow-[4px_4px_8px_rgba(0,0,0,0.3)] hover:scale-110 transition-all duration-200 cursor-pointer' : 'opacity-75 cursor-not-allowed'}
            w-[144px] text-center
          `}
          onClick={handleToggle}
          disabled={disabled}
        >
          {capitalizeFirst(currentRole.label)}
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1  w-[144px] shadow-[3px_3px_6px_rgba(0,0,0,0.25)] z-50">
          <div className="py-1" role="menu">
            {Object.entries(roleConfig).map(([roleKey, config]) => (
              <button
                key={roleKey}
                className={`
                  tf-text-button
                  ${config.bgColor} ${config.textColor}
                  block w-[144px] text-center px-3 py-1 rounded-full mx-1 mb-1
                  hover:shadow-[2px_2px_4px_rgba(0,0,0,0.2)] transition-all duration-150
                  ${roleKey === value ? '' : ''}
                `}
                role="menuitem"
                onClick={() => handleRoleChange(roleKey as 'Chef de Projet' | 'Assistant' | 'Membre')}
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

export default RoleSelect;
