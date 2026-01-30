import Link from "next/link"
import { AlertCircle } from "lucide-react"

interface ErrorPageProps {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const { error } = await searchParams

  const getErrorMessage = (error: string | undefined) => {
    switch (error) {
      case 'Configuration':
        return 'Hay un problema con la configuración del servidor.'
      case 'AccessDenied':
        return 'Acceso denegado. No tienes permisos para acceder.'
      case 'Verification':
        return 'El token de verificación ha expirado o ya se ha usado.'
      case 'Default':
        return 'Ha ocurrido un error durante la autenticación.'
      case 'OAuthSignin':
        return 'Error al iniciar sesión con OAuth.'
      case 'OAuthCallback':
        return 'Error en el callback de OAuth.'
      case 'OAuthCreateAccount':
        return 'No se pudo crear la cuenta OAuth.'
      case 'EmailCreateAccount':
        return 'No se pudo crear la cuenta con email.'
      case 'Callback':
        return 'Error en el callback de autenticación.'
      case 'OAuthAccountNotLinked':
        return 'Este email ya está registrado con otro método de inicio de sesión.'
      case 'EmailSignin':
        return 'Error al enviar el email de verificación.'
      case 'CredentialsSignin':
        return 'Credenciales inválidas. Verifica tu email y contraseña.'
      case 'SessionRequired':
        return 'Debes iniciar sesión para acceder a esta página.'
      default:
        return 'Ha ocurrido un error inesperado. Inténtalo de nuevo.'
    }
  }

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
        <div className="glass-card w-full max-w-md rounded-3xl p-8 shadow-2xl text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Error de Autenticación
            </h1>
            
            <p className="text-foreground/70 text-sm leading-relaxed">
              {getErrorMessage(error)}
            </p>
          </div>

          <div className="space-y-3">
            <Link 
              href="/acceso"
              className="block w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center"
            >
              Intentar de nuevo
            </Link>
            
            <Link 
              href="/"
              className="block w-full h-12 bg-foreground/10 hover:bg-foreground/20 text-foreground font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center"
            >
              Volver al inicio
            </Link>
          </div>

          {error && (
            <div className="mt-6 p-3 bg-foreground/5 rounded-xl">
              <p className="text-xs text-foreground/50">
                Código de error: <code>{error}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}