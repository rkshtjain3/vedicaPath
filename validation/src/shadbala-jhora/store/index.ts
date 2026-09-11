import path from 'path';
import fs from 'fs';
import { BenchmarkStore, FileBenchmarkStore } from '@vedica/benchmark-store';

export * from '@vedica/benchmark-store';
export {
  ShadbalaBenchmarkStore,
  computeInputFingerprint,
  computeReferenceHash,
} from '../store.js';

let singletonStore: BenchmarkStore | null = null;

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

export function getBenchmarkStore(): BenchmarkStore {
  if (!singletonStore) {
    const baseDir = findBenchmarkDataDir(process.cwd());
    singletonStore = new FileBenchmarkStore(baseDir);
  }
  return singletonStore;
}
