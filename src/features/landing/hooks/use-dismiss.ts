import { useEffect, type RefObject } from 'react'

/**
 * Closes a disclosure when the user presses Escape or points outside the
 * given element. Listeners are only attached while `active` is true.
 */
export function useDismiss(ref: RefObject<HTMLElement | null>, active: boolean, onDismiss: () => void): void {
  useEffect(() => {
    if (!active) return

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') onDismiss()
    }

    function handlePointerDown(event: PointerEvent): void {
      if (ref.current && !ref.current.contains(event.target as Node)) onDismiss()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [ref, active, onDismiss])
}
