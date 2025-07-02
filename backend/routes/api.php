<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\PasswordResetController;

/* Middleware Test */
Route::get('/middleware-test', function () {
    return response()->json(['ok' => true]);
});
/* Middleware Test */



/* Route Authentification */

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/user', fn () => auth()->user());
Route::post('/logout', [AuthController::class, 'logout']);

Route::post('/password/forgot', [PasswordResetController::class, 'sendResetLink']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);

/* Route Authentification */



/* Route API */

Route::apiResource('projects', ProjectController::class);
Route::apiResource('tasks', TaskController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('messages', MessageController::class);

/* Route API */



/* Routes personnalisées */

// Routes custom pour les projets
Route::controller(ProjectController::class)->group(function () {
    Route::get('/projects/{id}/messages', 'messages'); // Récupérer les messages d'un projet
    Route::get('/projects/{id}/members', 'members'); // Récupérer les membres d'un projet
    Route::get('/projects/{id}/tasks', 'tasks'); // Récupérer les tâches d'un projet
});

// Routes custom pour les tâches
Route::controller(TaskController::class)->group(function () {
    Route::post('/tasks/{id}/assign/{user}', 'assign'); // Assignation d’un user à une tâche
    Route::delete('/tasks/{id}/unassign/{user}', 'unassign'); // Retirer un user d’une tâche
    Route::get('/tasks/{id}/users', 'users'); // Voir tous les utilisateurs assignés à une tâche
});

// Routes custom pour les utilisateurs
Route::controller(UserController::class)->group(function () {
    Route::get('/users/{id}/projects', 'projects'); // Récupérer les projets d’un utilisateur
    Route::get('/users/{id}/tasks', 'tasks'); // Récupérer les tâches assignées à un utilisateur
    Route::get('/users/{id}/role-in-project/{projectId}', 'roleInProject'); // Récupérer le rôle de l’utilisateur dans un projet donné
});

// Routes custom pour les messages
Route::get('/projects/{id}/messages', [ProjectController::class, 'messages']);

/* Routes personnalisées */