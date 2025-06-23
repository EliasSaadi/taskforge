<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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