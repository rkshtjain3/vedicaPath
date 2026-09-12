import { NextResponse } from 'next/server';
import { SwissEphemerisEngine, PERSONAL_VEDIC_V1 } from '@vedica/astrology-core';
import { evaluateCompatibility } from '@vedica/compatibility-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const partnerAInput = body.partnerA;
    const partnerBInput = body.partnerB;

    if (!partnerAInput || !partnerBInput) {
      return NextResponse.json(
        { success: false, error: 'Both partnerA and partnerB details are required.' },
        { status: 400 }
      );
    }

    const engine = new SwissEphemerisEngine();

    const chartA = await engine.calculateBirthChart(
      {
        birthTime: {
          dateOfBirth: partnerAInput.dateOfBirth || '1996-09-23',
          timeOfBirth: partnerAInput.timeOfBirth || '23:00:00',
          timezone: partnerAInput.timezone || 'Asia/Kolkata',
        },
        location: {
          latitude: parseFloat(partnerAInput.latitude) || 29.38747,
          longitude: parseFloat(partnerAInput.longitude) || 76.96825,
          name: partnerAInput.locationName || 'Panipat, Haryana, India',
          timezone: partnerAInput.timezone || 'Asia/Kolkata',
        },
      },
      PERSONAL_VEDIC_V1
    );

    const chartB = await engine.calculateBirthChart(
      {
        birthTime: {
          dateOfBirth: partnerBInput.dateOfBirth || '1998-05-15',
          timeOfBirth: partnerBInput.timeOfBirth || '10:30:00',
          timezone: partnerBInput.timezone || 'Asia/Kolkata',
        },
        location: {
          latitude: parseFloat(partnerBInput.latitude) || 28.6139,
          longitude: parseFloat(partnerBInput.longitude) || 77.209,
          name: partnerBInput.locationName || 'New Delhi, India',
          timezone: partnerBInput.timezone || 'Asia/Kolkata',
        },
      },
      PERSONAL_VEDIC_V1
    );

    const compatibility = evaluateCompatibility(
      chartA,
      chartB,
      partnerAInput.name || partnerAInput.fullName || 'Partner A',
      partnerBInput.name || partnerBInput.fullName || 'Partner B'
    );

    return NextResponse.json({
      success: true,
      data: compatibility,
    });
  } catch (error: any) {
    console.error('Compatibility API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Compatibility API Error' },
      { status: 500 }
    );
  }
}
