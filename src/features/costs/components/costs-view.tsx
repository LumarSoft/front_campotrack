'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/layout/page-header'
import { CropCatalogManager } from './crop-catalog-manager'
import { ProviderManager } from './provider-manager'

/**
 * Costos: master data behind costs — the crop catalog and the suppliers. Crops
 * used to live in Configuración; they now live here. The cost movements
 * themselves are loaded from Financiero (campaign-scoped).
 */
export function CostsView(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        kicker="Costos"
        title="Costos, cultivos y proveedores"
        description="Mantené el catálogo de cultivos y tus proveedores. Estos datos alimentan los costos que cargás en Financiero."
      />

      <Tabs defaultValue="cultivos">
        <TabsList data-tour="costos-tabs">
          <TabsTrigger value="cultivos">Cultivos</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
        </TabsList>

        <TabsContent value="cultivos" className="mt-6">
          <CropCatalogManager />
        </TabsContent>
        <TabsContent value="proveedores" className="mt-6">
          <ProviderManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
