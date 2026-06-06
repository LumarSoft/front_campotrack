import { Reveal } from '@/components/ui/reveal'

interface Step {
  n: string
  lead: string
  rest: string
}

const STEPS: Step[] = [
  {
    n: '01',
    lead: 'Cargás tus campos y campañas una vez.',
    rest: 'Clientes, lotes, campañas — la estructura de tu trabajo, ordenada.',
  },
  {
    n: '02',
    lead: 'Campo Track organiza eventos, costos y rendimientos.',
    rest: 'Por cada fecha clave: siembra, fumigación, cosecha, vencimientos.',
  },
  {
    n: '03',
    lead: 'Aprende de tus campañas anteriores.',
    rest: 'Y te sugiere fechas y dosis para la próxima, basándose en tus propios datos.',
  },
]

export function HowItWorks(): React.JSX.Element {
  return (
    <section id="como-funciona" className="on-ink scroll-mt-20 bg-ink text-bone">
      <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="kicker text-wheat">Cómo funciona</p>
          <h2 className="font-display text-section mt-6 max-w-[16ch] font-semibold">
            Tres movimientos. Después, sigue solo.
          </h2>
        </Reveal>

        <ol className="mt-16 sm:mt-20">
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.n}
              delay={i * 0.08}
              className="border-t border-hairline-on-ink py-10 last:border-b sm:py-14"
            >
              {/* zig-zag: alternate text column start to break the grid */}
              <div
                className={`grid grid-cols-1 items-baseline gap-x-10 gap-y-5 sm:grid-cols-12 ${
                  i % 2 === 1 ? 'sm:text-right' : ''
                }`}
              >
                <div className={`sm:col-span-3 ${i % 2 === 1 ? 'sm:order-2 sm:col-start-10' : ''}`}>
                  <span
                    className="font-display block text-[clamp(3.5rem,9vw,7rem)] font-black leading-none text-transparent"
                    style={{
                      WebkitTextStroke: '1px color-mix(in srgb, var(--wheat) 70%, transparent)',
                    }}
                  >
                    {step.n}
                  </span>
                </div>

                <div
                  className={`sm:col-span-8 ${
                    i % 2 === 1 ? 'sm:order-1 sm:col-start-1 sm:row-start-1' : 'sm:col-start-5'
                  }`}
                >
                  <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-tight">
                    {step.lead}
                  </h3>
                  <p
                    className={`measure mt-3 font-sans text-lg leading-relaxed text-bone/70 ${
                      i % 2 === 1 ? 'sm:ml-auto' : ''
                    }`}
                  >
                    {step.rest}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
