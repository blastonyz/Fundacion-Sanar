"use client"

import React from "react"
import { Check, Edit, Trash2, CheckSquare } from "lucide-react"

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

interface TaskListProps {
  tasks: Task[]
  onToggleTask: (taskId: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onRefresh?: () => void
}

export default function TaskList({ tasks, onToggleTask, onEditTask, onDeleteTask, onRefresh }: TaskListProps) {
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

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.completed) return false
    return new Date(task.dueDate) < new Date()
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        // Notify parent component to update the task list
        onDeleteTask(taskId)
        if (onRefresh) {
          onRefresh()
        }
      } else {
        // Show user-friendly error message
        alert(`Error al eliminar la tarea: ${result.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión al eliminar la tarea. Inténtalo de nuevo.')
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="glass-card p-8 rounded-3xl text-center">
        <CheckSquare className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
        <p className="text-foreground/60">No hay tareas que coincidan con los filtros</p>
        <p className="text-xs text-foreground/40 mt-1">Ajusta los filtros o crea una nueva tarea</p>
      </div>
    )
  }

  return (
    <>
      {tasks.map((task) => (
        <div key={task._id} className={`glass-card p-4 rounded-2xl ${task.completed ? 'opacity-60' : ''}`}>
          <div className="flex items-start gap-3">
            <label className="relative flex items-center cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task._id)}
                className="peer h-5 w-5 opacity-0 absolute cursor-pointer"
              />
              <div className={`h-5 w-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                task.completed 
                  ? "bg-primary border-primary" 
                  : "border-foreground/20"
              }`}>
                <Check className={`w-3 h-3 text-primary-foreground transition-transform ${
                  task.completed ? "scale-100" : "scale-0"
                }`} />
              </div>
            </label>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} mt-2`} />
                <h3 className={`font-semibold text-sm ${task.completed ? 'line-through decoration-foreground/30' : ''}`}>
                  {task.title}
                </h3>
                {isOverdue(task) && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">Vencida</span>
                )}
              </div>
              
              {task.description && (
                <p className="text-xs text-foreground/60 mb-2">{task.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-foreground/50">
                <span>Prioridad: {getPriorityText(task.priority)}</span>
                {task.dueDate && (
                  <span>Vence: {new Date(task.dueDate).toLocaleDateString()}</span>
                )}
                <span>Por: {task.createdBy.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => onEditTask(task)}
                className="w-8 h-8 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 flex items-center justify-center transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}