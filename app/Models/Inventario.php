<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventario extends Model
{
    use HasFactory;

    protected $table = 'inventarios';

    protected $fillable = [
        'herramienta_id',
        'sub_laboratorio_id',
        'stock_total',
        'stock_disponible',
    ];

    protected function casts(): array
    {
        return [
            'stock_total' => 'integer',
            'stock_disponible' => 'integer',
        ];
    }

    /**
     * Herramienta asociada.
     *
     * @return BelongsTo<Herramienta, $this>
     */
    public function herramienta(): BelongsTo
    {
        return $this->belongsTo(Herramienta::class, 'herramienta_id');
    }

    /**
     * Sub-laboratorio donde se almacena el stock.
     *
     * @return BelongsTo<SubLaboratorio, $this>
     */
    public function subLaboratorio(): BelongsTo
    {
        return $this->belongsTo(SubLaboratorio::class, 'sub_laboratorio_id');
    }

    public function prestamos(): HasMany
    {
        return $this->hasMany(DetallePrestamo::class, 'herramienta_id', 'herramienta_id');
    }
}
