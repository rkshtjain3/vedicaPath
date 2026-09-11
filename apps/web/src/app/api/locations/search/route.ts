import { NextResponse } from 'next/server';
import { LocationEngine } from '@vedica/location-engine';

const engine = new LocationEngine();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const country = searchParams.get('country') || undefined;

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await engine.searchCities(q, country);
    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to search cities' },
      { status: 500 }
    );
  }
}
