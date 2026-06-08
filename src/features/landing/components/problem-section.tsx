import { Reveal } from '@/components/ui/reveal'

/** Scattered "spreadsheet" fragments, built from type + hairlines (no icons). */
const SCATTER = [
  { label: 'campo_norte_v4_FINAL.xlsx', tilt: '-rotate-3', offset: 'translate-y-2' },
  { label: 'campaña_soja_23-24.xlsx', tilt: 'rotate-2', offset: 'translate-y-6' },
  { label: 'costos_cliente_perez.xlsx', tilt: '-rotate-1', offset: '-translate-y-1' },
  { label: 'rindes_2022_copia.xlsx', tilt: 'rotate-3', offset: 'translate-y-4' },
  { label: 'fumigaciones (1).xlsx', tilt: '-rotate-2', offset: 'translate-y-1' },
]

export function ProblemSection(): React.JSX.Element {
  return (
    <section className="bg-bone text-ink">
      <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="kicker text-clay">El problema</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
          {/* Title — left, oversized, asymmetric */}
          <Reveal className="lg:col-span-6 lg:pr-8">
            <h2 className="font-display text-section max-w-[14ch] font-semibold">
              Hoy tu información vive en mil pedazos.
            </h2>
          </Reveal>

          {/* Text — right, offset down */}
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8 lg:pt-4">
            <p className="measure font-sans text-lg leading-relaxed text-ink/75">
              Un Excel por campo, otro por campaña, otro por cliente. Se pierden fechas, no hay un histórico confiable y
              calcular la rentabilidad es un dolor de cabeza cada cierre.
            </p>
          </Reveal>
        </div>

        {/* Scattered spreadsheet composition */}
        <Reveal delay={0.15} className="mt-16">
          <div className="relative flex flex-wrap items-start justify-center gap-x-4 gap-y-6 border-t border-hairline-on-bone pt-14 sm:justify-start sm:gap-x-8">
            {SCATTER.map(file => (
              <div
                key={file.label}
                className={`${file.tilt} ${file.offset} group select-none rounded-xl border border-hairline-on-bone bg-bone px-5 py-4 shadow-[0_1px_0_color-mix(in_srgb,var(--stone)_25%,transparent)] transition-transform duration-300 hover:rotate-0 hover:translate-y-0`}
              >
                {/* faux spreadsheet header row */}
                <div className="mb-3 flex gap-1.5">
                  <span className="h-2 w-2 border border-stone/50" />
                  <span className="h-2 w-2 border border-stone/50" />
                  <span className="h-2 w-2 border border-stone/50" />
                </div>
                <span className="font-sans text-sm text-stone">{file.label}</span>
                {/* faux cell grid lines */}
                <div className="mt-3 space-y-1.5" aria-hidden>
                  <div className="h-px w-28 bg-hairline-on-bone" />
                  <div className="h-px w-20 bg-hairline-on-bone" />
                  <div className="h-px w-24 bg-hairline-on-bone" />
                </div>
              </div>
            ))}
            <span className="self-center font-sans text-2xl text-stone/60">…</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
