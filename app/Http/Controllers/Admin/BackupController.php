<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Admin\DatabaseBackupService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class BackupController extends Controller
{
    public function __construct(
        private readonly DatabaseBackupService $backupService,
    ) {}

    /**
     * Descarga una copia de seguridad SQL de la base de datos.
     */
    public function downloadDatabase(Request $request): StreamedResponse
    {
        /** @var User $user */
        $user = $request->user();

        abort_unless(
            $user->esAdministrador() || $user->tienePermiso('backup.crear'),
            403,
            'No tienes permisos para descargar copias de seguridad de la base de datos.'
        );

        return $this->backupService->downloadSqlBackup();
    }
}
