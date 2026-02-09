"use client"

import React, { useState } from "react"
import { Plus } from "lucide-react"

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

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingTask?: Task | null
}

export default function TaskForm({ isOpen, onClose, onSuccess, editingTask }: TaskFormProps) {
  const [formState, setFormState] = useState({
    title: editingTask?.title || "",
    description: editingTask?.description || "",
    priority: (editingTask?.priority || "medium") as "low" | "medium" | "high",
    dueDate: editingTask?.dueDate ? editingTask.dueDate.split('T')[0] : "",
    isSubmitting: false
  })

  const updateField = (name: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const resetForm = () => {
    setFormState({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      isSubmitting: false
    })
  }

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.title.trim()) return

    updateField('isSubmitting', true)
    try {
      const method = editingTask ? 'PATCH' : 'POST'
      const url = editingTask ? `/api/tasks/${editingTask._id}` : '/api/tasks'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formState.title.trim(),
          description: formState.description.trim() || undefined,
          priority: formState.priority,
          dueDate: formState.dueDate || undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        resetForm()
        onClose()
        onSuccess()
        alert(editingTask ? 'Tarea actualizada exitosamente' : 'Tarea creada exitosamente')
      } else {
        console.error('Error with task:', result.error)
        alert('Error al procesar la tarea: ' + result.error)
      }
    } catch (error) {
      console.error('Error submitting task:', error)
      alert('Error de conexión')
    } finally {
      updateField('isSubmitting', false)
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta'
      case 'medium': return 'Media'
      case 'low': return 'Baja'
      default: return 'Media'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-orange-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  React.useEffect(() => {
    if (editingTask) {
      setFormState({
        title: editingTask.title,
        description: editingTask.description || "",
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : "",
        isSubmitting: false
      })
    } else {
      resetForm()
    }
  }, [editingTask, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative glass-card p-6 rounded-3xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmitTask} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1.5 ml-1">
              Título
            </label>
            <input
              type="text"
              value={formState.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Ej: Preparar infusiones"
              className="w-full h-11 bg-foreground/5 border border-foreground/10 rounded-2xl px-4 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-foreground/20"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1.5 ml-1">
              Descripción (Opcional)
            </label>
            <textarea
              value={formState.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Detalles adicionales"
              className="w-full h-20 bg-foreground/5 border border-foreground/10 rounded-2xl px-4 py-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-foreground/20 resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-1.5 ml-1">
              Fecha de Vencimiento (Opcional)
            </label>
            <input
              type="date"
              value={formState.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
              className="w-full h-11 bg-foreground/5 border border-foreground/10 rounded-2xl px-4 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-widest mb-3 ml-1">
              Prioridad
            </label>
            <div className="space-y-2">
              {['high', 'medium', 'low'].map((priority) => (
                <div 
                  key={priority}
                  onClick={() => updateField('priority', priority)}
                  className={`glass-card p-3 rounded-2xl cursor-pointer transition-all border-2 ${
                    formState.priority === priority 
                      ? `border-${priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'blue'}-500 bg-${priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'blue'}-500/10 shadow-lg` 
                      : 'border-transparent hover:border-foreground/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm capitalize">{getPriorityText(priority)}</h4>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formState.priority === priority
                        ? `border-${priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'blue'}-500 bg-${priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'blue'}-500`
                        : 'border-foreground/20'
                    }`}>
                      {formState.priority === priority && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 h-11 bg-foreground/10 text-foreground font-bold rounded-2xl hover:bg-foreground/20 transition-colors text-sm uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formState.isSubmitting || !formState.title.trim()}
              className={`flex-1 h-11 font-bold rounded-2xl transition-all text-sm uppercase ${
                formState.isSubmitting || !formState.title.trim()
                  ? 'bg-foreground/20 text-foreground/40 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 active:scale-95'
              }`}
            >
              {formState.isSubmitting ? 'Procesando...' : (editingTask ? 'Actualizar' : 'Crear Tarea')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}