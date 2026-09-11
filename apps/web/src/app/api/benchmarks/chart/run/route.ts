import { NextRequest, NextResponse } from 'next/server';
import { loadChartBenchmarkCases, getChartBenchmarkCaseById, runBirthChartBenchmark, runMultiCaseChartBenchmark } from '@vedica/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { caseId, tolerance = 0.05, targetSoftware } = body;

    if (caseId) {
      const c = getChartBenchmarkCaseById(caseId);
      if (!c) {
        return NextResponse.json({ success: false, error: `Case ${caseId} not found` }, { status: 404 });
      }
      const result = await runBirthChartBenchmark(c, tolerance, targetSoftware);
      return NextResponse.json({ success: true, result });
    }

    const cases = loadChartBenchmarkCases();
    const summary = await runMultiCaseChartBenchmark(cases, tolerance, targetSoftware);
    return NextResponse.json({ success: true, summary });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to run benchmark' },
      { status: 500 }
    );
  }
}
