import { NextRequest, NextResponse } from 'next/server';
import { getBenchmarkStore } from '@vedica/validation';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { checklistConfirmed, referenceValues, investigationCause, investigationNotes, enteredBy } = body;

    const store = getBenchmarkStore();
    const updatedCase = await store.updateReference({
      caseId: id,
      checklistConfirmed: Boolean(checklistConfirmed),
      referenceValues: referenceValues || {},
      investigationCause,
      investigationNotes,
      enteredBy,
    });

    return NextResponse.json({
      success: true,
      case: updatedCase,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update reference values' },
      { status: 500 }
    );
  }
}
