import { useAuth } from '@/contexts/core/AuthContext';
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
  const { isAuthenticated, loading, user } = useAuth();

  // Pendant le chargement initial, afficher un loader
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <LoaderSpin size="xl" />
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté OU s'il n'y a pas d'utilisateur, rediriger vers la page d'accueil
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est connecté, afficher le contenu
  return <>{children}</>;
}
