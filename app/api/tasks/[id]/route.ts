import { NextResponse } from 'next/server';
import { tasksUseCase } from '../../../../use-cases/tasksUseCase';
import { supabase } from '../../../../lib/supabase/client';

async function getUserId(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);
  return user?.id || null;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const updates = await request.json();
    
    // If only updating status, use our strict status validation use-case
    if (updates.status && Object.keys(updates).length === 1) {
        const result = await tasksUseCase.updateTaskStatus(params.id, updates.status);
        if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
        return NextResponse.json({ task: result.data }, { status: 200 });
    }

    const result = await tasksUseCase.updateTaskDetails(params.id, updates);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ task: result.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await tasksUseCase.deleteTask(params.id);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  
  return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
}