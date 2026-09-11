import { NextRequest, NextResponse } from 'next/server';
import { loadChartBenchmarkCases, auditBenchmarkCases, assessBenchmarkSuiteQuality } from '@vedica/validation';

export async function GET(req: NextRequest) {
  try {
    const cases = loadChartBenchmarkCases();
    const audit = auditBenchmarkCases(cases);
    const qualityReport = assessBenchmarkSuiteQuality(cases);

    return NextResponse.json({
      success: true,
      category: 'ASTROLOGY_CHART',
      count: cases.length,
      audit,
      qualityReport,
      cases,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to load chart benchmark cases' },
      { status: 500 }
    );
  }
}
