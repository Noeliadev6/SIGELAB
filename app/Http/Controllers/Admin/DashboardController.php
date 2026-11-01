<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Prestamo;
use App\Models\User;
use App\Services\Admin\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService,
    ) {}

    public function __invoke(Request $request): Response
    {
        // Actualiza préstamos vencidos antes de calcular métricas operativas
        Prestamo::query()
            ->where('estado', 'Activo')
            ->whereNotNull('fecha_hora_prevista_devolucion')
            ->where('fecha_hora_prevista_devolucion', '<', now())
            ->update(['estado' => 'Vencido']);

        /** @var User $user */
        $user = $request->user();

        return Inertia::render('admin/dashboard', $this->dashboardService->getDashboardData($user));
    }
}
