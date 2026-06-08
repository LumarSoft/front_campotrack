import type { ReactNode } from 'react'

interface PageHeaderProps {
  /** Uppercase eyebrow above the title. */
  kicker: string
  title: string
  description?: string
  /** Right-aligned actions (buttons). */
  actions?: ReactNode
}

/**
 * Editorial page header matching the landing language: a clay kicker, a large
 * display title, and an optional description, with actions on the right.
 * Exposes `data-tour="page-header"` and `data-tour="primary-action"` anchors so
 * the per-section onboarding tour can spotlight the right elements.
 */
export function PageHeader({ kicker, title, description, actions }: PageHeaderProps): React.JSX.Element {
  return (
    <header data-tour="page-header" className="relative flex flex-wrap items-end justify-between gap-4 pb-6">
      <div className="max-w-2xl">
        <p className="kicker text-clay">{kicker}</p>
        <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 font-sans text-[0.95rem] text-muted-foreground">{description}</p>}
      </div>
      {actions && (
        <div data-tour="primary-action" className="flex flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-hairline-strong to-transparent"
      />
    </header>
  )
}
