interface BarDatum {
  label: string
  value: number
}

interface BarChartProps {
  data: BarDatum[]
  unit?: string
  /** Highlight the bar with the highest value. */
  highlightMax?: boolean
}

function formatValue(value: number): string {
  return value.toLocaleString('es-AR', { maximumFractionDigits: 1 })
}

/**
 * Minimal horizontal bar chart in plain CSS — no chart dependency, fits the
 * small data volume (a handful of campaigns/months) and the performance rules.
 */
export function BarChart({ data, unit, highlightMax = true }: BarChartProps): React.JSX.Element {
  const max = Math.max(...data.map(datum => datum.value), 0)

  return (
    <div className="space-y-3">
      {data.map(datum => {
        const isMax = highlightMax && datum.value === max && max > 0
        const width = max > 0 ? Math.max((datum.value / max) * 100, 2) : 0
        return (
          <div key={datum.label} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-right font-sans text-sm text-stone">{datum.label}</span>
            <div className="h-7 flex-1 overflow-hidden rounded-md bg-[color-mix(in_srgb,var(--stone)_12%,var(--bone))]">
              <div
                className={isMax ? 'h-full rounded-md bg-clay' : 'h-full rounded-md bg-field'}
                style={{ width: `${width}%` }}
              />
            </div>
            <span className="w-24 shrink-0 font-sans text-sm font-medium text-ink">
              {formatValue(datum.value)}
              {unit && <span className="ml-1 text-xs font-normal text-stone">{unit}</span>}
            </span>
          </div>
        )
      })}
    </div>
  )
}
