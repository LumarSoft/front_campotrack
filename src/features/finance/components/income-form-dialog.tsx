'use client'

import { useState } from 'react'
import { toast } from 'sonner'
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
import { useSaveIncome } from '../hooks/use-finance-mutations'
import { CURRENCIES } from '../config'
import type { Campaign } from '@/types/api/campaigns'
import type { Crop } from '@/types/api/crops'
import type { Currency, Income, Quote } from '@/types/api/finance'

interface IncomeFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaigns: Campaign[]
  crops: Crop[]
  quotes: Quote[]
  income?: Income
}

export function IncomeFormDialog({
  open,
  onOpenChange,
  campaigns,
  crops,
  quotes,
  income,
}: IncomeFormDialogProps): React.JSX.Element {
  const isEdit = income !== undefined
  const saveIncome = useSaveIncome()

  const [campaignId, setCampaignId] = useState('')
  const [cropId, setCropId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [currency, setCurrency] = useState<Currency>('ARS')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setCampaignId(income ? String(income.campaignId) : '')
    setCropId(income ? String(income.crop.id) : '')
    setQuantity(income ? String(income.quantity) : '')
    setUnitPrice(income ? String(income.unitPrice) : '')
    setCurrency(income?.currency ?? 'ARS')
    setDate(income ? income.date.slice(0, 10) : new Date().toISOString().slice(0, 10))
    setNote(income?.note ?? '')
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const takeQuote = (): void => {
    const latest = quotes.find(quote => String(quote.crop.id) === cropId)
    if (!latest) {
      toast.error('No hay cotización cargada para ese grano.')
      return
    }
    setUnitPrice(String(latest.price))
    setCurrency(latest.currency)
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    if (!isEdit && !campaignId) return setError('Elegí una campaña.')
    if (!cropId) return setError('Elegí un grano.')
    const numericQty = Number(quantity)
    const numericPrice = Number(unitPrice)
    if (!Number.isFinite(numericQty) || numericQty <= 0) return setError('Ingresá una cantidad válida.')
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) return setError('Ingresá un precio válido.')
    if (!date) return setError('Elegí una fecha.')

    const payload = {
      campaignId: isEdit ? income.campaignId : Number(campaignId),
      cropId: Number(cropId),
      quantity: numericQty,
      unitPrice: numericPrice,
      currency,
      date,
      note: note.trim() || undefined,
    }
    saveIncome.mutate({ id: income?.id, payload }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar ingreso' : 'Nuevo ingreso'}</DialogTitle>
          <DialogDescription>Venta de grano: cantidad y precio (o tomá la última cotización).</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Campaña</Label>
            {isEdit ? (
              <p className="rounded-md border border-hairline-on-bone px-3 py-2 text-sm text-stone">
                {income.campaign.fieldName} · {income.campaign.cropName} {income.campaign.cycle}
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

          <div className="space-y-2">
            <Label>Grano</Label>
            <Select value={cropId} onValueChange={setCropId}>
              <SelectTrigger>
                <SelectValue placeholder="Elegí un grano" />
              </SelectTrigger>
              <SelectContent>
                {crops.map(crop => (
                  <SelectItem key={crop.id} value={String(crop.id)}>
                    {crop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="income-qty">Cantidad</Label>
              <Input id="income-qty" type="number" min="0" step="any" value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="income-price">Precio unit.</Label>
              <Input id="income-price" type="number" min="0" step="any" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
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

          <Button type="button" variant="outline" size="sm" onClick={takeQuote} disabled={!cropId}>
            Tomar última cotización
          </Button>

          <div className="space-y-2">
            <Label htmlFor="income-date">Fecha</Label>
            <Input id="income-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-note">Nota (opcional)</Label>
            <Input id="income-note" value={note} onChange={e => setNote(e.target.value)} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saveIncome.isPending}>
              Cancelar
            </Button>
            <Button type="submit" className={PILL_PRIMARY} disabled={saveIncome.isPending}>
              {isEdit ? 'Guardar' : 'Crear ingreso'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
