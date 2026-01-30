'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import type { ReactNode } from 'react'

// Tipos extendidos para la sesión
interface ExtendedUser {
  id: string
  email: string
  name: string
  role: string
  image?: string
}

interface ExtendedSession extends Omit<Session, 'user'> {
  user: ExtendedUser
  accessToken?: string
}

// Interfaz del contexto
interface AuthContextType {
  // Datos del usuario
  user: ExtendedUser | null
  session: ExtendedSession | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Estados de autenticación
  status: 'authenticated' | 'unauthenticated' | 'loading'
  
  // Métodos de autenticación
  login: (provider?: string) => Promise<void>
  logout: () => Promise<void>
  
  // Información adicional
  accessToken: string | null
  userRole: string | null
  userName: string | null
  userEmail: string | null
  userId: string | null
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Props del proveedor
interface AuthProviderProps {
  children: ReactNode
}

// Proveedor del contexto
export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  // Estados derivados
  const isAuthenticated = status === 'authenticated' && !!session
  const user = session?.user as ExtendedUser | null
  const extendedSession = session as ExtendedSession | null

  // Controlar el estado de loading
  useEffect(() => {
    setIsLoading(status === 'loading')
  }, [status])

  // Métodos de autenticación
  const login = async (provider: string = 'credentials') => {
    try {
      await signIn(provider, { 
        callbackUrl: '/',
        redirect: true 
      })
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
    }
  }

  const logout = async () => {
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  // Valores del contexto
  const contextValue: AuthContextType = {
    // Datos del usuario
    user,
    session: extendedSession,
    isAuthenticated,
    isLoading,
    status,
    
    // Métodos
    login,
    logout,
    
    // Información adicional de fácil acceso
    accessToken: extendedSession?.accessToken || null,
    userRole: user?.role || null,
    userName: user?.name || null,
    userEmail: user?.email || null,
    userId: user?.id || null,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  
  return context
}

// Hooks de conveniencia para acceso rápido
export function useUser() {
  const { user, isLoading, isAuthenticated } = useAuth()
  return { user, isLoading, isAuthenticated }
}

export function useAuthStatus() {
  const { status, isAuthenticated, isLoading } = useAuth()
  return { status, isAuthenticated, isLoading }
}

export function useAuthActions() {
  const { login, logout } = useAuth()
  return { login, logout }
}

// Componente de protección de rutas
interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  requireRole?: string
}

export function ProtectedRoute({ 
  children, 
  fallback = null, 
  requireRole 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <p>Debes iniciar sesión para acceder a esta página</p>
      </div>
    )
  }

  if (requireRole && user?.role !== requireRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No tienes permisos para acceder a esta página</p>
      </div>
    )
  }

  return <>{children}</>
}