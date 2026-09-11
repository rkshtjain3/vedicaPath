import crypto from 'crypto';
import path from 'path';
import { FileBenchmarkStore, computeInputFingerprint as computeCanonicalFingerprint, } from '@vedica/benchmark-store';
import { SHADBALA_JHORA_BENCHMARK_CASES } from './benchmark-cases.js';
import { ShadbalaBenchmarkRunner } from './runner.js';
export function computeInputFingerprint(benchmarkCase) {
    const { birthDetails, source } = benchmarkCase;
    const payload = [
        benchmarkCase.id,
        birthDetails.date,
        birthDetails.time,
        birthDetails.latitude,
        birthDetails.longitude,
        birthDetails.timezone,
        source.settings.ayanamsha,
        source.settings.zodiac,
    ].join('|');
    return crypto.createHash('sha256').update(payload).digest('hex').substring(0, 16);
}
export function computeReferenceHash(referenceValues) {
    const sortedStr = JSON.stringify(referenceValues, Object.keys(referenceValues).sort());
    return crypto.createHash('sha256').update(sortedStr).digest('hex').substring(0, 16);
}
let defaultStoreInstance = null;
export function getBenchmarkStore() {
    if (!defaultStoreInstance) {
        const cwd = process.cwd();
        const baseDir = cwd.endsWith('/validation') || cwd.endsWith('\\validation')
            ? path.join(cwd, 'benchmark-data')
            : path.join(cwd, 'validation', 'benchmark-data');
        defaultStoreInstance = new FileBenchmarkStore(baseDir);
    }
    return defaultStoreInstance;
}
function resolveDatasetPath() {
    const cwd = process.cwd();
    if (cwd.endsWith('/validation') || cwd.endsWith('\\validation')) {
        return path.join(cwd, 'benchmark-data', 'shadbala', 'shadbala-dataset.json');
    }
    return path.join(cwd, 'validation', 'benchmark-data', 'shadbala', 'shadbala-dataset.json');
}
export class ShadbalaBenchmarkStore {
    fileStore;
    constructor(baseDir) {
        const dir = baseDir || path.join(process.cwd(), 'validation', 'benchmark-data');
        this.fileStore = new FileBenchmarkStore(dir);
    }
    async getCases() {
        return this.fileStore.listCases('SHADBALA');
    }
    getStoredCaseData(caseId) {
        // Synchronous adapter wrapper over FileBenchmarkStore for legacy API compatibility
        try {
            const caseItem = this.getCaseSync(caseId);
            if (!caseItem)
                return undefined;
            const refHash = computeReferenceHash(caseItem.referenceValues || {});
            const fp = caseItem.inputFingerprint || computeCanonicalFingerprint(caseItem.inputSnapshot);
            return {
                caseId: caseItem.id,
                checklistConfirmed: Boolean(caseItem.metadata?.checklistConfirmed),
                referenceValues: caseItem.referenceValues,
                investigationCause: caseItem.metadata?.investigationCause,
                investigationNotes: caseItem.metadata?.investigationNotes,
                updatedAt: caseItem.updatedAt,
                fingerprint: fp,
                referenceHash: refHash,
            };
        }
        catch {
            return undefined;
        }
    }
    getCaseSync(caseId) {
        const caseDef = SHADBALA_JHORA_BENCHMARK_CASES.find((c) => c.id.toUpperCase() === caseId.toUpperCase());
        const datasetPath = resolveDatasetPath();
        const fs = require('fs');
        if (fs.existsSync(datasetPath)) {
            try {
                const content = fs.readFileSync(datasetPath, 'utf-8');
                const parsed = JSON.parse(content);
                const found = parsed.cases?.find((c) => c.id.toUpperCase() === caseId.toUpperCase());
                if (found)
                    return found;
            }
            catch { }
        }
        if (caseDef) {
            return {
                id: caseDef.id,
                category: 'SHADBALA',
                title: caseDef.description,
                description: caseDef.description,
                status: 'NOT_VALIDATED',
                calculationProfileVersion: 'shadbala-jhora-v1',
                inputSnapshot: {
                    birthDetails: caseDef.birthDetails,
                },
                inputFingerprint: computeInputFingerprint(caseDef),
                referenceSource: caseDef.source,
                metadata: {},
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                referenceValues: caseDef.expected || {},
            };
        }
        return undefined;
    }
    getAllStoredData() {
        const datasetPath = resolveDatasetPath();
        const fs = require('fs');
        if (!fs.existsSync(datasetPath))
            return {};
        const content = fs.readFileSync(datasetPath, 'utf-8');
        const parsed = JSON.parse(content);
        const res = {};
        for (const c of parsed.cases || []) {
            const refHash = computeReferenceHash(c.referenceValues || {});
            const fp = c.inputFingerprint || computeCanonicalFingerprint(c.inputSnapshot);
            res[c.id] = {
                caseId: c.id,
                checklistConfirmed: Boolean(c.metadata?.checklistConfirmed),
                referenceValues: c.referenceValues,
                investigationCause: c.metadata?.investigationCause,
                investigationNotes: c.metadata?.investigationNotes,
                updatedAt: c.updatedAt,
                fingerprint: fp,
                referenceHash: refHash,
            };
        }
        return res;
    }
    async saveReference(params) {
        const updatedCase = await this.fileStore.updateReference({
            caseId: params.caseId,
            checklistConfirmed: params.checklistConfirmed,
            referenceValues: params.referenceValues,
            investigationCause: params.investigationCause,
            investigationNotes: params.investigationNotes,
        });
        const refHash = computeReferenceHash(updatedCase.referenceValues || {});
        return {
            caseId: updatedCase.id,
            checklistConfirmed: Boolean(updatedCase.metadata?.checklistConfirmed),
            referenceValues: updatedCase.referenceValues,
            investigationCause: updatedCase.metadata?.investigationCause,
            investigationNotes: updatedCase.metadata?.investigationNotes,
            updatedAt: updatedCase.updatedAt,
            fingerprint: updatedCase.inputFingerprint,
            referenceHash: refHash,
        };
    }
    saveReferenceData(caseId, checklistConfirmed, referenceValues, investigationCause, investigationNotes) {
        // Legacy wrapper around saveReference
        const caseItem = this.getCaseSync(caseId);
        if (!caseItem) {
            throw new Error(`Case ${caseId} not found`);
        }
        const hasRefValues = Object.keys(referenceValues || {}).length > 0;
        const now = new Date().toISOString();
        const refHash = computeReferenceHash(referenceValues);
        const updatedCase = {
            ...caseItem,
            referenceValues,
            status: hasRefValues ? 'REFERENCE_ENTERED' : caseItem.status,
            updatedAt: now,
            metadata: {
                ...caseItem.metadata,
                checklistConfirmed,
                investigationCause,
                investigationNotes,
            },
        };
        const datasetPath = resolveDatasetPath();
        const fs = require('fs');
        let dataset = {
            schemaVersion: '1.0.0',
            datasetVersion: '1.0.0',
            category: 'SHADBALA',
            cases: [],
        };
        if (fs.existsSync(datasetPath)) {
            dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
        }
        const idx = dataset.cases.findIndex((c) => c.id.toUpperCase() === caseId.toUpperCase());
        if (idx !== -1) {
            dataset.cases[idx] = updatedCase;
        }
        else {
            dataset.cases.push(updatedCase);
        }
        const tempPath = `${datasetPath}.tmp`;
        fs.writeFileSync(tempPath, JSON.stringify(dataset, null, 2), 'utf-8');
        fs.renameSync(tempPath, datasetPath);
        return {
            caseId,
            checklistConfirmed,
            referenceValues,
            investigationCause,
            investigationNotes,
            updatedAt: now,
            fingerprint: caseItem.inputFingerprint,
            referenceHash: refHash,
        };
    }
    async evaluateCaseWithStore(caseId) {
        const caseDef = SHADBALA_JHORA_BENCHMARK_CASES.find((c) => c.id === caseId);
        if (!caseDef) {
            throw new Error(`Benchmark case ${caseId} not found`);
        }
        const stored = this.getStoredCaseData(caseId);
        const runner = new ShadbalaBenchmarkRunner();
        const evalCase = {
            ...caseDef,
            expected: stored?.referenceValues || {},
            validationStatus: stored?.checklistConfirmed && Object.keys(stored?.referenceValues || {}).length > 0
                ? 'PARTIALLY_VALIDATED'
                : 'NOT_VALIDATED',
        };
        const result = await runner.runBenchmarkCase(evalCase);
        const fingerprint = computeInputFingerprint(caseDef);
        const referenceHash = stored ? stored.referenceHash : 'EMPTY';
        return {
            benchmarkCase: caseDef,
            storedData: stored,
            comparisonResult: result,
            fingerprint,
            referenceHash,
        };
    }
    exportBenchmark() {
        return this.exportData();
    }
    exportData() {
        return {
            exportVersion: '1.0.0',
            timestamp: new Date().toISOString(),
            benchmarks: this.getAllStoredData(),
        };
    }
    importData(exportObj) {
        if (!exportObj || typeof exportObj !== 'object' || !exportObj.benchmarks) {
            throw new Error('Invalid export JSON structure');
        }
        let count = 0;
        for (const [caseId, item] of Object.entries(exportObj.benchmarks)) {
            if (item && item.referenceValues) {
                this.saveReferenceData(caseId, Boolean(item.checklistConfirmed), item.referenceValues, item.investigationCause, item.investigationNotes);
                count++;
            }
        }
        return { importedCount: count };
    }
}
//# sourceMappingURL=store.js.map