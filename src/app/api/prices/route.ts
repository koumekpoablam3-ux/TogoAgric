import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('regionId');
    const productId = searchParams.get('productId');
    const marketId = searchParams.get('marketId');

    let prices = [...db.PriceRecord];

    if (regionId && regionId !== 'all') {
      const marketIds = db.Market.filter(m => m.regionId === regionId).map(m => m.id);
      prices = prices.filter(pr => marketIds.includes(pr.marketId));
    }
    if (productId && productId !== 'all') {
      prices = prices.filter(pr => pr.productId === productId);
    }
    if (marketId && marketId !== 'all') {
      prices = prices.filter(pr => pr.marketId === marketId);
    }

    // Sort by date descending
    prices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    prices = prices.slice(0, 300);

    // Group by product+market, keep latest
    const grouped = new Map<string, any[]>();
    for (const p of prices) {
      const key = `${p.productId}-${p.marketId}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(p);
    }

    const result: any[] = [];
    for (const [key, group] of grouped) {
      const latest = group[0];
      const prev = group[1];
      let variation = 0;
      if (prev) {
        variation = Math.round(((latest.price - prev.price) / prev.price) * 1000) / 10;
      }

      const product = db.Product.find(p => p.id === latest.productId);
      const market = db.Market.find(m => m.id === latest.marketId);
      const region = market ? db.Region.find(r => r.id === market.regionId) : null;

      result.push({
        ...latest,
        productName: product?.name || '',
        productEmoji: product?.emoji || '',
        productUnit: product?.unit || '',
        marketName: market?.name || '',
        marketRegionId: market?.regionId || '',
        regionName: region?.name || '',
        product: {
          id: latest.productId,
          name: product?.name || '',
          emoji: product?.emoji || '',
          unit: product?.unit || '',
        },
        market: {
          id: latest.marketId,
          name: market?.name || '',
          regionId: market?.regionId || '',
          region: region ? { name: region.name } : null,
        },
        variation,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Prices error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
