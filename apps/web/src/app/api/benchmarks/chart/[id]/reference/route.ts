import { NextRequest, NextResponse } from 'next/server';
import { saveChartBenchmarkReference, runBirthChartBenchmark, getChartBenchmarkCaseById } from '@vedica/validation';
import { detectSelfReferencing } from '@vedica/benchmark-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { referenceValues, notes, provenance } = body;

    if (!referenceValues || typeof referenceValues !== 'object') {
      return NextResponse.json(
        { success: false, error: 'referenceValues object is required' },
        { status: 400 }
      );
    }

    const currentCase = getChartBenchmarkCaseById(id);
    if (currentCase) {
      const runRes = await runBirthChartBenchmark(currentCase);
      const selfCheck = detectSelfReferencing(referenceValues, runRes.actualChartOutputs);
      if (selfCheck.isSelfReferenced) {
        return NextResponse.json(
          { success: false, error: selfCheck.reason },
          { status: 400 }
        );
      }
    }

    const updatedCase = saveChartBenchmarkReference(id, referenceValues, notes, provenance);

    return NextResponse.json({
      success: true,
      case: updatedCase,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save chart benchmark reference' },
      { status: 500 }
    );
  }
}
