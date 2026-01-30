// Tipos globales para NextAuth y la aplicación

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // NextAuth ya declara NEXTAUTH_URL y NEXTAUTH_SECRET como opcionales
      // Solo agregamos las variables específicas de nuestra app
      GOOGLE_CLIENT_ID?: string
      GOOGLE_CLIENT_SECRET?: string
      MONGODB_URI: string
    }
  }
}

// Tipos para el usuario de la aplicación
export interface AppUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'editor' | 'moderator'
  image?: string
  provider?: 'credentials' | 'google'
  providerId?: string
  createdAt?: Date
  updatedAt?: Date
}

// Tipos para la sesión extendida
export interface ExtendedSession {
  user: AppUser
  accessToken?: string
  expires: string
}

// Tipos para el contexto de autenticación
export interface AuthContextType {
  user: AppUser | null
  session: ExtendedSession | null
  isAuthenticated: boolean
  isLoading: boolean
  status: 'authenticated' | 'unauthenticated' | 'loading'
  login: (provider?: string) => Promise<void>
  logout: () => Promise<void>
  accessToken: string | null
  userRole: string | null
  userName: string | null
  userEmail: string | null
  userId: string | null
}

// Tipos para los roles y permisos
export type UserRole = 'admin' | 'user' | 'editor' | 'moderator'

export interface UserPermissions {
  canCreatePosts: boolean
  canEditPosts: boolean
  canDeletePosts: boolean
  canManageUsers: boolean
  canViewAnalytics: boolean
  canAccessAdmin: boolean
}

// Tipos para formularios de autenticación
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface UserApiResponse extends ApiResponse {
  data?: AppUser
}

export interface UsersListApiResponse extends ApiResponse {
  data?: AppUser[]
}

export {}