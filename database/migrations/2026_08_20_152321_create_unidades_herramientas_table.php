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
        Schema::create('unidades_herramientas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('herramienta_id')->constrained('herramientas')->cascadeOnDelete();
            $table->foreignId('sub_laboratorio_id')->constrained('sub_laboratorios')->restrictOnDelete();
            $table->string('numero_serie_barras', 100)->unique();
            $table->string('estado', 30)->default('Disponible');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unidades_herramientas');
    }
};
