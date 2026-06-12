'use client'

import { motion, useReducedMotion } from 'motion/react'

interface AvatarSpec {
  initials: string
  online?: boolean
  invite?: boolean
}

const AVATARS: readonly AvatarSpec[] = [
  { initials: 'MB' },
  { initials: 'JP', online: true },
  { initials: 'RG' },
  { initials: '+', invite: true },
]

/**
 * Avatar stack for the team tile: members pop in one by one on scroll into
 * view, one shows a live presence dot, and the dashed invite chip nudges
 * periodically.
 */
export function TeamAvatars(): React.JSX.Element {
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex -space-x-2" aria-hidden>
      {AVATARS.map((avatar, i) => (
        <motion.span
          key={avatar.initials}
          className={`relative flex h-9 w-9 items-center justify-center rounded-full border font-sans text-xs font-medium ${
            avatar.invite
              ? 'border-dashed border-stone/50 bg-bone text-stone'
              : 'border-bone bg-field text-bone'
          }`}
          initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 380, damping: 24 }}
        >
          {avatar.invite ? (
            <motion.span
              animate={reduceMotion ? undefined : { scale: [1, 1, 1.25, 1] }}
              transition={{ duration: 3.6, times: [0, 0.82, 0.91, 1], repeat: Infinity, ease: 'easeInOut' }}
            >
              {avatar.initials}
            </motion.span>
          ) : (
            avatar.initials
          )}
          {avatar.online && (
            <span className="absolute -bottom-px -right-px flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-clay opacity-50 [animation-duration:2.4s]" />
              <span className="relative h-2 w-2 rounded-full border border-bone bg-clay" />
            </span>
          )}
        </motion.span>
      ))}
    </div>
  )
}
