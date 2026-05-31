import { getDb, getInMemoryFavorites } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const allFavorites = [...db.Favorite, ...getInMemoryFavorites()];

    const result = allFavorites.map(f => {
      const product = db.Product.find(p => p.id === f.productId);
      return {
        ...f,
        productName: product?.name || '',
        productEmoji: product?.emoji || '',
        productUnit: product?.unit || '',
        productCategory: product?.category || '',
        product: product ? { id: product.id, name: product.name, emoji: product.emoji, unit: product.unit, category: product.category } : null,
      };
    });

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(result);
  } catch (error) {
    console.error('Favorites error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId, userId } = await request.json();

    if (!productId || !userId) {
      return NextResponse.json({ error: 'Produit et utilisateur requis' }, { status: 400 });
    }

    // Check if already favorited
    const allFavorites = [...getDb().Favorite, ...getInMemoryFavorites()];
    const existing = allFavorites.find(f => f.userId === userId && f.productId === productId);

    if (existing) {
      // Remove from memory
      const memFavs = getInMemoryFavorites();
      const idx = memFavs.findIndex(f => f.userId === userId && f.productId === productId);
      if (idx >= 0) memFavs.splice(idx, 1);
      return NextResponse.json({ favorited: false });
    } else {
      const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const now = new Date().toISOString();
      getInMemoryFavorites().push({ id, userId, productId, createdAt: now });
      return NextResponse.json({ favorited: true });
    }
  } catch (error) {
    console.error('Favorite toggle error:', error);
    return NextResponse.json({ error: 'Echec' }, { status: 500 });
  }
}
