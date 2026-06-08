import type { ReactNode } from 'react'

/**
 * Auth route group layout. The React Query provider now lives in the root
 * layout (it wraps the whole app), so this layout only scopes the auth pages.
 */
export default function AuthLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return <>{children}</>
}
