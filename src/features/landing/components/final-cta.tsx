import { Reveal } from '@/components/ui/reveal'
import { CtaButton } from '@/components/ui/cta-button'

const PROOF_POINTS = [
  {
    label: 'Funciona offline',
    note: 'Cargás en el lote, sincroniza al volver la señal.',
  },
  {
    label: 'Aprende de tu historial',
    note: 'Recomienda fechas y dosis con tus propios datos.',
  },
  {
    label: 'Cotización del Mercado de Rosario',
    note: 'En tiempo real, impactando directamente tu rentabilidad.',
  },
]

export function FinalCta(): React.JSX.Element {
  return (
    <section id="registro" className="on-ink scroll-mt-20 bg-ink text-bone">
      <div className="mx-auto max-w-shell px-5 py-28 sm:px-8 sm:py-36">
        <Reveal>
          <p className="kicker text-wheat">El piloto</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display text-display-xl mt-6 max-w-[14ch] font-bold">Empezá a ordenar tu campaña hoy.</h2>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-14 grid grid-cols-1 divide-y divide-hairline-on-ink border-t border-hairline-on-ink sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {PROOF_POINTS.map(p => (
              <div key={p.label} className="flex flex-col gap-2.5 py-7 sm:px-8 sm:py-6 sm:first:pl-0 sm:last:pr-0">
                <span className="font-display text-[1.05rem] font-semibold leading-snug">{p.label}</span>
                <span className="font-sans text-sm leading-relaxed text-bone/55">{p.note}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-12 flex flex-col items-start gap-5">
            <CtaButton href="/register">Probar demo</CtaButton>
            <p className="font-sans text-sm text-bone/55">Estamos sumando un grupo reducido de agrónomos al piloto.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
