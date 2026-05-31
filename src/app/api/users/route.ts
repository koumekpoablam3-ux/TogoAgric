import { getDb, getInMemoryUsers, getInMemoryListings, getInMemoryAlerts } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const allUsers = [...db.User, ...getInMemoryUsers()];
    const allListings = [...db.Listing, ...getInMemoryListings()];
    const allAlerts = [...db.PriceAlert, ...getInMemoryAlerts()];

    const result = allUsers.map(u => {
      const { password: _pwd, ...rest } = u;
      const region = db.Region.find(r => r.id === u.regionId);
      return {
        ...rest,
        region: u.regionId && region ? { id: region.id, name: region.name, capital: region.capital } : null,
        _count: {
          listings: allListings.filter(l => l.sellerId === u.id).length,
          alerts: allAlerts.filter(a => a.userId === u.id).length,
        },
      };
    });

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(result);
  } catch (error) {
    console.error('Users error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, role: newRole } = body;

    if (!userId || !newRole) {
      return NextResponse.json({ error: 'Donnees manquantes' }, { status: 400 });
    }

    // Find and update user
    const memUsers = getInMemoryUsers();
    const user = memUsers.find(u => u.id === userId) || getDb().User.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouve' }, { status: 404 });
    }

    user.role = newRole;
    user.updatedAt = new Date().toISOString();

    if (!memUsers.find(u => u.id === userId)) {
      memUsers.push(user);
    }

    const { password: _pwd, ...rest } = user;
    return NextResponse.json(rest);
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ error: 'Echec de la mise a jour' }, { status: 500 });
  }
}
