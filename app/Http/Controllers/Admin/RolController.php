<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateRolRequest;
use App\Models\Permiso;
use App\Models\Rol;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RolController extends Controller
{
    public function index(): Response
    {
        $roles = Rol::query()
            ->withCount('usuarios')
            ->with('permisos:id,nombre,nombre_mostrar')
            ->orderBy('nombre_mostrar')
            ->get()
            ->map(fn (Rol $rol): array => [
                'id' => $rol->id,
                'nombre' => $rol->nombre,
                'nombre_mostrar' => $rol->nombre_mostrar,
                'descripcion' => $rol->descripcion,
                'usuarios_count' => $rol->usuarios_count,
                'permisos' => $rol->permisos->map(fn (Permiso $p): array => [
                    'id' => $p->id,
                    'nombre' => $p->nombre,
                    'nombre_mostrar' => $p->nombre_mostrar,
                ])->all(),
            ]);

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
        ]);
    }

    public function edit(Rol $rol): Response
    {
        $rol->load('permisos:id,nombre,nombre_mostrar');

        return Inertia::render('admin/roles/edit', [
            'rol' => [
                'id' => $rol->id,
                'nombre' => $rol->nombre,
                'nombre_mostrar' => $rol->nombre_mostrar,
                'descripcion' => $rol->descripcion,
                'permisos' => $rol->permisos->pluck('id')->all(),
            ],
            'todosLosPermisos' => Permiso::orderBy('nombre_mostrar')->get(['id', 'nombre', 'nombre_mostrar']),
        ]);
    }

    public function update(UpdateRolRequest $request, Rol $rol): RedirectResponse
    {
        $rol->update([
            'nombre_mostrar' => $request->string('nombre_mostrar'),
            'descripcion' => $request->input('descripcion'),
        ]);

        $rol->permisos()->sync($request->input('permisos', []));

        return redirect()->route('roles.index')
            ->with('success', "Rol '{$rol->nombre_mostrar}' actualizado exitosamente.");
    }
}
