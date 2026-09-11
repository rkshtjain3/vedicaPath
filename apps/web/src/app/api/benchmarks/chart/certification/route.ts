import { NextRequest, NextResponse } from 'next/server';
import { loadChartBenchmarkCases, generateAccuracyCertification } from '@vedica/validation';

export async function GET(req: NextRequest) {
  try {
    const cases = loadChartBenchmarkCases();
    const { summary, textReport } = await generateAccuracyCertification(cases);

    return NextResponse.json({
      success: true,
      summary,
      report: textReport,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate accuracy certification' },
      { status: 500 }
    );
  }
}
