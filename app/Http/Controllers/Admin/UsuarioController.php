<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUsuarioRequest;
use App\Http\Requests\Admin\UpdateUsuarioRequest;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    public function index(): Response
    {
        $usuarios = User::query()
            ->with('rol')
            ->orderBy('name')
            ->paginate(15)
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'estado' => $user->estado,
                'rol' => $user->rol?->only(['id', 'nombre', 'nombre_mostrar']),
                'created_at' => $user->created_at?->format('d/m/Y'),
            ]);

        return Inertia::render('admin/usuarios/index', [
            'usuarios' => $usuarios,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/usuarios/create', [
            'roles' => Rol::orderBy('nombre_mostrar')->get(['id', 'nombre', 'nombre_mostrar']),
        ]);
    }

    public function store(StoreUsuarioRequest $request): RedirectResponse
    {
        User::create([
            'name' => $request->string('name'),
            'email' => $request->string('email'),
            'password' => Hash::make($request->string('password')),
            'rol_id' => $request->integer('rol_id'),
            'estado' => $request->boolean('estado', true),
            'email_verified_at' => now(),
        ]);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario creado exitosamente.');
    }

    public function edit(User $usuario): Response
    {
        return Inertia::render('admin/usuarios/edit', [
            'usuario' => array_merge($usuario->toArray(), [
                'rol' => $usuario->rol?->only(['id', 'nombre', 'nombre_mostrar']),
            ]),
            'roles' => Rol::orderBy('nombre_mostrar')->get(['id', 'nombre', 'nombre_mostrar']),
        ]);
    }

    public function update(UpdateUsuarioRequest $request, User $usuario): RedirectResponse
    {
        $datos = [
            'name' => $request->string('name'),
            'email' => $request->string('email'),
            'rol_id' => $request->integer('rol_id'),
            'estado' => $request->boolean('estado'),
        ];

        if ($request->filled('password')) {
            $datos['password'] = Hash::make($request->string('password'));
        }

        $usuario->update($datos);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario actualizado exitosamente.');
    }

    public function destroy(User $usuario): RedirectResponse
    {
        // Desactivar en lugar de eliminar físicamente para preservar historial.
        $usuario->update(['estado' => false]);

        return redirect()->route('usuarios.index')
            ->with('success', 'Usuario desactivado exitosamente.');
    }
}
