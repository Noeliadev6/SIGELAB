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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ImportarEstudiantesDialog } from '@/pages/admin/estudiantes/components/importar-estudiantes-dialog';
import type { MateriaOption } from '@/pages/admin/estudiantes/components/importar-estudiantes-form';
import { router } from '@inertiajs/react';
import { Search, Trash2, UserPlus, Users } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

export type MateriaEstudiante = { id: number; numero_registro: string | null; nombre: string; carrera: string };
type Props = {
    materia: { id: number; nombre: string; modulo: string | null; grupo: string | null };
    estudiantes: MateriaEstudiante[];
    todosLosEstudiantes: MateriaEstudiante[];
    materias: MateriaOption[];
};

export function MateriaEstudiantesDialog({ materia, estudiantes, todosLosEstudiantes, materias }: Props) {
    const [open, setOpen] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [estudianteARetirar, setEstudianteARetirar] = useState<MateriaEstudiante | null>(null);
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const disponibles = useMemo(
        () => todosLosEstudiantes.filter((e) => !estudiantes.some((a) => a.id === e.id)),
        [estudiantes, todosLosEstudiantes],
    );

    const resultadosBusqueda = useMemo(() => {
        const query = busqueda.trim().toLocaleLowerCase('es');
        if (query === '') {
            return [];
        }

        return disponibles.filter(
            (e) =>
                e.nombre.toLocaleLowerCase('es').includes(query) ||
                (e.numero_registro ?? '').toLocaleLowerCase('es').includes(query) ||
                e.carrera.toLocaleLowerCase('es').includes(query),
        ).slice(0, 8);
    }, [disponibles, busqueda]);

    const agregar = (estudiante: MateriaEstudiante): void => {
        setProcesando(true);
        setError('');

        router.post(
            '/admin/materias/' + materia.id + '/estudiantes',
            { estudiante_id: estudiante.id },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setBusqueda('');
                    inputRef.current?.focus();
                },
                onError: (errors) => {
                    setError(errors.estudiante ?? errors.estudiante_id ?? errors.materia ?? 'Error al agregar estudiante.');
                },
                onFinish: () => setProcesando(false),
            },
        );
    };

    const confirmarRetiro = (): void => {
        if (!estudianteARetirar) {
            return;
        }

        setProcesando(true);
        router.delete('/admin/materias/' + materia.id + '/estudiantes/' + estudianteARetirar.id, {
            preserveScroll: true,
            onFinish: () => {
                setProcesando(false);
                setEstudianteARetirar(null);
            },
        });
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <Users className="size-4" /> Ver estudiantes ({estudiantes.length})
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{materia.nombre}</DialogTitle>
                        <DialogDescription>
                            Estudiantes inscritos. Puedes agregar o retirar matrículas sin eliminar estudiantes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="max-h-64 overflow-y-auto rounded-lg border">
                            {estudiantes.length === 0 ? (
                                <p className="p-6 text-center text-sm text-muted-foreground">No hay estudiantes inscritos.</p>
                            ) : (
                                <ul className="divide-y">
                                    {estudiantes.map((estudiante) => (
                                        <li key={estudiante.id} className="flex items-center justify-between gap-3 p-3">
                                            <div className="min-w-0">
                                                <p className="font-medium">{estudiante.nombre}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {estudiante.numero_registro ?? 'Externo'} - {estudiante.carrera}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                title="Retirar de la materia"
                                                aria-label={'Retirar a ' + estudiante.nombre}
                                                disabled={procesando}
                                                onClick={() => setEstudianteARetirar(estudiante)}
                                            >
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="rounded-lg border p-4">
                            <p className="mb-2 text-sm font-medium">Agregar estudiante</p>
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    ref={inputRef}
                                    value={busqueda}
                                    onChange={(event) => { setBusqueda(event.target.value); setError(''); }}
                                    placeholder="Buscar por nombre, registro o carrera..."
                                    className="pl-9"
                                    disabled={procesando}
                                />
                            </div>
                            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
                            {busqueda.trim() !== '' && (
                                <div className="mt-2 max-h-48 overflow-y-auto rounded-md border">
                                    {resultadosBusqueda.length === 0 ? (
                                        <p className="p-3 text-center text-sm text-muted-foreground">
                                            No se encontraron estudiantes disponibles.
                                        </p>
                                    ) : (
                                        <ul className="divide-y">
                                            {resultadosBusqueda.map((estudiante) => (
                                                <li key={estudiante.id}>
                                                    <button
                                                        type="button"
                                                        disabled={procesando}
                                                        onClick={() => agregar(estudiante)}
                                                        className="flex w-full items-center justify-between gap-3 p-3 text-left transition-colors hover:bg-accent disabled:opacity-50"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium">{estudiante.nombre}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {estudiante.numero_registro ?? 'Externo'} - {estudiante.carrera}
                                                            </p>
                                                        </div>
                                                        <UserPlus className="size-4 shrink-0 text-muted-foreground" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                            {busqueda.trim() === '' && disponibles.length > 0 && (
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {disponibles.length} estudiante{disponibles.length !== 1 ? 's' : ''} disponible{disponibles.length !== 1 ? 's' : ''} para agregar.
                                </p>
                            )}
                        </div>

                        <ImportarEstudiantesDialog materias={materias} defaultMateriaId={materia.id} />
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={estudianteARetirar !== null} onOpenChange={(isOpen) => { if (!isOpen) setEstudianteARetirar(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Retirar estudiante</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Retirar a <span className="font-medium text-foreground">{estudianteARetirar?.nombre}</span> de esta materia?
                            El estudiante no será eliminado del sistema, solo se retirará su matrícula.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={procesando}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmarRetiro}
                            disabled={procesando}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {procesando ? 'Retirando...' : 'Retirar estudiante'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
