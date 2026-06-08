import { AlertCircle } from 'lucide-react'

/**
 * Submit-level error banner shown above the form fields. Surfaces the API
 * error message returned by the auth mutation.
 */
export function AuthFormError({ message }: { message: string }): React.JSX.Element {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-md border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
