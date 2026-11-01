<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Estudiante extends Model
{
    protected $table = 'estudiantes';

    protected $fillable = ['numero_registro', 'nombre', 'carrera'];

    public function materias(): BelongsToMany
    {
        return $this->belongsToMany(Materia::class, 'materia_estudiante')->withTimestamps();
    }
}
