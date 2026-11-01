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
        Schema::create('asistencias', function (Blueprint $table) {
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};
