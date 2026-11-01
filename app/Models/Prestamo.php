<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prestamo extends Model
{
    use HasFactory;

    protected $table = 'prestamos';

    protected $fillable = [
        'estudiante_id', 'materia_id', 'sub_laboratorio_id', 'entregado_por', 'recibido_por',
        'fecha_hora_salida', 'fecha_hora_prevista_devolucion', 'fecha_hora_devolucion',
        'estado', 'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'fecha_hora_salida' => 'datetime',
            'fecha_hora_prevista_devolucion' => 'datetime',
            'fecha_hora_devolucion' => 'datetime',
        ];
    }

    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(Estudiante::class);
    }

    public function materia(): BelongsTo
    {
        return $this->belongsTo(Materia::class);
    }

    public function subLaboratorio(): BelongsTo
    {
        return $this->belongsTo(SubLaboratorio::class, 'sub_laboratorio_id');
    }

    public function entregadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'entregado_por');
    }

    public function recibidoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recibido_por');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(DetallePrestamo::class);
    }

    public function scopeActivos(Builder $query): Builder
    {
        return $query->whereIn('estado', ['Activo', 'Vencido']);
    }
}
