<?php

namespace Database\Seeders;

use App\Models\SubLaboratorio;
use Illuminate\Database\Seeder;

class SubLaboratorioSeeder extends Seeder
{
    /**
     * Puebla los tres sub-laboratorios principales habilitados en el sistema.
     */
    public function run(): void
    {
        $laboratorios = [
            [
                'codigo' => 'LAB-MOT',
                'nombre' => 'Laboratorio de Motores',
                'descripcion' => 'Sub-laboratorio dedicado al análisis, mantenimiento y diagnóstico de motores de combustión interna.',
                'estado' => true,
            ],
            [
                'codigo' => 'LAB-MYH',
                'nombre' => 'Laboratorio de Máquinas y Herramientas',
                'descripcion' => 'Sub-laboratorio equipado con máquinas herramientas, tornos, fresadoras e instrumental de taller.',
                'estado' => true,
            ],
            [
                'codigo' => 'LAB-INJ',
                'nombre' => 'Laboratorio de Inyección Electrónica',
                'descripcion' => 'Sub-laboratorio especializado en sistemas de inyección electrónica, unidades de control ECU y escáneres automotrices.',
                'estado' => true,
            ],
        ];

        foreach ($laboratorios as $lab) {
            SubLaboratorio::firstOrCreate(
                ['codigo' => $lab['codigo']],
                $lab
            );
        }
    }
}
