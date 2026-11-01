import { AlertCircle, CheckCircle2, Clock, Printer, X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type LoanToolItem = {
    id: number;
    nombre: string | null;
    codigo: string | null;
    serial: string | null;
    cantidad: number;
    estado: string;
    observaciones?: string | null;
};

export type LoanReceiptData = {
    id: number;
    codigo: string;
    estudiante: string | null;
    numero_registro?: string | null;
    carrera?: string | null;
    materia: string;
    grupo?: string | null;
    hora_inicio?: string | null;
    hora_fin?: string | null;
    sub_laboratorio: string | null;
    auxiliar?: string | null;
    estado: string;
    salida: string;
    prevista_devolucion: string | null;
    devolucion?: string | null;
    observaciones?: string | null;
    herramientas: LoanToolItem[];
};

export function BoletaPrestamoModal({
    loan,
    onClose,
}: {
    loan: LoanReceiptData;
    onClose: () => void;
}) {
    const handlePrint = () => window.print();

    // Cerrar con Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    // Bloquear scroll de fondo mientras el modal está abierto
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    const modalContent = (
        <div
            data-print-root=""
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:static print:block print:bg-white print:p-0"
            role="dialog"
            aria-modal="true"
            aria-label="Boleta de préstamo y recepción"
        >
            <style>{`
                @media print {
                    body > *:not([data-print-root]) { display: none !important; }
                    [data-print-root] { display: block !important; }
                    .no-print { display: none !important; }
                    #receipt-sheet {
                        box-shadow: none !important;
                        border: none !important;
                        max-width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    @page { size: A4 portrait; margin: 12mm; }
                    .receipt-copy { break-inside: avoid; }
                }
            `}</style>

            <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-background p-5 shadow-2xl print:max-h-none print:overflow-visible print:rounded-none print:p-0 print:shadow-none">
                <div className="no-print mb-4 flex items-center justify-between border-b pb-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold">
                                Boleta de Préstamo y Devolución
                            </h2>
                            <Badge
                                variant={
                                    loan.estado === 'Devuelto'
                                        ? 'default'
                                        : loan.estado === 'Con observaciones' ||
                                            loan.estado === 'Vencido'
                                          ? 'destructive'
                                          : 'secondary'
                                }
                            >
                                {loan.estado}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Detalle completo de herramientas, unidades y
                            observaciones registradas.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={handlePrint}>
                            <Printer className="mr-2 size-4" />
                            Imprimir Boleta
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            aria-label="Cerrar"
                        >
                            <X className="size-5" />
                        </Button>
                    </div>
                </div>

                <div
                    id="receipt-sheet"
                    className="mx-auto max-w-3xl bg-white text-black print:m-0 print:max-w-none"
                >
                    <ReceiptSheet loan={loan} />
                </div>
            </div>
        </div>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(modalContent, document.body);
}

function ReceiptSheet({ loan }: { loan: LoanReceiptData }) {
    const [date, time] = (loan.salida ?? '').split(' ');
    const totalItems = loan.herramientas.reduce(
        (sum, t) => sum + (t.cantidad || 1),
        0,
    );

    return (
        <section className="receipt-copy border border-black text-[11px] leading-tight font-sans">
            {/* ENCABEZADO */}
            <div className="grid grid-cols-[1.2fr_2fr_1.2fr] items-stretch border-b border-black">
                <div className="flex flex-col justify-center p-2 text-center border-r border-black">
                    <span className="text-base font-black tracking-tight">
                        UTPSA
                    </span>
                    <span className="text-[8px] font-semibold uppercase text-gray-700">
                        Facultad de Ingeniería
                    </span>
                </div>
                <div className="p-2 text-center uppercase border-r border-black">
                    <p className="font-bold text-[10px]">
                        Universidad Tecnológica Privada de Santa Cruz
                    </p>
                    <p className="text-[9px] text-gray-700">
                        Laboratorio de Mecánica Automotriz y Maquinaria
                    </p>
                    <p className="mt-1 font-black text-[10px] tracking-wide">
                        COMPROBANTE DE PRÉSTAMO Y DEVOLUCIÓN
                    </p>
                </div>
                <div className="space-y-0.5 p-2 text-[10px]">
                    <p>
                        <span className="font-bold">CÓDIGO:</span> {loan.codigo}
                    </p>
                    <p>
                        <span className="font-bold">ESTADO:</span>{' '}
                        <span className="uppercase font-semibold">
                            {loan.estado}
                        </span>
                    </p>
                    <p>
                        <span className="font-bold">EMISIÓN:</span>{' '}
                        {date || '—'}
                    </p>
                </div>
            </div>

            {/* DATOS DE LA ACTIVIDAD */}
            <div className="grid grid-cols-2 md:grid-cols-[130px_105px_1fr_90px] border-b border-black bg-gray-50/50">
                <Cell label="Fecha Salida" value={date || '—'} />
                <Cell label="Hora Salida" value={time || '—'} />
                <Cell label="Materia / Módulo" value={loan.materia || '—'} highlight />
                <Cell label="Grupo" value={loan.grupo ?? '—'} last />
            </div>

            {/* DATOS DEL ESTUDIANTE Y AUXILIAR */}
            <div className="grid grid-cols-2 border-b border-black">
                <Cell
                    label="Estudiante"
                    value={loan.estudiante ?? '—'}
                    highlight
                />
                <Cell
                    label="Registro / C.I."
                    value={loan.numero_registro ?? '—'}
                    last
                />
                <Cell label="Carrera" value={loan.carrera ?? '—'} />
                <Cell
                    label="Sub-Laboratorio"
                    value={loan.sub_laboratorio ?? '—'}
                    last
                />
            </div>

            {/* FECHAS DE CONTROL */}
            <div className="grid grid-cols-3 border-b border-black bg-gray-50/30">
                <Cell
                    label="Prevista Devolución"
                    value={loan.prevista_devolucion ?? 'No especificada'}
                />
                <Cell
                    label="Devuelto el"
                    value={loan.devolucion ?? 'Pendiente de retorno'}
                />
                <Cell
                    label="Auxiliar Responsable"
                    value={loan.auxiliar ?? '—'}
                    last
                />
            </div>

            {/* TABLA DE HERRAMIENTAS Y UNIDADES */}
            <div className="grid grid-cols-[40px_100px_1fr_110px_1.5fr] border-b border-black bg-gray-200 text-center font-bold text-[10px]">
                <div className="border-r border-black p-1.5">Cant.</div>
                <div className="border-r border-black p-1.5">Código</div>
                <div className="border-r border-black p-1.5 text-left pl-2">
                    Herramienta / Equipo
                </div>
                <div className="border-r border-black p-1.5">Estado Retorno</div>
                <div className="p-1.5 text-left pl-2">
                    Observación / Daño / Incidencia
                </div>
            </div>

            <div className="min-h-32 divide-y divide-black">
                {loan.herramientas.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 italic">
                        No se registraron herramientas en este préstamo.
                    </div>
                ) : (
                    loan.herramientas.map((tool) => {
                        const hasObservation = Boolean(
                            tool.observaciones &&
                                tool.observaciones.trim() !== '',
                        );
                        const isConforme = tool.estado === 'Conforme';
                        const isPending =
                            tool.estado === 'Pendiente' || !tool.estado;

                        return (
                            <div
                                key={tool.id}
                                className="grid grid-cols-[40px_100px_1fr_110px_1.5fr] text-[10px] items-stretch"
                            >
                                <div className="border-r border-black p-1.5 text-center font-semibold flex items-center justify-center">
                                    {tool.cantidad}
                                </div>
                                <div className="border-r border-black p-1.5 font-mono text-[9px] flex items-center justify-center">
                                    {tool.codigo || '—'}
                                </div>
                                <div className="border-r border-black p-1.5 text-left">
                                    <p className="font-semibold text-gray-900">
                                        {tool.nombre}
                                    </p>
                                    {tool.serial && (
                                        <p className="font-mono text-[9px] text-gray-600">
                                            Serial / Placa: {tool.serial}
                                        </p>
                                    )}
                                </div>
                                <div className="border-r border-black p-1.5 text-center flex items-center justify-center">
                                    <span
                                        className={`px-1 py-0.5 rounded font-bold uppercase text-[9px] ${
                                            isConforme
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : isPending
                                                  ? 'bg-blue-50 text-blue-800'
                                                  : 'bg-rose-100 text-rose-800'
                                        }`}
                                    >
                                        {tool.estado || 'Pendiente'}
                                    </span>
                                </div>
                                <div className="p-1.5 text-left text-gray-900 flex items-center">
                                    {hasObservation ? (
                                        <div className="w-full">
                                            <span className="font-semibold text-rose-700">
                                                {tool.estado !== 'Conforme' &&
                                                tool.estado !== 'Pendiente'
                                                    ? `[${tool.estado}] `
                                                    : ''}
                                            </span>
                                            <span className="font-medium text-black">
                                                {tool.observaciones}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">
                                            {isConforme
                                                ? 'Sin observaciones (Buen estado)'
                                                : isPending
                                                  ? 'En préstamo'
                                                  : '—'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* TOTAL DE HERRAMIENTAS */}
            <div className="grid grid-cols-[40px_100px_1fr_110px_1.5fr] border-t border-b border-black bg-gray-100 font-bold text-[10px]">
                <div className="border-r border-black p-1.5 text-center">
                    {totalItems}
                </div>
                <div className="border-r border-black p-1.5" />
                <div className="border-r border-black p-1.5 text-left pl-2">
                    Total herramientas e ítems entregados
                </div>
                <div className="border-r border-black p-1.5 text-center">
                    {loan.herramientas.length} tipo(s)
                </div>
                <div className="p-1.5" />
            </div>

            {/* SECCIÓN DEDICADA DE OBSERVACIONES GENERALES */}
            <div className="border-b border-black p-2.5 bg-gray-50/70 text-[10px]">
                <div className="flex items-center gap-1.5 text-gray-800 font-bold uppercase text-[9px] tracking-wider mb-1">
                    <AlertCircle className="size-3 text-primary inline" />
                    <span>Observaciones y Notas Generales del Préstamo:</span>
                </div>
                {loan.observaciones && loan.observaciones.trim() !== '' ? (
                    <div className="rounded border border-black/20 bg-white p-2 font-medium text-black whitespace-pre-line text-[10px] leading-relaxed">
                        {loan.observaciones}
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-[10px]">
                        Ninguna observación general registrada para este
                        movimiento.
                    </p>
                )}
            </div>

            {/* FIRMAS DE RESPONSABILIDAD */}
            <div className="grid grid-cols-2 gap-16 p-6 text-center text-[10px]">
                <div>
                    <div className="border-t border-black pt-1.5 font-bold uppercase">
                        Firma Entrega / Auxiliar de Laboratorio
                    </div>
                    <p className="text-[9px] text-gray-600">
                        {loan.auxiliar ?? 'Responsable de turno'}
                    </p>
                </div>
                <div>
                    <div className="border-t border-black pt-1.5 font-bold uppercase">
                        Firma Recepción / Estudiante
                    </div>
                    <p className="text-[9px] text-gray-600">
                        {loan.estudiante ?? 'Estudiante prestatario'}
                    </p>
                </div>
            </div>

            {/* PIE DE PÁGINA */}
            <div className="border-t border-black bg-gray-50 p-1.5 text-center text-[8px] text-gray-500">
                Documento oficial del Sistema de Gestión de Laboratorio Mecánica
                (SIGELAB). Válido para control de inventario y auditoría
                académica.
            </div>
        </section>
    );
}

function Cell({
    label,
    value,
    last = false,
    highlight = false,
}: {
    label: string;
    value: string;
    last?: boolean;
    highlight?: boolean;
}) {
    return (
        <div
            className={`flex min-h-7 border-black ${last ? '' : 'border-r'}`}
        >
            <span className="shrink-0 bg-gray-200/80 px-2 py-1 font-bold text-[9px] uppercase flex items-center">
                {label}:
            </span>
            <span
                className={`flex-1 break-words px-2 py-1 text-[10px] flex items-center leading-tight ${
                    highlight ? 'font-bold text-black' : ''
                }`}
                title={value}
            >
                {value}
            </span>
        </div>
    );
}
