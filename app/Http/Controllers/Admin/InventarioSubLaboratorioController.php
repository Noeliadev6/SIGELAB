<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TransferirInventarioRequest;
use App\Services\Admin\InventarioSubLaboratorioService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventarioSubLaboratorioController extends Controller
{
    public function __construct(
        private readonly InventarioSubLaboratorioService $inventarioService
    ) {}

    /**
     * Muestra la vista de inventario agrupada por sub-laboratorio.
     */
    public function index(Request $request): Response
    {
        $subLabId = $request->filled('sub_laboratorio_id') ? $request->integer('sub_laboratorio_id') : null;
        $search = $request->filled('search') ? $request->string('search')->toString() : null;
        $categoriaId = $request->filled('categoria_id') ? $request->string('categoria_id')->toString() : null;

        $datos = $this->inventarioService->getDatosVista($subLabId, $search, $categoriaId);

        return Inertia::render('admin/inventario/index', $datos);
    }

    /**
     * Procesa la transferencia de stock entre sub-laboratorios.
     */
    public function transferir(TransferirInventarioRequest $request): RedirectResponse
    {
        $this->inventarioService->transferirStock(
            $request->validated(),
            (int) $request->user()?->id
        );

        return redirect()
            ->route('inventario.index', [
                'sub_laboratorio_id' => $request->integer('origen_sub_laboratorio_id'),
            ])
            ->with('success', 'Movimiento de inventario realizado exitosamente.');
    }
}
