<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Afficher la liste de tous les utilisateurs (pour les administrateurs).
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $users = User::with(['projets', 'taches', 'messages'])
                        ->orderBy('created_at', 'desc')
                        ->get();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateurs récupérés avec succès',
                'data' => $users
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des utilisateurs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer un nouvel utilisateur (registration alternative).
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validation des données
            $validatedData = $request->validate([
                'prenom' => 'required|string|max:64',
                'nom' => 'required|string|max:64',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8|confirmed',
                'theme' => 'in:clair,sombre',
            ]);

            // Hasher le mot de passe
            $validatedData['password'] = Hash::make($validatedData['password']);
            $validatedData['theme'] = $validatedData['theme'] ?? 'clair';
            $validatedData['actif'] = true;

            // Créer l'utilisateur
            $user = User::create($validatedData);

            // Charger les relations pour la réponse
            $user->load(['projets', 'taches', 'messages']);

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur créé avec succès',
                'data' => $user
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher le profil d'un utilisateur spécifique.
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = User::with(['projets', 'taches', 'messages'])
                       ->findOrFail($id);

            // Vérifier que l'utilisateur peut voir ce profil
            if (Auth::id() !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'message' => 'Profil utilisateur récupéré avec succès',
                'data' => $user
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour le profil de l'utilisateur.
     * 
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            // Trouver l'utilisateur
            $user = User::findOrFail($id);

            // Vérifier que l'utilisateur peut modifier ce profil
            if (Auth::id() !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            // Validation des données
            $validatedData = $request->validate([
                'prenom' => 'sometimes|required|string|max:64',
                'nom' => 'sometimes|required|string|max:64',
                'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:8|confirmed',
                'theme' => 'sometimes|in:clair,sombre',
            ]);

            // Hasher le mot de passe si fourni
            if (isset($validatedData['password'])) {
                $validatedData['password'] = Hash::make($validatedData['password']);
            }

            // Mettre à jour l'utilisateur
            $user->update($validatedData);

            // Charger les relations pour la réponse
            $user->load(['projets', 'taches', 'messages']);

            return response()->json([
                'success' => true,
                'message' => 'Profil mis à jour avec succès',
                'data' => $user
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer le compte de l'utilisateur.
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            // Trouver l'utilisateur
            $user = User::findOrFail($id);

            // Vérifier que l'utilisateur peut supprimer ce compte
            if (Auth::id() !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            // Sauvegarder les informations pour la réponse
            $userName = "{$user->prenom} {$user->nom}";

            // Supprimer l'utilisateur
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => "Compte de {$userName} supprimé avec succès"
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du compte',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les projets d'un utilisateur spécifique.
     * Route: GET /api/user/{id}/projects
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function projects(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $projects = $user->projets()->with(['membres', 'taches', 'messages'])
                            ->orderBy('created_at', 'desc')
                            ->get();

            return response()->json([
                'success' => true,
                'message' => 'Projets de l\'utilisateur récupérés avec succès',
                'data' => $projects,
                'user' => [
                    'id' => $user->id,
                    'prenom' => $user->prenom,
                    'nom' => $user->nom
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des projets',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les tâches assignées à un utilisateur.
     * Route: GET /api/user/{id}/tasks
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function tasks(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $tasks = $user->taches()->with(['projet', 'utilisateurs'])
                          ->orderBy('created_at', 'desc')
                          ->get();

            return response()->json([
                'success' => true,
                'message' => 'Tâches de l\'utilisateur récupérées avec succès',
                'data' => $tasks,
                'user' => [
                    'id' => $user->id,
                    'prenom' => $user->prenom,
                    'nom' => $user->nom
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des tâches',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer le rôle d'un utilisateur dans un projet donné.
     * Route: GET /api/user/{id}/role-in-project/{projectId}
     * 
     * @param string $id
     * @param string $projectId
     * @return JsonResponse
     */
    public function roleInProject(string $id, string $projectId): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            $project = Project::findOrFail($projectId);

            $projectUser = $user->projets()->where('project_id', $projectId)->first();

            if (!$projectUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'utilisateur n\'est pas membre de ce projet'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Rôle de l\'utilisateur dans le projet récupéré avec succès',
                'data' => [
                    'user_id' => $user->id,
                    'project_id' => $project->id,
                    'role_id' => $projectUser->pivot->role_id,
                    'joined_at' => $projectUser->pivot->created_at
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur ou projet non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du rôle',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Désactiver le compte d'un utilisateur.
     * Route: PATCH /api/user/{id}/deactivate
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function deactivate(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Vérifier que l'utilisateur peut désactiver ce compte
            if (Auth::id() !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            $user->actif = false;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Compte désactivé avec succès',
                'data' => [
                    'id' => $user->id,
                    'actif' => $user->actif
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la désactivation du compte',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Changer le thème de l'utilisateur entre 'sombre' et 'clair'.
     * Route: PATCH /api/user/{id}/theme
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function toggleTheme(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Vérifier que l'utilisateur peut modifier ce thème
            if (Auth::id() !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            $user->theme = $user->theme === 'sombre' ? 'clair' : 'sombre';
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Thème mis à jour avec succès',
                'data' => [
                    'id' => $user->id,
                    'theme' => $user->theme
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du thème',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
