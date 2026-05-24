import { NextResponse } from 'next/server';
import { authUseCase } from '../../../../use-cases/authUseCase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    const result = await authUseCase.registerUser(email, password, name);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ user: result.data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}