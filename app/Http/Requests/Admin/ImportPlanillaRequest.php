<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ImportPlanillaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->tienePermiso('estudiantes.importar') ?? false;
    }

    public function rules(): array
    {
        return [
            'planilla' => [
                'required',
                'file',
                'mimes:xlsx',
                'mimetypes:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'max:10240',
            ],
            'materia_id' => ['required', 'integer', 'exists:materias,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'planilla.mimes' => 'Solo se permiten archivos Excel .xlsx.',
            'planilla.mimetypes' => 'El contenido no corresponde a un Excel .xlsx.',
        ];
    }
}
