import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const regions = db.Region.map(r => ({
      ...r,
      marketCount: db.Market.filter(m => m.regionId === r.id).length,
    }));
    regions.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json(regions);
  } catch (error) {
    console.error('Regions error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
