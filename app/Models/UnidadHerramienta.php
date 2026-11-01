<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UnidadHerramienta extends Model
{
    use HasFactory;

    protected $table = 'unidades_herramientas';

    protected $fillable = [
        'herramienta_id',
        'sub_laboratorio_id',
        'numero_serie_barras',
        'estado',
    ];

    /**
     * Herramienta genérica.
     *
     * @return BelongsTo<Herramienta, $this>
     */
    public function herramienta(): BelongsTo
    {
        return $this->belongsTo(Herramienta::class, 'herramienta_id');
    }

    /**
     * Sub-laboratorio actual de esta unidad.
     *
     * @return BelongsTo<SubLaboratorio, $this>
     */
    public function subLaboratorio(): BelongsTo
    {
        return $this->belongsTo(SubLaboratorio::class, 'sub_laboratorio_id');
    }
}
