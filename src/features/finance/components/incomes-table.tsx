'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { IncomeFormDialog } from './income-form-dialog'
import { useDeleteIncome } from '../hooks/use-finance-mutations'
import { formatMoney } from '../config'
import type { Campaign } from '@/types/api/campaigns'
import type { Crop } from '@/types/api/crops'
import type { Income, Quote } from '@/types/api/finance'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: '2-digit' })
}

interface IncomesTableProps {
  incomes: Income[]
  campaigns: Campaign[]
  crops: Crop[]
  quotes: Quote[]
}

export function IncomesTable({ incomes, campaigns, crops, quotes }: IncomesTableProps): React.JSX.Element {
  const deleteIncome = useDeleteIncome()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Income | undefined>(undefined)
  const [pendingDelete, setPendingDelete] = useState<Income | null>(null)

  const openCreate = (): void => {
    setEditing(undefined)
    setFormOpen(true)
  }
  const openEdit = (income: Income): void => {
    setEditing(income)
    setFormOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className={PILL_PRIMARY} onClick={openCreate} disabled={campaigns.length === 0}>
          <Plus className="size-4" />
          Nuevo ingreso
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline-on-bone">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Campaña</TableHead>
              <TableHead>Grano</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomes.map(income => (
              <TableRow key={income.id}>
                <TableCell className="text-stone">{formatDate(income.date)}</TableCell>
                <TableCell className="text-stone">
                  {income.campaign.cropName} {income.campaign.cycle}
                </TableCell>
                <TableCell className="text-ink">{income.crop.name}</TableCell>
                <TableCell className="text-right text-stone">
                  {income.quantity.toLocaleString('es-AR', { maximumFractionDigits: 1 })}
                </TableCell>
                <TableCell className="text-right text-stone">{formatMoney(income.unitPrice, income.currency)}</TableCell>
                <TableCell className="text-right font-medium text-ink">
                  {formatMoney(income.quantity * income.unitPrice, income.currency)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label="Editar ingreso" onClick={() => openEdit(income)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Eliminar ingreso" onClick={() => setPendingDelete(income)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {incomes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-stone">
                  Sin ingresos cargados para este campo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <IncomeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        campaigns={campaigns}
        crops={crops}
        quotes={quotes}
        income={editing}
      />
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={open => !open && setPendingDelete(null)}
        title="Eliminar ingreso"
        description="¿Eliminar este ingreso? No se puede deshacer."
        loading={deleteIncome.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteIncome.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </div>
  )
}
