import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  PawPrint,
  Settings,
  Sprout,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { UserRole } from '@/types/api/common'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  /** Roles allowed to see this section. Omit to allow every role. */
  roles?: UserRole[]
  /** Sections not yet implemented are shown disabled with a "Próximamente" hint. */
  disabled?: boolean
  /** Phase 2 sections (ganadería) are flagged for the badge. */
  phase2?: boolean
}

/**
 * Sidebar sections (info.md §4). The sidebar is filtered by role: the producer
 * never sees "Financiero" or "Equipo"; a member sees what its role enables.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Campos y Campañas', href: '/campos', icon: Sprout },
  { label: 'Calendario', href: '/calendario', icon: CalendarDays },
  { label: 'Registros de Campo', href: '/registros', icon: ClipboardList },
  { label: 'Financiero', href: '/financiero', icon: Wallet, roles: ['ADMIN', 'MEMBER'] },
  { label: 'Análisis y Recomendaciones', href: '/analisis', icon: BarChart3 },
  { label: 'Equipo y Permisos', href: '/equipo', icon: Users, roles: ['ADMIN'] },
  { label: 'Ganadería', href: '/ganaderia', icon: PawPrint, disabled: true, phase2: true },
  { label: 'Configuración', href: '/configuracion', icon: Settings },
]

export function navItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter(item => !item.roles || item.roles.includes(role))
}
