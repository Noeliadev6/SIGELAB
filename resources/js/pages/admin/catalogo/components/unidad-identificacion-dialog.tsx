import { Printer } from 'lucide-react';
import { router } from '@inertiajs/react';
import JsBarcode from 'jsbarcode';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type IdentificacionItem = {
    id: number;
    nombre: string;
    modelo: string | null;
};

type SubLaboratorioOption = {
    id: number;
    nombre: string;
};

type PreviewData = {
    codigo: string;
    subLaboratorio: string;
    estado: string;
};

type UnidadIdentificacionDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: IdentificacionItem;
    subLaboratorios: SubLaboratorioOption[];
    estados: string[];
};

export function UnidadIdentificacionDialog({
    open,
    onOpenChange,
    item,
    subLaboratorios,
    estados,
}: UnidadIdentificacionDialogProps) {
    const [subLaboratorioId, setSubLaboratorioId] = useState(
        subLaboratorios[0]?.id.toString() ?? '',
    );
    const [estado, setEstado] = useState(estados[0] ?? '');
    const [preview, setPreview] = useState<PreviewData | null>(null);
    const barcodeRef = useRef<SVGSVGElement | null>(null);

    const selectedSubLaboratorio = subLaboratorios.find(
        (subLaboratorio) =>
            subLaboratorio.id.toString() === subLaboratorioId,
    );
    const canPreview =
    selectedSubLaboratorio !== undefined && estado !== '';
    useEffect(() => {
    if (!preview || !barcodeRef.current) {
        return;
    }

    JsBarcode(barcodeRef.current, preview.codigo, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 14,
        height: 55,
        margin: 8,
    });
}, [preview]);

    const handlePrint = (): void => {
    if (!preview || !barcodeRef.current) {
        return;
    }

    const barcodeSvg = barcodeRef.current.outerHTML;
    const printWindow = window.open('', '_blank', 'width=700,height=500');

    if (!printWindow) {
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Etiqueta ${preview.codigo}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 24px;
                    }

                    .etiqueta {
                        width: 360px;
                        border: 1px solid #000;
                        border-radius: 8px;
                        padding: 16px;
                        text-align: center;
                    }

                    h2 {
                        margin: 0 0 6px;
                        font-size: 18px;
                    }

                    p {
                        margin: 4px 0;
                        font-size: 13px;
                    }

                    .barcode {
                        margin-top: 12px;
                    }

                    @media print {
                        body {
                            padding: 0;
                        }

                        .etiqueta {
                            border: 1px solid #000;
                        }
                    }
                </style>
            </head>

            <body>
                <div class="etiqueta">
                    <h2>${item.nombre}</h2>
                    <p>Modelo: ${item.modelo ?? 'No aplica'}</p>
                    <p>Serial: ${preview.codigo}</p>
                    <p>Sublaboratorio: ${preview.subLaboratorio}</p>

                    <div class="barcode">
                        ${barcodeSvg}
                    </div>
                </div>

                <script>
                    window.onload = function () {
                        window.print();
                    };
                </script>
            </body>
        </html>
    `);

    printWindow.document.close();
};
    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!canPreview || !selectedSubLaboratorio) {
        return;
    }

    router.post(
        '/admin/catalogo/unidades',
        {
            herramienta_id: item.id,
            sub_laboratorio_id: selectedSubLaboratorio.id,
            estado,
        },
        {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.flash as {
                    numero_serie_generado?: string;
                };

                if (!flash.numero_serie_generado) {
                    return;
                }

                setPreview({
                    codigo: flash.numero_serie_generado,
                    subLaboratorio: selectedSubLaboratorio.nombre,
                    estado,
                });
            },
        },
    );
};

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Preparar unidad serializada</DialogTitle>
                    <DialogDescription>
                        Completa los datos para registrar una unidad serializada en el catálogo.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid min-w-0 gap-2">
                            <Label htmlFor="identificacion-herramienta">Herramienta</Label>
                            <Input
                                id="identificacion-herramienta"
                                value={item.nombre}
                                readOnly
                            />
                        </div>

                        <div className="grid min-w-0 gap-2">
                            <Label htmlFor="identificacion-modelo">Modelo</Label>
                            <Input
                                id="identificacion-modelo"
                                value={item.modelo ?? 'No aplica'}
                                readOnly
                            />
                        </div>

                        <div className="grid min-w-0 gap-2">
                            <Label htmlFor="identificacion-sublaboratorio">
                                Sublaboratorio inicial
                            </Label>
                            <Select
                                value={subLaboratorioId}
                                onValueChange={setSubLaboratorioId}
                                disabled={subLaboratorios.length === 0}
                            >
                                <SelectTrigger
                                    id="identificacion-sublaboratorio"
                                    className="w-full min-w-0"
                                >
                                    <SelectValue placeholder="Sin sublaboratorios disponibles" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subLaboratorios.map((subLaboratorio) => (
                                        <SelectItem
                                            key={subLaboratorio.id}
                                            value={subLaboratorio.id.toString()}
                                        >
                                            {subLaboratorio.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid min-w-0 gap-2">
                            <Label htmlFor="identificacion-estado">Estado inicial</Label>
                            <Select
                                value={estado}
                                onValueChange={setEstado}
                                disabled={estados.length === 0}
                            >
                                <SelectTrigger
                                    id="identificacion-estado"
                                    className="w-full min-w-0"
                                >
                                    <SelectValue placeholder="Sin estados disponibles" />
                                </SelectTrigger>
                                <SelectContent>
                                    {estados.map((estadoOption) => (
                                        <SelectItem key={estadoOption} value={estadoOption}>
                                            {estadoOption}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={!canPreview}>
                            Registrar unidad
                        </Button>
                    </DialogFooter>
                </form>

                {preview && (
                    <section className="space-y-3 border-t pt-5" aria-label="Vista previa visual">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-medium">Etiqueta de identificación</h3>
                            <Badge variant="outline">Vista previa visual</Badge>
                        </div>

                        <div className="rounded-xl border bg-card p-4 shadow-xs sm:p-5">
                            <div className="grid gap-5 sm:grid-cols-[1fr_220px]">
                                <div className="min-w-0 space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Herramienta</p>
                                        <p className="font-semibold">{item.nombre}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Modelo</p>
                                            <p>{item.modelo ?? 'No aplica'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Código</p>
                                            <p className="break-all font-mono">{preview.codigo}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary">
                                            {preview.subLaboratorio}
                                        </Badge>
                                        <Badge variant="outline">{preview.estado}</Badge>
                                    </div>
                                </div>

                                <div className="flex min-h-32 flex-col items-center justify-center overflow-hidden rounded-lg border bg-white p-3">
                                    <svg
                                        ref={barcodeRef}
                                        className="max-w-full"
                                        aria-label={`Código de barras ${preview.codigo}`}
                                    />
                                </div>
                            </div>
                        </div>

                      <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrint}
                            >
                                <Printer className="size-4" />
                                Imprimir etiqueta
                            </Button>
                        </div>
                    </section>
                )}
            </DialogContent>
        </Dialog>
    );
}
