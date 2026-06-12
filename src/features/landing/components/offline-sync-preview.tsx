'use client'

import { useStepLoop } from '@/features/landing/hooks/use-step-loop'

const EVENTS = ['Fumigación · Lote 3', 'Siembra · Lote 1', 'Rinde · Lote 7', 'Aplicación · Lote 5']

// Milliseconds each step lasts before advancing
const STEP_DELAYS = [2200, 850, 850, 850, 850, 2000]

type ItemState = 'idle' | 'uploading' | 'done'

function getItemState(step: number, idx: number): ItemState {
  if (step === 0) return 'idle'
  if (idx < step - 1) return 'done'
  if (idx === step - 1) return 'uploading'
  return 'idle'
}

export function OfflineSyncPreview(): React.JSX.Element {
  const step = useStepLoop(EVENTS.length + 1, STEP_DELAYS)

  const isSyncing = step > 0
  const allDone = step === EVENTS.length + 1

  return (
    <div className="flex select-none flex-col gap-3">
      {/* Offline panel */}
      <div
        className={`rounded-lg border border-bone/10 bg-bone/5 px-3 py-2.5 transition-opacity duration-700 ${
          isSyncing ? 'opacity-40' : 'opacity-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-[3px]">
            {[4, 7, 10, 13].map((h, i) => (
              <span key={i} className="w-[3px] rounded-[1px] bg-bone/20" style={{ height: h }} />
            ))}
          </div>
          <span className="font-sans text-[9px] uppercase tracking-widest text-bone/35">Sin señal · 14:32</span>
        </div>
        <div className="mt-2.5 flex flex-col gap-1.5">
          {EVENTS.map(ev => (
            <div key={ev} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-wheat/50" />
              <span className="flex-1 font-sans text-[10px] text-bone/50">{ev}</span>
              <span className="font-sans text-[9px] text-bone/30">guardado ✓</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-bone/10" />
        <span className="font-sans text-[9px] uppercase tracking-widest text-bone/30">señal restaurada</span>
        <div className="h-px flex-1 bg-bone/10" />
      </div>

      {/* Sync panel */}
      <div
        className={`rounded-lg border px-3 py-2.5 transition-colors duration-500 ${
          allDone
            ? 'border-clay/40 bg-[color-mix(in_srgb,var(--clay)_12%,transparent)]'
            : 'border-clay/25 bg-[color-mix(in_srgb,var(--clay)_8%,transparent)]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-[3px]">
            {[4, 7, 10, 13].map((h, i) => (
              <span
                key={i}
                className={`w-[3px] rounded-[1px] transition-all duration-300 ${
                  i < 2 ? 'bg-clay' : isSyncing ? `bg-clay ${!allDone ? 'animate-pulse' : ''}` : 'bg-bone/20'
                }`}
                style={{ height: h }}
              />
            ))}
          </div>
          {allDone ? (
            <span className="font-sans text-[9px] uppercase tracking-widest text-clay">✓ todo sincronizado</span>
          ) : (
            <div className="flex items-center gap-1.5">
              <svg
                className="h-3 w-3 animate-spin text-clay"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="font-sans text-[9px] uppercase tracking-widest text-clay">
                {step === 0 ? 'iniciando…' : 'sincronizando'}
              </span>
            </div>
          )}
        </div>

        {/* Rows */}
        <div className="mt-2.5 flex flex-col gap-1.5">
          {EVENTS.map((ev, i) => {
            const state = getItemState(step, i)
            return (
              <div key={ev} className="flex items-center gap-2">
                {state === 'done' && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />}
                {state === 'uploading' && (
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay opacity-50" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay" />
                  </span>
                )}
                {state === 'idle' && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-bone/20" />}
                <span
                  className={`flex-1 font-sans text-[10px] transition-colors duration-300 ${
                    state === 'done' ? 'text-bone/80' : state === 'uploading' ? 'text-bone/60' : 'text-bone/30'
                  }`}
                >
                  {ev}
                </span>
                <span
                  className={`font-sans text-[9px] transition-colors duration-300 ${
                    state === 'done' ? 'text-clay' : state === 'uploading' ? 'text-bone/50' : 'text-bone/20'
                  }`}
                >
                  {state === 'done' ? '✓ listo' : state === 'uploading' ? 'subiendo…' : 'en cola'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
