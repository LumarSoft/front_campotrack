import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium select-none",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-[var(--ease-out)]",
    "shrink-0 outline-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "focus-visible:ring-[3px] focus-visible:ring-ring/55 focus-visible:border-ring",
    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
    "active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50 disabled:saturate-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:saturate-50",
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-clay-deep hover:shadow-[var(--shadow-md)]',
        destructive:
          'bg-destructive text-white shadow-[var(--shadow-soft)] hover:bg-destructive/90 focus-visible:ring-destructive/30',
        outline:
          'border border-hairline-strong bg-bone text-ink hover:bg-accent hover:text-accent-foreground hover:border-clay/30',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_srgb,var(--clay)_14%,var(--bone))]',
        ghost:
          'text-ink hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }): React.JSX.Element {
  const Comp = asChild ? Slot : 'button'

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
