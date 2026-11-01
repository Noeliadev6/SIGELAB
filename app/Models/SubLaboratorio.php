<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubLaboratorio extends Model
{
    use HasFactory;

    protected $table = 'sub_laboratorios';

    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'estado' => 'boolean',
        ];
    }

    /**
     * Registros de inventario asociados a este sub-laboratorio.
     *
     * @return HasMany<Inventario, $this>
     */
    public function inventarios(): HasMany
    {
        return $this->hasMany(Inventario::class, 'sub_laboratorio_id');
    }

    /**
     * Unidades físicas serializadas asignadas a este sub-laboratorio.
     *
     * @return HasMany<UnidadHerramienta, $this>
     */
    public function unidadesHerramientas(): HasMany
    {
        return $this->hasMany(UnidadHerramienta::class, 'sub_laboratorio_id');
    }
}
