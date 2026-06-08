'use client'

import Link from 'next/link'
import { useLoginForm } from '@/features/auth/hooks/use-login-form'
import { AuthField } from '@/features/auth/components/auth-field'
import { PasswordField } from '@/features/auth/components/password-field'
import { AuthFormError } from '@/features/auth/components/auth-form-error'
import { AuthSubmit } from '@/features/auth/components/auth-submit'

/**
 * Login form. Presentation only — all state and submission lives in
 * `useLoginForm`.
 */
export function LoginForm(): React.JSX.Element {
  const { values, errors, isSubmitting, submitError, setField, handleSubmit } = useLoginForm()

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {submitError ? <AuthFormError message={submitError} /> : null}

      <AuthField
        id="email"
        label="Email"
        type="email"
        value={values.email}
        error={errors.email}
        autoComplete="email"
        placeholder="vos@campo.com.ar"
        disabled={isSubmitting}
        onChange={value => setField('email', value)}
      />

      <PasswordField
        id="password"
        label="Contraseña"
        value={values.password}
        error={errors.password}
        autoComplete="current-password"
        disabled={isSubmitting}
        onChange={value => setField('password', value)}
      />

      <AuthSubmit loading={isSubmitting} loadingLabel="Ingresando…">
        Ingresar
      </AuthSubmit>

      <p className="text-center text-sm text-stone">
        ¿No tenés cuenta?{' '}
        <Link href="/register" className="font-medium text-clay underline-offset-4 hover:underline">
          Creá una
        </Link>
      </p>
    </form>
  )
}
