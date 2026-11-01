import { Head, Link } from '@inertiajs/react';
import { Edit, ShieldCheck, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    usuarios_count: number;
    permisos: Permiso[];
};

type Props = {
    roles: Rol[];
};

const rolColors: Record<string, string> = {
    administrador: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
    docente: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    auxiliar: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
};

export default function RolesIndex({ roles }: Props) {
    return (
        <>
            <Head title="Roles y Permisos" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Roles y Permisos
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Configura qué puede hacer cada rol en el sistema
                        </p>
                    </div>
                    <ShieldCheck className="size-8 text-muted-foreground" />
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {roles.map((rol) => (
                        <article
                            key={rol.id}
                            className="flex flex-col rounded-xl border bg-card p-5 shadow-xs"
                        >
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div>
                                    <div
                                        className={`mb-2 inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${rolColors[rol.nombre] ?? 'bg-muted text-muted-foreground'}`}
                                    >
                                        {rol.nombre_mostrar}
                                    </div>
                                    {rol.descripcion && (
                                        <p className="text-sm text-muted-foreground">
                                            {rol.descripcion}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="shrink-0"
                                >
                                    <Link href={`/admin/roles/${rol.id}/edit`}>
                                        <Edit className="size-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="size-4" />
                                <span>
                                    {rol.usuarios_count}{' '}
                                    {rol.usuarios_count === 1
                                        ? 'usuario'
                                        : 'usuarios'}
                                </span>
                            </div>

                            <div className="mt-auto">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Permisos ({rol.permisos.length})
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {rol.permisos.slice(0, 8).map((permiso) => (
                                        <Badge
                                            key={permiso.id}
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {permiso.nombre_mostrar}
                                        </Badge>
                                    ))}
                                    {rol.permisos.length > 8 && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            +{rol.permisos.length - 8} más
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Roles y Permisos', href: '/admin/roles' },
    ],
};
