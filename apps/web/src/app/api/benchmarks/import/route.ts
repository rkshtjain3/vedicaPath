import { NextRequest, NextResponse } from 'next/server';
import { getBenchmarkStore } from '@vedica/validation';

export async function POST(req: NextRequest) {
  try {
    const datasetInput = await req.json();
    const { searchParams } = new URL(req.url);
    const overwrite = searchParams.get('overwrite') === 'true';

    const store = getBenchmarkStore();
    const importResult = await store.importDataset(datasetInput, overwrite);

    if (!importResult.success) {
      return NextResponse.json(importResult, { status: 400 });
    }

    return NextResponse.json(importResult, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        datasetVersion: 'UNKNOWN',
        created: 0,
        updated: 0,
        skipped: 0,
        duplicates: [],
        invalid: [],
        errors: [err.message || 'Failed to parse or import benchmark dataset'],
      },
      { status: 400 }
    );
  }
}
