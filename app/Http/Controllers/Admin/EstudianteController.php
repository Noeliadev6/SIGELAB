<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEstudianteRequest;
use App\Http\Requests\Admin\UpdateEstudianteRequest;
use App\Models\Estudiante;
use App\Models\Materia;
use App\Services\Admin\MateriaEstudianteService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EstudianteController extends Controller
{
    public function index(Request $request): Response
    {
        $estudiantes = Estudiante::query()->orderBy('nombre')->paginate(15)->through(fn (Estudiante $estudiante): array => [
            'id' => $estudiante->id, 'numero_registro' => $estudiante->numero_registro, 'numero' => $estudiante->numero_registro,
            'nombre' => $estudiante->nombre, 'carrera' => $estudiante->carrera, 'created_at' => $estudiante->created_at?->format('d/m/Y'),
        ]);
        $materias = Materia::query()->activas()->select(['id', 'nombre', 'modulo', 'grupo'])->orderBy('nombre')->get()
            ->map(fn (Materia $materia): array => ['id' => $materia->id, 'nombre' => $materia->nombre, 'modulo' => $materia->modulo, 'grupo' => $materia->grupo]);

        return Inertia::render('admin/estudiantes/index', ['estudiantes' => $estudiantes, 'materias' => $materias, 'puedeImportar' => $request->user()?->tienePermiso('estudiantes.importar') ?? false]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/estudiantes/create');
    }

    public function store(StoreEstudianteRequest $request, MateriaEstudianteService $service): RedirectResponse
    {
        $data = $request->validated();
        $materiaId = $data['materia_id'] ?? null;
        unset($data['materia_id']);

        if (empty($data['numero_registro']) && Estudiante::query()->whereNull('numero_registro')->where('nombre', $data['nombre'])->where('carrera', $data['carrera'])->exists()) {
            return back()->withErrors(['nombre' => 'Ya existe un estudiante externo con esos datos.']);
        }

        $estudiante = Estudiante::create($data);
        if ($materiaId !== null) {
            $service->associate(Materia::findOrFail($materiaId), $estudiante);
        }

        return redirect()->route('estudiantes.index')->with('success', 'Estudiante creado exitosamente.');
    }

    public function update(UpdateEstudianteRequest $request, Estudiante $estudiante): RedirectResponse
    {
        $estudiante->update($request->validated());

        return redirect()->route('estudiantes.index')->with('success', 'Estudiante actualizado exitosamente.');
    }

    public function destroy(Estudiante $estudiante): RedirectResponse
    {
        if ($estudiante->materias()->exists()) {
            return back()->withErrors(['estudiante' => 'No se puede eliminar un estudiante con materias asociadas. Retira primero las matrículas.']);
        }

        DB::transaction(function () use ($estudiante): void {
            $estudiante->delete();
        });

        return redirect()->route('estudiantes.index')->with('success', 'Estudiante eliminado exitosamente.');
    }
}
