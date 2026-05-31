import { getDb, getInMemoryListings, getInMemoryOrders } from '@/lib/db';
import { NextResponse } from 'next/server';

// =============================================
// Orders API — Commandes sur TogoAgric
// Acheteur passe commande → vendeur reçoit notification
// Paiement via T-Money / Flooz / Cash
// =============================================

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');
    const sellerName = searchParams.get('sellerName');
    const status = searchParams.get('status');

    let orders = [...getInMemoryOrders()];

    if (buyerId) {
      orders = orders.filter(o => o.buyerId === buyerId);
    }
    if (sellerName) {
      orders = orders.filter(o => o.sellerName === sellerName);
    }
    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    // Enrichir avec les données produit
    const result = orders.map(o => {
      const product = db.Product.find(p => p.id === o.productId);
      const region = db.Region.find(r => r.id === o.regionId);
      return {
        ...o,
        product: product ? { id: product.id, name: product.name, emoji: product.emoji, unit: product.unit } : null,
        region: region ? { id: region.id, name: region.name } : null,
      };
    });

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(result);
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const {
      listingId, productId, buyerId, buyerName, buyerPhone,
      sellerName, sellerPhone, title, quantity, price,
      paymentMethod, regionId, message
    } = body;

    if (!listingId || !productId || !buyerName || !sellerName) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const id = 'ord_' + Math.random().toString(36).substring(2, 12);
    const now = new Date().toISOString();

    const order = {
      id, listingId, productId, buyerId: buyerId || 'guest',
      buyerName, buyerPhone: buyerPhone || null,
      sellerName, sellerPhone: sellerPhone || null,
      title: title || '', quantity: quantity || '', price: price ? parseFloat(price) : 0,
      paymentMethod: paymentMethod || 'cash',
      regionId: regionId || null,
      message: message || null,
      status: 'en_attente',
      createdAt: now, updatedAt: now,
    };

    getInMemoryOrders().push(order);

    return NextResponse.json({
      success: true,
      id, status: order.status,
      message: `Commande #${id.substring(0, 8)} envoyée à ${sellerName} !`
    }, { status: 201 });
  } catch (error) {
    console.error('Order create error:', error);
    return NextResponse.json({ error: 'Erreur de commande' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const orders = getInMemoryOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    return NextResponse.json({ success: true, id: order.id, status: order.status });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: 'Erreur de mise à jour' }, { status: 500 });
  }
}
