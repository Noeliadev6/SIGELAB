<?php

namespace Database\Seeders;

use App\Models\Rol;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Primero crear los roles y permisos del sistema.
        $this->call(RolSeeder::class);
        $this->call(SubLaboratorioSeeder::class);
        $this->call(CategoriaSeeder::class);
        $this->call(InventarioSeeder::class);
        $this->call(AcademicSeeder::class);

        $rolAdmin = Rol::where('nombre', 'administrador')->first();
        $rolAuxiliar = Rol::where('nombre', 'auxiliar')->first();
        $rolDocente = Rol::where('nombre', 'docente')->first();

        User::firstOrCreate(
            ['email' => 'admin@labmeca.local'],
            [
                'name' => 'Administrador Sistema',
                'password' => bcrypt('password'),
                'rol_id' => $rolAdmin?->id,
                'estado' => true,
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'auxiliar@labmeca.local'],
            [
                'name' => 'Auxiliar Laboratorio',
                'password' => bcrypt('password'),
                'rol_id' => $rolAuxiliar?->id,
                'estado' => true,
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'docente@labmeca.local'],
            [
                'name' => 'Docente Meca',
                'password' => bcrypt('password'),
                'rol_id' => $rolDocente?->id,
                'estado' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}
