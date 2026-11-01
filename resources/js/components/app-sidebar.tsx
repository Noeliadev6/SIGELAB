import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { GraduationCap, HandCoins, LayoutGrid, Settings, ShieldCheck, Users, Wrench } from 'lucide-react';
import { usePage } from '@inertiajs/react';

export function AppSidebar() {
    const page = usePage();
    const { auth } = page.props;
    const rolNombre = auth.user?.rol?.nombre;
    const esAdmin = rolNombre === 'administrador';
    const tieneAccesoInventario = ['administrador', 'docente', 'auxiliar'].includes(rolNombre ?? '');
    const tieneAccesoEstudiantes = ['administrador', 'docente', 'auxiliar'].includes(rolNombre ?? '');
    const catalogoLaboratorioHref = rolNombre === 'docente' ? '/admin/inventario' : '/admin/catalogo';
    const catalogoLaboratorioIsActive = ['/admin/catalogo', '/admin/inventario'].includes(page.url.split('?')[0]);
    const estudiantesMateriasIsActive = ['/admin/estudiantes', '/admin/estudiantes/import', '/admin/materias'].includes(page.url.split('?')[0]);
    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
        ...(tieneAccesoInventario ? [{ title: 'Catálogo de Laboratorio', href: catalogoLaboratorioHref, icon: Wrench, isActive: catalogoLaboratorioIsActive }] : []),
        ...(tieneAccesoEstudiantes ? [{ title: 'Estudiantes y Materias', href: '/admin/estudiantes', icon: GraduationCap, isActive: estudiantesMateriasIsActive }] : []),
        ...(tieneAccesoInventario ? [{ title: 'Préstamos y devoluciones', href: '/admin/prestaciones', icon: HandCoins }] : []),
        ...(esAdmin ? [{ title: 'Usuarios', href: '/admin/usuarios', icon: Users }, { title: 'Roles y Permisos', href: '/admin/roles', icon: ShieldCheck }] : []),
    ];
    const footerNavItems: NavItem[] = [{ title: 'Otras configuraciones', href: '#', icon: Settings }];
    return <Sidebar collapsible="icon" variant="inset"><SidebarHeader><AppLogo /></SidebarHeader><SidebarContent><NavMain items={mainNavItems} /></SidebarContent><SidebarFooter><NavFooter items={footerNavItems} className="mt-auto" /><NavUser /></SidebarFooter></Sidebar>;
}
