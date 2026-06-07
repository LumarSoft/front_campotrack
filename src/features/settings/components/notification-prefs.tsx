'use client'

import { cn } from '@/lib/utils'
import { useNotificationPrefsStore } from '@/features/notifications/store/use-notification-prefs-store'
import type { NotificationKind } from '@/features/notifications/lib/derive-notifications'

const PREF_LABELS: { key: NotificationKind; title: string; detail: string }[] = [
  { key: 'overdue', title: 'Eventos vencidos', detail: 'Avisar cuando un evento planificado pasa su fecha.' },
  { key: 'same_week', title: 'Alarma · misma semana', detail: 'Eventos con alarma dentro de los próximos 7 días.' },
  { key: 'day_before', title: 'Alarma · día anterior', detail: 'Eventos con alarma para mañana.' },
  { key: 'same_day', title: 'Alarma · el mismo día', detail: 'Eventos con alarma para hoy.' },
]

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }): React.JSX.Element {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        on ? 'bg-clay' : 'bg-[color-mix(in_srgb,var(--stone)_30%,var(--bone))]',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 size-5 rounded-full bg-bone transition-transform',
          on ? 'translate-x-[1.375rem]' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

export function NotificationPrefs(): React.JSX.Element {
  const prefs = useNotificationPrefsStore()

  return (
    <div className="max-w-xl space-y-3">
      <p className="text-sm text-stone">
        Elegí qué te muestra la campanita. El envío por email llega más adelante (info.md §16).
      </p>
      <ul className="divide-y divide-hairline-on-bone rounded-2xl border border-hairline-on-bone bg-bone">
        {PREF_LABELS.map(pref => (
          <li key={pref.key} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-ink">{pref.title}</p>
              <p className="text-sm text-stone">{pref.detail}</p>
            </div>
            <Toggle on={prefs[pref.key]} onClick={() => prefs.toggle(pref.key)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
