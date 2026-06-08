'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItemsForRole } from './nav-config'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types/api/common'

interface SidebarNavProps {
  role: UserRole
  /** Called after a navigation link is clicked (used to close the mobile sheet). */
  onNavigate?: () => void
}

/**
 * Role-filtered navigation list, reused by the desktop sidebar and mobile sheet.
 * Styled for the ink (dark) brand panel.
 */
export function SidebarNav({ role, onNavigate }: SidebarNavProps): React.JSX.Element {
  const pathname = usePathname()
  const items = navItemsForRole(role)

  return (
    <nav className="flex flex-col gap-1">
      {items.map(item => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon

        if (item.disabled) {
          return (
            <span
              key={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-bone/35"
              title="Próximamente"
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.phase2 && (
                <span className="ml-auto rounded-full border border-wheat/40 px-1.5 py-0.5 text-[10px] font-medium text-wheat">
                  Fase 2
                </span>
              )}
            </span>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive ? 'bg-clay text-bone' : 'text-bone/70 hover:bg-bone/10 hover:text-bone',
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
