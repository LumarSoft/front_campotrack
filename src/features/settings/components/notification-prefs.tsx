'use client'

import { Switch } from '@/components/ui/switch'
import { useNotificationPrefsStore } from '@/features/notifications/store/use-notification-prefs-store'
import type { NotificationKind } from '@/features/notifications/lib/derive-notifications'

const PREF_LABELS: { key: NotificationKind; title: string; detail: string }[] = [
  { key: 'overdue', title: 'Eventos vencidos', detail: 'Avisar cuando un evento planificado pasa su fecha.' },
  { key: 'same_week', title: 'Alarma · misma semana', detail: 'Eventos con alarma dentro de los próximos 7 días.' },
  { key: 'day_before', title: 'Alarma · día anterior', detail: 'Eventos con alarma para mañana.' },
  { key: 'same_day', title: 'Alarma · el mismo día', detail: 'Eventos con alarma para hoy.' },
]

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
            <Switch
              checked={prefs[pref.key]}
              onCheckedChange={() => prefs.toggle(pref.key)}
              aria-label={pref.title}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
