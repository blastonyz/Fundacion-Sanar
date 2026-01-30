"use client"

import { LoginForm } from "@/components/acceso/login-form"
import { Flower2 } from "lucide-react"
import Link from "next/link"

export default function AccesoPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Nature background"
          className="w-full h-full object-cover scale-110"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjkjuDNs-2KtVnkaqzWmIadZD7VbW3z8-teaGV4JM51KW68hg8uljZqAz78rAIatTOdld2TYn67VGJt-NBboGkPK3kwuIqr1dDMT06G9EgTVAI1MyHmJe2nWsl3VuPOp0iH0851mCxu55akvtQnLsN_tf5o8BG1hxKUyDdVzQFBa9OlMRAUg3qJqLNuKOIR0e4X_sIiCb3u6NtaXNJp8tPZDsIp1MbfS5aSn0bpalXGNZkhxGs_GBAiaptSfKdtAVwI3OppXRECxE"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
      </div>
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 mb-4">
            <Flower2 className="text-primary size-8" />
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-foreground mb-1">S.A.N.A.R.</h1>
          <p className="text-foreground/70 text-sm">Bienvenido a tu espacio de sanación</p>
        </div>
        
        <LoginForm />
        
        {/* Footer Links */}
        <div className="mt-8 flex gap-6">
          <Link className="text-foreground/40 text-xs hover:text-foreground/60 transition-colors" href="#">
            Términos
          </Link>
          <Link className="text-foreground/40 text-xs hover:text-foreground/60 transition-colors" href="#">
            Privacidad
          </Link>
          <Link className="text-foreground/40 text-xs hover:text-foreground/60 transition-colors" href="#">
            Ayuda
          </Link>
        </div>
      </div>
    </div>
  )
}
