import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RegistroEstudianteForm } from '@/pages/admin/estudiantes/components/registro-estudiante-form';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function RegistroEstudianteDialog({ materias = [] }: { materias?: { id: number; nombre: string; modulo: string | null; grupo: string | null }[] }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSuccess = (): void => {
        setIsOpen(false);
        toast.success('Estudiante creado exitosamente.');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                    <UserPlus className="size-4" />
                    Registro manual
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] min-w-0 overflow-y-auto overscroll-contain p-4 sm:max-h-[calc(100dvh-2rem)] sm:max-w-2xl sm:p-6">
                <DialogHeader className="min-w-0 pr-6">
                    <DialogTitle className="break-words">Registro manual de estudiante</DialogTitle>
                    <DialogDescription className="break-words [overflow-wrap:anywhere]">
                        Registra individualmente los datos básicos de un estudiante.
                    </DialogDescription>
                </DialogHeader>

                <RegistroEstudianteForm materias={materias} onCancel={() => setIsOpen(false)} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    );
}
