import { EstudiantesMateriasTabs } from '@/components/estudiantes-materias-tabs';
import {
    ImportarEstudiantesForm,
    type MateriaOption,
} from '@/pages/admin/estudiantes/components/importar-estudiantes-form';
import { Head } from '@inertiajs/react';

type StudentImportProps = {
    materias?: MateriaOption[];
};

export default function StudentImport({ materias = [] }: StudentImportProps) {
    return (
        <>
            <Head title="Importación de estudiantes" />

            <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6">
                <EstudiantesMateriasTabs />

                <div className="min-w-0">
                    <h1 className="text-2xl font-semibold tracking-tight break-words">Importación de estudiantes</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Carga una planilla para registrar estudiantes de forma masiva.
                    </p>
                </div>

                <ImportarEstudiantesForm materias={materias} mostrarAccionVolver />
            </div>
        </>
    );
}

StudentImport.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Estudiantes', href: '/admin/estudiantes' },
        { title: 'Importar', href: '/admin/estudiantes/import' },
    ],
};
