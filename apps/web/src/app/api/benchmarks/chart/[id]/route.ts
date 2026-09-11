import { NextRequest, NextResponse } from 'next/server';
import { getChartBenchmarkCaseById } from '@vedica/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseData = getChartBenchmarkCaseById(id);
    if (!caseData) {
      return NextResponse.json(
        { success: false, error: `Chart benchmark case ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      case: caseData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch chart benchmark case' },
      { status: 500 }
    );
  }
}
