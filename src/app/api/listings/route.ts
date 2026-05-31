import { getDb, getInMemoryListings } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const regionId = searchParams.get('regionId');
    const search = searchParams.get('search');

    let listings = [...db.Listing, ...getInMemoryListings()].filter(l => l.status === 'active');

    if (type && type !== 'all') {
      listings = listings.filter(l => l.type === type);
    }
    if (regionId && regionId !== 'all') {
      listings = listings.filter(l => l.regionId === regionId);
    }
    if (search) {
      const s = search.toLowerCase();
      listings = listings.filter(l =>
        (l.title && l.title.toLowerCase().includes(s)) ||
        (l.description && l.description.toLowerCase().includes(s)) ||
        (l.sellerName && l.sellerName.toLowerCase().includes(s))
      );
    }

    listings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const result = listings.map(l => {
      const product = db.Product.find(p => p.id === l.productId);
      const region = db.Region.find(r => r.id === l.regionId);
      const market = db.Market.find(m => m.id === l.marketId);
      return {
        ...l,
        productName: product?.name || '',
        productEmoji: product?.emoji || '',
        productUnit: product?.unit || '',
        regionName: region?.name || '',
        marketName: market?.name || '',
        product: product ? { id: product.id, name: product.name, emoji: product.emoji, unit: product.unit } : null,
        region: l.regionId ? { id: l.regionId, name: region?.name || '' } : null,
        market: l.marketId ? { id: l.marketId, name: market?.name || '' } : null,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Listings error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { title, description, type, productId, sellerName, sellerPhone, regionId, marketId, price, quantity, paymentMethod } = body;

    if (!title || !type || !productId || !sellerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const now = new Date().toISOString();

    const listing = {
      id, title, description: description || null, type, productId, sellerName,
      sellerPhone: sellerPhone || null, regionId: regionId || null, marketId: marketId || null,
      price: price ? parseFloat(price) : null, quantity: quantity || null,
      paymentMethod: paymentMethod || null, status: 'active', createdAt: now, updatedAt: now,
    };

    getInMemoryListings().push(listing);
    return NextResponse.json({ id, title, type, productId, sellerName, createdAt: now }, { status: 201 });
  } catch (error) {
    console.error('Listing create error:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
