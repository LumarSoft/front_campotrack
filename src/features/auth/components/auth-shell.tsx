import type { ReactNode } from 'react'
import Link from 'next/link'
import { Wordmark } from '@/components/ui/wordmark'
import { AuthBrandMark } from '@/features/auth/components/auth-brand-mark'

export interface BrandPanelContent {
  /** Background video served from /public. */
  videoSrc: string
  kicker: string
  headline: string
  /** Selling points listed under the headline. */
  bullets: string[]
  /** Cross-link CTA at the bottom of the panel. */
  cta: { text: string; linkLabel: string; href: string }
}

interface AuthShellProps {
  title: string
  subtitle: string
  panel: BrandPanelContent
  children: ReactNode
}

/**
 * Split-screen auth layout: an ink brand panel over a page-specific video on
 * the left, and the form card on the right. The panel content (video, copy,
 * CTA) is passed per page so login and register read differently.
 */
export function AuthShell({ title, subtitle, panel, children }: AuthShellProps): React.JSX.Element {
  return (
    <main className="grid min-h-[100svh] grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="on-ink relative hidden overflow-hidden bg-ink text-bone lg:flex lg:flex-col lg:justify-between">
        <video
          key={panel.videoSrc}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        >
          <source src={panel.videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" aria-hidden />

        <div className="relative z-10 flex items-center gap-3 p-10">
          <AuthBrandMark />
          <Wordmark className="text-[1.15rem] text-bone" />
        </div>

        <div className="relative z-10 p-10">
          <p className="kicker text-wheat">{panel.kicker}</p>
          <h2 className="font-display text-section mt-5 max-w-[16ch] font-bold">{panel.headline}</h2>

          <ul className="mt-10 flex flex-col gap-4 border-t border-hairline-on-ink pt-8">
            {panel.bullets.map(bullet => (
              <li key={bullet} className="flex items-start gap-3 font-sans text-sm leading-relaxed text-bone/70">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-clay" aria-hidden />
                {bullet}
              </li>
            ))}
          </ul>

          <p className="mt-10 font-sans text-sm text-bone/55">
            {panel.cta.text}{' '}
            <Link
              href={panel.cta.href}
              className="group inline-flex items-center gap-1 font-medium text-bone underline-offset-4 hover:underline"
            >
              {panel.cta.linkLabel}
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <section className="flex flex-col bg-bone">
        <header className="flex items-center justify-between p-6 sm:p-8 lg:hidden">
          <Link href="/" className="flex items-center gap-3" aria-label="Campo Track — inicio">
            <AuthBrandMark />
            <Wordmark className="text-[1.1rem]" />
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 sm:px-8">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold tracking-tight text-ink">{title}</h1>
              <p className="mt-2 font-sans text-[0.95rem] text-stone">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>

        <footer className="px-6 pb-8 sm:px-8">
          <Link
            href="/"
            className="font-sans text-sm text-stone underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            ← Volver al inicio
          </Link>
        </footer>
      </section>
    </main>
  )
}
