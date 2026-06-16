'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/page-header'
import { ProfileForm } from '@/features/settings/components/profile-form'
import { NotificationPrefs } from '@/features/settings/components/notification-prefs'

/**
 * Settings / profile (info.md §13): edit profile and notification preferences.
 * The crop catalog and providers now live in the "Costos" section.
 */
export default function ConfiguracionPage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        kicker="Configuración"
        title="Tu cuenta"
        description="Editá tu perfil y ajustá las notificaciones."
      />

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-6">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="notificaciones" className="mt-6">
          <NotificationPrefs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
