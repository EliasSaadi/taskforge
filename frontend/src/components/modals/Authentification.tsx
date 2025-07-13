import { X, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/core/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoaderDots, LoaderSpin } from "../ui";

// Gestionnaire global des modales
const useModalManager = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    const handleShowLoginModal = () => setIsLoginModalOpen(true);
    const handleHideLoginModal = () => setIsLoginModalOpen(false);
    const handleShowRegisterModal = () => setIsRegisterModalOpen(true);
    const handleHideRegisterModal = () => setIsRegisterModalOpen(false);

    // Écouter les clics sur les boutons pour la modal de connexion
    const loginTriggers = document.querySelectorAll('[data-modal-target="loginModal"]');
    loginTriggers.forEach(trigger => {
      trigger.addEventListener('click', handleShowLoginModal);
    });

    const loginClosers = document.querySelectorAll('[data-modal-hide="loginModal"]');
    loginClosers.forEach(closer => {
      closer.addEventListener('click', handleHideLoginModal);
    });

    // Écouter les clics sur les boutons pour la modal d'inscription
    const registerTriggers = document.querySelectorAll('[data-modal-target="registerModal"]');
    registerTriggers.forEach(trigger => {
      trigger.addEventListener('click', handleShowRegisterModal);
    });

    const registerClosers = document.querySelectorAll('[data-modal-hide="registerModal"]');
    registerClosers.forEach(closer => {
      closer.addEventListener('click', handleHideRegisterModal);
    });

    return () => {
      loginTriggers.forEach(trigger => {
        trigger.removeEventListener('click', handleShowLoginModal);
      });
      loginClosers.forEach(closer => {
        closer.removeEventListener('click', handleHideLoginModal);
      });
      registerTriggers.forEach(trigger => {
        trigger.removeEventListener('click', handleShowRegisterModal);
      });
      registerClosers.forEach(closer => {
        closer.removeEventListener('click', handleHideRegisterModal);
      });
    };
  }, []);

  return {
    isLoginModalOpen,
    setIsLoginModalOpen,
    isRegisterModalOpen,
    setIsRegisterModalOpen
  };
};

// src/components/modals/AuthModals.tsx
const LoginModal = ({ isOpen, onClose, onSwitchToRegister }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSwitchToRegister: () => void; 
}) => {
  const navigate = useNavigate();
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleConnectSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      setIsRedirecting(true);
      onClose();
      
      // Petit délai pour afficher le loader avant la redirection
      setTimeout(() => {
        navigate("/dashboard");
        setIsRedirecting(false);
      }, 1000);
    } catch {
      // L'erreur est déjà stockée dans le contexte
    }
  }

  // États pour gérer la visibilité du mots de passe
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Fonctions pour basculer la visibilité du mots de passe
  const toggleLoginPassword = () => setShowLoginPassword(!showLoginPassword);

  return (
    <>
      {/* LoaderSpin en plein écran pendant la redirection */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
          <LoaderSpin size="xl" />
        </div>
      )}
      
      {/* Modal Connexion */}
      <div
        id="loginModal"
        tabIndex={-1}
        className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto
                   md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black/40 ${isOpen ? 'block' : 'hidden'}`}
      >
        <div className="relative w-full max-w-md max-h-full mx-auto mt-20 tf-text-base">
          <div className="relative bg-tf-platinum rounded-2xl w-[480px] min-h-[360px] p-8 shadow">
            <div className="flex items-center justify-between">
              <h3 className="tf-text-h3">Connexion</h3>
              <button
                type="button"
                className="tf-text-base"
                onClick={onClose}
              >
                <X />
              </button>
            </div>
            <div className="tf-text-base">
              <form onSubmit={handleConnectSubmit} className="space-y-4">
                <div className="flex flex-col items-left">
                  <div className="flex flex-col gap-4">
                    <div className="">
                      <label htmlFor="email" className="tf-text-label">Email*</label>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="exemple@exemple.com" 
                        className="w-full px-4 py-3 border-2 rounded-lg bg-tf-platinum" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
                    </div>

                    <div className="">
                      <label htmlFor="mdp" className="tf-text-label">Mot de passe*</label>
                      <div className="flex w-full gap-2">
                        <input 
                          type={showLoginPassword ? "text" : "password"} 
                          name="mdp" 
                          placeholder="Mot de passe" 
                          className="w-full px-4 py-3 border-2 rounded-lg bg-tf-platinum" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <div 
                          onClick={toggleLoginPassword}
                          className="flex items-center justify-center rounded-lg p-[10px] border-2 border-tf-night cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff /> : <Eye />}
                        </div>
                      </div>
                      {error && <p className="text-tf-folly py-2  ">{error}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center gap-1 px-2 py-1">
                      <input type="checkbox" id="rememberMe" className="w-4 h-4 bg-tf-platinum border-2 border-tf-night rounded-sm" />
                      <label htmlFor="rememberMe" className="tf-text-secondaire">Se souvenir de moi</label>
                    </div>
                    <a href="#" className="tf-text-label hover:underline">Mot de passe oublié ?</a>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                  <button
                    type="submit"
                    className="bg-tf-erin px-5 py-3 tf-text-button rounded-lg hover:bg-tf-lime
                                hover:scale-105 duration-300 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <LoaderDots size="sm" color="custom" customColor="bg-tf-night" />
                    ) : (
                      "Se connecter"
                    )}
                  </button>
                  <div className="flex gap-1 items-center justify-center">
                    <span> Vous n'avez pas de compte ? </span>
                    <a href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        onSwitchToRegister();
                      }}
                      className="hover:underline"> Créer un compte </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }: {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}) => {
  const navigate = useNavigate();
  const { register, error, loading } = useAuth();
  
  // États pour les champs du formulaire
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // États pour gérer la visibilité des mots de passe
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fonctions pour basculer la visibilité des mots de passe
  const toggleRegisterPassword = () => setShowRegisterPassword(!showRegisterPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(prenom, nom, email, password, passwordConfirmation);
      setIsRedirecting(true);
      onClose();
      
      // Petit délai pour afficher le loader avant la redirection
      setTimeout(() => {
        navigate("/dashboard");
        setIsRedirecting(false);
      }, 1000);
    } catch {
      // L'erreur est déjà stockée dans le contexte
    }
  }


  return (
    <>
      {/* LoaderSpin en plein écran pendant la redirection */}
      {isRedirecting && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center">
          <LoaderSpin size="xl" />
        </div>
      )}
      
      {/* Modal Inscription */}
      <div
        id="registerModal"
        tabIndex={-1}
        className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto
                   md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black/40 ${isOpen ? 'block' : 'hidden'}`}
      >
        <div className="relative w-full max-w-md max-h-full mx-auto mt-20 tf-text-base">
          <div className="relative bg-tf-platinum rounded-2xl w-[520px] min-h-[360px] p-8 shadow">
            <div className="flex items-center justify-between">
              <h3 className="tf-text-h3">Inscription</h3>
              <button
                type="button"
                className="tf-text-base"
                onClick={onClose}
              >
                <X />
              </button>
            </div>
            <div className="tf-text-base">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="flex flex-col items-left">
                  <div className="flex flex-col">
                    <div className="flex gap-4">
                      <div>
                        <label htmlFor="lastName" className="tf-text-label">Nom*</label>
                        <input 
                          type="text" 
                          name="lastName" 
                          placeholder="Nom" 
                          className="w-full px-4 py-3 border-2 rounded-lg bg-tf-platinum" 
                          value={nom}
                          onChange={(e) => setNom(e.target.value)}
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="firstName" className="tf-text-label">Prénom*</label>
                        <input 
                          type="text" 
                          name="firstName" 
                          placeholder="Prénom" 
                          className="w-full px-4 py-3 border-2 rounded-lg bg-tf-platinum" 
                          value={prenom}
                          onChange={(e) => setPrenom(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="tf-text-label">Email*</label>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="exemple@exemple.com" 
                        className="w-full px-4 py-3 border-2 rounded-lg bg-tf-platinum" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                    </div>

                    <div>
                      <label htmlFor="mdp" className="tf-text-label">Mot de passe*</label>
                      <div className="flex w-full gap-2">
                        <input 
                          type={showRegisterPassword ? "text" : "password"} 
                          name="mdp" 
                          placeholder="Mot de passe" 
                          className="w-full px-4 py-3 border-2 rounded-lg bg-tf-platinum" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <div 
                          onClick={toggleRegisterPassword}
                          className="flex items-center justify-center rounded-lg p-[10px] border-2 border-tf-night cursor-pointer"
                        >
                          {showRegisterPassword ? <EyeOff /> : <Eye />}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="mdp" className="tf-text-label">Confirmer le mot de passe*</label>
                      <div className="flex w-full gap-2">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          name="confirmMdp" 
                          placeholder="Confirmer le mot de passe" 
                          className="w-full px-4 py-3 border-2 rounded-lg bg-tf-platinum" 
                          value={passwordConfirmation}
                          onChange={(e) => setPasswordConfirmation(e.target.value)}
                          required
                        />
                        <div 
                          onClick={toggleConfirmPassword}
                          className="flex items-center justify-center rounded-lg p-[10px] border-2 border-tf-night cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </div>
                      </div>
                    </div>
                    {error && <p className="text-tf-folly py-2">{error}</p>}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-tf-erin px-5 py-3 tf-text-button rounded-lg hover:bg-tf-lime
                                hover:scale-105 duration-300 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <LoaderDots size="sm" color="custom" customColor="bg-tf-night" />
                    ) : (
                      "S'inscrire"
                    )}
                  </button>
                </div>
              </form>
              <div className="flex gap-1 items-center justify-center">
                <span> Vous possédez un compte ? </span>
                <a href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onSwitchToLogin();
                  }}
                  className="hover:underline"> Se connecter </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Composant principal qui gère les deux modales
const AuthModals = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, isRegisterModalOpen, setIsRegisterModalOpen } = useModalManager();

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setTimeout(() => setIsRegisterModalOpen(true), 100);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setTimeout(() => setIsLoginModalOpen(true), 100);
  };

  return (
    <>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export { LoginModal, RegisterModal, AuthModals };