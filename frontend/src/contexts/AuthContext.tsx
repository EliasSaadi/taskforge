import { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";
import type {Utilisateur} from "@/interfaces/data";

export type User = Utilisateur

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Recharger l'utilisateur au démarrage
  useEffect(() => {
    api.get("/sanctum/csrf-cookie")
      .then(() => api.get("/api/user"))
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);


  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post("/api/login", { email, password });
      const res = await api.get("/api/user");
      setUser(res.data);
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

  const logout = async () => {
    try {
      await api.post("/api/logout");
    } catch {
      // rien à faire si déjà déconnecté
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading, error }}>
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
