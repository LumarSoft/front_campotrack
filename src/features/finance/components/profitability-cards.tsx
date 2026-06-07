import { CURRENCIES, formatMoney } from '../config'
import type { CampaignProfitability } from '../lib/derive-finance'
import type { Currency } from '@/types/api/finance'

function relevantCurrencies(item: CampaignProfitability): Currency[] {
  return CURRENCIES.filter(currency => item.costs[currency] !== 0 || item.income[currency] !== 0)
}

function CurrencyRow({ item, currency }: { item: CampaignProfitability; currency: Currency }): React.JSX.Element {
  const profit = item.profit[currency]
  const perHa = item.profitPerHa[currency]
  return (
    <div className="flex items-baseline justify-between gap-2 border-t border-hairline-on-bone pt-2">
      <span className="text-xs text-stone">{currency}</span>
      <div className="text-right">
        <p className={profit >= 0 ? 'font-medium text-field' : 'font-medium text-destructive'}>
          {formatMoney(profit, currency)}
        </p>
        {perHa !== null && <p className="text-xs text-stone">{formatMoney(perHa, currency)} /ha</p>}
      </div>
    </div>
  )
}

export function ProfitabilityCards({ profitability }: { profitability: CampaignProfitability[] }): React.JSX.Element {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {profitability.map(item => {
        const currencies = relevantCurrencies(item)
        const executedPct = item.plannedHa && item.plannedHa > 0 ? (item.executedHa / item.plannedHa) * 100 : null
        return (
          <article key={item.campaignId} className="rounded-2xl border border-hairline-on-bone bg-bone p-5">
            <header className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-ink">
                {item.cropName} <span className="text-stone">{item.cycle}</span>
              </h3>
              {item.ha !== null && <span className="text-xs text-stone">{item.ha} ha</span>}
            </header>

            <div className="mt-3 space-y-2">
              {currencies.length === 0 ? (
                <p className="text-sm text-stone">Sin costos ni ingresos cargados.</p>
              ) : (
                currencies.map(currency => <CurrencyRow key={currency} item={item} currency={currency} />)
              )}
            </div>

            <p className="mt-4 text-xs text-stone">
              Avance de siembra: <span className="font-medium text-ink">{item.executedHa.toLocaleString('es-AR', { maximumFractionDigits: 1 })} ha</span>
              {item.plannedHa !== null && ` de ${item.plannedHa} ha`}
              {executedPct !== null && ` (${Math.round(executedPct)}%)`}
            </p>
          </article>
        )
      })}
    </div>
  )
}
