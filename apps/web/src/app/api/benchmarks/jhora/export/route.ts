import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const JHORA_DIR = path.join(process.cwd(), '../../validation/benchmark-data/jhora/jhora-dataset');

export async function GET() {
  try {
    if (!fs.existsSync(JHORA_DIR)) {
      return NextResponse.json({
        schemaVersion: '1.0.0',
        exportedAt: new Date().toISOString(),
        cases: [],
      });
    }

    const files = fs.readdirSync(JHORA_DIR).filter((f) => f.endsWith('.json'));
    const cases = files.map((file) => {
      const content = fs.readFileSync(path.join(JHORA_DIR, file), 'utf8');
      return JSON.parse(content);
    });

    cases.sort((a, b) => a.id.localeCompare(b.id));

    return NextResponse.json({
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      count: cases.length,
      cases,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Export failed' }, { status: 500 });
  }
}
