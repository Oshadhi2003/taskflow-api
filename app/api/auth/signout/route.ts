import { NextResponse } from 'next/server';
import { authUseCase } from '../../../../use-cases/authUseCase';

export async function POST() {
  const result = await authUseCase.logoutUser();

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ message: 'Signed out successfully' }, { status: 200 });
}