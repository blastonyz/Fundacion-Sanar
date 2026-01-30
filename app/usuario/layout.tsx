import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SignOutButton from '../../components/SignOutButton';

export default async function UsuarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Proteger toda la sección usuario
  if (!session || !session.user) {
    redirect('/acceso');
  }
  
  console.log('🔐 Usuario autenticado accediendo a sección protegida:', session.user.email);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Usuario
              </h1>
              
              <nav className="flex space-x-4">
                <Link 
                  href="/usuario"
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                
                {/* Mostrar Admin Panel solo para administradores */}
                {session.user.role === 'admin' ? (
                  <Link 
                    href="/usuario/admin"
                    className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link 
                    href="/usuario/user-panel"
                    className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Mi Panel
                  </Link>
                )}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500">
                  {session.user.role || 'user'}
                </p>
              </div>
              <img 
                src={session.user.image || '/default-avatar.png'} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full"
              />
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}