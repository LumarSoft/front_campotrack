type LogLevel = 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

/**
 * Project logging utility. Components and hooks must log through this instead
 * of calling `console.*` directly, so the sink can be swapped (e.g. for a
 * remote error tracker) without touching call sites.
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  if (process.env.NODE_ENV === 'production' && level === 'info') return

  const payload = context ? [message, context] : [message]
  // The console is the current sink; replace with a real transport when wired.
  console[level](...payload)
}

export const logger = {
  info: (message: string, context?: LogContext): void => log('info', message, context),
  warn: (message: string, context?: LogContext): void => log('warn', message, context),
  error: (message: string, context?: LogContext): void => log('error', message, context),
}
