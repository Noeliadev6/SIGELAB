import { History, MoveRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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

export interface MovimientoItem {
    id: number;
    herramienta: string;
    codigo_herramienta: string;
    unidad_serie?: string | null;
    origen: string;
    destino: string;
    usuario: string;
    tipo_movimiento: string;
    cantidad: number;
    observaciones?: string | null;
    fecha: string;
}

interface HistorialMovimientosModalProps {
    isOpen: boolean;
    onClose: () => void;
    movimientos: MovimientoItem[];
}

export default function HistorialMovimientosModal({
    isOpen,
    onClose,
    movimientos,
}: HistorialMovimientosModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <History className="h-5 w-5 text-indigo-600" />
                        Historial de Movimientos de Inventario
                    </DialogTitle>
                    <DialogDescription>
                        Registro de auditoría y trazabilidad de movimientos de herramientas.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2">
                    {movimientos.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No se han registrado movimientos de inventario aún.
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Herramienta</TableHead>
                                        <TableHead>Flujo (Origen → Destino)</TableHead>
                                        <TableHead className="text-center">Cant.</TableHead>
                                        <TableHead>Responsable</TableHead>
                                        <TableHead>Observaciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {movimientos.map((m) => (
                                        <TableRow key={m.id}>
                                            <TableCell className="text-xs font-mono whitespace-nowrap text-muted-foreground">
                                                {m.fecha}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold text-sm">{m.herramienta}</div>
                                                <div className="text-xs text-muted-foreground font-mono">
                                                    {m.codigo_herramienta}
                                                    {m.unidad_serie && (
                                                        <span className="ml-1 text-indigo-600">
                                                            (S/N: {m.unidad_serie})
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-xs font-medium">
                                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                                        {m.origen}
                                                    </span>
                                                    <MoveRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                                                        {m.destino}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="font-bold">
                                                    {m.cantidad}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs font-medium">
                                                {m.usuario}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                                                {m.observaciones || 'Sin observaciones'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-2">
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
