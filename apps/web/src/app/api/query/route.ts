import { NextResponse } from 'next/server';
import { executeQueryEngine } from '@vedica/query-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, calculationData, transitDate, fullName } = body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json(
        { success: false, error: 'Question string is required' },
        { status: 400 }
      );
    }

    if (!calculationData) {
      return NextResponse.json(
        { success: false, error: 'Calculation data is required' },
        { status: 400 }
      );
    }

    const response = executeQueryEngine(calculationData, question.trim(), {
      transitDate,
      fullName: fullName || calculationData.fullName,
      calculationReproducibilityHash: calculationData.reproducibilityHash || calculationData.hash,
    });

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error('Query API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process query' },
      { status: 500 }
    );
  }
}
