<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePermiso
{
    public function handle(Request $request, Closure $next, string $permiso): Response
    {
        $user = $request->user();

        abort_if(! $user instanceof User, 403, 'Usuario no autenticado');
        abort_unless($user->tienePermiso($permiso), 403, 'No tienes permiso para acceder');

        return $next($request);
    }
}
