'use client'

import { useState } from 'react'
import { BarChart } from '@/components/ui/bar-chart'
import { CURRENCIES } from '../config'
import { hasCurrency, monthlySeries } from '../lib/derive-finance'
import type { Cost, Currency, Income } from '@/types/api/finance'

export function MonthlyView({ costs, incomes }: { costs: Cost[]; incomes: Income[] }): React.JSX.Element {
  const available = CURRENCIES.filter(currency => hasCurrency(costs, incomes, currency))
  const [currency, setCurrency] = useState<Currency>(available[0] ?? 'ARS')

  if (available.length === 0) {
    return (
      <article className="rounded-2xl border border-hairline-on-bone bg-bone p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Vista mensual</h2>
        <p className="mt-3 text-sm text-stone">Cargá costos o ingresos para ver la evolución por mes.</p>
      </article>
    )
  }

  // Keep the selected currency valid if the available set changes.
  const activeCurrency = available.includes(currency) ? currency : available[0]
  const series = monthlySeries(costs, incomes, activeCurrency)

  return (
    <article className="rounded-2xl border border-hairline-on-bone bg-bone p-5">
      <header className="flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-semibold text-ink">Vista mensual</h2>
        {available.length > 1 && (
          <div className="flex gap-1">
            {available.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => setCurrency(item)}
                className={
                  item === activeCurrency
                    ? 'rounded-full bg-clay px-3 py-1 text-xs font-medium text-bone'
                    : 'rounded-full border border-hairline-on-bone px-3 py-1 text-xs text-stone hover:text-ink'
                }
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="mt-5 space-y-6">
        <div>
          <p className="kicker text-stone">Costos ({activeCurrency})</p>
          <div className="mt-2">
            <BarChart data={series.map(point => ({ label: point.label, value: point.costs }))} highlightMax={false} />
          </div>
        </div>
        <div>
          <p className="kicker text-clay">Ingresos ({activeCurrency})</p>
          <div className="mt-2">
            <BarChart data={series.map(point => ({ label: point.label, value: point.income }))} highlightMax={false} />
          </div>
        </div>
      </div>
    </article>
  )
}
