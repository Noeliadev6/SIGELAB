import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { Form } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';

type RegistroEstudianteFormProps = {
    className?: string;
    onCancel: () => void;
    onSuccess?: () => void;
    materias?: { id: number; nombre: string; modulo: string | null; grupo: string | null }[];
};

export function RegistroEstudianteForm({ className, onCancel, onSuccess, materias = [] }: RegistroEstudianteFormProps) {
    return (
        <Form method="post" action="/admin/estudiantes" className={cn('grid min-w-0 gap-6', className)}
            options={{ preserveScroll: true, preserveState: true }} resetOnSuccess onSuccess={onSuccess}>
            {({ processing, errors }) => (
                <>
                    <div className="flex min-w-0 items-start gap-3 border-b pb-5">
                        <div className="shrink-0 rounded-lg bg-primary/10 p-2.5 text-primary"><UserPlus className="size-5" /></div>
                        <div className="min-w-0 break-words">
                            <h2 className="font-medium">Datos del estudiante</h2>
                            <p className="text-sm text-muted-foreground">El numero de registro puede quedar vacio; nombre y carrera son obligatorios.</p>
                        </div>
                    </div>
                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="numero_registro">Numero de registro</Label>
                        <Input id="numero_registro" name="numero_registro" autoFocus placeholder="Opcional" />
                        <p className="text-xs text-muted-foreground">Deja vacio si la persona no cuenta con un numero de registro.</p>
                        <InputError message={errors.numero_registro} />
                    </div>
                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="nombre">Nombre completo</Label><Input id="nombre" name="nombre" required />
                        <InputError message={errors.nombre} />
                    </div>
                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="carrera">Carrera</Label><Input id="carrera" name="carrera" required />
                        <InputError message={errors.carrera} />
                    </div>
                    <div className="grid min-w-0 gap-2">
                        <Label htmlFor="materia_id">Materia (opcional)</Label>
                        <select id="materia_id" name="materia_id" defaultValue="" className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                            <option value="">Sin materia por ahora</option>
                            {materias.map((materia) => <option key={materia.id} value={materia.id}>
                                {[materia.nombre, materia.modulo, materia.grupo ? 'Grupo ' + materia.grupo : null].filter(Boolean).join(' - ')}
                            </option>)}
                        </select>
                        <p className="text-xs text-muted-foreground">Puedes asociarlo despues desde la materia.</p>
                        <InputError message={errors.materia_id} />
                    </div>
                    <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={processing} onClick={onCancel}>Cancelar</Button>
                        <Button type="submit" className="w-full sm:w-auto" disabled={processing}>{processing && <Spinner />}{processing ? 'Registrando...' : 'Registrar estudiante'}</Button>
                    </div>
                </>
            )}
        </Form>
    );
}
