<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use App\Models\Project;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
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
     * Vérifier si l'utilisateur est assigné à une tâche
     * 
     * @param Task $task
     * @param int|null $userId
     * @return bool
     */
    private function isAssigneATache(Task $task, ?int $userId = null): bool
    {
        $userId = $userId ?? Auth::id();
        
        return $task->utilisateurs()
                   ->where('user_id', $userId)
                   ->exists();
    }

    /**
     * Vérifier si l'utilisateur peut modifier/supprimer une tâche
     * (Chef de projet ou Assistant)
     * 
     * @param Task $task
     * @param int|null $userId
     * @return bool
     */
    private function canModifyTask(Task $task, ?int $userId = null): bool
    {
        $project = $task->projet()->first();
        return $this->isChefOuAssistant($project, $userId);
    }

    /**
     * Vérifier si l'utilisateur peut changer le statut d'une tâche
     * (Chef de projet, Assistant ou membre assigné à la tâche)
     * 
     * @param Task $task
     * @param int|null $userId
     * @return bool
     */
    private function canChangeTaskStatus(Task $task, ?int $userId = null): bool
    {
        $project = $task->projet()->first();
        return $this->isChefOuAssistant($project, $userId) || 
               $this->isAssigneATache($task, $userId);
    }
    /**
     * Afficher la liste de toutes les tâches.
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $tasks = Task::with(['projet', 'utilisateurs'])
                        ->orderBy('created_at', 'desc')
                        ->get();

            return response()->json([
                'success' => true,
                'message' => 'Tâches récupérées avec succès',
                'data' => $tasks
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des tâches',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer une nouvelle tâche.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validation des données
            $validatedData = $request->validate([
                'titre' => 'required|string|max:255',
                'description' => 'nullable|string',
                'statut' => 'required|in:à faire,en cours,terminé',
                'date_debut' => 'required|date',
                'date_limite' => 'required|date|after_or_equal:date_debut',
                'project_id' => 'required|exists:projects,id',
                'user_ids' => 'nullable|array',
                'user_ids.*' => 'exists:users,id'
            ]);

            // Vérifier que l'utilisateur a accès au projet
            $project = Project::findOrFail($validatedData['project_id']);
            $user = Auth::user();
            
            if (!$user->projets()->where('project_id', $project->id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé - vous n\'êtes pas membre de ce projet'
                ], 403);
            }

            // Créer la tâche
            $task = Task::create([
                'titre' => $validatedData['titre'],
                'description' => $validatedData['description'],
                'statut' => $validatedData['statut'],
                'date_debut' => $validatedData['date_debut'],
                'date_limite' => $validatedData['date_limite'],
                'project_id' => $validatedData['project_id'],
            ]);

            // Assigner les utilisateurs si fournis
            if (isset($validatedData['user_ids'])) {
                $task->utilisateurs()->sync($validatedData['user_ids']);
            }

            // Charger les relations pour la réponse
            $task->load(['projet', 'utilisateurs']);

            return response()->json([
                'success' => true,
                'message' => 'Tâche créée avec succès',
                'data' => $task
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Projet non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la tâche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une tâche spécifique.
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $task = Task::with(['projet', 'utilisateurs'])
                       ->findOrFail($id);

            // Vérifier que l'utilisateur a accès au projet de cette tâche
            $user = Auth::user();
            if (!$user->projets()->where('project_id', $task->project_id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'message' => 'Tâche récupérée avec succès',
                'data' => $task
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tâche non trouvée'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la tâche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour une tâche.
     * 
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            // Trouver la tâche
            $task = Task::findOrFail($id);

            // Validation des données pour déterminer le type de modification
            $validatedData = $request->validate([
                'titre' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'statut' => 'sometimes|required|in:à faire,en cours,terminé',
                'date_debut' => 'sometimes|required|date',
                'date_limite' => 'sometimes|required|date|after_or_equal:date_debut',
                'project_id' => 'sometimes|required|exists:projects,id',
                'user_ids' => 'nullable|array',
                'user_ids.*' => 'exists:users,id'
            ]);

            // Vérifier les permissions selon le type de modification
            $isStatusChange = isset($validatedData['statut']) && count($validatedData) === 1;
            
            if ($isStatusChange) {
                // Changement de statut uniquement : Chef, Assistant ou membre assigné
                if (!$this->canChangeTaskStatus($task)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Accès refusé - Seuls le chef de projet, l\'assistant ou les membres assignés peuvent changer le statut'
                    ], 403);
                }
            } else {
                // Modification complète : Chef ou Assistant uniquement
                if (!$this->canModifyTask($task)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Accès refusé - Seuls le chef de projet et l\'assistant peuvent modifier cette tâche'
                    ], 403);
                }
            }

            // Si le project_id change, vérifier l'accès au nouveau projet
            if (isset($validatedData['project_id']) && $validatedData['project_id'] !== $task->project_id) {
                $user = Auth::user();
                if (!$user->projets()->where('project_id', $validatedData['project_id'])->exists()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Accès non autorisé - vous n\'êtes pas membre du nouveau projet'
                    ], 403);
                }
            }

            // Mettre à jour la tâche
            $task->update(array_filter($validatedData, function($value, $key) {
                return $key !== 'user_ids' && $value !== null;
            }, ARRAY_FILTER_USE_BOTH));

            // Mettre à jour les assignations si fourni
            if (isset($validatedData['user_ids'])) {
                $task->utilisateurs()->sync($validatedData['user_ids']);
            }

            // Charger les relations pour la réponse
            $task->load(['projet', 'utilisateurs']);

            return response()->json([
                'success' => true,
                'message' => 'Tâche mise à jour avec succès',
                'data' => $task
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tâche non trouvée'
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
                'message' => 'Erreur lors de la mise à jour de la tâche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Changer uniquement le statut d'une tâche.
     * Route: PATCH /api/tasks/{id}/status
     * 
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        try {
            // Trouver la tâche
            $task = Task::findOrFail($id);

            // Vérifier les permissions pour changer le statut
            if (!$this->canChangeTaskStatus($task)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès refusé - Seuls le chef de projet, l\'assistant ou les membres assignés peuvent changer le statut'
                ], 403);
            }

            // Validation des données
            $validatedData = $request->validate([
                'statut' => 'required|in:à faire,en cours,terminé'
            ]);

            // Mettre à jour uniquement le statut
            $oldStatus = $task->statut;
            $task->update(['statut' => $validatedData['statut']]);

            // Charger les relations pour la réponse
            $task->load(['projet', 'utilisateurs']);

            return response()->json([
                'success' => true,
                'message' => "Statut de la tâche changé de '{$oldStatus}' vers '{$validatedData['statut']}'",
                'data' => $task
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tâche non trouvée'
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
                'message' => 'Erreur lors de la mise à jour du statut',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer une tâche.
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            // Trouver la tâche
            $task = Task::findOrFail($id);

            // Vérifier que l'utilisateur peut modifier/supprimer la tâche
            if (!$this->canModifyTask($task)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès refusé - Seuls le chef de projet et l\'assistant peuvent supprimer cette tâche'
                ], 403);
            }

            // Sauvegarder les informations pour la réponse
            $taskTitle = $task->titre;

            // Supprimer les assignations puis la tâche
            $task->utilisateurs()->detach();
            $task->delete();

            return response()->json([
                'success' => true,
                'message' => "Tâche '{$taskTitle}' supprimée avec succès"
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tâche non trouvée'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la tâche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assigner un utilisateur à une tâche.
     * Route: POST /api/tasks/{id}/assign/{user}
     * 
     * @param string $id ID de la tâche
     * @param string $user ID de l'utilisateur
     * @return JsonResponse
     */
    public function assign(string $id, string $user): JsonResponse
    {
        try {
            $task = Task::findOrFail($id);
            $userToAssign = User::findOrFail($user);

            // Vérifier que l'utilisateur connecté a accès au projet
            $currentUser = Auth::user();
            if (!$currentUser->projets()->where('project_id', $task->project_id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            // Vérifier que l'utilisateur à assigner est membre du projet
            if (!$userToAssign->projets()->where('project_id', $task->project_id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'utilisateur n\'est pas membre de ce projet'
                ], 422);
            }

            // Vérifier si l'utilisateur n'est pas déjà assigné
            if ($task->utilisateurs()->where('user_id', $user)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'utilisateur est déjà assigné à cette tâche'
                ], 422);
            }

            // Assigner l'utilisateur
            $task->utilisateurs()->attach($user);

            return response()->json([
                'success' => true,
                'message' => "Utilisateur {$userToAssign->prenom} {$userToAssign->nom} assigné à la tâche '{$task->titre}'",
                'data' => [
                    'task_id' => $task->id,
                    'user_id' => $userToAssign->id,
                    'assigned_at' => now()
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tâche ou utilisateur non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'assignation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retirer un utilisateur d'une tâche.
     * Route: DELETE /api/tasks/{id}/unassign/{user}
     * 
     * @param string $id ID de la tâche
     * @param string $user ID de l'utilisateur
     * @return JsonResponse
     */
    public function unassign(string $id, string $user): JsonResponse
    {
        try {
            $task = Task::findOrFail($id);
            $userToUnassign = User::findOrFail($user);

            // Vérifier que l'utilisateur connecté a accès au projet
            $currentUser = Auth::user();
            if (!$currentUser->projets()->where('project_id', $task->project_id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            // Vérifier si l'utilisateur est assigné à la tâche
            if (!$task->utilisateurs()->where('user_id', $user)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'L\'utilisateur n\'est pas assigné à cette tâche'
                ], 422);
            }

            // Retirer l'assignation
            $task->utilisateurs()->detach($user);

            return response()->json([
                'success' => true,
                'message' => "Utilisateur {$userToUnassign->prenom} {$userToUnassign->nom} retiré de la tâche '{$task->titre}'"
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tâche ou utilisateur non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de l\'assignation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer tous les utilisateurs assignés à une tâche.
     * Route: GET /api/tasks/{id}/users
     * 
     * @param string $id ID de la tâche
     * @return JsonResponse
     */
    public function users(string $id): JsonResponse
    {
        try {
            $task = Task::findOrFail($id);

            // Vérifier que l'utilisateur connecté a accès au projet
            $currentUser = Auth::user();
            if (!$currentUser->projets()->where('project_id', $task->project_id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            $assignedUsers = $task->utilisateurs()->get();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateurs assignés récupérés avec succès',
                'data' => $assignedUsers,
                'task' => [
                    'id' => $task->id,
                    'titre' => $task->titre,
                    'statut' => $task->statut
                ]
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tâche non trouvée'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des utilisateurs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
