<?php

namespace Database\Seeders;

use App\Models\Estudiante;
use App\Models\Materia;
use Illuminate\Database\Seeder;

class AcademicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $materias = [
            'motores' => Materia::updateOrCreate(
                ['codigo' => 'MAT-MOT-001'],
                [
                    'sigla' => 'MOT-101',
                    'nombre' => 'Motores de Combustion Interna',
                    'modulo' => 'Modulo 1',
                    'periodo' => 'Primer semestre',
                    'modulo_inicio' => 0,
                    'modulo_fin' => 2,
                    'grupo' => 'A',
                    'fecha_inicio' => '2026-02-02',
                    'fecha_fin' => '2026-06-20',
                    'hora_inicio' => '07:15:00',
                    'hora_fin' => '10:15:00',
                    'estado' => 'Activo',
                ],
            ),
            'diagnostico' => Materia::updateOrCreate(
                ['codigo' => 'MAT-DIA-002'],
                [
                    'sigla' => 'DIA-201',
                    'nombre' => 'Diagnostico Automotriz',
                    'modulo' => 'Modulo 2',
                    'periodo' => 'Primer semestre',
                    'modulo_inicio' => 2,
                    'modulo_fin' => 3,
                    'grupo' => 'B',
                    'fecha_inicio' => '2026-03-10',
                    'fecha_fin' => '2026-06-28',
                    'hora_inicio' => '10:15:00',
                    'hora_fin' => '13:15:00',
                    'estado' => 'Activo',
                ],
            ),
            'mecanica' => Materia::updateOrCreate(
                ['codigo' => 'MAT-MEC-003'],
                [
                    'sigla' => 'MEC-301',
                    'nombre' => 'Mecanica de Taller',
                    'modulo' => 'Modulo 3',
                    'periodo' => 'Segundo semestre',
                    'modulo_inicio' => 3,
                    'modulo_fin' => 4,
                    'grupo' => 'A',
                    'fecha_inicio' => '2026-08-03',
                    'fecha_fin' => '2026-12-12',
                    'hora_inicio' => '13:15:00',
                    'hora_fin' => '16:15:00',
                    'estado' => 'Activo',
                ],
            ),
            'seguridad' => Materia::updateOrCreate(
                ['codigo' => 'MAT-SEG-004'],
                [
                    'sigla' => 'SEG-401',
                    'nombre' => 'Seguridad Industrial',
                    'modulo' => 'Modulo 4',
                    'periodo' => 'Segundo semestre',
                    'modulo_inicio' => 4,
                    'modulo_fin' => 5,
                    'grupo' => 'C',
                    'fecha_inicio' => '2026-07-15',
                    'fecha_fin' => '2026-11-28',
                    'hora_inicio' => '16:15:00',
                    'hora_fin' => '19:15:00',
                    'estado' => 'Inactivo',
                ],
            ),
            'electricidad' => Materia::updateOrCreate(
                ['codigo' => 'MAT-ELE-005'],
                [
                    'sigla' => 'ELE-501',
                    'nombre' => 'Electricidad Industrial',
                    'modulo' => 'Modulo 5',
                    'periodo' => 'Primer semestre',
                    'modulo_inicio' => 1,
                    'modulo_fin' => 2,
                    'grupo' => 'D',
                    'fecha_inicio' => '2026-01-19',
                    'fecha_fin' => '2026-05-30',
                    'hora_inicio' => '19:15:00',
                    'hora_fin' => '21:45:00',
                    'estado' => 'Activo',
                ],
            ),
            'hidraulica' => Materia::updateOrCreate(
                ['codigo' => 'MAT-HID-006'],
                [
                    'sigla' => 'HID-601',
                    'nombre' => 'Sistemas Hidraulicos y Neumaticos',
                    'modulo' => 'Modulo 2',
                    'periodo' => 'Segundo semestre',
                    'modulo_inicio' => 2,
                    'modulo_fin' => 3,
                    'grupo' => 'B',
                    'fecha_inicio' => '2026-09-01',
                    'fecha_fin' => '2027-01-15',
                    'hora_inicio' => '07:15:00',
                    'hora_fin' => '10:15:00',
                    'estado' => 'Activo',
                ],
            ),
            'soldadura' => Materia::updateOrCreate(
                ['codigo' => 'MAT-SOL-007'],
                [
                    'sigla' => 'SOL-701',
                    'nombre' => 'Soldadura y Conformado de Metales',
                    'modulo' => 'Modulo 1',
                    'periodo' => 'Segundo semestre',
                    'modulo_inicio' => 0,
                    'modulo_fin' => 1,
                    'grupo' => 'A',
                    'fecha_inicio' => '2026-08-10',
                    'fecha_fin' => '2026-11-15',
                    'hora_inicio' => '10:15:00',
                    'hora_fin' => '13:15:00',
                    'estado' => 'Activo',
                ],
            ),
            'automatizacion' => Materia::updateOrCreate(
                ['codigo' => 'MAT-AUT-008'],
                [
                    'sigla' => 'AUT-801',
                    'nombre' => 'Automatizacion y Control',
                    'modulo' => 'Modulo 4',
                    'periodo' => 'Primer semestre',
                    'modulo_inicio' => 3,
                    'modulo_fin' => 5,
                    'grupo' => 'C',
                    'fecha_inicio' => '2026-04-01',
                    'fecha_fin' => '2026-06-30',
                    'hora_inicio' => '16:15:00',
                    'hora_fin' => '19:15:00',
                    'estado' => 'Activo',
                ],
            ),
        ];

        $estudiantes = [
            'ana' => Estudiante::updateOrCreate(
                ['numero_registro' => '260001'],
                ['nombre' => 'Ana Martinez Rojas', 'carrera' => 'Ingenieria Mecanica'],
            ),
            'bruno' => Estudiante::updateOrCreate(
                ['numero_registro' => '260002'],
                ['nombre' => 'Bruno Vargas Lopez', 'carrera' => 'Ingenieria Mecanica'],
            ),
            'carla' => Estudiante::updateOrCreate(
                ['numero_registro' => '260003'],
                ['nombre' => 'Carla Fernandez Diaz', 'carrera' => 'Ingenieria Electromecanica'],
            ),
            'diego' => Estudiante::updateOrCreate(
                ['numero_registro' => '260004'],
                ['nombre' => 'Diego Paredes Quispe', 'carrera' => 'Ingenieria Mecanica'],
            ),
            'elena' => Estudiante::updateOrCreate(
                ['numero_registro' => '260005'],
                ['nombre' => 'Elena Soto Mamani', 'carrera' => 'Ingenieria Electromecanica'],
            ),
            'fabian' => Estudiante::updateOrCreate(
                ['numero_registro' => '260006'],
                ['nombre' => 'Fabian Calle Huanca', 'carrera' => 'Ingenieria Industrial'],
            ),
            'gabriela' => Estudiante::updateOrCreate(
                ['numero_registro' => '260007'],
                ['nombre' => 'Gabriela Rios Condori', 'carrera' => 'Ingenieria Mecanica'],
            ),
            'hugo' => Estudiante::updateOrCreate(
                ['numero_registro' => '260008'],
                ['nombre' => 'Hugo Perez Villca', 'carrera' => 'Ingenieria Industrial'],
            ),
            'irene' => Estudiante::updateOrCreate(
                ['numero_registro' => '260009'],
                ['nombre' => 'Irene Montano Cruz', 'carrera' => 'Ingenieria Electromecanica'],
            ),
            'julian' => Estudiante::updateOrCreate(
                ['numero_registro' => '260010'],
                ['nombre' => 'Julian Flores Choque', 'carrera' => 'Ingenieria Mecanica'],
            ),
            'externa' => Estudiante::updateOrCreate(
                ['nombre' => 'Lucia Valdez Externa', 'carrera' => 'Tecnico Externo'],
                ['numero_registro' => null],
            ),
            'externo_mario' => Estudiante::updateOrCreate(
                ['nombre' => 'Mario Gutierrez Externo', 'carrera' => 'Tecnico Externo'],
                ['numero_registro' => null],
            ),
        ];

        // Motores: 3 estudiantes - mezcla de regulares y externo
        $materias['motores']->estudiantes()->sync([
            $estudiantes['ana']->id,
            $estudiantes['bruno']->id,
            $estudiantes['externa']->id,
        ]);

        // Diagnostico: 2 estudiantes de distintas carreras
        $materias['diagnostico']->estudiantes()->sync([
            $estudiantes['carla']->id,
            $estudiantes['elena']->id,
        ]);

        // Mecanica: 4 estudiantes - la materia mas concurrida
        $materias['mecanica']->estudiantes()->sync([
            $estudiantes['diego']->id,
            $estudiantes['fabian']->id,
            $estudiantes['gabriela']->id,
            $estudiantes['hugo']->id,
        ]);

        // Seguridad (inactiva): 1 externo
        $materias['seguridad']->estudiantes()->sync([
            $estudiantes['externo_mario']->id,
        ]);

        // Electricidad: 2 estudiantes
        $materias['electricidad']->estudiantes()->sync([
            $estudiantes['irene']->id,
            $estudiantes['julian']->id,
        ]);

        // Hidraulica: 3 estudiantes - Ana tiene 2 materias (motores + hidraulica)
        $materias['hidraulica']->estudiantes()->sync([
            $estudiantes['ana']->id,
            $estudiantes['diego']->id,
            $estudiantes['carla']->id,
        ]);

        // Soldadura: 2 estudiantes - Bruno tiene 2 materias (motores + soldadura)
        $materias['soldadura']->estudiantes()->sync([
            $estudiantes['bruno']->id,
            $estudiantes['elena']->id,
        ]);

        // Automatizacion: sin estudiantes (materia nueva abierta a inscripcion)
    }
}
