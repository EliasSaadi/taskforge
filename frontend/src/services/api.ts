import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "X-Access-Token": import.meta.env.VITE_APP_ACCESS_TOKEN,
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Intercepteur pour ajouter des headers supplémentaires si nécessaire
api.interceptors.request.use(
  (config) => {
    // Ajouter le token CSRF si disponible (pour Laravel Sanctum)
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gestion globale des erreurs (ex : rediriger si 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TEMPORAIRE: On désactive la redirection pour diagnostiquer la boucle
      console.warn("🚨 API: Erreur 401 détectée - REDIRECTION DÉSACTIVÉE");
      console.warn("🚨 API: URL actuelle:", window.location.href);
      // window.location.href = '/';
    }
    if (error.response?.status === 403) {
      console.warn("🚨 API: Accès interdit (403)");
    }
    return Promise.reject(error);
  }
);

export default api;
