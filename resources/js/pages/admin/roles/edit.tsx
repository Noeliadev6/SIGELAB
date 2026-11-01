import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

type Permiso = {
    id: number;
    nombre: string;
    nombre_mostrar: string;
};

type Rol = {
    id: number;
    nombre: string;
    nombre_mostrar: string;
    descripcion: string | null;
    permisos: number[];
};

type Props = {
    rol: Rol;
    todosLosPermisos: Permiso[];
};

/** Agrupa permisos por módulo (prefijo antes del punto) */
function agruparPermisos(permisos: Permiso[]): Record<string, Permiso[]> {
    return permisos.reduce(
        (grupos, permiso) => {
            const modulo = permiso.nombre.split('.')[0] ?? 'otros';
            if (!grupos[modulo]) {
                grupos[modulo] = [];
            }
            grupos[modulo].push(permiso);
            return grupos;
        },
        {} as Record<string, Permiso[]>,
    );
}

export default function RolesEdit({ rol, todosLosPermisos }: Props) {
    const [permisosSeleccionados, setPermisosSeleccionados] = useState<
        Set<number>
    >(new Set(rol.permisos));

    const togglePermiso = (id: number) => {
        setPermisosSeleccionados((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const toggleModulo = (permisos: Permiso[]) => {
        const ids = permisos.map((p) => p.id);
        const todosSeleccionados = ids.every((id) =>
            permisosSeleccionados.has(id),
        );
        setPermisosSeleccionados((prev) => {
            const next = new Set(prev);
            if (todosSeleccionados) {
                ids.forEach((id) => next.delete(id));
            } else {
                ids.forEach((id) => next.add(id));
            }
            return next;
        });
    };

    const grupos = agruparPermisos(todosLosPermisos);

    return (
        <>
            <Head title={`Editar rol – ${rol.nombre_mostrar}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Editar rol
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Configura los permisos del rol{' '}
                        <strong>{rol.nombre_mostrar}</strong>
                    </p>
                </div>

                <Form
                    method="patch"
                    action={`/admin/roles/${rol.id}`}
                    className="grid gap-6 lg:grid-cols-[300px_1fr]"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Datos del rol */}
                            <div className="flex flex-col gap-5">
                                <div className="rounded-xl border bg-card p-5 shadow-xs">
                                    <h2 className="mb-4 font-semibold">
                                        Información del rol
                                    </h2>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="nombre_mostrar">
                                                Nombre del rol
                                            </Label>
                                            <Input
                                                id="nombre_mostrar"
                                                name="nombre_mostrar"
                                                defaultValue={
                                                    rol.nombre_mostrar
                                                }
                                                required
                                            />
                                            <InputError
                                                message={
                                                    errors.nombre_mostrar
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="descripcion">
                                                Descripción
                                            </Label>
                                            <Textarea
                                                id="descripcion"
                                                name="descripcion"
                                                defaultValue={
                                                    rol.descripcion ?? ''
                                                }
                                                rows={3}
                                                placeholder="Describe qué puede hacer este rol..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => history.back()}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        Guardar
                                    </Button>
                                </div>
                            </div>

                            {/* Permisos agrupados */}
                            <div className="rounded-xl border bg-card p-5 shadow-xs">
                                <h2 className="mb-5 font-semibold">
                                    Permisos asignados (
                                    {permisosSeleccionados.size}/
                                    {todosLosPermisos.length})
                                </h2>

                                {/* Hidden inputs para enviar los permisos */}
                                {Array.from(permisosSeleccionados).map((id) => (
                                    <input
                                        key={id}
                                        type="hidden"
                                        name="permisos[]"
                                        value={id}
                                    />
                                ))}

                                <div className="grid gap-6 sm:grid-cols-2">
                                    {Object.entries(grupos).map(
                                        ([modulo, permisos]) => {
                                            const ids = permisos.map(
                                                (p) => p.id,
                                            );
                                            const todosActivos = ids.every(
                                                (id) =>
                                                    permisosSeleccionados.has(
                                                        id,
                                                    ),
                                            );
                                            const algunoActivo = ids.some(
                                                (id) =>
                                                    permisosSeleccionados.has(
                                                        id,
                                                    ),
                                            );

                                            return (
                                                <div
                                                    key={modulo}
                                                    className="rounded-lg border p-4"
                                                >
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <Checkbox
                                                            id={`modulo-${modulo}`}
                                                            checked={
                                                                todosActivos
                                                            }
                                                            data-state={
                                                                algunoActivo &&
                                                                !todosActivos
                                                                    ? 'indeterminate'
                                                                    : undefined
                                                            }
                                                            onCheckedChange={() =>
                                                                toggleModulo(
                                                                    permisos,
                                                                )
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={`modulo-${modulo}`}
                                                            className="cursor-pointer font-semibold capitalize"
                                                        >
                                                            {modulo}
                                                        </Label>
                                                    </div>
                                                    <div className="grid gap-2 pl-6">
                                                        {permisos.map(
                                                            (permiso) => (
                                                                <div
                                                                    key={
                                                                        permiso.id
                                                                    }
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <Checkbox
                                                                        id={`p-${permiso.id}`}
                                                                        checked={permisosSeleccionados.has(
                                                                            permiso.id,
                                                                        )}
                                                                        onCheckedChange={() =>
                                                                            togglePermiso(
                                                                                permiso.id,
                                                                            )
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`p-${permiso.id}`}
                                                                        className="cursor-pointer text-sm"
                                                                    >
                                                                        {
                                                                            permiso.nombre_mostrar
                                                                        }
                                                                    </Label>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

RolesEdit.layout = (props: {
    rol?: { nombre_mostrar: string; id: number };
}) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Roles y Permisos', href: '/admin/roles' },
        {
            title: props.rol?.nombre_mostrar ?? 'Editar',
            href: `/admin/roles/${props.rol?.id}/edit`,
        },
    ],
});
