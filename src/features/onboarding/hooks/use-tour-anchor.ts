'use client'

import { useEffect, useState } from 'react'

export interface AnchorRect {
  top: number
  left: number
  width: number
  height: number
}

/**
 * Resolves a CSS selector to its DOMRect and keeps it updated on resize,
 * scroll, and DOM mutations. Returns `null` when the target is missing —
 * callers use this to fall back to a centered presentation.
 */
export function useTourAnchor(selector: string | null): AnchorRect | null {
  const [rect, setRect] = useState<AnchorRect | null>(null)

  useEffect(() => {
    if (!selector) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing on input change is intentional
      setRect(null)
      return
    }

    let raf = 0
    let element: Element | null = null

    const measure = (): void => {
      if (!element) return
      const r = element.getBoundingClientRect()
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    }

    const schedule = (): void => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }

    const tryResolve = (): boolean => {
      const found = document.querySelector(selector)
      if (!found) return false
      element = found
      measure()
      return true
    }

    const observer = new MutationObserver(() => {
      if (!element) tryResolve()
      else schedule()
    })

    if (!tryResolve()) {
      observer.observe(document.body, { childList: true, subtree: true })
    } else {
      observer.observe(document.body, { childList: true, subtree: true })
    }

    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, true)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule, true)
    }
  }, [selector])

  return rect
}
