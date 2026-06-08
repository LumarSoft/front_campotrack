import { eventDateKey, toDateKey } from '@/features/calendar/date-utils'
import type { Campaign } from '@/types/api/campaigns'
import type { FieldRecord, YieldUnit } from '@/types/api/records'

export interface CampaignStats {
  campaignId: number
  cycle: string
  cropName: string
  ha: number | null
  /** Average harvest yield normalized to qq/ha, or null when not harvested yet. */
  yieldQqHa: number | null
  grainMoisture: number | null
  observationCount: number
  applicationCount: number
  sowingDateKey: string | null
  harvestDateKey: string | null
}

export interface YieldPoint {
  label: string
  value: number
}

export interface DateRecommendation {
  kind: 'SOWING' | 'HARVEST'
  dateKey: string
  /** How many past dates the average is based on. */
  basisCount: number
}

export interface DoseReference {
  subtype: 'FERTILIZATION' | 'PHYTOSANITARY'
  product: string
  dose: string
  cycle: string
}

export interface FieldAnalysis {
  campaignStats: CampaignStats[]
  yieldSeries: YieldPoint[]
  averageYieldQqHa: number | null
  recommendations: DateRecommendation[]
  referenceDoses: DoseReference[]
  hasData: boolean
}

/** Quintals per hectare from the stored value + unit (1 tn/ha = 10 qq/ha). */
export function normalizeYieldToQqHa(value: number, unit: YieldUnit): number {
  return unit === 'TN_HA' ? value * 10 : value
}

function readNumber(data: Record<string, unknown>, key: string): number | null {
  const value = data[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function readString(data: Record<string, unknown>, key: string): string | null {
  const value = data[key]
  return typeof value === 'string' && value.trim() !== '' ? value : null
}

function average(values: number[]): number | null {
  if (values.length === 0) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function dayOfYear(dateKey: string): number {
  const [year, month, day] = dateKey.split('-').map(Number)
  const start = Date.UTC(year, 0, 0)
  return Math.round((Date.UTC(year, month - 1, day) - start) / 86_400_000)
}

/** Builds the suggested date from an average day-of-year, in the next upcoming year. */
function dateKeyFromAverageDay(dateKeys: string[], now: Date): string | null {
  if (dateKeys.length === 0) return null
  const avgDay = Math.round(average(dateKeys.map(dayOfYear))!)
  const candidate = new Date(now.getFullYear(), 0, avgDay)
  if (candidate < now) candidate.setFullYear(now.getFullYear() + 1)
  return toDateKey(candidate)
}

/** Per-campaign stats from the field's campaigns and records, oldest cycle first. */
export function buildCampaignStats(campaigns: Campaign[], records: FieldRecord[]): CampaignStats[] {
  const byId = new Map<number, { cycle: string; cropName: string; ha: number | null }>()
  for (const campaign of campaigns) {
    byId.set(campaign.id, { cycle: campaign.cycle, cropName: campaign.crop.name, ha: campaign.ha })
  }
  for (const record of records) {
    if (!byId.has(record.campaign.id)) {
      byId.set(record.campaign.id, { cycle: record.campaign.cycle, cropName: record.campaign.cropName, ha: null })
    }
  }

  const stats: CampaignStats[] = []
  for (const [campaignId, base] of byId) {
    const own = records.filter(record => record.campaign.id === campaignId)
    const harvests = own.filter(record => record.subtype === 'HARVEST')
    const yields = harvests
      .map(record => {
        const value = readNumber(record.data, 'yield')
        const unit = readString(record.data, 'yieldUnit') as YieldUnit | null
        return value !== null && unit ? normalizeYieldToQqHa(value, unit) : null
      })
      .filter((value): value is number => value !== null)
    const moistures = harvests
      .map(record => readNumber(record.data, 'grainMoisture'))
      .filter((value): value is number => value !== null)

    const sowing = own.find(record => record.subtype === 'SOWING')
    const harvest = harvests[0]
    const campaign = campaigns.find(item => item.id === campaignId)

    stats.push({
      campaignId,
      cycle: base.cycle,
      cropName: base.cropName,
      ha: base.ha,
      yieldQqHa: average(yields),
      grainMoisture: average(moistures),
      observationCount: own.filter(record => record.subtype === 'OBSERVATION').length,
      applicationCount: own.filter(
        record => record.subtype === 'FERTILIZATION' || record.subtype === 'PHYTOSANITARY',
      ).length,
      sowingDateKey: sowing ? eventDateKey(sowing.recordDate) : (campaign?.sowingDateEst?.slice(0, 10) ?? null),
      harvestDateKey: harvest ? eventDateKey(harvest.recordDate) : (campaign?.harvestDateEst?.slice(0, 10) ?? null),
    })
  }

  return stats.sort((a, b) => a.cycle.localeCompare(b.cycle))
}

/** Suggested sowing/harvest dates from the average of past operations (info.md §10). */
export function recommendDates(stats: CampaignStats[], now: Date): DateRecommendation[] {
  const recommendations: DateRecommendation[] = []

  const sowingDates = stats.map(s => s.sowingDateKey).filter((key): key is string => key !== null)
  const harvestDates = stats.map(s => s.harvestDateKey).filter((key): key is string => key !== null)

  const sowing = dateKeyFromAverageDay(sowingDates, now)
  if (sowing) recommendations.push({ kind: 'SOWING', dateKey: sowing, basisCount: sowingDates.length })

  const harvest = dateKeyFromAverageDay(harvestDates, now)
  if (harvest) recommendations.push({ kind: 'HARVEST', dateKey: harvest, basisCount: harvestDates.length })

  return recommendations
}

/** Most recent product/dose used per application type, as a reference (dose is free text). */
export function referenceDoses(records: FieldRecord[]): DoseReference[] {
  const byDateDesc = [...records].sort((a, b) => b.recordDate.localeCompare(a.recordDate))
  const references: DoseReference[] = []

  for (const subtype of ['FERTILIZATION', 'PHYTOSANITARY'] as const) {
    const latest = byDateDesc.find(record => record.subtype === subtype)
    if (!latest) continue
    const product = readString(latest.data, 'product')
    const dose = readString(latest.data, 'dose')
    if (product && dose) references.push({ subtype, product, dose, cycle: latest.campaign.cycle })
  }

  return references
}

export function buildFieldAnalysis(campaigns: Campaign[], records: FieldRecord[], now: Date): FieldAnalysis {
  const campaignStats = buildCampaignStats(campaigns, records)
  const yieldSeries: YieldPoint[] = campaignStats
    .filter(stat => stat.yieldQqHa !== null)
    .map(stat => ({ label: stat.cycle, value: stat.yieldQqHa! }))

  return {
    campaignStats,
    yieldSeries,
    averageYieldQqHa: average(yieldSeries.map(point => point.value)),
    recommendations: recommendDates(campaignStats, now),
    referenceDoses: referenceDoses(records),
    hasData: campaignStats.length > 0,
  }
}
