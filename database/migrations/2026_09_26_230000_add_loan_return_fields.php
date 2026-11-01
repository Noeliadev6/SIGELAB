<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('prestamos', function (Blueprint $table): void {
            $table->timestamp('fecha_hora_prevista_devolucion')->nullable()->after('fecha_hora_salida');
            $table->index(['estado', 'sub_laboratorio_id']);
        });
        Schema::table('detalle_prestamos', function (Blueprint $table): void {
            $table->text('observaciones_devolucion')->nullable()->after('estado_devolucion');
        });
    }

    public function down(): void
    {
        Schema::table('detalle_prestamos', function (Blueprint $table): void {
            $table->dropColumn('observaciones_devolucion');
        });
        Schema::table('prestamos', function (Blueprint $table): void {
            $table->dropIndex(['estado', 'sub_laboratorio_id']);
            $table->dropColumn('fecha_hora_prevista_devolucion');
        });
    }
};
