'use client'

import { useRouter } from 'next/navigation'
import { Bell, CheckCheck } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDayLong } from '@/features/calendar/date-utils'
import { useNotifications, type NotificationItem } from '../hooks/use-notifications'
import { useNotificationsStore } from '../store/use-notifications-store'

const KIND_DOT: Record<NotificationItem['kind'], string> = {
  overdue: 'bg-destructive',
  same_day: 'bg-clay',
  day_before: 'bg-wheat',
  same_week: 'bg-field',
}

/** Internal notification bell (info.md §16): overdue events + firing alarms. */
export function NotificationBell(): React.JSX.Element {
  const router = useRouter()
  const { items, unreadCount } = useNotifications()
  const markRead = useNotificationsStore(state => state.markRead)
  const markAllRead = useNotificationsStore(state => state.markAllRead)

  const handleOpen = (item: NotificationItem): void => {
    markRead(item.id)
    router.push('/calendario')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notificaciones">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[0.625rem] font-semibold leading-4 text-bone">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs font-normal text-primary hover:underline"
              onClick={() => markAllRead(items.map(item => item.id))}
            >
              <CheckCheck className="size-3.5" />
              Marcar todas como leídas
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {items.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">No tenés notificaciones pendientes.</p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {items.map(item => (
              <DropdownMenuItem
                key={item.id}
                className="flex items-start gap-2.5 py-2.5"
                onClick={() => handleOpen(item)}
              >
                <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', KIND_DOT[item.kind])} />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-medium">{item.title}</span>
                    <span
                      className={cn(
                        'shrink-0 text-xs',
                        item.kind === 'overdue' ? 'text-destructive' : 'text-stone',
                      )}
                    >
                      {item.when}
                    </span>
                  </span>
                  <span className="truncate text-xs text-muted-foreground">{item.detail}</span>
                  <span className="text-xs capitalize text-stone">{formatDayLong(item.dateKey)}</span>
                </span>
                {!item.read && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-clay" />}
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
