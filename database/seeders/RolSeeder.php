<?php

namespace Database\Seeders;

use App\Enums\RolSistema;
use App\Models\Permiso;
use App\Models\Rol;
use Illuminate\Database\Seeder;

class RolSeeder extends Seeder
{
    /**
     * Crea los roles base del sistema y sus permisos asociados.
     */
    public function run(): void
    {
        // Recopilar todos los permisos únicos de todos los roles.
        $todosLosPermisos = collect(RolSistema::cases())
            ->flatMap(fn (RolSistema $rol) => $rol->permisosBase())
            ->unique()
            ->values();

        // Crear (o recuperar) todos los permisos.
        $permisosCreados = $todosLosPermisos->mapWithKeys(function (string $nombre): array {
            $permiso = Permiso::firstOrCreate(
                ['nombre' => $nombre],
                [
                    'nombre_mostrar' => $this->etiquetaPermiso($nombre),
                    'descripcion' => null,
                ],
            );

            return [$nombre => $permiso->id];
        });

        // Crear cada rol y sincronizar sus permisos.
        foreach (RolSistema::cases() as $rolSistema) {
            $rol = Rol::updateOrCreate(
                ['nombre' => $rolSistema->value],
                [
                    'nombre_mostrar' => $rolSistema->label(),
                    'descripcion' => $rolSistema->descripcion(),
                ],
            );

            $ids = collect($rolSistema->permisosBase())
                ->map(fn (string $p) => $permisosCreados[$p])
                ->all();

            $rol->permisos()->sync($ids);
        }
    }

    /**
     * Genera una etiqueta legible a partir del nombre del permiso (ej: "usuarios.crear" → "Crear Usuarios").
     */
    private function etiquetaPermiso(string $nombre): string
    {
        [$modulo, $accion] = explode('.', $nombre, 2) + ['', ''];

        return ucfirst($accion).' '.ucfirst($modulo);
    }
}
