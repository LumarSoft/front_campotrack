const FIELDS = [
  { status: 'active', name: 'Lote 1 Norte', crop: 'Soja', ha: '85 ha', event: 'Cosecha', when: '12d' },
  { status: 'active', name: 'Lote 3 Sur', crop: 'Maíz', ha: '120 ha', event: 'Siembra', when: 'ok' },
  { status: 'alert', name: 'Lote 7', crop: 'Soja', ha: '95 ha', event: 'Fumigación', when: 'Hoy' },
  { status: 'planned', name: 'Lote 2 Este', crop: '─', ha: '60 ha', event: 'Planificando', when: null },
] as const

const STATS = [
  { label: 'Hectáreas', value: '2.840', sub: 'ha totales' },
  { label: 'Lotes', value: '8', sub: 'en campaña' },
  { label: 'Soja', value: 'US$312', sub: '/ tn · hoy' },
] as const

const STATUS_DOT: Record<string, string> = {
  active: 'bg-clay',
  alert: 'bg-wheat',
  planned: 'bg-stone/30',
}

export function DashboardPreview(): React.JSX.Element {
  return (
    <div
      className="h-full w-full select-none overflow-hidden bg-[color-mix(in_srgb,var(--bone)_60%,white)] font-sans"
      aria-hidden
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--stone)_14%,transparent)] bg-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-clay" />
          <span className="text-[11px] font-semibold tracking-tight text-ink">Campo Track</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-stone">Campaña 2024/25</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-field text-[8px] font-bold text-bone">
            MB
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {STATS.map(s => (
          <div key={s.label} className="rounded-lg bg-white px-2.5 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
            <p className="text-[8.5px] uppercase tracking-wide text-stone">{s.label}</p>
            <p className="mt-0.5 text-[13px] font-bold tracking-tight text-ink">{s.value}</p>
            <p className="text-[8.5px] text-stone/60">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Field list */}
      <div className="px-3 pb-3">
        <div className="overflow-hidden rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.07)]">
          {/* List header */}
          <div className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--stone)_12%,transparent)] px-3 py-1.5">
            <span className="text-[10px] font-semibold text-ink">Lotes activos</span>
            <span className="rounded-full bg-clay px-2 py-0.5 text-[8px] font-semibold text-bone">+ Nuevo lote</span>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 border-b border-[color-mix(in_srgb,var(--stone)_8%,transparent)] px-3 py-1">
            <span className="text-[8.5px] uppercase tracking-wide text-stone/50">Lote</span>
            <span className="text-[8.5px] uppercase tracking-wide text-stone/50">Ha</span>
            <span className="text-[8.5px] uppercase tracking-wide text-stone/50">Próximo evento</span>
            <span className="text-[8.5px] uppercase tracking-wide text-stone/50">Cuando</span>
          </div>

          {/* Rows */}
          {FIELDS.map((f, i) => (
            <div
              key={f.name}
              className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-3 px-3 py-2 ${
                i !== FIELDS.length - 1 ? 'border-b border-[color-mix(in_srgb,var(--stone)_8%,transparent)]' : ''
              }`}
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[f.status]}`} />
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-medium text-ink">{f.name}</p>
                  <span className="rounded-full bg-[color-mix(in_srgb,var(--clay)_9%,white)] px-1.5 py-px text-[7.5px] font-medium text-clay">
                    {f.crop}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-right text-[9px] text-stone">{f.ha}</span>
              <span className="shrink-0 text-[9px] text-stone/70">{f.event}</span>
              <span
                className={`shrink-0 text-right text-[8.5px] font-semibold ${
                  f.when === 'Hoy' ? 'text-wheat' : f.when === 'ok' ? 'text-clay' : 'text-stone/40'
                }`}
              >
                {f.when === 'ok' ? '✓' : (f.when ?? '─')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alert strip */}
      <div className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-wheat/30 bg-[color-mix(in_srgb,var(--wheat)_8%,white)] px-3 py-1.5">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-wheat" />
        <p className="text-[9px] text-ink/80">
          <span className="font-semibold">Fumigación</span> · Lote 7 ·{' '}
          <span className="text-wheat font-semibold">Hoy</span>
        </p>
      </div>
    </div>
  )
}
