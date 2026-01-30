import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import type { UserRole } from '@/types/auth'

// Middleware para proteger rutas API
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: any) => Promise<NextResponse>,
  options?: {
    requiredRole?: UserRole
    allowedRoles?: UserRole[]
  }
) {
  try {
    // Obtener la sesión del servidor
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      )
    }

    const user = session.user
    const userRole = user.role as UserRole

    // Verificar rol específico requerido
    if (options?.requiredRole && userRole !== options.requiredRole) {
      return NextResponse.json(
        { success: false, error: 'Sin permisos suficientes' },
        { status: 403 }
      )
    }

    // Verificar roles permitidos
    if (options?.allowedRoles && !options.allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Sin permisos suficientes' },
        { status: 403 }
      )
    }

    // Llamar al handler con el usuario autenticado
    return handler(request, user)
  } catch (error) {
    console.error('Error en middleware de autenticación:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Helper para verificar permisos
export function checkPermissions(userRole: UserRole) {
  const permissions = {
    canCreatePosts: ['admin', 'editor'].includes(userRole),
    canEditPosts: ['admin', 'editor'].includes(userRole),
    canDeletePosts: userRole === 'admin',
    canManageUsers: userRole === 'admin',
    canViewAnalytics: ['admin', 'editor'].includes(userRole),
    canAccessAdmin: ['admin', 'moderator'].includes(userRole),
  }

  return permissions
}

// Utilidades para validar roles
export const roleHierarchy: Record<UserRole, number> = {
  'user': 1,
  'moderator': 2,
  'editor': 3,
  'admin': 4,
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'admin'
}

export function canModerate(userRole: UserRole): boolean {
  return hasPermission(userRole, 'moderator')
}

export function canEdit(userRole: UserRole): boolean {
  return hasPermission(userRole, 'editor')
}