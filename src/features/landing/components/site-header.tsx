import Link from 'next/link'
import { Wordmark } from '@/components/ui/wordmark'

const NAV_LINKS = [
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#funcionalidades', label: 'Funcionalidades' },
  { href: '#para-quien', label: 'Para quién' },
  { href: '/billing', label: 'Planes' },
] as const

/**
 * Floating pill header. A contained, rounded capsule that sits over the hero:
 * brand badge + wordmark on the left, centered nav, CTA on the right. Uses a
 * translucent ink background with blur so it reads over the aerial video.
 */
export function SiteHeader(): React.JSX.Element {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-shell px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="relative flex items-center justify-between gap-4 rounded-full border border-bone/15 bg-ink/55 py-2.5 pl-2.5 pr-2.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:py-3 sm:pl-3 sm:pr-3">
          {/* Brand */}
          <a
            href="#top"
            className="flex items-center gap-3 rounded-full pl-1 pr-2 transition-opacity duration-200 hover:opacity-90"
            aria-label="Campo Track — inicio"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clay text-bone shadow-inner sm:h-10 sm:w-10">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 21v-9" />
                <path d="M12 13C12 9 9 6.5 4.5 6.5 4.5 10.5 7.5 13 12 13Z" />
                <path d="M12 11.5C12 8 14.5 6 18.5 6 18.5 9.5 16 11.5 12 11.5Z" />
              </svg>
            </span>
            <span className="flex flex-col leading-none">
              <Wordmark className="text-[1.05rem] text-bone sm:text-[1.15rem]" />
              <span className="mt-0.5 hidden font-sans text-[0.6rem] uppercase tracking-[0.18em] text-bone/45 sm:block">
                Gestión agrícola
              </span>
            </span>
          </a>

          {/* Centered nav */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex" aria-label="Principal">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm text-bone/75 transition-colors duration-200 hover:text-bone"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2.5 font-sans text-sm font-medium text-bone/80 transition-colors duration-200 hover:text-bone sm:inline-flex"
            >
              Ingresar
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 font-sans text-sm font-medium text-bone transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#1f5e38]"
            >
              Sumate al piloto
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
