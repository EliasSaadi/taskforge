import { useAuth } from '@/contexts/core/AuthContext';
import { Navigate } from 'react-router-dom';
import { LoaderSpin } from './ui';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Composant qui protège les routes publiques
 * Redirige vers le dashboard si l'utilisateur est déjà connecté
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  // Pendant le chargement, on peut afficher un loader ou rien
  if (loading) {
    return <LoaderSpin fullScreen={true} />;
  }

  // Si l'utilisateur est connecté, rediriger vers le dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si l'utilisateur n'est pas connecté, afficher le contenu public
  return <>{children}</>;
}
