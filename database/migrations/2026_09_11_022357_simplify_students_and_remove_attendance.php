<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('asistencias');

        Schema::table('estudiantes', function (Blueprint $table): void {
            $table->dropUnique('estudiantes_registro_universitario_unique');
            $table->dropColumn(['registro_universitario', 'tipo_estudiante', 'telefono']);
            $table->renameColumn('carnet_identidad', 'numero');
            $table->renameColumn('nombres', 'nombre');
            $table->dropColumn('apellidos');
        });

        Schema::table('estudiantes', function (Blueprint $table): void {
            $table->string('numero', 30)->nullable(false)->unique()->change();
            $table->string('nombre', 160)->change();
        });
    }

    public function down(): void
    {
        Schema::table('estudiantes', function (Blueprint $table): void {
            $table->dropUnique('estudiantes_numero_unique');
            $table->string('registro_universitario', 30)->nullable()->unique();
            $table->string('tipo_estudiante', 20)->default('Regular');
            $table->string('telefono', 30)->nullable();
            $table->renameColumn('numero', 'carnet_identidad');
            $table->renameColumn('nombre', 'nombres');
            $table->string('apellidos', 80)->nullable();
        });

        Schema::create('asistencias', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('modulo_academico_id')->constrained('modulos_academicos')->cascadeOnDelete();
            $table->foreignId('estudiante_id')->constrained('estudiantes')->cascadeOnDelete();
            $table->foreignId('auxiliar_id')->constrained('users')->restrictOnDelete();
            $table->date('fecha_asistencia');
            $table->string('estado', 20)->default('Presente');
            $table->timestamps();
            $table->unique(['modulo_academico_id', 'estudiante_id', 'fecha_asistencia'], 'uq_asistencia_diaria');
        });
    }
};
