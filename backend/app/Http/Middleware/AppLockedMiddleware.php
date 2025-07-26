<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AppLockedMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->method() === 'OPTIONS') {
            return response()->json([], 204);
        }

        if (app()->environment('testing')) {
            return $next($request);
        }

        $appLocked = config('app.lock_enabled', false);
        $expectedToken = config('app.access_token');
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');

        // ⚠️ Autoriser les routes essentielles pour l'authentification
        if ($request->is('sanctum/csrf-cookie') || $request->is('api/user') || $request->is('api/login') || $request->is('api/logout')) {
            return $next($request);
        }

        $token = $request->header('X-Access-Token') ?? $request->query('access_token');

        if ($appLocked && $token !== $expectedToken) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['error' => 'API temporairement verrouillée.'], 403);
            }

            return redirect($frontendUrl);
        }

        return $next($request);
    }
}
