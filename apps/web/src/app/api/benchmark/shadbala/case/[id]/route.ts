import { NextRequest, NextResponse } from 'next/server';
import { getBenchmarkStore } from '@vedica/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = getBenchmarkStore();
  const caseDetails = await store.getCase(id);

  if (!caseDetails) {
    return NextResponse.json({ error: `Benchmark case ${id} not found` }, { status: 404 });
  }

  return NextResponse.json(caseDetails);
}
