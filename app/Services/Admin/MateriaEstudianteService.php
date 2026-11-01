<?php

namespace App\Services\Admin;

use App\Models\Estudiante;
use App\Models\Materia;
use Carbon\Carbon;
use Illuminate\Database\DatabaseManager;
use Illuminate\Validation\ValidationException;

class MateriaEstudianteService
{
    public function __construct(private readonly DatabaseManager $database) {}

    public function associate(Materia $materia, Estudiante $estudiante): void
    {
        if (! $materia->estaActiva()) {
            throw ValidationException::withMessages([
                'materia' => 'No se puede inscribir estudiantes en una materia inactiva o vencida.',
            ]);
        }

        $this->database->transaction(function () use ($materia, $estudiante): void {
            $lockedStudent = Estudiante::query()->lockForUpdate()->findOrFail($estudiante->getKey());

            if ($materia->estudiantes()->whereKey($lockedStudent->getKey())->exists()) {
                throw ValidationException::withMessages([
                    'estudiante' => 'El estudiante ya está asociado a esta materia.',
                ]);
            }

            if ($lockedStudent->materias()->count() >= 2) {
                throw ValidationException::withMessages([
                    'estudiante' => 'Un estudiante no puede estar asociado a más de dos materias.',
                ]);
            }

            $this->ensureScheduleAvailable($materia, $lockedStudent);
            $materia->estudiantes()->attach($lockedStudent->getKey());
        });
    }

    public function ensureScheduleAvailableForEnrolledStudents(Materia $materia): void
    {
        foreach ($materia->estudiantes()->get() as $estudiante) {
            $this->ensureScheduleAvailable($materia, $estudiante, $materia->getKey());
        }
    }

    public function dissociate(Materia $materia, Estudiante $estudiante): void
    {
        $this->database->transaction(function () use ($materia, $estudiante): void {
            $materia->estudiantes()->detach($estudiante->getKey());
        });
    }

    private function ensureScheduleAvailable(Materia $materia, Estudiante $estudiante, ?int $ignoreMateriaId = null): void
    {
        if ($materia->fecha_inicio === null || $materia->fecha_fin === null || $materia->hora_inicio === null || $materia->hora_fin === null) {
            return;
        }

        $materias = $estudiante->materias()
            ->when($ignoreMateriaId !== null, fn ($query) => $query->whereKeyNot($ignoreMateriaId))
            ->whereDate('fecha_inicio', '<=', $materia->fecha_fin)
            ->whereDate('fecha_fin', '>=', $materia->fecha_inicio)
            ->whereNotNull('hora_inicio')
            ->whereNotNull('hora_fin')
            ->get();

        $inicio = Carbon::parse($materia->hora_inicio);
        $fin = Carbon::parse($materia->hora_fin);

        foreach ($materias as $otraMateria) {
            $otroInicio = Carbon::parse($otraMateria->hora_inicio);
            $otroFin = Carbon::parse($otraMateria->hora_fin);

            if ($this->timesOverlap($inicio, $fin, $otroInicio, $otroFin)) {
                throw ValidationException::withMessages([
                    'estudiante' => "El estudiante ya tiene {$otraMateria->nombre} en el horario {$otroInicio->format('H:i')} a {$otroFin->format('H:i')} durante fechas que se cruzan.",
                ]);
            }
        }
    }

    private function timesOverlap(Carbon $inicio, Carbon $fin, Carbon $otroInicio, Carbon $otroFin): bool
    {
        return $inicio->lt($otroFin) && $fin->gt($otroInicio);
    }
}
