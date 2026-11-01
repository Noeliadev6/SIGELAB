<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEstudianteRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('numero') && ! $this->has('numero_registro')) {
            $this->merge(['numero_registro' => $this->input('numero')]);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $estudianteId = $this->route('estudiante')?->getKey();

        return [
            'numero_registro' => ['nullable', 'string', 'max:30', Rule::unique('estudiantes', 'numero_registro')->ignore($estudianteId)],
            'nombre' => ['required', 'string', 'max:160'],
            'carrera' => ['required', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'numero_registro.unique' => 'Ya existe otro estudiante con este número de registro.',
        ];
    }
}
