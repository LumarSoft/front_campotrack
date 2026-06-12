import { Reveal } from '@/components/ui/reveal'
import { CalendarPreview } from './calendar-preview'
import { DashboardPreview } from './dashboard-preview'
import { HistoryBars } from './history-bars'
import { MarketTicker } from './market-ticker'
import { OfflineSyncPreview } from './offline-sync-preview'
import { TeamAvatars } from './team-avatars'

/**
 * Asymmetric bento (7/5 alternating). Every tile has a distinct interior
 * treatment so they never read as three identical cards.
 */
export function FeaturesSection(): React.JSX.Element {
  return (
    <section id="funcionalidades" className="scroll-mt-20 bg-bone text-ink">
      <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="kicker text-clay">Funcionalidades</p>
          <h2 className="font-display text-section mt-6 max-w-[18ch] font-semibold">
            Todo lo que hoy hacés a mano, en un solo lugar.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Unified panel — wide, with photo */}
          <Reveal className="lg:col-span-7">
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline-on-bone">
              <div className="aspect-[16/10] w-full overflow-hidden">
                <DashboardPreview />
              </div>
              <div className="flex flex-col gap-2 p-7">
                <h3 className="font-display text-2xl font-semibold">Panel unificado</h3>
                <p className="font-sans text-ink/70">El estado de todos tus campos activos de un vistazo.</p>
              </div>
            </article>
          </Reveal>

          {/* Works without signal — animated offline → sync */}
          <Reveal delay={0.06} className="lg:col-span-5">
            <article className="on-ink flex h-full flex-col justify-between gap-6 rounded-2xl bg-ink p-7 text-bone">
              <OfflineSyncPreview />
              <div>
                <h3 className="font-display text-2xl font-semibold">Funciona sin señal</h3>
                <p className="mt-2 font-sans text-bone/70">
                  Cargás offline en el campo y sincroniza al volver la señal.
                </p>
              </div>
            </article>
          </Reveal>

          {/* Real profitability — highlight, big live quote */}
          <Reveal delay={0.06} className="lg:col-span-5">
            <article className="flex h-full flex-col justify-between gap-8 rounded-2xl border border-clay/40 bg-[color-mix(in_srgb,var(--clay)_7%,var(--bone))] p-7">
              <MarketTicker />
              <div>
                <h3 className="font-display text-2xl font-semibold">Rentabilidad real</h3>
                <p className="mt-2 font-sans text-ink/70">
                  Costos por campaña, resultado por hectárea y la cotización del Mercado de Rosario en tiempo real
                  impactando tus números.
                </p>
              </div>
            </article>
          </Reveal>

          {/* Agronomic calendar — wide, date list */}
          <Reveal delay={0.06} className="lg:col-span-7">
            <article className="flex h-full flex-col justify-between gap-8 rounded-2xl border border-hairline-on-bone p-7 sm:flex-row sm:items-end">
              <div className="sm:max-w-[26ch]">
                <h3 className="font-display text-2xl font-semibold">Calendario agronómico</h3>
                <p className="mt-2 font-sans text-ink/70">
                  Siembra, fumigación, cosecha y vencimientos con alertas (misma semana, día anterior y el día) por
                  email y en la app.
                </p>
              </div>
              <CalendarPreview />
            </article>
          </Reveal>

          {/* History intelligence — wide, comparison bars */}
          <Reveal delay={0.06} className="lg:col-span-7">
            <article className="flex h-full flex-col justify-between gap-8 rounded-2xl border border-hairline-on-bone p-7 sm:flex-row sm:items-end">
              <div className="sm:max-w-[26ch]">
                <h3 className="font-display text-2xl font-semibold">Inteligencia sobre tu historial</h3>
                <p className="mt-2 font-sans text-ink/70">
                  Compará hasta 4 campañas y recibí recomendaciones de fechas y dosis con tus propios datos.
                </p>
              </div>
              <HistoryBars />
            </article>
          </Reveal>

          {/* Team and permissions — small, initials */}
          <Reveal delay={0.06} className="lg:col-span-5">
            <article className="flex h-full flex-col justify-between gap-8 rounded-2xl border border-hairline-on-bone p-7">
              <TeamAvatars />
              <div>
                <h3 className="font-display text-2xl font-semibold">Equipo y permisos</h3>
                <p className="mt-2 font-sans text-ink/70">
                  Invitá colaboradores con accesos a medida y auditoría de quién cargó qué.
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
