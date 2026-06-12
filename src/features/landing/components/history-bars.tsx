'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useStepLoop } from '@/features/landing/hooks/use-step-loop'

const METRICS = [
  { label: 'Rinde por campaña', values: [40, 64, 52, 78] },
  { label: 'Margen por hectárea', values: [58, 42, 66, 74] },
  { label: 'Costos directos', values: [62, 48, 56, 38] },
] as const

const METRIC_DELAY = 3200

const MAX_BAR_HEIGHT = 78

/**
 * Comparison bars for the history-intelligence tile. The four campaign bars
 * morph between metrics (rinde, margen, costos) while the caption crossfades;
 * the current campaign (C4) stays highlighted in clay.
 */
export function HistoryBars(): React.JSX.Element {
  const metric = METRICS[useStepLoop(METRICS.length - 1, METRIC_DELAY)] ?? METRICS[0]

  return (
    <div className="flex shrink-0 flex-col gap-2.5" aria-hidden>
      <span className="inline-grid font-sans text-[0.65rem] uppercase tracking-[0.08em] text-stone">
        <AnimatePresence initial={false}>
          <motion.span
            key={metric.label}
            className="[grid-area:1/1] whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {metric.label}
          </motion.span>
        </AnimatePresence>
      </span>
      <div>
        <div className="flex items-end gap-2.5" style={{ height: MAX_BAR_HEIGHT }}>
          {metric.values.map((h, idx) => (
            <div
              key={idx}
              className="w-7 rounded-t-sm transition-[height] duration-700 ease-spring"
              style={{
                height: `${h}px`,
                background: idx === 3 ? 'var(--clay)' : 'color-mix(in srgb, var(--stone) 45%, transparent)',
              }}
            />
          ))}
        </div>
        <div className="mt-1.5 flex gap-2.5">
          {metric.values.map((_, idx) => (
            <span key={idx} className="w-7 text-center font-sans text-[0.65rem] text-stone">
              C{idx + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
