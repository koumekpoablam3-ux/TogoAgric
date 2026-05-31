import { getDb, getInMemoryAlerts } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const allAlerts = [...db.PriceAlert, ...getInMemoryAlerts()].filter(a => a.active);

    const result = allAlerts.map(a => {
      const product = db.Product.find(p => p.id === a.productId);
      return {
        ...a,
        productName: product?.name || '',
        productEmoji: product?.emoji || '',
        productUnit: product?.unit || '',
        product: product ? { id: product.id, name: product.name, emoji: product.emoji, unit: product.unit } : null,
      };
    });

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(result);
  } catch (error) {
    console.error('Alerts error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, targetPrice, direction } = body;

    if (!productId || !targetPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const now = new Date().toISOString();

    const alert = {
      id, productId, targetPrice: parseFloat(targetPrice),
      direction: direction || 'below', active: true, triggered: false, createdAt: now,
    };

    getInMemoryAlerts().push(alert);
    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error('Alert create error:', error);
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
  }
}
