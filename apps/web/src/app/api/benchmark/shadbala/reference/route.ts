import { NextRequest, NextResponse } from 'next/server';
import { getBenchmarkStore } from '@vedica/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseId, checklistConfirmed, referenceValues, investigationCause, investigationNotes } = body;

    if (!caseId) {
      return NextResponse.json({ error: 'caseId is required' }, { status: 400 });
    }

    const store = getBenchmarkStore();
    const saved = await store.updateReference({
      caseId,
      checklistConfirmed: Boolean(checklistConfirmed),
      referenceValues: referenceValues || {},
      investigationCause,
      investigationNotes,
    });

    return NextResponse.json({ success: true, storedData: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save reference data' }, { status: 500 });
  }
}
