'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { BrandMark } from '@/components/ui/brand-mark'
import { Wordmark } from '@/components/ui/wordmark'
import { SidebarNav } from './sidebar-nav'
import { ConnectionStatus } from './connection-status'
import { UserMenu } from './user-menu'
import { SyncStatus } from '@/features/records/components/sync-status'
import { NotificationBell } from '@/features/notifications/components/notification-bell'
import type { AuthUser } from '@/types/api/auth'

/**
 * Topbar: mobile menu trigger, global filter (campaña/cliente/campo — placeholder
 * until the filter store lands), connection status and the user menu (info.md §4).
 */
export function AppTopbar({ user }: { user: AuthUser }): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-hairline-on-bone bg-bone px-4 lg:px-8">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="on-ink w-72 border-hairline-on-ink bg-ink p-0 text-bone">
          <SheetHeader className="h-16 justify-center border-b border-hairline-on-ink px-5">
            <SheetTitle asChild>
              <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                <BrandMark className="size-9" />
                <Wordmark className="text-lg text-bone" />
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="p-3">
            <SidebarNav role={user.role} onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex md:items-center md:gap-2">
        <span className="rounded-full border border-hairline-on-bone px-4 py-1.5 font-sans text-xs text-stone">
          Todos los campos · Campaña activa
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <SyncStatus />
        <ConnectionStatus />
        <NotificationBell />
        <UserMenu user={user} />
      </div>
    </header>
  )
}
