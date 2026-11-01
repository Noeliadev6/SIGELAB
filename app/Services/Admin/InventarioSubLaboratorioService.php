<?php

namespace App\Services\Admin;

use App\Models\Categoria;
use App\Models\Herramienta;
use App\Models\Inventario;
use App\Models\MovimientoStock;
use App\Models\SubLaboratorio;
use App\Models\UnidadHerramienta;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventarioSubLaboratorioService
{
    /**
     * Obtiene todos los datos requeridos para la vista de Inventario por Sub-Laboratorio.
     *
     * @return array<string, mixed>
     */
    public function getDatosVista(?int $subLaboratorioId = null, ?string $search = null, ?string $categoriaId = null): array
    {
        $this->sincronizarInventariosConUnidades();

        $subLaboratorios = SubLaboratorio::query()
            ->where('estado', true)
            ->orderBy('nombre')
            ->get()
            ->map(function (SubLaboratorio $lab): array {
                $totalStock = (int) Inventario::where('sub_laboratorio_id', $lab->id)->sum('stock_total');
                $herramientasCount = (int) Inventario::where('sub_laboratorio_id', $lab->id)->where('stock_total', '>', 0)->count();

                return [
                    'id' => $lab->id,
                    'codigo' => $lab->codigo,
                    'nombre' => $lab->nombre,
                    'descripcion' => $lab->descripcion,
                    'total_stock' => $totalStock,
                    'total_herramientas' => $herramientasCount,
                ];
            });

        $query = Inventario::query()
            ->with([
                'herramienta.categoria',
                'herramienta.unidades' => fn ($q) => $q->orderBy('numero_serie_barras'),
                'subLaboratorio',
            ])
            ->whereHas('subLaboratorio', fn ($q) => $q->where('estado', true));

        if ($subLaboratorioId !== null && $subLaboratorioId > 0) {
            $query->where('sub_laboratorio_id', $subLaboratorioId);
        }

        if ($search !== null && trim($search) !== '') {
            $term = trim($search);
            $query->whereHas('herramienta', function (Builder $q) use ($term) {
                $q->where('nombre', 'like', "%{$term}%")
                    ->orWhere('codigo', 'like', "%{$term}%");
            });
        }

        if ($categoriaId !== null && (int) $categoriaId > 0) {
            $query->whereHas('herramienta', fn (Builder $q) => $q->where('categoria_id', (int) $categoriaId));
        }

        $inventarios = $query
            ->orderBy('sub_laboratorio_id')
            ->get()
            ->map(function (Inventario $inv): array {
                /** @var Herramienta $herramienta */
                $herramienta = $inv->herramienta;
                /** @var SubLaboratorio $subLab */
                $subLab = $inv->subLaboratorio;

                $unidadesSubLab = $herramienta->unidades
                    ->where('sub_laboratorio_id', $inv->sub_laboratorio_id)
                    ->values()
                    ->map(fn (UnidadHerramienta $u): array => [
                        'id' => $u->id,
                        'numero_serie_barras' => $u->numero_serie_barras,
                        'estado' => $u->estado,
                    ])
                    ->all();

                return [
                    'id' => $inv->id,
                    'herramienta_id' => $herramienta->id,
                    'codigo_herramienta' => $herramienta->codigo,
                    'nombre_herramienta' => $herramienta->nombre,
                    'descripcion_herramienta' => $herramienta->descripcion,
                    'es_serializado' => $herramienta->es_serializado,
                    'categoria' => $herramienta->categoria?->only(['id', 'nombre']),
                    'sub_laboratorio' => $subLab->only(['id', 'nombre', 'codigo']),
                    'stock_total' => $inv->stock_total,
                    'stock_disponible' => $inv->stock_disponible,
                    'unidades' => $unidadesSubLab,
                ];
            });

        $categorias = Categoria::orderBy('nombre')->get(['id', 'nombre']);

        $historialMovimientos = MovimientoStock::query()
            ->with(['herramienta', 'unidadHerramienta', 'origenSubLaboratorio', 'destinoSubLaboratorio', 'usuario'])
            ->latest('created_at')
            ->limit(20)
            ->get()
            ->map(fn (MovimientoStock $mov): array => [
                'id' => $mov->id,
                'herramienta' => $mov->herramienta?->nombre ?? 'N/A',
                'codigo_herramienta' => $mov->herramienta?->codigo ?? 'N/A',
                'unidad_serie' => $mov->unidadHerramienta?->numero_serie_barras,
                'origen' => $mov->origenSubLaboratorio?->nombre ?? 'N/A',
                'destino' => $mov->destinoSubLaboratorio?->nombre ?? 'N/A',
                'usuario' => $mov->usuario?->name ?? 'Sistema',
                'tipo_movimiento' => $mov->tipo_movimiento,
                'cantidad' => $mov->cantidad,
                'observaciones' => $mov->observaciones,
                'fecha' => $mov->created_at?->format('d/m/Y H:i'),
            ]);

        $resumenGeneral = [
            'total_items_distintos' => Herramienta::count(),
            'stock_total_global' => Inventario::sum('stock_total'),
            'stock_disponible_global' => Inventario::sum('stock_disponible'),
            'total_sub_laboratorios' => count($subLaboratorios),
        ];

        return [
            'subLaboratorios' => $subLaboratorios,
            'inventarios' => $inventarios,
            'categorias' => $categorias,
            'historialMovimientos' => $historialMovimientos,
            'resumenGeneral' => $resumenGeneral,
            'filters' => [
                'sub_laboratorio_id' => $subLaboratorioId,
                'search' => $search,
                'categoria_id' => $categoriaId,
            ],
        ];
    }

    /**
     * Realiza la transferencia de herramientas entre sub-laboratorios en una transacción atómica.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws ValidationException
     */
    public function transferirStock(array $data, int $usuarioId): void
    {
        DB::transaction(function () use ($data, $usuarioId): void {
            $herramientaId = (int) $data['herramienta_id'];
            $origenId = (int) $data['origen_sub_laboratorio_id'];
            $destinoId = (int) $data['destino_sub_laboratorio_id'];
            $cantidad = (int) $data['cantidad'];
            $unidadId = isset($data['unidad_herramienta_id']) ? (int) $data['unidad_herramienta_id'] : null;
            $observaciones = isset($data['observaciones']) ? (string) $data['observaciones'] : null;

            $inventarioOrigen = Inventario::where('herramienta_id', $herramientaId)
                ->where('sub_laboratorio_id', $origenId)
                ->lockForUpdate()
                ->first();

            if (! $inventarioOrigen || $inventarioOrigen->stock_disponible < $cantidad) {
                throw ValidationException::withMessages([
                    'cantidad' => 'El sub-laboratorio de origen no posee suficiente stock disponible para realizar la transferencia.',
                ]);
            }

            // Decrementar stock origen
            $inventarioOrigen->decrement('stock_total', $cantidad);
            $inventarioOrigen->decrement('stock_disponible', $cantidad);

            // Incrementar o crear stock en destino
            $inventarioDestino = Inventario::firstOrCreate(
                [
                    'herramienta_id' => $herramientaId,
                    'sub_laboratorio_id' => $destinoId,
                ],
                [
                    'stock_total' => 0,
                    'stock_disponible' => 0,
                ]
            );

            $inventarioDestino->increment('stock_total', $cantidad);
            $inventarioDestino->increment('stock_disponible', $cantidad);

            // Actualizar unidad serializada si aplica
            if ($unidadId !== null) {
                $unidad = UnidadHerramienta::where('id', $unidadId)
                    ->where('sub_laboratorio_id', $origenId)
                    ->first();

                if ($unidad) {
                    $unidad->update(['sub_laboratorio_id' => $destinoId]);
                }
            }

            // Registrar movimiento auditado
            MovimientoStock::create([
                'herramienta_id' => $herramientaId,
                'unidad_herramienta_id' => $unidadId,
                'origen_sub_laboratorio_id' => $origenId,
                'destino_sub_laboratorio_id' => $destinoId,
                'usuario_id' => $usuarioId,
                'tipo_movimiento' => 'Transferencia',
                'cantidad' => $cantidad,
                'observaciones' => $observaciones,
                'created_at' => now(),
            ]);
        });
    }

    /**
     * Sincroniza automáticamente los registros de inventario con las unidades físicas registradas.
     */
    public function sincronizarInventariosConUnidades(): void
    {
        $combos = UnidadHerramienta::query()
            ->select('herramienta_id', 'sub_laboratorio_id')
            ->distinct()
            ->get();

        foreach ($combos as $combo) {
            $total = UnidadHerramienta::where('herramienta_id', $combo->herramienta_id)
                ->where('sub_laboratorio_id', $combo->sub_laboratorio_id)
                ->count();

            $disponibles = UnidadHerramienta::where('herramienta_id', $combo->herramienta_id)
                ->where('sub_laboratorio_id', $combo->sub_laboratorio_id)
                ->where('estado', 'Disponible')
                ->count();

            Inventario::updateOrCreate(
                [
                    'herramienta_id' => $combo->herramienta_id,
                    'sub_laboratorio_id' => $combo->sub_laboratorio_id,
                ],
                [
                    'stock_total' => $total,
                    'stock_disponible' => $disponibles,
                ]
            );
        }

        // Sincronizar todos los inventarios de herramientas serializadas
        $inventariosSerializados = Inventario::whereHas('herramienta', fn ($q) => $q->where('es_serializado', true))->get();
        foreach ($inventariosSerializados as $inv) {
            $total = UnidadHerramienta::where('herramienta_id', $inv->herramienta_id)
                ->where('sub_laboratorio_id', $inv->sub_laboratorio_id)
                ->count();
            $disponibles = UnidadHerramienta::where('herramienta_id', $inv->herramienta_id)
                ->where('sub_laboratorio_id', $inv->sub_laboratorio_id)
                ->where('estado', 'Disponible')
                ->count();

            if ($inv->stock_total !== $total || $inv->stock_disponible !== $disponibles) {
                $inv->update([
                    'stock_total' => $total,
                    'stock_disponible' => $disponibles,
                ]);
            }
        }
    }
}
