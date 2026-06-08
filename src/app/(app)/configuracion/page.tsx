'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/page-header'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { ProfileForm } from '@/features/settings/components/profile-form'
import { NotificationPrefs } from '@/features/settings/components/notification-prefs'
import { CropCatalogManager } from '@/features/settings/components/crop-catalog-manager'

/**
 * Settings / profile (info.md §13): edit profile, notification preferences and
 * (admin only) the crop catalog.
 */
export default function ConfiguracionPage(): React.JSX.Element {
  const isAdmin = useAuthStore(state => state.user?.role === 'ADMIN')

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        kicker="Configuración"
        title="Tu cuenta"
        description="Editá tu perfil, ajustá las notificaciones y mantené los catálogos al día."
      />

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          {isAdmin && <TabsTrigger value="catalogos">Catálogos</TabsTrigger>}
        </TabsList>

        <TabsContent value="perfil" className="mt-6">
          <ProfileForm />
        </TabsContent>
        <TabsContent value="notificaciones" className="mt-6">
          <NotificationPrefs />
        </TabsContent>
        {isAdmin && (
          <TabsContent value="catalogos" className="mt-6">
            <CropCatalogManager />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
