/**
 * Native date helpers for the calendar. Events are stored as date-only (UTC
 * midnight); to avoid timezone drift we group and compare by the `YYYY-MM-DD`
 * key (the ISO date portion) rather than by local `Date` math.
 */

/** Local `YYYY-MM-DD` key for a Date. */
export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Date key from a server ISO string (its date portion). */
export function eventDateKey(iso: string): string {
  return iso.slice(0, 10)
}

/** 42-day grid (6 weeks, Monday-start) covering the given month. */
export function buildMonthGrid(month: Date): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const mondayOffset = (first.getDay() + 6) % 7
  const start = new Date(first)
  start.setDate(first.getDate() - mondayOffset)
  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    return day
  })
}

/** Inclusive query range (date keys) covering the visible month grid. */
export function gridRange(month: Date): { from: string; to: string } {
  const grid = buildMonthGrid(month)
  const dayAfterEnd = new Date(grid[grid.length - 1])
  dayAfterEnd.setDate(dayAfterEnd.getDate() + 1)
  return { from: toDateKey(grid[0]), to: toDateKey(dayAfterEnd) }
}

export function addMonths(month: Date, delta: number): Date {
  return new Date(month.getFullYear(), month.getMonth() + delta, 1)
}

export function isSameMonth(day: Date, month: Date): boolean {
  return day.getFullYear() === month.getFullYear() && day.getMonth() === month.getMonth()
}

export function formatMonthYear(month: Date): string {
  return month.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
}

/** Whole-day difference (`toKey - fromKey`) between two `YYYY-MM-DD` keys, timezone-safe. */
export function dayDiff(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split('-').map(Number)
  const [ty, tm, td] = toKey.split('-').map(Number)
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000)
}

/** Long, timezone-safe label from a date key like "Vie 1 de noviembre". */
export function formatDayLong(dateKey: string): string {
  const [year, month, day] = dateKey.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}
