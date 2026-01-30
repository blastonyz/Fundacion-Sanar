import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Expense from '@/models/Expense';
import Task from '@/models/Task';

export async function GET() {
  try {
    await connectDB();

    // Obtener estadísticas de la base de datos
    const usersCount = await User.countDocuments();
    const expensesCount = await Expense.countDocuments();
    const tasksCount = await Task.countDocuments();
    const completedTasksCount = await Task.countDocuments({ completed: true });
    const approvedExpensesCount = await Expense.countDocuments({ isFullyApproved: true });

    return NextResponse.json({
      success: true,
      message: 'Conexión a MongoDB exitosa',
      stats: {
        users: usersCount,
        expenses: {
          total: expensesCount,
          approved: approvedExpensesCount,
          pending: expensesCount - approvedExpensesCount,
        },
        tasks: {
          total: tasksCount,
          completed: completedTasksCount,
          pending: tasksCount - completedTasksCount,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en conexión a MongoDB:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al conectar con MongoDB',
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
