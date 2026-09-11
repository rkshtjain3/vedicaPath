import { NextRequest, NextResponse } from 'next/server';
import { getBenchmarkStore } from '@vedica/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const store = getBenchmarkStore();
    const bCase = await store.getCase(id);
    if (!bCase) {
      return NextResponse.json({ error: `Benchmark case ${id} not found` }, { status: 404 });
    }
    const result = await store.getResult(id);
    return NextResponse.json({
      benchmarkCase: bCase,
      storedData: bCase.metadata || null,
      comparisonResult: result,
      fingerprint: bCase.inputFingerprint,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to evaluate benchmark case' }, { status: 500 });
  }
}
