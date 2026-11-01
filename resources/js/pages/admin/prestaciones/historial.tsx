import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, History, Printer, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';
import AppLayout from '@/layouts/app-layout';
import { BoletaPrestamoModal, type LoanReceiptData, type LoanToolItem } from '@/components/boleta-prestamo-modal';
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

type LoanTool = LoanToolItem;

type Loan = LoanReceiptData;

type Lab = { id: number; codigo: string; nombre: string };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Préstamos', href: '/admin/prestaciones' },
    { title: 'Historial', href: '/admin/prestaciones/historial' },
];

export default function PrestacionesHistorial({
    prestamos,
    subLaboratorios,
    fechaInicio,
    fechaFin,
    filtros,
}: {
    prestamos: Loan[];
    subLaboratorios: Lab[];
    fechaInicio: string;
    fechaFin: string;
    filtros?: {
        desde?: string;
        hasta?: string;
        sub_laboratorio_id?: string;
        search?: string;
    };
}) {
    const [search, setSearch] = useState(filtros?.search ?? '');
    const [lab, setLab] = useState(filtros?.sub_laboratorio_id ?? '');
    const [from, setFrom] = useState(fechaInicio);
    const [to, setTo] = useState(fechaFin);
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

    // Sincroniza filtros con el servidor (debounced). Evita recargar en el primer render.
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            router.get(
                '/admin/prestaciones/historial',
                {
                    desde: from || undefined,
                    hasta: to || undefined,
                    sub_laboratorio_id: lab || undefined,
                    search: search || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['prestamos'],
                },
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [from, to, lab, search]);

    const filtered = useMemo(() => {
        return prestamos.filter((loan) => {
            const text =
                `${loan.codigo} ${loan.estudiante ?? ''} ${loan.numero_registro ?? ''} ${loan.materia} ${loan.sub_laboratorio ?? ''}`.toLowerCase();
            const labName = subLaboratorios.find(
                (item) => String(item.id) === lab,
            )?.nombre;
            return (
                text.includes(search.toLowerCase()) &&
                (!lab || loan.sub_laboratorio === labName) &&
                (!from || loan.salida.slice(0, 10) >= from) &&
                (!to || loan.salida.slice(0, 10) <= to)
            );
        });
    }, [prestamos, search, lab, from, to, subLaboratorios]);

    const exportExcel = () => {
        const rows = filtered.flatMap((loan) =>
            loan.herramientas.map((tool) => ({
                'Código préstamo': loan.codigo,
                'Fecha de salida': loan.salida,
                'Fecha de devolución': loan.devolucion ?? 'Pendiente',
                Estudiante: loan.estudiante,
                Registro: loan.numero_registro,
                Carrera: loan.carrera,
                Materia: loan.materia,
                Grupo: loan.grupo,
                'Sub-laboratorio': loan.sub_laboratorio,
                Herramienta: tool.nombre,
                'Código herramienta': tool.codigo,
                Serial: tool.serial ?? 'No serializada',
                Cantidad: tool.cantidad,
                'Estado devolución': tool.estado,
                'Observación herramienta': tool.observaciones ?? '',
                'Estado general': loan.estado,
                'Observaciones préstamo': loan.observaciones ?? '',
            })),
        );
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Historial');
        XLSX.writeFile(workbook, `historial-prestamos-${from}-${to}.xlsx`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historial de préstamos" />
            <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">
                                Historial y boletas
                            </h1>
                            <Badge
                                variant="outline"
                                className="border-primary/30 text-primary"
                            >
                                <History className="mr-1 size-3" />
                                Auditoría
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Haz clic en una fila para previsualizar e imprimir
                            la boleta del préstamo.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/prestaciones">
                                <ArrowLeft className="mr-2 size-4" />
                                Monitor
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/prestaciones/crear">
                                Nuevo préstamo
                            </Link>
                        </Button>
                        <Button
                            variant="default"
                            onClick={exportExcel}
                            disabled={filtered.length === 0}
                        >
                            <Download className="mr-2 size-4" />
                            Exportar Excel
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filtros del historial</CardTitle>
                        <CardDescription>
                            La exportación respeta los filtros aplicados.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-5">
                        <div>
                            <label className="mb-1 block text-xs font-medium">
                                Desde
                            </label>
                            <Input
                                type="date"
                                value={from}
                                onChange={(event) =>
                                    setFrom(event.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium">
                                Hasta
                            </label>
                            <Input
                                type="date"
                                value={to}
                                onChange={(event) => setTo(event.target.value)}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium">
                                Sub-laboratorio
                            </label>
                            <select
                                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                                value={lab}
                                onChange={(event) => setLab(event.target.value)}
                            >
                                <option value="">Todos</option>
                                {subLaboratorios.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.codigo} · {item.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="relative md:col-span-2">
                            <label className="mb-1 block text-xs font-medium">
                                Buscar
                            </label>
                            <Search className="absolute top-8 left-3 size-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                placeholder="Código, estudiante, materia o herramienta"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Movimientos registrados</CardTitle>
                                <CardDescription>
                                    {filtered.length} préstamo(s) encontrados
                                </CardDescription>
                            </div>
                            <Badge variant="secondary">
                                Click para ver boleta
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead>Código</TableHead>
                                    <TableHead>Estudiante</TableHead>
                                    <TableHead>Materia</TableHead>
                                    <TableHead>Sub-laboratorio</TableHead>
                                    <TableHead>Herramientas</TableHead>
                                    <TableHead>Salida</TableHead>
                                    <TableHead>Devolución</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="h-28 text-center text-muted-foreground"
                                        >
                                            No se encontraron registros.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((loan) => (
                                        <TableRow
                                            key={loan.id}
                                            tabIndex={0}
                                            className="cursor-pointer hover:bg-primary/5"
                                            onClick={() =>
                                                setSelectedLoan(loan)
                                            }
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    setSelectedLoan(loan);
                                                }
                                            }}
                                        >
                                            <TableCell className="font-mono text-xs font-semibold text-primary">
                                                {loan.codigo}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {loan.estudiante}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {loan.numero_registro}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-52 text-xs">
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
                                                {loan.herramientas.reduce(
                                                    (sum, tool) =>
                                                        sum + tool.cantidad,
                                                    0,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {loan.salida}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {loan.devolucion ?? 'Pendiente'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        loan.estado ===
                                                        'Con observaciones'
                                                            ? 'destructive'
                                                            : loan.estado ===
                                                                'Devuelto'
                                                              ? 'default'
                                                              : 'secondary'
                                                    }
                                                >
                                                    {loan.estado}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {selectedLoan && (
                <BoletaPrestamoModal
                    loan={selectedLoan}
                    onClose={() => setSelectedLoan(null)}
                />
            )}
        </AppLayout>
    );
}
