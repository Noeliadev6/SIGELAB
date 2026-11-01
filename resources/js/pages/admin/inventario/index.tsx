import { Head, router, usePage } from '@inertiajs/react';
import {
    Boxes,
    Building2,
    CheckCircle2,
    Clock,
    Filter,
    History,
    Layers,
    Package,
    RefreshCw,
    Search,
    ShieldAlert,
    Wrench,
} from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { CatalogoLaboratorioTabs } from '@/components/catalogo-laboratorio-tabs';
import HistorialMovimientosModal, {
    MovimientoItem,
} from './components/historial-movimientos-modal';


import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Inventario por Sub-Laboratorio', href: '/admin/inventario' },
];

interface CategoriaItem {
    id: number;
    nombre: string;
}

interface UnidadItem {
    id: number;
    numero_serie_barras: string;
    estado: string;
}

interface SubLabItem {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string | null;
    total_stock: number;
    total_herramientas: number;
}

interface InventarioItem {
    id: number;
    herramienta_id: number;
    codigo_herramienta: string;
    nombre_herramienta: string;
    es_serializado: boolean;
    stock_disponible: number;
    sub_laboratorio: {
        id: number;
        nombre: string;
        codigo: string;
    };
    unidades: UnidadItem[];
    descripcion_herramienta: string | null;
    categoria: CategoriaItem | null;
    stock_total: number;
}

interface ResumenGeneral {
    total_items_distintos: number;
    stock_total_global: number;
    stock_disponible_global: number;
    total_sub_laboratorios: number;
}

interface PageProps {
    subLaboratorios: SubLabItem[];
    inventarios: InventarioItem[];
    categorias: CategoriaItem[];
    historialMovimientos: MovimientoItem[];
    resumenGeneral: ResumenGeneral;
    filters: {
        sub_laboratorio_id?: number | null;
        search?: string | null;
        categoria_id?: string | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function InventarioIndex({
    subLaboratorios,
    inventarios,
    categorias,
    historialMovimientos,
    resumenGeneral,
    filters,
}: PageProps) {
    const { auth } = usePage().props;
    const rolNombre = auth.user?.rol?.nombre;
    const puedeMoverStock = ['administrador', 'auxiliar'].includes(rolNombre || '');

    const [selectedSubLabId, setSelectedSubLabId] = useState<number | null>(
        filters.sub_laboratorio_id ? Number(filters.sub_laboratorio_id) : null,
    );
    const [search, setSearch] = useState<string>(filters.search || '');
    const [categoriaId, setCategoriaId] = useState<string>(filters.categoria_id || 'all');

    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);

    const handleFilterChange = (labId?: number | null, searchVal?: string, catVal?: string) => {
        const newLabId = labId !== undefined ? labId : selectedSubLabId;
        const newSearch = searchVal !== undefined ? searchVal : search;
        const newCat = catVal !== undefined ? catVal : categoriaId;

        router.get(
            '/admin/inventario',
            {
                sub_laboratorio_id: newLabId || undefined,
                search: newSearch || undefined,
                categoria_id: newCat !== 'all' ? newCat : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventario por Sub-Laboratorio" />

            <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
                <CatalogoLaboratorioTabs />

                {/* Header Principal */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Inventario por Sub-Laboratorio
                        </h1>
                        <p className="text-sm text-muted-foreground">
                           Visualización de stock por laboratorio (Motores, Máquinas y Herramientas, Inyección Electrónica).
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsHistoryModalOpen(true)}
                            className="gap-2"
                        >
                            <History className="h-4 w-4" />
                            Historial
                        </Button>

                        {puedeMoverStock && (
                            <Button
                                onClick={() => setIsAddStockModalOpen(true)}
                                className="gap-2"
                            >
                                <Boxes className="h-4 w-4" />
                                Agregar / Ajustar Stock
                            </Button>
                        )}
                    </div>
                </div>

                {/* Métricas Generales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border shadow-sm bg-card hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                                Ítems Registrados
                            </CardTitle>
                            <Wrench className="h-4 w-4 text-indigo-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{resumenGeneral.total_items_distintos}</div>
                            <p className="text-xs text-muted-foreground">Tipos de herramientas</p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm bg-card hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                                Stock Total
                            </CardTitle>
                            <Boxes className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                                {resumenGeneral.stock_total_global}
                            </div>
                            <p className="text-xs text-muted-foreground">Unidades en existencias</p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm bg-card hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                                Stock Disponible
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                                {resumenGeneral.stock_disponible_global}
                            </div>
                            <p className="text-xs text-muted-foreground">Para préstamos/prácticas</p>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-sm bg-card hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                                Sub-Laboratorios
                            </CardTitle>
                            <Layers className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{resumenGeneral.total_sub_laboratorios}</div>
                            <p className="text-xs text-muted-foreground">Ubicaciones activas</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Pestañas de Selección de Sub-Laboratorio */}
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Filtrar por Sub-Laboratorio
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Pestaña: Todos */}
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedSubLabId(null);
                                handleFilterChange(null);
                            }}
                            className={`flex flex-col p-4 rounded-xl border text-left transition-all ${selectedSubLabId === null
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300 dark:ring-indigo-800'
                                    : 'bg-card text-card-foreground border-border hover:border-indigo-300 hover:bg-indigo-50/30'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm">Todos los Sub-Labs</span>
                                <Package className={`h-4 w-4 ${selectedSubLabId === null ? 'text-white' : 'text-indigo-600'}`} />
                            </div>
                            <span className={`text-xs mt-2 ${selectedSubLabId === null ? 'text-indigo-100' : 'text-muted-foreground'}`}>
                                Vista consolidada global
                            </span>
                        </button>

                        {/* Pestañas para cada Sub-Laboratorio */}
                        {subLaboratorios.map((lab) => {
                            const isSelected = selectedSubLabId === lab.id;

                            return (
                                <button
                                    key={lab.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedSubLabId(lab.id);
                                        handleFilterChange(lab.id);
                                    }}
                                    className={`flex flex-col p-4 rounded-xl border text-left transition-all ${isSelected
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300 dark:ring-indigo-800'
                                            : 'bg-card text-card-foreground border-border hover:border-indigo-300 hover:bg-indigo-50/30'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm truncate">{lab.nombre}</span>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${isSelected
                                                    ? 'bg-white/20 text-white border-white/30'
                                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                }`}
                                        >
                                            {lab.codigo}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between mt-3 text-xs">
                                        <span className={isSelected ? 'text-indigo-100' : 'text-muted-foreground'}>
                                            Herramientas: <strong className="font-semibold">{lab.total_herramientas}</strong>
                                        </span>
                                        <span className={isSelected ? 'text-indigo-100' : 'text-muted-foreground'}>
                                            Stock Total: <strong className="font-semibold">{lab.total_stock}</strong>
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Filtros de Búsqueda y Tabla */}
                <Card className="border shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-lg font-bold">
                                    {selectedSubLabId
                                        ? `Stock en ${subLaboratorios.find((l) => l.id === selectedSubLabId)?.nombre}`
                                        : 'Stock Consolidado (Todos los Sub-Laboratorios)'}
                                </CardTitle>
                                <CardDescription>
                                    Herramientas y existencias registradas en la base de datos.
                                </CardDescription>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {/* Search Bar */}
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nombre o código..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            handleFilterChange(undefined, e.target.value, undefined);
                                        }}
                                        className="pl-9"
                                    />
                                </div>

                                {/* Category Select */}
                                <div className="w-full sm:w-48">
                                    <Select
                                        value={categoriaId}
                                        onValueChange={(val) => {
                                            setCategoriaId(val);
                                            handleFilterChange(undefined, undefined, val);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <div className="flex items-center gap-2 truncate">
                                                <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                                <SelectValue placeholder="Categoría" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas las Categorías</SelectItem>
                                            {categorias.map((cat) => (
                                                <SelectItem key={cat.id} value={String(cat.id)}>
                                                    {cat.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Refresh Button */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    title="Actualizar datos"
                                    onClick={() => router.reload()}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                    <TableRow>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Herramienta / Categoría</TableHead>
                                        <TableHead>Sub-Laboratorio</TableHead>
                                        <TableHead className="text-center">Tipo</TableHead>
                                        <TableHead className="text-center">Stock Total</TableHead>
                                        <TableHead className="text-center">Stock Disponible</TableHead>
                                        <TableHead className="text-center">Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inventarios.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                                No se encontraron registros de inventario con los filtros aplicados.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        inventarios.map((item) => {
                                            const stockDisp = item.stock_disponible;
                                            let badgeVariant: 'default' | 'outline' | 'destructive' = 'default';
                                            let estadoLabel = 'Disponible';
                                            let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';

                                            if (stockDisp === 0) {
                                                badgeVariant = 'destructive';
                                                estadoLabel = 'Agotado';
                                                badgeClass = 'bg-red-100 text-red-800 border-red-200';
                                            } else if (stockDisp <= 2) {
                                                estadoLabel = 'Stock Bajo';
                                                badgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
                                            }

                                            return (
                                                <TableRow key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                                                    <TableCell className="font-mono font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                                                        {item.codigo_herramienta}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-semibold text-sm">{item.nombre_herramienta}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {item.categoria?.nombre || 'Sin categoría'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-slate-100 font-medium text-xs">
                                                            {item.sub_laboratorio.nombre}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.es_serializado ? (
                                                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-xs font-normal">
                                                                Serializado
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">General</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-sm">
                                                        {item.stock_total}
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold text-sm">
                                                        {item.stock_disponible}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
                                                            {estadoLabel}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            // Modal para Agregar/Ajustar Stock
            {isAddStockModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <h2 className="text-xl font-bold mb-2">Agregar o Ajustar Stock</h2>
                        <p className="text-muted-foreground text-sm mb-6">
                            Aquí podrás agregar nuevas herramientas al laboratorio (ya sean consumibles o serializadas). La lógica será implementada pronto.
                        </p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sub-Laboratorio</label>
                                <Select disabled>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione sub-laboratorio" />
                                    </SelectTrigger>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Herramienta (del catálogo)</label>
                                <Select disabled>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione herramienta" />
                                    </SelectTrigger>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Cantidad a agregar</label>
                                <Input type="number" placeholder="Ej: 5" disabled />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setIsAddStockModalOpen(false)}>
                                Cerrar (Vista Previa)
                            </Button>
                            <Button disabled>Guardar Cambios</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Historial de Movimientos */}
            <HistorialMovimientosModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                movimientos={historialMovimientos}
            />
        </AppLayout>
    );
}
