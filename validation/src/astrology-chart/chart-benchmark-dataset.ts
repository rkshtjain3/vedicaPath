import fs from 'fs';
import path from 'path';
import { BenchmarkCase, validateReferenceProvenance } from '@vedica/benchmark-store';

export interface ChartBenchmarkDatasetFile {
  schemaVersion: string;
  datasetVersion: string;
  category: string;
  exportedAt: string;
  metadata: Record<string, any>;
  cases: BenchmarkCase[];
}

export function resolveChartDatasetPath(): string {
  const cwd = process.cwd();
  if (cwd.endsWith('/validation') || cwd.endsWith('\\validation')) {
    return path.join(cwd, 'astrology-chart-benchmark-data', 'chart-dataset.json');
  }
  return path.join(cwd, 'validation', 'astrology-chart-benchmark-data', 'chart-dataset.json');
}

export function loadChartBenchmarkCases(): BenchmarkCase[] {
  const filePath = resolveChartDatasetPath();
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(content) as ChartBenchmarkDatasetFile;
  return parsed.cases || [];
}

export function getChartBenchmarkCaseById(caseId: string): BenchmarkCase | undefined {
  const cases = loadChartBenchmarkCases();
  return cases.find((c) => c.id.toUpperCase() === caseId.toUpperCase());
}

export function saveChartBenchmarkReference(
  caseId: string,
  referenceValues: Record<string, any>,
  referenceSourceNotes?: string,
  provenance?: Record<string, any>
): BenchmarkCase {
  const filePath = resolveChartDatasetPath();
  let dataset: ChartBenchmarkDatasetFile = {
    schemaVersion: '1.0.0',
    datasetVersion: 'chart-reference-dataset-v2',
    category: 'ASTROLOGY_CHART',
    exportedAt: new Date().toISOString(),
    metadata: {},
    cases: [],
  };

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    dataset = JSON.parse(content);
  }

  const idx = dataset.cases.findIndex((c) => c.id.toUpperCase() === caseId.toUpperCase());
  if (idx === -1) {
    throw new Error(`Chart benchmark case ${caseId} not found`);
  }

  const existing = dataset.cases[idx];
  const hasRefData = Object.keys(referenceValues || {}).length > 0;

  const mergedProvenance = {
    ...existing.referenceSource,
    ...(provenance || {}),
    notes: referenceSourceNotes || provenance?.notes || existing.referenceSource?.notes,
    enteredAt: new Date().toISOString(),
  };

  // Phase 20 Provenance Validation Rule
  const validationRes = validateReferenceProvenance(mergedProvenance);
  mergedProvenance.verificationStatus = validationRes.effectiveStatus;

  const updated: BenchmarkCase = {
    ...existing,
    referenceValues,
    status: hasRefData ? 'REFERENCE_ENTERED' : 'NOT_VALIDATED',
    updatedAt: new Date().toISOString(),
    referenceSource: mergedProvenance,
  };

  dataset.cases[idx] = updated;

  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(dataset, null, 2), 'utf-8');
  fs.renameSync(tempPath, filePath);

  return updated;
}
