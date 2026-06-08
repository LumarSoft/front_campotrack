import type { Metadata } from 'next'
import Link from 'next/link'
import { Wordmark } from '@/components/ui/wordmark'
import { CtaButton } from '@/components/ui/cta-button'
import { PricingPlans } from '@/features/billing/components/pricing-plans'

export const metadata: Metadata = {
  title: 'Planes — Campo Track',
  description: 'Planes de Campo Track para cada etapa del campo: Starter, Pro y Enterprise. Valores de ejemplo.',
}

export default function BillingPage(): React.JSX.Element {
  return (
    <main className="min-h-[100svh] bg-bone text-ink">
      {/* Top bar */}
      <header className="mx-auto flex max-w-shell items-center justify-between px-5 py-6 sm:px-8">
        <Link href="/" className="flex items-center" aria-label="Campo Track — inicio">
          <Wordmark className="text-[1.35rem]" />
        </Link>
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-sans text-sm text-stone transition-colors duration-200 hover:text-ink"
        >
          <span aria-hidden className="transition-transform duration-200 group-hover:-translate-x-0.5">
            ←
          </span>
          Volver al inicio
        </Link>
      </header>

      {/* Heading */}
      <section className="mx-auto max-w-shell px-5 pb-24 pt-12 sm:px-8 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline-on-bone bg-white px-3 py-1 font-sans text-xs font-medium text-stone">
            <span className="h-1.5 w-1.5 rounded-full bg-wheat" />
            Valores de ejemplo · en definición
          </span>
          <h1 className="font-display text-section mt-6 font-semibold">Precios pensados para cada etapa del campo.</h1>
          <p className="mt-5 font-sans text-lg leading-relaxed text-ink/70">
            Empezá ordenando un campo y crecé hasta gestionar toda tu operación. Sin contratos atados: cambiás o
            cancelás cuando quieras.
          </p>
        </div>

        <div className="mt-14">
          <PricingPlans />
        </div>

        {/* Closing note */}
        <div className="mx-auto mt-20 flex max-w-2xl flex-col items-center gap-5 rounded-3xl border border-hairline-on-bone bg-white px-6 py-10 text-center">
          <h2 className="font-display text-2xl font-semibold">¿Ninguno encaja del todo?</h2>
          <p className="measure font-sans text-ink/70">
            Contanos cómo trabajás tus campos y armamos un plan a tu medida.
          </p>
          <CtaButton href="#">Hablemos</CtaButton>
        </div>
      </section>
    </main>
  )
}
