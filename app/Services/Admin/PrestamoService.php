<?php

namespace App\Services\Admin;

use App\Models\DetallePrestamo;
use App\Models\Estudiante;
use App\Models\Inventario;
use App\Models\Materia;
use App\Models\Prestamo;
use App\Models\SubLaboratorio;
use App\Models\UnidadHerramienta;
use Carbon\Carbon;
use Illuminate\Database\DatabaseManager;
use Illuminate\Validation\ValidationException;

class PrestamoService
{
    public function __construct(private readonly DatabaseManager $database) {}

    /** @return array<int, array<string, mixed>> */
    public function availableTools(int $subLaboratorioId): array
    {
        $activeUnitIds = DetallePrestamo::query()
            ->whereHas('prestamo', fn ($query) => $query->activos())
            ->whereNotNull('unidad_herramienta_id')
            ->pluck('unidad_herramienta_id');

        $units = UnidadHerramienta::query()
            ->with(['herramienta.categoria'])
            ->where('sub_laboratorio_id', $subLaboratorioId)
            ->where('estado', 'Disponible')
            ->whereNotIn('id', $activeUnitIds)
            ->get()
            ->map(fn (UnidadHerramienta $unit): array => [
                'id' => $unit->herramienta_id.'-'.$unit->id,
                'herramienta_id' => $unit->herramienta_id,
                'unidad_herramienta_id' => $unit->id,
                'codigo' => $unit->herramienta->codigo,
                'nombre' => $unit->herramienta->nombre,
                'serial' => $unit->numero_serie_barras,
                'categoria' => $unit->herramienta->categoria?->nombre,
                'cantidad_disponible' => 1,
                'serializado' => true,
            ])->values()->all();

        $serializedToolIds = $units !== [] ? collect($units)->pluck('herramienta_id')->unique() : collect();

        $inventories = Inventario::query()
            ->with(['herramienta.categoria'])
            ->where('sub_laboratorio_id', $subLaboratorioId)
            ->where('stock_disponible', '>', 0)
            ->whereNotIn('herramienta_id', $serializedToolIds)
            ->get();

        foreach ($inventories as $inventory) {
            $available = max(0, $inventory->stock_disponible);
            if ($available > 0) {
                $units[] = [
                    'id' => (string) $inventory->herramienta_id,
                    'herramienta_id' => $inventory->herramienta_id,
                    'unidad_herramienta_id' => null,
                    'codigo' => $inventory->herramienta->codigo,
                    'nombre' => $inventory->herramienta->nombre,
                    'serial' => null,
                    'categoria' => $inventory->herramienta->categoria?->nombre,
                    'cantidad_disponible' => $available,
                    'serializado' => false,
                ];
            }
        }

        return $units;
    }

    public function create(array $data, int $userId): Prestamo
    {
        return $this->database->transaction(function () use ($data, $userId): Prestamo {
            $student = Estudiante::query()->findOrFail($data['estudiante_id']);
            $subject = Materia::query()->with('estudiantes')->findOrFail($data['materia_id']);
            $lab = SubLaboratorio::query()->where('estado', true)->findOrFail($data['sub_laboratorio_id']);

            if (! $subject->estaActiva() || ! $subject->estudiantes->contains($student)) {
                throw ValidationException::withMessages(['materia_id' => 'El estudiante no está habilitado en la materia seleccionada.']);
            }

            $now = now();
            if ($subject->fecha_inicio?->isFuture() || $subject->fecha_fin?->isPast()) {
                throw ValidationException::withMessages(['materia_id' => 'La materia no está vigente en la fecha actual.']);
            }

            if ($subject->hora_inicio && $subject->hora_fin) {
                $start = Carbon::parse($subject->hora_inicio);
                $end = Carbon::parse($subject->hora_fin);
                if (! $now->between($now->copy()->setTimeFrom($start), $now->copy()->setTimeFrom($end))) {
                    throw ValidationException::withMessages(['materia_id' => 'El préstamo solo puede registrarse dentro del horario de la materia.']);
                }
            }

            $loan = Prestamo::query()->create([
                'estudiante_id' => $student->id,
                'materia_id' => $subject->id,
                'sub_laboratorio_id' => $lab->id,
                'entregado_por' => $userId,
                'fecha_hora_salida' => $now,
                'fecha_hora_prevista_devolucion' => $data['fecha_hora_prevista_devolucion'],
                'estado' => 'Activo',
                'observaciones' => $data['observaciones'] ?? null,
            ]);

            foreach ($data['herramientas'] as $item) {
                $this->reserveItem($item, $lab->id);
                $loan->detalles()->create([
                    'herramienta_id' => $item['herramienta_id'],
                    'unidad_herramienta_id' => $item['unidad_herramienta_id'] ?? null,
                    'cantidad' => ! empty($item['unidad_herramienta_id']) ? 1 : $item['cantidad'],
                    'estado_devolucion' => 'Pendiente',
                ]);
            }

            return $loan->load(['estudiante', 'materia', 'subLaboratorio', 'detalles.herramienta', 'detalles.unidadHerramienta']);
        });
    }

    public function return(Prestamo $loan, int $userId, array $data): void
    {
        $this->database->transaction(function () use ($loan, $userId, $data): void {
            $lockedLoan = Prestamo::query()->lockForUpdate()->with('detalles')->findOrFail($loan->id);
            if (! in_array($lockedLoan->estado, ['Activo', 'Vencido'], true)) {
                throw ValidationException::withMessages(['prestamo' => 'El préstamo ya fue cerrado.']);
            }

            foreach ($lockedLoan->detalles as $detail) {
                $detailData = collect($data['detalles'] ?? [])->firstWhere('id', $detail->id) ?? [];
                $detailStatus = $detailData['estado_devolucion'] ?? $data['estado_devolucion'] ?? 'Conforme';
                $detailObservation = ! empty(trim((string) ($detailData['observaciones'] ?? '')))
                    ? trim((string) $detailData['observaciones'])
                    : null;

                $detail->update([
                    'estado_devolucion' => $detailStatus,
                    'observaciones_devolucion' => $detailObservation,
                ]);

                if ($detail->unidad_herramienta_id) {
                    $nuevoEstadoUnidad = match ($detailStatus) {
                        'Conforme' => 'Disponible',
                        'Daño' => 'Dañado',
                        'Perdida' => 'Perdido',
                        'Con observaciones' => 'En Mantenimiento',
                        default => 'En Mantenimiento',
                    };

                    $unit = UnidadHerramienta::query()->whereKey($detail->unidad_herramienta_id)->first();
                    if ($unit) {
                        $unit->update([
                            'estado' => $nuevoEstadoUnidad,
                        ]);

                        $total = UnidadHerramienta::where('herramienta_id', $unit->herramienta_id)
                            ->where('sub_laboratorio_id', $unit->sub_laboratorio_id)
                            ->count();
                        $disponibles = UnidadHerramienta::where('herramienta_id', $unit->herramienta_id)
                            ->where('sub_laboratorio_id', $unit->sub_laboratorio_id)
                            ->where('estado', 'Disponible')
                            ->count();

                        Inventario::updateOrCreate(
                            [
                                'herramienta_id' => $unit->herramienta_id,
                                'sub_laboratorio_id' => $unit->sub_laboratorio_id,
                            ],
                            [
                                'stock_total' => $total,
                                'stock_disponible' => $disponibles,
                            ]
                        );
                    }
                } elseif ($detailStatus === 'Conforme') {
                    Inventario::query()
                        ->where('herramienta_id', $detail->herramienta_id)
                        ->where('sub_laboratorio_id', $lockedLoan->sub_laboratorio_id)
                        ->increment('stock_disponible', $detail->cantidad);
                }
            }

            $generalObservation = trim((string) ($data['observaciones_devolucion'] ?? ''));
            $currentObservations = $lockedLoan->observaciones ? trim($lockedLoan->observaciones) : '';
            if ($generalObservation !== '') {
                $currentObservations = $currentObservations !== ''
                    ? $currentObservations."\n[Devolución]: ".$generalObservation
                    : '[Devolución]: '.$generalObservation;
            }

            $lockedLoan->update([
                'recibido_por' => $userId,
                'fecha_hora_devolucion' => now(),
                'estado' => collect($lockedLoan->detalles)->every(fn (DetallePrestamo $detail): bool => $detail->estado_devolucion === 'Conforme') ? 'Devuelto' : 'Con observaciones',
                'observaciones' => $currentObservations ?: null,
            ]);
        });
    }

    private function reserveItem(array $item, int $subLaboratorioId): void
    {
        if (! empty($item['unidad_herramienta_id'])) {
            $unit = UnidadHerramienta::query()->lockForUpdate()->findOrFail($item['unidad_herramienta_id']);
            if ($unit->sub_laboratorio_id !== $subLaboratorioId || $unit->estado !== 'Disponible') {
                throw ValidationException::withMessages(['herramientas' => "La unidad {$unit->numero_serie_barras} ya no está disponible."]);
            }
            $unit->update(['estado' => 'En Préstamo']);

            return;
        }

        $inventory = Inventario::query()->lockForUpdate()
            ->where('herramienta_id', $item['herramienta_id'])
            ->where('sub_laboratorio_id', $subLaboratorioId)
            ->first();
        if (! $inventory || $inventory->stock_disponible < $item['cantidad']) {
            throw ValidationException::withMessages(['herramientas' => 'El stock disponible cambió. Actualiza la pantalla e inténtalo nuevamente.']);
        }
        $inventory->decrement('stock_disponible', $item['cantidad']);
    }
}
