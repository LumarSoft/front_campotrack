import type { ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AuthFieldProps {
  id: string
  label: string
  type?: string
  value: string
  error?: string
  autoComplete?: string
  placeholder?: string
  disabled?: boolean
  onChange: (value: string) => void
  /** Optional trailing control rendered inside the field (e.g. show/hide). */
  trailing?: ReactNode
}

/**
 * Labelled input with inline validation message. Generic enough for both auth
 * forms; pairs the shadcn Input + Label and wires accessibility attributes.
 */
export function AuthField({
  id,
  label,
  type = 'text',
  value,
  error,
  autoComplete,
  placeholder,
  disabled,
  onChange,
  trailing,
}: AuthFieldProps): React.JSX.Element {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          onChange={event => onChange(event.target.value)}
          className={trailing ? 'pr-11' : undefined}
        />
        {trailing ? <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div> : null}
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
