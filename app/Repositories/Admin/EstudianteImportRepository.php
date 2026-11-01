<?php

namespace App\Repositories\Admin;

use App\Models\Estudiante;

class EstudianteImportRepository
{
    public function findOrCreateStudent(?string $registrationNumber, array $attributes): array
    {
        $student = Estudiante::query()
            ->when(
                $registrationNumber === null,
                fn ($query) => $query->whereNull('numero_registro')
                    ->where('nombre', $attributes['nombre'])
                    ->where('carrera', $attributes['carrera']),
                fn ($query) => $query->where('numero_registro', $registrationNumber),
            )
            ->first();
        $created = $student === null;
        $student ??= new Estudiante(['numero_registro' => $registrationNumber]);
        $student->fill($attributes);
        $student->save();

        return [$student, $created];
    }
}
