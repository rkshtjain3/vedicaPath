import { NextRequest, NextResponse } from 'next/server';
import {
  getChartBenchmarkCaseById,
  runBirthChartBenchmark,
  generateBirthChartValidationReport,
} from '@vedica/validation';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testCase = getChartBenchmarkCaseById(id);
    if (!testCase) {
      return NextResponse.json(
        { success: false, error: `Chart benchmark case ${id} not found` },
        { status: 404 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const tolerance = typeof body.tolerance === 'number' ? body.tolerance : 0.05;

    const runResult = await runBirthChartBenchmark(testCase, tolerance);
    const textReport = generateBirthChartValidationReport(runResult, testCase);

    return NextResponse.json({
      success: true,
      result: runResult,
      report: textReport,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to run birth chart benchmark' },
      { status: 500 }
    );
  }
}
