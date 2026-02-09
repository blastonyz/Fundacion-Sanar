"use client"

import React from "react"
import { useState, useEffect } from "react"
import { CheckSquare, Clock, Filter, Plus, AlertCircle, Check } from "lucide-react"
import TaskForm from "./components/TaskForm"
import ExpenseDropdown from "./components/ExpenseDropdown"
import TaskList from "./components/TaskList"

interface Task {
  _id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  completed: boolean
  createdBy: {
    name: string
    email: string
  }
  assignedTo?: {
    name: string
    email: string
  }
  dueDate?: string
  createdAt: string
  updatedAt: string
}

interface TaskStats {
  total: number
  completed: number
  pending: number
  highPriority: number
  overdue: number
}

export default function TareasPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, pending: 0, highPriority: 0, overdue: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const fetchTasks = async () => {
    try {
      console.log('📡 Cargando tareas desde API...');
      const response = await fetch('/api/tasks')
      const result = await response.json()
      console.log('📊 Respuesta de fetchTasks:', result);

      if (result.success) {
        console.log('✅ Tareas cargadas:', result.data.length, 'tareas');
        console.log('🔍 Primera tarea:', result.data[0]);
        setTasks(result.data)
        calculateStats(result.data)
      } else {
        console.error('❌ Error fetching tasks:', result.error)
      }
    } catch (error) {
      console.error('❌ Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (taskData: Task[]) => {
    const total = taskData.length
    const completed = taskData.filter(task => task.completed).length
    const pending = taskData.filter(task => !task.completed).length
    const highPriority = taskData.filter(task => task.priority === 'high' && !task.completed).length
    
    const now = new Date()
    const overdue = taskData.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    ).length

    setStats({ total, completed, pending, highPriority, overdue })
  }

  const filteredTasks = tasks.filter(task => {
    const priorityMatch = selectedPriority === "all" || task.priority === selectedPriority
    const statusMatch = selectedStatus === "all" || 
      (selectedStatus === "completed" && task.completed) ||
      (selectedStatus === "pending" && !task.completed)
    return priorityMatch && statusMatch
  })

  const toggleTask = async (taskId: string) => {
    try {
      console.log('🔄 Intentando actualizar tarea con ID:', taskId);
      const task = tasks.find(t => t._id === taskId)
      if (!task) {
        console.error('❌ Tarea no encontrada en el estado local:', taskId);
        return;
      }

      console.log('📝 Tarea encontrada:', task);

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !task.completed
        }),
      })

      const result = await response.json()
      console.log('📡 Respuesta de la API:', result);

      if (result.success) {
        const updatedTasks = tasks.map(t => 
          t._id === taskId ? { ...t, completed: !t.completed } : t
        )
        setTasks(updatedTasks)
        calculateStats(updatedTasks)
        console.log('✅ Tarea actualizada exitosamente');
      } else {
        console.error('❌ Error updating task:', result.error)
      }
    } catch (error) {
      console.error('❌ Error toggling task:', error)
    }
  }

  const editTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const deleteTask = (taskId: string) => {
    // Remove task from local state immediately for better UX
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task._id !== taskId)
      calculateStats(updatedTasks)
      return updatedTasks
    })
  }

  const handleTaskFormSuccess = () => {
    fetchTasks()
  }

  const handleTaskFormClose = () => {
    setIsTaskModalOpen(false)
    setEditingTask(null)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  if (loading) {
    return (
      <div className="px-4 space-y-6">
        <div className="text-white">Cargando tareas...</div>
      </div>
    )
  }

  return (
    <div className="px-4 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-black text-white">Tareas</h2>
          <p className="text-xs text-[#13ec5b] font-bold uppercase tracking-widest">Gestión de Tareas</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Expense Button */}
          <ExpenseDropdown />
          
          {/* Task Button */}
          <button
            onClick={() => {
              setEditingTask(null)
              setIsTaskModalOpen(true)
            }}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 transition-transform"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <section>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          <div className="glass-card flex-shrink-0 w-36 p-4 rounded-3xl border-primary/20 bg-primary/5">
            <CheckSquare className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-foreground/60 mb-1">Total</p>
            <p className="text-lg font-black text-primary">{stats.total}</p>
          </div>
          <div className="glass-card flex-shrink-0 w-36 p-4 rounded-3xl">
            <Check className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-xs text-foreground/60 mb-1">Completadas</p>
            <p className="text-lg font-black">{stats.completed}</p>
          </div>
          <div className="glass-card flex-shrink-0 w-36 p-4 rounded-3xl">
            <Clock className="w-5 h-5 text-orange-500 mb-2" />
            <p className="text-xs text-foreground/60 mb-1">Pendientes</p>
            <p className="text-lg font-black">{stats.pending}</p>
          </div>
          <div className="glass-card flex-shrink-0 w-36 p-4 rounded-3xl">
            <AlertCircle className="w-5 h-5 text-red-500 mb-2" />
            <p className="text-xs text-foreground/60 mb-1">Alta Prior.</p>
            <p className="text-lg font-black">{stats.highPriority}</p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="glass-card px-4 py-2 rounded-2xl text-sm font-semibold bg-foreground/5 border border-foreground/10"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completadas</option>
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="glass-card px-4 py-2 rounded-2xl text-sm font-semibold bg-foreground/5 border border-foreground/10"
          >
            <option value="all">Todas las prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>
      </section>

      {/* Tasks List */}
      <section className="space-y-3 mb-24">
        <div className="flex items-center justify-between px-2 mb-4">
          <h2 className="text-lg font-bold">Lista de Tareas ({filteredTasks.length})</h2>
        </div>
        
        <TaskList 
          tasks={filteredTasks}
          onToggleTask={toggleTask}
          onEditTask={editTask}
          onDeleteTask={deleteTask}
          onRefresh={fetchTasks}
        />
      </section>

      {/* Task Form Modal */}
      <TaskForm 
        isOpen={isTaskModalOpen}
        onClose={handleTaskFormClose}
        onSuccess={handleTaskFormSuccess}
        editingTask={editingTask}
      />
    </div>
  )
}