<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovimientoStock extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'movimientos_stock';

    protected $fillable = [
        'herramienta_id',
        'unidad_herramienta_id',
        'origen_sub_laboratorio_id',
        'destino_sub_laboratorio_id',
        'usuario_id',
        'tipo_movimiento',
        'cantidad',
        'observaciones',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'cantidad' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    /**
     * Herramienta transferida.
     *
     * @return BelongsTo<Herramienta, $this>
     */
    public function herramienta(): BelongsTo
    {
        return $this->belongsTo(Herramienta::class, 'herramienta_id');
    }

    /**
     * Unidad específica (si aplica).
     *
     * @return BelongsTo<UnidadHerramienta, $this>
     */
    public function unidadHerramienta(): BelongsTo
    {
        return $this->belongsTo(UnidadHerramienta::class, 'unidad_herramienta_id');
    }

    /**
     * Sub-laboratorio de origen.
     *
     * @return BelongsTo<SubLaboratorio, $this>
     */
    public function origenSubLaboratorio(): BelongsTo
    {
        return $this->belongsTo(SubLaboratorio::class, 'origen_sub_laboratorio_id');
    }

    /**
     * Sub-laboratorio de destino.
     *
     * @return BelongsTo<SubLaboratorio, $this>
     */
    public function destinoSubLaboratorio(): BelongsTo
    {
        return $this->belongsTo(SubLaboratorio::class, 'destino_sub_laboratorio_id');
    }

    /**
     * Usuario que registró el movimiento.
     *
     * @return BelongsTo<User, $this>
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
