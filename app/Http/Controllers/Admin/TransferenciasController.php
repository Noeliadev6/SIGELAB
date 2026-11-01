<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\InventarioSubLaboratorioService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransferenciasController extends Controller
{
    public function __construct(
        private readonly InventarioSubLaboratorioService $inventarioService
    ) {}

    public function index(Request $request): Response
    {
        $datos = $this->inventarioService->getDatosVista(null, null, null);

        // Filter for transferencias if needed, or use the general historial included in getDatosVista
        // the view already expects some data. Let's provide what it needs.
        // It needs subLaboratorios, historialMovimientos, and inventarios (maybe).

        return Inertia::render('admin/transferencias/index', [
            'subLaboratorios' => $datos['subLaboratorios'],
            'historialMovimientos' => $datos['historialMovimientos'],
            'inventarios' => $datos['inventarios'],
        ]);
    }
}
