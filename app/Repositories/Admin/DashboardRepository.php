<?php

namespace App\Repositories\Admin;

use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    /**
     * @return array{tools: int, units: int, availableUnits: int, maintenanceUnits: int, laboratories: int, lowStock: int}
     */
    public function getInventorySummary(): array
    {
        return [
            'tools' => DB::table('herramientas')->count(),
            'units' => DB::table('unidades_herramientas')->count(),
            'availableUnits' => DB::table('unidades_herramientas')->where('estado', 'Disponible')->count(),
            'maintenanceUnits' => DB::table('unidades_herramientas')->whereIn('estado', ['Mantenimiento', 'Dañado', 'Baja'])->count(),
            'laboratories' => DB::table('sub_laboratorios')->where('estado', true)->count(),
            'lowStock' => DB::table('inventarios')
                ->whereColumn('stock_disponible', '<=', 'stock_total')
                ->where('stock_disponible', '<=', 2)
                ->count(),
        ];
    }

    /**
     * @return array{students: int, activeModules: int, activeLoans: int, overdueLoans: int, observedLoans: int}
     */
    public function getOperationalSummary(): array
    {
        return [
            'students' => DB::table('estudiantes')->count(),
            'activeModules' => DB::table('materias')
                ->where('estado', 'Activo')
                ->where(function ($query): void {
                    $query->whereNull('fecha_fin')->orWhereDate('fecha_fin', '>=', today());
                })
                ->count(),
            'activeLoans' => DB::table('prestamos')->where('estado', 'Activo')->count(),
            'overdueLoans' => DB::table('prestamos')->where('estado', 'Vencido')->count(),
            'observedLoans' => DB::table('prestamos')->where('estado', 'Con observaciones')->count(),
        ];
    }

    /**
     * Retorna las alertas de emergencia / atención inmediata.
     *
     * @return array{overdue: list<array<string, mixed>>, maintenance: list<array<string, mixed>>, criticalStock: list<array<string, mixed>>}
     */
    public function getEmergencyAlerts(): array
    {
        $overdue = DB::table('prestamos')
            ->join('estudiantes', 'estudiantes.id', '=', 'prestamos.estudiante_id')
            ->join('sub_laboratorios', 'sub_laboratorios.id', '=', 'prestamos.sub_laboratorio_id')
            ->where('prestamos.estado', 'Vencido')
            ->latest('prestamos.fecha_hora_prevista_devolucion')
            ->limit(5)
            ->get([
                'prestamos.id',
                'estudiantes.nombre as estudiante',
                'estudiantes.numero_registro as registro',
                'sub_laboratorios.nombre as laboratorio',
                'prestamos.fecha_hora_salida as salida',
                'prestamos.fecha_hora_prevista_devolucion as prevista',
            ])
            ->map(fn (object $item): array => [
                'id' => (int) $item->id,
                'codigo' => 'PRE-'.str_pad((string) $item->id, 6, '0', STR_PAD_LEFT),
                'estudiante' => (string) $item->estudiante,
                'registro' => (string) ($item->registro ?? ''),
                'laboratorio' => (string) $item->laboratorio,
                'prevista' => $item->prevista ? (string) $item->prevista : null,
            ])
            ->all();

        $maintenance = DB::table('unidades_herramientas')
            ->join('herramientas', 'herramientas.id', '=', 'unidades_herramientas.herramienta_id')
            ->join('sub_laboratorios', 'sub_laboratorios.id', '=', 'unidades_herramientas.sub_laboratorio_id')
            ->whereIn('unidades_herramientas.estado', ['Mantenimiento', 'Dañado', 'Baja'])
            ->latest('unidades_herramientas.updated_at')
            ->limit(5)
            ->get([
                'unidades_herramientas.id',
                'unidades_herramientas.numero_serie_barras as serial',
                'unidades_herramientas.estado',
                'herramientas.nombre as herramienta',
                'herramientas.codigo',
                'sub_laboratorios.nombre as laboratorio',
            ])
            ->map(fn (object $item): array => [
                'id' => (int) $item->id,
                'serial' => (string) ($item->serial ?? 'S/N'),
                'estado' => (string) $item->estado,
                'herramienta' => (string) $item->herramienta,
                'codigo' => (string) $item->codigo,
                'laboratorio' => (string) $item->laboratorio,
            ])
            ->all();

        $criticalStock = DB::table('inventarios')
            ->join('herramientas', 'herramientas.id', '=', 'inventarios.herramienta_id')
            ->join('sub_laboratorios', 'sub_laboratorios.id', '=', 'inventarios.sub_laboratorio_id')
            ->where('inventarios.stock_disponible', '<=', 2)
            ->orderBy('inventarios.stock_disponible', 'asc')
            ->limit(5)
            ->get([
                'inventarios.id',
                'inventarios.stock_disponible as disponible',
                'inventarios.stock_total as total',
                'herramientas.nombre as herramienta',
                'herramientas.codigo',
                'sub_laboratorios.nombre as laboratorio',
            ])
            ->map(fn (object $item): array => [
                'id' => (int) $item->id,
                'disponible' => (int) $item->disponible,
                'total' => (int) $item->total,
                'herramienta' => (string) $item->herramienta,
                'codigo' => (string) $item->codigo,
                'laboratorio' => (string) $item->laboratorio,
            ])
            ->all();

        return [
            'overdue' => array_values($overdue),
            'maintenance' => array_values($maintenance),
            'criticalStock' => array_values($criticalStock),
        ];
    }

    /**
     * @return list<array{id: int, type: string, quantity: int, createdAt: string|null, toolName: string, userName: string}>
     */
    public function getRecentMovements(int $limit = 5): array
    {
        $movements = DB::table('movimientos_stock')
            ->join('herramientas', 'herramientas.id', '=', 'movimientos_stock.herramienta_id')
            ->join('users', 'users.id', '=', 'movimientos_stock.usuario_id')
            ->latest('movimientos_stock.created_at')
            ->limit($limit)
            ->get([
                'movimientos_stock.id',
                'movimientos_stock.tipo_movimiento as type',
                'movimientos_stock.cantidad as quantity',
                'movimientos_stock.created_at as createdAt',
                'herramientas.nombre as toolName',
                'users.name as userName',
            ])
            ->map(fn (object $movement): array => [
                'id' => (int) $movement->id,
                'type' => (string) $movement->type,
                'quantity' => (int) $movement->quantity,
                'createdAt' => $movement->createdAt === null ? null : (string) $movement->createdAt,
                'toolName' => (string) $movement->toolName,
                'userName' => (string) $movement->userName,
            ])
            ->all();

        return array_values($movements);
    }
}
