'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { useSaveCost } from '../hooks/use-finance-mutations'
import { COST_CATEGORY_LABELS, COST_CATEGORY_ORDER, COST_TYPE_LABELS, CURRENCIES } from '../config'
import type { Campaign } from '@/types/api/campaigns'
import type { Cost, CostCategory, CostType, Currency } from '@/types/api/finance'

interface CostFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaigns: Campaign[]
  cost?: Cost
}

const NONE = 'none'

export function CostFormDialog({ open, onOpenChange, campaigns, cost }: CostFormDialogProps): React.JSX.Element {
  const isEdit = cost !== undefined
  const saveCost = useSaveCost()

  const [campaignId, setCampaignId] = useState('')
  const [category, setCategory] = useState<CostCategory>('INPUTS')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<Currency>('ARS')
  const [date, setDate] = useState('')
  const [costType, setCostType] = useState<string>(NONE)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setCampaignId(cost ? String(cost.campaignId) : '')
    setCategory(cost?.category ?? 'INPUTS')
    setAmount(cost ? String(cost.amount) : '')
    setCurrency(cost?.currency ?? 'ARS')
    setDate(cost ? cost.date.slice(0, 10) : new Date().toISOString().slice(0, 10))
    setCostType(cost?.costType ?? NONE)
    setNote(cost?.note ?? '')
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    if (!isEdit && !campaignId) return setError('Elegí una campaña.')
    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return setError('Ingresá un monto válido.')
    if (!date) return setError('Elegí una fecha.')

    const payload = {
      campaignId: isEdit ? cost.campaignId : Number(campaignId),
      category,
      amount: numericAmount,
      currency,
      date,
      costType: costType === NONE ? undefined : (costType as CostType),
      note: note.trim() || undefined,
    }
    saveCost.mutate({ id: cost?.id, payload }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar costo' : 'Nuevo costo'}</DialogTitle>
          <DialogDescription>Insumos, mano de obra, arrendamiento, flete, labores u otro.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Campaña</Label>
            {isEdit ? (
              <p className="rounded-md border border-hairline-on-bone px-3 py-2 text-sm text-stone">
                {cost.campaign.fieldName} · {cost.campaign.cropName} {cost.campaign.cycle}
              </p>
            ) : (
              <Select value={campaignId} onValueChange={setCampaignId}>
                <SelectTrigger>
                  <SelectValue placeholder="Elegí una campaña" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={String(campaign.id)}>
                      {campaign.crop.name} {campaign.cycle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={category} onValueChange={value => setCategory(value as CostCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COST_CATEGORY_ORDER.map(item => (
                    <SelectItem key={item} value={item}>
                      {COST_CATEGORY_LABELS[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fijo / Variable</Label>
              <Select value={costType} onValueChange={setCostType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Sin especificar</SelectItem>
                  <SelectItem value="FIXED">{COST_TYPE_LABELS.FIXED}</SelectItem>
                  <SelectItem value="VARIABLE">{COST_TYPE_LABELS.VARIABLE}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="cost-amount">Monto</Label>
              <Input id="cost-amount" type="number" min="0" step="any" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Moneda</Label>
              <Select value={currency} onValueChange={value => setCurrency(value as Currency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(item => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost-date">Fecha</Label>
            <Input id="cost-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost-note">Nota (opcional)</Label>
            <Input id="cost-note" value={note} onChange={e => setNote(e.target.value)} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saveCost.isPending}>
              Cancelar
            </Button>
            <Button type="submit" className={PILL_PRIMARY} disabled={saveCost.isPending}>
              {isEdit ? 'Guardar' : 'Crear costo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
