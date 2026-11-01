import { Barcode, Camera } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type ScannerUnidad = {
    id: number;
    numero_serie_barras: string;
    estado: string;
    sub_laboratorio: {
        id: number;
        nombre: string;
    };
};

export type ScannerItem = {
    id: number;
    codigo: string;
    nombre: string;
    modelo: string | null;
    es_serializado: boolean;
    categoria: {
        id: number;
        nombre: string;
    };
    unidades?: ScannerUnidad[];
};

export type ScannerResult = {
    item: ScannerItem;
    unidad: ScannerUnidad;
};

type HerramientaScannerDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: ScannerItem[];
    onFound: (result: ScannerResult) => void;
};

export function HerramientaScannerDialog({
    open,
    onOpenChange,
    items,
    onFound,
}: HerramientaScannerDialogProps) {
    const [codigo, setCodigo] = useState('');
    const [notFound, setNotFound] = useState(false);

    const handleOpenChange = (nextOpen: boolean): void => {
        if (!nextOpen) {
            setCodigo('');
            setNotFound(false);
        }

        onOpenChange(nextOpen);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const normalizedCode = codigo.trim().toLocaleLowerCase();

        if (normalizedCode === '') {
            setNotFound(true);

            return;
        }

        for (const item of items) {
            const unidad = item.unidades?.find(
                (candidate) =>
                    candidate.numero_serie_barras.trim().toLocaleLowerCase() ===
                    normalizedCode,
            );

            if (unidad) {
                handleOpenChange(false);
                onFound({ item, unidad });

                return;
            }
        }

        setNotFound(true);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Escanear herramienta</DialogTitle>
                    <DialogDescription>
                        Identifica una unidad serializada utilizando los datos cargados en
                        el catálogo.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative overflow-hidden rounded-xl border bg-slate-950 p-5 text-slate-100 dark:border-slate-700">
                    <div className="flex min-h-52 flex-col items-center justify-center gap-4 text-center">
                        <div className="relative flex h-32 w-full max-w-xs items-center justify-center rounded-lg border-2 border-dashed border-indigo-300/70">
                            <div className="absolute inset-x-5 top-1/2 h-px bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.9)]" />
                            <Barcode className="size-10 text-indigo-200" />
                        </div>
                        <div>
                            <p className="font-medium">Área visual de escaneo</p>
                            <p className="mt-1 text-xs text-slate-400">
                                Cámara preparada para una integración futura. No se
                                solicitarán permisos en esta vista.
                            </p>
                        </div>
                        <Button type="button" variant="secondary" disabled>
                            <Camera className="size-4" />
                            Activar cámara
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="scanner-codigo">
                            Código o número de serie
                        </Label>
                        <Input
                            id="scanner-codigo"
                            value={codigo}
                            onChange={(event) => {
                                setCodigo(event.target.value);
                                setNotFound(false);
                            }}
                            placeholder="Ingresa el identificador exacto"
                            autoComplete="off"
                        />
                        {notFound && (
                            <p role="alert" className="text-sm text-destructive">
                                Herramienta no encontrada
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit">Buscar código</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
