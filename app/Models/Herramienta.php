<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Herramienta extends Model
{
    use HasFactory;

    protected $table = 'herramientas';

    protected $fillable = [
        'categoria_id',
        'codigo',
        'nombre',
        'modelo',
        'descripcion',
        'es_serializado',
    ];

    protected function casts(): array
    {
        return [
            'es_serializado' => 'boolean',
        ];
    }

    /**
     * Categoría a la que pertenece la herramienta.
     *
     * @return BelongsTo<Categoria, $this>
     */
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    /**
     * Inventarios por sub-laboratorio.
     *
     * @return HasMany<Inventario, $this>
     */
    public function inventarios(): HasMany
    {
        return $this->hasMany(Inventario::class, 'herramienta_id');
    }

    /**
     * Unidades físicas serializadas.
     *
     * @return HasMany<UnidadHerramienta, $this>
     */
    public function unidades(): HasMany
    {
        return $this->hasMany(UnidadHerramienta::class, 'herramienta_id');
    }

    /**
     * Historial de movimientos de stock.
     *
     * @return HasMany<MovimientoStock, $this>
     */
    public function movimientos(): HasMany
    {
        return $this->hasMany(MovimientoStock::class, 'herramienta_id');
    }
}
