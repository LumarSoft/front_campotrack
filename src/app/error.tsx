'use client'

import { useEffect } from 'react'
import { logger } from '@/lib/logger'

/**
 * Route-segment Error Boundary. Catches render/runtime errors in the page and
 * shows a recoverable fallback instead of a blank screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}): React.JSX.Element {
  useEffect(() => {
    logger.error('Unhandled route error', {
      message: error.message,
      digest: error.digest,
    })
  }, [error])

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-bone px-6 text-center text-ink">
      <p className="kicker text-clay">Algo salió mal</p>
      <h1 className="font-display text-section max-w-[20ch] font-semibold">No pudimos cargar esta sección.</h1>
      <p className="measure font-sans text-lg leading-relaxed text-ink/70">
        Ya registramos el problema. Probá de nuevo en un momento.
      </p>
      <button
        type="button"
        onClick={reset}
        className="group inline-flex items-center gap-2.5 rounded-full bg-clay px-7 py-3.5 text-[0.95rem] font-medium tracking-tight text-bone transition-[transform,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#1f5e38] active:translate-y-px"
      >
        Reintentar
        <span aria-hidden className="transition-transform duration-200 ease-out group-hover:translate-x-1">
          →
        </span>
      </button>
    </main>
  )
}
