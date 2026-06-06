import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CtaButtonProps {
  href: string
  children: ReactNode
  variant?: 'solid' | 'outline'
  className?: string
}

/**
 * Primary action built on the shadcn/ui Button. Clay solid by default;
 * outline variant for use over dark (ink) backgrounds.
 */
export function CtaButton({ href, children, variant = 'solid', className }: CtaButtonProps): React.JSX.Element {
  const styles =
    variant === 'solid'
      ? 'bg-clay text-bone hover:bg-[#1f5e38] hover:-translate-y-0.5'
      : 'border border-current bg-transparent text-bone hover:bg-bone hover:text-ink hover:-translate-y-0.5'

  return (
    <Button
      asChild
      className={cn(
        'group h-auto gap-2.5 rounded-full px-7 py-3.5 text-[0.95rem] font-medium tracking-tight transition-[transform,background-color,color] duration-200 ease-out active:translate-y-px',
        styles,
        className,
      )}
    >
      <a href={href}>
        {children}
        <span aria-hidden className="transition-transform duration-200 ease-out group-hover:translate-x-1">
          →
        </span>
      </a>
    </Button>
  )
}
