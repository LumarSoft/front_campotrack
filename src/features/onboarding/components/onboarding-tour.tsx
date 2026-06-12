'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useOnboardingStore } from '../store/use-onboarding-store'
import { useTourAnchor, type AnchorRect } from '../hooks/use-tour-anchor'
import { ROUTE_TO_TOUR, TOURS, type StepPlacement, type TourStep } from '../onboarding-config'

const AUTO_START_DELAY_MS = 650
const TOOLTIP_WIDTH = 380
const VIEWPORT_PADDING = 16
const SPOTLIGHT_RADIUS = 16
const TOOLTIP_GAP = 18
/** Used before the tooltip mounts and reports its real height. */
const TOOLTIP_HEIGHT_ESTIMATE = 220

interface TooltipPosition {
  top: number
  left: number
  /** True when the tooltip should sit at the viewport center (no spotlight target). */
  centered: boolean
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

function computeTooltipPosition(
  rect: AnchorRect | null,
  placement: StepPlacement,
  padding: number,
  tooltipHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): TooltipPosition {
  if (!rect || placement === 'center') {
    return { top: 0, left: 0, centered: true }
  }

  const targetTop = rect.top - padding
  const targetLeft = rect.left - padding
  const targetRight = rect.left + rect.width + padding
  const targetBottom = rect.top + rect.height + padding
  const targetCenterX = rect.left + rect.width / 2
  const targetCenterY = rect.top + rect.height / 2

  let preferred = placement

  // Auto-flip when there isn't enough room in the preferred direction.
  if (preferred === 'left' && targetLeft - TOOLTIP_GAP - TOOLTIP_WIDTH < VIEWPORT_PADDING) {
    preferred = 'right'
  } else if (preferred === 'right' && targetRight + TOOLTIP_GAP + TOOLTIP_WIDTH > viewportWidth - VIEWPORT_PADDING) {
    preferred = 'left'
  } else if (preferred === 'top' && targetTop - TOOLTIP_GAP - tooltipHeight < VIEWPORT_PADDING) {
    preferred = 'bottom'
  } else if (preferred === 'bottom' && targetBottom + TOOLTIP_GAP + tooltipHeight > viewportHeight - VIEWPORT_PADDING) {
    preferred = 'top'
  }

  let top = 0
  let left = 0

  switch (preferred) {
    case 'top':
      top = targetTop - TOOLTIP_GAP - tooltipHeight
      left = targetCenterX - TOOLTIP_WIDTH / 2
      break
    case 'bottom':
      top = targetBottom + TOOLTIP_GAP
      left = targetCenterX - TOOLTIP_WIDTH / 2
      break
    case 'left':
      top = targetCenterY - tooltipHeight / 2
      left = targetLeft - TOOLTIP_GAP - TOOLTIP_WIDTH
      break
    case 'right':
      top = targetCenterY - tooltipHeight / 2
      left = targetRight + TOOLTIP_GAP
      break
  }

  left = clamp(left, VIEWPORT_PADDING, viewportWidth - TOOLTIP_WIDTH - VIEWPORT_PADDING)
  top = clamp(top, VIEWPORT_PADDING, viewportHeight - tooltipHeight - VIEWPORT_PADDING)

  return { top, left, centered: false }
}

interface SpotlightProps {
  rect: AnchorRect | null
  padding: number
}

function Spotlight({ rect, padding }: SpotlightProps): React.JSX.Element {
  const [size, setSize] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  }))

  useEffect(() => {
    const onResize = (): void => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (!rect) {
    return (
      <motion.div
        key="full-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-auto absolute inset-0 bg-[color-mix(in_srgb,var(--ink)_72%,transparent)] backdrop-blur-[3px]"
      />
    )
  }

  const x = rect.left - padding
  const y = rect.top - padding
  const w = rect.width + padding * 2
  const h = rect.height + padding * 2

  return (
    <motion.svg
      key="masked-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      width={size.w}
      height={size.h}
      className="pointer-events-auto absolute inset-0"
      aria-hidden
    >
      <defs>
        <mask id="onboarding-cutout">
          <rect width={size.w} height={size.h} fill="white" />
          <motion.rect
            initial={false}
            animate={{ x, y, width: w, height: h }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            rx={SPOTLIGHT_RADIUS}
            ry={SPOTLIGHT_RADIUS}
            fill="black"
          />
        </mask>
      </defs>
      <rect
        width={size.w}
        height={size.h}
        fill="color-mix(in srgb, var(--ink) 68%, transparent)"
        mask="url(#onboarding-cutout)"
      />
      <motion.rect
        initial={false}
        animate={{ x: x - 2, y: y - 2, width: w + 4, height: h + 4 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        rx={SPOTLIGHT_RADIUS + 2}
        ry={SPOTLIGHT_RADIUS + 2}
        fill="none"
        stroke="var(--clay)"
        strokeWidth={2}
        strokeOpacity={0.7}
      />
    </motion.svg>
  )
}

interface TooltipProps {
  step: TourStep
  stepIndex: number
  total: number
  position: TooltipPosition
  tooltipRef: React.RefObject<HTMLDivElement | null>
  onPrev: () => void
  onNext: () => void
  onSkip: () => void
}

function Tooltip({
  step,
  stepIndex,
  total,
  position,
  tooltipRef,
  onPrev,
  onNext,
  onSkip,
}: TooltipProps): React.JSX.Element {
  const reduceMotion = useReducedMotion()
  const Icon = step.icon
  const isLast = stepIndex === total - 1
  const isFirst = stepIndex === 0

  return (
    <motion.div
      key={step.id}
      ref={tooltipRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`tour-title-${step.id}`}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 4 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={
        position.centered
          ? 'pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-hairline-on-bone bg-paper p-6 shadow-[var(--shadow-lg)]'
          : 'pointer-events-auto absolute rounded-2xl border border-hairline-on-bone bg-paper p-5 shadow-[var(--shadow-lg)]'
      }
      style={position.centered ? { width: TOOLTIP_WIDTH } : { top: position.top, left: position.left, width: TOOLTIP_WIDTH }}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-clay/10 text-field ring-1 ring-clay/20">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="kicker text-clay">
            Paso {stepIndex + 1} de {total}
          </p>
          <h2 id={`tour-title-${step.id}`} className="font-display mt-1 text-lg font-semibold text-ink">
            {step.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onSkip}
          aria-label="Cerrar tutorial"
          className="-mr-1 -mt-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-stone transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>

      <div className="mt-5 flex flex-col gap-3 border-t border-hairline-on-bone pt-4">
        <div className="flex items-center gap-1.5" aria-hidden>
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={
                i === stepIndex
                  ? 'h-1.5 w-6 rounded-full bg-clay transition-all duration-300'
                  : i < stepIndex
                    ? 'h-1.5 w-1.5 rounded-full bg-clay/50 transition-all duration-300'
                    : 'h-1.5 w-1.5 rounded-full bg-stone/25 transition-all duration-300'
              }
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onSkip}
            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-stone whitespace-nowrap transition-colors duration-150 hover:text-ink"
          >
            Saltar tutorial
          </button>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={onPrev}
                className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-hairline-strong bg-bone px-3 py-1.5 text-xs font-medium text-ink transition-colors duration-150 hover:bg-accent"
              >
                <ChevronLeft className="size-3.5" />
                Atrás
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-clay px-3.5 py-1.5 text-xs font-semibold text-bone shadow-[var(--shadow-soft)] transition-all duration-150 hover:bg-clay-deep hover:shadow-[var(--shadow-md)] active:translate-y-px"
            >
              {isLast ? 'Empezar' : 'Siguiente'}
              {!isLast && <ChevronRight className="size-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface OnboardingTourProps {
  userId: number
}

/**
 * First-time guided tour. Auto-starts the matching tour the first time the user
 * lands on each section (per the ROUTE_TO_TOUR map). Skippable from any step;
 * completion is persisted per user + tour id in localStorage.
 */
export function OnboardingTour({ userId }: OnboardingTourProps): React.JSX.Element | null {
  const pathname = usePathname()
  const activeTourId = useOnboardingStore(state => state.activeTourId)
  const stepIndex = useOnboardingStore(state => state.stepIndex)
  const next = useOnboardingStore(state => state.next)
  const prev = useOnboardingStore(state => state.prev)
  const finish = useOnboardingStore(state => state.finish)
  const start = useOnboardingStore(state => state.start)
  const hasCompleted = useOnboardingStore(state => state.hasCompleted)

  const steps = activeTourId ? TOURS[activeTourId] : null
  const isOpen = Boolean(steps && steps.length > 0)
  const step = steps ? steps[Math.min(stepIndex, steps.length - 1)] : null

  const rect = useTourAnchor(isOpen && step ? step.target : null)

  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const [tooltipHeight, setTooltipHeight] = useState(TOOLTIP_HEIGHT_ESTIMATE)
  const [viewport, setViewport] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  }))

  useEffect(() => {
    const onResize = (): void => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useLayoutEffect(() => {
    if (!tooltipRef.current) return
    const measured = tooltipRef.current.getBoundingClientRect().height
    setTooltipHeight(prev => (Math.abs(measured - prev) > 1 ? measured : prev))
  }, [step?.id, viewport.w])

  const position: TooltipPosition = step
    ? computeTooltipPosition(rect, step.placement, step.padding ?? 8, tooltipHeight, viewport.w, viewport.h)
    : { top: 0, left: 0, centered: true }

  useEffect(() => {
    const tourId = ROUTE_TO_TOUR[pathname]
    if (!tourId) return
    if (hasCompleted(userId, tourId)) return
    if (activeTourId) return
    const handle = window.setTimeout(() => start(tourId), AUTO_START_DELAY_MS)
    return () => window.clearTimeout(handle)
  }, [pathname, userId, hasCompleted, activeTourId, start])

  const total = steps?.length ?? 0

  const handleNext = (): void => {
    if (!steps) return
    if (stepIndex >= steps.length - 1) finish(userId)
    else next()
  }

  const handleSkip = (): void => finish(userId)

  useEffect(() => {
    if (!isOpen || !steps) return
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') finish(userId)
      else if (event.key === 'ArrowRight') {
        if (stepIndex >= steps.length - 1) finish(userId)
        else next()
      } else if (event.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, steps, stepIndex, userId, finish, next, prev])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && step && (
        <motion.div
          key="onboarding-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100]"
          aria-live="polite"
        >
          <Spotlight rect={rect} padding={step.padding ?? 8} />
          <AnimatePresence mode="wait">
            <Tooltip
              key={step.id}
              step={step}
              stepIndex={stepIndex}
              total={total}
              position={position}
              tooltipRef={tooltipRef}
              onPrev={prev}
              onNext={handleNext}
              onSkip={handleSkip}
            />
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
