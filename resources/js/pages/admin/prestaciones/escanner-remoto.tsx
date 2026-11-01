import { Head } from '@inertiajs/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
    CheckCircle2,
    QrCode,
    Scan,
    Send,
    Smartphone,
    Wifi,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function EscannerRemoto() {
    const [salaId, setSalaId] = useState<string>('');
    const [manualBarcode, setManualBarcode] = useState<string>('');
    const [ultimosEscaneados, setUltimosEscaneados] = useState<
        { codigo: string; timestamp: string; estado: 'Enviado' | 'Error' }[]
    >([]);
    const [escaneandoActivo, setEscaneandoActivo] = useState(false);
    const [mensajeNotif, setMensajeNotif] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sala = params.get('sala') || 'LAB-WIFI-01';
        setSalaId(sala);
    }, []);

    useEffect(() => {
        if (!escaneandoActivo) return;

        const scanner = new Html5QrcodeScanner(
            'reader-remote-mobile',
            {
                fps: 12,
                qrbox: { width: 260, height: 190 },
                aspectRatio: 1.0,
            },
            false
        );

        scanner.render(
            (decodedText) => {
                handleEnviarCodigo(decodedText);
            },
            () => {}
        );

        return () => {
            scanner.clear().catch(() => {});
        };
    }, [escaneandoActivo]);

    const handleEnviarCodigo = (codigo: string) => {
        if (!codigo.trim()) return;

        const eventData = {
            sala: salaId,
            barcode: codigo.trim(),
            timestamp: new Date().toLocaleTimeString(),
        };

        try {
            const bc = new BroadcastChannel('lab_meca_scanner_channel');
            bc.postMessage(eventData);
            bc.close();
        } catch (e) {
            console.log('BroadcastChannel error', e);
        }

        localStorage.setItem('lab_meca_last_scanned_barcode', JSON.stringify(eventData));

        if (navigator.vibrate) {
            navigator.vibrate(150);
        }

        setUltimosEscaneados((prev) => [
            {
                codigo: codigo.trim(),
                timestamp: new Date().toLocaleTimeString(),
                estado: 'Enviado',
            },
            ...prev.slice(0, 9),
        ]);

        setMensajeNotif(`¡Código "${codigo}" enviado a la PC con éxito!`);
        setTimeout(() => setMensajeNotif(null), 3000);
        setManualBarcode('');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 font-sans max-w-md mx-auto space-y-4">
            <Head title="Escáner Remoto por Celular WiFi" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm">
                        <Smartphone className="size-7" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold leading-tight">Escáner Móvil WiFi</h1>
                        <p className="text-xs md:text-sm text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                            <Wifi className="size-4 text-emerald-400 animate-pulse" /> Conectado a Sala:{' '}
                            <span className="font-mono text-emerald-300 font-bold">{salaId}</span>
                        </p>
                    </div>
                </div>
                <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-300 text-xs px-2.5 py-1 font-bold">
                    EN LÍNEA
                </Badge>
            </div>

            {/* Banner de Notificación */}
            {mensajeNotif && (
                <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-500/20 p-4 text-sm font-bold text-emerald-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-lg">
                    <CheckCircle2 className="size-6 shrink-0 text-emerald-400 animate-bounce" />
                    <span>{mensajeNotif}</span>
                </div>
            )}

            {/* Contenedor del Escáner */}
            <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl overflow-hidden rounded-2xl">
                <CardHeader className="pb-3 border-b border-slate-800 bg-slate-950/60">
                    <CardTitle className="text-base font-bold flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Scan className="size-5 text-emerald-400" /> Lector de Cámara Web
                        </span>
                        <Button
                            size="sm"
                            variant={escaneandoActivo ? 'destructive' : 'default'}
                            onClick={() => setEscaneandoActivo(!escaneandoActivo)}
                            className="h-9 text-xs font-bold gap-1.5 shadow-md"
                        >
                            {escaneandoActivo ? 'Detener Cámara' : 'Iniciar Cámara'}
                        </Button>
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm text-slate-400">
                        Apunta la cámara del celular hacia el código de barras o QR de la herramienta.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                    {escaneandoActivo ? (
                        <div className="relative w-full rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 min-h-[220px]">
                            <div className="animate-scan-laser z-20" />
                            <div id="reader-remote-mobile" className="w-full text-white z-10" />
                        </div>
                    ) : (
                        <div className="py-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/50 p-6">
                            <div className="p-5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 mb-3.5 shadow-inner">
                                <QrCode className="size-12 text-emerald-400" />
                            </div>
                            <p className="text-sm font-bold text-slate-200">Cámara pausada</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-[260px]">
                                Presiona "Iniciar Cámara" para comenzar a escanear herramientas con la cámara del celular.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Entrada Manual alternativa */}
            <Card className="bg-slate-900 border-slate-800 text-slate-100 rounded-2xl">
                <CardContent className="p-4">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleEnviarCodigo(manualBarcode);
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            placeholder="Escribir serial o código manualmente..."
                            value={manualBarcode}
                            onChange={(e) => setManualBarcode(e.target.value)}
                            className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm h-11 font-mono"
                        />
                        <Button type="submit" size="default" className="h-11 px-4 gap-1.5 text-xs md:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                            <Send className="size-4" /> Enviar
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Historial de Lecturas */}
            <Card className="bg-slate-900 border-slate-800 text-slate-100 rounded-2xl">
                <CardHeader className="py-3.5 px-4 border-b border-slate-800">
                    <CardTitle className="text-sm font-bold text-slate-300 flex items-center justify-between">
                        <span>Lecturas Enviadas a PC ({ultimosEscaneados.length})</span>
                        {ultimosEscaneados.length > 0 && (
                            <button
                                onClick={() => setUltimosEscaneados([])}
                                className="text-xs text-slate-500 hover:text-slate-300 font-medium cursor-pointer"
                            >
                                Limpiar
                            </button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-2 max-h-52 overflow-y-auto">
                    {ultimosEscaneados.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-6">No hay lecturas registradas aún.</p>
                    ) : (
                        ultimosEscaneados.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs md:text-sm"
                            >
                                <span className="font-mono font-bold text-emerald-400 text-base">{item.codigo}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-mono">{item.timestamp}</span>
                                    <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-xs px-2 py-0.5 font-bold">
                                        {item.estado}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
