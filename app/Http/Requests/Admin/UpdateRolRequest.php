<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRolRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rolId = $this->route('rol')?->id;

        return [
            'nombre_mostrar' => ['required', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string', 'max:255'],
            'permisos' => ['array'],
            'permisos.*' => ['integer', Rule::exists('permisos', 'id')],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nombre_mostrar.required' => 'El nombre del rol es obligatorio.',
            'permisos.*.exists' => 'Uno o más permisos seleccionados no son válidos.',
        ];
    }
}
