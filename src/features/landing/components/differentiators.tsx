import { Reveal } from '@/components/ui/reveal'

const ITEMS = [
  { label: 'Funciona offline', note: 'Cargás en el lote, sincroniza al volver.' },
  { label: 'Aprende de tu historial', note: 'Recomienda con tus propios datos.' },
  {
    label: 'Cotización del Mercado de Rosario integrada',
    note: 'En tiempo real, sobre tu rentabilidad.',
  },
]

/** Band. Typography is the hero; hairlines split the three items. */
export function Differentiators(): React.JSX.Element {
  return (
    <section className="on-ink bg-ink text-bone">
      <div className="mx-auto max-w-shell px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid grid-cols-1 divide-y divide-hairline-on-ink border-y border-hairline-on-ink sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {ITEMS.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.1} className="px-0 py-10 sm:px-8 sm:py-2 sm:first:pl-0">
              <div className="flex h-full flex-col gap-3">
                <span className="font-display text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-tight">
                  {item.label}
                </span>
                <span className="font-sans text-sm text-bone/60">{item.note}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
