import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BenchmarkStore } from '../store/benchmark-store.interface.js';
import {
  BenchmarkCase,
  BenchmarkCategory,
  BenchmarkExportResult,
  BenchmarkImportResult,
  BenchmarkReferenceUpdate,
  BenchmarkResult,
} from '../types/benchmark-types.js';
import { BenchmarkCaseSchema, BenchmarkDatasetSchema } from '../schemas/benchmark-schemas.js';

export const CURRENT_SCHEMA_VERSION = '1.0.0';
export const CURRENT_DATASET_VERSION = '1.0.0';

function findBenchmarkDataDir(startDir: string): string {
  let curr = startDir;
  while (curr && curr !== path.parse(curr).root) {
    if (fs.existsSync(path.join(curr, 'pnpm-workspace.yaml'))) {
      const rootCandidate = path.join(curr, 'validation/benchmark-data');
      if (fs.existsSync(rootCandidate)) {
        return rootCandidate;
      }
    }
    const candidate = path.join(curr, 'validation/benchmark-data');
    if (fs.existsSync(path.join(candidate, 'shadbala/shadbala-dataset.json'))) {
      return candidate;
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return path.resolve(startDir, 'validation/benchmark-data');
}

export class FileBenchmarkStore implements BenchmarkStore {
  private baseDir: string;

  constructor(baseDir?: string) {
    if (baseDir) {
      this.baseDir = baseDir;
    } else {
      this.baseDir = findBenchmarkDataDir(process.cwd());
    }
  }

  private getCategoryDir(category: BenchmarkCategory): string {
    const dir = path.join(this.baseDir, category.toLowerCase());
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  private getDatasetPath(category: BenchmarkCategory): string {
    const dir = this.getCategoryDir(category);
    return path.join(dir, `${category.toLowerCase()}-dataset.json`);
  }

  private atomicWriteJson(filePath: string, data: any): void {
    const tempPath = `${filePath}.${Date.now()}.${Math.random().toString(36).substring(2, 8)}.tmp`;
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempPath, jsonStr, 'utf-8');
    fs.renameSync(tempPath, filePath);
  }

  private loadDataset(category: BenchmarkCategory): {
    schemaVersion: string;
    datasetVersion: string;
    category: BenchmarkCategory;
    cases: BenchmarkCase[];
    results?: Record<string, BenchmarkResult>;
    metadata?: Record<string, any>;
  } {
    const filePath = this.getDatasetPath(category);
    if (!fs.existsSync(filePath)) {
      return {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        datasetVersion: CURRENT_DATASET_VERSION,
        category,
        cases: [],
        results: {},
        metadata: {},
      };
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      const val = BenchmarkDatasetSchema.safeParse(parsed);
      if (!val.success) {
        throw new Error(`Schema validation failed for dataset at ${filePath}: ${val.error.message}`);
      }
      return val.data as any;
    } catch (err: any) {
      throw new Error(`Failed to load benchmark dataset at ${filePath}: ${err.message}`);
    }
  }

  private saveDataset(
    category: BenchmarkCategory,
    dataset: {
      schemaVersion: string;
      datasetVersion: string;
      category: BenchmarkCategory;
      cases: BenchmarkCase[];
      results?: Record<string, BenchmarkResult>;
      metadata?: Record<string, any>;
    }
  ): void {
    const val = BenchmarkDatasetSchema.safeParse(dataset);
    if (!val.success) {
      throw new Error(`Cannot save invalid benchmark dataset: ${val.error.message}`);
    }

    const filePath = this.getDatasetPath(category);
    this.atomicWriteJson(filePath, dataset);
  }

  public async listCases(category?: BenchmarkCategory): Promise<BenchmarkCase[]> {
    const categories: BenchmarkCategory[] = category
      ? [category]
      : ['ASTROLOGY', 'DASHA', 'DIVISIONAL', 'ASHTAKAVARGA', 'SHADBALA', 'TIMING'];

    let allCases: BenchmarkCase[] = [];
    for (const cat of categories) {
      const dataset = this.loadDataset(cat);
      allCases = allCases.concat(dataset.cases);
    }
    return allCases;
  }

  public async getCase(id: string): Promise<BenchmarkCase | null> {
    const cases = await this.listCases();
    const found = cases.find((c) => c.id === id);
    return found || null;
  }

  public async createCase(
    caseData: Omit<BenchmarkCase, 'createdAt' | 'updatedAt'>
  ): Promise<BenchmarkCase> {
    const dataset = this.loadDataset(caseData.category);
    if (dataset.cases.some((c) => c.id === caseData.id)) {
      throw new Error(`Benchmark case with ID "${caseData.id}" already exists.`);
    }

    const now = new Date().toISOString();
    const newCase: BenchmarkCase = {
      ...caseData,
      createdAt: now,
      updatedAt: now,
    };

    const val = BenchmarkCaseSchema.safeParse(newCase);
    if (!val.success) {
      throw new Error(`Invalid benchmark case structure: ${val.error.message}`);
    }

    dataset.cases.push(newCase);
    this.saveDataset(caseData.category, dataset);
    return newCase;
  }

  public async updateCase(id: string, updates: Partial<BenchmarkCase>): Promise<BenchmarkCase> {
    const existing = await this.getCase(id);
    if (!existing) {
      throw new Error(`Benchmark case "${id}" not found.`);
    }

    const category = existing.category;
    const dataset = this.loadDataset(category);
    const index = dataset.cases.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Benchmark case "${id}" not found in dataset.`);
    }

    const updatedCase: BenchmarkCase = {
      ...dataset.cases[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const val = BenchmarkCaseSchema.safeParse(updatedCase);
    if (!val.success) {
      throw new Error(`Invalid benchmark case update: ${val.error.message}`);
    }

    dataset.cases[index] = updatedCase;
    this.saveDataset(category, dataset);
    return updatedCase;
  }

  public async updateReference(update: BenchmarkReferenceUpdate): Promise<BenchmarkCase> {
    const existing = await this.getCase(update.caseId);
    if (!existing) {
      throw new Error(`Benchmark case "${update.caseId}" not found.`);
    }

    const hasRefValues = Object.keys(update.referenceValues || {}).length > 0;
    // Set status to REFERENCE_ENTERED if status was NOT_VALIDATED/READY_FOR_REFERENCE and reference data provided
    let newStatus = existing.status;
    if (hasRefValues && (existing.status === 'NOT_VALIDATED' || existing.status === 'READY_FOR_REFERENCE')) {
      newStatus = 'REFERENCE_ENTERED';
    }

    const newRefSource = {
      ...existing.referenceSource,
      enteredBy: update.enteredBy || existing.referenceSource.enteredBy,
      enteredAt: new Date().toISOString(),
      notes: update.investigationNotes || existing.referenceSource.notes,
    };

    return this.updateCase(update.caseId, {
      referenceValues: update.referenceValues,
      status: newStatus,
      referenceSource: newRefSource,
      metadata: {
        ...existing.metadata,
        checklistConfirmed: update.checklistConfirmed ?? existing.metadata.checklistConfirmed,
        investigationCause: update.investigationCause ?? existing.metadata.investigationCause,
        investigationNotes: update.investigationNotes ?? existing.metadata.investigationNotes,
      },
    });
  }

  public async saveResult(result: BenchmarkResult): Promise<BenchmarkResult> {
    const existingCase = await this.getCase(result.caseId);
    if (!existingCase) {
      throw new Error(`Benchmark case "${result.caseId}" not found.`);
    }

    const dataset = this.loadDataset(existingCase.category);
    if (!dataset.results) {
      dataset.results = {};
    }
    dataset.results[result.caseId] = result;

    // Also update case status according to result
    const caseIndex = dataset.cases.findIndex((c) => c.id === result.caseId);
    if (caseIndex !== -1) {
      dataset.cases[caseIndex].status = result.status;
      dataset.cases[caseIndex].updatedAt = new Date().toISOString();
    }

    this.saveDataset(existingCase.category, dataset);
    return result;
  }

  public async getResult(caseId: string): Promise<BenchmarkResult | null> {
    const existingCase = await this.getCase(caseId);
    if (!existingCase) return null;

    const dataset = this.loadDataset(existingCase.category);
    return dataset.results?.[caseId] || null;
  }

  public async deleteCase(id: string): Promise<boolean> {
    const existing = await this.getCase(id);
    if (!existing) return false;

    const dataset = this.loadDataset(existing.category);
    dataset.cases = dataset.cases.filter((c) => c.id !== id);
    if (dataset.results) {
      delete dataset.results[id];
    }

    this.saveDataset(existing.category, dataset);
    return true;
  }

  public async exportDataset(category?: BenchmarkCategory): Promise<BenchmarkExportResult> {
    const cases = await this.listCases(category);
    const results: Record<string, BenchmarkResult> = {};

    for (const c of cases) {
      const res = await this.getResult(c.id);
      if (res) {
        results[c.id] = res;
      }
    }

    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      datasetVersion: CURRENT_DATASET_VERSION,
      exportedAt: new Date().toISOString(),
      category,
      cases,
      results,
      metadata: {
        totalCases: cases.length,
        exportedBy: 'FileBenchmarkStore',
      },
    };
  }

  public async importDataset(
    datasetInput: unknown,
    overwriteExisting = false
  ): Promise<BenchmarkImportResult> {
    const val = BenchmarkDatasetSchema.safeParse(datasetInput);
    if (!val.success) {
      return {
        success: false,
        datasetVersion: 'UNKNOWN',
        created: 0,
        updated: 0,
        skipped: 0,
        duplicates: [],
        invalid: [val.error.message],
        errors: [`Invalid benchmark dataset schema: ${val.error.message}`],
      };
    }

    const data = val.data;

    // Version compatibility check
    if (data.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      return {
        success: false,
        datasetVersion: data.datasetVersion,
        created: 0,
        updated: 0,
        skipped: 0,
        duplicates: [],
        invalid: [`Incompatible schema version: ${data.schemaVersion}. Expected ${CURRENT_SCHEMA_VERSION}`],
        errors: [`Incompatible schema version: ${data.schemaVersion}. Migration required.`],
      };
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const duplicates: string[] = [];
    const invalid: string[] = [];
    const errors: string[] = [];

    for (const caseData of data.cases) {
      const caseVal = BenchmarkCaseSchema.safeParse(caseData);
      if (!caseVal.success) {
        invalid.push(caseData.id || 'UNNAMED');
        errors.push(`Invalid case ${caseData.id}: ${caseVal.error.message}`);
        continue;
      }

      const existing = await this.getCase(caseData.id);
      if (existing) {
        duplicates.push(caseData.id);
        if (overwriteExisting) {
          await this.updateCase(caseData.id, caseData);
          updated++;
        } else {
          skipped++;
        }
      } else {
        await this.createCase(caseData);
        created++;
      }

      if (data.results?.[caseData.id]) {
        await this.saveResult(data.results[caseData.id]);
      }
    }

    return {
      success: errors.length === 0,
      datasetVersion: data.datasetVersion,
      created,
      updated,
      skipped,
      duplicates,
      invalid,
      errors,
    };
  }
}
