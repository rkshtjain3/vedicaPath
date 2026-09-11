import { NextRequest, NextResponse } from 'next/server';
import { getBenchmarkStore } from '@vedica/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const store = getBenchmarkStore();
    const result = await store.importDataset(body, true);
    return NextResponse.json({ success: true, importedCount: result.updated + result.created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Import failed' }, { status: 400 });
  }
}
