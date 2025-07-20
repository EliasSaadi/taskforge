interface LoaderDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

export function LoaderDots({ size = 'md', color = 'primary' }: LoaderDotsProps) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2', 
    lg: 'w-3 h-3'
  };

  const colorClasses = {
    primary: 'bg-tf-dodger',
    secondary: 'bg-tf-fuschia', 
    white: 'bg-white'
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
        style={{ animationDelay: '0ms' }}
      />
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
        style={{ animationDelay: '150ms' }}
      />
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}
