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
        Schema::create('prestamos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estudiante_id')->constrained('estudiantes')->restrictOnDelete();
            $table->foreignId('modulo_academico_id')->nullable()->constrained('modulos_academicos')->nullOnDelete();
            $table->foreignId('sub_laboratorio_id')->constrained('sub_laboratorios')->restrictOnDelete();
            $table->foreignId('entregado_por')->constrained('users')->restrictOnDelete();
            $table->foreignId('recibido_por')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('fecha_hora_salida')->useCurrent();
            $table->timestamp('fecha_hora_devolucion')->nullable();
            $table->string('estado', 30)->default('Activo');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestamos');
    }
};
