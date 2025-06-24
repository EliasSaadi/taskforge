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
        $appLocked = config('app.lock_enabled', false);
        $expectedToken = config('app.access_token');
        $frontendUrl = config('app.frontend_url', 'https://taskforge-front.up.railway.app');

        if ($appLocked && $request->header('X-Access-Token') !== $expectedToken) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'API temporairement verrouillée.'], 403);
            }

            return redirect($frontendUrl);
        }

        return $next($request);
    }

}
