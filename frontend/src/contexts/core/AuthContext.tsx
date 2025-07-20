import { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";
import type { Utilisateur } from "@/interfaces";

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
  clearError: () => void;
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
        // D'abord récupérer le cookie CSRF pour Laravel Sanctum
        await api.get("/sanctum/csrf-cookie");
        
        // Ensuite essayer de récupérer l'utilisateur connecté
        const response = await api.get("/api/user");
        
        // Vérifier que la réponse contient bien un utilisateur valide avec un ID
        if (response.data && response.data.id) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (err: any) {
        // Si ça échoue, l'utilisateur n'est pas connecté
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
      let message = "Erreur lors de la connexion.";
      
      // Gestion des erreurs spécifiques du backend
      if (err.response?.data?.message) {
        if (err.response.data.message === "These credentials do not match our records.") {
          message = "Email ou mot de passe incorrect.";
        } else {
          message = err.response.data.message;
        }
      } else if (err.response?.data?.errors) {
        // Gestion des erreurs de validation Laravel
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          message = firstError[0] as string;
        }
      }
      
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
      let message = "Erreur lors de l'inscription.";
      
      // Gestion des erreurs spécifiques du backend
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // Gestion des erreurs de validation Laravel
        const errors = err.response.data.errors;
        const errorMessages = [];
        
        // Récupérer tous les messages d'erreur
        for (const field in errors) {
          if (Array.isArray(errors[field])) {
            errorMessages.push(...errors[field]);
          }
        }
        
        if (errorMessages.length > 0) {
          message = errorMessages.join(' ');
        }
      }
      
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
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
      setIsLoggingOut(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading, isLoggingOut, error, clearError }}>
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
