<?php

use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Admin\CatalogoController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EstudianteController;
use App\Http\Controllers\Admin\EstudianteImportController;
use App\Http\Controllers\Admin\InventarioSubLaboratorioController;
use App\Http\Controllers\Admin\MateriaController;
use App\Http\Controllers\Admin\PrestacionController;
use App\Http\Controllers\Admin\RolController;
use App\Http\Controllers\Admin\UsuarioController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::prefix('admin')
    ->middleware(['auth', 'verified', 'role'])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('catalogo', [CatalogoController::class, 'index'])->middleware('permission:catalogo.ver')->name('catalogo.index');
        Route::post('catalogo', [CatalogoController::class, 'store'])->middleware('permission:catalogo.crear')->name('catalogo.store');
        Route::put('catalogo/{herramienta}', [CatalogoController::class, 'update'])->middleware('permission:catalogo.editar')->name('catalogo.update');
        Route::delete('catalogo/{herramienta}', [CatalogoController::class, 'destroy'])->middleware('permission:catalogo.eliminar')->name('catalogo.destroy');
        Route::patch('catalogo/unidades/{unidad}', [CatalogoController::class, 'actualizarEstadoUnidad'])->middleware('permission:catalogo.editar')->name('catalogo.unidades.update');
        Route::put(
            'catalogo/unidades/{unidad}/editar',
            [CatalogoController::class, 'actualizarUnidad']
        )
            ->middleware('permission:catalogo.editar')
            ->name('catalogo.unidades.editar');

        Route::delete(
            'catalogo/unidades/{unidad}',
            [CatalogoController::class, 'eliminarUnidad']
        )
            ->middleware('permission:catalogo.eliminar')
            ->name('catalogo.unidades.destroy');
        Route::get('inventario', [InventarioSubLaboratorioController::class, 'index'])->middleware('permission:inventario.ver')->name('inventario.index');
        Route::post('inventario/transferir', [InventarioSubLaboratorioController::class, 'transferir'])->middleware('permission:inventario.ver')->name('inventario.transferir');
        Route::get('estudiantes', [EstudianteController::class, 'index'])->middleware('permission:estudiantes.ver')->name('estudiantes.index');
        Route::get('materias', [MateriaController::class, 'index'])->middleware('permission:estudiantes.ver')->name('materias.index');
        Route::post('materias/{materia}/estudiantes', [MateriaController::class, 'addStudent'])->middleware('permission:estudiantes.ver')->name('materias.estudiantes.store');
        Route::delete('materias/{materia}/estudiantes/{estudiante}', [MateriaController::class, 'removeStudent'])->middleware('permission:estudiantes.ver')->name('materias.estudiantes.destroy');

        Route::get('prestaciones', [PrestacionController::class, 'index'])->middleware('permission:inventario.ver')->name('prestaciones.index');
        Route::get('prestaciones/crear', [PrestacionController::class, 'create'])->middleware('permission:inventario.ver')->name('prestaciones.create');
        Route::post('prestaciones', [PrestacionController::class, 'store'])->middleware('permission:prestamos.crear')->name('prestaciones.store');
        Route::get('prestaciones/laboratorios/{subLaboratorio}/herramientas', [PrestacionController::class, 'herramientas'])->middleware('permission:inventario.ver')->name('prestaciones.herramientas');
        Route::get('prestaciones/devoluciones', [PrestacionController::class, 'devoluciones'])->middleware('permission:inventario.ver')->name('prestaciones.devoluciones');
        Route::put('prestaciones/{prestamo}/devolver', [PrestacionController::class, 'devolver'])->middleware('permission:prestamos.cerrar')->name('prestaciones.devolver');
        Route::get('prestaciones/escanner-remoto', [PrestacionController::class, 'escannerRemoto'])->middleware('permission:inventario.ver')->name('prestaciones.escanner-remoto');
        Route::get('prestaciones/historial', [PrestacionController::class, 'historial'])->middleware('permission:inventario.ver')->name('prestaciones.historial');
        Route::get('estudiantes/import', [EstudianteImportController::class, 'create'])->middleware('permission:estudiantes.importar')->name('estudiantes.import');
        Route::post('estudiantes/import', [EstudianteImportController::class, 'store'])->middleware('permission:estudiantes.importar')->name('estudiantes.import.store');
        Route::get('backup/database', [BackupController::class, 'downloadDatabase'])->name('backup.database');

        Route::middleware('role:administrador')->group(function () {
            Route::resource('usuarios', UsuarioController::class);
            Route::resource('roles', RolController::class)->only(['index', 'edit', 'update']);
            Route::get('estudiantes/create', [EstudianteController::class, 'create'])->name('estudiantes.create');
            Route::post('estudiantes', [EstudianteController::class, 'store'])->name('estudiantes.store');
            Route::put('estudiantes/{estudiante}', [EstudianteController::class, 'update'])->name('estudiantes.update');
            Route::delete('estudiantes/{estudiante}', [EstudianteController::class, 'destroy'])->name('estudiantes.destroy');
            Route::post('materias', [MateriaController::class, 'store'])->name('materias.store');
            Route::put('materias/{materia}', [MateriaController::class, 'update'])->name('materias.update');
            Route::delete('materias/{materia}', [MateriaController::class, 'destroy'])->name('materias.destroy');
        });
        Route::get(
            'catalogo/unidades/buscar',
            [CatalogoController::class, 'buscarUnidad']
        )
            ->middleware('permission:catalogo.ver')
            ->name('catalogo.unidades.buscar');

        Route::post(
            'catalogo/unidades',
            [CatalogoController::class, 'storeUnidad']
        )
            ->middleware('permission:catalogo.editar')
            ->name('catalogo.unidades.store');
    });

require __DIR__.'/settings.php';
