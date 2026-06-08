'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { AuthField } from '@/features/auth/components/auth-field'

interface PasswordFieldProps {
  id: string
  label: string
  value: string
  error?: string
  autoComplete?: string
  disabled?: boolean
  onChange: (value: string) => void
}

/**
 * Password input with a show/hide toggle. Local visibility state only — no
 * business logic, so it lives in the component.
 */
export function PasswordField({
  id,
  label,
  value,
  error,
  autoComplete,
  disabled,
  onChange,
}: PasswordFieldProps): React.JSX.Element {
  const [visible, setVisible] = useState(false)

  return (
    <AuthField
      id={id}
      label={label}
      type={visible ? 'text' : 'password'}
      value={value}
      error={error}
      autoComplete={autoComplete}
      placeholder="••••••••"
      disabled={disabled}
      onChange={onChange}
      trailing={
        <button
          type="button"
          onClick={() => setVisible(prev => !prev)}
          disabled={disabled}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="flex h-8 w-8 items-center justify-center rounded-md text-stone transition-colors hover:text-ink disabled:opacity-50"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  )
}
