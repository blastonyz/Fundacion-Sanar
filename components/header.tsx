"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useSession } from "next-auth/react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  // Determinar la URL del panel según el rol del usuario
  const getPanelUrl = () => {
    if (session?.user?.role === 'admin') {
      return '/usuario/admin'
    }
    return '/usuario/user-panel'
  }

  return (
    <header className="flex items-center bg-background/80 backdrop-blur-md p-4 pb-2 justify-between sticky top-0 z-50">
      <Link href="/" className="text-foreground text-2xl font-bold leading-tight tracking-tight hover:text-primary transition-colors font-title">
        S.A.N.A.R.
      </Link>
      <button
        aria-label="Menu"
        className="text-foreground flex size-12 shrink-0 items-center justify-end md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="size-7" /> : <Menu className="size-7" />}
      </button>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-foreground/70 hover:text-primary transition-colors text-sm font-medium">
          Inicio
        </Link>
        <Link href="/nosotros" className="text-foreground/70 hover:text-primary transition-colors text-sm font-medium">
          Nosotros
        </Link>
        <Link href="/servicios" className="text-foreground/70 hover:text-primary transition-colors text-sm font-medium">
          Servicios
        </Link>
        {session ? (
          <Link href={getPanelUrl()} className="flex items-center justify-center rounded-full h-10 px-5 bg-primary text-primary-foreground text-sm font-bold">
            Panel
          </Link>
        ) : (
          <Link href="/acceso" className="flex items-center justify-center rounded-full h-10 px-5 bg-primary text-primary-foreground text-sm font-bold">
            Acceder
          </Link>
        )}
      </nav>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border md:hidden">
          <nav className="flex flex-col p-4 gap-2">
            <Link 
              href="/" 
              className="text-foreground/70 hover:text-primary transition-colors text-base font-medium py-3 px-4 rounded-lg hover:bg-secondary/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="/nosotros" 
              className="text-foreground/70 hover:text-primary transition-colors text-base font-medium py-3 px-4 rounded-lg hover:bg-secondary/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link 
              href="/servicios" 
              className="text-foreground/70 hover:text-primary transition-colors text-base font-medium py-3 px-4 rounded-lg hover:bg-secondary/30"
              onClick={() => setIsMenuOpen(false)}
            >
              Servicios
            </Link>
            {session ? (
              <Link 
                href={getPanelUrl()}
                className="flex items-center justify-center rounded-full h-12 px-5 bg-primary text-primary-foreground text-sm font-bold mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Panel
              </Link>
            ) : (
              <Link 
                href="/acceso" 
                className="flex items-center justify-center rounded-full h-12 px-5 bg-primary text-primary-foreground text-sm font-bold mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Acceder
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
