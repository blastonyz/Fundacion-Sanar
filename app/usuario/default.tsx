import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function UsuarioDefault() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'admin';
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Dashboard de Usuario
      </h2>
      <p className="text-gray-600 mb-6">
        Bienvenido, {session?.user?.name}. Selecciona una opción para comenzar.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isAdmin ? (
          // Opciones para administradores
          <>
            <Link 
              href="/usuario/task-manager"
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  🔧
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                  Task Manager (Admin)
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Gestiona tareas y proyectos del sistema
              </p>
            </Link>
            
            <Link 
              href="/usuario/user-panel"
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  👤
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                  Mi Panel Personal
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Tu actividad y estadísticas personales
              </p>
            </Link>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  ⚙️
                </div>
                <h3 className="font-medium text-gray-900">Administración</h3>
              </div>
              <p className="text-sm text-gray-600">Configuración del sistema y usuarios</p>
            </div>
          </>
        ) : (
          // Opciones para usuarios comunes
          <>
            <Link 
              href="/usuario/user-panel"
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  👤
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                  Mi Panel
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Tu actividad y estadísticas personales
              </p>
            </Link>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  📊
                </div>
                <h3 className="font-medium text-gray-900">Mis Estadísticas</h3>
              </div>
              <p className="text-sm text-gray-600">Revisa tu progreso y actividad</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  🔔
                </div>
                <h3 className="font-medium text-gray-900">Notificaciones</h3>
              </div>
              <p className="text-sm text-gray-600">Revisa tus mensajes y alertas</p>
            </div>
          </>
        )}
      </div>
      
      {/* Información del usuario */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Tu Información</h3>
          <div className="flex items-center space-x-4">
            <img 
              src={session?.user?.image || '/default-avatar.png'} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-900">{session?.user?.name}</p>
              <p className="text-sm text-gray-500">{session?.user?.email}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                isAdmin ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {isAdmin ? 'Administrador' : 'Usuario'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}