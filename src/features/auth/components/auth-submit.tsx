import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AuthSubmitProps {
  children: string
  loading: boolean
  loadingLabel: string
}

/**
 * Full-width submit button matching the landing CTA style, with a pending
 * spinner driven by the mutation state.
 */
export function AuthSubmit({ children, loading, loadingLabel }: AuthSubmitProps): React.JSX.Element {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="h-11 w-full rounded-full bg-clay text-bone hover:bg-[#1f5e38]"
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
