'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthField } from '@/features/auth/components/auth-field'
import { PasswordField } from '@/features/auth/components/password-field'
import { AuthFormError } from '@/features/auth/components/auth-form-error'
import { AuthSubmit } from '@/features/auth/components/auth-submit'
import { ROLE_LABELS } from '@/features/auth/roles'
import { useAcceptInvitation, useInvitationPreview } from '../hooks/use-accept-invitation'

export function AcceptInvitationForm({ token }: { token: string }): React.JSX.Element {
  const preview = useInvitationPreview(token)
  const accept = useAcceptInvitation(token)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (preview.isLoading) {
    return <p className="text-sm text-stone">Cargando invitación…</p>
  }

  if (preview.isError || !preview.data) {
    return (
      <div className="space-y-4">
        <AuthFormError message="Esta invitación no es válida o expiró." />
        <p className="text-center text-sm text-stone">
          <Link href="/login" className="font-medium text-clay underline-offset-4 hover:underline">
            Ir a Ingresar
          </Link>
        </p>
      </div>
    )
  }

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    if (name.trim().length < 2) return setError('Ingresá tu nombre.')
    if (password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.')
    setError(null)
    accept.mutate({ name: name.trim(), password })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="rounded-2xl border border-hairline-on-bone bg-bone p-4 text-sm">
        <p className="text-stone">
          Te invitaron a unirte{preview.data.accountName ? ` a ${preview.data.accountName}` : ''} como{' '}
          <span className="font-medium text-ink">{ROLE_LABELS[preview.data.role]}</span>.
        </p>
        <p className="mt-1 text-stone">
          Email: <span className="font-medium text-ink">{preview.data.email}</span>
        </p>
      </div>

      {(error || accept.isError) && <AuthFormError message={error ?? accept.error!.message} />}

      <AuthField
        id="name"
        label="Nombre y apellido"
        type="text"
        value={name}
        autoComplete="name"
        placeholder="Tu nombre"
        disabled={accept.isPending}
        onChange={setName}
      />

      <PasswordField
        id="password"
        label="Contraseña"
        value={password}
        autoComplete="new-password"
        disabled={accept.isPending}
        onChange={setPassword}
      />

      <AuthSubmit loading={accept.isPending} loadingLabel="Creando tu cuenta…">
        Aceptar invitación
      </AuthSubmit>
    </form>
  )
}
