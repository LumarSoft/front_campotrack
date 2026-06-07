'use client'

import { Loader2 } from 'lucide-react'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppTopbar } from '@/components/layout/app-topbar'
import { LoadRecordFab } from '@/components/layout/load-record-fab'
import { RecordComposer } from '@/features/records/components/record-composer'
import { RecordSyncEngine } from '@/features/records/components/record-sync-engine'
import { useRequireAuth } from '@/features/auth/hooks/use-require-auth'

/**
 * Protected app shell (info.md §4): role-filtered sidebar, topbar with global
 * filter / connection status, and the always-visible "Cargar registro" FAB.
 */
export default function AppLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { ready, user } = useRequireAuth()

  if (!ready || !user) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh bg-bone">
      <AppSidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar user={user} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-10">{children}</main>
      </div>
      <LoadRecordFab />
      <RecordComposer />
      <RecordSyncEngine />
    </div>
  )
}
