<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('materias', function (Blueprint $table): void {
            $table->string('periodo', 25)->nullable()->after('modulo');
            $table->unsignedTinyInteger('modulo_inicio')->nullable()->after('periodo');
            $table->unsignedTinyInteger('modulo_fin')->nullable()->after('modulo_inicio');
            $table->time('hora_inicio')->nullable()->after('fecha_fin');
            $table->time('hora_fin')->nullable()->after('hora_inicio');
            $table->index(['fecha_inicio', 'fecha_fin']);
        });
    }

    public function down(): void
    {
        Schema::table('materias', function (Blueprint $table): void {
            $table->dropIndex(['fecha_inicio', 'fecha_fin']);
            $table->dropColumn(['periodo', 'modulo_inicio', 'modulo_fin', 'hora_inicio', 'hora_fin']);
        });
    }
};
