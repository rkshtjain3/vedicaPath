import { NextResponse } from 'next/server';
import { getBenchmarkStore } from '@vedica/validation';

export async function POST() {
  const store = getBenchmarkStore();
  const exportPayload = await store.exportDataset('SHADBALA');
  return NextResponse.json(exportPayload);
}
