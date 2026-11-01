<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class TransferirInventarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Se autoriza si el usuario tiene rol con permisos para operar inventario (administrador o auxiliar)
        $user = $this->user();

        return $user !== null && in_array($user->rol?->nombre, ['administrador', 'auxiliar'], true);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'herramienta_id' => ['required', 'integer', 'exists:herramientas,id'],
            'origen_sub_laboratorio_id' => ['required', 'integer', 'exists:sub_laboratorios,id'],
            'destino_sub_laboratorio_id' => ['required', 'integer', 'different:origen_sub_laboratorio_id', 'exists:sub_laboratorios,id'],
            'cantidad' => ['required', 'integer', 'min:1'],
            'unidad_herramienta_id' => ['nullable', 'integer', 'exists:unidades_herramientas,id'],
            'observaciones' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'destino_sub_laboratorio_id.different' => 'El sub-laboratorio de destino debe ser diferente al de origen.',
            'cantidad.min' => 'La cantidad a transferir debe ser al menos 1.',
        ];
    }
}
