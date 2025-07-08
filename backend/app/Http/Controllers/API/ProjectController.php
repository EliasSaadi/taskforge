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

            // Sauvegarder les informations du projet pour la réponse
            $projectName = $project->nom;

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

            $projects = $user->projets()->with(['membres', 'taches', 'messages'])
                            ->orderBy('created_at', 'desc')
                            ->get();

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
}
