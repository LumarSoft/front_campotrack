'use client'

import { useState, type FormEvent } from 'react'
import { useRegister } from '@/features/auth/hooks/use-register'
import { validateRegister, type RegisterErrors } from '@/features/auth/validation'
import type { RegisterRequest } from '@/types/api/auth'

interface UseRegisterFormResult {
  values: RegisterRequest
  errors: RegisterErrors
  isSubmitting: boolean
  submitError: string | null
  setField: (field: keyof RegisterRequest, value: string) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const INITIAL_VALUES: RegisterRequest = { name: '', email: '', password: '' }

/**
 * Owns the registration form state, validation and submission. Keeps the form
 * component free of business logic.
 */
export function useRegisterForm(): UseRegisterFormResult {
  const [values, setValues] = useState<RegisterRequest>(INITIAL_VALUES)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const mutation = useRegister()

  const setField = (field: keyof RegisterRequest, value: string): void => {
    setValues(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const validationErrors = validateRegister(values)
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
