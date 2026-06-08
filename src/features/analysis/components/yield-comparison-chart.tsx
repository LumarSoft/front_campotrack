import { BarChart } from '@/components/ui/bar-chart'
import type { YieldPoint } from '../lib/derive-analysis'

interface YieldComparisonChartProps {
  series: YieldPoint[]
  averageQqHa: number | null
}

/** Yield (qq/ha) per cycle — the main field indicator (info.md §10). */
export function YieldComparisonChart({ series, averageQqHa }: YieldComparisonChartProps): React.JSX.Element {
  return (
    <article className="rounded-2xl border border-hairline-on-bone bg-bone p-5">
      <header className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-ink">Rendimiento por campaña</h2>
        {averageQqHa !== null && (
          <span className="text-sm text-stone">
            Promedio{' '}
            <span className="font-medium text-ink">
              {averageQqHa.toLocaleString('es-AR', { maximumFractionDigits: 1 })} qq/ha
            </span>
          </span>
        )}
      </header>

      {series.length === 0 ? (
        <p className="mt-4 text-sm text-stone">
          Todavía no hay rendimientos cargados. Registrá una cosecha para empezar a comparar.
        </p>
      ) : (
        <div className="mt-5">
          <BarChart data={series} unit="qq/ha" />
        </div>
      )}
    </article>
  )
}
