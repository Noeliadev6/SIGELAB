import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Clock3,
    History,
    PackageCheck,
    Plus,
    Printer,
    RotateCcw,
    Search,
    Wrench,
    type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BoletaPrestamoModal, type LoanReceiptData } from '@/components/boleta-prestamo-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { BreadcrumbItem } from '@/types';

type Loan = LoanReceiptData;
type Summary = {
    activos: number;
    vencidos: number;
    devueltos: number;
    incidencias: number;
};
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Préstamos y devoluciones', href: '/admin/prestaciones' },
];
const summaryCards: Array<{
    icon: LucideIcon;
    label: string;
    value: keyof Summary;
    style: string;
}> = [
    {
        icon: PackageCheck,
        label: 'Préstamos activos',
        value: 'activos',
        style: 'text-primary bg-primary/10',
    },
    {
        icon: AlertTriangle,
        label: 'Vencidos',
        value: 'vencidos',
        style: 'text-amber-600 bg-amber-500/10',
    },
    {
        icon: RotateCcw,
        label: 'Devueltos',
        value: 'devueltos',
        style: 'text-emerald-600 bg-emerald-500/10',
    },
    {
        icon: Wrench,
        label: 'Con observaciones',
        value: 'incidencias',
        style: 'text-rose-600 bg-rose-500/10',
    },
];

export default function PrestacionesIndex({
    prestamos,
    resumen,
}: {
    prestamos: Loan[];
    resumen: Summary;
}) {
    const [search, setSearch] = useState('');
    const [receiptLoan, setReceiptLoan] = useState<Loan | null>(null);
    const filtered = useMemo(
        () =>
            prestamos.filter((loan) =>
                `${loan.codigo} ${loan.estudiante ?? ''} ${loan.numero_registro ?? ''} ${loan.materia} ${loan.sub_laboratorio ?? ''}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
            ),
        [prestamos, search],
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Préstamos y devoluciones" />
            <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Monitor de préstamos
                            </h1>
                            <Badge
                                variant="outline"
                                className="border-primary/30 text-primary"
                            >
                                Operación real
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Entrega, disponibilidad y devolución de herramientas
                            por sub-laboratorio.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild>
                            <Link href="/admin/prestaciones/crear">
                                <Plus className="mr-2 size-4" />
                                Nuevo préstamo
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/prestaciones/devoluciones">
                                <RotateCcw className="mr-2 size-4" />
                                Devoluciones
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/prestaciones/historial">
                                <History className="mr-2 size-4" />
                                Historial
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {summaryCards.map(({ icon: Icon, label, value, style }) => (
                        <Card key={label}>
                            <CardContent className="flex items-center justify-between p-5">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {label}
                                    </p>
                                    <p className="mt-1 text-3xl font-bold">
                                        {resumen[value]}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        Registros en el sistema
                                    </p>
                                </div>
                                <div className={`rounded-lg p-3 ${style}`}>
                                    <Icon className="size-5" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {resumen.vencidos > 0 && (
                    <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
                        <AlertTriangle className="size-5 text-amber-600" />
                        <span>
                            Hay <strong>{resumen.vencidos}</strong> préstamo(s)
                            vencido(s) pendientes de devolución.
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto"
                            asChild
                        >
                            <Link href="/admin/prestaciones/devoluciones">
                                Revisar
                            </Link>
                        </Button>
                    </div>
                )}
                <Card>
                    <CardHeader className="flex flex-col justify-between gap-4 border-b sm:flex-row sm:items-center">
                        <div>
                            <CardTitle>Préstamos en circulación</CardTitle>
                            <CardDescription>
                                Los datos se actualizan desde el inventario y la
                                base de datos.
                            </CardDescription>
                        </div>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                placeholder="Buscar estudiante, materia o préstamo"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead>Préstamo</TableHead>
                                    <TableHead>Estudiante</TableHead>
                                    <TableHead>Materia / horario</TableHead>
                                    <TableHead>Sub-laboratorio</TableHead>
                                    <TableHead>Herramientas</TableHead>
                                    <TableHead>
                                        <span className="flex items-center gap-1">
                                            <Clock3 className="size-3" />
                                            Devolución
                                        </span>
                                    </TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">
                                        Acción
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            No se encontraron préstamos activos.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((loan) => (
                                        <TableRow key={loan.id}>
                                            <TableCell className="font-mono text-xs font-semibold text-primary">
                                                <div className="flex items-center gap-1.5">
                                                    <span>{loan.codigo}</span>
                                                    {loan.observaciones && (
                                                        <span
                                                            title={`Nota: ${loan.observaciones}`}
                                                            className="rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-medium text-amber-700 dark:text-amber-300"
                                                        >
                                                            Nota
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {loan.estudiante}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {loan.numero_registro}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-56 text-xs">
                                                {loan.materia}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {loan.sub_laboratorio}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Wrench className="size-3 text-primary" />
                                                    {loan.herramientas.reduce(
                                                        (sum, tool) =>
                                                            sum + tool.cantidad,
                                                        0,
                                                    )}{' '}
                                                    ítem(s)
                                                </div>
                                                <div className="max-w-44 truncate text-[11px] text-muted-foreground">
                                                    {loan.herramientas
                                                        .map(
                                                            (tool) =>
                                                                tool.serial ??
                                                                tool.nombre,
                                                        )
                                                        .join(', ')}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {loan.prevista_devolucion ??
                                                    'Sin fecha'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        loan.estado ===
                                                        'Vencido'
                                                            ? 'destructive'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {loan.estado}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-1.5 text-xs text-primary hover:bg-primary/10"
                                                    onClick={() =>
                                                        setReceiptLoan(loan)
                                                    }
                                                >
                                                    <Printer className="size-3.5" />
                                                    Boleta
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {receiptLoan && (
                <BoletaPrestamoModal
                    loan={receiptLoan}
                    onClose={() => setReceiptLoan(null)}
                />
            )}
        </AppLayout>
    );
}
