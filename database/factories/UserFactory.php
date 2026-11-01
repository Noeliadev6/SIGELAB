<?php

namespace Database\Factories;

use App\Models\Rol;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'estado' => true,
            'rol_id' => null,
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ];
    }

    /**
     * Indica que el usuario tendrá el rol de Administrador.
     */
    public function comoAdministrador(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol_id' => Rol::where('nombre', 'administrador')->value('id'),
        ]);
    }

    /**
     * Indica que el usuario tendrá el rol de Docente.
     */
    public function comoDocente(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol_id' => Rol::where('nombre', 'docente')->value('id'),
        ]);
    }

    /**
     * Indica que el usuario tendrá el rol de Auxiliar.
     */
    public function comoAuxiliar(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol_id' => Rol::where('nombre', 'auxiliar')->value('id'),
        ]);
    }

    /**
     * Indica que la dirección de correo del usuario no ha sido verificada.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indica que el usuario tiene deshabilitada su cuenta.
     */
    public function inactivo(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => false,
        ]);
    }

    /**
     * Indica que el modelo tiene autenticación de dos factores configurada.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }
}
