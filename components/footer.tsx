import Link from "next/link"
import { Mail, Phone, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-background px-4 py-8">
      <div className="flex flex-col items-center gap-6 text-center max-w-6xl mx-auto">
        <h4 className="text-lg font-bold text-foreground">S.A.N.A.R.</h4>
        <div className="flex gap-6">
          <a 
            aria-label="Nuestro Correo" 
            className="text-foreground/70 hover:text-primary transition-colors" 
            href="mailto:contacto@sanar.org"
          >
            <Mail className="size-6" />
          </a>
          <a 
            aria-label="Nuestro Teléfono" 
            className="text-foreground/70 hover:text-primary transition-colors" 
            href="tel:+1234567890"
          >
            <Phone className="size-6" />
          </a>
          <a 
            aria-label="Nuestro Instagram" 
            className="text-foreground/70 hover:text-primary transition-colors" 
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="size-6" />
          </a>
        </div>
        <div className="flex gap-4 text-sm">
          <Link className="text-foreground/70 hover:text-primary transition-colors" href="/nosotros">
            Nosotros
          </Link>
          <span className="text-foreground/30">|</span>
          <Link className="text-foreground/70 hover:text-primary transition-colors" href="#">
            Privacidad
          </Link>
        </div>
        <p className="text-xs text-foreground/50">© 2024 Fundación S.A.N.A.R. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
