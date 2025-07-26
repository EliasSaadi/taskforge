import { Link } from 'react-router-dom';
import { useState } from 'react';
import { LogOut, Plus, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { useAuth } from '@/contexts/core/AuthContext'; 

// Header.jsx
const Header = () => {
  const isAuthenticated = useAuth().isAuthenticated;
  
  const [showPanel, setShowPanel] = useState(false);
  const togglePanel = () => setShowPanel(!showPanel);

  return (
    <header className="flex items-center justify-between h-20 py-4 border-b-2 border-tf-davys px-8">
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <div 
              onClick={togglePanel}
              className="flex justify-center items-center rounded-lg cursor-pointer text-tf-night"
            >
              {showPanel ? <PanelRightClose size={32} /> : <PanelLeftClose size={32} />}
            </div>
          </>
        ) : ( <> </> )}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="tf-text-h3 hover:scale-105 duration-300 transition-transform" aria-label="Page d'accueil">
          TaskForge
        </Link>
      </div>
      {isAuthenticated ? (
        // Si l'utilisateur est connecté, afficher la barre de recherche
        <>
          <div className="flex justify-center items-center gap-4 max-w-3xl w-full h-full">
            <input
              id="searchProjects"
              name="search"
              type="text"
              placeholder="Rechercher..."
              className="w-full px-5 border rounded-lg bg-tf-platinum tf-text-button placeholder:text-tf-davys h-full
                          focus:outline-none focus:ring-2 focus:ring-tf-dodger focus:border-tf-dodger"
              aria-label="Barre de recherche"
            />
            <button 
              data-modal-target="registerModal"
              data-modal-toggle="registerModal"
              className="bg-tf-dodger px-5 py-3 tf-text-button rounded-lg flex items-center gap-1"
              aria-label="Créer un nouveau projet"
            >
              <Plus/> Créer
            </button>
          </div>
        </>
      ) : ( <> </> )}
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
