<?php

namespace App\Enums;

enum RolSistema: string
{
    case Administrador = 'administrador';
    case Docente = 'docente';
    case Auxiliar = 'auxiliar';

    /**
     * Retorna la etiqueta legible del rol.
     */
    public function label(): string
    {
        return match ($this) {
            self::Administrador => 'Administrador',
            self::Docente => 'Docente',
            self::Auxiliar => 'Auxiliar',
        };
    }

    /**
     * Retorna los nombres de permisos base para cada rol.
     *
     * @return array<string>
     */
    public function permisosBase(): array
    {
        return match ($this) {
            self::Administrador => [
                'usuarios.ver', 'usuarios.crear', 'usuarios.editar', 'usuarios.eliminar',
                'roles.ver', 'roles.editar',
                'catalogo.ver', 'catalogo.crear', 'catalogo.editar', 'catalogo.eliminar',
                'inventario.ver', 'inventario.crear', 'inventario.editar', 'inventario.eliminar',
                'estudiantes.ver', 'estudiantes.importar',
                'prestamos.ver', 'prestamos.crear', 'prestamos.cerrar',
                'reportes.ver', 'reportes.exportar',
                'backup.crear',
            ],
            self::Docente => [
                'inventario.ver',
                'estudiantes.ver', 'estudiantes.importar',
                'prestamos.ver',
                'reportes.ver', 'reportes.exportar',
            ],
            self::Auxiliar => [
                'catalogo.ver', 'catalogo.crear', 'catalogo.editar', 'catalogo.eliminar',
                'inventario.ver',
                'estudiantes.ver', 'estudiantes.importar',
                'prestamos.ver', 'prestamos.crear', 'prestamos.cerrar',
            ],
        };
    }

    /**
     * Descripción del rol para mostrar en la interfaz.
     */
    public function descripcion(): string
    {
        return match ($this) {
            self::Administrador => 'Acceso total al sistema: reportes, métricas, gestión de inventario y usuarios.',
            self::Docente => 'Acceso a reportes, métricas y consulta de inventario.',
            self::Auxiliar => 'Acceso operativo: préstamos, devoluciones e importación de listas.',
        };
    }
}
