import { NextResponse } from 'next/server';
import { LocationEngine } from '@vedica/location-engine';

const engine = new LocationEngine();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  try {
    const countries = await engine.searchCountries(q);
    return NextResponse.json({ countries });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to search countries' },
      { status: 500 }
    );
  }
}
