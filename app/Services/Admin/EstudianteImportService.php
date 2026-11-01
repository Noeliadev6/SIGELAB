<?php

namespace App\Services\Admin;

use App\Models\Materia;
use App\Models\User;
use App\Repositories\Admin\EstudianteImportRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Throwable;

class EstudianteImportService
{
    public function __construct(
        private readonly EstudianteImportRepository $repository,
        private readonly XlsxPlanillaReader $reader,
        private readonly MateriaEstudianteService $materiaEstudianteService,
    ) {}

    public function import(string $path, Materia $materia, User $operator): array
    {
        unset($operator);
        $students = $this->reader->read($path);
        $created = 0;
        $updated = 0;
        $errors = [];

        foreach ($students as $row) {
            try {
                $wasCreated = DB::transaction(function () use ($materia, $row): bool {
                    $name = Str::squish($row['nombre']);
                    $career = Str::squish($row['carrera']);
                    $registrationNumber = $row['numero_registro'] === null
                        ? null
                        : Str::squish($row['numero_registro']);

                    $this->validateRow($registrationNumber, $name, $career);

                    [$student, $wasCreated] = $this->repository->findOrCreateStudent($registrationNumber, [
                        'nombre' => $name,
                        'carrera' => $career,
                    ]);
                    $this->materiaEstudianteService->associate($materia, $student);

                    return $wasCreated;
                });
                $wasCreated ? $created++ : $updated++;
            } catch (ValidationException $exception) {
                $errors[] = ['row' => $row['row'], 'message' => implode(' ', $exception->errors()['estudiante'] ?? $exception->errors()['materia'] ?? [])];
            } catch (Throwable $exception) {
                $errors[] = ['row' => $row['row'], 'message' => $exception->getMessage()];
            }
        }

        return compact('created', 'updated', 'errors');
    }

    private function validateRow(?string $registrationNumber, string $name, string $career): void
    {
        if ($name === '' || $career === '') {
            throw new RuntimeException('El nombre y la carrera son obligatorios.');
        }

        if ($registrationNumber !== null && mb_strlen($registrationNumber) > 30) {
            throw new RuntimeException('El número de registro no puede superar 30 caracteres.');
        }

        if (mb_strlen($name) > 160) {
            throw new RuntimeException('El nombre no puede superar 160 caracteres.');
        }

        if (mb_strlen($career) > 100) {
            throw new RuntimeException('La carrera no puede superar 100 caracteres.');
        }
    }
}
