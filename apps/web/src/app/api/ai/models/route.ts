import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || 'http://127.0.0.1:11434';

export async function GET() {
  try {
    const res = await fetch(`${OLLAMA_ENDPOINT}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(2000),
    });

    if (!res.ok) {
      return NextResponse.json({
        connected: false,
        models: [],
        endpoint: OLLAMA_ENDPOINT,
        message: `Ollama returned status ${res.status}`,
      });
    }

    const data = await res.json();
    const models = (data.models || []).map((m: any) => ({
      name: m.name,
      size: m.size,
      modifiedAt: m.modified_at,
      details: m.details,
    }));

    return NextResponse.json({
      connected: true,
      models,
      endpoint: OLLAMA_ENDPOINT,
    });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      models: [],
      endpoint: OLLAMA_ENDPOINT,
      message: 'Local Ollama is not reachable on port 11434',
    });
  }
}
