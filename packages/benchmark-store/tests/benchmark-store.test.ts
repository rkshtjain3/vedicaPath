import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  FileBenchmarkStore,
  SqliteBenchmarkStore,
  SqliteDatabaseInterface,
  BenchmarkService,
  computeInputFingerprint,
  detectInputDrift,
  BenchmarkCase,
  CalculationInputSnapshot,
} from '../src/index.js';

class MockSqliteDatabase implements SqliteDatabaseInterface {
  private cases = new Map<string, string>();
  private results = new Map<string, string>();

  exec(_sql: string): void {}

  prepare(sql: string) {
    const self = this;
    if (sql.includes('SELECT case_json FROM benchmark_cases WHERE category =')) {
      return {
        run: () => ({ changes: 0 }),
        get: () => null,
        all: (cat: string) =>
          Array.from(self.cases.values())
            .map((c) => JSON.parse(c))
            .filter((c) => c.category === cat)
            .map((c) => ({ case_json: JSON.stringify(c) })),
      };
    }
    if (sql.includes('SELECT case_json FROM benchmark_cases ORDER BY id ASC')) {
      return {
        run: () => ({ changes: 0 }),
        get: () => null,
        all: () => Array.from(self.cases.values()).map((c) => ({ case_json: c })),
      };
    }
    if (sql.includes('SELECT case_json FROM benchmark_cases WHERE id =')) {
      return {
        run: () => ({ changes: 0 }),
        get: (id: string) => {
          const val = self.cases.get(id);
          return val ? { case_json: val } : null;
        },
        all: () => [],
      };
    }
    if (sql.includes('INSERT INTO benchmark_cases')) {
      return {
        run: (...args: any[]) => {
          self.cases.set(args[0], args[8]);
          return { changes: 1 };
        },
        get: () => null,
        all: () => [],
      };
    }
    if (sql.includes('UPDATE benchmark_cases')) {
      return {
        run: (...args: any[]) => {
          self.cases.set(args[7], args[6]);
          return { changes: 1 };
        },
        get: () => null,
        all: () => [],
      };
    }
    if (sql.includes('DELETE FROM benchmark_cases')) {
      return {
        run: (id: string) => {
          const existed = self.cases.delete(id);
          return { changes: existed ? 1 : 0 };
        },
        get: () => null,
        all: () => [],
      };
    }
    if (sql.includes('INSERT INTO benchmark_results')) {
      return {
        run: (...args: any[]) => {
          self.results.set(args[0], args[3]);
          return { changes: 1 };
        },
        get: () => null,
        all: () => [],
      };
    }
    if (sql.includes('SELECT result_json FROM benchmark_results')) {
      return {
        run: () => ({ changes: 0 }),
        get: (caseId: string) => {
          const val = self.results.get(caseId);
          return val ? { result_json: val } : null;
        },
        all: () => [],
      };
    }

    return {
      run: () => ({ changes: 0 }),
      get: () => null,
      all: () => [],
    };
  }
}

describe('Phase 13C.1 — @vedica/benchmark-store Unit Tests', () => {
  let tempDir: string;
  let fileStore: FileBenchmarkStore;
  let sqliteStore: SqliteBenchmarkStore;

  const mockSnapshot: CalculationInputSnapshot = {
    birthDate: '1985-06-15',
    birthTime: '08:30:00',
    timezone: 'Asia/Kolkata',
    utcInstant: '1985-06-15T03:00:00.000Z',
    latitude: 28.6139,
    longitude: 77.209,
    locationName: 'New Delhi, India',
    country: 'India',
    calculationProfileVersion: 'shadbala-jhora-v1',
    ayanamsha: 'Lahiri',
    houseSystem: 'Whole Sign',
  };

  const sampleCaseData: Omit<BenchmarkCase, 'createdAt' | 'updatedAt'> = {
    id: 'TEST-CASE-001',
    category: 'SHADBALA',
    title: 'Test Shadbala Case 1',
    description: 'Unit test benchmark case',
    status: 'NOT_VALIDATED',
    calculationProfileVersion: 'shadbala-jhora-v1',
    referenceSource: {
      software: 'JHora',
      version: '8.0 Parashari Shadbala',
    },
    inputSnapshot: mockSnapshot,
    inputFingerprint: computeInputFingerprint(mockSnapshot),
    referenceValues: {},
    metadata: { testNote: 'Unit test metadata' },
  };

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'benchmark-store-test-'));
    fileStore = new FileBenchmarkStore(tempDir);
    sqliteStore = new SqliteBenchmarkStore(new MockSqliteDatabase());
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('FileBenchmarkStore Adapters', () => {
    it('creates, lists, and retrieves benchmark cases', async () => {
      const created = await fileStore.createCase(sampleCaseData);
      expect(created.id).toBe('TEST-CASE-001');
      expect(created.createdAt).toBeDefined();

      const retrieved = await fileStore.getCase('TEST-CASE-001');
      expect(retrieved).not.toBeNull();
      expect(retrieved?.title).toBe('Test Shadbala Case 1');

      const list = await fileStore.listCases('SHADBALA');
      expect(list.length).toBe(1);
    });

    it('prevents duplicate case creation', async () => {
      await fileStore.createCase(sampleCaseData);
      await expect(fileStore.createCase(sampleCaseData)).rejects.toThrow(/already exists/);
    });

    it('updates reference values and sets status to REFERENCE_ENTERED', async () => {
      await fileStore.createCase(sampleCaseData);
      const updated = await fileStore.updateReference({
        caseId: 'TEST-CASE-001',
        referenceValues: { shadbala: { naisargika: { Sun: 60 } } },
        checklistConfirmed: true,
        investigationNotes: 'Verified against JHora 8.0',
      });

      expect(updated.status).toBe('REFERENCE_ENTERED');
      expect(updated.referenceValues.shadbala?.naisargika?.Sun).toBe(60);
      expect(updated.metadata.checklistConfirmed).toBe(true);
    });

    it('exports dataset and performs valid import round trip', async () => {
      await fileStore.createCase(sampleCaseData);
      const exportPayload = await fileStore.exportDataset('SHADBALA');

      expect(exportPayload.schemaVersion).toBe('1.0.0');
      expect(exportPayload.cases.length).toBe(1);

      const importStoreDir = fs.mkdtempSync(path.join(os.tmpdir(), 'benchmark-import-test-'));
      const importStore = new FileBenchmarkStore(importStoreDir);

      const importResult = await importStore.importDataset(exportPayload);
      expect(importResult.success).toBe(true);
      expect(importResult.created).toBe(1);

      const importedCase = await importStore.getCase('TEST-CASE-001');
      expect(importedCase?.id).toBe('TEST-CASE-001');

      fs.rmSync(importStoreDir, { recursive: true, force: true });
    });

    it('detects incompatible schema version on import', async () => {
      const invalidDataset = {
        schemaVersion: '99.0.0',
        datasetVersion: '1.0.0',
        category: 'SHADBALA',
        cases: [],
      };

      const res = await fileStore.importDataset(invalidDataset);
      expect(res.success).toBe(false);
      expect(res.errors[0]).toContain('Incompatible schema version');
    });
  });

  describe('SqliteBenchmarkStore Adapter', () => {
    it('implements CRUD operations on SQLite', async () => {
      const created = await sqliteStore.createCase(sampleCaseData);
      expect(created.id).toBe('TEST-CASE-001');

      const retrieved = await sqliteStore.getCase('TEST-CASE-001');
      expect(retrieved?.title).toBe('Test Shadbala Case 1');

      const list = await sqliteStore.listCases('SHADBALA');
      expect(list.length).toBe(1);

      await sqliteStore.updateReference({
        caseId: 'TEST-CASE-001',
        referenceValues: { shadbala: { dig: { Sun: 30 } } },
      });

      const updated = await sqliteStore.getCase('TEST-CASE-001');
      expect(updated?.status).toBe('REFERENCE_ENTERED');
    });
  });

  describe('Input Snapshot & Fingerprinting', () => {
    it('computes deterministic SHA-256 fingerprint from snapshot', () => {
      const fp1 = computeInputFingerprint(mockSnapshot);
      const fp2 = computeInputFingerprint(mockSnapshot);
      expect(fp1).toBe(fp2);
      expect(fp1.length).toBe(16);
    });

    it('detects input drift when calculation parameters or profiles change', () => {
      const caseItem: BenchmarkCase = {
        ...sampleCaseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const matchDrift = detectInputDrift(caseItem, 'shadbala-jhora-v1');
      expect(matchDrift.driftStatus).toBe('MATCH');

      const profileDrift = detectInputDrift(caseItem, 'shadbala-v2-experimental');
      expect(profileDrift.driftStatus).toBe('PROFILE_CHANGED');

      const modifiedSnapshot = { ...mockSnapshot, latitude: 19.076 };
      const modifiedCaseItem: BenchmarkCase = {
        ...caseItem,
        inputSnapshot: modifiedSnapshot,
      };
      const inputDrift = detectInputDrift(modifiedCaseItem, 'shadbala-jhora-v1');
      expect(inputDrift.driftStatus).toBe('INPUT_CHANGED');
    });
  });

  describe('BenchmarkService Execution', () => {
    it('returns NOT_VALIDATED when running benchmark on case without reference data', async () => {
      await fileStore.createCase(sampleCaseData);

      const execResult = await BenchmarkService.runBenchmark({
        benchmarkId: 'TEST-CASE-001',
        store: fileStore,
        currentProfileVersion: 'shadbala-jhora-v1',
        calculate: () => ({ Sun: { naisargikaBala: 60 } }),
        compare: () => [],
      });

      expect(execResult.status).toBe('NOT_VALIDATED');
    });

    it('evaluates PASS result when actual values match reference within tolerance', async () => {
      await fileStore.createCase(sampleCaseData);
      await fileStore.updateReference({
        caseId: 'TEST-CASE-001',
        referenceValues: { shadbala: { naisargika: { Sun: 60 } } },
      });

      const execResult = await BenchmarkService.runBenchmark({
        benchmarkId: 'TEST-CASE-001',
        store: fileStore,
        currentProfileVersion: 'shadbala-jhora-v1',
        calculate: () => ({ Sun: { naisargikaBala: 60 } }),
        compare: (actual, ref) => [
          {
            planetOrKey: 'Sun',
            field: 'naisargikaBala',
            expectedValue: ref.shadbala.naisargika.Sun,
            actualValue: actual.Sun.naisargikaBala,
            passed: actual.Sun.naisargikaBala === ref.shadbala.naisargika.Sun,
          },
        ],
      });

      expect(execResult.status).toBe('PASS');
      expect(execResult.summary.passedComponents).toBe(1);
    });

    it('evaluates FAIL result when actual values differ from reference', async () => {
      await fileStore.createCase(sampleCaseData);
      await fileStore.updateReference({
        caseId: 'TEST-CASE-001',
        referenceValues: { shadbala: { naisargika: { Sun: 60 } } },
      });

      const execResult = await BenchmarkService.runBenchmark({
        benchmarkId: 'TEST-CASE-001',
        store: fileStore,
        currentProfileVersion: 'shadbala-jhora-v1',
        calculate: () => ({ Sun: { naisargikaBala: 45 } }),
        compare: (actual, ref) => [
          {
            planetOrKey: 'Sun',
            field: 'naisargikaBala',
            expectedValue: ref.shadbala.naisargika.Sun,
            actualValue: actual.Sun.naisargikaBala,
            passed: actual.Sun.naisargikaBala === ref.shadbala.naisargika.Sun,
          },
        ],
      });

      expect(execResult.status).toBe('FAIL');
      expect(execResult.summary.failedComponents).toBe(1);
    });

    it('returns STALE result when profile configuration has drifted', async () => {
      await fileStore.createCase(sampleCaseData);
      await fileStore.updateReference({
        caseId: 'TEST-CASE-001',
        referenceValues: { shadbala: { naisargika: { Sun: 60 } } },
      });

      const execResult = await BenchmarkService.runBenchmark({
        benchmarkId: 'TEST-CASE-001',
        store: fileStore,
        currentProfileVersion: 'shadbala-jhora-v2-different',
        calculate: () => ({ Sun: { naisargikaBala: 60 } }),
        compare: () => [
          {
            planetOrKey: 'Sun',
            field: 'naisargikaBala',
            expectedValue: 60,
            actualValue: 60,
            passed: true,
          },
        ],
      });

      expect(execResult.status).toBe('STALE');
      expect(execResult.driftResult.driftStatus).toBe('PROFILE_CHANGED');
    });
  });
});
