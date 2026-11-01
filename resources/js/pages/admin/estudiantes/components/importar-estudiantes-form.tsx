import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { store as importPlanilla } from '@/routes/estudiantes/import';
import { Form, Link, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, CheckCircle2, FileSpreadsheet, Info, UploadCloud, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';

export type MateriaOption = {
    id: number;
    nombre: string;
    modulo: string | null;
    grupo: string | null;
};

export type ImportResult = {
    created: number;
    updated: number;
    errors: Array<{
        row: number;
        message: string;
    }>;
};

type ImportarEstudiantesFormProps = {
    materias?: MateriaOption[];
    defaultMateriaId?: number;
    mostrarAccionVolver?: boolean;
    onSuccess?: () => void;
};

type PageProps = {
    flash: {
        importResult?: ImportResult;
    };
    errors: Record<string, string> & {
        planilla?: string;
        materia_id?: string;
    };
};

export function ImportarEstudiantesForm({
    materias = [],
    defaultMateriaId,
    mostrarAccionVolver = false,
    onSuccess,
}: ImportarEstudiantesFormProps) {
    const { flash, errors } = usePage<PageProps>().props;
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(defaultMateriaId ? String(defaultMateriaId) : '');
    const [archivoXlsxSeleccionado, setArchivoXlsxSeleccionado] = useState(false);
    const result = flash?.importResult;
    const generalErrors = Object.entries(errors ?? {}).filter(
        ([field]) => field !== 'planilla' && field !== 'materia_id'
    );
    const tieneMaterias = materias.length > 0;
    const materiaActual = materias.find((materia) => String(materia.id) === materiaSeleccionada);

    return (
        <div className="grid min-w-0 gap-6">
            {!tieneMaterias && (
                <Alert className="border-amber-500/50 bg-amber-500/10 text-amber-950 dark:text-amber-100">
                    <Info />
                    <AlertTitle>Información de materias pendiente</AlertTitle>
                    <AlertDescription className="break-words text-amber-900/80 [overflow-wrap:anywhere] dark:text-amber-100/80">
                        Para completar la importación falta información del servidor: no se recibieron materias
                        disponibles.
                    </AlertDescription>
                </Alert>
            )}

            {generalErrors.length > 0 && (
                <Alert variant="destructive">
                    <AlertCircle />
                    <AlertTitle>No se pudo completar la solicitud</AlertTitle>
                    <AlertDescription className="break-words [overflow-wrap:anywhere]">
                        {generalErrors.map(([field, message]) => (
                            <p key={field}>{message}</p>
                        ))}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <Card className="min-w-0">
                    <CardHeader className="min-w-0 px-4 sm:px-6">
                        <CardTitle className="flex min-w-0 items-center gap-2 break-words">
                            <FileSpreadsheet className="size-5 shrink-0" />
                            Requisitos del archivo
                        </CardTitle>
                        <CardDescription>Prepara la planilla antes de seleccionarla.</CardDescription>
                    </CardHeader>
                    <CardContent className="min-w-0 px-4 sm:px-6">
                        <ul className="grid gap-3 text-sm">
                            <li className="flex gap-3">
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                                <span className="min-w-0 break-words">Solo archivos XLSX, con un tamaño máximo de 10 MB.</span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                                <span className="min-w-0 break-words">Las columnas Nombre y Carrera son obligatorias.</span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                                <span className="min-w-0 break-words">La columna Número de registro es opcional.</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="min-w-0">
                    <CardHeader className="min-w-0 px-4 sm:px-6">
                        <CardTitle className="flex min-w-0 items-center gap-2 break-words">
                            <UploadCloud className="size-5 shrink-0" />
                            Carga de XLSX
                        </CardTitle>
                        <CardDescription>
                            Si el número ya existe, sus datos se actualizan sin crear un duplicado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="min-w-0 px-4 sm:px-6">
                        <Form
                            {...importPlanilla.form()}
                            encType="multipart/form-data"
                            className="grid min-w-0 gap-5"
                            options={{ preserveScroll: true, preserveState: true }}
                            onSuccess={onSuccess}
                        >
                            {({ processing, progress }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="materia_id">Materia</Label>
                                        <input type="hidden" name="materia_id" value={materiaSeleccionada} />
                                        <Select
                                            value={materiaSeleccionada}
                                            onValueChange={setMateriaSeleccionada}
                                            disabled={!tieneMaterias || processing}
                                        >
                                            <SelectTrigger
                                                id="materia_id"
                                                className="w-full min-w-0 [&>span]:truncate"
                                                aria-invalid={Boolean(errors.materia_id)}
                                            >
                                                <SelectValue
                                                    placeholder={
                                                        tieneMaterias
                                                            ? 'Selecciona una materia'
                                                            : 'No hay materias disponibles'
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent className="max-w-[calc(100vw-2rem)]">
                                                {materias.map((materia) => (
                                                    <SelectItem key={materia.id} value={String(materia.id)}>
                                                        {[
                                                            materia.nombre,
                                                            materia.modulo,
                                                            materia.grupo ? `Grupo ${materia.grupo}` : null,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(' · ')}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {materiaActual && (
                                            <div className="min-w-0 rounded-lg border bg-muted/40 p-3">
                                                <p className="break-words text-sm font-medium [overflow-wrap:anywhere]">
                                                    {materiaActual.nombre}
                                                </p>
                                                {(materiaActual.modulo || materiaActual.grupo) && (
                                                    <p className="mt-1 break-words text-xs text-muted-foreground [overflow-wrap:anywhere]">
                                                        {[
                                                            materiaActual.modulo,
                                                            materiaActual.grupo ? `Grupo ${materiaActual.grupo}` : null,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(' · ')}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        {errors.materia_id && (
                                            <p className="break-words text-sm text-destructive [overflow-wrap:anywhere]">
                                                {errors.materia_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="planilla">Archivo Excel (.xlsx)</Label>
                                        <Input
                                            id="planilla"
                                            name="planilla"
                                            type="file"
                                            accept=".xlsx"
                                            required
                                            disabled={!tieneMaterias || processing}
                                            onChange={(event) => {
                                                const file = event.currentTarget.files?.[0];
                                                setArchivoXlsxSeleccionado(
                                                    file?.name.toLowerCase().endsWith('.xlsx') ?? false
                                                );
                                            }}
                                        />
                                        <p className="text-xs text-muted-foreground">Tamaño máximo: 10 MB.</p>
                                        {errors.planilla && (
                                            <p className="break-words text-sm text-destructive [overflow-wrap:anywhere]">
                                                {errors.planilla}
                                            </p>
                                        )}
                                    </div>

                                    {progress && (
                                        <div className="grid gap-2">
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Progreso de carga</span>
                                                <span>{progress.percentage}%</span>
                                            </div>
                                            <progress
                                                className="h-2 w-full overflow-hidden rounded-full"
                                                value={progress.percentage}
                                                max="100"
                                            />
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={
                                            processing ||
                                            !tieneMaterias ||
                                            !materiaSeleccionada ||
                                            !archivoXlsxSeleccionado
                                        }
                                            className="w-full min-w-0 sm:w-auto sm:justify-self-end"
                                    >
                                        <UploadCloud className="size-4" />
                                        {processing ? (
                                            <>
                                                <Spinner />
                                                Procesando...
                                            </>
                                        ) : (
                                            'Importar estudiantes'
                                        )}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>

            {result && (
                <Card className="min-w-0">
                    <CardHeader className="min-w-0 px-4 sm:px-6">
                        <div className="flex min-w-0 flex-col justify-between gap-4 md:flex-row md:items-start">
                            <div className="min-w-0">
                                <CardTitle className="break-words">Resultados de la importación</CardTitle>
                                <CardDescription className="mt-1">
                                    Resumen de la última planilla procesada.
                                </CardDescription>
                            </div>
                            {mostrarAccionVolver && (
                                <Button variant="outline" asChild className="w-full sm:w-auto">
                                    <Link href="/admin/estudiantes">
                                        <ArrowLeft className="size-4" />
                                        Volver al listado
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="grid min-w-0 gap-5 px-4 sm:px-6">
                        <div className="grid min-w-0 gap-3 md:grid-cols-3">
                            <div className="min-w-0 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    <UserPlus className="size-4" />
                                    Estudiantes creados
                                </div>
                                <p className="mt-3 text-3xl font-semibold text-emerald-700 dark:text-emerald-300">
                                    {result.created}
                                </p>
                            </div>

                            <div className="min-w-0 rounded-xl border border-primary/30 bg-primary/10 p-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                    <Users className="size-4" />
                                    Estudiantes actualizados
                                </div>
                                <p className="mt-3 text-3xl font-semibold text-primary">{result.updated}</p>
                            </div>

                            <div className="min-w-0 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                                    <AlertCircle className="size-4" />
                                    Total de errores
                                </div>
                                <p className="mt-3 text-3xl font-semibold text-destructive">{result.errors.length}</p>
                            </div>
                        </div>

                        {result.errors.length === 0 ? (
                            <Alert className="border-emerald-500/50 bg-emerald-500/10">
                                <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />
                                <AlertTitle>Importación finalizada correctamente</AlertTitle>
                                <AlertDescription className="break-words">
                                    Todas las filas fueron procesadas sin errores.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <>
                                <Alert className="border-amber-500/50 bg-amber-500/10 text-amber-950 dark:text-amber-100">
                                    <Info />
                                    <AlertTitle>Importación finalizada con observaciones</AlertTitle>
                                    <AlertDescription className="break-words text-amber-900/80 [overflow-wrap:anywhere] dark:text-amber-100/80">
                                        Algunas filas no pudieron importarse. Las demás pudieron procesarse
                                        correctamente.
                                    </AlertDescription>
                                </Alert>

                                <div className="min-w-0 overflow-hidden rounded-xl border border-destructive/30 bg-destructive/5">
                                    <div className="flex items-center gap-2 border-b border-destructive/20 px-4 py-3 font-medium text-destructive">
                                        <AlertCircle className="size-4" />
                                        Detalle de errores
                                    </div>
                                    <ul className="divide-y divide-destructive/15">
                                        {result.errors.map((error, index) => (
                                            <li
                                                key={`${error.row}-${index}`}
                                                className="grid gap-1 px-4 py-3 sm:grid-cols-[6rem_1fr] sm:gap-4"
                                            >
                                                <span className="text-sm font-semibold text-destructive">
                                                    Fila {error.row}
                                                </span>
                                                <span className="min-w-0 break-words text-sm text-foreground [overflow-wrap:anywhere]">
                                                    {error.message}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
