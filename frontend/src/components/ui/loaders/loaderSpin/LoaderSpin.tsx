interface LoaderSpinProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  className?: string;
}

/**
 * Composant LoaderSpin réutilisable avec animation de double cercle
 * @param size - Taille du loader (sm, md, lg, xl)
 * @param fullScreen - Si true, occupe tout l'écran avec min-h-screen
 * @param className - Classes CSS supplémentaires
 */
export function LoaderSpin({ 
  size = 'lg', 
  fullScreen = false, 
  className = '' 
}: LoaderSpinProps) {
  
  // Configuration des tailles
  const sizeConfig = {
    sm: {
      outer: 'w-8 h-8',
      inner: 'w-6 h-6',
      text: 'text-lg',
      innerText: 'text-sm'
    },
    md: {
      outer: 'w-12 h-12',
      inner: 'w-10 h-10',
      text: 'text-2xl',
      innerText: 'text-lg'
    },
    lg: {
      outer: 'w-20 h-20',
      inner: 'w-16 h-16',
      text: 'text-4xl',
      innerText: 'text-2xl'
    },
    xl: {
      outer: 'w-28 h-28',
      inner: 'w-24 h-24',
      text: 'text-5xl',
      innerText: 'text-3xl'
    }
  };

  const config = sizeConfig[size];
  
  // Classes pour le conteneur
  const containerClasses = fullScreen 
    ? "flex-col gap-4 w-full flex items-center justify-center min-h-screen"
    : "flex-col gap-4 flex items-center justify-center";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div
        className={`${config.outer} border-4 border-transparent text-tf-erin ${config.text} animate-spin flex items-center justify-center border-t-tf-erin rounded-full`}
      >
        <div
          className={`${config.inner} border-4 border-transparent text-tf-fuschia ${config.innerText} animate-spin flex items-center justify-center border-t-tf-fuschia rounded-full`}
        >
        </div>
      </div>
    </div>
  );
}
