<?php

namespace App\Http\Controllers\Docente;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ModuloController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('docente/modulos/index', [
            'modulos' => [],
        ]);
    }
}
