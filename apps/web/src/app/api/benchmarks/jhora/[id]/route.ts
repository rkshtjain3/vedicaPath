import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { runJHoraBenchmarkCase } from '@vedica/validation';

const JHORA_DIR = path.join(process.cwd(), '../../validation/benchmark-data/jhora/jhora-dataset');

function getFilePathForId(id: string): string | null {
  if (!fs.existsSync(JHORA_DIR)) return null;
  const files = fs.readdirSync(JHORA_DIR).filter((f) => f.endsWith('.json'));
  for (const f of files) {
    const fullPath = path.join(JHORA_DIR, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    const parsed = JSON.parse(content);
    if (parsed.id?.toLowerCase() === id.toLowerCase()) {
      return fullPath;
    }
  }
  return null;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const filePath = getFilePathForId(id);
    if (!filePath) {
      return NextResponse.json({ success: false, error: `JHora case ${id} not found.` }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const caseData = JSON.parse(content);
    return NextResponse.json({ success: true, case: caseData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Error reading case' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const filePath = getFilePathForId(id);
    if (!filePath) {
      return NextResponse.json({ success: false, error: `JHora case ${id} not found.` }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const caseData = JSON.parse(content);

    const result = await runJHoraBenchmarkCase(caseData);

    // Update status if tested
    caseData.status = result.status;
    fs.writeFileSync(filePath, JSON.stringify(caseData, null, 2), 'utf8');

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Error running benchmark' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const filePath = getFilePathForId(id);
    if (!filePath) {
      return NextResponse.json({ success: false, error: `JHora case ${id} not found.` }, { status: 404 });
    }

    const body = await req.json();
    const content = fs.readFileSync(filePath, 'utf8');
    const caseData = JSON.parse(content);

    if (body.referenceOutputs !== undefined) {
      caseData.referenceOutputs = body.referenceOutputs;
    }

    if (body.investigation !== undefined) {
      caseData.investigation = {
        ...caseData.investigation,
        ...body.investigation,
      };
    }

    if (body.source !== undefined) {
      caseData.source = {
        ...caseData.source,
        ...body.source,
      };
    }

    // Run verification to update status cleanly
    const runRes = await runJHoraBenchmarkCase(caseData);
    caseData.status = runRes.status;

    fs.writeFileSync(filePath, JSON.stringify(caseData, null, 2), 'utf8');

    return NextResponse.json({ success: true, case: caseData, runResult: runRes });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Error updating case' }, { status: 500 });
  }
}
