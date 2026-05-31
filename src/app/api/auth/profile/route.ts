import { getDb, getInMemoryUsers } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    // Search in both static data and in-memory users
    let user = db.User.find(u => u.id === userId) || getInMemoryUsers().find(u => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouve' }, { status: 404 });
    }

    const { password: _pwd, ...rest } = user;
    const region = db.Region.find(r => r.id === user.regionId);
    const allListings = [...db.Listing, ...getInMemoryListings()];
    const allAlerts = [...db.PriceAlert, ...getInMemoryAlerts()];

    return NextResponse.json({
      ...rest,
      region: user.regionId && region ? { id: region.id, name: region.name, capital: region.capital } : null,
      _count: {
        listings: allListings.filter(l => l.sellerId === user.id).length,
        alerts: allAlerts.filter(a => a.userId === user.id).length,
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ error: 'Echec de la recuperation du profil' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, phone, bio, regionId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    // Find user in memory
    const memUsers = getInMemoryUsers();
    const user = memUsers.find(u => u.id === userId) || getDb().User.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouve' }, { status: 404 });
    }

    // Update in memory
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (regionId !== undefined) user.regionId = regionId || null;
    user.updatedAt = new Date().toISOString();

    // If not in memory yet, add it
    if (!memUsers.find(u => u.id === userId)) {
      memUsers.push(user);
    }

    const { password: _pwd, ...rest } = user;
    return NextResponse.json(rest);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Echec de la mise a jour du profil' }, { status: 500 });
  }
}
