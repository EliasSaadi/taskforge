<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use App\Http\Middleware\AppLockedMiddleware;
use Illuminate\Http\Middleware\HandleCors;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->use([AppLockedMiddleware::class]);
        // Désactivation CSRF pour les routes API (SPA avec Sanctum)
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
        // Gestion des sessions pour Sanctum
        $middleware->appendToGroup('api', EnsureFrontendRequestsAreStateful::class);
        $middleware->use([ HandleCors::class, AppLockedMiddleware::class, ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
