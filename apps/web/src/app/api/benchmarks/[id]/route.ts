import { NextRequest, NextResponse } from 'next/server';
import { getBenchmarkStore } from '@vedica/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const store = getBenchmarkStore();
    const benchmarkCase = await store.getCase(id);

    if (!benchmarkCase) {
      return NextResponse.json(
        { success: false, error: `Benchmark case "${id}" not found` },
        { status: 404 }
      );
    }

    const latestResult = await store.getResult(id);

    return NextResponse.json({
      success: true,
      case: benchmarkCase,
      latestResult: latestResult || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve benchmark case' },
      { status: 500 }
    );
  }
}
