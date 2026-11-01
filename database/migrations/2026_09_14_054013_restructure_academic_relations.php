<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('materias', function (Blueprint $table): void {
            $table->string('modulo', 30)->nullable();
            $table->string('grupo', 20)->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->string('estado', 20)->default('Activo')->index();
        });

        Schema::table('estudiantes', function (Blueprint $table): void {
            $table->dropUnique('estudiantes_numero_unique');
            $table->renameColumn('numero', 'numero_registro');
        });

        Schema::table('estudiantes', function (Blueprint $table): void {
            $table->string('numero_registro', 30)->nullable()->unique()->change();
        });

        Schema::dropIfExists('asistencias');
        Schema::dropIfExists('estudiante_modulo');

        Schema::create('materia_estudiante', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('materia_id')->constrained('materias')->cascadeOnDelete();
            $table->foreignId('estudiante_id')->constrained('estudiantes')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['materia_id', 'estudiante_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materia_estudiante');

        Schema::table('estudiantes', function (Blueprint $table): void {
            $table->dropUnique('estudiantes_numero_registro_unique');
            $table->string('numero_registro', 30)->nullable(false)->change();
            $table->renameColumn('numero_registro', 'numero');
        });

        Schema::table('estudiantes', function (Blueprint $table): void {
            $table->string('numero', 30)->nullable(false)->unique()->change();
        });

        Schema::table('materias', function (Blueprint $table): void {
            $table->dropIndex('materias_estado_index');
            $table->dropColumn(['modulo', 'grupo', 'fecha_inicio', 'fecha_fin', 'estado']);
        });

        Schema::create('estudiante_modulo', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('modulo_academico_id')->constrained('modulos_academicos')->cascadeOnDelete();
            $table->foreignId('estudiante_id')->constrained('estudiantes')->cascadeOnDelete();
            $table->unsignedInteger('crr')->nullable();
            $table->string('observacion', 255)->nullable();
            $table->string('estado', 30)->default('Activo');
            $table->timestamps();

            $table->unique(['modulo_academico_id', 'estudiante_id']);
        });
    }
};
