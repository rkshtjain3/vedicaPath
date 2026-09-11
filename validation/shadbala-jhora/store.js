import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { SHADBALA_JHORA_BENCHMARK_CASES } from './benchmark-cases.js';
import { ShadbalaBenchmarkRunner } from './runner.js';
const DATA_DIR = path.join(process.cwd(), 'validation', 'shadbala-jhora', 'data');
const DATA_FILE = path.join(DATA_DIR, 'benchmark-store.json');
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
export class ShadbalaBenchmarkStore {
    data = {};
    constructor() {
        this.load();
    }
    ensureDir() {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
    }
    load() {
        try {
            this.ensureDir();
            if (fs.existsSync(DATA_FILE)) {
                const raw = fs.readFileSync(DATA_FILE, 'utf-8');
                this.data = JSON.parse(raw);
            }
        }
        catch {
            this.data = {};
        }
    }
    save() {
        try {
            this.ensureDir();
            fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
        }
        catch (err) {
            console.error('Failed to persist benchmark data:', err);
        }
    }
    getStoredCaseData(caseId) {
        return this.data[caseId];
    }
    getAllStoredData() {
        return this.data;
    }
    saveReferenceData(caseId, checklistConfirmed, referenceValues, investigationCause, investigationNotes) {
        const caseDef = SHADBALA_JHORA_BENCHMARK_CASES.find((c) => c.id === caseId);
        const fingerprint = caseDef ? computeInputFingerprint(caseDef) : 'unknown';
        const referenceHash = computeReferenceHash(referenceValues);
        const record = {
            caseId,
            checklistConfirmed,
            referenceValues,
            investigationCause,
            investigationNotes,
            updatedAt: new Date().toISOString(),
            fingerprint,
            referenceHash,
        };
        this.data[caseId] = record;
        this.save();
        return record;
    }
    async evaluateCaseWithStore(caseId) {
        const caseDef = SHADBALA_JHORA_BENCHMARK_CASES.find((c) => c.id === caseId);
        if (!caseDef) {
            throw new Error(`Benchmark case ${caseId} not found`);
        }
        const stored = this.data[caseId];
        const runner = new ShadbalaBenchmarkRunner();
        // Construct evaluation case object with stored reference data
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
    exportData() {
        return {
            exportVersion: '1.0.0',
            timestamp: new Date().toISOString(),
            benchmarks: this.data,
        };
    }
    importData(exportObj) {
        if (!exportObj || typeof exportObj !== 'object' || !exportObj.benchmarks) {
            throw new Error('Invalid export JSON structure');
        }
        let count = 0;
        for (const [caseId, item] of Object.entries(exportObj.benchmarks)) {
            if (item && item.referenceValues) {
                this.data[caseId] = {
                    caseId,
                    checklistConfirmed: Boolean(item.checklistConfirmed),
                    referenceValues: item.referenceValues,
                    investigationCause: item.investigationCause,
                    investigationNotes: item.investigationNotes,
                    updatedAt: item.updatedAt || new Date().toISOString(),
                    fingerprint: item.fingerprint || 'imported',
                    referenceHash: computeReferenceHash(item.referenceValues),
                };
                count++;
            }
        }
        this.save();
        return { importedCount: count };
    }
}
//# sourceMappingURL=store.js.map