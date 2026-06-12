'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Wordmark } from '@/components/ui/wordmark'
import { useDismiss } from '@/features/landing/hooks/use-dismiss'

const NAV_LINKS = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#funcionalidades', label: 'Funcionalidades' },
  { href: '#para-quien', label: 'Para quién' },
  { href: '/billing', label: 'Planes' },
] as const

const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98]

/**
 * Floating pill header. A contained, rounded capsule that sits over the hero:
 * brand badge + wordmark on the left, centered nav, CTA on the right. Uses a
 * translucent ink background with blur so it reads over the aerial video.
 * Below `lg` the nav collapses into a toggle that expands the capsule into a
 * rounded panel with the links (and, on phones, the auth actions).
 */
export function SiteHeader(): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const shellRef = useRef<HTMLDivElement>(null)

  const closeMenu = (): void => setMenuOpen(false)
  useDismiss(shellRef, menuOpen, closeMenu)

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-shell px-4 pt-4 sm:px-6 sm:pt-6">
        <div
          ref={shellRef}
          className={`relative border border-bone/15 bg-ink/55 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-[border-radius] duration-300 ${
            menuOpen ? 'rounded-[1.375rem]' : 'rounded-[2rem]'
          }`}
        >
          {/* Bar */}
          <div className="relative flex items-center justify-between gap-2 p-2.5 sm:p-3">
            {/* Brand */}
            <a
              href="#top"
              className="flex items-center gap-3 rounded-full pl-1 pr-2 transition-opacity duration-200 hover:opacity-90"
              aria-label="Campo Track — inicio"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clay text-bone shadow-inner sm:h-10 sm:w-10">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M12 21v-9" />
                  <path d="M12 13C12 9 9 6.5 4.5 6.5 4.5 10.5 7.5 13 12 13Z" />
                  <path d="M12 11.5C12 8 14.5 6 18.5 6 18.5 9.5 16 11.5 12 11.5Z" />
                </svg>
              </span>
              <span className="flex flex-col leading-none">
                <Wordmark className="text-[1.05rem] text-bone sm:text-[1.15rem]" />
                <span className="mt-0.5 hidden font-sans text-[0.6rem] uppercase tracking-[0.18em] text-bone/45 sm:block">
                  Gestión agrícola
                </span>
              </span>
            </a>

            {/* Centered nav — desktop only */}
            <nav
              className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex"
              aria-label="Principal"
            >
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm text-bone/75 transition-colors duration-200 hover:text-bone"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2.5 font-sans text-sm font-medium text-bone/80 transition-colors duration-200 hover:text-bone sm:inline-flex"
              >
                Ingresar
              </Link>
              <Link
                href="/register"
                className="group hidden items-center gap-2 rounded-full bg-clay px-5 py-2.5 font-sans text-sm font-medium text-bone transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-clay-deep sm:inline-flex"
              >
                Probar demo
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>

              {/* Menu toggle — tablet and phones */}
              <button
                type="button"
                onClick={() => setMenuOpen(open => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 bg-bone/5 text-bone transition-colors duration-200 hover:bg-bone/10 sm:h-10 sm:w-10 lg:hidden"
              >
                <span aria-hidden className="relative block h-2.5 w-4">
                  <span
                    className={`absolute left-0 top-0 block h-[1.5px] w-full rounded-full bg-current transition-transform duration-300 ${
                      menuOpen ? 'translate-y-[4.25px] rotate-45' : ''
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-0 block h-[1.5px] w-full rounded-full bg-current transition-transform duration-300 ${
                      menuOpen ? '-translate-y-[4.25px] -rotate-45' : ''
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Mobile panel — the capsule expands into a rounded card */}
          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                id="mobile-menu"
                className="overflow-hidden lg:hidden"
                initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE }}
              >
                <nav
                  aria-label="Principal"
                  className="flex max-h-[calc(100svh-9rem)] flex-col overflow-y-auto px-5 pb-5 pt-1"
                >
                  <div className="border-t border-bone/10" />
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: reduceMotion ? 0 : 0.3, ease: EASE }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className="flex items-center justify-between border-b border-bone/10 py-3.5 font-sans text-[0.95rem] text-bone/85 transition-colors duration-200 hover:text-bone"
                      >
                        {link.label}
                        <span aria-hidden className="text-bone/35">
                          →
                        </span>
                      </Link>
                    </motion.div>
                  ))}

                  {/* Auth actions — phones only; visible in the bar from sm up */}
                  <motion.div
                    className="flex flex-col gap-2.5 pt-4 sm:hidden"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.08 + NAV_LINKS.length * 0.05,
                      duration: reduceMotion ? 0 : 0.3,
                      ease: EASE,
                    }}
                  >
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="inline-flex w-full items-center justify-center rounded-full border border-bone/15 px-5 py-3 font-sans text-sm font-medium text-bone/85 transition-colors duration-200 hover:bg-bone/5 hover:text-bone"
                    >
                      Ingresar
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-clay px-5 py-3 font-sans text-sm font-medium text-bone transition-colors duration-200 hover:bg-clay-deep"
                    >
                      Probar demo
                      <span aria-hidden>→</span>
                    </Link>
                  </motion.div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
