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

export interface SqliteDatabaseInterface {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...args: any[]): { changes: number };
    get(...args: any[]): any;
    all(...args: any[]): any[];
  };
}

export class SqliteBenchmarkStore implements BenchmarkStore {
  private db: SqliteDatabaseInterface;

  constructor(dbPathOrInstance: string | SqliteDatabaseInterface = ':memory:') {
    if (typeof dbPathOrInstance === 'string') {
      try {
        // Dynamic import / require of better-sqlite3
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Database = require('better-sqlite3');
        this.db = new Database(dbPathOrInstance);
      } catch (err: any) {
        throw new Error(
          `SqliteBenchmarkStore requires better-sqlite3 native addon: ${err.message}`
        );
      }
    } else {
      this.db = dbPathOrInstance;
    }
    this.initTables();
  }

  private initTables(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS benchmark_cases (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        calculation_profile_version TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        case_json TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS benchmark_results (
        case_id TEXT PRIMARY KEY,
        executed_at TEXT NOT NULL,
        status TEXT NOT NULL,
        result_json TEXT NOT NULL,
        FOREIGN KEY (case_id) REFERENCES benchmark_cases(id) ON DELETE CASCADE
      );
    `);
  }

  public async listCases(category?: BenchmarkCategory): Promise<BenchmarkCase[]> {
    let rows: any[];
    if (category) {
      const stmt = this.db.prepare('SELECT case_json FROM benchmark_cases WHERE category = ? ORDER BY id ASC');
      rows = stmt.all(category);
    } else {
      const stmt = this.db.prepare('SELECT case_json FROM benchmark_cases ORDER BY id ASC');
      rows = stmt.all();
    }
    return rows.map((r) => JSON.parse(r.case_json));
  }

  public async getCase(id: string): Promise<BenchmarkCase | null> {
    const stmt = this.db.prepare('SELECT case_json FROM benchmark_cases WHERE id = ?');
    const row: any = stmt.get(id);
    if (!row) return null;
    return JSON.parse(row.case_json);
  }

  public async createCase(
    caseData: Omit<BenchmarkCase, 'createdAt' | 'updatedAt'>
  ): Promise<BenchmarkCase> {
    const existing = await this.getCase(caseData.id);
    if (existing) {
      throw new Error(`Benchmark case with ID "${caseData.id}" already exists.`);
    }

    const now = new Date().toISOString();
    const newCase: BenchmarkCase = {
      ...caseData,
      createdAt: now,
      updatedAt: now,
    };

    const stmt = this.db.prepare(`
      INSERT INTO benchmark_cases (id, category, title, description, status, calculation_profile_version, created_at, updated_at, case_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      newCase.id,
      newCase.category,
      newCase.title,
      newCase.description,
      newCase.status,
      newCase.calculationProfileVersion,
      newCase.createdAt,
      newCase.updatedAt,
      JSON.stringify(newCase)
    );

    return newCase;
  }

  public async updateCase(id: string, updates: Partial<BenchmarkCase>): Promise<BenchmarkCase> {
    const existing = await this.getCase(id);
    if (!existing) {
      throw new Error(`Benchmark case "${id}" not found.`);
    }

    const updatedCase: BenchmarkCase = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const stmt = this.db.prepare(`
      UPDATE benchmark_cases
      SET category = ?, title = ?, description = ?, status = ?, calculation_profile_version = ?, updated_at = ?, case_json = ?
      WHERE id = ?
    `);
    stmt.run(
      updatedCase.category,
      updatedCase.title,
      updatedCase.description,
      updatedCase.status,
      updatedCase.calculationProfileVersion,
      updatedCase.updatedAt,
      JSON.stringify(updatedCase),
      id
    );

    return updatedCase;
  }

  public async updateReference(update: BenchmarkReferenceUpdate): Promise<BenchmarkCase> {
    const existing = await this.getCase(update.caseId);
    if (!existing) {
      throw new Error(`Benchmark case "${update.caseId}" not found.`);
    }

    const hasRefValues = Object.keys(update.referenceValues || {}).length > 0;
    let newStatus = existing.status;
    if (hasRefValues && (existing.status === 'NOT_VALIDATED' || existing.status === 'READY_FOR_REFERENCE')) {
      newStatus = 'REFERENCE_ENTERED';
    }

    return this.updateCase(update.caseId, {
      referenceValues: update.referenceValues,
      status: newStatus,
      referenceSource: {
        ...existing.referenceSource,
        enteredBy: update.enteredBy || existing.referenceSource.enteredBy,
        enteredAt: new Date().toISOString(),
        notes: update.investigationNotes || existing.referenceSource.notes,
      },
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

    const stmt = this.db.prepare(`
      INSERT INTO benchmark_results (case_id, executed_at, status, result_json)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(case_id) DO UPDATE SET
        executed_at = excluded.executed_at,
        status = excluded.status,
        result_json = excluded.result_json
    `);
    stmt.run(result.caseId, result.executedAt, result.status, JSON.stringify(result));

    await this.updateCase(result.caseId, { status: result.status });
    return result;
  }

  public async getResult(caseId: string): Promise<BenchmarkResult | null> {
    const stmt = this.db.prepare('SELECT result_json FROM benchmark_results WHERE case_id = ?');
    const row: any = stmt.get(caseId);
    if (!row) return null;
    return JSON.parse(row.result_json);
  }

  public async deleteCase(id: string): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM benchmark_cases WHERE id = ?');
    const res = stmt.run(id);
    return res.changes > 0;
  }

  public async exportDataset(category?: BenchmarkCategory): Promise<BenchmarkExportResult> {
    const cases = await this.listCases(category);
    const results: Record<string, BenchmarkResult> = {};

    for (const c of cases) {
      const res = await this.getResult(c.id);
      if (res) results[c.id] = res;
    }

    return {
      schemaVersion: '1.0.0',
      datasetVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      category,
      cases,
      results,
      metadata: {
        totalCases: cases.length,
        exportedBy: 'SqliteBenchmarkStore',
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
        errors: [`Invalid schema: ${val.error.message}`],
      };
    }

    const data = val.data;
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
