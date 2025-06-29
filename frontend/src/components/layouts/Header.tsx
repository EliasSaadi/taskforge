import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

// Header.jsx
const Header = () => {
  // TODO: Remplacer par votre système d'authentification réel
  const isAuthenticated = false; // ou useAuth(), useContext(), etc.

  return (
    <header className="flex items-center justify-between h-20 py-4">
      <Link to="/" className="tf-text-h3 hover:scale-105 duration-300 transition-transform" aria-label="Page d'accueil">
        TaskForge
      </Link>
      <nav className="flex items-center gap-4 h-full" role="navigation" aria-label="Navigation principale">
        {isAuthenticated ? (
          // Navigation pour utilisateur connecté
          <>
            <button 
              onClick={() => alert('Déconnexion non implémentée')}
              className="bg-tf-folly px-5 py-3 tf-text-button rounded-lg 
                          hover:scale-105 duration-300 transition-transform"
              aria-label="Se déconnecter"
            >
              <LogOut className="rotate-180" />
              <span className="sr-only">Se déconnecter</span>
            </button>
            <div className="h-full p-px bg-tf-davys" role="separator"></div>
            <Link 
              to="/mon-profil"
              className="bg-tf-fuschia px-5 py-3 tf-text-button rounded-lg hover:bg-tf-steelpink 
                          hover:scale-105 duration-300 transition-transform"
              aria-label="Mon Profil"
            >
              Mon Profil
            </Link>
          </>
        ) : (
          // Navigation pour utilisateur non connecté
          <>
            <button
              data-modal-target="registerModal"
              data-modal-toggle="registerModal"
              className="bg-tf-erin px-5 py-3 tf-text-button rounded-lg hover:bg-tf-lime
                          hover:scale-105 duration-300 transition-transform"
            >
              Inscription
            </button>
            <div className="h-full p-px bg-tf-davys" role="separator"></div>
            <button
              data-modal-target="loginModal"
              data-modal-toggle="loginModal"
              className="bg-tf-fuschia px-5 py-3 tf-text-button rounded-lg hover:bg-tf-steelpink
                          hover:scale-105 duration-300 transition-transform"
            >
              Connexion
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
