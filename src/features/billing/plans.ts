export type BillingCycle = 'monthly' | 'annual'

export interface Plan {
  id: 'starter' | 'pro' | 'enterprise'
  name: string
  tagline: string
  /** Monthly price in USD. `null` means custom / "a medida" pricing. */
  monthly: number | null
  /** Per-month price when billed annually, in USD. `null` means custom. */
  annual: number | null
  /** Featured plan gets visual emphasis and a badge. */
  featured: boolean
  cta: { label: string; href: string }
  features: string[]
}

/** Rough savings shown next to the billing toggle. Illustrative only. */
export const ANNUAL_SAVINGS_LABEL = 'Ahorrás ~20% pagando anual'

/**
 * Example pricing — values and features are a mockup and not final.
 */
export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Para el productor que empieza a ordenar su campo.',
    monthly: 19,
    annual: 15,
    featured: false,
    cta: { label: 'Empezar', href: '#' },
    features: [
      'Hasta 3 campos / lotes',
      '1 usuario',
      'Calendario agronómico con alertas',
      'Cotización del Mercado de Rosario',
      'Soporte por email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Para asesores con varios campos y equipo de trabajo.',
    monthly: 49,
    annual: 39,
    featured: true,
    cta: { label: 'Probar Pro', href: '#' },
    features: [
      'Todo lo de Starter, más:',
      'Hasta 25 campos / lotes',
      'Hasta 5 usuarios',
      'Comparación de campañas',
      'Sincronización offline en el campo',
      'Reportes de rentabilidad por hectárea',
      'Soporte prioritario',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Para cooperativas y grandes operaciones agrícolas.',
    monthly: null,
    annual: null,
    featured: false,
    cta: { label: 'Hablemos', href: '#' },
    features: [
      'Todo lo de Pro, más:',
      'Campos y usuarios ilimitados',
      'Permisos y roles avanzados',
      'Integraciones y acceso a la API',
      'Onboarding y migración dedicados',
      'Soporte con SLA',
    ],
  },
]
