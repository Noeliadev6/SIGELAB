import { History, RefreshCw, Wrench } from 'lucide-react';
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
import type { ScannerResult } from './herramienta-scanner-dialog';

type HerramientaFichaDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    result: ScannerResult;
};

export function HerramientaFichaDialog({
    open,
    onOpenChange,
    result,
}: HerramientaFichaDialogProps) {
    const { item, unidad } = result;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
                            <Wrench className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <DialogTitle className="truncate">{item.nombre}</DialogTitle>
                            <DialogDescription>Ficha técnica de la unidad</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <dl className="grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 sm:p-5">
                    <FichaField label="Nombre" value={item.nombre} />
                    <FichaField label="Código del catálogo" value={item.codigo} mono />
                    <FichaField label="Modelo" value={item.modelo ?? 'No aplica'} />
                    <FichaField label="Categoría" value={item.categoria.nombre} />
                    <div className="grid gap-1">
                        <dt className="text-xs font-medium text-muted-foreground">Tipo</dt>
                        <dd>
                            <Badge variant="secondary">
                                {item.es_serializado ? 'Serializado' : 'Consumible'}
                            </Badge>
                        </dd>
                    </div>
                    <FichaField
                        label="Número de serie / código de identificación"
                        value={unidad.numero_serie_barras}
                        mono
                    />
                    <div className="grid gap-1">
                        <dt className="text-xs font-medium text-muted-foreground">Estado</dt>
                        <dd>
                            <Badge variant="outline">{unidad.estado}</Badge>
                        </dd>
                    </div>
                    <FichaField
                        label="Sublaboratorio actual"
                        value={unidad.sub_laboratorio.nombre}
                    />
                    <FichaField
                        label="Responsable"
                        value="Información no disponible"
                    />
                </dl>

                <section className="space-y-3 border-t pt-4">
                    <div>
                        <h3 className="text-sm font-medium">Acciones de la unidad</h3>
                        <p className="text-xs text-muted-foreground">
                            Disponible próximamente
                        </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        <Button type="button" variant="outline" disabled>
                            <RefreshCw className="size-4" />
                            Cambiar estado
                        </Button>
                        <Button type="button" variant="outline" disabled>
                            <History className="size-4" />
                            Ver historial
                        </Button>
                    </div>
                </section>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button">Cerrar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function FichaField({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="grid min-w-0 gap-1">
            <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
            <dd className={mono ? 'break-all font-mono text-sm' : 'text-sm'}>
                {value}
            </dd>
        </div>
    );
}
