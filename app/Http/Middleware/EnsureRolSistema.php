<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRolSistema
{
    /**
     * Verifica que el usuario autenticado tenga al menos uno de los roles indicados.
     *
     * Uso en rutas: middleware('role:administrador') o middleware('role:administrador,docente')
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        abort_if(! $user instanceof User, 403);
        abort_if(! $user->estaActivo(), 403, 'Tu cuenta está desactivada.');

        if (empty($roles)) {
            return $next($request);
        }

        $rolUsuario = $user->rol?->nombre;

        abort_unless(
            $rolUsuario !== null && in_array($rolUsuario, $roles, strict: true),
            403,
            'No tienes permisos para acceder a esta sección.',
        );

        return $next($request);
    }
}
