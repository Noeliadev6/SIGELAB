<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Repositories\Admin\DashboardRepository;

class DashboardService
{
    public function __construct(
        private readonly DashboardRepository $dashboardRepository,
    ) {}

    /**
     * @return array{inventory: array<string, int>, overview: array<string, int>, recentMovements: list<array<string, mixed>>, emergencyAlerts: array<string, mixed>, canBackup: bool}
     */
    public function getDashboardData(User $user): array
    {
        return [
            'inventory' => $this->dashboardRepository->getInventorySummary(),
            'overview' => $this->dashboardRepository->getOperationalSummary(),
            'recentMovements' => $this->dashboardRepository->getRecentMovements(),
            'emergencyAlerts' => $this->dashboardRepository->getEmergencyAlerts(),
            'canBackup' => $user->esAdministrador() || $user->tienePermiso('backup.crear'),
        ];
    }
}
