import { getDb, getInMemoryListings } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let products = [...db.Product];

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(s) ||
        (p.nameEwe && p.nameEwe.toLowerCase().includes(s)) ||
        (p.nameKabye && p.nameKabye.toLowerCase().includes(s))
      );
    }

    // Add computed fields
    const memListings = getInMemoryListings();
    const result = products.map(p => ({
      ...p,
      priceCount: db.PriceRecord.filter(pr => pr.productId === p.id).length,
      listingCount: db.Listing.filter(l => l.productId === p.id).length + memListings.filter(l => l.productId === p.id).length,
    }));

    result.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json(result);
  } catch (error) {
    console.error('Products error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
