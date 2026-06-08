'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PILL_PRIMARY } from '@/components/ui/pill-button'
import { ROLE_LABELS } from '@/features/auth/roles'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { useUpdateProfile } from '../hooks/use-profile-mutation'
import type { UpdateProfileRequest } from '@/types/api/auth'

export function ProfileForm(): React.JSX.Element {
  const user = useAuthStore(state => state.user)
  const updateProfile = useUpdateProfile()

  const [name, setName] = useState(user?.name ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    const payload: UpdateProfileRequest = {}
    if (name.trim() && name.trim() !== (user?.name ?? '')) payload.name = name.trim()
    if (password) {
      if (password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.')
      payload.password = password
    }
    if (!payload.name && !payload.password) return setError('No hay cambios para guardar.')
    setError(null)
    updateProfile.mutate(payload, { onSuccess: () => setPassword('') })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <div className="space-y-2">
        <Label htmlFor="profile-email">Email</Label>
        <Input id="profile-email" value={user?.email ?? ''} disabled />
        <p className="text-xs text-stone">Tu rol: {user ? ROLE_LABELS[user.role] : '—'}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-name">Nombre y apellido</Label>
        <Input id="profile-name" value={name} onChange={e => setName(e.target.value)} disabled={updateProfile.isPending} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-password">Nueva contraseña</Label>
        <Input
          id="profile-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Dejala vacía para no cambiarla"
          disabled={updateProfile.isPending}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className={PILL_PRIMARY} disabled={updateProfile.isPending}>
        Guardar cambios
      </Button>
    </form>
  )
}
