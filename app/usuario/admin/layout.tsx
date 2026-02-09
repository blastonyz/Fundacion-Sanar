'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Receipt, CheckSquare, LayoutDashboard, Home } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/acceso');
      return;
    }
    
    // Protección específica para administradores
    if (session.user.role !== 'admin') {
      router.push('/usuario/user-panel');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#102216] flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#102216] text-white pb-20 font-sans">
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img 
          alt="Nature background" 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjkjuDNs-2KtVnkaqzWmIadZD7VbW3z8-teaGV4JM51KW68hg8uljZqAz78rAIatTOdld2TYn67VGJt-NBboGkPK3kwuIqr1dDMT06G9EgTVAI1MyHmJe2nWsl3VuPOp0iH0851mCxu55akvtQnLsN_tf5o8BG1hxKUyDdVzQFBa9OlMRAUg3qJqLNuKOIR0e4X_sIiCb3u6NtaXNJp8tPZDsIp1MbfS5aSn0bpalXGNZkhxGs_GBAiaptSfKdtAVwI3OppXRECxE" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#102216]/80 via-[#102216]/50 to-[#102216]/90"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 px-6 pt-12 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white font-title">S.A.N.A.R.</h1>
          <p className="text-xs text-[#13ec5b] font-bold uppercase tracking-widest">Panel Administrativo</p>
        </div>
        <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden shadow-lg">
          <img 
            alt="Profile" 
            className="w-full h-full object-cover" 
            src={session?.user?.image || "https://via.placeholder.com/40x40?text=" + session?.user?.name?.[0]} 
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 px-6 pb-6 pt-3 bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border-t border-white/10 rounded-t-3xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button 
            className="flex flex-col items-center gap-1 text-white/40 hover:text-white/60 transition-colors"
            onClick={() => router.push('/')}
          >
            <Home size={20} />
            <span className="text-[10px] font-bold">Inicio</span>
          </button>
          <button 
            className={`flex flex-col items-center gap-1 ${pathname === '/usuario/admin' ? 'text-[#13ec5b]' : 'text-white/40 hover:text-white/60'} transition-colors`}
            onClick={() => router.push('/usuario/admin')}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-bold">Panel</span>
          </button>
          <button 
            className={`flex flex-col items-center gap-1 ${pathname === '/usuario/admin/gastos' ? 'text-[#13ec5b]' : 'text-white/40 hover:text-white/60'} transition-colors`}
            onClick={() => router.push('/usuario/admin/gastos')}
          >
            <Receipt size={20} />
            <span className="text-[10px] font-bold">Gastos</span>
          </button>
          <button 
            className={`flex flex-col items-center gap-1 ${pathname === '/usuario/admin/tareas' ? 'text-[#13ec5b]' : 'text-white/40 hover:text-white/60'} transition-colors`}
            onClick={() => router.push('/usuario/admin/tareas')}
          >
            <CheckSquare size={20} />
            <span className="text-[10px] font-bold">Tareas</span>
          </button>
        </div>
      </nav>
    </div>
  );
}