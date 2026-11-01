import { useForm } from '@inertiajs/react';
import { ArrowRightLeft, PackageCheck } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface SubLabItem {
    id: number;
    nombre: string;
    codigo: string;
}

export interface UnidadItem {
    id: number;
    numero_serie_barras: string;
    estado: string;
}

export interface InventarioItem {
    id: number;
    herramienta_id: number;
    codigo_herramienta: string;
    nombre_herramienta: string;
    es_serializado: boolean;
    stock_disponible: number;
    sub_laboratorio: { id: number; nombre: string; codigo: string };
    unidades: UnidadItem[];
}

interface TransferirModalProps {
    isOpen: boolean;
    onClose: () => void;
    subLaboratorios: SubLabItem[];
    inventarios: InventarioItem[];
    itemPreseleccionado?: InventarioItem | null;
}

export default function TransferirModal({
    isOpen,
    onClose,
    subLaboratorios,
    inventarios,
    itemPreseleccionado,
}: TransferirModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        herramienta_id: '',
        origen_sub_laboratorio_id: '',
        destino_sub_laboratorio_id: '',
        cantidad: 1,
        unidad_herramienta_id: '',
        observaciones: '',
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            if (itemPreseleccionado) {
                setData({
                    herramienta_id: String(itemPreseleccionado.herramienta_id),
                    origen_sub_laboratorio_id: String(itemPreseleccionado.sub_laboratorio.id),
                    destino_sub_laboratorio_id: '',
                    cantidad: 1,
                    unidad_herramienta_id: '',
                    observaciones: '',
                });
            } else {
                reset();
            }
        }
    }, [isOpen, itemPreseleccionado]);

    // Obtener las herramientas disponibles en el sub-laboratorio de origen seleccionado
    const inventarioDisponiblesOrigen = data.origen_sub_laboratorio_id
        ? inventarios.filter(
              (i) => i.sub_laboratorio.id === Number(data.origen_sub_laboratorio_id) && i.stock_disponible > 0,
          )
        : [];

    // Detalle de la herramienta seleccionada
    const itemSeleccionado = inventarioDisponiblesOrigen.find(
        (i) => i.herramienta_id === Number(data.herramienta_id),
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/admin/inventario/transferir', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Transferencia registrada exitosamente');
                reset();
                onClose();
            },
            onError: (err) => {
                toast.error('Ocurrió un error al procesar el movimiento');
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
                        Movimiento de Inventario entre Sub-Laboratorios
                    </DialogTitle>
                    <DialogDescription>
                        Traspaso de herramientas y control de disponibilidad en tiempo real entre ubicaciones.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Sub-Laboratorio Origen */}
                    <div className="space-y-2">
                        <Label htmlFor="origen_sub_laboratorio_id">Sub-Laboratorio de Origen *</Label>
                        <Select
                            value={data.origen_sub_laboratorio_id}
                            onValueChange={(val) => {
                                setData((prev) => ({
                                    ...prev,
                                    origen_sub_laboratorio_id: val,
                                    herramienta_id: '',
                                    unidad_herramienta_id: '',
                                    cantidad: 1,
                                }));
                            }}
                        >
                            <SelectTrigger id="origen_sub_laboratorio_id">
                                <SelectValue placeholder="Seleccione el sub-laboratorio de origen" />
                            </SelectTrigger>
                            <SelectContent>
                                {subLaboratorios.map((lab) => (
                                    <SelectItem key={lab.id} value={String(lab.id)}>
                                        {lab.nombre} ({lab.codigo})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.origen_sub_laboratorio_id && (
                            <p className="text-sm font-medium text-destructive">{errors.origen_sub_laboratorio_id}</p>
                        )}
                    </div>

                    {/* Herramienta a Mover */}
                    <div className="space-y-2">
                        <Label htmlFor="herramienta_id">Herramienta a Transferir *</Label>
                        <Select
                            disabled={!data.origen_sub_laboratorio_id}
                            value={data.herramienta_id}
                            onValueChange={(val) => {
                                setData((prev) => ({
                                    ...prev,
                                    herramienta_id: val,
                                    unidad_herramienta_id: '',
                                    cantidad: 1,
                                }));
                            }}
                        >
                            <SelectTrigger id="herramienta_id">
                                <SelectValue
                                    placeholder={
                                        data.origen_sub_laboratorio_id
                                            ? 'Seleccione la herramienta'
                                            : 'Primero seleccione sub-laboratorio de origen'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {inventarioDisponiblesOrigen.map((inv) => (
                                    <SelectItem key={inv.id} value={String(inv.herramienta_id)}>
                                        [{inv.codigo_herramienta}] {inv.nombre_herramienta} (Stock disp:{' '}
                                        {inv.stock_disponible})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.herramienta_id && (
                            <p className="text-sm font-medium text-destructive">{errors.herramienta_id}</p>
                        )}
                    </div>

                    {/* Sub-Laboratorio Destino */}
                    <div className="space-y-2">
                        <Label htmlFor="destino_sub_laboratorio_id">Sub-Laboratorio de Destino *</Label>
                        <Select
                            value={data.destino_sub_laboratorio_id}
                            onValueChange={(val) => setData('destino_sub_laboratorio_id', val)}
                        >
                            <SelectTrigger id="destino_sub_laboratorio_id">
                                <SelectValue placeholder="Seleccione el sub-laboratorio de destino" />
                            </SelectTrigger>
                            <SelectContent>
                                {subLaboratorios
                                    .filter((lab) => String(lab.id) !== data.origen_sub_laboratorio_id)
                                    .map((lab) => (
                                        <SelectItem key={lab.id} value={String(lab.id)}>
                                            {lab.nombre} ({lab.codigo})
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        {errors.destino_sub_laboratorio_id && (
                            <p className="text-sm font-medium text-destructive">{errors.destino_sub_laboratorio_id}</p>
                        )}
                    </div>

                    {/* Si es serializada, selección opcional/requerida de Serie */}
                    {itemSeleccionado?.es_serializado && itemSeleccionado.unidades.length > 0 && (
                        <div className="space-y-2 rounded-lg bg-indigo-50/60 p-3 border border-indigo-100">
                            <Label htmlFor="unidad_herramienta_id" className="text-indigo-900 font-semibold">
                                Unidad Serializada Específica (Opcional)
                            </Label>
                            <Select
                                value={data.unidad_herramienta_id}
                                onValueChange={(val) => setData('unidad_herramienta_id', val)}
                            >
                                <SelectTrigger id="unidad_herramienta_id" className="bg-white">
                                    <SelectValue placeholder="Seleccione número de serie (si aplica)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {itemSeleccionado.unidades
                                        .filter((u) => u.estado === 'Disponible')
                                        .map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>
                                                Nro. Serie: {u.numero_serie_barras} ({u.estado})
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Cantidad */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="cantidad">Cantidad a Transferir *</Label>
                            {itemSeleccionado && (
                                <span className="text-xs text-muted-foreground font-medium">
                                    Máx. disponible: {itemSeleccionado.stock_disponible}
                                </span>
                            )}
                        </div>
                        <Input
                            id="cantidad"
                            type="number"
                            min={1}
                            max={itemSeleccionado ? itemSeleccionado.stock_disponible : 9999}
                            value={data.cantidad}
                            onChange={(e) => setData('cantidad', Number(e.target.value))}
                        />
                        {errors.cantidad && (
                            <p className="text-sm font-medium text-destructive">{errors.cantidad}</p>
                        )}
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Motivo / Observaciones</Label>
                        <Textarea
                            id="observaciones"
                            placeholder="Ej: Asignación por práctica de taller de motores..."
                            value={data.observaciones}
                            onChange={(e) => setData('observaciones', e.target.value)}
                            rows={2}
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                            <PackageCheck className="h-4 w-4" />
                            {processing ? 'Registrando...' : 'Confirmar Transferencia'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
