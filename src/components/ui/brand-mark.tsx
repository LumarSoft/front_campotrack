import { cn } from '@/lib/utils'

/**
 * Campo Track brand badge — the sprout glyph in a clay circle. Shared by the
 * auth pages and the app shell so everything stays visually consistent with the
 * landing's header mark.
 */
export function BrandMark({ className }: { className?: string }): React.JSX.Element {
  return (
    <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-full bg-clay text-bone shadow-inner', className)}>
      <svg
        viewBox="0 0 24 24"
        className="size-1/2"
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
  )
}
