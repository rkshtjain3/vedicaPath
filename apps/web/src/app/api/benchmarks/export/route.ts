import { NextRequest, NextResponse } from 'next/server';
import { getBenchmarkStore } from '@vedica/validation';
import { BenchmarkCategory } from '@vedica/benchmark-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as BenchmarkCategory | null;

    const store = getBenchmarkStore();
    const exportResult = await store.exportDataset(category || undefined);

    return new NextResponse(JSON.stringify(exportResult, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="benchmark-dataset-${(category || 'ALL').toLowerCase()}-${Date.now()}.json"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to export benchmark dataset' },
      { status: 500 }
    );
  }
}
