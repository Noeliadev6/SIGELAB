<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreEstudianteRequest extends FormRequest
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
        return [
            'numero_registro' => ['nullable', 'string', 'max:30', 'unique:estudiantes,numero_registro'],
            'nombre' => ['required', 'string', 'max:160'],
            'carrera' => ['required', 'string', 'max:100'],
            'materia_id' => ['nullable', 'integer', 'exists:materias,id'],
        ];
    }
}
