import { RegisterForm } from "@/components/acceso/register-form"

export default function RegistroPage() {
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
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Welcome text */}
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Únete a nuestra
                <span className="block text-primary">comunidad</span>
              </h1>
              <p className="text-lg text-foreground/70 max-w-lg mx-auto lg:mx-0">
                Descubre un camino hacia la sanación integral con métodos naturales y ancestrales.
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-3 text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3 text-foreground/60">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Acceso a terapias naturales</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/60">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Comunidad de bienestar</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/60">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Conocimiento ancestral</span>
              </div>
            </div>
          </div>
          
          {/* Right side - Register form */}
          <div className="flex justify-center lg:justify-end">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}