'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, Wallet, TrendingUp, Leaf, Settings, Receipt, LayoutDashboard, CheckSquare } from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface Expense {
  _id: string;
  concepto: string;
  monto: number;
  categoria: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data?: Task | Task[] | Expense | Expense[];
  error?: string;
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Estado para nueva tarea
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });

  // Estado para nuevo gasto
  const [newExpense, setNewExpense] = useState({
    concepto: '',
    monto: '',
    categoria: 'insumos-de-cultivo'
  });

  // Estados de UI
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeTab, setActiveTab] = useState('panel');
  const [currentMonth, setCurrentMonth] = useState('');

  // Establecer la fecha en el cliente para evitar errores de hidratación
  useEffect(() => {
    setCurrentMonth(new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' }));
  }, []);

  // Función para cargar tareas desde la API
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const result: ApiResponse = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setTasks(result.data as Task[]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Función para cargar gastos
  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      const result: ApiResponse = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setExpenses(result.data as Expense[]);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

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
    
    console.log('✅ Admin autenticado en Panel Administrativo:', session.user?.email);
    
    fetchTasks();
    fetchExpenses();
    setLoading(false);
  }, [session, status, router]);

  // Función para agregar nueva tarea
  const addTask = async () => {
    if (!newTask.title.trim()) {
      setError('El título es requerido');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const taskData = {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        priority: newTask.priority,
        createdBy: session?.user.id,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setTasks([...tasks, result.data as Task]);
        setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
        setShowTaskForm(false);
      } else {
        setError(result.error || 'Error al crear tarea');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Error de conexión al crear tarea');
    } finally {
      setSubmitting(false);
    }
  };

  // Función para agregar nuevo gasto
  const addExpense = async () => {
    if (!newExpense.concepto.trim() || !newExpense.monto) {
      setError('Concepto y monto son requeridos');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const expenseData = {
        concepto: newExpense.concepto.trim(),
        monto: parseFloat(newExpense.monto),
        categoria: newExpense.categoria,
        createdBy: session?.user.id
      };

      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setExpenses([...expenses, result.data as Expense]);
        setNewExpense({ concepto: '', monto: '', categoria: 'insumos-de-cultivo' });
      } else {
        setError(result.error || 'Error al registrar gasto');
      }
    } catch (error) {
      console.error('Error creating expense:', error);
      setError('Error de conexión al registrar gasto');
    } finally {
      setSubmitting(false);
    }
  };

  // Función para marcar/desmarcar tarea como completada
  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setTasks(tasks.map(t => t._id === taskId ? result.data as Task : t));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Calcular estadísticas
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.monto, 0);
  const naturalExpenses = expenses
    .filter(e => e.categoria && e.categoria.includes('natural'))
    .reduce((sum, expense) => sum + expense.monto, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#102216] flex items-center justify-center">
        <div className="text-white">Cargando panel administrativo...</div>
      </div>
    );
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
          <h1 className="text-2xl font-black text-white">S.A.N.A.R.</h1>
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
      <main className="relative z-10 px-4 space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Resumen de Gastos */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold">Resumen de Gastos</h2>
            <span className="text-xs text-white/50">
              {currentMonth}
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="flex-shrink-0 w-44 p-5 rounded-3xl bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border border-white/10">
              <Wallet className="text-[#13ec5b] mb-3" size={24} />
              <p className="text-xs text-white/60 mb-1">Gasto Total</p>
              <p className="text-xl font-black">${totalExpenses.toLocaleString()}</p>
            </div>
            <div className="flex-shrink-0 w-44 p-5 rounded-3xl bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border border-white/10">
              <Leaf className="text-[#13ec5b] mb-3" size={24} />
              <p className="text-xs text-white/60 mb-1">Insumos Nat.</p>
              <p className="text-xl font-black">${naturalExpenses.toLocaleString()}</p>
            </div>
            <div className="flex-shrink-0 w-44 p-5 rounded-3xl bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border border-[#13ec5b]/20 bg-[#13ec5b]/5">
              <TrendingUp className="text-[#13ec5b] mb-3" size={24} />
              <p className="text-xs text-white/60 mb-1">Diferencia</p>
              <p className="text-xl font-black text-[#13ec5b]">+{((naturalExpenses / totalExpenses) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </section>

        {/* Formulario Nuevo Gasto */}
        <section className="bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border border-white/10 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="text-[#13ec5b]" size={20} />
            <h2 className="font-bold">Nuevo Gasto</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5 ml-1">
                Concepto
              </label>
              <input 
                className="w-full h-11 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] placeholder:text-white/20" 
                placeholder="Ej: Aceites esenciales" 
                type="text"
                value={newExpense.concepto}
                onChange={(e) => setNewExpense({...newExpense, concepto: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5 ml-1">
                Monto ($)
              </label>
              <input 
                className="w-full h-11 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] placeholder:text-white/20" 
                placeholder="0.00" 
                type="number"
                value={newExpense.monto}
                onChange={(e) => setNewExpense({...newExpense, monto: e.target.value})}
              />
            </div>
            <button 
              className="w-full h-11 bg-[#13ec5b] text-[#102216] font-black rounded-2xl shadow-lg shadow-[#13ec5b]/20 active:scale-95 transition-all text-sm uppercase disabled:opacity-50" 
              onClick={addExpense}
              disabled={submitting}
            >
              {submitting ? 'Registrando...' : 'Registrar Gasto'}
            </button>
          </div>
        </section>

        {/* Tareas Pendientes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <CheckSquare className="text-[#13ec5b]" size={20} />
              <h2 className="text-lg font-bold">Tareas Pendientes</h2>
            </div>
            <button 
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
              onClick={() => setShowTaskForm(!showTaskForm)}
            >
              <Plus size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Agregar</span>
            </button>
          </div>

          {/* Formulario Nueva Tarea */}
          {showTaskForm && (
            <div className="bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border border-white/10 p-6 rounded-3xl space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5 ml-1">
                  Título
                </label>
                <input 
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b] placeholder:text-white/20" 
                  placeholder="Ej: Reponer stock de lavanda" 
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5 ml-1">
                  Prioridad
                </label>
                <select 
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:border-[#13ec5b] focus:ring-1 focus:ring-[#13ec5b]"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <button 
                className="w-full h-11 bg-[#13ec5b] text-[#102216] font-black rounded-2xl shadow-lg shadow-[#13ec5b]/20 active:scale-95 transition-all text-sm uppercase disabled:opacity-50" 
                onClick={addTask}
                disabled={submitting}
              >
                {submitting ? 'Creando...' : 'Crear Tarea'}
              </button>
            </div>
          )}

          {/* Lista de Tareas */}
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <div key={task._id} className={`bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border border-white/10 p-4 rounded-2xl flex items-center gap-4 ${task.completed ? 'opacity-60' : ''}`}>
                <label className="relative flex items-center cursor-pointer">
                  <input 
                    className="peer h-6 w-6 opacity-0 absolute cursor-pointer" 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => toggleTask(task._id)}
                  />
                  <div className={`h-6 w-6 rounded-lg border-2 ${task.completed ? 'bg-[#13ec5b] border-[#13ec5b]' : 'border-white/20'} flex items-center justify-center transition-all`}>
                    <Check className={`text-white text-sm ${task.completed ? 'scale-100' : 'scale-0'} transition-transform`} size={16} />
                  </div>
                </label>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${task.completed ? 'line-through decoration-white/30' : ''}`}>
                    {task.title}
                  </p>
                  <p className={`text-[10px] font-bold uppercase ${task.completed ? 'text-[#13ec5b]/60' : task.priority === 'high' ? 'text-white/40' : 'text-white/40'}`}>
                    {task.completed ? 'Completado' : `Prioridad ${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 px-6 pb-6 pt-3 bg-[rgba(25,51,34,0.45)] backdrop-blur-[20px] border-t border-white/10 rounded-t-3xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button 
            className={`flex flex-col items-center gap-1 ${activeTab === 'panel' ? 'text-[#13ec5b]' : 'text-white/40 hover:text-white/60'}`}
            onClick={() => setActiveTab('panel')}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px] font-bold">Panel</span>
          </button>
          <button 
            className={`flex flex-col items-center gap-1 ${activeTab === 'gastos' ? 'text-[#13ec5b]' : 'text-white/40 hover:text-white/60'}`}
            onClick={() => router.push('/usuario/gastos')}
          >
            <Receipt size={20} />
            <span className="text-[10px] font-bold">Gastos</span>
          </button>
          <button 
            className={`flex flex-col items-center gap-1 ${activeTab === 'tareas' ? 'text-[#13ec5b]' : 'text-white/40 hover:text-white/60'}`}
            onClick={() => router.push('/usuario/tareas')}
          >
            <CheckSquare size={20} />
            <span className="text-[10px] font-bold">Tareas</span>
          </button>
          <button 
            className={`flex flex-col items-center gap-1 ${activeTab === 'ajustes' ? 'text-[#13ec5b]' : 'text-white/40 hover:text-white/60'}`}
            onClick={() => setActiveTab('ajustes')}
          >
            <Settings size={20} />
            <span className="text-[10px] font-bold">Ajustes</span>
          </button>
        </div>
      </nav>
    </div>
  );
}