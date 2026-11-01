<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePrestamoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->tienePermiso('prestamos.crear') ?? false;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'estudiante_id' => ['required', 'integer', 'exists:estudiantes,id'],
            'materia_id' => ['required', 'integer', 'exists:materias,id'],
            'sub_laboratorio_id' => ['required', 'integer', 'exists:sub_laboratorios,id'],
            'fecha_hora_prevista_devolucion' => ['required', 'date', 'after:now'],
            'observaciones' => ['nullable', 'string', 'max:2000'],
            'herramientas' => ['required', 'array', 'min:1'],
            'herramientas.*.herramienta_id' => ['required', 'integer', 'exists:herramientas,id'],
            'herramientas.*.unidad_herramienta_id' => ['nullable', 'integer', 'exists:unidades_herramientas,id'],
            'herramientas.*.cantidad' => ['required', 'integer', 'min:1'],
        ];
    }
}
