import { NextRequest, NextResponse } from 'next/server';
import { getBenchmarkStore, runUnifiedBenchmark } from '@vedica/validation';
import { BenchmarkResult } from '@vedica/benchmark-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const store = getBenchmarkStore();
    const testCase = await store.getCase(id);

    if (!testCase) {
      return NextResponse.json({ success: false, error: 'Benchmark case not found' }, { status: 404 });
    }

    const executionResult = await runUnifiedBenchmark(testCase);

    const benchmarkResult: BenchmarkResult = {
      id: crypto.randomUUID(),
      caseId: id,
      executedAt: executionResult.executedAt,
      status: executionResult.status,
      driftResult: executionResult.driftResult,
      comparisonResults: executionResult.comparisonResults,
      summary: executionResult.summary
    };

    await store.saveResult(benchmarkResult);

    return NextResponse.json({
      success: true,
      result: executionResult,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to run benchmark execution' },
      { status: 500 }
    );
  }
}
