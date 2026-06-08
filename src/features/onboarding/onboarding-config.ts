import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  CalendarRange,
  ClipboardList,
  Compass,
  LayoutDashboard,
  MapPinned,
  Plus,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Users,
  Wallet,
} from 'lucide-react'

export type StepPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center'

export interface TourStep {
  id: string
  /** CSS selector for the anchor element. When `null`, the step is centered. */
  target: string | null
  icon: LucideIcon
  title: string
  body: string
  placement: StepPlacement
  /** Extra padding around the spotlight cutout (px). */
  padding?: number
}

export const DASHBOARD_TOUR_ID = 'dashboard'

/** Tour shown on the user's first visit to /dashboard. */
const DASHBOARD_STEPS: TourStep[] = [
  {
    id: 'welcome',
    target: null,
    icon: Sparkles,
    title: 'Bienvenido a Campo Track',
    body: 'Te muestro la app en 30 segundos. Cada paso explica qué podés hacer y para qué sirve. Podés saltar cuando quieras.',
    placement: 'center',
  },
  {
    id: 'sidebar',
    target: '[data-tour="sidebar"]',
    icon: Compass,
    title: 'Tu navegación',
    body: 'Desde acá entrás a tus campos, registros, calendario, equipo y configuración. Cada sección te va a mostrar su propio mini-tutorial la primera vez.',
    placement: 'right',
    padding: 8,
  },
  {
    id: 'filter',
    target: '[data-tour="filter"]',
    icon: SlidersHorizontal,
    title: 'Filtro global',
    body: 'Acotá lo que ves en toda la app por campaña activa y por campo.',
    placement: 'bottom',
    padding: 6,
  },
  {
    id: 'kpis',
    target: '[data-tour="kpis"]',
    icon: LayoutDashboard,
    title: 'El pulso de tu producción',
    body: 'Hectáreas en producción, campañas activas, próximos eventos y los que ya están atrasados — todo de un vistazo.',
    placement: 'bottom',
    padding: 10,
  },
  {
    id: 'fields',
    target: '[data-tour="fields"]',
    icon: MapPinned,
    title: 'Estado de tus campos',
    body: 'Cada campo con su campaña actual, próximo evento y alertas. Hacé clic en uno para ver su detalle completo.',
    placement: 'top',
    padding: 10,
  },
  {
    id: 'events',
    target: '[data-tour="events"]',
    icon: CalendarRange,
    title: 'Lo que se viene',
    body: 'Lo vencido en rojo, lo próximo abajo. Cada evento te lleva directo al calendario.',
    placement: 'left',
    padding: 10,
  },
  {
    id: 'fab',
    target: '[data-tour="fab"]',
    icon: Plus,
    title: 'Cargar registro',
    body: 'El botón más importante: registrá lo que pasó en el campo hoy. Funciona offline y sincroniza solo.',
    placement: 'top',
    padding: 12,
  },
  {
    id: 'done',
    target: null,
    icon: Sprout,
    title: 'Listo para empezar',
    body: 'Te recomiendo arrancar cargando tu primer campo o un registro de prueba. Cada sección te va a guiar la primera vez que entres.',
    placement: 'center',
  },
]

/** Section tours — each runs the first time the user visits that route. */
const CAMPOS_STEPS: TourStep[] = [
  {
    id: 'intro',
    target: '[data-tour="page-header"]',
    icon: Sprout,
    title: 'Campos y campañas',
    body: 'Acá administrás tus campos, sus subdivisiones, los clientes asociados y las campañas activas o históricas.',
    placement: 'bottom',
    padding: 8,
  },
  {
    id: 'create',
    target: '[data-tour="primary-action"]',
    icon: Plus,
    title: 'Crear un campo nuevo',
    body: 'Desde acá agregás un campo: nombre, ubicación y hectáreas. Luego le sumás subdivisiones y campañas.',
    placement: 'left',
    padding: 8,
  },
]

const CALENDARIO_STEPS: TourStep[] = [
  {
    id: 'intro',
    target: '[data-tour="page-header"]',
    icon: CalendarRange,
    title: 'Calendario operativo',
    body: 'Todos los eventos planificados y ejecutados en tus campos: siembras, aplicaciones, cosechas, lluvias y observaciones.',
    placement: 'bottom',
    padding: 8,
  },
  {
    id: 'view',
    target: '[data-tour="calendar-body"]',
    icon: SlidersHorizontal,
    title: 'Filtrá y agendá',
    body: 'Filtrá por tipo, campo o campaña. Hacé clic en una fecha para planificar un nuevo evento.',
    placement: 'top',
    padding: 10,
  },
]

const REGISTROS_STEPS: TourStep[] = [
  {
    id: 'intro',
    target: '[data-tour="page-header"]',
    icon: ClipboardList,
    title: 'Registros del día',
    body: 'Todo lo que se hizo en el campo: aplicaciones, observaciones, lluvias y más. Lo cargado offline aparece acá una vez sincronizado.',
    placement: 'bottom',
    padding: 8,
  },
  {
    id: 'fab',
    target: '[data-tour="fab"]',
    icon: Plus,
    title: 'Cargar un registro',
    body: 'Usá el botón flotante para cargar un nuevo registro desde cualquier pantalla. Es la acción central de tu día a día.',
    placement: 'top',
    padding: 12,
  },
]

const EQUIPO_STEPS: TourStep[] = [
  {
    id: 'intro',
    target: '[data-tour="page-header"]',
    icon: Users,
    title: 'Equipo y permisos',
    body: 'Invitá miembros (técnicos, asesores) y productores. Cada uno tiene acceso solo a los campos que vos definas.',
    placement: 'bottom',
    padding: 8,
  },
  {
    id: 'invite',
    target: '[data-tour="primary-action"]',
    icon: ShieldCheck,
    title: 'Invitar y auditar',
    body: 'Invitá nuevos integrantes desde acá. En la pestaña Auditoría revisás todo lo que cada usuario tocó.',
    placement: 'left',
    padding: 8,
  },
]

const FINANCIERO_STEPS: TourStep[] = [
  {
    id: 'intro',
    target: '[data-tour="page-header"]',
    icon: Wallet,
    title: 'Finanzas',
    body: 'Resumen mensual de ingresos, egresos y rentabilidad por campaña. La carga de movimientos se hace desde los registros.',
    placement: 'bottom',
    padding: 8,
  },
]

const ANALISIS_STEPS: TourStep[] = [
  {
    id: 'intro',
    target: '[data-tour="page-header"]',
    icon: BarChart3,
    title: 'Análisis y recomendaciones',
    body: 'Tendencias de rinde, comparativas entre campañas y sugerencias automáticas en función de tus datos cargados.',
    placement: 'bottom',
    padding: 8,
  },
]

const CONFIGURACION_STEPS: TourStep[] = [
  {
    id: 'intro',
    target: '[data-tour="page-header"]',
    icon: Settings,
    title: 'Tu cuenta',
    body: 'Editá tu perfil, ajustá las notificaciones (qué te avisamos y cuándo) y, si sos administrador, mantenés el catálogo de cultivos.',
    placement: 'bottom',
    padding: 8,
  },
]

export const TOURS: Record<string, TourStep[]> = {
  dashboard: DASHBOARD_STEPS,
  campos: CAMPOS_STEPS,
  calendario: CALENDARIO_STEPS,
  registros: REGISTROS_STEPS,
  equipo: EQUIPO_STEPS,
  financiero: FINANCIERO_STEPS,
  analisis: ANALISIS_STEPS,
  configuracion: CONFIGURACION_STEPS,
}

/** Maps an exact pathname to the tour that should auto-start on first visit. */
export const ROUTE_TO_TOUR: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/campos': 'campos',
  '/calendario': 'calendario',
  '/registros': 'registros',
  '/equipo': 'equipo',
  '/financiero': 'financiero',
  '/analisis': 'analisis',
  '/configuracion': 'configuracion',
}
