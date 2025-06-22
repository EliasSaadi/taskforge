import api from "./api";

export async function login(email: string, password: string) {
  // Récupérer le cookie CSRF de Sanctum
  await api.get("/sanctum/csrf-cookie");

  // Puis appeler l’API login
  return api.post("/api/login", { email, password });
}
