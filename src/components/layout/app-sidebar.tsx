import Link from 'next/link'
import { BrandMark } from '@/components/ui/brand-mark'
import { Wordmark } from '@/components/ui/wordmark'
import { SidebarNav } from './sidebar-nav'
import type { UserRole } from '@/types/api/common'

/**
 * Fixed left sidebar for desktop — an ink (forest green) brand panel matching
 * the landing/auth language. Hidden on mobile, where the topbar sheet is used.
 */
export function AppSidebar({ role }: { role: UserRole }): React.JSX.Element {
  return (
    <aside className="on-ink hidden w-64 shrink-0 flex-col bg-ink text-bone lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-hairline-on-ink px-5">
        <Link href="/dashboard" className="flex items-center gap-3" aria-label="Campo Track — inicio">
          <BrandMark className="size-9" />
          <Wordmark className="text-lg text-bone" />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <SidebarNav role={role} />
      </div>
    </aside>
  )
}
