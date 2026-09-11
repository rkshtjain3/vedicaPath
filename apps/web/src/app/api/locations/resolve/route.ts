import { NextResponse } from 'next/server';
import { LocationEngine } from '@vedica/location-engine';

const engine = new LocationEngine();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Location ID parameter (id) is required' }, { status: 400 });
  }

  try {
    const location = await engine.resolveLocation(id);
    return NextResponse.json({ location });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to resolve location' },
      { status: 500 }
    );
  }
}
