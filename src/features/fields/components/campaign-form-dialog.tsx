'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { useCreateCampaign } from '@/features/fields/hooks/use-campaign-mutations'
import { useCreateCrop } from '@/features/fields/hooks/use-crop-mutations'
import type { CreateCampaignRequest } from '@/types/api/campaigns'
import type { Crop } from '@/types/api/crops'
import type { Subdivision } from '@/types/api/fields'

const FIELD_SCOPE = 'field'

interface CampaignFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fieldId: number
  subdivisions: Subdivision[]
  crops: Crop[]
}

export function CampaignFormDialog({
  open,
  onOpenChange,
  fieldId,
  subdivisions,
  crops,
}: CampaignFormDialogProps): React.JSX.Element {
  const createCampaign = useCreateCampaign(fieldId)
  const createCrop = useCreateCrop()

  const [scope, setScope] = useState(FIELD_SCOPE)
  const [cropId, setCropId] = useState('')
  const [cycle, setCycle] = useState('')
  const [ha, setHa] = useState('')
  const [sowing, setSowing] = useState('')
  const [harvest, setHarvest] = useState('')
  const [newCrop, setNewCrop] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [wasOpen, setWasOpen] = useState(false)

  if (open && !wasOpen) {
    setWasOpen(true)
    setScope(FIELD_SCOPE)
    setCropId('')
    setCycle('')
    setHa('')
    setSowing('')
    setHarvest('')
    setNewCrop('')
    setError(null)
  } else if (!open && wasOpen) {
    setWasOpen(false)
  }

  const handleAddCrop = (): void => {
    if (newCrop.trim().length < 2) return
    createCrop.mutate(
      { name: newCrop.trim() },
      {
        onSuccess: crop => {
          setCropId(String(crop.id))
          setNewCrop('')
        },
      },
    )
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
            <Select value={scope} onValueChange={setScope}>
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
            <Label>Cultivo</Label>
            {crops.length > 0 && (
              <Select value={cropId} onValueChange={setCropId}>
                <SelectTrigger>
                  <SelectValue placeholder="Elegí un cultivo" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map(crop => (
                    <SelectItem key={crop.id} value={String(crop.id)}>
                      {crop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="flex gap-2">
              <Input
                value={newCrop}
                onChange={e => setNewCrop(e.target.value)}
                placeholder={crops.length > 0 ? 'Agregar otro cultivo' : 'Agregá tu primer cultivo'}
              />
              <Button type="button" variant="outline" onClick={handleAddCrop} disabled={createCrop.isPending}>
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="camp-cycle">Ciclo</Label>
              <Input id="camp-cycle" value={cycle} onChange={e => setCycle(e.target.value)} placeholder="2026/27" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="camp-ha">Superficie (ha)</Label>
              <Input id="camp-ha" type="number" min="0" step="any" value={ha} onChange={e => setHa(e.target.value)} placeholder="300" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="camp-sowing">Siembra estimada</Label>
              <Input id="camp-sowing" type="date" value={sowing} onChange={e => setSowing(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="camp-harvest">Cosecha estimada</Label>
              <Input id="camp-harvest" type="date" value={harvest} onChange={e => setHarvest(e.target.value)} />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createCampaign.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createCampaign.isPending}>
              Crear campaña
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
