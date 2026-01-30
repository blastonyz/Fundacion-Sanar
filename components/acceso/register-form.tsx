'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User } from 'lucide-react'

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validaciones del formulario
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setIsLoading(false)
      return
    }

    if (!formData.name.trim() || formData.name.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      setIsLoading(false)
      return
    }

    try {
      // Crear usuario en la base de datos
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Auto login después del registro exitoso
        const result = await signIn('credentials', {
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setError('Usuario creado exitosamente pero hubo un error al iniciar sesión')
          router.push('/acceso')
        } else {
          router.push('/')
          router.refresh()
        }
      } else {
        setError(data.error || 'Error al crear la cuenta')
      }
    } catch (error) {
      setError('Error de conexión al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-card w-full max-w-md rounded-3xl p-8 shadow-2xl">
      <h2 className="text-xl font-bold mb-6 text-center text-foreground">Crear Cuenta</h2>
      
      {/* Google Register Button */}
      <button 
        type="button"
        onClick={handleGoogleSignIn}
        className="flex w-full items-center justify-center gap-3 rounded-full bg-white h-12 px-4 text-background font-semibold text-sm transition-transform active:scale-95 shadow-lg"
        suppressHydrationWarning
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Registrarse con Google
      </button>
      
      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className="h-px flex-1 bg-foreground/20" />
        <span className="text-xs text-foreground/40 uppercase tracking-widest font-bold">O regístrate con</span>
        <div className="h-px flex-1 bg-foreground/20" />
      </div>
      
      {/* Registration Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label 
            className="block text-xs font-bold text-foreground/60 mb-1.5 ml-1 uppercase tracking-wider" 
            htmlFor="name"
          >
            Nombre Completo
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 size-5" />
            <input 
              className="w-full h-12 bg-foreground/10 border-foreground/10 rounded-2xl pl-12 pr-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-foreground/20"
              id="name"
              name="name"
              placeholder="Tu nombre"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              suppressHydrationWarning
            />
          </div>
        </div>
        
        <div>
          <label 
            className="block text-xs font-bold text-foreground/60 mb-1.5 ml-1 uppercase tracking-wider" 
            htmlFor="email"
          >
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 size-5" />
            <input 
              className="w-full h-12 bg-foreground/10 border-foreground/10 rounded-2xl pl-12 pr-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-foreground/20"
              id="email"
              name="email"
              placeholder="tu@email.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              suppressHydrationWarning
            />
          </div>
        </div>
        
        <div>
          <label 
            className="block text-xs font-bold text-foreground/60 mb-1.5 ml-1 uppercase tracking-wider" 
            htmlFor="password"
          >
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 size-5" />
            <input 
              className="w-full h-12 bg-foreground/10 border-foreground/10 rounded-2xl pl-12 pr-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-foreground/20"
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              suppressHydrationWarning
            />
          </div>
        </div>

        <div>
          <label 
            className="block text-xs font-bold text-foreground/60 mb-1.5 ml-1 uppercase tracking-wider" 
            htmlFor="confirmPassword"
          >
            Confirmar Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 size-5" />
            <input 
              className="w-full h-12 bg-foreground/10 border-foreground/10 rounded-2xl pl-12 pr-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-foreground/20"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              suppressHydrationWarning
            />
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4"
          suppressHydrationWarning
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>
      
      {/* Sign In Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-foreground/60">
          ¿Ya tienes una cuenta?{" "}
          <Link className="text-primary font-bold hover:underline decoration-primary/30 underline-offset-4" href="/acceso">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}