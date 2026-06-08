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
 */
export function PageHeader({ kicker, title, description, actions }: PageHeaderProps): React.JSX.Element {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline-on-bone pb-6">
      <div>
        <p className="kicker text-clay">{kicker}</p>
        <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 font-sans text-[0.95rem] text-stone">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
