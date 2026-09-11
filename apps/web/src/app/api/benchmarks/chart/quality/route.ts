import { NextRequest, NextResponse } from 'next/server';
import { loadChartBenchmarkCases, assessBenchmarkSuiteQuality } from '@vedica/validation';

export async function GET(req: NextRequest) {
  try {
    const cases = loadChartBenchmarkCases();
    const qualityReport = assessBenchmarkSuiteQuality(cases);
    return NextResponse.json({
      success: true,
      qualityReport,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to assess benchmark suite quality' },
      { status: 500 }
    );
  }
}
