"use client"

import React, { useState } from "react"
import { DollarSign } from "lucide-react"

export default function ExpenseDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [formState, setFormState] = useState({
    description: "",
    amount: "",
    category: "alimentacion",
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
      description: "",
      amount: "",
      category: "alimentacion",
      isSubmitting: false
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.description.trim() || !formState.amount) return

    updateField('isSubmitting', true)
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formState.description.trim(),
          amount: parseFloat(formState.amount),
          category: formState.category,
        }),
      })

      const result = await response.json()

      if (result.success) {
        resetForm()
        setIsOpen(false)
        alert('Gasto registrado exitosamente')
      } else {
        console.error('Error with expense:', result.error)
        alert('Error al registrar el gasto: ' + result.error)
      }
    } catch (error) {
      console.error('Error submitting expense:', error)
      alert('Error de conexión')
    } finally {
      updateField('isSubmitting', false)
    }
  }

  const handleClose = () => {
    resetForm()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Expense Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/20 hover:scale-110 transition-transform"
      >
        <DollarSign className="w-5 h-5" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="fixed top-20 right-6 z-50 w-80">
          <div className="glass-card p-4 rounded-2xl border border-foreground/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">Registrar Gasto</h3>
              <button
                onClick={handleClose}
                className="w-6 h-6 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors text-xs"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={formState.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Concepto del gasto"
                  className="w-full h-9 bg-foreground/5 border border-foreground/10 rounded-xl px-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-foreground/30"
                  required
                />
              </div>
              
              <div>
                <input
                  type="number"
                  step="0.01"
                  value={formState.amount}
                  onChange={(e) => updateField('amount', e.target.value)}
                  placeholder="Monto"
                  className="w-full h-9 bg-foreground/5 border border-foreground/10 rounded-xl px-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-foreground/30"
                  required
                />
              </div>
              
              <div>
                <select
                  value={formState.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full h-9 bg-foreground/5 border border-foreground/10 rounded-xl px-3 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="alimentacion">Alimentación</option>
                  <option value="transporte">Transporte</option>
                  <option value="salud">Salud</option>
                  <option value="entretenimiento">Entretenimiento</option>
                  <option value="servicios">Servicios</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 h-8 bg-foreground/10 text-foreground font-semibold rounded-xl hover:bg-foreground/20 transition-colors text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formState.isSubmitting || !formState.description.trim() || !formState.amount}
                  className={`flex-1 h-8 font-semibold rounded-xl transition-all text-xs ${
                    formState.isSubmitting || !formState.description.trim() || !formState.amount
                      ? 'bg-foreground/20 text-foreground/40 cursor-not-allowed'
                      : 'bg-green-500 text-white shadow-lg shadow-green-500/20 hover:scale-105'
                  }`}
                >
                  {formState.isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}