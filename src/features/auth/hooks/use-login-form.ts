'use client'

import { useState, type FormEvent } from 'react'
import { useLogin } from '@/features/auth/hooks/use-login'
import { validateLogin, type LoginErrors } from '@/features/auth/validation'
import type { LoginRequest } from '@/types/api/auth'

interface UseLoginFormResult {
  values: LoginRequest
  errors: LoginErrors
  isSubmitting: boolean
  submitError: string | null
  setField: (field: keyof LoginRequest, value: string) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const INITIAL_VALUES: LoginRequest = { email: '', password: '' }

/**
 * Owns the login form state, validation and submission. The component stays
 * presentational and only wires these values/handlers to the inputs.
 */
export function useLoginForm(): UseLoginFormResult {
  const [values, setValues] = useState<LoginRequest>(INITIAL_VALUES)
  const [errors, setErrors] = useState<LoginErrors>({})
  const mutation = useLogin()

  const setField = (field: keyof LoginRequest, value: string): void => {
    setValues(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const validationErrors = validateLogin(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    mutation.mutate(values)
  }

  return {
    values,
    errors,
    isSubmitting: mutation.isPending,
    submitError: mutation.error?.message ?? null,
    setField,
    handleSubmit,
  }
}
