import { Link, usePage } from '@inertiajs/react';
import { Boxes, PackageSearch } from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';

export function CatalogoLaboratorioTabs() {
    const { auth } = usePage().props;
    const { isCurrentUrl } = useCurrentUrl();
    const rolNombre = auth.user?.rol?.nombre;
    const tieneAccesoCompleto = ['administrador', 'auxiliar'].includes(
        rolNombre ?? '',
    );

    const tabs = [
        ...(tieneAccesoCompleto
            ? [
                  {
                      title: 'Inventario General',
                      href: '/admin/catalogo',
                      icon: PackageSearch,
                  },
              ]
            : []),
        {
            title: 'Sub-laboratorios',
            href: '/admin/inventario',
            icon: Boxes,
        },
    ];

    return (
        <nav aria-label="Catálogo de Laboratorio" className="overflow-x-auto">
            <div className="flex w-max min-w-full gap-1 rounded-lg border bg-muted/40 p-1 dark:bg-muted/20">
                {tabs.map(({ title, href, icon: Icon }) => {
                    const isActive = isCurrentUrl(href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            prefetch
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                                'inline-flex min-h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                                    : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                            )}
                        >
                            <Icon className="size-4" />
                            <span>{title}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
