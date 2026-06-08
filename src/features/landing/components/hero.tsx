'use client'

import { motion, useReducedMotion } from 'motion/react'
import { CtaButton } from '@/components/ui/cta-button'

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98]

/**
 * Full-bleed hero. Ambient aerial video of the pampa, with a floating frosted
 * card holding the copy and a live-quote chip — the field stays visible behind.
 *
 * ASSET TODO: replace `/Cinematic_slow_aerial_drone_sh.mp4` (concept: slow
 * aerial pan over warm, golden pampa lots). Falls back to a solid brand
 * background under prefers-reduced-motion.
 */
export function Hero(): React.JSX.Element {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="top"
      className="on-ink relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-bone"
    >
      {/* Background media */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {reduceMotion ? (
          <div className="h-full w-full bg-field" />
        ) : (
          <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata">
            <source src="/Cinematic_slow_aerial_drone_sh.mp4" type="video/mp4" />
          </video>
        )}
        {/* Bottom-up veil: legibility base for the copy, field still shows on top */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, color-mix(in srgb, var(--ink) 92%, transparent) 0%, color-mix(in srgb, var(--ink) 68%, transparent) 32%, color-mix(in srgb, var(--ink) 30%, transparent) 60%, transparent 100%)',
          }}
        />
        {/* Left tint to anchor the copy over the video */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, color-mix(in srgb, var(--ink) 62%, transparent) 0%, color-mix(in srgb, var(--ink) 28%, transparent) 42%, transparent 65%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="mx-auto flex w-full max-w-shell flex-col gap-6 px-4 pb-24 pt-32 sm:px-6 sm:pb-28 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        {/* Copy card */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-[46rem]"
        >
          <h1 className="font-display text-hero mt-5 font-normal">
            Conocés tus campos mejor que nadie.{' '}
            <span className="font-black text-bone">El problema es que están en diez Excel distintos.</span>
          </h1>

          <p className="mt-6 max-w-[42ch] font-sans text-lg leading-relaxed text-bone/85 sm:text-xl">
            Campo Track reúne tus campañas, costos y rendimientos en un solo lugar. Y aprende de cada una para la
            próxima.
          </p>

          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <CtaButton href="#registro">Sumate al piloto</CtaButton>
            <a
              href="#como-funciona"
              className="group inline-flex items-center gap-2 font-sans text-base text-bone/90 transition-colors duration-200 hover:text-bone"
            >
              Ver cómo funciona
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
          </div>
        </motion.div>
      </div>
      {/* Scroll cue */}
      <a
        href="#como-funciona"
        aria-label="Ver más"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-sans text-[0.7rem] uppercase tracking-[0.18em] text-bone/55 transition-colors duration-200 hover:text-bone sm:flex"
      >
        <span className="h-px w-6 bg-bone/40" />
        Mirá más
        <motion.span
          aria-hidden
          animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          ↓
        </motion.span>
      </a>
    </section>
  )
}
