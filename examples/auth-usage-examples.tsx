import { useAuth, useUser, useAuthStatus, ProtectedRoute } from '@/contexts/auth-context'

// Ejemplo 1: Componente básico que usa la información del usuario
export function UserProfile() {
  const { user, userName, userEmail, userRole } = useAuth()
  
  if (!user) {
    return <div>No hay usuario autenticado</div>
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold">Perfil de Usuario</h3>
      <p><strong>Nombre:</strong> {userName}</p>
      <p><strong>Email:</strong> {userEmail}</p>
      <p><strong>Rol:</strong> {userRole}</p>
      <p><strong>ID:</strong> {user.id}</p>
    </div>
  )
}

// Ejemplo 2: Componente que solo necesita el usuario
export function WelcomeMessage() {
  const { user, isLoading } = useUser()
  
  if (isLoading) return <div>Cargando...</div>
  
  return (
    <div>
      {user ? (
        <h2>¡Bienvenido, {user.name}!</h2>
      ) : (
        <h2>¡Bienvenido, invitado!</h2>
      )}
    </div>
  )
}

// Ejemplo 3: Componente que necesita status de autenticación
export function AuthStatus() {
  const { status, isAuthenticated } = useAuthStatus()
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${
        status === 'authenticated' ? 'bg-green-500' : 
        status === 'loading' ? 'bg-yellow-500' : 'bg-red-500'
      }`} />
      <span>
        {isAuthenticated ? 'Autenticado' : 'No autenticado'} ({status})
      </span>
    </div>
  )
}

// Ejemplo 4: Página protegida básica
export function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <UserProfile />
      </div>
    </ProtectedRoute>
  )
}

// Ejemplo 5: Página que requiere rol específico
export function AdminPage() {
  return (
    <ProtectedRoute 
      requireRole="admin"
      fallback={<div>Solo administradores pueden ver esta página</div>}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
        <p>Contenido solo para administradores</p>
      </div>
    </ProtectedRoute>
  )
}

// Ejemplo 6: Hook personalizado para verificar permisos
export function usePermissions() {
  const { userRole, isAuthenticated } = useAuth()
  
  return {
    canCreatePosts: isAuthenticated && (userRole === 'admin' || userRole === 'editor'),
    canDeleteUsers: userRole === 'admin',
    canEditProfile: isAuthenticated,
    isAdmin: userRole === 'admin',
    isEditor: userRole === 'editor',
  }
}

// Ejemplo 7: Componente con permisos condicionales
export function ActionButtons() {
  const { canCreatePosts, canDeleteUsers } = usePermissions()
  
  return (
    <div className="flex gap-2">
      {canCreatePosts && (
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Crear Post
        </button>
      )}
      {canDeleteUsers && (
        <button className="px-4 py-2 bg-red-500 text-white rounded">
          Gestionar Usuarios
        </button>
      )}
    </div>
  )
}