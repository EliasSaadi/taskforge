import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// src/components/modals/AuthModals.tsx
const LoginModal = () => {

  const navigate = useNavigate();

  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState("user1@test.com");
  const [password, setPassword] = useState("password1");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
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
      {/* Modal Connexion */}
      <div
        id="loginModal"
        tabIndex={-1}
        className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto
                   md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black/40"
      >
        <div className="relative w-full max-w-md max-h-full mx-auto mt-20 tf-text-base">
          <div className="relative bg-tf-platinum rounded-2xl w-[480px] min-h-[360px] p-8 shadow">
            <div className="flex items-center justify-between">
              <h3 className="tf-text-h3">Connexion</h3>
              <button
                type="button"
                className="tf-text-base"
                data-modal-hide="loginModal"
              >
                <X />
              </button>
            </div>
            <div className="tf-text-base">
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="bg-tf-erin px-5 py-3 tf-text-button rounded-lg hover:bg-tf-lime
                                hover:scale-105 duration-300 transition-transform"
                  >
                    {loading ? "Connexion..." : "Se connecter"}
                  </button>
                  <div className="flex gap-1 items-center justify-center">
                    <span> Vous n'avez pas de compte ? </span>
                    <a href="#" 
                      data-modal-hide="loginModal"
                      data-modal-target="registerModal" 
                      data-modal-toggle="registerModal"
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


const RegisterModal = () => {
  const navigate = useNavigate();

  // États pour gérer la visibilité des mots de passe
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fonctions pour basculer la visibilité des mots de passe
  const toggleRegisterPassword = () => setShowRegisterPassword(!showRegisterPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);


  return (
    <>
    {/* Modal Inscription */}
      <div
        id="registerModal"
        tabIndex={-1}
        className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto
                   md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black/40"
      >
        <div className="relative w-full max-w-md max-h-full mx-auto mt-20 tf-text-base">
          <div className="relative bg-tf-platinum rounded-2xl w-[520px] min-h-[360px] p-8 shadow">
            <div className="flex items-center justify-between">
              <h3 className="tf-text-h3">Inscription</h3>
              <button
                type="button"
                className="tf-text-base"
                data-modal-hide="registerModal"
              >
                <X />
              </button>
            </div>
            <div className="tf-text-base">
              <form className="space-y-4">
                <div className="flex flex-col items-left">
                  <div className="flex flex-col">
                    <div className="flex gap-4">
                      <div>
                        <label htmlFor="lastName" className="tf-text-label">Nom*</label>
                        <input type="text" name="lastName" placeholder="Nom" className="w-full px-4 py-3 border-2 rounded-lg bg-tf-platinum" required />
                      </div>
                      <div>
                        <label htmlFor="firstName" className="tf-text-label">Prénom*</label>
                        <input type="text" name="firstName" placeholder="Prénom" className="w-full px-4 py-3 border-2 rounded-lg bg-tf-platinum" required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="tf-text-label">Email*</label>
                      <input type="email" name="email" placeholder="exemple@exemple.com" className="w-full px-4 py-3 border-2 rounded-lg bg-tf-platinum" required />
                    </div>

                    <div>
                      <label htmlFor="mdp" className="tf-text-label">Mot de passe*</label>
                      <div className="flex w-full gap-2">
                        <input 
                          type={showRegisterPassword ? "text" : "password"} 
                          name="mdp" 
                          placeholder="Mot de passe" 
                          className="w-full px-4 py-3 border-2 rounded-lg bg-tf-platinum" 
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
                          name="mdp" 
                          placeholder="Mot de passe" 
                          className="w-full px-4 py-3 border-2 rounded-lg bg-tf-platinum" 
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
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                  <button
                    className="bg-tf-erin px-5 py-3 tf-text-button rounded-lg hover:bg-tf-lime
                                hover:scale-105 duration-300 transition-transform"
                  >
                    S'inscrire
                  </button>
                </div>
              </form>
              <div className="flex gap-1 items-center justify-center">
                <span> Vous possédez un compte ? </span>
                <a href="#" 
                  data-modal-hide="registerModal"
                  data-modal-target="loginModal" 
                  data-modal-toggle="loginModal" 
                  className="hover:underline"> Se connecter </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { LoginModal, RegisterModal };