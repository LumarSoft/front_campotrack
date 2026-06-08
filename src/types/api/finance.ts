import type { UserRole } from './common'

export type CostCategory = 'INPUTS' | 'LABOR' | 'LEASE' | 'FREIGHT' | 'FIELD_WORK' | 'OTHER'
export type Currency = 'ARS' | 'USD'
export type CostType = 'FIXED' | 'VARIABLE'

interface CampaignBrief {
  id: number
  cycle: string
  cropName: string
  fieldId: number | null
  fieldName: string
}

export interface Cost {
  id: number
  campaignId: number
  category: CostCategory
  amount: number
  currency: Currency
  date: string
  costType: CostType | null
  note: string | null
  creatorRole: UserRole
  campaign: CampaignBrief
}

export interface Income {
  id: number
  campaignId: number
  crop: { id: number; name: string }
  quantity: number
  unitPrice: number
  currency: Currency
  date: string
  note: string | null
  creatorRole: UserRole
  campaign: CampaignBrief
}

export interface Quote {
  id: number
  crop: { id: number; name: string }
  price: number
  currency: Currency
  date: string
  source: string
}

export interface CreateCostRequest {
  campaignId: number
  category: CostCategory
  amount: number
  currency: Currency
  date: string
  costType?: CostType
  note?: string
}

export type UpdateCostRequest = Partial<Omit<CreateCostRequest, 'campaignId'>>

export interface CreateIncomeRequest {
  campaignId: number
  cropId: number
  quantity: number
  unitPrice: number
  currency: Currency
  date: string
  note?: string
}

export type UpdateIncomeRequest = Partial<Omit<CreateIncomeRequest, 'campaignId'>>

export interface CreateQuoteRequest {
  cropId: number
  price: number
  currency: Currency
  date: string
  source?: string
}

export interface ListFinanceParams {
  fieldId?: number
  campaignId?: number
}
