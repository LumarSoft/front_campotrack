import { BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'

/**
 * Analysis & recommendations — deferred to Fase 2 (along with Ganadería).
 */
export default function AnalisisPage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader kicker="Inteligencia" title="Análisis y recomendaciones" />
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-hairline-on-bone p-14 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-wheat/15 text-[#8a5a1a]">
          <BarChart3 className="size-6" />
        </span>
        <div>
          <p className="font-display text-lg font-semibold text-ink">Disponible en Fase 2</p>
          <p className="mt-1 text-sm text-stone">
            El análisis de campañas y las recomendaciones automáticas llegan en una próxima etapa.
          </p>
        </div>
      </div>
    </div>
  )
}
