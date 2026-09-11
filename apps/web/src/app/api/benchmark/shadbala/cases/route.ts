import { NextResponse } from 'next/server';
import { getBenchmarkStore } from '@vedica/validation';

export async function GET() {
  const store = getBenchmarkStore();
  const cases = await store.listCases('SHADBALA');
  return NextResponse.json({ cases });
}
