import type { ReactNode } from 'react'

interface PhotoPlaceholderProps {
  /** Short note describing the real photo that goes here */
  label: string
  className?: string
  /** Optional foreground content rendered over the placeholder */
  children?: ReactNode
}

/**
 * Placeholder for real Argentine field photography.
 * Solid warm stone fill + a clear note of what photo belongs here.
 * Replace with <Image> + the real asset when available.
 */
export function PhotoPlaceholder({ label, className, children }: PhotoPlaceholderProps): React.JSX.Element {
  return (
    <div className={`relative isolate overflow-hidden bg-stone/80 ${className ?? ''}`} role="img" aria-label={label}>
      {/* Subtle tonal texture so it doesn't read as a flat box */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(135deg, color-mix(in srgb, var(--ink) 18%, transparent) 0%, transparent 55%), linear-gradient(0deg, color-mix(in srgb, var(--ink) 22%, transparent) 0%, transparent 40%)',
        }}
      />
      <div className="absolute left-5 top-5 z-10 flex items-center gap-2">
        <span className="block h-1.5 w-1.5 rounded-full bg-bone/80" />
        <span className="font-sans text-[0.7rem] uppercase tracking-[0.14em] text-bone/85">Foto real</span>
      </div>
      <p className="absolute bottom-5 left-5 right-5 z-10 font-sans text-sm leading-snug text-bone/85">{label}</p>
      {children}
    </div>
  )
}
