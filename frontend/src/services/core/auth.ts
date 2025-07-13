import api from "../api";

/**
 * Effectue une tentative de connexion.
 * @param email Email de l'utilisateur
 * @param password Mot de passe
 * @returns Résultat de la connexion
 */
export async function login(email: string, password: string) {
  try {
    // Obtenir le cookie de session pour l'authentification Sanctum
    await api.get("/sanctum/csrf-cookie");
    
    // Tentative de connexion
    const response = await api.post("/api/login", { email, password });

    return response;
  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    throw err;
  }
}

/**
 * Récupère l'utilisateur connecté (après login ou refresh)
 */
export async function getUser() {
  return api.get("/api/user");
}

/**
 * Déconnecte l'utilisateur
 */
export async function logout() {
  return api.post("/api/logout");
}
