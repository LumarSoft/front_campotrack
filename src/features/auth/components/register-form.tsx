'use client'

import Link from 'next/link'
import { useRegisterForm } from '@/features/auth/hooks/use-register-form'
import { AuthField } from '@/features/auth/components/auth-field'
import { PasswordField } from '@/features/auth/components/password-field'
import { AuthFormError } from '@/features/auth/components/auth-form-error'
import { AuthSubmit } from '@/features/auth/components/auth-submit'

/**
 * Registration form. Presentation only — all state and submission lives in
 * `useRegisterForm`.
 */
export function RegisterForm(): React.JSX.Element {
  const { values, errors, isSubmitting, submitError, setField, handleSubmit } = useRegisterForm()

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {submitError ? <AuthFormError message={submitError} /> : null}

      <AuthField
        id="name"
        label="Nombre"
        value={values.name}
        error={errors.name}
        autoComplete="name"
        placeholder="Nombre y apellido"
        disabled={isSubmitting}
        onChange={value => setField('name', value)}
      />

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
        autoComplete="new-password"
        disabled={isSubmitting}
        onChange={value => setField('password', value)}
      />

      <AuthSubmit loading={isSubmitting} loadingLabel="Creando cuenta…">
        Crear cuenta
      </AuthSubmit>

      <p className="text-center text-sm text-stone">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="font-medium text-clay underline-offset-4 hover:underline">
          Ingresá
        </Link>
      </p>
    </form>
  )
}
