import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { BookOpen, CircleHelp, GraduationCap, Info, UploadCloud, UserRound, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type TutorialSectionProps = {
    id: string;
    number: number;
    title: string;
    icon: LucideIcon;
    children: ReactNode;
};

const tutorialNavigation = [
    { number: 1, title: 'Introducción', href: '#tutorial-introduccion' },
    { number: 2, title: 'Estudiantes', href: '#tutorial-estudiantes' },
    { number: 3, title: 'Importación', href: '#tutorial-importacion' },
    { number: 4, title: 'Materias', href: '#tutorial-materias' },
    { number: 5, title: 'Sin registro', href: '#tutorial-personas-sin-registro' },
];

function TutorialSection({ id, number, title, icon: Icon, children }: TutorialSectionProps) {
    return (
        <section id={id} className="min-w-0 scroll-mt-4 rounded-xl border bg-card p-4 shadow-xs sm:p-5">
            <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {number}
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="flex min-w-0 items-center gap-2 text-base font-semibold break-words sm:text-lg">
                        <Icon className="size-5 shrink-0 text-primary" />
                        {title}
                    </h2>
                    <div className="mt-3 text-sm leading-6 break-words text-muted-foreground [overflow-wrap:anywhere]">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function EstudiantesMateriasTutorial() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" className="w-full shrink-0 sm:w-auto">
                    <CircleHelp className="size-4" />
                    Tutorial de uso
                </Button>
            </DialogTrigger>

            <DialogContent className="grid max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-h-[calc(100dvh-2rem)] sm:max-w-5xl">
                <DialogHeader className="min-w-0 border-b px-4 py-4 pr-12 sm:px-6 sm:py-5">
                    <DialogTitle className="flex min-w-0 items-center gap-2 text-lg break-words sm:text-xl">
                        <CircleHelp className="size-5 shrink-0 text-primary" />
                        Tutorial de uso
                    </DialogTitle>
                    <DialogDescription className="break-words [overflow-wrap:anywhere]">
                        Guía rápida para utilizar la sección de Estudiantes y Materias.
                    </DialogDescription>
                </DialogHeader>

                <div className="min-w-0 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6 sm:py-5">
                    <nav
                        aria-label="Secciones del tutorial"
                        className="mb-5 max-w-full overflow-x-auto rounded-xl border p-2"
                    >
                        <ol className="flex min-w-max items-center gap-1">
                            {tutorialNavigation.map((item) => (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        className="inline-flex min-h-9 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:text-sm"
                                    >
                                        <span className="flex size-5 items-center justify-center rounded-full bg-muted text-[0.7rem] font-semibold text-foreground">
                                            {item.number}
                                        </span>
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <div className="grid min-w-0 gap-4 lg:grid-cols-2">
                        <TutorialSection id="tutorial-introduccion" number={1} title="Introducción" icon={Info}>
                            <p>
                                Esta sección permite administrar estudiantes, materias e importaciones desde un mismo
                                espacio de trabajo.
                            </p>
                            <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-100">
                                Asistencias ya no forma parte del sistema y no está incluida en este flujo.
                            </div>
                        </TutorialSection>

                        <TutorialSection
                            id="tutorial-estudiantes"
                            number={2}
                            title="Estudiantes"
                            icon={GraduationCap}
                        >
                            <ol className="grid gap-2">
                                <li>
                                    <span className="font-medium text-foreground">1. Consulta el listado:</span> revisa
                                    nombre, número de registro, carrera y fecha de registro en la tabla.
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">2. Identifica el registro:</span> los
                                    estudiantes sin número universitario muestran “Sin registro”.
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">3. Registro manual:</span> esta acción
                                    está disponible únicamente para el Administrador.
                                </li>
                            </ol>
                        </TutorialSection>

                        <TutorialSection
                            id="tutorial-importacion"
                            number={3}
                            title="Importación"
                            icon={UploadCloud}
                        >
                            <ol className="grid gap-2">
                                <li>
                                    <span className="font-medium text-foreground">1. Selecciona una materia</span> para
                                    asociar la planilla que vas a procesar.
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">2. Elige el archivo:</span> debe ser
                                    XLSX y pesar como máximo 10 MB.
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">3. Verifica las columnas:</span>{' '}
                                    Nombre y Carrera son obligatorias; Número de registro es opcional.
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">4. Revisa el resultado:</span>{' '}
                                    “creados” son nuevos registros, “actualizados” son registros existentes que
                                    cambiaron y los errores indican la fila que no pudo procesarse.
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">5. Antes de repetir:</span> revisa los
                                    errores por fila y corrige la planilla antes de volver a importar.
                                </li>
                            </ol>
                        </TutorialSection>

                        <TutorialSection id="tutorial-materias" number={4} title="Materias" icon={BookOpen}>
                            <ol className="grid gap-2">
                                <li>
                                    <span className="font-medium text-foreground">1. Elige Grid o Lista</span> para
                                    consultar las materias en el formato que prefieras.
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">2. Busca y filtra</span> por los
                                    controles disponibles en la pantalla.
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">3. Revisa sus datos:</span> código,
                                    nombre, módulo, grupo, fechas y estado.
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">4. Creación:</span> registrar una
                                    nueva materia está disponible únicamente para el Administrador. Una materia cuya
                                    fecha de fin ya pasó se presenta como Inactiva.
                                </li>
                            </ol>
                        </TutorialSection>

                        <div className="lg:col-span-2">
                            <TutorialSection
                                id="tutorial-personas-sin-registro"
                                number={5}
                                title="Personas sin registro"
                                icon={UserRound}
                            >
                                <ol className="grid gap-2">
                                    <li>
                                        <span className="font-medium text-foreground">1. Registro:</span> pueden
                                        registrarse sin número universitario.
                                    </li>
                                    <li>
                                        <span className="font-medium text-foreground">2. Acceso:</span> su protocolo de
                                        acceso debe ser validado por el responsable. El registro no implica una
                                        autorización automática de préstamos.
                                    </li>
                                </ol>
                            </TutorialSection>
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t bg-muted/20 px-4 py-3 sm:px-6 sm:py-4">
                    <DialogClose asChild>
                        <Button type="button" className="w-full sm:w-auto">
                            Cerrar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
