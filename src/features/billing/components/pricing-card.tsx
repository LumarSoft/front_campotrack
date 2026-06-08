import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BillingCycle, Plan } from '@/features/billing/plans'

interface PricingCardProps {
  plan: Plan
  cycle: BillingCycle
}

function CheckIcon(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-clay"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m4 10 4 4 8-9" />
    </svg>
  )
}

/**
 * Single plan card. Presentational — receives the plan and the active billing
 * cycle and renders the matching price.
 */
export function PricingCard({ plan, cycle }: PricingCardProps): React.JSX.Element {
  const price = cycle === 'monthly' ? plan.monthly : plan.annual
  const isCustom = price === null

  return (
    <div
      className={cn(
        'relative flex h-full flex-col rounded-3xl border bg-white p-7 sm:p-8',
        plan.featured
          ? 'border-clay shadow-[0_28px_70px_-30px_rgba(42,122,74,0.45)] ring-1 ring-clay lg:-translate-y-3'
          : 'border-hairline-on-bone',
      )}
    >
      {plan.featured && (
        <span className="absolute -top-3 left-7 rounded-full bg-clay px-3 py-1 font-sans text-xs font-semibold text-bone">
          Más elegido
        </span>
      )}

      <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
      <p className="mt-2 min-h-[3rem] font-sans text-sm leading-relaxed text-stone">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        {isCustom ? (
          <span className="font-display text-4xl font-bold tracking-tight">A medida</span>
        ) : (
          <>
            <span className="font-display text-5xl font-bold tracking-tight">US$ {price}</span>
            <span className="font-sans text-sm text-stone">/ mes</span>
          </>
        )}
      </div>
      <p className="mt-1.5 font-sans text-xs text-stone/70">
        {isCustom
          ? 'Precio según tamaño de la operación'
          : cycle === 'annual'
            ? 'Por usuario · facturado anual'
            : 'Por usuario · facturado mensual'}
      </p>

      <Button
        asChild
        variant={plan.featured ? 'default' : 'outline'}
        className="mt-7 h-11 w-full rounded-full text-sm font-medium"
      >
        <a href={plan.cta.href}>{plan.cta.label}</a>
      </Button>

      <ul className="mt-8 flex flex-col gap-3 border-t border-hairline-on-bone pt-6">
        {plan.features.map(feature => (
          <li key={feature} className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-ink/80">
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}
