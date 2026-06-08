'use client'

import { CalendarPlus, FlaskConical, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDayLong } from '@/features/calendar/date-utils'
import { EVENT_TYPE_LABELS } from '@/features/calendar/event-config'
import { useCreateEvent } from '@/features/calendar/hooks/use-event-mutations'
import type { DateRecommendation, DoseReference } from '../lib/derive-analysis'

const DOSE_LABELS: Record<DoseReference['subtype'], string> = {
  FERTILIZATION: 'Fertilización',
  PHYTOSANITARY: 'Fitosanitario',
}

interface RecommendationsPanelProps {
  recommendations: DateRecommendation[]
  referenceDoses: DoseReference[]
  /** Campaign an accepted date recommendation attaches its suggested event to. */
  activeCampaignId: number | null
}

export function RecommendationsPanel({
  recommendations,
  referenceDoses,
  activeCampaignId,
}: RecommendationsPanelProps): React.JSX.Element {
  const createEvent = useCreateEvent()

  const accept = (recommendation: DateRecommendation): void => {
    if (!activeCampaignId) return
    createEvent.mutate({
      campaignId: activeCampaignId,
      type: recommendation.kind,
      plannedDate: recommendation.dateKey,
      suggestedBySystem: true,
    })
  }

  const hasContent = recommendations.length > 0 || referenceDoses.length > 0

  return (
    <article className="rounded-2xl border border-clay/40 bg-[color-mix(in_srgb,var(--clay)_7%,var(--bone))] p-5">
      <h2 className="font-display text-lg font-semibold text-ink">Recomendaciones</h2>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-stone">
        <Info className="size-3.5" />
        Sugerencias basadas en el historial del campo. Revisá antes de confirmar.
      </p>

      {!hasContent ? (
        <p className="mt-4 text-sm text-stone">
          Necesitamos más historial (siembras, cosechas y aplicaciones) para sugerir fechas y dosis.
        </p>
      ) : (
        <div className="mt-5 space-y-5">
          {recommendations.length > 0 && (
            <section className="space-y-2">
              <p className="kicker text-clay">Fechas sugeridas</p>
              {recommendations.map(recommendation => (
                <div
                  key={recommendation.kind}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline-on-bone bg-bone p-3"
                >
                  <div>
                    <p className="font-medium capitalize text-ink">
                      {EVENT_TYPE_LABELS[recommendation.kind]} · {formatDayLong(recommendation.dateKey)}
                    </p>
                    <p className="text-xs text-stone">
                      Promedio de {recommendation.basisCount} campaña{recommendation.basisCount === 1 ? '' : 's'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => accept(recommendation)}
                    disabled={!activeCampaignId || createEvent.isPending}
                  >
                    <CalendarPlus className="size-4" />
                    Aceptar
                  </Button>
                </div>
              ))}
              {!activeCampaignId && (
                <p className="text-xs text-stone">Creá una campaña en este campo para poder aceptar fechas.</p>
              )}
            </section>
          )}

          {referenceDoses.length > 0 && (
            <section className="space-y-2">
              <p className="kicker text-clay">Dosis de referencia</p>
              {referenceDoses.map(dose => (
                <div key={dose.subtype} className="flex items-start gap-2.5 rounded-xl border border-hairline-on-bone bg-bone p-3">
                  <FlaskConical className="mt-0.5 size-4 shrink-0 text-field" />
                  <div>
                    <p className="font-medium text-ink">{DOSE_LABELS[dose.subtype]}</p>
                    <p className="text-sm text-stone">
                      {dose.product} · {dose.dose}
                      <span className="text-xs"> (ciclo {dose.cycle})</span>
                    </p>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      )}
    </article>
  )
}
