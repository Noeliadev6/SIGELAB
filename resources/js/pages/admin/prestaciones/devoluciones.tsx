import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Barcode,
    Check,
    CheckCircle2,
    FileText,
    History,
    PackageCheck,
    Printer,
    Scan,
    Search,
    ShieldCheck,
    Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';

type ReturnStatus = 'Conforme' | 'Con observaciones' | 'Daño' | 'Perdida';
type LoanTool = LoanToolItem;
type Loan = LoanReceiptData;
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Préstamos', href: '/admin/prestaciones' },
    { title: 'Devoluciones', href: '/admin/prestaciones/devoluciones' },
];

export default function PrestacionesDevoluciones({
    prestamos,
}: {
    prestamos: Loan[];
}) {
    const [selected, setSelected] = useState<Loan | null>(null);
    const [receiptLoan, setReceiptLoan] = useState<Loan | null>(null);
    const [serialInput, setSerialInput] = useState('');
    const [search, setSearch] = useState('');
    const [scanMessage, setScanMessage] = useState<string | null>(null);
    const [statuses, setStatuses] = useState<Record<number, ReturnStatus>>({});
    const [verified, setVerified] = useState<Record<number, boolean>>({});
    const [observations, setObservations] = useState<Record<number, string>>(
        {},
    );
    const form = useForm({
        estado_devolucion: 'Conforme' as ReturnStatus,
        observaciones_devolucion: '',
        detalles: [] as Array<{
            id: number;
            estado_devolucion: ReturnStatus;
            observaciones: string;
        }>,
    });

    const selectLoan = (loan: Loan, verifiedToolId?: number) => {
        setSelected(loan);
        setStatuses(
            Object.fromEntries(
                loan.herramientas.map((tool) => [tool.id, 'Conforme']),
            ) as Record<number, ReturnStatus>,
        );
        setObservations({});
        setVerified(
            Object.fromEntries(
                loan.herramientas.map((tool) => [
                    tool.id,
                    tool.id === verifiedToolId,
                ]),
            ),
        );
        setScanMessage(null);
    };
    const updateStatus = (detailId: number, status: ReturnStatus) =>
        setStatuses((current) => ({ ...current, [detailId]: status }));
    const allConforme =
        selected?.herramientas.every(
            (tool) => statuses[tool.id] === 'Conforme',
        ) ?? false;
    const verifiedCount =
        selected?.herramientas.filter((tool) => verified[tool.id]).length ?? 0;
    const allVerified = Boolean(
        selected &&
        selected.herramientas.length > 0 &&
        verifiedCount === selected.herramientas.length,
    );
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!selected) return;
        const detalles = selected.herramientas.map((tool) => ({
            id: tool.id,
            estado_devolucion: statuses[tool.id] ?? 'Conforme',
            observaciones: observations[tool.id] ?? '',
        }));
        form.transform((data) => ({
            ...data,
            estado_devolucion: allConforme ? 'Conforme' : 'Con observaciones',
            detalles,
        }));
        form.put(`/admin/prestaciones/${selected.id}/devolver`, {
            onSuccess: () => {
                setSelected(null);
                setStatuses({});
                setObservations({});
                form.reset();
            },
        });
    };
    const locateLoan = (value: string) => {
        const query = value.trim().toLowerCase();
        const loan = prestamos.find(
            (item) =>
                item.codigo.toLowerCase() === query ||
                item.herramientas.some(
                    (tool) => tool.serial?.toLowerCase() === query,
                ),
        );
        const verifiedTool = loan?.herramientas.find(
            (tool) => tool.serial?.toLowerCase() === query,
        );
        if (loan) selectLoan(loan, verifiedTool?.id);
        setScanMessage(
            loan
                ? `Préstamo ${loan.codigo} localizado.`
                : 'No se encontró un préstamo activo con ese código o serial.',
        );
    };
    const visibleLoans = useMemo(
        () =>
            prestamos.filter((loan) =>
                `${loan.codigo} ${loan.estudiante ?? ''} ${loan.materia} ${loan.sub_laboratorio ?? ''}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
            ),
        [prestamos, search],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Devoluciones" />
            <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">
                                Recepción y devolución
                            </h1>
                            <Badge
                                variant="outline"
                                className="border-emerald-500/30 text-emerald-600"
                            >
                                Inspección por unidad
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Revisa cada herramienta, registra su estado y
                            confirma la devolución completa.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/prestaciones">
                                <ArrowLeft className="mr-2 size-4" />
                                Monitor
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
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                        <div className="flex items-center gap-3 md:w-1/3">
                            <div className="rounded-lg bg-primary/15 p-3 text-primary">
                                <PackageCheck className="size-6" />
                            </div>
                            <div>
                                <p className="font-semibold">
                                    Localizar préstamo
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Código PRE o serial de herramienta
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-1 gap-2">
                            <div className="relative flex-1">
                                <Barcode className="absolute top-2.5 left-3 size-4 text-primary" />
                                <Input
                                    className="pl-9 font-mono"
                                    placeholder="Escanear código o serial"
                                    value={serialInput}
                                    onChange={(event) =>
                                        setSerialInput(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            locateLoan(serialInput);
                                        }
                                    }}
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={() => locateLoan(serialInput)}
                            >
                                <Barcode className="mr-2 size-4" />
                                Localizar
                            </Button>
                        </div>
                        {scanMessage && (
                            <p className="text-sm text-muted-foreground">
                                {scanMessage}
                            </p>
                        )}
                    </CardContent>
                </Card>
                <div className="grid gap-6 lg:grid-cols-[1fr_500px]">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                <div>
                                    <CardTitle>
                                        Préstamos pendientes (
                                        {visibleLoans.length})
                                    </CardTitle>
                                    <CardDescription>
                                        Selecciona un préstamo para inspeccionar
                                        sus unidades.
                                    </CardDescription>
                                </div>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-2.5 left-2 size-4 text-muted-foreground" />
                                    <Input
                                        className="pl-8"
                                        placeholder="Buscar préstamo..."
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {visibleLoans.length === 0 ? (
                                <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                                    No hay préstamos pendientes.
                                </p>
                            ) : (
                                visibleLoans.map((loan) => (
                                    <button
                                        type="button"
                                        key={loan.id}
                                        onClick={() => selectLoan(loan)}
                                        className={`w-full rounded-xl border p-4 text-left transition hover:bg-muted/50 ${selected?.id === loan.id ? 'border-primary bg-primary/5 shadow-sm' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono font-semibold text-primary">
                                                {loan.codigo}
                                            </span>
                                            <Badge
                                                variant={
                                                    loan.estado === 'Vencido'
                                                        ? 'destructive'
                                                        : 'secondary'
                                                }
                                            >
                                                {loan.estado}
                                            </Badge>
                                        </div>
                                        <p className="mt-1 font-medium">
                                            {loan.estudiante}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {loan.materia} ·{' '}
                                            {loan.sub_laboratorio}
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {loan.herramientas.map((tool) => (
                                                <Badge
                                                    variant="outline"
                                                    key={tool.id}
                                                    className="font-mono text-[10px]"
                                                >
                                                    {tool.serial ?? tool.nombre}
                                                </Badge>
                                            ))}
                                        </div>
                                    </button>
                                ))
                            )}
                        </CardContent>
                    </Card>
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="size-5 text-primary" />
                                Inspección de devolución
                            </CardTitle>
                            <CardDescription>
                                Califica individualmente cada herramienta o
                                unidad.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {selected ? (
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="rounded-xl border bg-muted/30 p-4 text-sm">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-mono font-bold text-primary">
                                                    {selected.codigo}
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                    {selected.estudiante}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {selected.materia}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Badge>
                                                    {selected.sub_laboratorio}
                                                </Badge>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 text-xs"
                                                    onClick={() =>
                                                        setReceiptLoan(selected)
                                                    }
                                                >
                                                    <Printer className="mr-1 size-3" />
                                                    Ver boleta
                                                </Button>
                                            </div>
                                        </div>
                                        {selected.observaciones && (
                                            <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-2 text-xs text-foreground/90">
                                                <span className="font-semibold text-primary">
                                                    Nota de salida:
                                                </span>{' '}
                                                {selected.observaciones}
                                            </div>
                                        )}
                                    </div>
                                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-semibold">
                                                Progreso de verificación
                                            </span>
                                            <Badge
                                                variant={
                                                    allVerified
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className={
                                                    allVerified
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'border-amber-500 text-amber-600'
                                                }
                                            >
                                                {verifiedCount} /{' '}
                                                {selected.herramientas.length}
                                            </Badge>
                                        </div>
                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full bg-emerald-500 transition-all"
                                                style={{
                                                    width: `${(verifiedCount / Math.max(selected.herramientas.length, 1)) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Escanea el serial o marca
                                            manualmente cada unidad después de
                                            comprobarla.
                                        </p>
                                    </div>
                                    <div className="max-h-[390px] space-y-3 overflow-y-auto pr-1">
                                        {selected.herramientas.map((tool) => {
                                            const status =
                                                statuses[tool.id] ?? 'Conforme';
                                            const isVerified = Boolean(
                                                verified[tool.id],
                                            );
                                            return (
                                                <div
                                                    key={tool.id}
                                                    className={`rounded-xl border-2 p-3 transition-all ${isVerified && status === 'Conforme' ? 'border-emerald-500 bg-emerald-500/5 shadow-sm' : status === 'Conforme' ? 'border-amber-400/50 bg-amber-500/5' : 'border-amber-500/50 bg-amber-500/10'}`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex gap-2">
                                                            <Wrench className="mt-0.5 size-4 text-primary" />
                                                            <div>
                                                                <p className="text-sm font-semibold">
                                                                    {
                                                                        tool.nombre
                                                                    }
                                                                </p>
                                                                <p className="font-mono text-xs text-muted-foreground">
                                                                    {
                                                                        tool.codigo
                                                                    }
                                                                    {tool.serial
                                                                        ? ` · Serial: ${tool.serial}`
                                                                        : ` · Cantidad: ${tool.cantidad}`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {isVerified &&
                                                        status ===
                                                            'Conforme' ? (
                                                            <CheckCircle2 className="size-5 text-emerald-600" />
                                                        ) : (
                                                            <AlertCircle className="size-5 text-amber-600" />
                                                        )}
                                                    </div>
                                                    <div className="mt-3 grid grid-cols-3 gap-2">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant={
                                                                isVerified
                                                                    ? 'default'
                                                                    : 'outline'
                                                            }
                                                            className={
                                                                isVerified
                                                                    ? 'bg-emerald-600 hover:bg-emerald-700'
                                                                    : ''
                                                            }
                                                            onClick={() =>
                                                                setVerified(
                                                                    (
                                                                        current,
                                                                    ) => ({
                                                                        ...current,
                                                                        [tool.id]:
                                                                            !isVerified,
                                                                    }),
                                                                )
                                                            }
                                                        >
                                                            {isVerified ? (
                                                                <>
                                                                    <Check className="mr-1 size-3" />
                                                                    Verificada
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Scan className="mr-1 size-3" />
                                                                    Revisar
                                                                </>
                                                            )}
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant={
                                                                status ===
                                                                'Conforme'
                                                                    ? 'default'
                                                                    : 'outline'
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    tool.id,
                                                                    'Conforme',
                                                                )
                                                            }
                                                        >
                                                            <Check className="mr-1 size-3" />
                                                            Conforme
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant={
                                                                status !==
                                                                'Conforme'
                                                                    ? 'secondary'
                                                                    : 'outline'
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    tool.id,
                                                                    'Con observaciones',
                                                                )
                                                            }
                                                        >
                                                            <AlertCircle className="mr-1 size-3" />
                                                            Observación
                                                        </Button>
                                                    </div>
                                                    {status !== 'Conforme' && (
                                                        <div className="mt-2 space-y-2">
                                                            <select
                                                                className="h-9 w-full rounded-md border bg-background px-2 text-xs"
                                                                value={status}
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateStatus(
                                                                        tool.id,
                                                                        event
                                                                            .target
                                                                            .value as ReturnStatus,
                                                                    )
                                                                }
                                                            >
                                                                <option value="Con observaciones">
                                                                    Con
                                                                    observaciones
                                                                </option>
                                                                <option value="Daño">
                                                                    Daño
                                                                </option>
                                                                <option value="Perdida">
                                                                    Pérdida
                                                                </option>
                                                            </select>
                                                            <div>
                                                                <Label className="text-[10px] font-semibold text-muted-foreground">
                                                                    Descripción del daño o motivo (se mostrará en la boleta):
                                                                </Label>
                                                                <Input
                                                                    className="mt-1 h-8 text-xs"
                                                                    placeholder="Ej: Punta doblada, rayado severo, falta accesorio..."
                                                                    value={
                                                                        observations[
                                                                            tool.id
                                                                        ] ?? ''
                                                                    }
                                                                    onChange={(
                                                                        event,
                                                                    ) =>
                                                                        setObservations(
                                                                            (
                                                                                current,
                                                                            ) => ({
                                                                                ...current,
                                                                                [tool.id]:
                                                                                    event
                                                                                        .target
                                                                                        .value,
                                                                            }),
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="space-y-1.5 rounded-xl border bg-muted/20 p-3">
                                        <Label
                                            htmlFor="observaciones_devolucion"
                                            className="flex items-center gap-1.5 text-xs font-semibold"
                                        >
                                            <FileText className="size-3.5 text-primary" />
                                            Observaciones generales de devolución (opcional):
                                        </Label>
                                        <textarea
                                            id="observaciones_devolucion"
                                            rows={2}
                                            className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                                            placeholder="Detalles sobre retraso, autorización del docente o comentarios de entrega..."
                                            value={form.data.observaciones_devolucion}
                                            onChange={(e) =>
                                                form.setData(
                                                    'observaciones_devolucion',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    {!allConforme && (
                                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                                            <AlertCircle className="mr-1 inline size-4 text-amber-600" />
                                            Las unidades observadas quedarán en
                                            mantenimiento y el préstamo se
                                            cerrará con observaciones.
                                        </div>
                                    )}
                                    <Button
                                        className="w-full"
                                        disabled={
                                            form.processing || !allVerified
                                        }
                                    >
                                        <Check className="mr-2 size-4" />
                                        {form.processing
                                            ? 'Registrando...'
                                            : 'Confirmar devolución completa'}
                                    </Button>
                                </form>
                            ) : (
                                <p className="py-10 text-center text-sm text-muted-foreground">
                                    Selecciona un préstamo o localiza un serial
                                    para comenzar la inspección.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
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
