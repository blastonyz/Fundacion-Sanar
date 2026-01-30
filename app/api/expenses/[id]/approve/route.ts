import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, approved } = body;
    
    const expense = await Expense.findById(params.id);
    
    if (!expense) {
      return NextResponse.json(
        { success: false, error: 'Gasto no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar si el usuario ya aprobó
    const existingApproval = expense.approvals.find(
      (a) => a.userId.toString() === userId
    );
    
    if (existingApproval) {
      existingApproval.approved = approved;
      existingApproval.date = new Date();
    } else {
      expense.approvals.push({
        userId,
        approved,
        date: new Date(),
      });
    }
    
    // Actualizar estado de aprobación completa
    expense.checkFullyApproved();
    await expense.save();
    
    await expense.populate('createdBy', 'name email');
    await expense.populate('approvals.userId', 'name email');
    
    return NextResponse.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al aprobar gasto',
      },
      { status: 500 }
    );
  }
}
