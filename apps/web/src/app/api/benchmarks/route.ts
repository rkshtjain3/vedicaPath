import { NextRequest, NextResponse } from 'next/server';
import { getBenchmarkStore } from '@vedica/validation';
import { BenchmarkCategory, BenchmarkCase } from '@vedica/benchmark-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as BenchmarkCategory | null;

    const store = getBenchmarkStore();
    const cases = await store.listCases(category || undefined);

    return NextResponse.json({
      success: true,
      category: category || 'ALL',
      count: cases.length,
      cases,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to list benchmark cases' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const caseData: Omit<BenchmarkCase, 'createdAt' | 'updatedAt'> = await req.json();
    const store = getBenchmarkStore();
    const created = await store.createCase(caseData);

    return NextResponse.json({ success: true, case: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create benchmark case' },
      { status: 400 }
    );
  }
}
