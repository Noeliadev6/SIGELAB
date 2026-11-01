import { Head, Link, router } from '@inertiajs/react';
import {
    CalendarDays,
    Edit,
    Mail,
    Plus,
    PowerOff,
    ShieldCheck,
    UserCheck,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Rol = {
    id: number;
    nombre: string;
    nombre_mostrar: string;
};

type Usuario = {
    id: number;
    name: string;
    email: string;
    estado: boolean;
    rol: Rol | null;
    created_at: string;
};

type PaginatedUsuarios = {
    data: Usuario[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type Props = {
    usuarios: PaginatedUsuarios;
};

export default function UsuariosIndex({ usuarios }: Props) {
    const [usuarioSeleccionado, setUsuarioSeleccionado] =
        useState<Usuario | null>(null);

    const toggleEstado = (usuario: Usuario) => {
        if (usuario.estado) {
            if (
                confirm(
                    `¿Desactivar a "${usuario.name}"? No podrá acceder al sistema.`,
                )
            ) {
                router.delete(`/admin/usuarios/${usuario.id}`);
            }
        } else {
            router.patch(`/admin/usuarios/${usuario.id}`, {
                ...usuario,
                rol_id: usuario.rol?.id,
                estado: true,
            });
        }
    };

    return (
        <>
            <Head title="Usuarios" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Usuarios
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gestiona los usuarios del sistema y sus roles
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/usuarios/create">
                            <Plus className="mr-2 size-4" />
                            Nuevo usuario
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border bg-card shadow-xs">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Correo</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Registrado</TableHead>
                                <TableHead className="text-right">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usuarios.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        No hay usuarios registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                usuarios.data.map((usuario) => (
                                    <TableRow
                                        key={usuario.id}
                                        className="cursor-pointer"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                            setUsuarioSeleccionado(usuario)
                                        }
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === 'Enter' ||
                                                event.key === ' '
                                            ) {
                                                event.preventDefault();
                                                setUsuarioSeleccionado(usuario);
                                            }
                                        }}
                                        aria-label={`Ver detalles de ${usuario.name}`}
                                    >
                                        <TableCell className="font-medium">
                                            {usuario.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {usuario.email}
                                        </TableCell>
                                        <TableCell>
                                            {usuario.rol ? (
                                                <Badge variant="secondary">
                                                    {usuario.rol.nombre_mostrar}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    Sin rol
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    usuario.estado
                                                        ? 'default'
                                                        : 'destructive'
                                                }
                                            >
                                                {usuario.estado
                                                    ? 'Activo'
                                                    : 'Inactivo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {usuario.created_at}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(event) =>
                                                        event.stopPropagation()
                                                    }
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/admin/usuarios/${usuario.id}/edit`}
                                                    >
                                                        <Edit className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        toggleEstado(usuario);
                                                    }}
                                                    title={
                                                        usuario.estado
                                                            ? 'Desactivar'
                                                            : 'Activar'
                                                    }
                                                >
                                                    {usuario.estado ? (
                                                        <PowerOff className="size-4 text-destructive" />
                                                    ) : (
                                                        <UserCheck className="size-4 text-emerald-600" />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {usuarios.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {usuarios.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Dialog
                open={usuarioSeleccionado !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setUsuarioSeleccionado(null);
                    }
                }}
            >
                <DialogContent>
                    {usuarioSeleccionado && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Detalles del usuario</DialogTitle>
                                <DialogDescription>
                                    Consulta la información y el estado de la
                                    cuenta.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-start gap-3">
                                    <UserRound className="mt-0.5 size-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Nombre
                                        </p>
                                        <p className="font-medium">
                                            {usuarioSeleccionado.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 size-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Correo electrónico
                                        </p>
                                        <p className="font-medium break-all">
                                            {usuarioSeleccionado.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 size-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Rol
                                        </p>
                                        <p className="font-medium">
                                            {usuarioSeleccionado.rol
                                                ?.nombre_mostrar ?? 'Sin rol'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CalendarDays className="mt-0.5 size-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Registrado
                                        </p>
                                        <p className="font-medium">
                                            {usuarioSeleccionado.created_at}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border bg-muted/30 p-4">
                                <p className="mb-2 text-sm font-medium">
                                    Estado de la cuenta
                                </p>
                                <Badge
                                    variant={
                                        usuarioSeleccionado.estado
                                            ? 'default'
                                            : 'destructive'
                                    }
                                >
                                    {usuarioSeleccionado.estado
                                        ? 'Activo'
                                        : 'Inactivo'}
                                </Badge>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cerrar</Button>
                                </DialogClose>
                                <Button asChild>
                                    <Link
                                        href={`/admin/usuarios/${usuarioSeleccionado.id}/edit`}
                                    >
                                        <Edit className="mr-2 size-4" />
                                        Editar usuario
                                    </Link>
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

UsuariosIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Usuarios', href: '/admin/usuarios' },
    ],
};
