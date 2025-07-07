import { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";
import type {Utilisateur} from "@/interfaces/data";

export type User = Utilisateur

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (prenom: string, nom: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isLoggingOut: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Vérifier l'état d'authentification au démarrage
  // en tentant de récupérer l'utilisateur connecté
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Essayer de récupérer l'utilisateur sans cookie CSRF d'abord
        const response = await api.get("/api/user");
        if (response.data) {
          setUser(response.data);
        }
      } catch (err) {
        // Si ça échoue, l'utilisateur n'est pas connecté (normal)
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);


  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await api.get("/sanctum/csrf-cookie");
      const loginResponse = await api.post("/api/login", { email, password });
      
      // Utilisons directement les données utilisateur de la réponse de login
      if (loginResponse.data && loginResponse.data.user) {
        setUser(loginResponse.data.user);
      } else {
        // Fallback : essayer de récupérer via /api/user
        const res = await api.get("/api/user");
        setUser(res.data);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message === "These credentials do not match our records."
          ? "Email ou mot de passe incorrect."
          : "Erreur lors de la connexion.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (prenom: string, nom: string, email: string, password: string, password_confirmation: string) => {
    setLoading(true);
    setError(null);

    try {
      await api.get("/sanctum/csrf-cookie");
      const registerResponse = await api.post("/api/register", { 
        prenom, 
        nom, 
        email, 
        password, 
        password_confirmation 
      });
      
      // Utilisons directement les données utilisateur de la réponse d'inscription
      if (registerResponse.data && registerResponse.data.user) {
        setUser(registerResponse.data.user);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Erreur lors de l'inscription.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/api/logout");
    } catch (err) {
      // Ignorer les erreurs de déconnexion (utilisateur déjà déconnecté, etc.)
      console.log("Erreur lors de la déconnexion (ignorée):", err);
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
      setIsLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading, isLoggingOut, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
