import { NextRequest, NextResponse } from 'next/server';
import { saveChartBenchmarkReference } from '@vedica/validation';
import { validateReferenceProvenance } from '@vedica/benchmark-store';

export async function POST(req: NextRequest) {
  try {
    const dataset = await req.json();

    if (!dataset || !Array.isArray(dataset.cases)) {
      return NextResponse.json(
        { success: false, error: 'Invalid dataset format. Must contain a cases array.' },
        { status: 400 }
      );
    }

    let updatedCount = 0;
    const errors: string[] = [];

    for (const c of dataset.cases) {
      if (!c.id || !c.referenceValues) continue;

      const provenance = c.referenceSource || {};
      // Rule: Imported references default to UNVERIFIED unless provenance passes strict check
      const provCheck = validateReferenceProvenance(provenance);
      provenance.verificationStatus = provCheck.effectiveStatus;
      if (!provCheck.valid && provenance.verificationStatus === 'VERIFIED') {
        provenance.verificationStatus = 'UNVERIFIED';
      }

      try {
        saveChartBenchmarkReference(
          c.id,
          c.referenceValues,
          provenance.notes || 'Imported dataset reference',
          provenance
        );
        updatedCount++;
      } catch (err: any) {
        errors.push(`Case ${c.id}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      errors,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to import benchmark dataset' },
      { status: 500 }
    );
  }
}
