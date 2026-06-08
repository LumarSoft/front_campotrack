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
import { useCreateQuote } from '../hooks/use-finance-mutations'
import { CURRENCIES } from '../config'
import type { Crop } from '@/types/api/crops'
import type { Currency } from '@/types/api/finance'

interface QuoteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  crops: Crop[]
}

export function QuoteFormDialog({ open, onOpenChange, crops }: QuoteFormDialogProps): React.JSX.Element {
  const createQuote = useCreateQuote()

  const [cropId, setCropId] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [date, setDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setCropId('')
    setPrice('')
    setCurrency('USD')
    setDate(new Date().toISOString().slice(0, 10))
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    if (!cropId) return setError('Elegí un grano.')
    const numericPrice = Number(price)
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) return setError('Ingresá un precio válido.')
    if (!date) return setError('Elegí una fecha.')

    createQuote.mutate(
      { cropId: Number(cropId), price: numericPrice, currency, date },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva cotización</DialogTitle>
          <DialogDescription>Precio de referencia por grano (carga manual, info.md §9).</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="col-span-2 space-y-2">
              <Label htmlFor="quote-price">Precio</Label>
              <Input id="quote-price" type="number" min="0" step="any" value={price} onChange={e => setPrice(e.target.value)} />
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
            <Label htmlFor="quote-date">Fecha</Label>
            <Input id="quote-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createQuote.isPending}>
              Cancelar
            </Button>
            <Button type="submit" className={PILL_PRIMARY} disabled={createQuote.isPending}>
              Cargar cotización
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
