import { NextRequest, NextResponse } from 'next/server';
import { simplifyAnswer } from '@/lib/nvidia';
import { ExplainRequest } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body: ExplainRequest = await request.json();
    const { answer } = body;

    if (!answer || answer.trim().length === 0) {
      return NextResponse.json({ error: 'Answer text is required' }, { status: 400 });
    }

    const explanation = await simplifyAnswer(answer);

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Explain error:', error);
    return NextResponse.json({ error: 'Failed to generate explanation.' }, { status: 500 });
  }
}
