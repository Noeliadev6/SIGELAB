import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Barcode,
    Edit,
    LayoutGrid,
    List,
    PackageOpen,
    Plus,
    Printer,
    Search,
    Trash2,
} from 'lucide-react';
import JsBarcode from 'jsbarcode';
import * as XLSX from 'xlsx';
import { useMemo, useState } from 'react';
import { CatalogoLaboratorioTabs } from '@/components/catalogo-laboratorio-tabs';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { HerramientaFichaDialog } from './components/herramienta-ficha-dialog';
import {
    HerramientaScannerDialog,
    type ScannerResult,
} from './components/herramienta-scanner-dialog';
import { UnidadIdentificacionDialog } from './components/unidad-identificacion-dialog';

type ItemCatalogo = {
    id: number;
    codigo: string;
    nombre: string;
    modelo: string | null;
    descripcion: string | null;
    es_serializado: boolean;
    categoria: {
        id: number;
        nombre: string;
    };
    unidades?: {
        id: number;
        numero_serie_barras: string;
        estado: string;
        sub_laboratorio: {
            id: number;
            nombre: string;
        };
    }[];
};

type Categoria = {
    id: number;
    nombre: string;
};

type CatalogoProps = {
    categorias: Categoria[];
    items: ItemCatalogo[];
    subLaboratorios: {
        id: number;
        nombre: string;
    }[];
};

type ViewMode = 'grid' | 'list';
type TipoFilter = 'todos' | 'serializados' | 'granel';

export default function CatalogoIndex({
    categorias = [],
    items = [],
    subLaboratorios = [],
}: CatalogoProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUnidadesDialogOpen, setIsUnidadesDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ItemCatalogo | null>(null);
    const [unidadToEdit, setUnidadToEdit] = useState<
    NonNullable<ItemCatalogo['unidades']>[number] | null
    >(null);

    const [unidadSubLaboratorioId, setUnidadSubLaboratorioId] = useState('');
    const [unidadEstado, setUnidadEstado] = useState('');
    const [unidadNumeroSerie, setUnidadNumeroSerie] = useState('');
    const [unidadNumeroSerieError, setUnidadNumeroSerieError] = useState('');
    const [itemToPrepare, setItemToPrepare] = useState<ItemCatalogo | null>(null);
    const [isScannerDialogOpen, setIsScannerDialogOpen] = useState(false);
    const [scannerResult, setScannerResult] = useState<ScannerResult | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [search, setSearch] = useState('');
    const [categoriaId, setCategoriaId] = useState('all');
    const [tipo, setTipo] = useState<TipoFilter>('todos');
    const [subLaboratorioId, setSubLaboratorioId] = useState('all');
    const [estado, setEstado] = useState('all');

    const { data, setData, post, put, processing, errors, reset } = useForm({
    codigo: '',
    nombre: '',
    categoria_id: '',
    modelo: '',
    descripcion: '',
    es_serializado: false,
    });

    const estados = [
    'Disponible',
    'En Préstamo',
    'En Mantenimiento',
    'Dañado',
    'Perdido',
];

    const filteredItems = useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase();

        return items.filter((item) => {
            const matchesSearch =
                normalizedSearch === '' ||
                [item.codigo, item.nombre, item.modelo, item.descripcion].some(
                    (value) =>
                        value
                            ?.toLocaleLowerCase()
                            .includes(normalizedSearch),
                );
            const matchesCategoria =
                categoriaId === 'all' ||
                item.categoria.id.toString() === categoriaId;
            const matchesTipo =
                tipo === 'todos' ||
                (tipo === 'serializados' && item.es_serializado) ||
                (tipo === 'granel' && !item.es_serializado);
            const matchesSubLaboratorio =
                subLaboratorioId === 'all' ||
                (item.unidades ?? []).some(
                    (unidad) =>
                        unidad.sub_laboratorio?.id.toString() ===
                        subLaboratorioId,
                );
            const matchesEstado =
                estado === 'all' ||
                (item.unidades ?? []).some(
                    (unidad) => unidad.estado === estado,
                );

            return (
                matchesSearch &&
                matchesCategoria &&
                matchesTipo &&
                matchesSubLaboratorio &&
                matchesEstado
            );
        });
    }, [categoriaId, estado, items, search, subLaboratorioId, tipo]);

    const clearFilters = (): void => {
        setSearch('');
        setCategoriaId('all');
        setTipo('todos');
        setSubLaboratorioId('all');
        setEstado('all');
    };

    const openUnits = (item: ItemCatalogo): void => {
        setSelectedItem(item);
        setIsUnidadesDialogOpen(true);
    };

    const openEditUnidad = (
        unidad: NonNullable<ItemCatalogo['unidades']>[number],
    ): void => {
        setUnidadToEdit(unidad);
        setUnidadNumeroSerie(unidad.numero_serie_barras);
        setUnidadNumeroSerieError('');
        setUnidadSubLaboratorioId(unidad.sub_laboratorio.id.toString());
        setUnidadEstado(
            unidad.estado === 'Mantenimiento'
                ? 'En Mantenimiento'
                : unidad.estado || 'Disponible',
        );
    };

    const guardarUnidad = (): void => {
        setUnidadNumeroSerieError('');
        if (!unidadToEdit) {
            return;
        }

        router.put(
            `/admin/catalogo/unidades/${unidadToEdit.id}/editar`,
           {
                numero_serie_barras: unidadNumeroSerie,
                sub_laboratorio_id: Number(unidadSubLaboratorioId),
                estado: unidadEstado,
            },
            {
                preserveScroll: true,
                onError: (errors) => {
                    if (errors.numero_serie_barras) {
                        setUnidadNumeroSerieError(
                            'Este número de serie ya está registrado.',
                        );
                    }
                },
                    onSuccess: () => {
                        if (selectedItem && unidadToEdit) {
                            setSelectedItem({
                                ...selectedItem,
                                unidades: selectedItem.unidades?.map((unidad) =>
                                    unidad.id === unidadToEdit.id
                                        ? {
                                            ...unidad,
                                            numero_serie_barras: unidadNumeroSerie,
                                            estado: unidadEstado,
                                            sub_laboratorio:
                                                subLaboratorios.find(
                                                    (sub) =>
                                                        sub.id ===
                                                        Number(unidadSubLaboratorioId),
                                                ) ?? unidad.sub_laboratorio,
                                        }
                                        : unidad,
                            ),
                            });
                        }
    setUnidadToEdit(null);
    setUnidadSubLaboratorioId('');
    setUnidadEstado('');
                },
            },
        );
    };

    const eliminarUnidad = (
        unidad: NonNullable<ItemCatalogo['unidades']>[number],
    ): void => {
        const confirmado = window.confirm(
            `¿Está seguro de eliminar la unidad ${unidad.numero_serie_barras}?`,
        );

        if (!confirmado) {
            return;
        }

        router.delete(`/admin/catalogo/unidades/${unidad.id}`, {
            preserveScroll: true,
        });
    };
    const printUnidad = (
        item: ItemCatalogo,
        unidad: NonNullable<ItemCatalogo['unidades']>[number],
    ): void => {
        const barcode = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg',
        );

        JsBarcode(barcode, unidad.numero_serie_barras, {
            format: 'CODE128',
            displayValue: true,
            fontSize: 14,
            height: 55,
            margin: 8,
        });

        const printWindow = window.open('', '_blank', 'width=700,height=500');

        if (!printWindow) {
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Etiqueta ${unidad.numero_serie_barras}</title>
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

                        svg {
                            margin-top: 12px;
                            max-width: 100%;
                        }

                        @media print {
                            body {
                                padding: 0;
                            }
                        }
                    </style>
                </head>

                <body>
                    <div class="etiqueta">
                        <h2>${item.nombre}</h2>
                        <p>Modelo: ${item.modelo ?? 'No aplica'}</p>
                        <p>Serial: ${unidad.numero_serie_barras}</p>
                        <p>
                            Sublaboratorio:
                            ${unidad.sub_laboratorio?.nombre ?? 'No asignado'}
                        </p>

                        ${barcode.outerHTML}
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    };
    const printCatalogo = (): void => {
    const printWindow = window.open('', '_blank', 'width=1000,height=700');

    if (!printWindow) {
        return;
    }

    const filas = filteredItems
        .map((item) => {
            const unidades = item.unidades ?? [];

            const seriales = item.es_serializado
                ? unidades.length > 0
                    ? unidades
                          .map(
                              (unidad) =>
                                  `${unidad.numero_serie_barras} - ${unidad.sub_laboratorio?.nombre ?? 'Sin sublaboratorio'} - ${unidad.estado}`,
                          )
                          .join('<br>')
                    : 'Sin unidades registradas'
                : 'No aplica (Consumible)';

            return `
                <tr>
                    <td>${item.codigo}</td>
                    <td>${item.nombre}</td>
                    <td>${item.categoria.nombre}</td>
                    <td>${item.modelo ?? 'No aplica'}</td>
                    <td>${item.es_serializado ? 'Serializado' : 'Consumible'}</td>
                    <td>${seriales}</td>
                </tr>
            `;
        })
        .join('');

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Catálogo de herramientas</title>

                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 24px;
                        color: #111;
                    }

                    h1 {
                        margin-bottom: 4px;
                    }

                    .fecha {
                        margin-top: 0;
                        margin-bottom: 24px;
                        color: #555;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 12px;
                    }

                    th,
                    td {
                        border: 1px solid #999;
                        padding: 8px;
                        text-align: left;
                        vertical-align: top;
                    }

                    th {
                        background: #eee;
                    }

                    @media print {
                        body {
                            padding: 0;
                        }

                        thead {
                            display: table-header-group;
                        }

                        tr {
                            break-inside: avoid;
                        }
                    }
                </style>
            </head>

            <body>
                <h1>Catálogo general de ítems</h1>

                <p class="fecha">
                    Total de ítems: ${filteredItems.length}
                </p>

                <table>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Herramienta / Ítem</th>
                            <th>Categoría</th>
                            <th>Modelo</th>
                            <th>Tipo</th>
                            <th>Unidades / Seriales</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${filas}
                    </tbody>
                </table>
            </body>
        </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
    };
};
const exportCatalogoExcel = (): void => {
    const datos = filteredItems.flatMap((item) => {
        const unidades = item.unidades ?? [];

        if (item.es_serializado && unidades.length > 0) {
            return unidades.map((unidad) => ({
                Código: item.codigo,
                Herramienta: item.nombre,
                Categoría: item.categoria.nombre,
                Modelo: item.modelo ?? 'No aplica',
                Tipo: 'Serializado',
                Serial: unidad.numero_serie_barras,
                Sublaboratorio:
                    unidad.sub_laboratorio?.nombre ?? 'Sin sublaboratorio',
                Estado: unidad.estado,
            }));
        }

        return [
            {
                Código: item.codigo,
                Herramienta: item.nombre,
                Categoría: item.categoria.nombre,
                Modelo: item.modelo ?? 'No aplica',
                Tipo: item.es_serializado ? 'Serializado' : 'Consumible',
                Serial: item.es_serializado
                    ? 'Sin unidades registradas'
                    : 'No aplica',
                Sublaboratorio: 'No aplica',
                Estado: 'No aplica',
            },
        ];
    });

    const hoja = XLSX.utils.json_to_sheet(datos);

    hoja['!cols'] = [
        { wch: 14 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 22 },
        { wch: 28 },
        { wch: 20 },
    ];

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        'Catálogo',
    );

    XLSX.writeFile(
        libro,
        'catalogo-herramientas.xlsx',
    );
};

    function openEdit(item: ItemCatalogo): void {
        setSelectedItem(item);
        setData({
            codigo: item.codigo,
            nombre: item.nombre,
            categoria_id: item.categoria.id.toString(),
            modelo: item.modelo || '',
            descripcion: item.descripcion || '',
            es_serializado: item.es_serializado,
        });
        setIsDialogOpen(true);
    }

    const deleteItem = (item: ItemCatalogo): void => {
        if (
            confirm(
                '¿Estás seguro de que deseas eliminar este ítem? Esta acción no se puede deshacer.',
            )
        ) {
            router.delete(`/admin/catalogo/${item.id}`);
        }
    };

    const renderItemActions = (item: ItemCatalogo) => (
        <div className="flex justify-end gap-2">
            {item.es_serializado && (
                <>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Ver unidades de ${item.nombre}`}
                                onClick={() => openUnits(item)}
                            >
                                <List className="size-4 text-indigo-600" />
                                </Button>
                        </TooltipTrigger>

                        <TooltipContent className="max-w-64 rounded-xl">
                            Ver las unidades físicas y seriales registrados de esta herramienta.
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Registrar unidad serializada de ${item.nombre}`}
                                onClick={() => setItemToPrepare(item)}
                            >
                                <Barcode className="size-4 text-indigo-600" />
                            </Button>
                        </TooltipTrigger>

                        <TooltipContent className="max-w-64 rounded-xl">
                            Registrar una nueva unidad física y generar automáticamente su serial.
                        </TooltipContent>
                    </Tooltip>
                </>
            )}

            <Button
                type="button"
                variant="ghost"
                size="icon"
                title="Editar ítem"
                onClick={() => openEdit(item)}
            >
                <Edit className="size-4" />
            </Button>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                title="Eliminar ítem"
                onClick={() => deleteItem(item)}
            >
                <Trash2 className="size-4 text-destructive" />
            </Button>
        </div>
    );

    return (
        <>
            <Head title="Catálogo de ítems" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <CatalogoLaboratorioTabs />

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Catálogo general de ítems
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Registra y administra las herramientas y materiales
                            disponibles en los laboratorios.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={printCatalogo}
                            disabled={filteredItems.length === 0}
                        >
                            <Printer className="size-4" />
                            Imprimir catálogo
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={exportCatalogoExcel}
                            disabled={filteredItems.length === 0}
                        >
                            Exportar Excel
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setIsScannerDialogOpen(true)}
                        >
                            <Barcode className="size-4" />
                            Escanear herramienta
                        </Button>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <Button
                            type="button"
                            onClick={() => {
                                setSelectedItem(null);
                                reset();
                                setIsDialogOpen(true);
                            }}
                        >
                            <Plus className="size-4" />
                            Nuevo ítem
                        </Button>

                        <DialogContent>
                            <form
                            onSubmit={(event) => {
                                event.preventDefault();

                                if (selectedItem) {
                                    put(`/admin/catalogo/${selectedItem.id}`, {
                                        onSuccess: () => {
                                            reset();
                                            setIsDialogOpen(false);
                                        },
                                    });
                                } else {
                                    post('/admin/catalogo', {
                                        onSuccess: () => {
                                            reset();
                                            setIsDialogOpen(false);
                                        },
                                    });
                                }
                            }}
                            >
                                <DialogHeader>
                                    <DialogTitle>
                                        {selectedItem
                                            ? 'Editar ítem'
                                            : 'Nuevo ítem'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {selectedItem
                                            ? 'Actualiza los datos del ítem seleccionado.'
                                            : 'Completa los datos para registrar un nuevo ítem en el catálogo.'}
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="codigo-interno">
                                            Código interno
                                            <span
                                                className="text-destructive"
                                                aria-hidden="true"
                                            >
                                                {' '}
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="codigo-interno"
                                            name="codigo"
                                            placeholder="Ej. MEC-004"
                                            value={data.codigo}
                                            onChange={(e) => setData('codigo', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="nombre">
                                            Nombre
                                            <span
                                                className="text-destructive"
                                                aria-hidden="true"
                                            >
                                                {' '}
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="nombre"
                                            name="nombre"
                                            placeholder="Nombre del ítem"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="categoria">
                                            Categoría
                                            <span
                                                className="text-destructive"
                                                aria-hidden="true"
                                            >
                                                {' '}
                                                *
                                            </span>
                                        </Label>
                                            <Select
                                                value={data.categoria_id}
                                                onValueChange={(value) => setData('categoria_id', value)}
                                                required
                                            >
                                                <SelectTrigger
                                                    id="categoria"
                                                    className="w-full"
                                                >
                                                    <SelectValue placeholder="Selecciona una categoría" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {categorias.map((categoria) => (
                                                        <SelectItem
                                                            key={categoria.id}
                                                            value={categoria.id.toString()}
                                                        >
                                                            {categoria.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="modelo">
                                            Modelo o referencia
                                            <span
                                                className="text-destructive"
                                                aria-hidden="true"
                                            >
                                                {' '}
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="modelo"
                                            name="modelo"
                                            placeholder="Ej.: Stanley 87-369, 10 pulgadas o No aplica"
                                            value={data.modelo}
                                            onChange={(e) => setData('modelo', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="descripcion">
                                            Descripción
                                            <span
                                                className="text-destructive"
                                                aria-hidden="true"
                                            >
                                                {' '}
                                                *
                                            </span>
                                        </Label>
                                        <Textarea
                                            id="descripcion"
                                            name="descripcion"
                                            placeholder="Describe brevemente el ítem"
                                            value={data.descripcion}
                                            onChange={(e) => setData('descripcion', e.target.value)}
                                            required
                                        />
                                    </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="tipo-item">
                                                Tipo de ítem
                                                <span className="text-destructive" aria-hidden="true">
                                                    {' '}*
                                                </span>
                                            </Label>

                                            <Select
                                                value={data.es_serializado ? 'serializado' : 'granel'}
                                                onValueChange={(value) =>
                                                    setData('es_serializado', value === 'serializado')
                                                }
                                            >
                                                <SelectTrigger id="tipo-item" className="w-full">
                                                    <SelectValue placeholder="Selecciona el tipo de ítem" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="serializado">Serializado</SelectItem>
                                                    <SelectItem value="granel">Consumible</SelectItem>
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
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Guardando...'
                                            : selectedItem
                                            ? 'Guardar cambios'
                                            : 'Guardar ítem'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="space-y-4 rounded-xl border bg-card p-4 shadow-xs">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-medium">Filtros del inventario</h2>
                            <p className="text-sm text-muted-foreground">
                                Encuentra ítems por sus datos o unidades registradas.
                            </p>
                        </div>

                        <div className="inline-flex self-start rounded-lg border bg-muted/40 p-1 sm:self-auto">
                            <Button
                                type="button"
                                size="sm"
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                onClick={() => setViewMode('grid')}
                                aria-pressed={viewMode === 'grid'}
                            >
                                <LayoutGrid className="size-4" />
                                Grid
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                onClick={() => setViewMode('list')}
                                aria-pressed={viewMode === 'list'}
                            >
                                <List className="size-4" />
                                Lista
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
                        <div className="grid min-w-0 gap-2 md:col-span-2 xl:col-span-2">
                            <Label htmlFor="catalogo-search">Buscar</Label>
                            <div className="relative min-w-0">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="catalogo-search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Código, nombre, modelo o descripción"
                                    className="min-w-0 pl-9"
                                />
                            </div>
                        </div>

                        <div className="grid min-w-0 gap-2">
                            <Label>Categoría</Label>
                            <Select value={categoriaId} onValueChange={setCategoriaId}>
                                <SelectTrigger className="w-full min-w-0 [&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:truncate [&_svg]:shrink-0">
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    {categorias.map((categoria) => (
                                        <SelectItem
                                            key={categoria.id}
                                            value={categoria.id.toString()}
                                        >
                                            {categoria.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid min-w-0 gap-2">
                            <Label>Tipo</Label>
                            <Select
                                value={tipo}
                                onValueChange={(value: TipoFilter) => setTipo(value)}
                            >
                                <SelectTrigger className="w-full min-w-0 [&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:truncate [&_svg]:shrink-0">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    <SelectItem value="serializados">Serializados</SelectItem>
                                    <SelectItem value="granel">Consumible</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid min-w-0 gap-2">
                            <Label>Sublaboratorio</Label>
                            <Select
                                value={subLaboratorioId}
                                onValueChange={setSubLaboratorioId}
                            >
                                <SelectTrigger className="w-full min-w-0 [&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:truncate [&_svg]:shrink-0">
                                    <SelectValue placeholder="Sublaboratorio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
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
                            <Label>Estado</Label>
                            <Select value={estado} onValueChange={setEstado}>
                                <SelectTrigger className="w-full min-w-0 [&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:truncate [&_svg]:shrink-0">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {estados.map((estadoOption) => (
                                        <SelectItem key={estadoOption} value={estadoOption}>
                                            {estadoOption}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="button" variant="outline" onClick={clearFilters}>
                            Limpiar filtros
                        </Button>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="rounded-xl border bg-card shadow-xs">
                        <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
                            <PackageOpen className="size-10 text-muted-foreground" />

                            <div>
                                <p className="font-medium">No hay ítems registrados</p>

                                <p className="text-sm text-muted-foreground">
                                    Registra el primer ítem del catálogo.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex min-h-64 items-center justify-center rounded-xl border bg-card p-6 text-center shadow-xs">
                        <div className="space-y-2">
                            <PackageOpen className="mx-auto size-10 text-muted-foreground" />
                            <p className="font-medium">
                                No se encontraron resultados con los filtros seleccionados
                            </p>
                        </div>
                    </div>
                ) : viewMode === 'list' ? (
                    <div className="overflow-x-auto rounded-xl border bg-card shadow-xs">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Modelo o referencia</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead className="text-right">Imprimir</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.codigo}
                                        </TableCell>
                                        <TableCell>{item.nombre}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {item.categoria.nombre}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{item.modelo ?? 'No aplica'}</TableCell>
                                        <TableCell className="max-w-sm whitespace-normal text-muted-foreground">
                                            {item.descripcion ?? 'Sin descripción'}
                                        </TableCell>
                                        <TableCell>{renderItemActions(item)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredItems.map((item) => {
                            const unidades = item.unidades ?? [];
                            const nombresSubLaboratorios = Array.from(
                                new Set(
                                    unidades
                                        .map(
                                            (unidad) =>
                                                unidad.sub_laboratorio?.nombre,
                                        )
                                        .filter((nombre): nombre is string => Boolean(nombre)),
                                ),
                            );
                            const estadosItem = Array.from(
                                new Set(unidades.map((unidad) => unidad.estado)),
                            );

                            return (
                                <article
                                    key={item.id}
                                    className="flex flex-col rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300">
                                                <PackageOpen className="size-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-medium text-muted-foreground">
                                                    {item.codigo}
                                                </p>
                                                <h2 className="truncate font-semibold">
                                                    {item.nombre}
                                                </h2>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="shrink-0">
                                            {item.categoria.nombre}
                                        </Badge>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Badge variant="outline">
                                            {item.es_serializado
                                                ? 'Serializado'
                                                : 'Consumible'}
                                        </Badge>
                                        <Badge variant="outline">
                                            {unidades.length}{' '}
                                            {unidades.length === 1 ? 'unidad' : 'unidades'}
                                        </Badge>
                                    </div>

                                    {!item.es_serializado && (
                                        <p className="mt-3 text-xs text-muted-foreground">
                                            Control por cantidades; no requiere código individual.
                                        </p>
                                    )}

                                    <dl className="mt-4 grid gap-3 text-sm">
                                        <div>
                                            <dt className="text-xs font-medium text-muted-foreground">
                                                Modelo o referencia
                                            </dt>
                                            <dd>{item.modelo ?? 'No aplica'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-medium text-muted-foreground">
                                                Sublaboratorios
                                            </dt>
                                            <dd className="mt-1 flex flex-wrap gap-1">
                                                {nombresSubLaboratorios.length > 0
                                                    ? nombresSubLaboratorios.map((nombre) => (
                                                          <Badge
                                                              key={nombre}
                                                              variant="outline"
                                                          >
                                                              {nombre}
                                                          </Badge>
                                                      ))
                                                    : 'Sin unidades registradas'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs font-medium text-muted-foreground">
                                                Estados disponibles
                                            </dt>
                                            <dd className="mt-1 flex flex-wrap gap-1">
                                                {estadosItem.length > 0
                                                    ? estadosItem.map((estadoItem) => (
                                                          <Badge
                                                              key={estadoItem}
                                                              variant="secondary"
                                                          >
                                                              {estadoItem}
                                                          </Badge>
                                                      ))
                                                    : 'Sin unidades registradas'}
                                            </dd>
                                        </div>
                                    </dl>

                                    <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">
                                        {item.descripcion ?? 'Sin descripción'}
                                    </p>

                                    <div className="mt-auto border-t pt-4">
                                        {renderItemActions(item)}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                <p className="text-sm text-muted-foreground">
                    Mostrando {filteredItems.length} de {items.length} ítems.
                </p>

                {/* Modal de Unidades Serializadas */}
                <Dialog open={isUnidadesDialogOpen} onOpenChange={setIsUnidadesDialogOpen}>
                   <DialogContent className="max-h-[85vh] sm:max-w-5xl overflow-hidden">
                        <DialogHeader>
                            <DialogTitle>
                                Unidades de {selectedItem?.nombre}
                            </DialogTitle>
                            <DialogDescription>
                                Gestiona el estado de las unidades individuales de esta herramienta.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 max-h-[55vh] overflow-y-auto overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nro de Serie</TableHead>
                                        <TableHead>Sub-Laboratorio</TableHead>
                                        <TableHead>Estado Actual</TableHead>
                                        <TableHead>Cambiar Estado</TableHead>
                                        <TableHead className="text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedItem?.unidades?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                                                No hay unidades registradas para esta herramienta.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        selectedItem?.unidades?.map((unidad) => {
                                            const estadoNormalizado =
                                                unidad.estado === 'Mantenimiento'
                                                    ? 'En Mantenimiento'
                                                    : unidad.estado || 'Disponible';

                                            return (
                                            <TableRow key={unidad.id}>
                                                <TableCell className="font-medium">{unidad.numero_serie_barras}</TableCell>
                                                <TableCell>{unidad.sub_laboratorio?.nombre}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            estadoNormalizado === 'Disponible'
                                                                ? 'default'
                                                                : estadoNormalizado === 'Dañado' || estadoNormalizado === 'Perdido'
                                                                    ? 'destructive'
                                                                    : 'secondary'
                                                        }
                                                    >
                                                        {estadoNormalizado}
                                                    </Badge>
                                                </TableCell>
                                               <TableCell>
                                                    <Select
                                                        value={estadoNormalizado}
                                                        onValueChange={(val) => {
                                                            router.patch(
                                                                `/admin/catalogo/unidades/${unidad.id}`,
                                                                { estado: val },
                                                                {
                                                                    preserveScroll: true,
                                                                        onSuccess: () => {
                                                                            if (selectedItem) {
                                                                                setSelectedItem({
                                                                                    ...selectedItem,
                                                                                    unidades: selectedItem.unidades?.map(
                                                                                        (unidadActual) =>
                                                                                            unidadActual.id === unidad.id
                                                                                                ? {
                                                                                                    ...unidadActual,
                                                                                                    estado: val,
                                                                                                }
                                                                                                : unidadActual,
                                                                                    ),
                                                                                });
                                                                            }
                                                                        },
                                                                },
                                                            );
                                                        }}
                                                    >
                                                        <SelectTrigger className="h-8 w-[180px] text-xs">
                                                            <SelectValue placeholder="Seleccionar estado">
                                                                {estadoNormalizado}
                                                            </SelectValue>
                                                        </SelectTrigger>

                                                        <SelectContent>
                                                            <SelectItem value="Disponible">
                                                                Disponible
                                                            </SelectItem>
                                                            <SelectItem value="En Préstamo">
                                                                En Préstamo
                                                            </SelectItem>
                                                            <SelectItem value="En Mantenimiento">
                                                                En Mantenimiento
                                                            </SelectItem>
                                                            <SelectItem value="Dañado">
                                                                Dañado
                                                            </SelectItem>
                                                            <SelectItem value="Perdido">
                                                                Perdido
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title={`Editar unidad ${unidad.numero_serie_barras}`}
                                                        aria-label={`Editar unidad ${unidad.numero_serie_barras}`}
                                                        onClick={() => openEditUnidad(unidad)}
                                                    >
                                                        <Edit className="size-4" />
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title={`Eliminar unidad ${unidad.numero_serie_barras}`}
                                                        aria-label={`Eliminar unidad ${unidad.numero_serie_barras}`}
                                                        onClick={() => eliminarUnidad(unidad)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        title={`Imprimir etiqueta ${unidad.numero_serie_barras}`}
                                                        aria-label={`Imprimir etiqueta ${unidad.numero_serie_barras}`}
                                                        onClick={() => {
                                                            if (selectedItem) {
                                                                printUnidad(selectedItem, unidad);
                                                            }
                                                        }}
                                                    >
                                                        <Printer className="size-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={unidadToEdit !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            setUnidadToEdit(null);
                            setUnidadSubLaboratorioId('');
                            setUnidadEstado('');
                        }
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Editar unidad</DialogTitle>
                            <DialogDescription>
                                Modifica el sublaboratorio o el estado de esta unidad.
                            </DialogDescription>
                        </DialogHeader>

                        {unidadToEdit && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Número de serie</Label>
                                    <Input
                                        value={unidadNumeroSerie}
                                        onChange={(e) => setUnidadNumeroSerie(e.target.value)}
                                        placeholder="Ingrese el número de serie"
                                    />
                                    {unidadNumeroSerieError && (
    <p className="text-sm text-destructive">
        {unidadNumeroSerieError}
    </p>
)}
                                </div>

                                <div className="space-y-2">
                                    <Label>Sub-Laboratorio</Label>
                                    <Select
                                        value={unidadSubLaboratorioId}
                                        onValueChange={setUnidadSubLaboratorioId}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccione un sublaboratorio" />
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

                                <div className="space-y-2">
                                    <Label>Estado</Label>
                                    <Select
                                        value={unidadEstado}
                                        onValueChange={setUnidadEstado}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccione un estado" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {estados.map((estadoOption) => (
                                                <SelectItem
                                                    key={estadoOption}
                                                    value={estadoOption}
                                                >
                                                    {estadoOption}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setUnidadToEdit(null);
                                    setUnidadSubLaboratorioId('');
                                    setUnidadEstado('');
                                }}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="button"
                                onClick={guardarUnidad}
                                disabled={
                                    !unidadNumeroSerie.trim() ||
                                    !unidadSubLaboratorioId ||
                                    !unidadEstado
                                }
                            >
                                Guardar cambios
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {itemToPrepare && (
                    <UnidadIdentificacionDialog
                        open
                        onOpenChange={(open) => {
                            if (!open) {
                                setItemToPrepare(null);
                            }
                        }}
                        item={itemToPrepare}
                        subLaboratorios={subLaboratorios}
                        estados={estados}
                    />
                )}

                <HerramientaScannerDialog
                    open={isScannerDialogOpen}
                    onOpenChange={setIsScannerDialogOpen}
                    items={items}
                    onFound={setScannerResult}
                />

                {scannerResult && (
                    <HerramientaFichaDialog
                        open
                        onOpenChange={(open) => {
                            if (!open) {
                                setScannerResult(null);
                            }
                        }}
                        result={scannerResult}
                    />
                )}
            </div>
        </>
    );
}

CatalogoIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Catálogo',
            href: '/admin/catalogo',
        },
    ],
};
