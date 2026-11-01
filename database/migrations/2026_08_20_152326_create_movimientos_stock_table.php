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
        Schema::create('movimientos_stock', function (Blueprint $table) {
            $table->id();
            $table->foreignId('herramienta_id')->constrained('herramientas')->restrictOnDelete();
            $table->foreignId('unidad_herramienta_id')->nullable()->constrained('unidades_herramientas')->nullOnDelete();
            $table->foreignId('origen_sub_laboratorio_id')->nullable()->constrained('sub_laboratorios')->nullOnDelete();
            $table->foreignId('destino_sub_laboratorio_id')->nullable()->constrained('sub_laboratorios')->nullOnDelete();
            $table->foreignId('usuario_id')->constrained('users')->restrictOnDelete();
            $table->string('tipo_movimiento', 50);
            $table->integer('cantidad')->default(1);
            $table->string('observaciones', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimientos_stock');
    }
};
