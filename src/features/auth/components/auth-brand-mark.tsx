import { BrandMark } from '@/components/ui/brand-mark'

/**
 * Campo Track brand badge for the auth pages. Thin wrapper over the shared
 * `BrandMark` so auth stays consistent with the landing and the app shell.
 */
export function AuthBrandMark(): React.JSX.Element {
  return <BrandMark />
}
