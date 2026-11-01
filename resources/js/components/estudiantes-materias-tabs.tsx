import { EstudiantesMateriasTutorial } from '@/components/estudiantes-materias-tutorial';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { BookOpen, GraduationCap } from 'lucide-react';

const tabs = [
    {
        title: 'Estudiantes',
        href: '/admin/estudiantes',
        icon: GraduationCap,
    },
    {
        title: 'Materias',
        href: '/admin/materias',
        icon: BookOpen,
    },
];

export function EstudiantesMateriasTabs() {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            <nav aria-label="Estudiantes y Materias" className="w-full min-w-0 flex-1 overflow-x-auto">
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
                                        : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
                                )}
                            >
                                <Icon className="size-4" />
                                <span>{title}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <EstudiantesMateriasTutorial />
        </div>
    );
}
