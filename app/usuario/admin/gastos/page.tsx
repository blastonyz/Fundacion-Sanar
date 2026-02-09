'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, TrendingUp, CalendarDays } from 'lucide-react';

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  facturaId?: string;
}

interface ApiResponse {
  success: boolean;
  data?: Expense | Expense[];
  error?: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const [currentMonth, setCurrentMonth] = useState('');

  // Establecer la fecha en el cliente para evitar errores de hidratación
  useEffect(() => {
    setCurrentMonth(new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' }));
  }, []);

  // Función para cargar gastos
  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      const result: ApiResponse = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setExpenses(result.data);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Calcular estadísticas
  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  // Categorías
  const categories = [
    { name: 'Todo', color: 'primary' },
    { name: 'Botánicos', color: 'emerald' },
    { name: 'Talleres', color: 'blue' },
    { name: 'Mantenimiento', color: 'amber' }
  ];

  // Iconos por categoría
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'botanicos': '🌿',
      'insumos-de-cultivo': '🌱',
      'talleres': '🧘',
      'mantenimiento': '🔧',
      'aceites': '🌿',
      'semillas': '🌱'
    };
    return icons[category] || '💰';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'botanicos': 'emerald',
      'insumos-de-cultivo': 'emerald',
      'talleres': 'blue',
      'mantenimiento': 'amber',
      'aceites': 'emerald',
      'semillas': 'emerald'
    };
    return colors[category] || 'gray';
  };

  if (loading) {
    return (
      <div className="px-4 space-y-6">
        <div className="text-white">Cargando gastos...</div>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-black text-white">Historial de Gastos</h2>
          <p className="text-xs text-[#13ec5b] font-bold uppercase tracking-widest">Fundación S.A.N.A.R.</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Summary */}
      <section>
        <div className="bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#13ec5b]/10 rounded-full blur-3xl group-hover:bg-[#13ec5b]/20 transition-all duration-700"></div>
          <p className="text-white/60 text-sm font-medium mb-1">Total Acumulado ({currentMonth})</p>
          <div className="flex items-baseline gap-2">
            <p className="text-white tracking-tight text-3xl font-bold">${totalExpenses.toLocaleString()}</p>
            <span className="text-[#13ec5b] text-sm font-semibold flex items-center">
              <TrendingUp size={16} />
              5.2%
            </span>
          </div>
          <div className="mt-4 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#13ec5b] h-full w-[65%] rounded-full shadow-[0_0_8px_rgba(19,236,91,0.5)]"></div>
          </div>
          <p className="text-[10px] text-white/40 mt-2">65% del presupuesto mensual utilizado</p>
        </div>
      </section>

      {/* Filters */}
      <section>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
            {categories.map((category) => (
              <button 
                key={category.name}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 ${
                  selectedCategory === category.name 
                    ? 'bg-[#13ec5b] text-[#102216]' 
                    : 'bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border border-white/10 text-white'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className="text-xs font-bold">{category.name}</span>
              </button>
            ))}
          </div>
      </section>

      {/* Date Display */}
      <section>
        <div className="bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border border-white/10 flex justify-between items-center px-4 py-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-[#13ec5b]" size={18} />
            <p className="text-white/70 text-xs font-medium">Periodo de visualización</p>
          </div>
          <p className="text-white text-xs font-bold bg-white/5 px-3 py-1 rounded-full border border-white/10">{currentMonth}</p>
        </div>
      </section>

      {/* List of Expenses */}
      <section className="space-y-3 mb-24">
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="text-white text-lg font-bold leading-tight tracking-tight">Registros Detallados</h3>
          <span className="text-[#13ec5b] text-[10px] font-bold bg-[#13ec5b]/10 px-2 py-0.5 rounded border border-[#13ec5b]/20">
            {expenses.length} TOTAL
          </span>
        </div>

        {expenses.length === 0 ? (
          <div className="bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border border-white/10 p-8 rounded-3xl text-center">
            <p className="text-white/60">No hay gastos registrados</p>
          </div>
        ) : (
          expenses.map((expense) => {
              const categoryColor = getCategoryColor(expense.category || '');
              const colorClasses = {
                emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
                blue: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
                amber: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
                gray: 'bg-gray-500/20 text-gray-400 border-gray-500/20'
              };

              return (
                <div key={expense._id} className="bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border border-white/10 p-4 rounded-2xl flex items-center justify-between group hover:border-[#13ec5b]/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${colorClasses[categoryColor as keyof typeof colorClasses] || colorClasses.gray}`}>
                      <span className="text-2xl">{getCategoryIcon(expense.category || '')}</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-white text-sm font-semibold">{expense.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <span>{new Date(expense.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short' })}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span className={`${categoryColor === 'emerald' ? 'text-emerald-400/60' : categoryColor === 'blue' ? 'text-blue-400/60' : 'text-amber-400/60'}`}>
                          {expense.category ? expense.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Sin categoría'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span>Por: {expense.createdBy?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-base font-bold">${(expense.amount || 0).toLocaleString()}</p>
                    <p className="text-[10px] text-white/40">{expense.facturaId || `#${expense._id?.slice(-3) || '000'}`}</p>
                  </div>
                </div>
              );
            })
          )}
      </section>

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#13ec5b] rounded-full shadow-[0_0_20px_rgba(19,236,91,0.3)] flex items-center justify-center text-[#102216] active:scale-90 transition-transform z-50"
        onClick={() => window.location.href = '/usuario/admin'}
      >
        <Plus size={24} className="font-bold" />
      </button>
    </div>
  );
}