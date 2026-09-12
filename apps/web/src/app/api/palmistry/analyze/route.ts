import { NextResponse } from 'next/server';
import { evaluatePalmistry } from '@vedica/palmistry-engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = evaluatePalmistry(body || {});

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Palmistry API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Palmistry Analysis Error' },
      { status: 500 }
    );
  }
}
