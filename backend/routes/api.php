<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\PasswordResetController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

/* Middleware pour tester si l'API est verrouillée */
Route::middleware([\App\Http\Middleware\AppLockedMiddleware::class])
    ->get('/middleware-test', function () {
        return response()->json(['ok' => true]);
    });


/* Routes d'authentification */
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
Route::post('/logout', [AuthController::class, 'logout']);

/* Routes de réinitialisation de mot de passe */
Route::post('/password/forgot', [PasswordResetController::class, 'sendResetLink']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);

/* Routes API Resources */
Route::apiResource('projects', ProjectController::class);
Route::apiResource('tasks', TaskController::class);
Route::apiResource('user', UserController::class);
Route::apiResource('messages', MessageController::class);



/* Routes personnalisées */

// Routes custom pour les projets
Route::controller(ProjectController::class)->group(function () {
    Route::get('/my-projects', 'getUserProjects'); // Récupérer les projets de l'utilisateur connecté
    Route::get('/projects/{id}/members', 'members'); // Récupérer les membres d'un projet
    Route::get('/projects/{id}/tasks', 'tasks'); // Récupérer les tâches d'un projet
    
    // Gestion des membres et rôles (Chef de projet uniquement)
    Route::post('/projects/{id}/members', 'addMember'); // Ajouter un membre au projet
    Route::put('/projects/{id}/members/{user}', 'updateMemberRole'); // Modifier le rôle d'un membre
    Route::delete('/projects/{id}/members/{user}', 'removeMember'); // Retirer un membre du projet
});

// Routes custom pour les tâches
Route::controller(TaskController::class)->group(function () {
    Route::post('/tasks/{id}/assign/{user}', 'assign'); // Assignation d'un user à une tâche
    Route::delete('/tasks/{id}/unassign/{user}', 'unassign'); // Retirer un user d'une tâche
    Route::get('/tasks/{id}/users', 'users'); // Voir tous les utilisateurs assignés à une tâche
    
    // Changement de statut (Chef, Assistant ou membre assigné)
    Route::patch('/tasks/{id}/status', 'updateStatus'); // Changer uniquement le statut d'une tâche
});

// Routes custom pour les utilisateurs
Route::controller(UserController::class)->group(function () {
    Route::get('/user/{id}/projects', 'projects'); // Récupérer les projets d'un utilisateur
    Route::get('/user/{id}/tasks', 'tasks'); // Récupérer les tâches assignées à un utilisateur
    Route::get('/user/{id}/role-in-project/{projectId}', 'roleInProject'); // Récupérer le rôle de l'utilisateur dans un projet donné
    
    Route::patch('/user/{id}/deactivate', 'deactivate'); // Désactiver un utilisateur
    Route::patch('/user/{id}/theme', 'toggleTheme'); // Mettre à jour le thème de l'utilisateur
    Route::delete('/user/{id}/delete', 'destroy'); // Supprimer un utilisateur
});

// Routes custom pour les messages
Route::controller(MessageController::class)->group(function () {
    Route::get('/projects/{id}/messages', 'getProjectMessages'); // Récupérer les messages d'un projet
    Route::post('/projects/{id}/messages', 'sendMessage'); // Envoyer un message dans un projet
    Route::get('/messages/{id}/replies', 'replies'); // Récupérer les réponses à un message
});
