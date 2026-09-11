import { NextRequest, NextResponse } from 'next/server';
import { loadChartBenchmarkCases } from '@vedica/validation';

export async function GET(req: NextRequest) {
  try {
    const cases = loadChartBenchmarkCases();
    const exportDataset = {
      schemaVersion: '1.0.0',
      datasetVersion: 'chart-reference-dataset-v2',
      category: 'ASTROLOGY_CHART',
      exportedAt: new Date().toISOString(),
      metadata: {
        title: 'Birth Chart Accuracy & Cross-Software Validation Benchmark Dataset',
        description: 'Standardized multi-case benchmark dataset with strict provenance and accuracy certification.',
      },
      cases,
    };

    return new NextResponse(JSON.stringify(exportDataset, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="chart-benchmark-dataset.json"',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to export benchmark dataset' },
      { status: 500 }
    );
  }
}
