<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreMateriaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        $horasInicioValidas = ['07:15', '10:15', '13:15', '16:15', '19:15'];
        $horasFinValidas = ['10:15', '13:15', '16:15', '19:15', '21:45'];

        return [
            'codigo' => ['required', 'string', 'max:30', 'unique:materias,codigo'],
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

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'codigo.unique' => 'Ya existe una materia con este código.',
            'periodo.in' => 'El semestre debe ser Primer semestre o Segundo semestre.',
            'modulo_inicio.between' => 'El módulo inicial debe estar entre 0 y 5.',
            'modulo_fin.between' => 'El módulo final debe estar entre 0 y 5.',
            'modulo_fin.gte' => 'El módulo final no puede ser menor que el inicial.',
            'fecha_fin.after_or_equal' => 'La fecha de fin debe ser igual o posterior a la fecha de inicio.',
            'hora_inicio.date_format' => 'La hora inicial debe tener formato HH:MM.',
            'hora_fin.date_format' => 'La hora final debe tener formato HH:MM.',
            'hora_fin.after' => 'La hora final debe ser posterior a la hora inicial.',
        ];
    }
}
