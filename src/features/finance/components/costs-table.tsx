'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { CostFormDialog } from './cost-form-dialog'
import { useDeleteCost } from '../hooks/use-finance-mutations'
import { COST_CATEGORY_LABELS, COST_TYPE_LABELS, formatMoney } from '../config'
import type { Campaign } from '@/types/api/campaigns'
import type { Cost } from '@/types/api/finance'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: '2-digit' })
}

export function CostsTable({ costs, campaigns }: { costs: Cost[]; campaigns: Campaign[] }): React.JSX.Element {
  const deleteCost = useDeleteCost()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Cost | undefined>(undefined)
  const [pendingDelete, setPendingDelete] = useState<Cost | null>(null)

  const openCreate = (): void => {
    setEditing(undefined)
    setFormOpen(true)
  }
  const openEdit = (cost: Cost): void => {
    setEditing(cost)
    setFormOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className={PILL_PRIMARY} onClick={openCreate} disabled={campaigns.length === 0}>
          <Plus className="size-4" />
          Nuevo costo
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline-on-bone">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Campaña</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {costs.map(cost => (
              <TableRow key={cost.id}>
                <TableCell className="text-stone">{formatDate(cost.date)}</TableCell>
                <TableCell className="text-stone">
                  {cost.campaign.cropName} {cost.campaign.cycle}
                </TableCell>
                <TableCell className="text-ink">{COST_CATEGORY_LABELS[cost.category]}</TableCell>
                <TableCell className="text-stone">
                  {cost.costType ? <Badge variant="secondary">{COST_TYPE_LABELS[cost.costType]}</Badge> : '—'}
                </TableCell>
                <TableCell className="text-right font-medium text-ink">{formatMoney(cost.amount, cost.currency)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label="Editar costo" onClick={() => openEdit(cost)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Eliminar costo" onClick={() => setPendingDelete(cost)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {costs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-sm text-stone">
                  Sin costos cargados para este campo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CostFormDialog open={formOpen} onOpenChange={setFormOpen} campaigns={campaigns} cost={editing} />
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={open => !open && setPendingDelete(null)}
        title="Eliminar costo"
        description="¿Eliminar este costo? No se puede deshacer."
        loading={deleteCost.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteCost.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </div>
  )
}
