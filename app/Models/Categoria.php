<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categorias';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    /**
     * Herramientas pertenecientes a esta categoría.
     *
     * @return HasMany<Herramienta, $this>
     */
    public function herramientas(): HasMany
    {
        return $this->hasMany(Herramienta::class, 'categoria_id');
    }
}
