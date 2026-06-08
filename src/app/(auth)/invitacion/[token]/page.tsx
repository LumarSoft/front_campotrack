import type { Metadata } from 'next'
import { AuthShell, type BrandPanelContent } from '@/features/auth/components/auth-shell'
import { AcceptInvitationForm } from '@/features/team/components/accept-invitation-form'

export const metadata: Metadata = {
  title: 'Aceptar invitación — Campo Track',
  description: 'Sumate al equipo de Campo Track para gestionar campos, campañas y registros.',
}

const INVITATION_PANEL: BrandPanelContent = {
  videoSrc: '/loginVideo.mp4',
  kicker: 'Te están esperando',
  headline: 'Sumate al equipo.',
  bullets: [
    'Accedé a los campos que te compartieron.',
    'Cargá registros y eventos desde el celular, incluso sin señal.',
    'Todo sincronizado con el resto del equipo.',
  ],
  cta: { text: '¿Ya tenés cuenta?', linkLabel: 'Ingresá', href: '/login' },
}

export default async function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<React.JSX.Element> {
  const { token } = await params

  return (
    <AuthShell
      title="Aceptar invitación"
      subtitle="Creá tu contraseña para empezar."
      panel={INVITATION_PANEL}
    >
      <AcceptInvitationForm token={token} />
    </AuthShell>
  )
}
