# Benchmark Storage Architecture & Extension Guide

This document describes the architectural design of the `BenchmarkStore` abstraction in `@vedica/validation`.

---

## 1. Executive Summary

To preserve total isolation between benchmark calculation logic, API endpoints, web dashboards, and underlying persistence mechanisms, the benchmarking system uses a provider-based store pattern.

All API routes and UI components interact exclusively with the `BenchmarkStore` interface contract.

---

## 2. Core Components & Interface Contract

```text
               +-----------------------------+
               |   Web Dashboard & API       |
               +-----------------------------+
                              |
                              v
               +-----------------------------+
               |  BenchmarkStore (Interface) |
               +-----------------------------+
                              |
          +-------------------+-------------------+
          |                                       |
          v                                       v
+-------------------+                   +-------------------+
|FileBenchmarkStore |                   |Future DB Provider |
|(JSON Persistence) |                   |(SQLite / Postgres)|
+-------------------+                   +-------------------+
```

### The `BenchmarkStore` Interface (`validation/src/shadbala-jhora/store/benchmark-store.ts`)

```ts
export interface BenchmarkStore {
  getCases(): Promise<BenchmarkCaseSummary[]>;
  getCase(caseId: string): Promise<any | null>;
  saveReference(input: SaveBenchmarkReferenceInput): Promise<StoredBenchmarkData>;
  getResults(caseId: string): Promise<any | null>;
  exportBenchmark(): Promise<FullBenchmarkExport>;
  importBenchmark(data: FullBenchmarkExport): Promise<{ importedCount: number }>;
}
```

---

## 3. Factory Resolver (`getBenchmarkStore()`)

The store resolver factory instantiates the designated provider based on the `BENCHMARK_STORE` environment variable:

```ts
export function getBenchmarkStore(): BenchmarkStore {
  const storeType = process.env.BENCHMARK_STORE || 'file';

  if (!singletonStore) {
    if (storeType === 'file') {
      singletonStore = new FileBenchmarkStore();
    } else {
      singletonStore = new FileBenchmarkStore();
    }
  }

  return singletonStore;
}
```

---

## 4. Current File Provider (`FileBenchmarkStore`)

- **Storage Location**: `validation/src/shadbala-jhora/data/benchmark-store.json`.
- **Advantages**: Zero external database dependencies; perfectly suited for local developer usage and single-user personal benchmarking.
- **Portability**: All JSON export payloads strip absolute filesystem paths and contain strictly portable benchmark details and SHA-256 hashes.

---

## 5. Adding Future Database Providers (SQLite / PostgreSQL / Drizzle)

To add a database-backed provider in the future:
1. Create `DatabaseBenchmarkStore.ts` implementing `BenchmarkStore`.
2. Add schema tables (e.g. `ShadbalaBenchmarkCase`, `ShadbalaBenchmarkReference`, `ShadbalaBenchmarkInvestigation`).
3. Register the class in `getBenchmarkStore()` under `storeType === 'database'`.
4. Zero changes are required in API routes, React UI, or Shadbala formulas.
