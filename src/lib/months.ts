/** Month helpers (1-12) shared by the crop catalog, campaign form and analysis. */
export const MONTH_LABELS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const

export const MONTH_OPTIONS = MONTH_LABELS.map((label, index) => ({ value: String(index + 1), label }))

/** Human label for a crop's sowing window, or null when it isn't defined. */
export function formatSowingWindow(from: number | null, to: number | null): string | null {
  if (!from || !to) return null
  return from === to ? MONTH_LABELS[from - 1] : `${MONTH_LABELS[from - 1]} a ${MONTH_LABELS[to - 1]}`
}
