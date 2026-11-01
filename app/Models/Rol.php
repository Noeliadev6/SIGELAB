<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $nombre
 * @property string $nombre_mostrar
 * @property string|null $descripcion
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, User> $usuarios
 * @property-read Collection<int, Permiso> $permisos
 */
#[Fillable(['nombre', 'nombre_mostrar', 'descripcion'])]
class Rol extends Model
{
    use HasFactory;

    /** @var string La tabla no pluraliza correctamente 'Rol' -> 'rols' en vez de 'roles'. */
    protected $table = 'roles';

    /**
     * Relación: un rol tiene muchos usuarios.
     *
     * @return HasMany<User, $this>
     */
    public function usuarios(): HasMany
    {
        return $this->hasMany(User::class, 'rol_id');
    }

    /**
     * Relación: un rol tiene muchos permisos.
     *
     * @return BelongsToMany<Permiso, $this>
     */
    public function permisos(): BelongsToMany
    {
        return $this->belongsToMany(Permiso::class, 'permiso_rol', 'rol_id', 'permiso_id');
    }
}
