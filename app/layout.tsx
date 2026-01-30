import React from "react"
import type { Metadata, Viewport } from 'next'
import { Lexend } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import AuthProvider from '@/components/auth/auth-provider'
import './globals.css'

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'S.A.N.A.R. - Sanación Alternativa Natural',
  description: 'Fundación dedicada a la sanación alternativa con métodos naturales y ancestrales para el bienestar integral.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#102216',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
