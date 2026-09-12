import { NextResponse } from 'next/server';
import { calculatePrashnaChart } from '@vedica/astrology-core';
import { evaluatePrashnaQuery } from '@vedica/query-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const question = body.question;
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid horary question is required.' },
        { status: 400 }
      );
    }

    const queryLocation = {
      latitude: parseFloat(body.latitude) || 28.6139,
      longitude: parseFloat(body.longitude) || 77.209,
      name: body.locationName || 'New Delhi, India',
      timezone: body.timezone || 'Asia/Kolkata',
    };

    const targetInstant = body.queryTime ? new Date(body.queryTime) : new Date();

    const prashnaChart = await calculatePrashnaChart(queryLocation, targetInstant, body.seedNumber);
    const result = evaluatePrashnaQuery(prashnaChart, question);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Prashna API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Prashna API Error' },
      { status: 500 }
    );
  }
}
