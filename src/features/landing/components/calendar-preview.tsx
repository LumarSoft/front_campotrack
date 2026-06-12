'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useStepLoop } from '@/features/landing/hooks/use-step-loop'

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98]

const EVENTS = [
  { name: 'Siembra', lot: 'Lote 4 · Nte', due: 'en 3 días' },
  { name: 'Fumigación', lot: 'Lote 7 · Sur', due: 'mañana' },
  { name: 'Cosecha', lot: 'Lote 2', due: 'en 2 sem.' },
] as const

const SCAN_DELAY = 2400

/**
 * Upcoming-events list for the calendar tile. A highlight scans row by row:
 * the active event gets a pinging clay dot and its lot label crossfades into
 * the time until the alert fires.
 */
export function CalendarPreview(): React.JSX.Element {
  const active = useStepLoop(EVENTS.length - 1, SCAN_DELAY)

  return (
    <ul className="shrink-0 space-y-2.5 font-sans text-sm sm:min-w-[12rem]">
      {EVENTS.map((ev, i) => {
        const isActive = i === active
        return (
          <li key={ev.name} className="flex items-center justify-between gap-4 border-b border-hairline-on-bone pb-2">
            <span className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
                {isActive && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-50" />
                )}
                <span
                  className={`relative inline-flex h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                    isActive ? 'bg-clay' : 'bg-stone/25'
                  }`}
                />
              </span>
              <span className={`transition-colors duration-300 ${isActive ? 'text-ink' : 'text-ink/75'}`}>
                {ev.name}
              </span>
            </span>
            <span className="inline-grid justify-items-end">
              <AnimatePresence initial={false}>
                <motion.span
                  key={isActive ? 'due' : 'lot'}
                  className={`[grid-area:1/1] whitespace-nowrap ${isActive ? 'font-medium text-clay' : 'text-stone'}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {isActive ? ev.due : ev.lot}
                </motion.span>
              </AnimatePresence>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
