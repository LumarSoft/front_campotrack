import { Reveal } from '@/components/ui/reveal'

const PROFILES = [
  {
    n: '01',
    label: 'Ingenieros agrónomos independientes',
    note: 'Con cartera propia de campos y clientes que necesitan orden sin gastar horas en planillas.',
  },
  {
    n: '02',
    label: 'Asesores con múltiples clientes',
    note: 'Que quieren visibilidad cruzada, reportes claros y nunca perder un vencimiento.',
  },
  {
    n: '03',
    label: 'Productores que manejan varios lotes',
    note: 'Que quieren dejar de perder histórico entre carpetas y copias de Excel.',
  },
]

export function AudienceSection(): React.JSX.Element {
  return (
    <section id="para-quien" className="scroll-mt-24 bg-bone text-ink">
      <div className="mx-auto max-w-shell px-5 py-20 sm:px-8 sm:py-24">
        {/* Header */}
        <div className="grid grid-cols-1 items-baseline gap-x-12 gap-y-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <p className="kicker text-clay">Para quién</p>
            <h2 className="font-display text-section mt-5 max-w-[16ch] font-semibold">
              Pensada para agrónomos, no para oficinas.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-8 lg:pt-2">
            <p className="measure font-sans text-lg leading-relaxed text-ink/70">
              Si manejás varios campos y clientes y querés visibilidad total sin depender de planillas, Campo Track es
              para vos.
            </p>
          </Reveal>
        </div>

        {/* Profiles */}
        <Reveal delay={0.14}>
          <div className="mt-12 grid grid-cols-1 divide-y divide-hairline-on-bone border-t border-hairline-on-bone sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {PROFILES.map(p => (
              <div key={p.n} className="flex flex-col gap-3 py-8 sm:px-8 sm:py-7 sm:first:pl-0 sm:last:pr-0">
                <span className="font-sans text-xs font-semibold tracking-widest text-clay">{p.n}</span>
                <span className="font-display text-[1.1rem] font-semibold leading-snug">{p.label}</span>
                <span className="font-sans text-sm leading-relaxed text-stone">{p.note}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
