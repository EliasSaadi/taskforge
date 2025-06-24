<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AppLockedMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {   
        $appLocked = env('APP_LOCKED', false);
        $expectedToken = env('ACCESS_TOKEN');
        $frontendUrl = env('FRONTEND_URL', 'https://taskforge-front.up.railway.app');

        // Si verrou activé
        if ($appLocked === true || $appLocked === "true") {
            $token = $request->header('X-Access-Token');

            if ($token !== $expectedToken) {
                // Si c'est un appel API, on renvoie 403 ou redirection
                if ($request->expectsJson()) {
                    return response()->json(['error' => 'API temporairement verrouillée.'], 403);
                }

                // Sinon, on redirige vers le front
                return redirect($frontendUrl);
            }
        }
        return $next($request);
    }
}
