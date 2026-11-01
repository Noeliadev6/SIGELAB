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
        Schema::create('inventarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('herramienta_id')->constrained('herramientas')->cascadeOnDelete();
            $table->foreignId('sub_laboratorio_id')->constrained('sub_laboratorios')->cascadeOnDelete();
            $table->integer('stock_total')->default(0);
            $table->integer('stock_disponible')->default(0);
            $table->timestamps();

            $table->unique(['herramienta_id', 'sub_laboratorio_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventarios');
    }
};
