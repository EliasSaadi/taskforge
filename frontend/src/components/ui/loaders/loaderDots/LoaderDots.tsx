interface LoaderDotsProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'red' | 'gray' | 'custom';
  customColor?: string;
  className?: string;
}

/**
 * Composant LoaderDots avec animation de rebond
 * @param size - Taille des points (xs, sm, md, lg)
 * @param color - Couleur prédéfinie des points
 * @param customColor - Couleur personnalisée (utilisée avec color='custom')
 * @param className - Classes CSS supplémentaires
 */
export function LoaderDots({ 
  size = 'md', 
  color = 'blue',
  customColor,
  className = '' 
}: LoaderDotsProps) {
  
  // Configuration des tailles
  const sizeConfig = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3', 
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  // Configuration des couleurs prédéfinies
  const colorConfig = {
    blue: 'bg-tf-dodger',
    green: 'bg-tf-erin',
    purple: 'bg-tf-fuschia',
    red: 'bg-tf-folly',
    gray: 'bg-tf-davys',
    custom: customColor || 'bg-tf-dodger'
  };

  const dotSize = sizeConfig[size];
  const dotColor = color === 'custom' ? customColor || 'bg-tf-dodger' : colorConfig[color];

  return (
    <div className={`flex flex-row gap-2 ${className}`}>
      <div className={`${dotSize} rounded-full ${dotColor} animate-bounce`}></div>
      <div className={`${dotSize} rounded-full ${dotColor} animate-bounce [animation-delay:.3s]`}></div>
      <div className={`${dotSize} rounded-full ${dotColor} animate-bounce [animation-delay:.5s]`}></div>
    </div>
  );
}
