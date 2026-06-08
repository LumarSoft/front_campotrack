/**
 * Thin fetch wrapper for the Campo Track API. Components and services never
 * call `fetch` directly with raw URLs — they go through `apiRequest`, which
 * centralizes the base URL, JSON handling, and error normalization.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

/** Normalized API error, safe to surface to the user. */
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface NestErrorBody {
  message?: string | string[]
  error?: string
}

function resolveErrorMessage(body: NestErrorBody | null, status: number): string {
  // Map the auth-critical statuses to Spanish for the user-facing UI.
  if (status === 401) return 'Email o contraseña incorrectos.'
  if (status === 409) return 'Ya existe una cuenta con este email.'
  if (status >= 500) return 'El servidor no está disponible. Probá de nuevo en un momento.'
  if (body?.message) {
    return Array.isArray(body.message) ? body.message[0] : body.message
  }
  return 'No pudimos completar la solicitud. Revisá los datos e intentá de nuevo.'
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string
}

export async function apiRequest<TResponse>(path: string, options: ApiRequestOptions = {}): Promise<TResponse> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as NestErrorBody | null
    throw new ApiError(resolveErrorMessage(errorBody, response.status), response.status)
  }

  if (response.status === 204) return undefined as TResponse
  return (await response.json()) as TResponse
}
