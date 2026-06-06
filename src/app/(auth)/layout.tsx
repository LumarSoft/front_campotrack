import type { ReactNode } from 'react'
import { Providers } from '@/app/providers'

/**
 * Auth route group layout. Scopes the React Query provider to the auth pages,
 * which is where server mutations (login/register) run.
 */
export default function AuthLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return <Providers>{children}</Providers>
}
