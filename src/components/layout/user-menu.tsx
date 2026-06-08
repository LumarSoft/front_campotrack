'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store/use-auth-store'
import { ROLE_LABELS } from '@/features/auth/roles'
import type { AuthUser } from '@/types/api/auth'

/** Avatar dropdown with the current user's identity and a logout action. */
export function UserMenu({ user }: { user: AuthUser }): React.JSX.Element {
  const router = useRouter()
  const clearSession = useAuthStore(state => state.clearSession)

  const handleLogout = (): void => {
    clearSession()
    router.replace('/login')
  }

  const initials = (user.name ?? user.email).slice(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-9 rounded-full p-0 hover:bg-transparent" aria-label="Abrir menú de usuario">
          <span className="flex size-9 items-center justify-center rounded-full bg-field text-sm font-semibold text-bone">
            {initials}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate font-medium">{user.name ?? 'Sin nombre'}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
          <span className="mt-1 text-xs font-normal text-primary">{ROLE_LABELS[user.role]}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <UserIcon className="size-4" />
          Mi perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
