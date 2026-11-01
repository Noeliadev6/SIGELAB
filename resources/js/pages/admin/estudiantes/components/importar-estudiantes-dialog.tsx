import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    ImportarEstudiantesForm,
    type ImportResult,
    type MateriaOption,
} from '@/pages/admin/estudiantes/components/importar-estudiantes-form';
import { usePage } from '@inertiajs/react';
import { Upload } from 'lucide-react';
import { useState } from 'react';

type ImportarEstudiantesDialogProps = {
    materias: MateriaOption[];
    defaultMateriaId?: number;
};

type PageProps = {
    flash: {
        importResult?: ImportResult;
    };
    errors: Record<string, string>;
};

export function ImportarEstudiantesDialog({ materias, defaultMateriaId }: ImportarEstudiantesDialogProps) {
    const { flash, errors } = usePage<PageProps>().props;
    const importErrors = errors ? Object.keys(errors).filter((key) => ['file', 'materia_id'].includes(key)) : [];
    const [isOpen, setIsOpen] = useState(Boolean(flash?.importResult || importErrors.length));

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" className="w-full sm:w-auto">
                    <Upload className="size-4" />
                    Importar estudiantes
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] min-w-0 overflow-y-auto overscroll-contain p-4 sm:max-h-[calc(100dvh-2rem)] sm:max-w-5xl sm:p-6">
                <DialogHeader className="min-w-0 pr-6">
                    <DialogTitle className="break-words">Importación de estudiantes</DialogTitle>
                    <DialogDescription className="break-words [overflow-wrap:anywhere]">
                        Selecciona una materia y carga una planilla XLSX para registrar estudiantes de forma masiva.
                    </DialogDescription>
                </DialogHeader>

                <ImportarEstudiantesForm materias={materias} defaultMateriaId={defaultMateriaId} onSuccess={() => setIsOpen(true)} />
            </DialogContent>
        </Dialog>
    );
}
