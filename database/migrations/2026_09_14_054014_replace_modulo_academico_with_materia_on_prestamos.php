<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $loanMateriaIds = DB::table('prestamos')
            ->join('modulos_academicos', 'modulos_academicos.id', '=', 'prestamos.modulo_academico_id')
            ->whereNotNull('prestamos.modulo_academico_id')
            ->pluck('modulos_academicos.materia_id', 'prestamos.id');

        Schema::table('prestamos', function (Blueprint $table): void {
            $table->dropForeign(['modulo_academico_id']);
            $table->renameColumn('modulo_academico_id', 'materia_id');
        });

        foreach ($loanMateriaIds as $loanId => $materiaId) {
            DB::table('prestamos')
                ->where('id', $loanId)
                ->update(['materia_id' => $materiaId]);
        }

        Schema::table('prestamos', function (Blueprint $table): void {
            $table->foreign('materia_id')->references('id')->on('materias')->nullOnDelete();
        });

        Schema::dropIfExists('modulos_academicos');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('modulos_academicos', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('docente_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('periodo_academico_id')->constrained('periodos_academicos')->restrictOnDelete();
            $table->foreignId('materia_id')->constrained('materias')->restrictOnDelete();
            $table->unsignedSmallInteger('numero_modulo');
            $table->string('grupo', 20);
            $table->string('modalidad', 30)->nullable();
            $table->string('aula', 50)->nullable();
            $table->string('turno_codigo', 20)->nullable();
            $table->string('turno_nombre', 30)->nullable();
            $table->string('horario', 50)->nullable();
            $table->decimal('nota_minima', 5, 2)->nullable();
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->string('estado', 20)->default('Activo');
            $table->timestamps();

            $table->unique(['periodo_academico_id', 'numero_modulo', 'materia_id', 'grupo'], 'uq_modulo_academico');
        });

        Schema::table('prestamos', function (Blueprint $table): void {
            $table->dropForeign(['materia_id']);
            $table->renameColumn('materia_id', 'modulo_academico_id');
        });

        Schema::table('prestamos', function (Blueprint $table): void {
            $table->foreign('modulo_academico_id')->references('id')->on('modulos_academicos')->nullOnDelete();
        });
    }
};
