import { NextResponse } from 'next/server';
import { projectsUseCase } from '../../../use-cases/projectsUseCase';
import { supabase } from '../../../lib/supabase/client';

// Helper function to get the authenticated user from the request header
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

  const result = await projectsUseCase.getUserProjects(userId);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  
  return NextResponse.json({ projects: result.data }, { status: 200 });
}

export async function POST(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, description } = await request.json();
    const result = await projectsUseCase.createProject(name, description, userId);
    
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ project: result.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}