import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/app/providers'

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Campo Track — Tus campañas, costos y rendimientos en un solo lugar',
  description:
    'Campo Track reúne tus campañas, costos y rendimientos en un solo lugar. Funciona offline en el campo, aprende de tu historial y trae la cotización del Mercado de Rosario en tiempo real.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.JSX.Element {
  return (
    <html lang="es-AR" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
