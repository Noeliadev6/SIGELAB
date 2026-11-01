import { RegistroEstudianteForm } from '@/pages/admin/estudiantes/components/registro-estudiante-form';
import { Head } from '@inertiajs/react';

export default function EstudiantesCreate() {
    return (
        <>
            <Head title="Registro manual de estudiante" />

            <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="min-w-0">
                    <h1 className="text-2xl font-semibold tracking-tight break-words">Registro manual</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Registra individualmente los datos básicos de un estudiante.
                    </p>
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <RegistroEstudianteForm
                        className="rounded-xl border bg-card p-4 shadow-xs sm:p-6"
                        onCancel={() => history.back()}
                    />
                </div>
            </div>
        </>
    );
}

EstudiantesCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Estudiantes', href: '/admin/estudiantes' },
        { title: 'Registro manual', href: '/admin/estudiantes/create' },
    ],
};
