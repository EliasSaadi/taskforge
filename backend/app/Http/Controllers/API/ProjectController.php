<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Vérifier si l'utilisateur est chef de projet
     * 
     * @param Project $project
     * @param int|null $userId
     * @return bool
     */
    private function isChefDeProjet(Project $project, ?int $userId = null): bool
    {
        $userId = $userId ?? Auth::id();
        $chefRole = Role::where('nom', 'Chef de Projet')->first();
        
        if (!$chefRole) {
            return false;
        }
        
        return $project->membres()
                      ->where('user_id', $userId)
                      ->where('role_id', $chefRole->id)
                      ->exists();
    }

    /**
     * Vérifier si l'utilisateur est chef de projet ou assistant
     * 
     * @param Project $project
     * @param int|null $userId
     * @return bool
     */
    private function isChefOuAssistant(Project $project, ?int $userId = null): bool
    {
        $userId = $userId ?? Auth::id();
        $allowedRoles = Role::whereIn('nom', ['Chef de Projet', 'Assistant'])->pluck('id');
        
        return $project->membres()
                      ->where('user_id', $userId)
                      ->whereIn('role_id', $allowedRoles)
                      ->exists();
    }

    /**
     * Vérifier si l'utilisateur est membre du projet
     * 
     * @param Project $project
     * @param int|null $userId
     * @return bool
     */
    private function isMembreProjet(Project $project, ?int $userId = null): bool
    {
        $userId = $userId ?? Auth::id();
        
        return $project->membres()
                      ->where('user_id', $userId)
                      ->exists();
    }
    /**
     * Afficher la liste de tous les projets.
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $projects = Project::with(['membres', 'taches', 'messages'])
                              ->orderBy('created_at', 'desc')
                              ->get();

            return response()->json([
                'success' => true,
                'message' => 'Projets récupérés avec succès',
                'data' => $projects
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des projets',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer un nouveau projet.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validation des données
            $validatedData = $request->validate([
                'nom' => 'required|string|max:64',
                'description' => 'nullable|string',
                'date_debut' => 'required|date|after_or_equal:today',
                'date_fin' => 'required|date|after:date_debut',
            ]);

            // Créer le projet
            $project = Project::create($validatedData);

            // Ajouter automatiquement le créateur comme "Chef de Projet"
            $chefRole = Role::where('nom', 'Chef de Projet')->first();
            if ($chefRole) {
                $project->membres()->attach(Auth::id(), ['role_id' => $chefRole->id]);
            }

            // Charger les relations pour la réponse
            $project->load(['membres', 'taches', 'messages']);

            return response()->json([
                'success' => true,
                'message' => 'Projet créé avec succès',
                'data' => $project
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
                'message' => 'Erreur lors de la création du projet',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un projet spécifique.
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $project = Project::with(['membres', 'taches', 'messages'])
                             ->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Projet récupéré avec succès',
                'data' => $project
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Projet non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du projet',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un projet existant.
     * 
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            // Trouver le projet
            $project = Project::findOrFail($id);

            // Validation des données
            $validatedData = $request->validate([
                'nom' => 'sometimes|required|string|max:64',
                'description' => 'nullable|string',
                'date_debut' => 'sometimes|required|date',
                'date_fin' => 'sometimes|required|date|after:date_debut',
            ]);

            // Mettre à jour le projet
            $project->update($validatedData);

            // Charger les relations pour la réponse
            $project->load(['membres', 'taches', 'messages']);

            return response()->json([
                'success' => true,
                'message' => 'Projet mis à jour avec succès',
                'data' => $project
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Projet non trouvé'
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
                'message' => 'Erreur lors de la mise à jour du projet',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un projet.
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            // Trouver le projet
            $project = Project::findOrFail($id);

            // Vérifier que l'utilisateur est chef de projet
            if (!$this->isChefDeProjet($project)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès refusé - Seul le chef de projet peut supprimer ce projet'
                ], 403);
            }

            // Sauvegarder les informations du projet pour la réponse
            $projectName = $project->nom;

            // Supprimer les relations avant de supprimer le projet
            $project->membres()->detach();
            $project->taches()->delete();
            $project->messages()->delete();
            
            // Supprimer le projet
            $project->delete();

            return response()->json([
                'success' => true,
                'message' => "Projet '{$projectName}' supprimé avec succès"
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Projet non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du projet',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les projets d'un utilisateur spécifique.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getUserProjects(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            // Récupérer les projets avec le rôle de l'utilisateur depuis la table pivot
            $projects = Project::join('project_user', 'projects.id', '=', 'project_user.project_id')
                              ->join('roles', 'project_user.role_id', '=', 'roles.id')
                              ->where('project_user.user_id', $user->id)
                              ->select('projects.*', 'roles.nom as user_role')
                              ->with(['taches'])
                              ->orderBy('projects.created_at', 'desc')
                              ->get();

            // Transformer les données pour le frontend avec calculs
            $projects = $projects->map(function ($project) {
                // Calculer le pourcentage de tâches terminées
                $totalTasks = $project->taches->count();
                $completedTasks = $project->taches->where('statut', 'terminé')->count();
                $progressPercentage = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

                return [
                    'id' => $project->id,
                    'nom' => $project->nom,
                    'description' => $project->description,
                    'dateDebut' => $project->date_debut,
                    'dateFin' => $project->date_fin,
                    'dateCreation' => $project->created_at->toDateString(),
                    'user_role' => $project->user_role,
                    'progressPercentage' => $progressPercentage,
                    'totalTasks' => $totalTasks,
                    'completedTasks' => $completedTasks
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Projets de l\'utilisateur récupérés avec succès',
                'data' => $projects
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des projets de l\'utilisateur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ajouter un membre au projet avec un rôle spécifique.
     * Route: POST /api/projects/{id}/members
     * 
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function addMember(Request $request, string $id): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);

            // Vérifier que l'utilisateur est chef de projet
            if (!$this->isChefDeProjet($project)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès refusé - Seul le chef de projet peut ajouter des membres'
                ], 403);
            }

            // Validation des données
            $validatedData = $request->validate([
                'user_id' => 'required|exists:users,id',
                'role_id' => 'required|exists:roles,id'
            ]);

            // Vérifier si l'utilisateur n'est pas déjà membre
            if ($project->membres()->where('user_id', $validatedData['user_id'])->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cet utilisateur est déjà membre du projet'
                ], 422);
            }

            // Ajouter le membre avec son rôle
            $project->membres()->attach($validatedData['user_id'], ['role_id' => $validatedData['role_id']]);

            $user = \App\Models\User::find($validatedData['user_id']);
            $role = Role::find($validatedData['role_id']);

            return response()->json([
                'success' => true,
                'message' => "Utilisateur {$user->prenom} {$user->nom} ajouté au projet avec le rôle {$role->nom}",
                'data' => [
                    'user_id' => $user->id,
                    'role_id' => $role->id,
                    'added_at' => now()
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Projet non trouvé'
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
                'message' => 'Erreur lors de l\'ajout du membre',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Modifier le rôle d'un membre du projet.
     * Route: PUT /api/projects/{id}/members/{user}
     * 
     * @param Request $request
     * @param string $id
     * @param string $user
     * @return JsonResponse
     */
    public function updateMemberRole(Request $request, string $id, string $user): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);

            // Vérifier que l'utilisateur est chef de projet
            if (!$this->isChefDeProjet($project)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès refusé - Seul le chef de projet peut modifier les rôles'
                ], 403);
            }

            // Validation des données
            $validatedData = $request->validate([
                'role_id' => 'required|exists:roles,id'
            ]);

            // Vérifier si l'utilisateur est membre du projet
            if (!$project->membres()->where('user_id', $user)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cet utilisateur n\'est pas membre du projet'
                ], 422);
            }

            // Mettre à jour le rôle
            $project->membres()->updateExistingPivot($user, ['role_id' => $validatedData['role_id']]);

            $userModel = \App\Models\User::find($user);
            $role = Role::find($validatedData['role_id']);

            return response()->json([
                'success' => true,
                'message' => "Rôle de {$userModel->prenom} {$userModel->nom} mis à jour vers {$role->nom}"
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Projet ou utilisateur non trouvé'
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
                'message' => 'Erreur lors de la mise à jour du rôle',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retirer un membre du projet.
     * Route: DELETE /api/projects/{id}/members/{user}
     * 
     * @param string $id
     * @param string $user
     * @return JsonResponse
     */
    public function removeMember(string $id, string $user): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);

            // Vérifier que l'utilisateur est chef de projet
            if (!$this->isChefDeProjet($project)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès refusé - Seul le chef de projet peut retirer des membres'
                ], 403);
            }

            // Vérifier si l'utilisateur est membre du projet
            if (!$project->membres()->where('user_id', $user)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cet utilisateur n\'est pas membre du projet'
                ], 422);
            }

            // Empêcher la suppression du dernier chef de projet
            if ($this->isChefDeProjet($project, $user)) {
                $chefsCount = $project->membres()
                    ->whereHas('roles', function($query) {
                        $query->where('nom', 'Chef de Projet');
                    })->count();
                
                if ($chefsCount <= 1) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Impossible de retirer le dernier chef de projet'
                    ], 422);
                }
            }

            // Retirer le membre
            $project->membres()->detach($user);

            $userModel = \App\Models\User::find($user);

            return response()->json([
                'success' => true,
                'message' => "Utilisateur {$userModel->prenom} {$userModel->nom} retiré du projet"
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Projet ou utilisateur non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du membre',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer un projet complet avec toutes ses données (membres, tâches, messages)
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function complete(string $id): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);

            // Vérifier si l'utilisateur est membre du projet
            if (!$this->isMembreProjet($project)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé à ce projet'
                ], 403);
            }

            // Récupérer les membres avec leurs rôles et statistiques
            $members = $project->membres()
                ->get()
                ->map(function($user) use ($project) {
                    // Récupérer le rôle de l'utilisateur dans ce projet
                    $pivotData = $project->membres()
                        ->where('user_id', $user->id)
                        ->first();
                    
                    $role = null;
                    if ($pivotData && $pivotData->pivot->role_id) {
                        $role = Role::find($pivotData->pivot->role_id);
                    }
                    
                    $roleName = $role ? $role->nom : 'Membre';

                    // Calculer les statistiques des tâches de l'utilisateur
                    $userTasks = $project->taches()
                        ->whereHas('utilisateurs', function($query) use ($user) {
                            $query->where('user_id', $user->id);
                        })
                        ->get();

                    $taskStats = [
                        'total' => $userTasks->count(),
                        'completed' => $userTasks->where('statut', 'terminé')->count(),
                        'inProgress' => $userTasks->where('statut', 'en cours')->count(),
                        'todo' => $userTasks->where('statut', 'à faire')->count(),
                    ];

                    return [
                        'id' => $user->id,
                        'prenom' => $user->prenom,
                        'nom' => $user->nom,
                        'email' => $user->email,
                        'role' => $roleName,
                        'tasksStats' => $taskStats
                    ];
                });

            // Récupérer les tâches avec les utilisateurs assignés
            $tasks = $project->taches()
                ->with(['utilisateurs:id,prenom,nom'])
                ->get()
                ->map(function($task) {
                    return [
                        'id' => $task->id,
                        'titre' => $task->titre,
                        'description' => $task->description,
                        'statut' => $task->statut,
                        'dateLimite' => $task->date_limite,
                        'dateDebut' => $task->date_debut,
                        'id_projet' => $task->project_id,
                        'assignedUsers' => $task->utilisateurs->map(function($user) {
                            return [
                                'id' => $user->id,
                                'prenom' => $user->prenom,
                                'nom' => $user->nom
                            ];
                        })
                    ];
                });

            // Récupérer les messages (si la relation existe)
            $messages = collect([]); // TODO: Implémenter quand la relation sera créée

            // Calculer les statistiques globales
            $totalTasks = $tasks->count();
            $completedTasks = $tasks->where('statut', 'terminé')->count();
            $inProgressTasks = $tasks->where('statut', 'en cours')->count();
            $todoTasks = $tasks->where('statut', 'à faire')->count();
            
            $stats = [
                'totalTasks' => $totalTasks,
                'completedTasks' => $completedTasks,
                'inProgressTasks' => $inProgressTasks,
                'todoTasks' => $todoTasks,
                'totalMembers' => $members->count(),
                'progressPercentage' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100, 2) : 0,
                'daysRemaining' => max(0, ceil((strtotime($project->date_fin) - time()) / (60 * 60 * 24))),
                'isOverdue' => time() > strtotime($project->date_fin)
            ];

            // Construire la réponse complète
            $completeProject = [
                'id' => $project->id,
                'nom' => $project->nom,
                'description' => $project->description,
                'dateDebut' => $project->date_debut,
                'dateFin' => $project->date_fin,
                'dateCreation' => $project->created_at,
                'membres' => $members,
                'taches' => $tasks,
                'messages' => $messages,
                'stats' => $stats
            ];

            return response()->json([
                'success' => true,
                'message' => 'Projet complet récupéré avec succès',
                'data' => $completeProject
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Projet non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération complète du projet',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
