import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, ArrowRightLeft, Check, PackageCheck, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { CatalogoLaboratorioTabs } from '@/components/catalogo-laboratorio-tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

type SubLaboratorio = {
    id: number;
    nombre: string;
};

type MovimientoStock = {
    id: number;
    herramienta: string;
    codigo_herramienta: string;
    unidad_serie: string | null;
    origen: string;
    destino: string;
    usuario: string;
    tipo_movimiento: string;
    cantidad: number;
    observaciones: string | null;
    fecha: string | null;
};

type Inventario = {
    id: number;
    herramienta_id: number;
    nombre_herramienta: string;
    sub_laboratorio: { id: number; nombre: string };
    stock_disponible: number;
    es_serializado: boolean;
    unidades: { id: number; numero_serie_barras: string; estado: string }[];
};

type Props = {
    subLaboratorios: SubLaboratorio[];
    historialMovimientos: MovimientoStock[];
    inventarios: Inventario[];
};

type TransferConfirmation = {
    auxiliar: string;
    origen: string;
    destino: string;
    herramienta: string;
    cantidad: number;
    observacion: string;
};

const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Transferencias', href: '/admin/transferencias' },
];

export default function TransferenciasIndex({
    subLaboratorios,
    historialMovimientos,
    inventarios,
}: Props) {
    const { auth } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [confirmation, setConfirmation] =
        useState<TransferConfirmation | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        origen_sub_laboratorio_id: '',
        destino_sub_laboratorio_id: '',
        herramienta_id: '',
        unidad_herramienta_id: '',
        cantidad: 1,
        observaciones: '',
    });

    const origenYDestinoIguales =
        data.origen_sub_laboratorio_id !== '' &&
        data.origen_sub_laboratorio_id === data.destino_sub_laboratorio_id;
    const herramientasDisponibles = useMemo(
        () =>
            inventarios.filter(
                (inventario) =>
                    inventario.sub_laboratorio.id.toString() ===
                        data.origen_sub_laboratorio_id &&
                    inventario.stock_disponible > 0,
            ),
        [data.origen_sub_laboratorio_id, inventarios],
    );
    const inventarioSeleccionado = herramientasDisponibles.find(
        (inventario) =>
            inventario.herramienta_id.toString() === data.herramienta_id,
    );
    const origenSeleccionado = subLaboratorios.find(
        (laboratorio) =>
            laboratorio.id.toString() === data.origen_sub_laboratorio_id,
    );
    const destinoSeleccionado = subLaboratorios.find(
        (laboratorio) =>
            laboratorio.id.toString() === data.destino_sub_laboratorio_id,
    );
    const unidadSeleccionada = inventarioSeleccionado?.unidades.find(
        (unidad) => unidad.id.toString() === data.unidad_herramienta_id,
    );
    const herramientaSeleccionada = inventarioSeleccionado
        ? unidadSeleccionada
            ? `${inventarioSeleccionado.nombre_herramienta} · Serie: ${unidadSeleccionada.numero_serie_barras}`
            : inventarioSeleccionado.nombre_herramienta
        : '';
    const completedSteps = [
        data.origen_sub_laboratorio_id !== '',
        data.herramienta_id !== '',
        data.destino_sub_laboratorio_id !== '' && !origenYDestinoIguales,
        data.origen_sub_laboratorio_id !== '' &&
            data.herramienta_id !== '' &&
            data.destino_sub_laboratorio_id !== '' &&
            !origenYDestinoIguales &&
            data.cantidad >= 1,
    ];

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (origenYDestinoIguales) {
            return;
        }

        const transferConfirmation: TransferConfirmation = {
            auxiliar: auth.user.name,
            origen: origenSeleccionado?.nombre ?? '—',
            destino: destinoSeleccionado?.nombre ?? '—',
            herramienta: herramientaSeleccionada || '—',
            cantidad: data.cantidad,
            observacion: data.observaciones.trim() || 'Sin observaciones',
        };

        post('/admin/inventario/transferir', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsDialogOpen(false);
                setConfirmation(transferConfirmation);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transferencias entre sublaboratorios" />

            <div className="flex flex-1 flex-col gap-8 p-4 md:p-6">
                <CatalogoLaboratorioTabs />

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Transferencias entre sublaboratorios
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Registra la salida, recepción e historial de ítems
                            entre ubicaciones.
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <Button
                            type="button"
                            onClick={() => {
                                reset();
                                setIsDialogOpen(true);
                            }}
                        >
                            <Plus className="size-4" />
                            Nueva transferencia
                        </Button>

                        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>
                                        Nueva transferencia
                                    </DialogTitle>
                                    <DialogDescription>
                                        Completa los datos para mover stock
                                        entre sublaboratorios.
                                    </DialogDescription>
                                </DialogHeader>

                                <ol className="grid grid-cols-2 gap-2 py-4 sm:grid-cols-4">
                                    {[
                                        'Origen',
                                        'Herramienta',
                                        'Destino',
                                        'Revisión',
                                    ].map((step, index) => (
                                        <li
                                            key={step}
                                            className={`flex items-center gap-2 rounded-lg border p-2 text-xs font-medium transition-colors ${
                                                completedSteps[index]
                                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                    : 'bg-muted/30 text-muted-foreground'
                                            }`}
                                        >
                                            <span
                                                className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                                                    completedSteps[index]
                                                        ? 'border-emerald-500 bg-emerald-500 text-white'
                                                        : 'bg-background'
                                                }`}
                                            >
                                                {completedSteps[index] ? (
                                                    <Check className="size-3.5" />
                                                ) : (
                                                    index + 1
                                                )}
                                            </span>
                                            {step}
                                        </li>
                                    ))}
                                </ol>

                                <div className="grid gap-4 pb-4 sm:grid-cols-2">
                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="responsable">
                                            Usuario responsable
                                        </Label>
                                        <Input
                                            id="responsable"
                                            value={auth.user.name}
                                            readOnly
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="origen">Origen</Label>
                                        <Select
                                            value={
                                                data.origen_sub_laboratorio_id
                                            }
                                            onValueChange={(value) => {
                                                setData(
                                                    'origen_sub_laboratorio_id',
                                                    value,
                                                );
                                                setData('herramienta_id', '');
                                                setData(
                                                    'unidad_herramienta_id',
                                                    '',
                                                );
                                            }}
                                            required
                                        >
                                            <SelectTrigger
                                                id="origen"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Selecciona el origen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subLaboratorios.map(
                                                    (laboratorio) => (
                                                        <SelectItem
                                                            key={laboratorio.id}
                                                            value={laboratorio.id.toString()}
                                                        >
                                                            {laboratorio.nombre}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.origen_sub_laboratorio_id && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    errors.origen_sub_laboratorio_id
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="destino">
                                            Destino / recepción
                                        </Label>
                                        <Select
                                            value={
                                                data.destino_sub_laboratorio_id
                                            }
                                            onValueChange={(value) =>
                                                setData(
                                                    'destino_sub_laboratorio_id',
                                                    value,
                                                )
                                            }
                                            required
                                        >
                                            <SelectTrigger
                                                id="destino"
                                                className="w-full"
                                                aria-invalid={
                                                    origenYDestinoIguales
                                                }
                                            >
                                                <SelectValue placeholder="Selecciona el destino" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subLaboratorios.map(
                                                    (laboratorio) => (
                                                        <SelectItem
                                                            key={laboratorio.id}
                                                            value={laboratorio.id.toString()}
                                                        >
                                                            {laboratorio.nombre}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {origenYDestinoIguales && (
                                            <p className="text-sm text-destructive">
                                                El origen y el destino deben ser
                                                diferentes.
                                            </p>
                                        )}
                                        {errors.destino_sub_laboratorio_id && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    errors.destino_sub_laboratorio_id
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="item">Ítem</Label>
                                        <Select
                                            value={data.herramienta_id}
                                            onValueChange={(value) => {
                                                setData(
                                                    'herramienta_id',
                                                    value,
                                                );
                                                setData(
                                                    'unidad_herramienta_id',
                                                    '',
                                                );
                                                setData('cantidad', 1);
                                            }}
                                            disabled={
                                                !data.origen_sub_laboratorio_id
                                            }
                                            required
                                        >
                                            <SelectTrigger
                                                id="item"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Selecciona el ítem" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {herramientasDisponibles.map(
                                                    (inventario) => (
                                                        <SelectItem
                                                            key={inventario.id}
                                                            value={inventario.herramienta_id.toString()}
                                                        >
                                                            {
                                                                inventario.nombre_herramienta
                                                            }{' '}
                                                            (stock:{' '}
                                                            {
                                                                inventario.stock_disponible
                                                            }
                                                            )
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.herramienta_id && (
                                            <p className="text-sm text-destructive">
                                                {errors.herramienta_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="cantidad">
                                            Cantidad
                                        </Label>
                                        <Input
                                            id="cantidad"
                                            type="number"
                                            min={1}
                                            max={
                                                inventarioSeleccionado?.stock_disponible ??
                                                1
                                            }
                                            value={data.cantidad}
                                            onChange={(event) =>
                                                setData(
                                                    'cantidad',
                                                    Number(event.target.value),
                                                )
                                            }
                                            disabled={
                                                inventarioSeleccionado?.es_serializado
                                            }
                                            required
                                        />
                                        {errors.cantidad && (
                                            <p className="text-sm text-destructive">
                                                {errors.cantidad}
                                            </p>
                                        )}
                                    </div>

                                    {inventarioSeleccionado?.es_serializado && (
                                        <div className="grid gap-2 sm:col-span-2">
                                            <Label htmlFor="unidad">
                                                Unidad serializada
                                            </Label>
                                            <Select
                                                value={
                                                    data.unidad_herramienta_id
                                                }
                                                onValueChange={(value) =>
                                                    setData(
                                                        'unidad_herramienta_id',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id="unidad"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Selecciona la unidad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {inventarioSeleccionado.unidades
                                                        .filter(
                                                            (unidad) =>
                                                                unidad.estado ===
                                                                'Disponible',
                                                        )
                                                        .map((unidad) => (
                                                            <SelectItem
                                                                key={unidad.id}
                                                                value={unidad.id.toString()}
                                                            >
                                                                Serie:{' '}
                                                                {
                                                                    unidad.numero_serie_barras
                                                                }
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.unidad_herramienta_id && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors.unidad_herramienta_id
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="observaciones">
                                            Observaciones
                                        </Label>
                                        <Textarea
                                            id="observaciones"
                                            value={data.observaciones}
                                            onChange={(event) =>
                                                setData(
                                                    'observaciones',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Motivo de la transferencia (opcional)"
                                        />
                                    </div>
                                </div>

                                {origenSeleccionado &&
                                    destinoSeleccionado &&
                                    inventarioSeleccionado && (
                                        <div className="mb-5 space-y-4 rounded-lg border bg-muted/30 p-4">
                                            <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Sublaboratorio de origen
                                                    </p>
                                                    <p className="font-medium">
                                                        {origenSeleccionado.nombre}
                                                    </p>
                                                </div>
                                                <ArrowRight className="hidden size-5 text-muted-foreground sm:block" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Sublaboratorio destino
                                                    </p>
                                                    <p className="font-medium">
                                                        {destinoSeleccionado.nombre}
                                                    </p>
                                                </div>
                                            </div>

                                            <dl className="grid gap-3 text-sm sm:grid-cols-2">
                                                <div>
                                                    <dt className="text-xs text-muted-foreground">
                                                        Auxiliar autenticado
                                                    </dt>
                                                    <dd className="font-medium">{auth.user.name}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-muted-foreground">
                                                        Herramienta o unidad
                                                    </dt>
                                                    <dd className="font-medium">
                                                        {herramientaSeleccionada}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-muted-foreground">
                                                        Cantidad
                                                    </dt>
                                                    <dd className="font-medium">
                                                        {data.cantidad} unidad(es)
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-muted-foreground">
                                                        Observación
                                                    </dt>
                                                    <dd className="font-medium">
                                                        {data.observaciones.trim() ||
                                                            'Sin observaciones'}
                                                    </dd>
                                                </div>
                                            </dl>

                                            <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                                                La transferencia se registrará inmediatamente. La
                                                confirmación y notificación a los auxiliares del
                                                laboratorio destino estará disponible próximamente.
                                            </p>
                                        </div>
                                    )}

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        disabled={
                                            origenYDestinoIguales ||
                                            processing ||
                                            !data.herramienta_id
                                        }
                                    >
                                        <PackageCheck className="size-4" />
                                        {processing
                                            ? 'En tránsito…'
                                            : 'Registrar transferencia'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="rounded-xl border border-dashed bg-muted/20 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-sm font-medium">
                                Flujo de confirmación previsto
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Próximamente; estos estados aún no se guardan.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Pendiente</Badge>
                            <Badge variant="outline">En tránsito</Badge>
                            <Badge variant="outline">Completada</Badge>
                            <Badge variant="outline">Rechazada</Badge>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-xl border bg-card shadow-xs">
                    <div className="flex items-center gap-2 border-b p-4 font-medium">
                        <ArrowRightLeft className="size-5 text-muted-foreground" />
                        <h2>Historial de transferencias</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Usuario responsable</TableHead>
                                    <TableHead>Origen</TableHead>
                                    <TableHead>Recepción / destino</TableHead>
                                    <TableHead>Ítem</TableHead>
                                    <TableHead className="text-right">
                                        Cantidad
                                    </TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {historialMovimientos.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No hay transferencias registradas.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    historialMovimientos.map((movimiento) => (
                                        <TableRow key={movimiento.id}>
                                            <TableCell className="whitespace-nowrap">
                                                {movimiento.fecha ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                {movimiento.usuario}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {movimiento.origen}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {movimiento.destino}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">
                                                    {movimiento.herramienta}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Cód:{' '}
                                                    {
                                                        movimiento.codigo_herramienta
                                                    }
                                                    {movimiento.unidad_serie &&
                                                        ` · Serie: ${movimiento.unidad_serie}`}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {movimiento.cantidad}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className="border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    variant="outline"
                                                >
                                                    {movimiento.tipo_movimiento}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </section>

                {confirmation && (
                    <Dialog
                        open
                        onOpenChange={(open) => {
                            if (!open) {
                                setConfirmation(null);
                            }
                        }}
                    >
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <PackageCheck className="size-5 text-emerald-600" />
                                    Transferencia registrada
                                </DialogTitle>
                                <DialogDescription>
                                    El movimiento inmediato fue registrado correctamente.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                                <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Origen</p>
                                        <p className="font-medium">{confirmation.origen}</p>
                                    </div>
                                    <ArrowRight className="hidden size-5 text-muted-foreground sm:block" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Destino</p>
                                        <p className="font-medium">{confirmation.destino}</p>
                                    </div>
                                </div>
                                <div className="border-t pt-3 text-sm">
                                    <p className="font-medium">{confirmation.herramienta}</p>
                                    <p className="text-muted-foreground">
                                        {confirmation.cantidad} unidad(es)
                                    </p>
                                </div>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button">Cerrar</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </AppLayout>
    );
}
