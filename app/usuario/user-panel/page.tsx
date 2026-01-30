'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserStats {
  tasksCompleted: number;
  lastLogin: Date;
}

export default function UserPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({
    tasksCompleted: 0,
    lastLogin: new Date()
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/acceso');
      return;
    }
    
    console.log('✅ Usuario autenticado en User Panel:', session.user?.email);
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Cargando panel de usuario...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenido, {session?.user?.name}
        </h1>
        <p className="text-gray-600">
          Panel de usuario - Fundación S.A.N.A.R.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta de Tareas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">✓</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tareas Completadas</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.tasksCompleted}</p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Última Conexión */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">●</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Última Conexión</p>
              <p className="text-sm font-medium">{stats.lastLogin.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Rol */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">👤</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rol</p>
              <p className="text-sm font-medium capitalize">{session?.user?.role || 'user'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => router.push('/usuario/tareas')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 text-lg">📝</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Ver Mis Tareas</p>
                <p className="text-sm text-gray-500">Gestiona tus tareas asignadas</p>
              </div>
            </button>
            
            <button 
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              disabled
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-gray-400 text-lg">📊</span>
              </div>
              <div>
                <p className="font-medium text-gray-400">Reportes</p>
                <p className="text-sm text-gray-400">Próximamente disponible</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}