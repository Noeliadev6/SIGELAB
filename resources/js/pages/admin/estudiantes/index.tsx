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
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImportarEstudiantesDialog } from '@/pages/admin/estudiantes/components/importar-estudiantes-dialog';
import type { MateriaOption } from '@/pages/admin/estudiantes/components/importar-estudiantes-form';
import { RegistroEstudianteDialog } from '@/pages/admin/estudiantes/components/registro-estudiante-dialog';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { PencilLine, Trash2, Users } from 'lucide-react';
import { type FormEvent, useState } from 'react';

type Estudiante = {
    id: number;
    numero_registro: string | null;
    nombre: string;
    carrera: string;
    created_at: string;
};

type Props = {
    estudiantes: {
        data: Estudiante[];
        current_page: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    materias?: MateriaOption[];
    puedeImportar?: boolean;
};

export default function EstudiantesIndex({ estudiantes, materias = [], puedeImportar = false }: Props) {
    const { auth } = usePage().props;
    const esAdministrador = auth.user?.rol?.nombre === 'administrador';
    const [estudianteEditando, setEstudianteEditando] = useState<Estudiante | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        numero_registro: '',
        nombre: '',
        carrera: '',
    });

    const openEditDialog = (estudiante: Estudiante): void => {
        setEstudianteEditando(estudiante);
        setData({
            numero_registro: estudiante.numero_registro ?? '',
            nombre: estudiante.nombre,
            carrera: estudiante.carrera,
        });
        clearErrors();
        setIsEditDialogOpen(true);
    };

    const closeEditDialog = (): void => {
        setIsEditDialogOpen(false);
        setEstudianteEditando(null);
        reset();
        clearErrors();
    };

    const submitEdit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (!estudianteEditando) {
            return;
        }

        put(`/admin/estudiantes/${estudianteEditando.id}`, {
            preserveScroll: true,
            onSuccess: () => closeEditDialog(),
        });
    };

    const [estudianteAEliminar, setEstudianteAEliminar] = useState<Estudiante | null>(null);
    const [eliminando, setEliminando] = useState(false);

    const confirmarEliminacion = (): void => {
        if (!estudianteAEliminar) {
            return;
        }

        setEliminando(true);
        router.delete(`/admin/estudiantes/${estudianteAEliminar.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setEliminando(false);
                setEstudianteAEliminar(null);
            },
        });
    };

    return (
        <>
            <Head title="Estudiantes" />

            <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6">
                <EstudiantesMateriasTabs />

                <div className="flex min-w-0 flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-semibold tracking-tight break-words">Estudiantes</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Consulta los estudiantes registrados e importa nuevas listas.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:flex-wrap lg:justify-end">
                        {puedeImportar && <ImportarEstudiantesDialog materias={materias} />}

                        {esAdministrador && <RegistroEstudianteDialog materias={materias} />}
                    </div>
                </div>

                <div className="min-w-0 overflow-hidden rounded-xl border bg-card shadow-xs">
                    <div className="max-w-full overflow-x-auto">
                        <Table className="min-w-[44rem]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Número de registro</TableHead>
                                    <TableHead>Carrera</TableHead>
                                    <TableHead>Fecha de registro</TableHead>
                                    {esAdministrador && <TableHead className="text-right">Acciones</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {estudiantes.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={esAdministrador ? 5 : 4} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="rounded-full bg-muted p-3">
                                                    <Users className="size-7 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-medium">No hay estudiantes registrados</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Importa una lista para comenzar a registrar estudiantes.
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    estudiantes.data.map((estudiante) => (
                                        <TableRow key={estudiante.id}>
                                            <TableCell className="max-w-64 whitespace-normal">
                                                <span className="block break-words [overflow-wrap:anywhere]">
                                                    {estudiante.nombre}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {estudiante.numero_registro ?? (
                                                    <span className="text-muted-foreground">Sin registro</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="max-w-64 whitespace-normal break-words [overflow-wrap:anywhere]">
                                                {estudiante.carrera}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap text-muted-foreground">
                                                {estudiante.created_at}
                                            </TableCell>
                                            {esAdministrador && (
                                                <TableCell className="whitespace-nowrap">
                                                    <div className="flex justify-end gap-2">
                                                        <Button type="button" variant="outline" size="sm" onClick={() => openEditDialog(estudiante)}>
                                                            <PencilLine className="size-3.5" />
                                                            Editar
                                                        </Button>
                                                        <Button type="button" variant="outline" size="sm" className="text-destructive" onClick={() => setEstudianteAEliminar(estudiante)}>
                                                            <Trash2 className="size-3.5" />
                                                            Eliminar
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {estudiantes.last_page > 1 && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {estudiantes.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={(open) => (!open ? closeEditDialog() : setIsEditDialogOpen(true))}>
                <DialogContent className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] min-w-0 overflow-y-auto overscroll-contain p-4 sm:max-w-xl sm:p-6">
                    <DialogHeader className="min-w-0 pr-6">
                        <DialogTitle className="break-words">Editar estudiante</DialogTitle>
                        <DialogDescription className="break-words [overflow-wrap:anywhere]">
                            Actualiza los datos básicos del estudiante.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-numero_registro">Número de registro</Label>
                            <Input
                                id="edit-numero_registro"
                                value={data.numero_registro}
                                onChange={(event) => setData('numero_registro', event.target.value)}
                                placeholder="Opcional"
                            />
                            <InputError message={errors.numero_registro} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-nombre">Nombre completo</Label>
                            <Input
                                id="edit-nombre"
                                value={data.nombre}
                                onChange={(event) => setData('nombre', event.target.value)}
                                required
                            />
                            <InputError message={errors.nombre} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-carrera">Carrera</Label>
                            <Input
                                id="edit-carrera"
                                value={data.carrera}
                                onChange={(event) => setData('carrera', event.target.value)}
                                required
                            />
                            <InputError message={errors.carrera} />
                        </div>

                        <DialogFooter className="border-t pt-4">
                            <Button type="button" variant="outline" onClick={closeEditDialog} disabled={processing}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={estudianteAEliminar !== null} onOpenChange={(isOpen) => { if (!isOpen) setEstudianteAEliminar(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar estudiante</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Eliminar a <span className="font-medium text-foreground">{estudianteAEliminar?.nombre}</span>?
                            Se quitará solo el registro del estudiante si no tiene materias asociadas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={eliminando}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmarEliminacion}
                            disabled={eliminando}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {eliminando ? 'Eliminando...' : 'Eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

EstudiantesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Estudiantes', href: '/admin/estudiantes' },
    ],
};
