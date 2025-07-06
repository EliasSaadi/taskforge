import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { LoaderSpin } from './ui';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * Composant qui protège les routes privées
 * Redirige vers la page d'accueil si l'utilisateur n'est pas connecté
 */
export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  // Pendant le chargement, on peut afficher un loader ou rien
  if (loading) {
    return <LoaderSpin fullScreen={true} />;
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est connecté, afficher le contenu
  return <>{children}</>;
}
