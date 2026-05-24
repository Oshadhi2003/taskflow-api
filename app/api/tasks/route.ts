import { NextResponse } from 'next/server';
import { tasksUseCase } from '../../../use-cases/tasksUseCase';
import { supabase } from '../../../lib/supabase/client';

async function getUserId(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);
  return user?.id || null;
}

export async function GET(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get projectId from the URL query string (e.g., /api/tasks?projectId=123)
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const result = await tasksUseCase.getProjectTasks(projectId);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  
  return NextResponse.json({ tasks: result.data }, { status: 200 });
}

export async function POST(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, projectId, assignedTo, dueDate } = await request.json();
    const result = await tasksUseCase.createTask(title, projectId, assignedTo, dueDate);
    
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ task: result.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}