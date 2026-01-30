import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'No autorizado',
        },
        { status: 401 }
      );
    }

    await connectDB();
    const tasks = await Task.find({})
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener tareas',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'No autorizado',
        },
        { status: 401 }
      );
    }

    // Solo administradores pueden crear tareas
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'No tienes permisos para crear tareas',
        },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await request.json();
    
    // Asegurar que createdBy sea el usuario de la sesión
    const taskData = {
      ...body,
      createdBy: session.user.id
    };
    
    const task = await Task.create(taskData);
    await task.populate('createdBy', 'name email');
    if (task.assignedTo) {
      await task.populate('assignedTo', 'name email');
    }
    
    return NextResponse.json(
      {
        success: true,
        data: task,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear tarea',
      },
      { status: 400 }
    );
  }
}
