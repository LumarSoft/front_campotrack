import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Tracks which tours each user has completed, keyed by user id so different
 * accounts on the same browser each get their own walkthroughs. Runtime fields
 * (`activeTourId`, `stepIndex`) are not persisted.
 */
interface OnboardingState {
  completedTours: Record<number, string[]>
  activeTourId: string | null
  stepIndex: number
  start: (tourId: string) => void
  next: () => void
  prev: () => void
  /** Marks the current tour as completed for this user and closes it. */
  finish: (userId: number) => void
  hasCompleted: (userId: number, tourId: string) => boolean
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      completedTours: {},
      activeTourId: null,
      stepIndex: 0,
      start: tourId => set({ activeTourId: tourId, stepIndex: 0 }),
      next: () => set(state => ({ stepIndex: state.stepIndex + 1 })),
      prev: () => set(state => ({ stepIndex: Math.max(0, state.stepIndex - 1) })),
      finish: userId =>
        set(state => {
          const tourId = state.activeTourId
          if (!tourId) return { activeTourId: null, stepIndex: 0 }
          const prevDone = state.completedTours[userId] ?? []
          const nextDone = prevDone.includes(tourId) ? prevDone : [...prevDone, tourId]
          return {
            activeTourId: null,
            stepIndex: 0,
            completedTours: { ...state.completedTours, [userId]: nextDone },
          }
        }),
      hasCompleted: (userId, tourId) => (get().completedTours[userId] ?? []).includes(tourId),
    }),
    {
      name: 'campotrack-onboarding',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ completedTours: state.completedTours }),
      version: 2,
    },
  ),
)
