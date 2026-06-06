import { Wordmark } from '@/components/ui/wordmark'

const LINKS = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Sumate al piloto', href: '#registro' },
  { label: 'Contacto', href: '#' },
]

export function SiteFooter(): React.JSX.Element {
  const year = new Date().getFullYear()

  return (
    <footer className="on-ink bg-ink text-bone">
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <div className="flex flex-col gap-10 border-t border-hairline-on-ink py-12 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Wordmark className="text-2xl" />
            <p className="mt-3 font-sans text-sm text-bone/55">por LumarSoft</p>
          </div>

          <nav aria-label="Pie de página">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {LINKS.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-bone/70 transition-colors duration-200 hover:text-bone"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-hairline-on-ink py-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-sans text-xs text-bone/45">© {year} Campo Track · LumarSoft</span>
          <span className="font-sans text-xs uppercase tracking-[0.14em] text-bone/45">Hecho en Argentina</span>
        </div>
      </div>
    </footer>
  )
}
