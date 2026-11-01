<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

class UpdateMateriaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, string|Unique>> */
    public function rules(): array
    {
        $materiaId = $this->route('materia')?->getKey();
        $horasInicioValidas = ['07:15', '10:15', '13:15', '16:15', '19:15'];
        $horasFinValidas = ['10:15', '13:15', '16:15', '19:15', '21:45'];

        return [
            'codigo' => ['required', 'string', 'max:30', Rule::unique('materias', 'codigo')->ignore($materiaId)],
            'nombre' => ['required', 'string', 'max:150'],
            'modulo' => ['required', 'string', 'max:30'],
            'periodo' => ['nullable', 'string', 'in:Primer semestre,Segundo semestre'],
            'modulo_inicio' => ['nullable', 'integer', 'between:0,5'],
            'modulo_fin' => ['nullable', 'integer', 'between:0,5', 'gte:modulo_inicio'],
            'grupo' => ['required', 'string', 'max:20'],
            'fecha_inicio' => ['required', 'date'],
            'fecha_fin' => ['required', 'date', 'after_or_equal:fecha_inicio'],
            'hora_inicio' => ['nullable', 'date_format:H:i', 'in:'.implode(',', $horasInicioValidas)],
            'hora_fin' => ['nullable', 'date_format:H:i', 'in:'.implode(',', $horasFinValidas), 'after:hora_inicio'],
            'estado' => ['required', 'in:Activo,Inactivo'],
        ];
    }
}
