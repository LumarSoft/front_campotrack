import type { Metadata } from 'next'
import { AuthShell, type BrandPanelContent } from '@/features/auth/components/auth-shell'
import { LoginForm } from '@/features/auth/components/login-form'

export const metadata: Metadata = {
  title: 'Ingresar — Campo Track',
  description: 'Accedé a tu cuenta de Campo Track para gestionar tus campañas, costos y rendimientos.',
}

const LOGIN_PANEL: BrandPanelContent = {
  videoSrc: '/loginVideo.mp4',
  kicker: 'Tu campaña, al día',
  headline: 'Retomá donde dejaste.',
  bullets: [
    'Tus lotes y costos sincronizados desde la última vez.',
    'Cotización del Mercado de Rosario al instante.',
    'Todo lo que cargaste en el campo, esperándote acá.',
  ],
  cta: { text: '¿Todavía no tenés cuenta?', linkLabel: 'Creá una gratis', href: '/register' },
}

export default function LoginPage(): React.JSX.Element {
  return (
    <AuthShell
      title="Bienvenido de nuevo"
      subtitle="Ingresá para seguir gestionando tu campaña."
      panel={LOGIN_PANEL}
    >
      <LoginForm />
    </AuthShell>
  )
}
