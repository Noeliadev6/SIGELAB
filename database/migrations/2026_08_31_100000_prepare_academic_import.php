<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periodos_academicos', function (Blueprint $table): void {
            $table->id();
            $table->string('codigo', 30)->unique();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->string('estado', 20)->default('Activo')->index();
            $table->timestamps();
        });
        Schema::create('materias', function (Blueprint $table): void {
            $table->id();
            $table->string('codigo', 30)->unique();
            $table->string('sigla', 30)->nullable()->index();
            $table->string('nombre', 150);
            $table->timestamps();
        });
        Schema::table('estudiantes', function (Blueprint $table): void {
            $table->dropUnique(['carnet_identidad']);
            $table->string('carnet_identidad', 30)->nullable()->change();
            $table->string('registro_universitario', 30)->nullable(false)->unique()->change();
        });
        Schema::table('modulos_academicos', function (Blueprint $table): void {
            $table->dropColumn('nombre_materia');
            $table->foreignId('periodo_academico_id')->after('docente_id')->constrained('periodos_academicos')->restrictOnDelete();
            $table->foreignId('materia_id')->after('periodo_academico_id')->constrained('materias')->restrictOnDelete();
            $table->unsignedSmallInteger('numero_modulo')->after('materia_id');
            $table->string('grupo', 20)->after('numero_modulo');
            $table->string('modalidad', 30)->nullable();
            $table->string('aula', 50)->nullable();
            $table->string('turno_codigo', 20)->nullable();
            $table->string('turno_nombre', 30)->nullable();
            $table->string('horario', 50)->nullable();
            $table->decimal('nota_minima', 5, 2)->nullable();
            $table->unique(['periodo_academico_id', 'numero_modulo', 'materia_id', 'grupo'], 'uq_modulo_academico');
        });
        Schema::table('estudiante_modulo', function (Blueprint $table): void {
            $table->unsignedInteger('crr')->nullable();
            $table->string('observacion', 255)->nullable();
            $table->string('estado', 30)->default('Activo');
        });
    }

    public function down(): void
    {
        Schema::table('estudiante_modulo', function (Blueprint $table): void {
            $table->dropColumn(['crr', 'observacion', 'estado']);
        });
        Schema::table('modulos_academicos', function (Blueprint $table): void {
            $table->dropUnique('uq_modulo_academico');
            $table->dropConstrainedForeignId('periodo_academico_id');
            $table->dropConstrainedForeignId('materia_id');
            $table->dropColumn(['numero_modulo', 'grupo', 'modalidad', 'aula', 'turno_codigo', 'turno_nombre', 'horario', 'nota_minima']);
            $table->string('nombre_materia', 150);
        });
        Schema::dropIfExists('materias');
        Schema::dropIfExists('periodos_academicos');
    }
};
