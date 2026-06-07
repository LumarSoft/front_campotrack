'use client'

import { Wifi, WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/use-online-status'
import { cn } from '@/lib/utils'

/** Online / offline indicator shown in the topbar. */
export function ConnectionStatus(): React.JSX.Element {
  const isOnline = useOnlineStatus()

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        isOnline
          ? 'border-clay/25 bg-[color-mix(in_srgb,var(--clay)_10%,var(--bone))] text-field'
          : 'border-wheat/40 bg-[color-mix(in_srgb,var(--wheat)_14%,var(--bone))] text-[#8a5a1a]',
      )}
      title={isOnline ? 'Conectado' : 'Sin conexión — los cambios se sincronizarán al reconectar'}
    >
      {isOnline ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
      <span className="hidden sm:inline">{isOnline ? 'En línea' : 'Sin conexión'}</span>
    </span>
  )
}
