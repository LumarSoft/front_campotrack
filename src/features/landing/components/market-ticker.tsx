'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useStepLoop } from '@/features/landing/hooks/use-step-loop'

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98]

const TICKS = [
  { price: '312,40', delta: '+0,4%', up: true },
  { price: '311,90', delta: '−0,2%', up: false },
  { price: '313,10', delta: '+0,8%', up: true },
  { price: '312,60', delta: '−0,2%', up: false },
] as const

const TICK_DELAY = 2600

/**
 * Live-quote header for the profitability tile: a pinging "tiempo real" dot
 * and a soy price that ticks between plausible values with an up/down delta.
 */
export function MarketTicker(): React.JSX.Element {
  const tick = TICKS[useStepLoop(TICKS.length - 1, TICK_DELAY)] ?? TICKS[0]

  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-hairline-on-bone pb-3">
        <span className="font-sans text-xs uppercase tracking-[0.14em] text-clay">Mercado de Rosario · en vivo</span>
        <span className="flex items-center gap-1.5 font-sans text-xs text-field">
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-field opacity-40 [animation-duration:2.2s]" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-field" />
          </span>
          tiempo real
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-display text-4xl font-bold tracking-tight tabular-nums">
          US$&nbsp;
          <span className="inline-grid align-baseline">
            <AnimatePresence initial={false}>
              <motion.span
                key={tick.price}
                className="[grid-area:1/1]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {tick.price}
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
        <span className="font-sans text-sm text-ink/60">/ tn soja</span>
        <span className="inline-grid justify-items-end">
          <AnimatePresence initial={false}>
            <motion.span
              key={tick.delta + tick.price}
              className={`[grid-area:1/1] whitespace-nowrap font-sans text-xs font-semibold tabular-nums ${
                tick.up ? 'text-clay' : 'text-destructive/70'
              }`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {tick.up ? '▲' : '▼'} {tick.delta}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </div>
  )
}
