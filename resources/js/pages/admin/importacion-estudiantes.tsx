import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileSpreadsheet, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ImportacionEstudiantes() {
    return (
        <>
            <Head title="Importación de estudiantes" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/admin/dashboard" aria-label="Volver al dashboard">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Gestión académica
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Importación de estudiantes
                        </h1>
                    </div>
                </div>

                <section className="max-w-3xl rounded-xl border bg-card p-6 shadow-xs">
                    <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600">
                            <FileSpreadsheet className="size-6" />
                        </div>
                        <div>
                            <h2 className="font-semibold">Carga de estudiantes</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Selecciona un archivo para preparar la importación de estudiantes.
                            </p>
                        </div>
                    </div>

                    <label className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center transition-colors hover:border-primary hover:bg-muted/40">
                        <Upload className="size-8 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            Seleccionar archivo
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Formatos permitidos: XLSX o CSV
                        </span>
                        <input type="file" accept=".xlsx,.csv" className="sr-only" />
                    </label>
                </section>
            </div>
        </>
    );
}

ImportacionEstudiantes.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        {
            title: 'Importación de estudiantes',
            href: '/admin/importacion-estudiantes',
        },
    ],
};
