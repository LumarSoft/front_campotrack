'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/layout/page-header'
import { useFields } from '@/features/fields/hooks/use-fields-queries'
import { FieldAnalysisView } from '@/features/analysis/components/field-analysis-view'

/**
 * Analysis & recommendations (info.md §10): compare a field's campaigns by yield
 * and surface agronomic recommendations. Financial charts arrive with the
 * Financiero module (deferred).
 */
export default function AnalisisPage(): React.JSX.Element {
  const fieldsQuery = useFields()
  const fields = fieldsQuery.data ?? []
  const [selectedId, setSelectedId] = useState('')

  // Auto-select the first field once loaded (render-phase, not an effect).
  if (selectedId === '' && fields.length > 0) {
    setSelectedId(String(fields[0].id))
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        kicker="Inteligencia"
        title="Análisis y recomendaciones"
        description="Compará el rendimiento de tus campañas y recibí sugerencias basadas en el historial."
        actions={
          fields.length > 0 ? (
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Elegí un campo" />
              </SelectTrigger>
              <SelectContent>
                {fields.map(field => (
                  <SelectItem key={field.id} value={String(field.id)}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : undefined
        }
      />

      {fieldsQuery.isLoading ? (
        <Skeleton className="h-72 w-full rounded-2xl bg-[color-mix(in_srgb,var(--stone)_14%,var(--bone))]" />
      ) : fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline-on-bone p-10 text-center text-sm text-stone">
          Todavía no tenés campos. Cargá uno para empezar a analizar tus campañas.
        </div>
      ) : (
        selectedId !== '' && <FieldAnalysisView fieldId={Number(selectedId)} />
      )}
    </div>
  )
}
