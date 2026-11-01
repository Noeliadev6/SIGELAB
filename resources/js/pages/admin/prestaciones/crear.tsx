import { Head, Link, useForm } from '@inertiajs/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
    AlertCircle,
    ArrowLeft,
    Barcode,
    CheckCircle2,
    Clock3,
    GraduationCap,
    Package,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    Wrench,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';

type Subject = {
    id: number;
    codigo: string;
    nombre: string;
    grupo: string | null;
    hora_inicio: string | null;
    hora_fin: string | null;
};
type Student = {
    id: number;
    nombre: string;
    numero_registro: string | null;
    carrera: string | null;
    materias: Subject[];
};
type Lab = { id: number; codigo: string; nombre: string };
type Tool = {
    id: string;
    herramienta_id: number;
    unidad_herramienta_id: number | null;
    codigo: string;
    nombre: string;
    serial: string | null;
    categoria: string | null;
    cantidad_disponible: number;
    serializado: boolean;
};
type LoanTool = {
    herramienta_id: number;
    unidad_herramienta_id: number | null;
    cantidad: number;
    label: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Préstamos y devoluciones', href: '/admin/prestaciones' },
    { title: 'Nuevo préstamo', href: '/admin/prestaciones/crear' },
];

export default function PrestacionesCrear({
    estudiantes,
    subLaboratorios,
    herramientas,
    fechaMinimaDevolucion,
}: {
    estudiantes: Student[];
    subLaboratorios: Lab[];
    herramientas: Tool[];
    fechaMinimaDevolucion: string;
}) {
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedTools, setSelectedTools] = useState<LoanTool[]>([]);
    const [availableTools, setAvailableTools] = useState<Tool[]>(herramientas);
    const [selectedLab, setSelectedLab] = useState<number>(
        subLaboratorios[0]?.id ?? 0,
    );
    const [message, setMessage] = useState<string | null>(null);
    const [toolSearch, setToolSearch] = useState('');
    const [serialInput, setSerialInput] = useState('');
    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const form = useForm({
        estudiante_id: '',
        materia_id: '',
        sub_laboratorio_id: String(subLaboratorios[0]?.id ?? ''),
        fecha_hora_prevista_devolucion: fechaMinimaDevolucion,
        observaciones: '',
        herramientas: [] as Array<{
            herramienta_id: number;
            unidad_herramienta_id: number | null;
            cantidad: number;
        }>,
    });

    const students = useMemo(
        () =>
            estudiantes.filter((student) =>
                `${student.nombre} ${student.numero_registro ?? ''}`
                    .toLowerCase()
                    .includes(studentSearch.toLowerCase()),
            ),
        [estudiantes, studentSearch],
    );
    const selectedStudent = estudiantes.find(
        (student) => String(student.id) === form.data.estudiante_id,
    );
    const selectedSubject = selectedStudent?.materias.find(
        (subject) => String(subject.id) === form.data.materia_id,
    );
    const filteredTools = availableTools.filter((tool) =>
        `${tool.nombre} ${tool.codigo} ${tool.serial ?? ''}`
            .toLowerCase()
            .includes(toolSearch.toLowerCase()),
    );

    useEffect(() => {
        if (!selectedLab) return;
        fetch(`/admin/prestaciones/laboratorios/${selectedLab}/herramientas`)
            .then((response) => response.json())
            .then((data: { herramientas: Tool[] }) =>
                setAvailableTools(data.herramientas),
            );
    }, [selectedLab]);

    useEffect(() => {
        if (!cameraOpen) {
            return;
        }

        setCameraError(null);
        let cancelled = false;
        const timeoutId = window.setTimeout(() => {
            if (
                cancelled ||
                !document.getElementById('prestamo-camera-reader')
            ) {
                return;
            }

            try {
                const scanner = new Html5QrcodeScanner(
                    'prestamo-camera-reader',
                    { fps: 10, qrbox: { width: 250, height: 180 } },
                    false,
                );
                scannerRef.current = scanner;
                scanner.render(
                    (decodedText) => {
                        setSerialInput(decodedText);
                        setCameraOpen(false);
                    },
                    (errorMessage) => {
                        if (errorMessage.includes('NotAllowedError')) {
                            setCameraError(
                                'El navegador bloqueó el acceso a la cámara. Permite el uso de la cámara y vuelve a intentarlo.',
                            );
                        }
                    },
                );
            } catch {
                setCameraError(
                    'No se pudo iniciar la cámara. Verifica que exista una cámara disponible y que el sitio tenga permiso para utilizarla.',
                );
            }
        }, 150);

        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);
            if (scannerRef.current) {
                void scannerRef.current.clear().catch(() => undefined);
                scannerRef.current = null;
            }
        };
    }, [cameraOpen]);

    const changeLab = (value: string) => {
        setSelectedLab(Number(value));
        form.setData('sub_laboratorio_id', value);
        setSelectedTools([]);
        form.setData('herramientas', []);
    };

    const addTool = (tool: Tool) => {
        if (
            selectedTools.some(
                (item) =>
                    item.herramienta_id === tool.herramienta_id &&
                    item.unidad_herramienta_id === tool.unidad_herramienta_id,
            )
        )
            return;
        const next = [
            ...selectedTools,
            {
                herramienta_id: tool.herramienta_id,
                unidad_herramienta_id: tool.unidad_herramienta_id,
                cantidad: 1,
                label: `${tool.nombre}${tool.serial ? ` · ${tool.serial}` : ''}`,
            },
        ];
        setSelectedTools(next);
        form.setData(
            'herramientas',
            next.map(({ label, ...item }) => item),
        );
    };

    const scanTool = (event: React.SyntheticEvent) => {
        event.preventDefault();
        const value = serialInput.trim().toLowerCase();
        const tool = availableTools.find(
            (item) =>
                item.serial?.toLowerCase() === value ||
                item.codigo.toLowerCase() === value,
        );
        if (!tool) {
            setMessage(
                'No se encontró un código o número serial disponible en este sublaboratorio.',
            );
            return;
        }
        addTool(tool);
        setSerialInput('');
        setMessage(
            `Herramienta ${tool.serial ?? tool.codigo} agregada al préstamo.`,
        );
    };

    const removeTool = (index: number) => {
        const next = selectedTools.filter(
            (_, itemIndex) => itemIndex !== index,
        );
        setSelectedTools(next);
        form.setData(
            'herramientas',
            next.map(({ label, ...item }) => item),
        );
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        setMessage(null);
        form.post('/admin/prestaciones', {
            onSuccess: () => setMessage('Préstamo registrado correctamente.'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo préstamo" />
            <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
                <div className="flex items-center justify-between border-b pb-5">
                    <div>
                        <h1 className="text-2xl font-bold">Nuevo préstamo</h1>
                        <p className="text-sm text-muted-foreground">
                            Registra herramientas reales del inventario para un
                            estudiante inscrito en una materia.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/prestaciones">
                            <ArrowLeft className="mr-2 size-4" />
                            Volver
                        </Link>
                    </Button>
                </div>
                {message && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-700">
                        <CheckCircle2 className="size-5" />
                        {message}
                    </div>
                )}
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className="rounded-lg bg-primary/15 p-2 text-primary">
                                    <GraduationCap className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Estudiante
                                    </p>
                                    <p className="font-semibold">
                                        {selectedStudent?.nombre ??
                                            'Pendiente de selección'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-blue-500/20 bg-blue-500/5">
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className="rounded-lg bg-blue-500/15 p-2 text-blue-600">
                                    <Clock3 className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Materia y horario
                                    </p>
                                    <p className="font-semibold">
                                        {selectedSubject
                                            ? `${selectedSubject.codigo} · ${selectedSubject.hora_inicio ?? '--:--'} - ${selectedSubject.hora_fin ?? '--:--'}`
                                            : 'Pendiente de selección'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-emerald-500/20 bg-emerald-500/5">
                            <CardContent className="flex items-center gap-3 p-4">
                                <div className="rounded-lg bg-emerald-500/15 p-2 text-emerald-600">
                                    <Wrench className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Herramientas seleccionadas
                                    </p>
                                    <p className="font-semibold">
                                        {selectedTools.length} ítems
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                        <Card>
                            <CardHeader>
                                <CardTitle>Datos del préstamo</CardTitle>
                                <CardDescription>
                                    Selecciona un estudiante, una materia
                                    habilitada y el horario correspondiente.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="student-search">
                                        Buscar estudiante
                                    </Label>
                                    <Input
                                        id="student-search"
                                        placeholder="Nombre o número de registro"
                                        value={studentSearch}
                                        onChange={(event) =>
                                            setStudentSearch(event.target.value)
                                        }
                                    />
                                    <select
                                        className="w-full rounded-md border bg-background p-2"
                                        value={form.data.estudiante_id}
                                        onChange={(event) => {
                                            form.setData(
                                                'estudiante_id',
                                                event.target.value,
                                            );
                                            form.setData('materia_id', '');
                                        }}
                                        required
                                    >
                                        <option value="">
                                            Seleccionar estudiante
                                        </option>
                                        {students.map((student) => (
                                            <option
                                                key={student.id}
                                                value={student.id}
                                            >
                                                {student.nombre} ·{' '}
                                                {student.numero_registro ??
                                                    'Sin registro'}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.estudiante_id && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.estudiante_id}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">
                                        Materia habilitada
                                    </Label>
                                    <select
                                        id="subject"
                                        className="w-full rounded-md border bg-background p-2"
                                        value={form.data.materia_id}
                                        onChange={(event) =>
                                            form.setData(
                                                'materia_id',
                                                event.target.value,
                                            )
                                        }
                                        disabled={!selectedStudent}
                                        required
                                    >
                                        <option value="">
                                            Seleccionar materia
                                        </option>
                                        {selectedStudent?.materias.map(
                                            (subject) => (
                                                <option
                                                    key={subject.id}
                                                    value={subject.id}
                                                >
                                                    {subject.codigo} ·{' '}
                                                    {subject.nombre}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                    {selectedSubject && (
                                        <p className="text-xs text-muted-foreground">
                                            Horario:{' '}
                                            {selectedSubject.hora_inicio ??
                                                'Sin hora'}{' '}
                                            -{' '}
                                            {selectedSubject.hora_fin ??
                                                'Sin hora'}{' '}
                                            {selectedSubject.grupo
                                                ? `· Grupo ${selectedSubject.grupo}`
                                                : ''}
                                        </p>
                                    )}
                                    {form.errors.materia_id && (
                                        <p className="text-sm text-destructive">
                                            {form.errors.materia_id}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lab">Sub-laboratorio</Label>
                                    <select
                                        id="lab"
                                        className="w-full rounded-md border bg-background p-2"
                                        value={form.data.sub_laboratorio_id}
                                        onChange={(event) =>
                                            changeLab(event.target.value)
                                        }
                                        required
                                    >
                                        {subLaboratorios.map((lab) => (
                                            <option key={lab.id} value={lab.id}>
                                                {lab.codigo} · {lab.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="due-date">
                                        Fecha prevista de devolución
                                    </Label>
                                    <Input
                                        id="due-date"
                                        type="datetime-local"
                                        min={fechaMinimaDevolucion}
                                        value={
                                            form.data
                                                .fecha_hora_prevista_devolucion
                                        }
                                        onChange={(event) =>
                                            form.setData(
                                                'fecha_hora_prevista_devolucion',
                                                event.target.value,
                                            )
                                        }
                                        required
                                    />
                                    {form.errors
                                        .fecha_hora_prevista_devolucion && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.errors
                                                    .fecha_hora_prevista_devolucion
                                            }
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Observaciones</Label>
                                    <textarea
                                        id="notes"
                                        className="min-h-24 w-full rounded-md border bg-background p-2 text-sm"
                                        value={form.data.observaciones}
                                        onChange={(event) =>
                                            form.setData(
                                                'observaciones',
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="size-5 text-primary" />
                                            Herramientas disponibles
                                        </CardTitle>
                                        <CardDescription>
                                            Filtrado por el sub-laboratorio
                                            seleccionado.
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline">
                                        {availableTools.length} disponibles
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div
                                    className="flex flex-col gap-2 sm:flex-row"
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter')
                                            scanTool(event);
                                    }}
                                >
                                    <div className="relative flex-1">
                                        <Barcode className="absolute top-2.5 left-3 size-4 text-primary" />
                                        <Input
                                            className="pl-9 font-mono"
                                            placeholder="Escanear código o número serial"
                                            value={serialInput}
                                            onChange={(event) =>
                                                setSerialInput(
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={scanTool}
                                    >
                                        <Barcode className="mr-2 size-4" />
                                        Agregar serial
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCameraOpen(true)}
                                    >
                                        Abrir cámara
                                    </Button>
                                </div>
                                <div className="relative">
                                    <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        placeholder="Buscar por nombre, código o serial"
                                        value={toolSearch}
                                        onChange={(event) =>
                                            setToolSearch(event.target.value)
                                        }
                                    />
                                </div>
                                <div className="max-h-64 space-y-2 overflow-y-auto">
                                    {filteredTools.length === 0 ? (
                                        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                            No hay herramientas disponibles para
                                            este filtro.
                                        </p>
                                    ) : (
                                        filteredTools.map((tool) => (
                                            <div
                                                key={tool.id}
                                                className="flex items-center justify-between rounded-lg border p-3 transition hover:border-primary/40 hover:bg-muted/30"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {tool.nombre}
                                                    </p>
                                                    <p className="font-mono text-xs text-muted-foreground">
                                                        {tool.codigo}
                                                        {tool.serial
                                                            ? ` · ${tool.serial}`
                                                            : ` · Stock: ${tool.cantidad_disponible}`}
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        addTool(tool)
                                                    }
                                                >
                                                    <Plus className="mr-1 size-4" />
                                                    Agregar
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="border-t pt-4">
                                    <h3 className="mb-2 flex items-center justify-between font-semibold">
                                        <span className="flex items-center gap-2">
                                            <Wrench className="size-4" />
                                            Lista para entregar
                                        </span>
                                        <Badge variant="secondary">
                                            {selectedTools.length} ítems
                                        </Badge>
                                    </h3>
                                    {selectedTools.length === 0 ? (
                                        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                            Agrega herramientas desde el
                                            catálogo o utiliza el escáner.
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedTools.map(
                                                (tool, index) => (
                                                    <div
                                                        key={`${tool.herramienta_id}-${tool.unidad_herramienta_id}`}
                                                        className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 text-sm"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <Wrench className="size-4 text-primary" />
                                                            {tool.label}
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                removeTool(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="size-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                                {form.errors.herramientas && (
                                    <p className="text-sm text-destructive">
                                        {form.errors.herramientas}
                                    </p>
                                )}
                                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
                                    <AlertCircle className="mr-2 inline size-4" />
                                    La disponibilidad se valida nuevamente en el
                                    servidor al confirmar.
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        form.processing ||
                                        !selectedStudent ||
                                        selectedTools.length === 0
                                    }
                                >
                                    <ShieldCheck className="mr-2 size-4" />
                                    {form.processing
                                        ? 'Guardando…'
                                        : 'Confirmar y entregar préstamo'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
            <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Escanear código de herramienta
                        </DialogTitle>
                        <DialogDescription>
                            Enfoca el código QR o código de barras de la unidad
                            física.
                        </DialogDescription>
                    </DialogHeader>
                    <div
                        id="prestamo-camera-reader"
                        className="overflow-hidden rounded-lg border bg-black p-2"
                    />
                    {cameraError && (
                        <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                            {cameraError}
                        </p>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
