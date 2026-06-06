import type { BillingCycle } from '@/features/billing/plans'
import { cn } from '@/lib/utils'

interface BillingToggleProps {
  value: BillingCycle
  onChange: (cycle: BillingCycle) => void
}

const OPTIONS: { value: BillingCycle; label: string }[] = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'annual', label: 'Anual' },
]

/**
 * Segmented control to switch the displayed billing cycle. Presentational and
 * controlled — the parent owns the selected value.
 */
export function BillingToggle({ value, onChange }: BillingToggleProps): React.JSX.Element {
  return (
    <div
      role="radiogroup"
      aria-label="Ciclo de facturación"
      className="inline-flex items-center gap-1 rounded-full border border-hairline-on-bone bg-white p-1"
    >
      {OPTIONS.map(option => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full px-4 py-1.5 font-sans text-sm font-medium transition-colors duration-200',
              active ? 'bg-clay text-bone' : 'text-stone hover:text-ink',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
