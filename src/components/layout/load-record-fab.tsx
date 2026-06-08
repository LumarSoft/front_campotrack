'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRecordComposerStore } from '@/features/records/store/use-record-composer-store'

/**
 * Always-visible quick action for operational loading (info.md §4). Opens the
 * global record composer, which saves offline-first and syncs when online.
 */
export function LoadRecordFab(): React.JSX.Element {
  const openComposer = useRecordComposerStore(state => state.openComposer)

  return (
    <Button
      onClick={openComposer}
      className="fixed bottom-6 right-6 z-40 h-14 gap-2 rounded-full bg-clay pl-4 pr-6 text-bone shadow-[0_16px_40px_-12px_rgba(22,43,30,0.5)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#1f5e38]"
    >
      <Plus className="size-5" />
      <span className="font-medium">Cargar registro</span>
    </Button>
  )
}
