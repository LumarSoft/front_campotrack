'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { useCrops } from '@/features/fields/hooks/use-fields-queries'
import { useQuotes } from '../hooks/use-finance-queries'
import { useDeleteQuote } from '../hooks/use-finance-mutations'
import { QuoteFormDialog } from './quote-form-dialog'
import { formatMoney } from '../config'
import type { Quote } from '@/types/api/finance'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: '2-digit' })
}

export function QuotesPanel(): React.JSX.Element {
  const quotesQuery = useQuotes()
  const cropsQuery = useCrops()
  const deleteQuote = useDeleteQuote()
  const [formOpen, setFormOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Quote | null>(null)

  const quotes = quotesQuery.data ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-stone">
          Precios de referencia por grano (carga manual; la integración con Rosario llega después).
        </p>
        <Button className={PILL_PRIMARY} onClick={() => setFormOpen(true)}>
          <Plus className="size-4" />
          Nueva cotización
        </Button>
      </div>

      {quotes.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-hairline-on-bone p-8 text-center text-sm text-stone">
          No hay cotizaciones cargadas.
        </p>
      ) : (
        <ul className="divide-y divide-hairline-on-bone rounded-2xl border border-hairline-on-bone bg-bone">
          {quotes.map(quote => (
            <li key={quote.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="font-medium text-ink">{quote.crop.name}</p>
                <p className="text-sm text-stone">{formatDate(quote.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-ink">{formatMoney(quote.price, quote.currency)}</span>
                <Button variant="ghost" size="icon" aria-label="Eliminar cotización" onClick={() => setPendingDelete(quote)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <QuoteFormDialog open={formOpen} onOpenChange={setFormOpen} crops={cropsQuery.data ?? []} />
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={open => !open && setPendingDelete(null)}
        title="Eliminar cotización"
        description={`¿Eliminar la cotización de ${pendingDelete?.crop.name}?`}
        loading={deleteQuote.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteQuote.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) })
        }}
      />
    </div>
  )
}
