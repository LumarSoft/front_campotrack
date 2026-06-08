import type { LoginRequest, RegisterRequest } from '@/types/api/auth'

/**
 * Client-side form validation for the auth forms. Mirrors the API DTO
 * constraints so the user gets immediate feedback before the request goes out;
 * the API remains the source of truth.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8

export type LoginErrors = Partial<Record<keyof LoginRequest, string>>
export type RegisterErrors = Partial<Record<keyof RegisterRequest, string>>

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Ingresá tu email.'
  if (!EMAIL_PATTERN.test(email)) return 'El email no tiene un formato válido.'
  return undefined
}

function validatePassword(password: string): string | undefined {
  if (!password) return 'Ingresá tu contraseña.'
  if (password.length < MIN_PASSWORD_LENGTH) return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
  return undefined
}

export function validateLogin(values: LoginRequest): LoginErrors {
  const errors: LoginErrors = {}
  const emailError = validateEmail(values.email)
  const passwordError = validatePassword(values.password)
  if (emailError) errors.email = emailError
  if (passwordError) errors.password = passwordError
  return errors
}

export function validateRegister(values: RegisterRequest): RegisterErrors {
  const errors: RegisterErrors = {}
  if (!values.name.trim()) errors.name = 'Ingresá tu nombre.'
  const emailError = validateEmail(values.email)
  const passwordError = validatePassword(values.password)
  if (emailError) errors.email = emailError
  if (passwordError) errors.password = passwordError
  return errors
}
