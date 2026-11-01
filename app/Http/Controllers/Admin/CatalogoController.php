<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Herramienta;
use App\Models\Inventario;
use App\Models\SubLaboratorio;
use App\Models\UnidadHerramienta;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CatalogoController extends Controller
{
    public function index(): Response
    {
        $categorias = Categoria::orderBy('nombre')->get([
            'id',
            'nombre',
        ]);

        $subLaboratorios = SubLaboratorio::where('estado', true)
            ->orderBy('nombre')
            ->get([
                'id',
                'nombre',
            ]);

        $items = Herramienta::with(['categoria', 'unidades.subLaboratorio'])
            ->orderBy('nombre')
            ->get();

        return Inertia::render('admin/catalogo/index', [
            'categorias' => $categorias,
            'items' => $items,
            'subLaboratorios' => $subLaboratorios,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $datos = $request->validate([
            'codigo' => ['required', 'string', 'max:50'],
            'nombre' => ['required', 'string', 'max:120'],
            'modelo' => ['nullable', 'string', 'max:120'],
            'categoria_id' => ['required', 'integer', 'exists:categorias,id'],
            'descripcion' => ['nullable', 'string'],
            'es_serializado' => ['required', 'boolean'],
        ]);

        Herramienta::create($datos);

        return redirect()
            ->route('catalogo.index')
            ->with('success', 'Ítem registrado correctamente.');
    }

    public function update(Request $request, Herramienta $herramienta): RedirectResponse
    {
        $datos = $request->validate([
            'codigo' => ['required', 'string', 'max:50'],
            'nombre' => ['required', 'string', 'max:120'],
            'modelo' => ['nullable', 'string', 'max:120'],
            'categoria_id' => ['required', 'integer', 'exists:categorias,id'],
            'descripcion' => ['nullable', 'string'],
            'es_serializado' => ['required', 'boolean'],
        ]);

        $herramienta->update($datos);

        return redirect()
            ->route('catalogo.index')
            ->with('success', 'Ítem actualizado correctamente.');
    }

    public function destroy(Herramienta $herramienta): RedirectResponse
    {
        $herramienta->delete();

        return redirect()
            ->route('catalogo.index')
            ->with('success', 'Ítem eliminado correctamente.');
    }

    public function storeUnidad(Request $request): RedirectResponse
    {
        $datos = $request->validate([
            'herramienta_id' => ['required', 'integer', 'exists:herramientas,id'],
            'sub_laboratorio_id' => ['required', 'integer', 'exists:sub_laboratorios,id'],
            'estado' => [
                'required',
                'string',
                'in:Disponible,En Préstamo,En Mantenimiento,Dañado,Perdido',
            ],
        ]);

        do {
            $numeroSerie = (string) random_int(100000000000, 999999999999); // 12 dígitos enteros
        } while (
            UnidadHerramienta::where('numero_serie_barras', $numeroSerie)->exists()
        );

        $datos['numero_serie_barras'] = $numeroSerie;

        $unidad = UnidadHerramienta::create($datos);

        $this->sincronizarInventario($unidad->herramienta_id, $unidad->sub_laboratorio_id);

        return redirect()
            ->route('catalogo.index')
            ->with('success', 'Unidad serializada registrada correctamente.')
            ->with('numero_serie_generado', $numeroSerie);
    }

    public function actualizarEstadoUnidad(Request $request, UnidadHerramienta $unidad): RedirectResponse
    {
        $datos = $request->validate([
            'estado' => ['required', 'string', 'in:Disponible,En Préstamo,En Mantenimiento,Dañado,Perdido,Mantenimiento'],
        ]);

        $estado = $datos['estado'] === 'Mantenimiento' ? 'En Mantenimiento' : $datos['estado'];
        $unidad->update(['estado' => $estado]);

        $this->sincronizarInventario($unidad->herramienta_id, $unidad->sub_laboratorio_id);

        return redirect()->back()->with('success', 'Estado de la unidad actualizado correctamente.');
    }

    public function actualizarUnidad(Request $request, UnidadHerramienta $unidad): RedirectResponse
    {
        $datos = $request->validate([
            'numero_serie_barras' => [
                'required',
                'string',
                'max:100',
                Rule::unique('unidades_herramientas', 'numero_serie_barras')
                    ->ignore($unidad->id),
            ],
            'sub_laboratorio_id' => [
                'required',
                'integer',
                'exists:sub_laboratorios,id',
            ],
            'estado' => [
                'required',
                'string',
                'in:Disponible,En Préstamo,En Mantenimiento,Dañado,Perdido,Mantenimiento',
            ],
        ]);

        $subLaboratorioAnterior = $unidad->sub_laboratorio_id;
        $datos['estado'] = $datos['estado'] === 'Mantenimiento' ? 'En Mantenimiento' : $datos['estado'];

        $unidad->update($datos);

        $this->sincronizarInventario($unidad->herramienta_id, $subLaboratorioAnterior);

        if ($subLaboratorioAnterior !== $unidad->sub_laboratorio_id) {
            $this->sincronizarInventario($unidad->herramienta_id, $unidad->sub_laboratorio_id);
        }

        return redirect()
            ->back()
            ->with('success', 'Unidad actualizada correctamente.');
    }

    public function eliminarUnidad(UnidadHerramienta $unidad): RedirectResponse
    {
        $herramientaId = $unidad->herramienta_id;
        $subLaboratorioId = $unidad->sub_laboratorio_id;

        $unidad->delete();

        $this->sincronizarInventario($herramientaId, $subLaboratorioId);

        return redirect()
            ->back()
            ->with('success', 'Unidad eliminada correctamente.');
    }

    private function sincronizarInventario(int $herramientaId, int $subLaboratorioId): void
    {
        $total = UnidadHerramienta::where('herramienta_id', $herramientaId)
            ->where('sub_laboratorio_id', $subLaboratorioId)
            ->count();

        $disponibles = UnidadHerramienta::where('herramienta_id', $herramientaId)
            ->where('sub_laboratorio_id', $subLaboratorioId)
            ->where('estado', 'Disponible')
            ->count();

        Inventario::updateOrCreate(
            [
                'herramienta_id' => $herramientaId,
                'sub_laboratorio_id' => $subLaboratorioId,
            ],
            [
                'stock_total' => $total,
                'stock_disponible' => $disponibles,
            ]
        );
    }

    public function buscarUnidad(Request $request)
    {
        $datos = $request->validate([
            'codigo' => ['required', 'string', 'max:100'],
        ]);

        $unidad = UnidadHerramienta::with([
            'herramienta.categoria',
            'subLaboratorio',
        ])
            ->where('numero_serie_barras', $datos['codigo'])
            ->first();

        if (! $unidad) {
            return response()->json([
                'message' => 'Herramienta no encontrada.',
            ], 404);
        }

        return response()->json($unidad);
    }
}
