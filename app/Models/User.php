<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property int|null $rol_id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property bool $estado
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Rol|null $rol
 */
#[Fillable(['name', 'email', 'password', 'rol_id', 'estado'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Relación: el usuario pertenece a un rol del sistema.
     *
     * @return BelongsTo<Rol, $this>
     */
    public function rol(): BelongsTo
    {
        return $this->belongsTo(Rol::class, 'rol_id');
    }

    /**
     * Verifica si el usuario tiene un permiso específico por su nombre.
     */
    public function tienePermiso(string $nombrePermiso): bool
    {
        return $this->rol?->permisos()->where('nombre', $nombrePermiso)->exists() ?? false;
    }

    /**
     * Determina si el usuario tiene el rol de Administrador.
     */
    public function esAdministrador(): bool
    {
        return $this->rol?->nombre === 'administrador';
    }

    /**
     * Determina si el usuario tiene el rol de Docente.
     */
    public function esDocente(): bool
    {
        return $this->rol?->nombre === 'docente';
    }

    /**
     * Determina si el usuario tiene el rol de Auxiliar.
     */
    public function esAuxiliar(): bool
    {
        return $this->rol?->nombre === 'auxiliar';
    }

    /**
     * Determina si el usuario está activo en el sistema.
     */
    public function estaActivo(): bool
    {
        return (bool) $this->estado;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'estado' => 'boolean',
        ];
    }
}
