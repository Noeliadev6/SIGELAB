<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Herramienta;
use App\Models\Inventario;
use App\Models\SubLaboratorio;
use App\Models\UnidadHerramienta;
use Illuminate\Database\Seeder;

class InventarioSeeder extends Seeder
{
    /**
     * Puebla categorías, herramientas e inventarios
     * tomando como referencia el listado de activos fijos
     * de los laboratorios.
     */
    public function run(): void
    {
        $subLabs = SubLaboratorio::all()->keyBy('codigo');

        if ($subLabs->isEmpty()) {
            return;
        }

        $labMot = $subLabs->get('LAB-MOT');
        $labMyh = $subLabs->get('LAB-MYH');
        $labInj = $subLabs->get('LAB-INJ');

        /*
        |--------------------------------------------------------------------------
        | Categorías
        |--------------------------------------------------------------------------
        */

        $categorias = [
            'EQUIPOS TECNOLOGICOS' => 'Equipos tecnológicos utilizados en los laboratorios.',
            'MESA' => 'Mesas utilizadas para actividades y trabajos de laboratorio.',
            'PIZARRA' => 'Pizarras utilizadas para actividades académicas y prácticas.',
            'MAQUINA-HERRAMIENTA' => 'Máquinas y herramientas utilizadas para trabajos mecánicos.',
            'MOTORES' => 'Motores utilizados para prácticas y actividades de laboratorio.',
            'MATERIAL DE LABORATORIOS' => 'Materiales utilizados en las actividades de laboratorio.',
            'MAQUINARIA' => 'Maquinaria utilizada para trabajos y prácticas técnicas.',
            'MOTOBOMBA' => 'Motobombas utilizadas en actividades y prácticas técnicas.',
            'COMPRESORA' => 'Compresoras utilizadas para trabajos y prácticas mecánicas.',
            'OTRAS HERRAMIENTAS MANUALES' => 'Herramientas manuales que no pertenecen a otra categoría.',
            'ESTANTE MELAMINICO' => 'Estantes fabricados en material melamínico.',
            'ESTANTE METALICO HELADERA' => 'Estantes metálicos utilizados para almacenamiento.',
            'VITRINA' => 'Vitrinas utilizadas para almacenar o exhibir materiales y equipos.',
            'ESTANTES' => 'Estantes utilizados para almacenamiento y organización.',
            'TALADRO' => 'Taladros utilizados para trabajos de perforación.',
            'SIERRA' => 'Sierras utilizadas para trabajos de corte.',
            'PRENSA' => 'Prensas utilizadas para sujetar o fijar piezas.',
            'MUEBLES VARIOS' => 'Mobiliario diverso utilizado en los laboratorios.',
            'EQUIPO DE LABORATORIO' => 'Equipos utilizados para prácticas y actividades de laboratorio.',
            'MONITORES' => 'Monitores utilizados como equipos tecnológicos.',
            'CPU' => 'Unidades centrales de procesamiento.',
            'ESCRITORIOS' => 'Escritorios utilizados para actividades administrativas y académicas.',
            'HERRAMIENTA ELECTRICA' => 'Herramientas eléctricas utilizadas para trabajos técnicos.',
            'VENTILADORES' => 'Ventiladores utilizados para ventilación y circulación de aire.',
            'MATERIAL DE LABORATORIO' => 'Materiales utilizados para prácticas de laboratorio.',
        ];

        $cats = [];

        foreach ($categorias as $nombre => $descripcion) {
            $cats[$nombre] = Categoria::firstOrCreate(
                ['nombre' => $nombre],
                ['descripcion' => $descripcion]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Activos del Laboratorio de Mecánica Automotriz
        |--------------------------------------------------------------------------
        |
        | Los nombres y códigos están basados en el listado de activos
        | proporcionado. Se evita duplicar registros por código.
        |
        */

        $herramientasData = [
            [
                'codigo' => '030501010525',
                'nombre' => 'COMUNICACION EC-3-EU(V)4 APSYST',
                'descripcion' => 'Equipo tecnológico de comunicación utilizado en el laboratorio.',
                'categoria' => 'EQUIPOS TECNOLOGICOS',
                'es_serializado' => true,
                'cantidad' => 1,
            ],

            [
                'codigo' => '030501010577',
                'nombre' => 'SCANNER AUTOMOTRIZ DE 3 ACCESORIOS',
                'descripcion' => 'Scanner automotriz utilizado para diagnóstico de vehículos.',
                'categoria' => 'EQUIPOS TECNOLOGICOS',
                'es_serializado' => true,
                'cantidad' => 1,
            ],

            [
                'codigo' => '030501010526',
                'nombre' => 'WIFI MONITOR FOR-M400-M800 & M1600',
                'descripcion' => 'Monitor utilizado como equipo tecnológico del laboratorio.',
                'categoria' => 'EQUIPOS TECNOLOGICOS',
                'es_serializado' => true,
                'cantidad' => 1,
            ],

            [
                'codigo' => '0203010533',
                'nombre' => 'MESA DE MADERA 40X55',
                'descripcion' => 'Mesa de madera utilizada para actividades del laboratorio.',
                'categoria' => 'MESA',
                'es_serializado' => false,
                'cantidad' => 1,
            ],

            [
                'codigo' => '0203020023',
                'nombre' => 'PIZARRA ACRILICA',
                'descripcion' => 'Pizarra acrílica utilizada para actividades académicas.',
                'categoria' => 'PIZARRA',
                'es_serializado' => false,
                'cantidad' => 1,
            ],

            [
                'codigo' => '0305010021',
                'nombre' => 'MAQUINA DE SOLDAR WS-250 A REGULADOR DE ARGON',
                'descripcion' => 'Máquina de soldar utilizada para trabajos prácticos de mecánica.',
                'categoria' => 'MAQUINA-HERRAMIENTA',
                'es_serializado' => true,
                'cantidad' => 1,
            ],

            [
                'codigo' => '0501070008',
                'nombre' => 'MOTOR TOYOTA A GASOLINA 1600CC ZN1',
                'descripcion' => 'Motor Toyota a gasolina utilizado para prácticas de mecánica automotriz.',
                'categoria' => 'MOTORES',
                'es_serializado' => true,
                'cantidad' => 1,
            ],

            [
                'codigo' => '0501070007',
                'nombre' => 'MOTOR TOYOTA A GASOLINA 1600CC ZN2',
                'descripcion' => 'Motor Toyota a gasolina utilizado para prácticas de mecánica automotriz.',
                'categoria' => 'MOTORES',
                'es_serializado' => true,
                'cantidad' => 1,
            ],

            [
                'codigo' => '0501070005',
                'nombre' => 'MOTOR TOYOTA A GASOLINA CAJA AUTOMATICA 451319131',
                'descripcion' => 'Motor Toyota a gasolina con caja automática para prácticas.',
                'categoria' => 'MOTORES',
                'es_serializado' => true,
                'cantidad' => 1,
            ],

            [
                'codigo' => '0501070006',
                'nombre' => 'MOTOR TOYOTA A GASOLINA CAJA AUTOMATICA 4S0766506',
                'descripcion' => 'Motor Toyota a gasolina con caja automática para prácticas.',
                'categoria' => 'MOTORES',
                'es_serializado' => true,
                'cantidad' => 1,
            ],

            /*
            |--------------------------------------------------------------------------
            | Equipos adicionales de referencia
            |--------------------------------------------------------------------------
            */

            [
                'codigo' => 'LAB-MOT-001',
                'nombre' => 'MOTOBOMBA',
                'descripcion' => 'Motobomba utilizada para prácticas y actividades técnicas.',
                'categoria' => 'MOTOBOMBA',
                'es_serializado' => true,
                'cantidad' => 1,
            ],

        ];

        /*
        |--------------------------------------------------------------------------
        | Crear herramientas e inventarios
        |--------------------------------------------------------------------------
        */

        foreach ($herramientasData as $data) {
            $herramienta = Herramienta::firstOrCreate(
                ['codigo' => $data['codigo']],
                [
                    'nombre' => $data['nombre'],
                    'descripcion' => $data['descripcion'],
                    'categoria_id' => $cats[$data['categoria']]->id,
                    'es_serializado' => $data['es_serializado'],
                ]
            );

            /*
            | Si existe el Laboratorio de Mecánica Automotriz,
            | se registra el activo allí.
            */
            if ($labMot) {
                Inventario::updateOrCreate(
                    [
                        'herramienta_id' => $herramienta->id,
                        'sub_laboratorio_id' => $labMot->id,
                    ],
                    [
                        'stock_total' => $data['cantidad'],
                        'stock_disponible' => $data['cantidad'],
                    ]
                );

                /*
                | Para activos serializados se genera una unidad
                | individual por cada cantidad.
                */
                if ($data['es_serializado']) {
                    for ($i = 1; $i <= $data['cantidad']; $i++) {
                        UnidadHerramienta::firstOrCreate(
                            [
                                'herramienta_id' => $herramienta->id,
                                'sub_laboratorio_id' => $labMot->id,
                                'numero_serie_barras' => $data['codigo'].'-U'.str_pad($i, 3, '0', STR_PAD_LEFT),
                            ],
                            [
                                'estado' => 'Disponible',
                            ]
                        );
                    }
                }
            }
        }
    }
}
