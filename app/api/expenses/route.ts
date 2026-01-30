import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectDB();
    const expenses = await Expense.find({})
      .populate('createdBy', 'name email')
      .populate('approvals.userId', 'name email')
      .sort({ date: -1 });
    
    return NextResponse.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener gastos',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: 'No autorizado - sesión requerida',
        },
        { status: 401 }
      );
    }

    // Buscar el usuario en la base de datos
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado',
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    // Crear el gasto con el createdBy automáticamente establecido
    const expenseData = {
      ...body,
      createdBy: user._id
    };
    
    const expense = await Expense.create(expenseData);
    await expense.populate('createdBy', 'name email');
    
    return NextResponse.json(
      {
        success: true,
        data: expense,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear gasto',
      },
      { status: 400 }
    );
  }
}
