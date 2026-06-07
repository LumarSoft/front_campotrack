/**
 * Auth API contract. Mirrors the NestJS auth module:
 * `POST /auth/register` and `POST /auth/login` return a signed JWT plus the
 * authenticated user (never the password — see the API security rules).
 */

import type { UserRole } from './common'

export interface AuthUser {
  id: number
  email: string
  name: string | null
  role: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export interface UpdateProfileRequest {
  name?: string
  password?: string
}
