'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/ui/reveal'
import { BillingToggle } from '@/features/billing/components/billing-toggle'
import { PricingCard } from '@/features/billing/components/pricing-card'
import { ANNUAL_SAVINGS_LABEL, PLANS, type BillingCycle } from '@/features/billing/plans'

/**
 * Orchestrates the pricing grid. Owns the billing-cycle UI state and passes it
 * down to the presentational cards.
 */
export function PricingPlans(): React.JSX.Element {
  const [cycle, setCycle] = useState<BillingCycle>('monthly')

  return (
    <div>
      <div className="flex flex-col items-center gap-3">
        <BillingToggle value={cycle} onChange={setCycle} />
        <p
          className={cn(
            'font-sans text-sm text-clay transition-opacity duration-200',
            cycle === 'annual' ? 'opacity-100' : 'opacity-0',
          )}
        >
          {ANNUAL_SAVINGS_LABEL}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        {PLANS.map((plan, index) => (
          <Reveal key={plan.id} delay={index * 0.06} className="h-full">
            <PricingCard plan={plan} cycle={cycle} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
