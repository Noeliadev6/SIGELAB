import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';

type Rol = {
    id: number;
    nombre: string;
    nombre_mostrar: string;
};

type Props = {
    roles: Rol[];
};

export default function UsuariosCreate({ roles }: Props) {
    return (
        <>
            <Head title="Nuevo usuario" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Nuevo usuario
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Completa los datos para crear un nuevo usuario del
                        sistema
                    </p>
                </div>

                <div className="mx-auto w-full max-w-lg">
                    <Form
                        method="post"
                        action="/admin/usuarios"
                        className="rounded-xl border bg-card p-6 shadow-xs"
                    >
                        {({ processing, errors }) => (
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">
                                        Nombre completo
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoFocus
                                        placeholder="Juan Pérez"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">
                                        Correo electrónico
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="correo@labmeca.local"
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        placeholder="Mínimo 8 caracteres"
                                        required
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirmar contraseña
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        placeholder="Repite la contraseña"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="rol_id">Rol</Label>
                                    <Select name="rol_id" required>
                                        <SelectTrigger id="rol_id">
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((rol) => (
                                                <SelectItem
                                                    key={rol.id}
                                                    value={String(rol.id)}
                                                >
                                                    {rol.nombre_mostrar}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.rol_id} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Switch
                                        id="estado"
                                        name="estado"
                                        defaultChecked
                                    />
                                    <Label htmlFor="estado">
                                        Cuenta activa
                                    </Label>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => history.back()}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        Crear usuario
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </>
    );
}

UsuariosCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Usuarios', href: '/admin/usuarios' },
        { title: 'Nuevo usuario', href: '/admin/usuarios/create' },
    ],
};
