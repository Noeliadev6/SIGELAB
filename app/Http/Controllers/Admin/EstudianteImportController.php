<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImportPlanillaRequest;
use App\Models\Materia;
use App\Services\Admin\EstudianteImportService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class EstudianteImportController extends Controller
{
    public function __construct(private readonly EstudianteImportService $service) {}

    public function create(): Response
    {
        $materias = Materia::query()
            ->activas()
            ->select(['id', 'nombre', 'modulo', 'grupo'])
            ->orderBy('nombre')
            ->get()
            ->map(fn (Materia $materia): array => [
                'id' => $materia->id,
                'nombre' => $materia->nombre,
                'modulo' => $materia->modulo,
                'grupo' => $materia->grupo,
            ]);

        return Inertia::render('admin/estudiantes/import', ['materias' => $materias]);
    }

    public function store(ImportPlanillaRequest $request): RedirectResponse
    {
        try {
            $materia = Materia::findOrFail($request->integer('materia_id'));

            return back()->with('importResult', $this->service->import($request->file('planilla')->getRealPath(), $materia, $request->user()));
        } catch (Throwable $exception) {
            return back()->withErrors(['planilla' => $exception->getMessage()]);
        }
    }
}
