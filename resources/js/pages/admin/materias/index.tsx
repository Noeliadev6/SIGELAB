import { EstudiantesMateriasTabs } from '@/components/estudiantes-materias-tabs';
import InputError from '@/components/input-error';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, router, setLayoutProps, useForm, usePage } from '@inertiajs/react';
import { destroy as destroyMateria } from '@/routes/materias';
import { MateriaEstudiantesDialog, type MateriaEstudiante } from '@/pages/admin/materias/components/materia-estudiantes-dialog';
import type { MateriaOption } from '@/pages/admin/estudiantes/components/importar-estudiantes-form';
import { BookOpen, CalendarDays, LayoutGrid, List, Plus, Search, Users } from 'lucide-react';
import { type FormEvent, useMemo, useState } from 'react';

type Materia = {
    id: number;
    codigo: string;
    nombre: string;
    modulo: string | null;
    periodo: string | null;
    modulo_inicio: number | null;
    modulo_fin: number | null;
    grupo: string | null;
    hora_inicio: string | null;
    hora_fin: string | null;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    estado: string;
    estudiantes: MateriaEstudiante[];
};

type MateriasIndexProps = {
    materias?: Materia[];
    estudiantes?: MateriaEstudiante[];
};

type MateriaFormData = {
    codigo: string;
    nombre: string;
    modulo: string;
    periodo: string;
    modulo_inicio: string;
    modulo_fin: string;
    grupo: string;
    hora_inicio: string;
    hora_fin: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: '' | 'Activo' | 'Inactivo';
};

function formatDate(value: string | null): string {
    if (!value) {
        return 'Sin fecha';
    }

    const date = value.slice(0, 10).split('-');

    return date.length === 3 ? `${date[2]}/${date[1]}/${date[0]}` : value;
}

export default function MateriasIndex({ materias = [], estudiantes = [] }: MateriasIndexProps) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Materias', href: '/admin/materias' },
        ],
    });

    const { auth } = usePage().props;
    const esAdministrador = auth.user?.rol?.nombre === 'administrador';
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('todos');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<MateriaFormData>({
        codigo: '',
        nombre: '',
        modulo: '',
        periodo: '',
        modulo_inicio: '',
        modulo_fin: '',
        grupo: '',
        hora_inicio: '',
        hora_fin: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: '',
    });

    const openCreateDialog = (): void => {
        reset();
        clearErrors();
        setMateriaEditando(null);
        setIsCreateDialogOpen(true);
    };

    const [materiaEditando, setMateriaEditando] = useState<Materia | null>(null);
    const [materiaAEliminar, setMateriaAEliminar] = useState<Materia | null>(null);
    const [eliminando, setEliminando] = useState(false);
    const [errorEliminacion, setErrorEliminacion] = useState('');

    const deleteMateria = (materia: Materia): void => {
        setErrorEliminacion('');
        setMateriaAEliminar(materia);
    };

    const openEditDialog = (materia: Materia): void => {
        setMateriaEditando(materia);
        setData({
            codigo: materia.codigo,
            nombre: materia.nombre,
            modulo: materia.modulo ?? '',
            periodo: materia.periodo ?? '',
            modulo_inicio: materia.modulo_inicio?.toString() ?? '',
            modulo_fin: materia.modulo_fin?.toString() ?? '',
            grupo: materia.grupo ?? '',
            fecha_inicio: materia.fecha_inicio ?? '',
            fecha_fin: materia.fecha_fin ?? '',
            hora_inicio: materia.hora_inicio?.slice(0, 5) ?? '',
            hora_fin: materia.hora_fin?.slice(0, 5) ?? '',
            estado: materia.estado === 'Activo' ? 'Activo' : 'Inactivo',
        });
        clearErrors();
        setIsCreateDialogOpen(true);
    };

    const confirmarEliminacion = (): void => {
        if (!materiaAEliminar) {
            return;
        }

        setEliminando(true);
        router.delete(destroyMateria.url(materiaAEliminar.id), {
            preserveScroll: true,
            onSuccess: () => setMateriaAEliminar(null),
            onError: (errors) => setErrorEliminacion(errors.materia ?? ''),
            onFinish: () => setEliminando(false),
        });
    };

    const handleCreateDialogChange = (open: boolean): void => {
        if (processing) {
            return;
        }

        setIsCreateDialogOpen(open);

        if (!open) {
            reset();
            clearErrors();
        }
    };

    const submitMateria = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setMateriaEditando(null);
                setIsCreateDialogOpen(false);
            },
        };

        if (materiaEditando) {
            put('/admin/materias/' + materiaEditando.id, options);
        } else {
            post('/admin/materias', options);
        }
    };

    const statuses = useMemo(
        () =>
            Array.from(new Set(materias.map((materia) => materia.estado)))
                .filter((status) => status.trim() !== '')
                .sort((first, second) => first.localeCompare(second, 'es')),
        [materias]
    );

    const filteredMaterias = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLocaleLowerCase('es');

        return materias.filter((materia) => {
            const matchesStatus = selectedStatus === 'todos' || materia.estado === selectedStatus;
            const matchesSearch =
                normalizedQuery === '' ||
                [materia.codigo, materia.nombre, materia.modulo ?? '', materia.grupo ?? ''].some((value) =>
                    value.toLocaleLowerCase('es').includes(normalizedQuery)
                );

            return matchesStatus && matchesSearch;
        });
    }, [materias, searchQuery, selectedStatus]);

    return (
        <>
            <Head title="Materias" />

            <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6">
                <EstudiantesMateriasTabs />

                <div className="flex min-w-0 flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-semibold tracking-tight break-words">Materias</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Consulta la información académica disponible de las materias.
                        </p>
                    </div>

                    {esAdministrador && (
                        <Dialog open={isCreateDialogOpen} onOpenChange={handleCreateDialogChange}>
                            <Button type="button" onClick={openCreateDialog} className="w-full sm:w-auto">
                                <Plus className="size-4" />
                                Nueva materia
                            </Button>
                            <DialogContent className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] min-w-0 overflow-y-auto overscroll-contain p-4 sm:max-h-[calc(100dvh-2rem)] sm:max-w-2xl sm:p-6">
                                <DialogHeader className="min-w-0 pr-6">
                                    <DialogTitle className="break-words">{materiaEditando ? 'Editar materia' : 'Nueva materia'}</DialogTitle>
                                    <DialogDescription className="break-words [overflow-wrap:anywhere]">
                                        Completa la información académica de la materia.
                                    </DialogDescription>
                                </DialogHeader>

                                <form className="grid min-w-0 gap-5" onSubmit={submitMateria}>
                                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                                        <div className="grid min-w-0 gap-2">
                                            <Label htmlFor="materia-codigo">
                                                Código <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="materia-codigo"
                                                name="codigo"
                                                value={data.codigo}
                                                onChange={(event) => setData('codigo', event.target.value)}
                                                maxLength={30}
                                                aria-invalid={Boolean(errors.codigo)}
                                                required
                                                autoFocus
                                            />
                                            <InputError message={errors.codigo} className="break-words [overflow-wrap:anywhere]" />
                                        </div>

                                        <div className="grid min-w-0 gap-2 sm:col-span-2">
                                            <Label htmlFor="materia-nombre">
                                                Nombre <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="materia-nombre"
                                                name="nombre"
                                                value={data.nombre}
                                                onChange={(event) => setData('nombre', event.target.value)}
                                                maxLength={150}
                                                aria-invalid={Boolean(errors.nombre)}
                                                required
                                            />
                                            <InputError message={errors.nombre} className="break-words [overflow-wrap:anywhere]" />
                                        </div>

                                        <div className="grid min-w-0 gap-2">
                                            <Label htmlFor="materia-modulo">
                                                Módulo <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="materia-modulo"
                                                name="modulo"
                                                value={data.modulo}
                                                onChange={(event) => setData('modulo', event.target.value)}
                                                maxLength={30}
                                                aria-invalid={Boolean(errors.modulo)}
                                                required
                                            />
                                            <InputError message={errors.modulo} className="break-words [overflow-wrap:anywhere]" />
                                        </div>

                                        <div className="grid min-w-0 gap-2">
                                            <div className="grid min-w-0 gap-2 sm:col-span-2">
                                                <Label htmlFor="materia-periodo">Semestre</Label>
                                                <select id="materia-periodo" value={data.periodo} onChange={(event) => setData('periodo', event.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
                                                    <option value="">Selecciona el semestre</option>
                                                    <option value="Primer semestre">Primer semestre (enero-junio)</option>
                                                    <option value="Segundo semestre">Segundo semestre (julio-diciembre)</option>
                                                </select>
                                                <InputError message={errors.periodo} />
                                            </div>
                                            <div className="grid min-w-0 gap-2">
                                                <Label htmlFor="materia-modulo-inicio">Módulo inicial (0-5)</Label>
                                                <select id="materia-modulo-inicio" value={data.modulo_inicio} onChange={(event) => setData('modulo_inicio', event.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
                                                    <option value="">Selecciona</option>
                                                    {[0, 1, 2, 3, 4, 5].map((modulo) => <option key={modulo} value={modulo}>{modulo}</option>)}
                                                </select>
                                                <InputError message={errors.modulo_inicio} />
                                            </div>
                                            <div className="grid min-w-0 gap-2">
                                                <Label htmlFor="materia-modulo-fin">Módulo final (0-5)</Label>
                                                <select id="materia-modulo-fin" value={data.modulo_fin} onChange={(event) => setData('modulo_fin', event.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
                                                    <option value="">Selecciona</option>
                                                    {[0, 1, 2, 3, 4, 5].map((modulo) => <option key={modulo} value={modulo}>{modulo}</option>)}
                                                </select>
                                                <InputError message={errors.modulo_fin} />
                                            </div>
                                            <div className="grid min-w-0 gap-2">
                                                <Label htmlFor="materia-hora-inicio">Hora inicial</Label>
                                                <select id="materia-hora-inicio" value={data.hora_inicio} onChange={(event) => setData('hora_inicio', event.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
                                                    <option value="">Selecciona</option>
                                                    {['07:15', '10:15', '13:15', '16:15', '19:15'].map((hora) => <option key={hora} value={hora}>{hora}</option>)}
                                                </select>
                                                <InputError message={errors.hora_inicio} />
                                            </div>
                                            <div className="grid min-w-0 gap-2">
                                                <Label htmlFor="materia-hora-fin">Hora final</Label>
                                                <select id="materia-hora-fin" value={data.hora_fin} onChange={(event) => setData('hora_fin', event.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
                                                    <option value="">Selecciona</option>
                                                    {['10:15', '13:15', '16:15', '19:15', '21:45'].map((hora) => <option key={hora} value={hora}>{hora}</option>)}
                                                </select>
                                                <InputError message={errors.hora_fin} />
                                            </div>
                                            <Label htmlFor="materia-grupo">
                                                Grupo <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="materia-grupo"
                                                name="grupo"
                                                value={data.grupo}
                                                onChange={(event) => setData('grupo', event.target.value)}
                                                maxLength={20}
                                                aria-invalid={Boolean(errors.grupo)}
                                                required
                                            />
                                            <InputError message={errors.grupo} className="break-words [overflow-wrap:anywhere]" />
                                        </div>

                                        <div className="grid min-w-0 gap-2">
                                            <Label htmlFor="materia-fecha-inicio">
                                                Fecha de inicio <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="materia-fecha-inicio"
                                                name="fecha_inicio"
                                                type="date"
                                                value={data.fecha_inicio}
                                                onChange={(event) => setData('fecha_inicio', event.target.value)}
                                                aria-invalid={Boolean(errors.fecha_inicio)}
                                                required
                                            />
                                            <InputError message={errors.fecha_inicio} className="break-words [overflow-wrap:anywhere]" />
                                        </div>

                                        <div className="grid min-w-0 gap-2">
                                            <Label htmlFor="materia-fecha-fin">
                                                Fecha de fin <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="materia-fecha-fin"
                                                name="fecha_fin"
                                                type="date"
                                                value={data.fecha_fin}
                                                onChange={(event) => setData('fecha_fin', event.target.value)}
                                                aria-invalid={Boolean(errors.fecha_fin)}
                                                required
                                            />
                                            <InputError message={errors.fecha_fin} className="break-words [overflow-wrap:anywhere]" />
                                        </div>

                                        <div className="grid min-w-0 gap-2 sm:col-span-2">
                                            <Label htmlFor="materia-estado">
                                                Estado <span className="text-destructive">*</span>
                                            </Label>
                                            <Select
                                                value={data.estado}
                                                onValueChange={(value) => {
                                                    if (value === 'Activo' || value === 'Inactivo') {
                                                        setData('estado', value);
                                                    }
                                                }}
                                                disabled={processing}
                                                required
                                            >
                                                <SelectTrigger
                                                    id="materia-estado"
                                                    className="w-full"
                                                    aria-invalid={Boolean(errors.estado)}
                                                >
                                                    <SelectValue placeholder="Selecciona un estado" />
                                                </SelectTrigger>
                                                <SelectContent className="max-w-[calc(100vw-2rem)]">
                                                    <SelectItem value="Activo">Activo</SelectItem>
                                                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.estado} className="break-words [overflow-wrap:anywhere]" />
                                        </div>
                                    </div>

                                    <DialogFooter className="border-t pt-5">
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full sm:w-auto"
                                                disabled={processing}
                                            >
                                                Cancelar
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto"
                                            disabled={processing || !esAdministrador}
                                        >
                                            {processing && <Spinner />}
                                            {processing ? (materiaEditando ? 'Actualizando...' : 'Guardando...') : (materiaEditando ? 'Actualizar materia' : 'Guardar materia')}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <Card className="min-w-0">
                    <CardHeader className="min-w-0 px-4 sm:px-6">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                            <div className="min-w-0">
                                <CardTitle>Explorar materias</CardTitle>
                                <CardDescription className="mt-1">
                                    Busca por código, nombre, módulo o grupo y filtra por estado.
                                </CardDescription>
                            </div>

                            <div className="flex w-full self-start rounded-lg border bg-muted/40 p-1 sm:w-auto">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    aria-pressed={viewMode === 'grid'}
                                    onClick={() => setViewMode('grid')}
                                    className="min-w-0 flex-1 sm:flex-none"
                                >
                                    <LayoutGrid className="size-4" />
                                    Grid
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    aria-pressed={viewMode === 'list'}
                                    onClick={() => setViewMode('list')}
                                    className="min-w-0 flex-1 sm:flex-none"
                                >
                                    <List className="size-4" />
                                    Lista
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid min-w-0 gap-4 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(12rem,0.35fr)]">
                        <div className="grid min-w-0 gap-2">
                            <Label htmlFor="materia-search">Buscar</Label>
                            <div className="relative min-w-0">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="materia-search"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Código, nombre, módulo o grupo"
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="grid min-w-0 gap-2">
                            <Label htmlFor="materia-status">Estado</Label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger id="materia-status" className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-w-[calc(100vw-2rem)]">
                                    <SelectItem value="todos">Todos los estados</SelectItem>
                                    {statuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        Mostrando <span className="font-medium text-foreground">{filteredMaterias.length}</span> de{' '}
                        <span className="font-medium text-foreground">{materias.length}</span> materias
                    </p>
                    {(searchQuery || selectedStatus !== 'todos') && materias.length > 0 && (
                        <p>Resultados según la búsqueda y el estado seleccionados.</p>
                    )}
                </div>

                {materias.length === 0 ? (
                    <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border bg-card p-6 text-center shadow-xs">
                        <div className="rounded-full bg-muted p-4">
                            <BookOpen className="size-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium">No hay materias disponibles</p>
                            <p className="max-w-md text-sm text-muted-foreground">
                                La pantalla mostrará las materias cuando esta información sea enviada por el servidor.
                            </p>
                        </div>
                    </div>
                ) : filteredMaterias.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border bg-card p-6 text-center shadow-xs">
                        <Search className="size-8 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="font-medium">No se encontraron coincidencias</p>
                            <p className="text-sm text-muted-foreground">
                                Ajusta la búsqueda o selecciona otro estado.
                            </p>
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredMaterias.map((materia) => (
                            <Card key={materia.id} className="min-w-0 overflow-hidden">
                                <CardHeader className="min-w-0 px-4 sm:px-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <CardTitle className="break-words text-lg [overflow-wrap:anywhere]">
                                                {materia.nombre}
                                            </CardTitle>
                                            <CardDescription className="mt-1 break-words font-mono [overflow-wrap:anywhere]">
                                                {materia.codigo}
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            variant={materia.estado === 'Activo' ? 'default' : 'secondary'}
                                            className="shrink-0"
                                        >
                                            {materia.estado}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex min-w-0 flex-1 flex-col gap-4 px-4 sm:px-6">
                                    <dl className="grid min-w-0 grid-cols-1 gap-3 text-sm min-[400px]:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2">
                                        <div className="min-w-0">
                                            <dt className="text-muted-foreground">Módulo</dt>
                                            <dd className="mt-1 break-words font-medium [overflow-wrap:anywhere]">
                                                {materia.modulo ?? 'No especificado'}
                                            </dd>
                                        </div>
                                        <div className="min-w-0">
                                            <dt className="text-muted-foreground">Grupo</dt>
                                            <dd className="mt-1 break-words font-medium [overflow-wrap:anywhere]">
                                                {materia.grupo ?? 'No especificado'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">Fecha de inicio</dt>
                                            <dd className="mt-1 font-medium">{formatDate(materia.fecha_inicio)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground">Fecha de fin</dt>
                                            <dd className="mt-1 font-medium">{formatDate(materia.fecha_fin)}</dd>
                                        </div>
                                    </dl>

                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <Button type="button" variant="outline" className="w-full" onClick={() => openEditDialog(materia)}>
                                            Editar
                                        </Button>
                                        <Button type="button" variant="outline" className="w-full text-destructive" onClick={() => deleteMateria(materia)}>
                                            Eliminar
                                        </Button>
                                    </div>
                                    <MateriaEstudiantesDialog
                                        materia={materia}
                                        estudiantes={materia.estudiantes}
                                        todosLosEstudiantes={estudiantes}
                                        materias={materias.map((item): MateriaOption => ({ id: item.id, nombre: item.nombre, modulo: item.modulo, grupo: item.grupo }))}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="min-w-0 overflow-hidden rounded-xl border bg-card shadow-xs">
                        <div className="max-w-full overflow-x-auto">
                            <Table className="min-w-[64rem]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Módulo</TableHead>
                                        <TableHead>Grupo</TableHead>
                                        <TableHead>Fecha de inicio</TableHead>
                                        <TableHead>Fecha de fin</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acción</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMaterias.map((materia) => (
                                        <TableRow key={materia.id}>
                                            <TableCell className="max-w-48 whitespace-normal break-words font-mono font-medium [overflow-wrap:anywhere]">
                                                {materia.codigo}
                                            </TableCell>
                                            <TableCell className="max-w-64 whitespace-normal break-words font-medium [overflow-wrap:anywhere]">
                                                {materia.nombre}
                                            </TableCell>
                                            <TableCell className="max-w-48 whitespace-normal break-words [overflow-wrap:anywhere]">
                                                {materia.modulo ?? 'No especificado'}
                                            </TableCell>
                                            <TableCell className="max-w-40 whitespace-normal break-words [overflow-wrap:anywhere]">
                                                {materia.grupo ?? 'No especificado'}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                                    <CalendarDays className="size-3.5 text-muted-foreground" />
                                                    {formatDate(materia.fecha_inicio)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                                    <CalendarDays className="size-3.5 text-muted-foreground" />
                                                    {formatDate(materia.fecha_fin)}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={materia.estado === 'Activo' ? 'default' : 'secondary'}>
                                                    {materia.estado}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col gap-2 sm:flex-row">
                                                    <Button type="button" variant="outline" className="w-full" onClick={() => openEditDialog(materia)}>
                                                        Editar
                                                    </Button>
                                                    <Button type="button" variant="outline" className="w-full text-destructive" onClick={() => deleteMateria(materia)}>
                                                        Eliminar
                                                    </Button>
                                                </div>
                                                <MateriaEstudiantesDialog
                                                    materia={materia}
                                                    estudiantes={materia.estudiantes}
                                                    todosLosEstudiantes={estudiantes}
                                                    materias={materias.map((item): MateriaOption => ({ id: item.id, nombre: item.nombre, modulo: item.modulo, grupo: item.grupo }))}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </div>

            <AlertDialog
                open={materiaAEliminar !== null}
                onOpenChange={(isOpen) => {
                    if (!isOpen && !eliminando) setMateriaAEliminar(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar materia</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Eliminar la materia{' '}
                            <span className="font-medium text-foreground">
                                {materiaAEliminar?.nombre}
                            </span>
                            ? Solo se permitirá si no tiene estudiantes inscritos ni préstamos asociados.
                        </AlertDialogDescription>
                        <InputError message={errorEliminacion} className="break-words [overflow-wrap:anywhere]" />
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={eliminando}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                confirmarEliminacion();
                            }}
                            disabled={eliminando}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {eliminando ? 'Eliminando...' : 'Eliminar materia'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
