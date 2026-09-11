import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const JHORA_DIR = path.join(process.cwd(), '../../validation/benchmark-data/jhora/jhora-dataset');

export async function POST(req: Request) {
  try {
    const dataset = await req.json();
    if (!dataset || !Array.isArray(dataset.cases)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid import format. Expected object containing cases array.',
      }, { status: 400 });
    }

    if (!fs.existsSync(JHORA_DIR)) {
      fs.mkdirSync(JHORA_DIR, { recursive: true });
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const c of dataset.cases) {
      if (!c.id || !c.input || !c.input.birthDate || !c.input.birthTime) {
        skipped++;
        errors.push(`Skipped invalid case: ${c.id || 'missing ID'}`);
        continue;
      }

      const filename = `${c.id.toLowerCase().replace(/[^a-z0-9-]/g, '')}.json`;
      const targetPath = path.join(JHORA_DIR, filename);

      if (fs.existsSync(targetPath)) {
        updated++;
      } else {
        created++;
      }

      fs.writeFileSync(targetPath, JSON.stringify(c, null, 2), 'utf8');
    }

    return NextResponse.json({
      success: true,
      created,
      updated,
      skipped,
      errors,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Import failed' }, { status: 500 });
  }
}
