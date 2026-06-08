'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lock } from 'lucide-react'
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
    <nav className="flex flex-col gap-0.5">
      {items.map(item => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon

        if (item.disabled) {
          return (
            <span
              key={item.href}
              aria-disabled="true"
              className="group/nav relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-bone/35"
              title={item.phase2 ? 'Disponible en Fase 2' : 'Próximamente'}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.phase2 ? (
                <span className="ml-auto rounded-full border border-wheat/30 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-wheat/80">
                  Fase 2
                </span>
              ) : (
                <Lock className="ml-auto size-3 text-bone/30" aria-hidden />
              )}
            </span>
          )
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'group/nav relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
              'transition-[background-color,color,transform] duration-150 ease-[var(--ease-out)]',
              isActive
                ? 'bg-[color-mix(in_srgb,var(--clay)_24%,transparent)] text-bone'
                : 'text-bone/65 hover:bg-bone/10 hover:text-bone',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-clay',
                'origin-left transition-transform duration-200 ease-[var(--ease-spring)]',
                isActive ? 'scale-y-100' : 'scale-y-0 group-hover/nav:scale-y-50',
              )}
            />
            <Icon
              className={cn(
                'size-4 shrink-0 transition-colors duration-150',
                isActive ? 'text-bone' : 'text-bone/55 group-hover/nav:text-bone',
              )}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
