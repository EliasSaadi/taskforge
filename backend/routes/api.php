<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', function () {
    logger('Tentative de login reçue');
    return response()->json(['ok' => true]);
});

// routes/api.php
Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});


Route::get('/_debug/logs', function () {
    $logPath = storage_path('logs/laravel.log');

    if (!File::exists($logPath)) {
        return response()->json(['error' => 'Log file not found'], 404);
    }

    $logs = File::get($logPath);
    $lines = explode("\n", $logs);
    $lastLines = array_slice($lines, -100);

    return response("<pre>" . implode("\n", $lastLines) . "</pre>")->header('Content-Type', 'text/html');
});
