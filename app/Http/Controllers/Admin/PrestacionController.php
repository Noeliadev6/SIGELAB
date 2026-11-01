<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePrestamoRequest;
use App\Models\Estudiante;
use App\Models\Prestamo;
use App\Models\SubLaboratorio;
use App\Services\Admin\PrestamoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrestacionController extends Controller
{
    public function index(): Response
    {
        $this->markExpiredLoans();

        $loans = Prestamo::query()
            ->with([
                'estudiante',
                'materia',
                'subLaboratorio',
                'entregadoPor',
                'detalles.herramienta',
            ])
            ->activos()
            ->latest('fecha_hora_salida')
            ->get();

        return Inertia::render('admin/prestaciones/index', [
            'prestamos' => $this->serializeLoans($loans),
            'resumen' => [
                'activos' => $loans->where('estado', 'Activo')->count(),
                'vencidos' => $loans->where('estado', 'Vencido')->count(),
                'devueltos' => Prestamo::query()->where('estado', 'Devuelto')->count(),
                'incidencias' => Prestamo::query()->where('estado', 'Con observaciones')->count(),
            ],
        ]);
    }

    public function create(PrestamoService $service): Response
    {
        $labs = SubLaboratorio::query()
            ->where('estado', true)
            ->whereIn('codigo', ['LAB-MYH', 'LAB-MOT', 'LAB-INJ'])
            ->orderBy('codigo')
            ->get();

        $students = Estudiante::query()
            ->with([
                'materias' => fn ($query) => $query->activas()->orderBy('nombre'),
            ])
            ->orderBy('nombre')
            ->get();

        return Inertia::render('admin/prestaciones/crear', [
            'estudiantes' => $students->map(fn (Estudiante $student): array => [
                'id' => $student->id,
                'nombre' => $student->nombre,
                'numero_registro' => $student->numero_registro,
                'carrera' => $student->carrera,
                'materias' => $student->materias->map(fn ($subject): array => [
                    'id' => $subject->id,
                    'codigo' => $subject->codigo,
                    'nombre' => $subject->nombre,
                    'grupo' => $subject->grupo,
                    'hora_inicio' => $subject->hora_inicio,
                    'hora_fin' => $subject->hora_fin,
                ])->values(),
            ])->values(),
            'subLaboratorios' => $labs->map(
                fn (SubLaboratorio $lab): array => $lab->only(['id', 'codigo', 'nombre'])
            )->values(),
            'herramientas' => $labs->isNotEmpty()
                ? $service->availableTools($labs->first()->id)
                : [],
            'fechaMinimaDevolucion' => now()->addHour()->format('Y-m-d\TH:i'),
        ]);
    }

    public function store(StorePrestamoRequest $request, PrestamoService $service): RedirectResponse
    {
        $service->create($request->validated(), $request->user()->id);

        return redirect()
            ->route('prestaciones.index')
            ->with('success', 'Préstamo registrado correctamente.');
    }

    public function herramientas(SubLaboratorio $subLaboratorio, PrestamoService $service): JsonResponse
    {
        abort_unless($subLaboratorio->estado, 404);

        return response()->json([
            'herramientas' => $service->availableTools($subLaboratorio->id),
        ]);
    }

    public function devoluciones(): Response
    {
        $this->markExpiredLoans();

        $loans = Prestamo::query()
            ->with([
                'estudiante',
                'materia',
                'subLaboratorio',
                'entregadoPor',
                'detalles.herramienta',
                'detalles.unidadHerramienta',
            ])
            ->activos()
            ->orderBy('fecha_hora_prevista_devolucion')
            ->get();

        return Inertia::render('admin/prestaciones/devoluciones', [
            'prestamos' => $this->serializeLoans($loans),
        ]);
    }

    public function devolver(Request $request, Prestamo $prestamo, PrestamoService $service): RedirectResponse
    {
        $data = $request->validate([
            'estado_devolucion' => ['required', 'in:Conforme,Con observaciones'],
            'observaciones_devolucion' => ['nullable', 'string', 'max:2000'],
            'detalles' => ['nullable', 'array'],
            'detalles.*.id' => ['required', 'integer', 'exists:detalle_prestamos,id'],
            'detalles.*.estado_devolucion' => ['required', 'in:Conforme,Con observaciones,Daño,Perdida'],
            'detalles.*.observaciones' => ['nullable', 'string', 'max:2000'],
        ]);

        $service->return($prestamo, $request->user()->id, $data);

        return back()->with('success', 'Devolución registrada correctamente.');
    }

    public function historial(Request $request): Response
    {
        $desde = $request->string('desde', now()->startOfMonth()->toDateString())->toString();
        $hasta = $request->string('hasta', now()->toDateString())->toString();
        $subLabId = $request->input('sub_laboratorio_id');
        $search = trim((string) $request->input('search', ''));

        $loans = Prestamo::query()
            ->with([
                'estudiante',
                'materia',
                'subLaboratorio',
                'entregadoPor',
                'detalles.herramienta',
            ])
            ->when($desde, fn ($query) => $query->whereDate('fecha_hora_salida', '>=', $desde))
            ->when($hasta, fn ($query) => $query->whereDate('fecha_hora_salida', '<=', $hasta))
            ->when(
                $subLabId,
                fn ($query) => $query->where('sub_laboratorio_id', (int) $subLabId)
            )
            ->when($search !== '', function ($query) use ($search) {
                $like = '%'.$search.'%';
                $query->where(function ($q) use ($like) {
                    $q->where('id', 'like', $like)
                        ->orWhereHas('estudiante', function ($studentQuery) use ($like) {
                            $studentQuery->where('nombre', 'like', $like)
                                ->orWhere('numero_registro', 'like', $like);
                        })
                        ->orWhereHas('materia', function ($subjectQuery) use ($like) {
                            $subjectQuery->where('nombre', 'like', $like)
                                ->orWhere('codigo', 'like', $like);
                        })
                        ->orWhereHas('detalles.herramienta', function ($toolQuery) use ($like) {
                            $toolQuery->where('nombre', 'like', $like)
                                ->orWhere('codigo', 'like', $like);
                        });
                });
            })
            ->latest('fecha_hora_salida')
            ->get();

        return Inertia::render('admin/prestaciones/historial', [
            'prestamos' => $this->serializeLoans($loans),
            'subLaboratorios' => SubLaboratorio::query()
                ->where('estado', true)
                ->whereIn('codigo', ['LAB-MYH', 'LAB-MOT', 'LAB-INJ'])
                ->orderBy('codigo')
                ->get(['id', 'codigo', 'nombre']),
            'fechaInicio' => $desde,
            'fechaFin' => $hasta,
            'filtros' => [
                'desde' => $desde,
                'hasta' => $hasta,
                'sub_laboratorio_id' => $subLabId ? (string) $subLabId : '',
                'search' => $search,
            ],
        ]);
    }

    public function escannerRemoto(): Response
    {
        return Inertia::render('admin/prestaciones/escanner-remoto');
    }

    /**
     * Serializa la colección de préstamos para el frontend.
     */
    private function serializeLoans($loans): array
    {
        return $loans->map(fn (Prestamo $loan): array => [
            'id' => $loan->id,
            'codigo' => 'PRE-'.str_pad((string) $loan->id, 6, '0', STR_PAD_LEFT),
            'estudiante' => $loan->estudiante?->nombre,
            'numero_registro' => $loan->estudiante?->numero_registro,
            'materia' => trim(
                ($loan->materia?->codigo ?? '').' - '.($loan->materia?->nombre ?? '')
            ),
            'sub_laboratorio' => $loan->subLaboratorio?->nombre,
            'estado' => $loan->estado,
            'carrera' => $loan->estudiante?->carrera,
            'grupo' => $loan->materia?->grupo,
            'hora_inicio' => $loan->materia?->hora_inicio,
            'hora_fin' => $loan->materia?->hora_fin,
            'auxiliar' => $loan->entregadoPor?->name,
            'salida' => $loan->fecha_hora_salida?->format('Y-m-d H:i'),
            'prevista_devolucion' => $loan->fecha_hora_prevista_devolucion?->format('Y-m-d H:i'),
            'devolucion' => $loan->fecha_hora_devolucion?->format('Y-m-d H:i'),
            'observaciones' => $loan->observaciones,
            'herramientas' => $loan->detalles->map(fn ($detail): array => [
                'id' => $detail->id,
                'nombre' => $detail->herramienta?->nombre,
                'codigo' => $detail->herramienta?->codigo,
                'serial' => $detail->unidadHerramienta?->numero_serie_barras,
                'cantidad' => $detail->cantidad,
                'estado' => $detail->estado_devolucion,
                'observaciones' => $detail->observaciones_devolucion,
            ])->values()->all(),
        ])->values()->all();
    }

    /**
     * Marca como "Vencido" los préstamos activos cuya fecha prevista ya pasó.
     */
    private function markExpiredLoans(): void
    {
        Prestamo::query()
            ->where('estado', 'Activo')
            ->whereNotNull('fecha_hora_prevista_devolucion')
            ->where('fecha_hora_prevista_devolucion', '<', now())
            ->update(['estado' => 'Vencido']);
    }
}
