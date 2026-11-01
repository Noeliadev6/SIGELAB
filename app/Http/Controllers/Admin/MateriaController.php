<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMateriaEstudianteRequest;
use App\Http\Requests\Admin\StoreMateriaRequest;
use App\Http\Requests\Admin\UpdateMateriaRequest;
use App\Models\Estudiante;
use App\Models\Materia;
use App\Services\Admin\MateriaEstudianteService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MateriaController extends Controller
{
    public function index(): Response
    {
        $materias = Materia::query()
            ->with(['estudiantes:id,numero_registro,nombre,carrera'])
            ->select([
                'id', 'codigo', 'nombre', 'modulo', 'periodo', 'modulo_inicio', 'modulo_fin', 'grupo',
                'fecha_inicio', 'fecha_fin', 'hora_inicio', 'hora_fin', 'estado',
            ])
            ->orderBy('nombre')
            ->get()
            ->map(fn (Materia $materia): array => [
                'id' => $materia->id,
                'codigo' => $materia->codigo,
                'nombre' => $materia->nombre,
                'modulo' => $materia->modulo,
                'periodo' => $materia->periodo,
                'modulo_inicio' => $materia->modulo_inicio,
                'modulo_fin' => $materia->modulo_fin,
                'grupo' => $materia->grupo,
                'fecha_inicio' => $materia->fecha_inicio?->toDateString(),
                'fecha_fin' => $materia->fecha_fin?->toDateString(),
                'hora_inicio' => $materia->hora_inicio,
                'hora_fin' => $materia->hora_fin,
                'estado' => $materia->estado,
                'estudiantes' => $materia->estudiantes->map(fn (Estudiante $estudiante): array => [
                    'id' => $estudiante->id,
                    'numero_registro' => $estudiante->numero_registro,
                    'nombre' => $estudiante->nombre,
                    'carrera' => $estudiante->carrera,
                ])->values(),
            ]);

        $estudiantes = Estudiante::query()
            ->select(['id', 'numero_registro', 'nombre', 'carrera'])
            ->orderBy('nombre')
            ->get();

        return Inertia::render('admin/materias/index', ['materias' => $materias, 'estudiantes' => $estudiantes]);
    }

    public function store(StoreMateriaRequest $request): RedirectResponse
    {
        Materia::create($request->validated());

        return redirect()->route('materias.index')->with('success', 'Materia creada exitosamente.');
    }

    public function update(UpdateMateriaRequest $request, Materia $materia, MateriaEstudianteService $service): RedirectResponse
    {
        DB::transaction(function () use ($request, $materia, $service): void {
            $materia->update($request->validated());
            $service->ensureScheduleAvailableForEnrolledStudents($materia->fresh());
        });

        return redirect()->route('materias.index')->with('success', 'Materia actualizada exitosamente.');
    }

    public function destroy(Materia $materia): RedirectResponse
    {
        if ($materia->estudiantes()->exists()) {
            return back()->withErrors(['materia' => 'No se puede eliminar una materia con estudiantes inscritos. Retira primero sus matrículas.']);
        }

        if (DB::table('prestamos')->where('materia_id', $materia->getKey())->exists()) {
            return back()->withErrors(['materia' => 'No se puede eliminar una materia que tiene préstamos asociados.']);
        }

        $materia->delete();

        return redirect()->route('materias.index')->with('success', 'Materia eliminada exitosamente.');
    }

    public function addStudent(StoreMateriaEstudianteRequest $request, Materia $materia, MateriaEstudianteService $service): RedirectResponse
    {
        $service->associate($materia, Estudiante::findOrFail($request->integer('estudiante_id')));

        return back()->with('success', 'Estudiante agregado a la materia.');
    }

    public function removeStudent(Materia $materia, Estudiante $estudiante, MateriaEstudianteService $service): RedirectResponse
    {
        $service->dissociate($materia, $estudiante);

        return back()->with('success', 'Estudiante retirado de la materia.');
    }
}
