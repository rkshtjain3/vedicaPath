import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { SwissEphemerisEngine } from '@vedica/astrology-core';
import { analyzeChart } from '@vedica/analysis-engine';
import { calculateDivisionalChart } from '@vedica/divisional-chart-engine';
import { evaluateShadbalaEngine, PERSONAL_SHADBALA_V1 } from '@vedica/shadbala-engine';
import { SHADBALA_JHORA_BENCHMARK_CASES } from '../benchmark-cases.js';
import { ShadbalaBenchmarkRunner } from '../runner.js';
const DATA_DIR = path.join(process.cwd(), 'validation', 'src', 'shadbala-jhora', 'data');
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
export class FileBenchmarkStore {
    data = {};
    engine;
    runner;
    constructor() {
        this.engine = new SwissEphemerisEngine();
        this.runner = new ShadbalaBenchmarkRunner();
        this.load();
    }
    ensureDir() {
        try {
            if (!fs.existsSync(DATA_DIR)) {
                fs.mkdirSync(DATA_DIR, { recursive: true });
            }
        }
        catch {
            // Ignore in read-only environments
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
    async getCases() {
        const summaries = [];
        for (const c of SHADBALA_JHORA_BENCHMARK_CASES) {
            const stored = this.data[c.id];
            const fingerprint = computeInputFingerprint(c);
            let status = 'NOT VALIDATED';
            if (stored && stored.referenceValues && Object.keys(stored.referenceValues).length > 0) {
                const evalCase = {
                    ...c,
                    expected: stored.referenceValues,
                    validationStatus: 'PARTIALLY_VALIDATED',
                };
                const res = await this.runner.runBenchmarkCase(evalCase);
                if (res.overallResult === 'FAIL') {
                    status = 'MISMATCH FOUND';
                }
                else if (res.components.length >= 42) {
                    status = 'VALIDATED';
                }
                else {
                    status = 'PARTIALLY VALIDATED';
                }
            }
            summaries.push({
                id: c.id,
                description: c.description,
                location: c.birthDetails.location,
                date: c.birthDetails.date,
                time: c.birthDetails.time,
                status,
                fingerprint,
                hasStoredData: Boolean(stored),
            });
        }
        return summaries;
    }
    async getCase(caseId) {
        const caseDef = SHADBALA_JHORA_BENCHMARK_CASES.find((c) => c.id === caseId);
        if (!caseDef)
            return null;
        const storedData = this.data[caseId] || null;
        const fingerprint = computeInputFingerprint(caseDef);
        const chartInput = {
            birthTime: {
                dateOfBirth: caseDef.birthDetails.date,
                timeOfBirth: caseDef.birthDetails.time,
                timezone: caseDef.birthDetails.timezone,
            },
            location: {
                name: caseDef.birthDetails.location,
                latitude: caseDef.birthDetails.latitude,
                longitude: caseDef.birthDetails.longitude,
                timezone: caseDef.birthDetails.timezone,
            },
        };
        const chart = await this.engine.calculateBirthChart(chartInput);
        const analysis = analyzeChart(chart);
        const d9Chart = calculateDivisionalChart(chart, 'D9');
        const actualShadbala = evaluateShadbalaEngine({ chart, analysis, d9Chart }, PERSONAL_SHADBALA_V1);
        return {
            benchmarkCase: caseDef,
            storedData,
            actualShadbala,
            fingerprint,
        };
    }
    async saveReference(input) {
        const { caseId, checklistConfirmed, referenceValues, investigationCause, investigationNotes } = input;
        const caseDef = SHADBALA_JHORA_BENCHMARK_CASES.find((c) => c.id === caseId);
        const fingerprint = caseDef ? computeInputFingerprint(caseDef) : 'unknown';
        const referenceHash = computeReferenceHash(referenceValues);
        const record = {
            caseId,
            checklistConfirmed: Boolean(checklistConfirmed),
            referenceValues: referenceValues || {},
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
    async getResults(caseId) {
        const caseDef = SHADBALA_JHORA_BENCHMARK_CASES.find((c) => c.id === caseId);
        if (!caseDef)
            return null;
        const stored = this.data[caseId];
        const evalCase = {
            ...caseDef,
            expected: stored?.referenceValues || {},
            validationStatus: stored?.checklistConfirmed && Object.keys(stored?.referenceValues || {}).length > 0
                ? 'PARTIALLY_VALIDATED'
                : 'NOT_VALIDATED',
        };
        const result = await this.runner.runBenchmarkCase(evalCase);
        const fingerprint = computeInputFingerprint(caseDef);
        const referenceHash = stored ? stored.referenceHash : 'EMPTY';
        return {
            benchmarkCase: caseDef,
            storedData: stored || null,
            comparisonResult: result,
            fingerprint,
            referenceHash,
        };
    }
    async exportBenchmark() {
        return {
            exportVersion: '1.0.0',
            timestamp: new Date().toISOString(),
            benchmarks: this.data,
        };
    }
    async importBenchmark(exportObj) {
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
//# sourceMappingURL=file-benchmark-store.js.map