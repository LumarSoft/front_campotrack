import type { LucideIcon } from 'lucide-react'
import {
  CalendarRange,
  ClipboardList,
  Coins,
  Compass,
  LayoutDashboard,
  MapPinned,
  Plus,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  Truck,
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
    title: 'Empezá por tus campos',
    body: 'Lo primero es crear los campos sobre los que vas a trabajar. Acá administrás cada campo, sus lotes, los clientes asociados y sus campañas.',
    placement: 'bottom',
    padding: 8,
  },
  {
    id: 'create',
    target: '[data-tour="primary-action"]',
    icon: Plus,
    title: 'Crear un campo nuevo',
    body: 'Cargá nombre y superficie total, y asignale un cliente con el buscador. Después entrás al campo para dividirlo en lotes —cuyas hectáreas deben cerrar con el total— y dar de alta sus campañas.',
    placement: 'left',
    padding: 8,
  },
  {
    id: 'clients',
    target: '[data-tour="clients-action"]',
    icon: Users,
    title: 'Tus clientes',
    body: 'Creá acá los clientes para después asignárselos a cada campo desde el buscador al crearlo.',
    placement: 'left',
    padding: 8,
  },
  {
    id: 'campaigns',
    target: '[data-tour="page-header"]',
    icon: Sprout,
    title: 'Campañas del campo',
    body: 'Entrá a un campo y abrí la pestaña "Campañas" para darlas de alta: cultivo, ciclo, superficie y fecha estimada de finalización.',
    placement: 'bottom',
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
    body: 'Usá el botón flotante para cargar un registro desde cualquier pantalla. Solo elegís el campo y, si tiene, el lote — la campaña es opcional. Es la acción central de tu día a día.',
    placement: 'top',
    padding: 12,
  },
]

const COSTOS_STEPS: TourStep[] = [
  {
    id: 'intro',
    target: '[data-tour="page-header"]',
    icon: Coins,
    title: 'Costos, cultivos y proveedores',
    body: 'Acá centralizás los datos que alimentan tus costos: el catálogo de cultivos y tus proveedores. Los cultivos ya no se cargan desde Configuración.',
    placement: 'bottom',
    padding: 8,
  },
  {
    id: 'tabs',
    target: '[data-tour="costos-tabs"]',
    icon: Truck,
    title: 'Cultivos y proveedores',
    body: 'En "Cultivos" mantenés la lista que vas a usar en las campañas. En "Proveedores" cargás a quién le comprás insumos o servicios para asociarlos a los costos.',
    placement: 'bottom',
    padding: 8,
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

const CONFIGURACION_STEPS: TourStep[] = [
  {
    id: 'intro',
    target: '[data-tour="page-header"]',
    icon: Settings,
    title: 'Tu cuenta',
    body: 'Editá tu perfil y ajustá las notificaciones (qué te avisamos y cuándo). Los cultivos y proveedores ahora se administran en la sección Costos.',
    placement: 'bottom',
    padding: 8,
  },
]

export const TOURS: Record<string, TourStep[]> = {
  dashboard: DASHBOARD_STEPS,
  campos: CAMPOS_STEPS,
  calendario: CALENDARIO_STEPS,
  registros: REGISTROS_STEPS,
  costos: COSTOS_STEPS,
  equipo: EQUIPO_STEPS,
  financiero: FINANCIERO_STEPS,
  configuracion: CONFIGURACION_STEPS,
}

/** Maps an exact pathname to the tour that should auto-start on first visit. */
export const ROUTE_TO_TOUR: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/campos': 'campos',
  '/calendario': 'calendario',
  '/registros': 'registros',
  '/costos': 'costos',
  '/equipo': 'equipo',
  '/financiero': 'financiero',
  '/configuracion': 'configuracion',
}
