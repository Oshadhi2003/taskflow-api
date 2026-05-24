import { NextResponse } from 'next/server';
import { authUseCase } from '../../../../use-cases/authUseCase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Call the use-case (Business Logic)
    const result = await authUseCase.loginUser(email, password);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({ session: result.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}