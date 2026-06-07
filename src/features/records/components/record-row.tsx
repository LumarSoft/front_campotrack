'use client'

import type { ReactNode } from 'react'
import { formatDayLong } from '@/features/calendar/date-utils'
import { RECORD_SUBTYPE_COLOR, RECORD_SUBTYPE_LABELS } from '@/features/records/record-config'
import type { RecordSubtype } from '@/types/api/records'

interface RecordRowProps {
  subtype: RecordSubtype
  dateKey: string
  fieldLabel: string
  summary: string
  badge: ReactNode
  actions?: ReactNode
}

/** Presentational bitácora row, shared by synced and pending records. */
export function RecordRow({ subtype, dateKey, fieldLabel, summary, badge, actions }: RecordRowProps): React.JSX.Element {
  return (
    <article className="flex items-start justify-between gap-3 rounded-2xl border border-hairline-on-bone p-4">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-full" style={{ background: RECORD_SUBTYPE_COLOR[subtype] }} />
          <span className="font-medium text-ink">{RECORD_SUBTYPE_LABELS[subtype]}</span>
          {badge}
        </div>
        {fieldLabel && <p className="truncate text-sm text-stone">{fieldLabel}</p>}
        {summary && <p className="text-sm text-ink/80">{summary}</p>}
        <p className="text-xs capitalize text-stone">{formatDayLong(dateKey)}</p>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </article>
  )
}
