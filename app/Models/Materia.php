<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Materia extends Model
{
    protected $fillable = [
        'codigo', 'sigla', 'nombre', 'modulo', 'periodo', 'modulo_inicio', 'modulo_fin',
        'grupo', 'fecha_inicio', 'fecha_fin', 'hora_inicio', 'hora_fin', 'estado',
    ];

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date',
            'modulo_inicio' => 'integer',
            'modulo_fin' => 'integer',
        ];
    }

    public function estudiantes(): BelongsToMany
    {
        return $this->belongsToMany(Estudiante::class, 'materia_estudiante')->withTimestamps();
    }

    public function getEstadoAttribute($value): string
    {
        $fechaFin = $this->getRawOriginal('fecha_fin');

        return $fechaFin !== null && Carbon::parse($fechaFin)->isBefore(today())
            ? 'Inactivo'
            : (string) $value;
    }

    public function estaActiva(): bool
    {
        return $this->estado === 'Activo';
    }

    public function getEstaVencidaAttribute(): bool
    {
        return $this->fecha_fin !== null && $this->fecha_fin->isBefore(today());
    }

    public function scopeActivas(Builder $query): Builder
    {
        return $query
            ->where('estado', 'Activo')
            ->where(function (Builder $query): void {
                $query->whereNull('fecha_fin')->orWhereDate('fecha_fin', '>=', today());
            });
    }
}
