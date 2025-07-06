import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "X-Access-Token": import.meta.env.VITE_APP_ACCESS_TOKEN,
  },
  withCredentials: true,
});

// Gestion globale des erreurs (ex : rediriger si 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    }
    if (error.response?.status === 403) {
      console.warn("Accès interdit.");
    }
    return Promise.reject(error);
  }
);

export default api;
