interface WordmarkProps {
  className?: string
}

/**
 * Typographic logo placeholder in Fraunces until the definitive mark exists.
 * "Campo" regular, "Track" with a wheat accent dot — small editorial touch.
 */
export function Wordmark({ className }: WordmarkProps): React.JSX.Element {
  return (
    <span className={`font-display font-semibold tracking-tight ${className ?? ''}`}>
      Campo<span className="text-wheat">.</span>Track
    </span>
  )
}
