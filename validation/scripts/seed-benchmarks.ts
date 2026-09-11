import fs from 'fs';
import path from 'path';
import { BenchmarkCase, BenchmarkCategory } from '@vedica/benchmark-store';
import { computeInputFingerprint } from '@vedica/benchmark-store';

const DATASET_PATH = path.resolve(process.cwd(), 'benchmark-data', 'cross-engine-dataset.json');

const caseDefinitions: Partial<BenchmarkCase>[] = [
  { id: 'CASE-001', category: 'NORMAL_INDIAN', title: 'Standard Indian Birth', description: 'Typical birth in New Delhi' },
  { id: 'CASE-002', category: 'MIDNIGHT_BIRTH', title: 'Exact Midnight Birth', description: 'Birth exactly at 00:00:00 to test date boundaries' },
  { id: 'CASE-003', category: 'LAGNA_BOUNDARY', title: 'Lagna Sandhi', description: 'Lagna exactly at the border of two signs' },
  { id: 'CASE-004', category: 'NAKSHATRA_BOUNDARY', title: 'Nakshatra Gandanta', description: 'Moon at exact Nakshatra junction' },
  { id: 'CASE-005', category: 'DATE_BOUNDARY', title: 'Leap Year Date', description: 'Birth on Feb 29' },
  { id: 'CASE-006', category: 'DST_AMBIGUOUS', title: 'DST Ambiguous Hour', description: 'Fall backward DST hour' },
  { id: 'CASE-007', category: 'DST_NON_EXISTENT', title: 'DST Non-existent Hour', description: 'Spring forward DST hour' },
  { id: 'CASE-008', category: 'FOREIGN_LOCATION', title: 'New York Birth', description: 'Western hemisphere birth' },
  { id: 'CASE-009', category: 'FOREIGN_LOCATION', title: 'Sydney Birth', description: 'Southern hemisphere birth' },
  { id: 'CASE-010', category: 'HIGH_LATITUDE', title: 'High Latitude Birth', description: 'Oslo birth, testing house systems' },
  { id: 'CASE-011', category: 'HISTORICAL', title: 'Historical Birth (pre-1900)', description: 'Testing ephemeris accuracy for older dates' },
  { id: 'CASE-012', category: 'EXALTATION_BOUNDARY', title: 'Exaltation Degree Entry', description: 'Planet just entering exaltation degree' },
  { id: 'CASE-013', category: 'EXALTATION_BOUNDARY', title: 'Exaltation Degree Exit', description: 'Planet just exiting exaltation degree' },
  { id: 'CASE-014', category: 'DEBILITATION_BOUNDARY', title: 'Debilitation Exact', description: 'Planet exactly on debilitation degree' },
  { id: 'CASE-015', category: 'DIVISIONAL_BOUNDARY', title: 'Navamsa Boundary', description: 'Planet changing Navamsa by 0.01 degree' }
];

const mockInput = {
  birthDate: '1990-01-01',
  birthTime: '12:00:00',
  timezone: 'Asia/Kolkata',
  utcInstant: '1990-01-01T06:30:00Z',
  latitude: 28.6139,
  longitude: 77.2090,
  locationName: 'New Delhi, India',
  calculationProfileVersion: 'v1'
};

const inputFingerprint = computeInputFingerprint(mockInput);

const dataset = {
  schemaVersion: "1.0.0",
  datasetVersion: "1.0.0",
  category: "ASTROLOGY" as BenchmarkCategory,
  cases: caseDefinitions.map((def) => ({
    ...def,
    status: 'NOT_VALIDATED',
    calculationProfileVersion: 'v1',
    referenceSource: { software: 'JHora', version: '8.0' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inputSnapshot: mockInput,
    inputFingerprint,
    referenceValues: {}
  }))
};

if (!fs.existsSync(path.dirname(DATASET_PATH))) {
  fs.mkdirSync(path.dirname(DATASET_PATH), { recursive: true });
}

fs.writeFileSync(DATASET_PATH, JSON.stringify(dataset, null, 2));
console.log(`Successfully seeded ${caseDefinitions.length} benchmark cases to ${DATASET_PATH}`);
