import type { CostCategory, CostType, Currency } from '@/types/api/finance'

export const COST_CATEGORY_LABELS: Record<CostCategory, string> = {
  INPUTS: 'Insumos',
  LABOR: 'Mano de obra',
  LEASE: 'Arrendamiento',
  FREIGHT: 'Flete',
  FIELD_WORK: 'Labores',
  OTHER: 'Otro',
}

export const COST_CATEGORY_ORDER: CostCategory[] = ['INPUTS', 'LABOR', 'LEASE', 'FREIGHT', 'FIELD_WORK', 'OTHER']

export const COST_TYPE_LABELS: Record<CostType, string> = {
  FIXED: 'Fijo',
  VARIABLE: 'Variable',
}

export const CURRENCIES: Currency[] = ['ARS', 'USD']

const CURRENCY_SYMBOL: Record<Currency, string> = { ARS: '$', USD: 'U$S' }

export function formatMoney(amount: number, currency: Currency): string {
  return `${CURRENCY_SYMBOL[currency]} ${amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
}
