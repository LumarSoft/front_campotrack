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
import { SearchableSelect } from '@/components/ui/searchable-select'
import { formatSowingWindow } from '@/lib/months'
import { useCreateCampaign } from '@/features/fields/hooks/use-campaign-mutations'
import type { CreateCampaignRequest } from '@/types/api/campaigns'
import type { Crop } from '@/types/api/crops'
import type { Subdivision } from '@/types/api/fields'

const FIELD_SCOPE = 'field'

interface CampaignFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fieldId: number
  totalHa: number
  subdivisions: Subdivision[]
  crops: Crop[]
}

/** Next upcoming yyyy-mm-dd for a given month (1-12), day 1. */
function nextDateForMonth(month: number, now: Date): string {
  let candidate = new Date(now.getFullYear(), month - 1, 1)
  if (candidate < now) candidate = new Date(now.getFullYear() + 1, month - 1, 1)
  const y = candidate.getFullYear()
  const m = String(candidate.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}-01`
}

export function CampaignFormDialog({
  open,
  onOpenChange,
  fieldId,
  totalHa,
  subdivisions,
  crops,
}: CampaignFormDialogProps): React.JSX.Element {
  const createCampaign = useCreateCampaign(fieldId)

  const [scope, setScope] = useState(FIELD_SCOPE)
  const [cropId, setCropId] = useState('')
  const [cycle, setCycle] = useState('')
  const [ha, setHa] = useState('')
  const [sowing, setSowing] = useState('')
  const [harvest, setHarvest] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setScope(FIELD_SCOPE)
    setCropId('')
    setCycle('')
    setHa(String(totalHa))
    setSowing('')
    setHarvest('')
    setEndDate('')
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const cropOptions = crops.map(crop => ({ value: String(crop.id), label: crop.name }))
  const selectedCrop = crops.find(crop => String(crop.id) === cropId)
  const sowingWindow = selectedCrop ? formatSowingWindow(selectedCrop.sowingFromMonth, selectedCrop.sowingToMonth) : null
  const isLoteScope = scope !== FIELD_SCOPE

  // Surface comes from the chosen scope: the lote's area, or the field total.
  const handleScopeChange = (value: string): void => {
    setScope(value)
    if (value === FIELD_SCOPE) {
      setHa(String(totalHa))
    } else {
      const sub = subdivisions.find(item => String(item.id) === value)
      if (sub) setHa(String(sub.ha))
    }
  }

  const handleCropChange = (value: string): void => {
    setCropId(value)
    const crop = crops.find(item => String(item.id) === value)
    if (crop?.sowingFromMonth && !sowing) setSowing(nextDateForMonth(crop.sowingFromMonth, new Date()))
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    const haValue = Number(ha)
    if (!cropId) return setError('Elegí un cultivo.')
    if (cycle.trim().length < 2) return setError('Ingresá el ciclo (ej. 2026/27).')
    if (!Number.isFinite(haValue) || haValue <= 0) return setError('La superficie debe ser mayor a 0.')

    const payload: CreateCampaignRequest = {
      cycle: cycle.trim(),
      cropId: Number(cropId),
      ha: haValue,
      sowingDateEst: sowing || undefined,
      harvestDateEst: harvest || undefined,
      endDateEst: endDate || undefined,
      ...(scope === FIELD_SCOPE ? { fieldId } : { subdivisionId: Number(scope) }),
    }
    createCampaign.mutate(payload, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva campaña</DialogTitle>
          <DialogDescription>Ciclo agrícola anual para todo el campo o para un lote específico.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Alcance</Label>
            <Select value={scope} onValueChange={handleScopeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FIELD_SCOPE}>Todo el campo</SelectItem>
                {subdivisions.map(sub => (
                  <SelectItem key={sub.id} value={String(sub.id)}>
                    Lote: {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="camp-crop">Cultivo</Label>
            {crops.length > 0 ? (
              <SearchableSelect
                id="camp-crop"
                options={cropOptions}
                value={cropId}
                onChange={handleCropChange}
                placeholder="Elegí un cultivo"
                searchPlaceholder="Buscar cultivo…"
              />
            ) : (
              <p className="rounded-md border border-dashed border-hairline-on-bone px-3 py-2 text-sm text-stone">
                No hay cultivos cargados. Agregalos en la sección Costos.
              </p>
            )}
            {sowingWindow && (
              <p className="text-xs text-stone">Época de siembra sugerida: {sowingWindow}.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="camp-cycle">Ciclo</Label>
              <Input id="camp-cycle" value={cycle} onChange={e => setCycle(e.target.value)} placeholder="2026/27" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="camp-ha">Superficie (ha)</Label>
              <Input
                id="camp-ha"
                type="number"
                min="0"
                step="any"
                value={ha}
                onChange={e => setHa(e.target.value)}
                placeholder="300"
                disabled={isLoteScope}
              />
              {isLoteScope && <p className="text-xs text-stone">Tomada del lote elegido.</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="camp-sowing">Siembra estimada</Label>
              <Input id="camp-sowing" type="date" value={sowing} onChange={e => setSowing(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="camp-harvest">Cosecha estimada</Label>
              <Input id="camp-harvest" type="date" value={harvest} onChange={e => setHarvest(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="camp-end">Fin estimado</Label>
              <Input id="camp-end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createCampaign.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createCampaign.isPending || crops.length === 0}>
              Crear campaña
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
