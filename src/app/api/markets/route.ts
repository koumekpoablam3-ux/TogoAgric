import { getDb, getInMemoryListings } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('regionId');

    let markets = [...db.Market];

    if (regionId && regionId !== 'all') {
      markets = markets.filter(m => m.regionId === regionId);
    }

    const memListings = getInMemoryListings();
    const result = markets.map(m => {
      const region = db.Region.find(r => r.id === m.regionId);
      return {
        ...m,
        regionName: region?.name || null,
        regionCapital: region?.capital || null,
        region: region ? { id: region.id, name: region.name, capital: region.capital } : null,
        priceCount: db.PriceRecord.filter(pr => pr.marketId === m.id).length,
        listingCount: db.Listing.filter(l => l.marketId === m.id).length + memListings.filter(l => l.marketId === m.id).length,
        _count: {
          prices: db.PriceRecord.filter(pr => pr.marketId === m.id).length,
          listings: db.Listing.filter(l => l.marketId === m.id).length + memListings.filter(l => l.marketId === m.id).length,
        },
      };
    });

    result.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Markets error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
