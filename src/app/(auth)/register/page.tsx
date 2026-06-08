import type { Metadata } from 'next'
import { AuthShell, type BrandPanelContent } from '@/features/auth/components/auth-shell'
import { RegisterForm } from '@/features/auth/components/register-form'

export const metadata: Metadata = {
  title: 'Crear cuenta — Campo Track',
  description: 'Creá tu cuenta de Campo Track y empezá a ordenar tu campaña hoy.',
}

const REGISTER_PANEL: BrandPanelContent = {
  videoSrc: '/videoRegistro.mp4',
  kicker: 'Sumate al piloto',
  headline: 'Tu campaña entera, en un solo lugar.',
  bullets: [
    'Gratis durante el piloto, sin tarjeta ni compromiso.',
    'Funciona offline en el lote y sincroniza solo.',
    'Aprende de tu historial y te recomienda fechas y dosis.',
    'Costos, rendimientos y rentabilidad en tiempo real.',
  ],
  cta: { text: '¿Ya tenés cuenta?', linkLabel: 'Ingresá', href: '/login' },
}

export default function RegisterPage(): React.JSX.Element {
  return (
    <AuthShell
      title="Creá tu cuenta"
      subtitle="Sumate al piloto y empezá a ordenar tu campaña."
      panel={REGISTER_PANEL}
    >
      <RegisterForm />
    </AuthShell>
  )
}
