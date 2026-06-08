import type { Campaign } from '@/types/api/campaigns'
import type { Cost, Currency, Income } from '@/types/api/finance'
import type { FieldRecord } from '@/types/api/records'

export type CurrencyTotals = Record<Currency, number>

export interface CampaignProfitability {
  campaignId: number
  cycle: string
  cropName: string
  ha: number | null
  costs: CurrencyTotals
  income: CurrencyTotals
  profit: CurrencyTotals
  profitPerHa: Record<Currency, number | null>
  plannedHa: number | null
  executedHa: number
}

export interface MonthlyPoint {
  label: string
  costs: number
  income: number
}

function emptyTotals(): CurrencyTotals {
  return { ARS: 0, USD: 0 }
}

function readNumber(data: Record<string, unknown>, key: string): number {
  const value = data[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function monthKey(iso: string): string {
  return iso.slice(0, 7) // YYYY-MM
}

/** Profitability per campaign, split by currency (no FX conversion — info.md §9). */
export function profitabilityByCampaign(
  campaigns: Campaign[],
  costs: Cost[],
  incomes: Income[],
  records: FieldRecord[],
): CampaignProfitability[] {
  const base = new Map<number, { cycle: string; cropName: string; ha: number | null }>()
  for (const campaign of campaigns) {
    base.set(campaign.id, { cycle: campaign.cycle, cropName: campaign.crop.name, ha: campaign.ha })
  }
  const seed = (id: number, cycle: string, cropName: string): void => {
    if (!base.has(id)) base.set(id, { cycle, cropName, ha: null })
  }
  for (const cost of costs) seed(cost.campaignId, cost.campaign.cycle, cost.campaign.cropName)
  for (const income of incomes) seed(income.campaignId, income.campaign.cycle, income.campaign.cropName)

  const executedByCampaign = new Map<number, number>()
  for (const record of records) {
    if (record.subtype !== 'SOWING') continue
    executedByCampaign.set(
      record.campaign.id,
      (executedByCampaign.get(record.campaign.id) ?? 0) + readNumber(record.data, 'ha'),
    )
  }

  const result: CampaignProfitability[] = []
  for (const [campaignId, info] of base) {
    const costTotals = emptyTotals()
    for (const cost of costs.filter(c => c.campaignId === campaignId)) costTotals[cost.currency] += cost.amount

    const incomeTotals = emptyTotals()
    for (const income of incomes.filter(i => i.campaignId === campaignId)) {
      incomeTotals[income.currency] += income.quantity * income.unitPrice
    }

    const profit: CurrencyTotals = { ARS: incomeTotals.ARS - costTotals.ARS, USD: incomeTotals.USD - costTotals.USD }
    const hasHa = info.ha !== null && info.ha > 0
    result.push({
      campaignId,
      cycle: info.cycle,
      cropName: info.cropName,
      ha: info.ha,
      costs: costTotals,
      income: incomeTotals,
      profit,
      profitPerHa: {
        ARS: hasHa ? profit.ARS / info.ha! : null,
        USD: hasHa ? profit.USD / info.ha! : null,
      },
      plannedHa: info.ha,
      executedHa: executedByCampaign.get(campaignId) ?? 0,
    })
  }

  return result.sort((a, b) => a.cycle.localeCompare(b.cycle))
}

/** Costs vs income per month for one currency, oldest month first. */
export function monthlySeries(costs: Cost[], incomes: Income[], currency: Currency): MonthlyPoint[] {
  const months = new Map<string, MonthlyPoint>()
  const point = (key: string): MonthlyPoint => {
    let entry = months.get(key)
    if (!entry) {
      entry = { label: key, costs: 0, income: 0 }
      months.set(key, entry)
    }
    return entry
  }

  for (const cost of costs.filter(c => c.currency === currency)) point(monthKey(cost.date)).costs += cost.amount
  for (const income of incomes.filter(i => i.currency === currency)) {
    point(monthKey(income.date)).income += income.quantity * income.unitPrice
  }

  return [...months.values()]
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(entry => ({ ...entry, label: entry.label.slice(2).replace('-', '/') }))
}

/** True when any cost/income exists in the given currency. */
export function hasCurrency(costs: Cost[], incomes: Income[], currency: Currency): boolean {
  return costs.some(c => c.currency === currency) || incomes.some(i => i.currency === currency)
}
