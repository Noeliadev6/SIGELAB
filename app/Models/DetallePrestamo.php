<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetallePrestamo extends Model
{
    use HasFactory;

    protected $table = 'detalle_prestamos';

    protected $fillable = [
        'prestamo_id', 'herramienta_id', 'unidad_herramienta_id', 'cantidad',
        'estado_devolucion', 'observaciones_devolucion',
    ];

    protected function casts(): array
    {
        return ['cantidad' => 'integer'];
    }

    public function prestamo(): BelongsTo
    {
        return $this->belongsTo(Prestamo::class);
    }

    public function herramienta(): BelongsTo
    {
        return $this->belongsTo(Herramienta::class);
    }

    public function unidadHerramienta(): BelongsTo
    {
        return $this->belongsTo(UnidadHerramienta::class, 'unidad_herramienta_id');
    }
}
