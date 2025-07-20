<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Récupérer les messages d'un projet
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function getProjectMessages(string $id): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);
            
            // Vérifier que l'utilisateur fait partie du projet
            if (!$project->membres()->where('user_id', Auth::id())->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            // Récupérer les messages du projet avec les informations de l'auteur
            $messages = $project->messages()
                               ->with(['auteur'])
                               ->orderBy('created_at', 'desc')
                               ->get()
                               ->map(function ($message) {
                                   return [
                                       'id' => $message->id,
                                       'contenu' => $message->contenu,
                                       'created_at' => $message->created_at,
                                       'updated_at' => $message->updated_at,
                                       'auteur' => [
                                           'id' => $message->auteur->id,
                                           'nom' => $message->auteur->nom,
                                           'prenom' => $message->auteur->prenom,
                                           'email' => $message->auteur->email,
                                           'avatar' => $message->auteur->avatar ?? null
                                       ]
                                   ];
                               });

            return response()->json([
                'success' => true,
                'data' => $messages
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Projet non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des messages',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Envoyer un message dans un projet
     * 
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function sendMessage(Request $request, string $id): JsonResponse
    {
        try {
            $project = Project::findOrFail($id);
            
            // Vérifier que l'utilisateur fait partie du projet
            if (!$project->membres()->where('user_id', Auth::id())->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé'
                ], 403);
            }

            // Valider les données
            $request->validate([
                'contenu' => 'required|string|max:1000'
            ]);

            // Créer le message
            $message = Message::create([
                'contenu' => $request->contenu,
                'user_id' => Auth::id(), // Utiliser 'user_id' au lieu de 'auteur_id'
                'project_id' => $id
            ]);

            // Charger les relations
            $message->load('auteur');

            return response()->json([
                'success' => true,
                'message' => 'Message envoyé avec succès',
                'data' => [
                    'id' => $message->id,
                    'contenu' => $message->contenu,
                    'created_at' => $message->created_at,
                    'updated_at' => $message->updated_at,
                    'auteur' => [
                        'id' => $message->auteur->id,
                        'nom' => $message->auteur->nom,
                        'prenom' => $message->auteur->prenom,
                        'email' => $message->auteur->email,
                        'avatar' => $message->auteur->avatar ?? null
                    ]
                ]
            ], 201);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Projet non trouvé'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi du message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les réponses à un message
     * 
     * @param string $id
     * @return JsonResponse
     */
    public function replies(string $id): JsonResponse
    {
        // Pour le moment, retourner un tableau vide
        // Cette fonctionnalité sera implémentée plus tard
        return response()->json([
            'success' => true,
            'data' => []
        ], 200);
    }
}
