import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowDownToLine,
    ArrowRight,
    ArrowUpFromLine,
    Boxes,
    Building2,
    CheckCircle2,
    Database,
    Download,
    FileSpreadsheet,
    FileText,
    GraduationCap,
    History,
    Package,
    PackageCheck,
    PlusCircle,
    RotateCcw,
    ShieldAlert,
    Users,
    Wrench,
    type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Props = {
    inventory: {
        tools: number;
        units: number;
        availableUnits: number;
        maintenanceUnits?: number;
        laboratories: number;
        lowStock: number;
    };
    overview: {
        students: number;
        activeModules: number;
        activeLoans: number;
        overdueLoans?: number;
        observedLoans?: number;
    };
    recentMovements: Array<{
        id: number;
        type: string;
        quantity: number;
        createdAt: string | null;
        toolName: string;
        userName: string;
    }>;
    emergencyAlerts?: {
        overdue: Array<{
            id: number;
            codigo: string;
            estudiante: string;
            registro: string;
            laboratorio: string;
            prevista: string | null;
        }>;
        maintenance: Array<{
            id: number;
            serial: string;
            estado: string;
            notas: string | null;
            herramienta: string;
            codigo: string;
            laboratorio: string;
        }>;
        criticalStock: Array<{
            id: number;
            disponible: number;
            total: number;
            herramienta: string;
            codigo: string;
            laboratorio: string;
        }>;
    };
    canBackup?: boolean;
};

export default function Dashboard({
    inventory,
    overview,
    recentMovements,
    emergencyAlerts,
    canBackup = true,
}: Props) {
    const overdueCount = overview.overdueLoans ?? 0;
    const maintenanceCount = inventory.maintenanceUnits ?? 0;
    const lowStockCount = inventory.lowStock ?? 0;
    const observedCount = overview.observedLoans ?? 0;
    const hasEmergencies = overdueCount > 0 || maintenanceCount > 0 || lowStockCount > 0;

    return (
        <>
            <Head title="Panel de Control - Laboratorio de Mecánica" />
            <div className="flex flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* ENCABEZADO */}
                <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Laboratorio de Mecánica Automotriz
                            </h1>
                            <Badge
                                variant="outline"
                                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-semibold"
                            >
                                SIGELAB En línea
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Centro de monitoreo operacional, atención de emergencias y accesos directos.
                        </p>
                    </div>

                    {/* DESCARGA RÁPIDA DE BASE DE DATOS */}
                    {canBackup && (
                        <div className="flex items-center gap-2">
                            <Button asChild className="gap-2 shadow-xs bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900">
                                <a href="/admin/backup/database" download>
                                    <Database className="size-4" />
                                    <span>Descargar Base de Datos (.sql)</span>
                                </a>
                            </Button>
                        </div>
                    )}
                </div>

                {/* BANNER DE ALERTA DE EMERGENCIA SI HAY PRÉSTAMOS VENCIDOS */}
                {overdueCount > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-950 dark:text-rose-200">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-rose-500/20 p-2 text-rose-600">
                                <ShieldAlert className="size-5" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">
                                    ¡Atención Urgente! {overdueCount} préstamo(s) han superado la hora de devolución
                                </p>
                                <p className="text-xs text-rose-800 dark:text-rose-300">
                                    Requiere recepción inmediata o contacto con el estudiante prestatario.
                                </p>
                            </div>
                        </div>
                        <Button
                            asChild
                            size="sm"
                            className="bg-rose-600 hover:bg-rose-700 text-white shrink-0 self-start sm:self-center"
                        >
                            <Link href="/admin/prestaciones/devoluciones">
                                <RotateCcw className="mr-1.5 size-4" />
                                Gestionar Devoluciones
                            </Link>
                        </Button>
                    </div>
                )}

                {/* SECCIÓN 1: KPIS DE EMERGENCIAS Y ATENCIÓN INMEDIATA */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <AlertCircle className="size-3.5 text-primary" />
                            KPIs de Emergencias y Estado Crítico
                        </h2>
                        {hasEmergencies ? (
                            <Badge variant="destructive" className="text-[10px] font-bold">
                                {overdueCount + maintenanceCount + lowStockCount} alertas activas
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 text-[10px]">
                                <CheckCircle2 className="size-3 mr-1 inline" /> Todo en orden
                            </Badge>
                        )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <EmergencyCard
                            label="Préstamos Vencidos"
                            value={overdueCount}
                            hint="Excedieron plazo de retorno"
                            icon={AlertTriangle}
                            severity={overdueCount > 0 ? 'critical' : 'normal'}
                            link="/admin/prestaciones/devoluciones"
                            actionLabel="Inspeccionar"
                        />
                        <EmergencyCard
                            label="Unidades en Mantenimiento"
                            value={maintenanceCount}
                            hint="Averiadas o en reparación"
                            icon={Wrench}
                            severity={maintenanceCount > 0 ? 'warning' : 'normal'}
                            link="/admin/catalogo"
                            actionLabel="Ver unidades"
                        />
                        <EmergencyCard
                            label="Stock Crítico (≤ 2)"
                            value={lowStockCount}
                            hint="Reponer existencias"
                            icon={Boxes}
                            severity={lowStockCount > 0 ? 'warning' : 'normal'}
                            link="/admin/inventario"
                            actionLabel="Ver inventario"
                        />
                        <EmergencyCard
                            label="Incidencias Registradas"
                            value={observedCount}
                            hint="Cerrados con observaciones"
                            icon={ShieldAlert}
                            severity={observedCount > 0 ? 'warning' : 'normal'}
                            link="/admin/prestaciones/historial"
                            actionLabel="Ver boletas"
                        />
                    </div>
                </div>

                {/* SECCIÓN 2: KPIS SIMPLES OPERACIONALES */}
                <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                        <Package className="size-3.5 text-primary" />
                        Métricas Operativas del Laboratorio
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SimpleMetricCard
                            label="Préstamos en Curso"
                            value={overview.activeLoans}
                            subtext="Herramientas fuera del almacén"
                            icon={PackageCheck}
                            highlight
                        />
                        <SimpleMetricCard
                            label="Unidades Disponibles"
                            value={`${inventory.availableUnits} / ${inventory.units}`}
                            subtext="Listas para préstamo inmediato"
                            icon={Boxes}
                        />
                        <SimpleMetricCard
                            label="Estudiantes Habilitados"
                            value={overview.students}
                            subtext="Inscritos en carreras y materias"
                            icon={GraduationCap}
                        />
                        <SimpleMetricCard
                            label="Materias y Módulos Activos"
                            value={overview.activeModules}
                            subtext={`${inventory.laboratories} sub-laboratorios en servicio`}
                            icon={Users}
                        />
                    </div>
                </div>

                {/* SECCIÓN 3: CARDS PARA DIRECCIONAR RÁPIDO (ACCIONES RÁPIDAS) */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <ArrowRight className="size-3.5 text-primary" />
                            Accesos Rápidos y Navegación Directa
                        </h2>
                        <span className="text-xs text-muted-foreground">Acceso de un solo clic</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <QuickNavCard
                            title="Nuevo Préstamo"
                            description="Entrega y asignación de herramientas por código de barras o serial."
                            href="/admin/prestaciones/crear"
                            icon={PlusCircle}
                            badge="Operación Diaria"
                            badgeVariant="default"
                            accent="blue"
                        />

                        <QuickNavCard
                            title="Registrar Devolución"
                            description="Inspección por unidad, calificación conforme/daño y cierre de boleta."
                            href="/admin/prestaciones/devoluciones"
                            icon={RotateCcw}
                            badge={overdueCount > 0 ? `${overdueCount} vencidos` : 'Recepción'}
                            badgeVariant={overdueCount > 0 ? 'destructive' : 'secondary'}
                            accent="emerald"
                        />

                        <QuickNavCard
                            title="Catálogo & Unidades"
                            description="Administración de herramientas, números de serie físicos y estados de baja."
                            href="/admin/catalogo"
                            icon={Wrench}
                            badge={`${inventory.tools} herramientas`}
                            badgeVariant="outline"
                            accent="amber"
                        />

                        <QuickNavCard
                            title="Control de Estudiantes"
                            description="Padrón de prestatarios, asignación a materias e importación de listas Excel."
                            href="/admin/estudiantes"
                            icon={GraduationCap}
                            badge="Nóminas"
                            badgeVariant="outline"
                            accent="purple"
                        />

                        <QuickNavCard
                            title="Historial & Boletas"
                            description="Auditoría de todos los movimientos, descarga en Excel y reimpresión de boletas."
                            href="/admin/prestaciones/historial"
                            icon={History}
                            badge="Auditoría"
                            badgeVariant="outline"
                            accent="indigo"
                        />

                        <QuickNavCard
                            title="Sub-Laboratorios & Stock"
                            description="Monitoreo por ambientes (MYH, MOT, INJ) y transferencias de herramientas."
                            href="/admin/inventario"
                            icon={Building2}
                            badge={`${inventory.laboratories} laboratorios`}
                            badgeVariant="outline"
                            accent="cyan"
                        />
                    </div>
                </div>

                {/* SECCIÓN 4: CENTRO DE DESCARGAS RÁPIDAS */}
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-card to-card">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Download className="size-4 text-primary" />
                                    Centro de Descargas Rápidas y Respaldo
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Exporta datos críticos del sistema para resguardo externo y auditoría.
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="w-fit text-[11px] font-mono">
                                Base de Datos: MySQL / SIGELAB
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {/* Descarga Base de Datos SQL */}
                            <div className="rounded-xl border bg-card p-4 flex flex-col justify-between gap-3 shadow-2xs">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                                        <Database className="size-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Respaldo Completo (.sql)</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Esquema y todas las tablas para restaurar el sistema.
                                        </p>
                                    </div>
                                </div>
                                <Button asChild size="sm" className="w-full gap-1.5 font-semibold">
                                    <a href="/admin/backup/database" download>
                                        <Download className="size-3.5" />
                                        Descargar Backup SQL
                                    </a>
                                </Button>
                            </div>

                            {/* Exportar Historial de Préstamos */}
                            <div className="rounded-xl border bg-card p-4 flex flex-col justify-between gap-3 shadow-2xs">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-600">
                                        <FileSpreadsheet className="size-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Historial Préstamos (Excel)</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Reporte detallado de préstamos con observaciones y fechas.
                                        </p>
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm" className="w-full gap-1.5">
                                    <Link href="/admin/prestaciones/historial">
                                        <FileText className="size-3.5" />
                                        Ir al Historial & Exportar
                                    </Link>
                                </Button>
                            </div>

                            {/* Inventario y Catálogo */}
                            <div className="rounded-xl border bg-card p-4 flex flex-col justify-between gap-3 shadow-2xs">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-600">
                                        <Boxes className="size-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Catálogo & Existencias</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Unidades serializadas y stock por sub-laboratorio.
                                        </p>
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm" className="w-full gap-1.5">
                                    <Link href="/admin/catalogo">
                                        <Wrench className="size-3.5" />
                                        Gestionar Catálogo
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* SECCIÓN 5: TABLA DE DETALLES Y MOVIMIENTOS RECIENTES */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Alertas Detalladas de Emergencia */}
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <AlertTriangle className="size-4 text-amber-500" />
                                        Atención Prioritaria Inmediata
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Préstamos y unidades que demandan intervención.
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {overdueCount + maintenanceCount} pendientes
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {/* Overdue loans detail */}
                            {emergencyAlerts?.overdue && emergencyAlerts.overdue.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide">
                                        Préstamos vencidos ({emergencyAlerts.overdue.length}):
                                    </p>
                                    {emergencyAlerts.overdue.map((loan) => (
                                        <div
                                            key={loan.id}
                                            className="flex items-center justify-between rounded-lg border border-rose-500/30 bg-rose-500/5 p-2.5 text-xs"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-rose-700 dark:text-rose-300">
                                                        {loan.codigo}
                                                    </span>
                                                    <span className="font-medium text-foreground">
                                                        {loan.estudiante}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {loan.laboratorio} · Previsto: {loan.prevista ?? 'Sin fecha'}
                                                </p>
                                            </div>
                                            <Button asChild size="sm" variant="outline" className="h-7 text-xs border-rose-500/30 hover:bg-rose-500/10">
                                                <Link href="/admin/prestaciones/devoluciones">
                                                    Devolver
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {/* Maintenance units detail */}
                            {emergencyAlerts?.maintenance && emergencyAlerts.maintenance.length > 0 ? (
                                <div className="space-y-2 pt-2 border-t">
                                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                                        Unidades en Mantenimiento / Dañadas ({emergencyAlerts.maintenance.length}):
                                    </p>
                                    {emergencyAlerts.maintenance.map((unit) => (
                                        <div
                                            key={unit.id}
                                            className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5 text-xs"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {unit.herramienta} · <span className="font-mono text-muted-foreground">{unit.serial}</span>
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {unit.laboratorio} {unit.notas ? `· Motivo: ${unit.notas}` : ''}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] border-amber-500/50 text-amber-700 dark:text-amber-300">
                                                {unit.estado}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {!hasEmergencies && (
                                <div className="py-8 text-center text-xs text-muted-foreground">
                                    <CheckCircle2 className="mx-auto size-8 text-emerald-500 mb-2" />
                                    No hay préstamos vencidos ni unidades averiadas en este momento.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Movimientos Recientes de Stock */}
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Movimientos Recientes</CardTitle>
                                    <CardDescription className="text-xs">
                                        Últimas entradas y salidas registradas en el almacén.
                                    </CardDescription>
                                </div>
                                <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                                    <Link href="/admin/inventario">Ver almacén</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            {recentMovements.length === 0 ? (
                                <p className="py-8 text-center text-xs text-muted-foreground">
                                    Todavía no hay movimientos de stock registrados.
                                </p>
                            ) : (
                                <div className="divide-y text-xs">
                                    {recentMovements.map((movement) => {
                                        const isEntry = movement.type.toLowerCase().includes('entrada');
                                        return (
                                            <div
                                                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                                                key={movement.id}
                                            >
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    <div
                                                        className={`rounded-md p-1.5 ${
                                                            isEntry
                                                                ? 'bg-emerald-500/10 text-emerald-600'
                                                                : 'bg-orange-500/10 text-orange-600'
                                                        }`}
                                                    >
                                                        {isEntry ? (
                                                            <ArrowDownToLine className="size-3.5" />
                                                        ) : (
                                                            <ArrowUpFromLine className="size-3.5" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold text-foreground">
                                                            {movement.toolName}
                                                        </p>
                                                        <p className="text-[11px] text-muted-foreground">
                                                            {movement.userName} · {movement.type}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="shrink-0 font-mono font-bold text-foreground">
                                                    {isEntry ? '+' : '-'}{movement.quantity} ud.
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

function EmergencyCard({
    label,
    value,
    hint,
    icon: Icon,
    severity,
    link,
    actionLabel,
}: {
    label: string;
    value: number;
    hint: string;
    icon: LucideIcon;
    severity: 'critical' | 'warning' | 'normal';
    link: string;
    actionLabel: string;
}) {
    const isCritical = severity === 'critical';
    const isWarning = severity === 'warning';

    const borderStyle = isCritical
        ? 'border-rose-500/40 bg-rose-500/5'
        : isWarning
          ? 'border-amber-500/40 bg-amber-500/5'
          : 'border-border bg-card';

    const textStyle = isCritical
        ? 'text-rose-600'
        : isWarning
          ? 'text-amber-600'
          : 'text-foreground';

    const iconBg = isCritical
        ? 'bg-rose-500/15 text-rose-600'
        : isWarning
          ? 'bg-amber-500/15 text-amber-600'
          : 'bg-muted text-muted-foreground';

    return (
        <div className={`rounded-xl border p-4 shadow-2xs flex flex-col justify-between gap-3 ${borderStyle}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-muted-foreground">{label}</p>
                    <p className={`mt-1 text-2xl font-bold ${textStyle}`}>{value}</p>
                </div>
                <div className={`rounded-lg p-2 ${iconBg}`}>
                    <Icon className="size-4" />
                </div>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-current/10">
                <span className="text-muted-foreground">{hint}</span>
                <Link
                    href={link}
                    className="font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                    {actionLabel}
                    <ArrowRight className="size-3" />
                </Link>
            </div>
        </div>
    );
}

function SimpleMetricCard({
    label,
    value,
    subtext,
    icon: Icon,
    highlight = false,
}: {
    label: string;
    value: number | string;
    subtext: string;
    icon: LucideIcon;
    highlight?: boolean;
}) {
    return (
        <div className={`rounded-xl border p-5 shadow-2xs bg-card ${highlight ? 'border-primary/30 ring-1 ring-primary/20' : ''}`}>
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
                <div className={`rounded-lg p-2 ${highlight ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="size-4" />
                </div>
            </div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
        </div>
    );
}

function QuickNavCard({
    title,
    description,
    href,
    icon: Icon,
    badge,
    badgeVariant = 'secondary',
    accent = 'blue',
}: {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    badge?: string;
    badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
    accent?: string;
}) {
    const accentColors: Record<string, { bg: string; text: string; hover: string }> = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', hover: 'hover:border-blue-500/50' },
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', hover: 'hover:border-emerald-500/50' },
        amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', hover: 'hover:border-amber-500/50' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', hover: 'hover:border-purple-500/50' },
        indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-600', hover: 'hover:border-indigo-500/50' },
        cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', hover: 'hover:border-cyan-500/50' },
    };

    const colors = accentColors[accent] ?? accentColors.blue;

    return (
        <Link
            href={href}
            className={`group rounded-xl border bg-card p-4 transition-all hover:shadow-md ${colors.hover} flex flex-col justify-between gap-3`}
        >
            <div>
                <div className="flex items-center justify-between mb-2">
                    <div className={`rounded-lg p-2.5 ${colors.bg} ${colors.text} transition-transform group-hover:scale-105`}>
                        <Icon className="size-5" />
                    </div>
                    {badge && (
                        <Badge variant={badgeVariant} className="text-[10px]">
                            {badge}
                        </Badge>
                    )}
                </div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center justify-between">
                    {title}
                    <ArrowRight className="size-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-primary" />
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {description}
                </p>
            </div>
        </Link>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/admin/dashboard' }],
};
