<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            [
                'nombre' => 'EQUIPOS TECNOLOGICOS',
                'descripcion' => 'Equipos tecnológicos utilizados en los laboratorios.',
            ],
            [
                'nombre' => 'MESA',
                'descripcion' => 'Mesas utilizadas para actividades y trabajos de laboratorio.',
            ],
            [
                'nombre' => 'PIZARRA',
                'descripcion' => 'Pizarras utilizadas para actividades académicas y prácticas.',
            ],
            [
                'nombre' => 'MAQUINA-HERRAMIENTA',
                'descripcion' => 'Máquinas y herramientas utilizadas para trabajos mecánicos.',
            ],
            [
                'nombre' => 'MOTORES',
                'descripcion' => 'Motores utilizados para prácticas y actividades de laboratorio.',
            ],
            [
                'nombre' => 'MATERIAL DE LABORATORIOS',
                'descripcion' => 'Materiales utilizados en las actividades de laboratorio.',
            ],
            [
                'nombre' => 'MAQUINARIA',
                'descripcion' => 'Maquinaria utilizada para trabajos y prácticas técnicas.',
            ],
            [
                'nombre' => 'MOTOBOMBA',
                'descripcion' => 'Motobombas utilizadas en actividades y prácticas técnicas.',
            ],
            [
                'nombre' => 'COMPRESORA',
                'descripcion' => 'Compresoras utilizadas para trabajos y prácticas mecánicas.',
            ],
            [
                'nombre' => 'OTRAS HERRAMIENTAS MANUALES',
                'descripcion' => 'Herramientas manuales que no pertenecen a otra categoría específica.',
            ],
            [
                'nombre' => 'ESTANTE MELAMINICO',
                'descripcion' => 'Estantes fabricados en material melamínico para almacenamiento.',
            ],
            [
                'nombre' => 'ESTANTE METALICO HELADERA',
                'descripcion' => 'Estantes metálicos destinados al almacenamiento de equipos y materiales.',
            ],
            [
                'nombre' => 'VITRINA',
                'descripcion' => 'Vitrinas utilizadas para almacenar o exhibir materiales y equipos.',
            ],
            [
                'nombre' => 'ESTANTES',
                'descripcion' => 'Estantes utilizados para almacenamiento y organización.',
            ],
            [
                'nombre' => 'TALADRO',
                'descripcion' => 'Taladros utilizados para trabajos mecánicos y de perforación.',
            ],
            [
                'nombre' => 'SIERRA',
                'descripcion' => 'Sierras utilizadas para trabajos de corte.',
            ],
            [
                'nombre' => 'PRENSA',
                'descripcion' => 'Prensas utilizadas para sujetar, fijar o trabajar piezas.',
            ],
            [
                'nombre' => 'MUEBLES VARIOS',
                'descripcion' => 'Mobiliario diverso utilizado en los laboratorios.',
            ],
            [
                'nombre' => 'EQUIPO DE LABORATORIO',
                'descripcion' => 'Equipos utilizados para actividades y prácticas de laboratorio.',
            ],
            [
                'nombre' => 'MONITORES',
                'descripcion' => 'Monitores utilizados como equipos tecnológicos.',
            ],
            [
                'nombre' => 'CPU',
                'descripcion' => 'Unidades centrales de procesamiento utilizadas en los laboratorios.',
            ],
            [
                'nombre' => 'ESCRITORIOS',
                'descripcion' => 'Escritorios utilizados para actividades administrativas y académicas.',
            ],
            [
                'nombre' => 'HERRAMIENTA ELECTRICA',
                'descripcion' => 'Herramientas eléctricas utilizadas para trabajos técnicos y mecánicos.',
            ],
            [
                'nombre' => 'VENTILADORES',
                'descripcion' => 'Ventiladores utilizados para ventilación y circulación de aire.',
            ],
            [
                'nombre' => 'MATERIAL DE LABORATORIO',
                'descripcion' => 'Materiales utilizados para actividades y prácticas de laboratorio.',
            ],
        ];

        foreach ($categorias as $categoria) {
            Categoria::firstOrCreate(
                ['nombre' => $categoria['nombre']],
                ['descripcion' => $categoria['descripcion']]
            );
        }
    }
}
