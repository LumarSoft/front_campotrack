import { apiRequest } from '@/lib/api-client'
import type { AuthResponse, AuthUser, LoginRequest, RegisterRequest, UpdateProfileRequest } from '@/types/api/auth'

/**
 * Auth domain service. The only place that knows the auth endpoint paths and
 * shapes; hooks and components depend on these typed functions, never on the
 * raw API client.
 */
export const authService = {
  login(payload: LoginRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: payload })
  },

  register(payload: RegisterRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: payload })
  },

  updateProfile(payload: UpdateProfileRequest, token: string): Promise<AuthUser> {
    return apiRequest<AuthUser>('/auth/profile', { method: 'PATCH', body: payload, token })
  },
}
