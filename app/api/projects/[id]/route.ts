import { NextResponse } from 'next/server';
import { projectsUseCase } from '../../../../use-cases/projectsUseCase';
import { supabase } from '../../../../lib/supabase/client';

async function getUserId(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);
  return user?.id || null;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await projectsUseCase.getProject(params.id, userId);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 404 });
  
  return NextResponse.json({ project: result.data }, { status: 200 });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const updates = await request.json();
    const result = await projectsUseCase.updateProject(params.id, updates, userId);
    
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ project: result.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await projectsUseCase.deleteProject(params.id, userId);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  
  return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
}