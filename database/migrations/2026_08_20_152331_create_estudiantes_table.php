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
        Schema::create('estudiantes', function (Blueprint $table) {
            $table->id();
            $table->string('carnet_identidad', 30)->unique();
            $table->string('registro_universitario', 30)->nullable();
            $table->string('nombres', 80);
            $table->string('apellidos', 80);
            $table->string('carrera', 100)->nullable();
            $table->string('tipo_estudiante', 20)->default('Regular');
            $table->string('telefono', 30)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estudiantes');
    }
};
