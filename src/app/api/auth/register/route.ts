import { getDb, getInMemoryUsers } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role, regionId, bio } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nom, email et mot de passe requis' }, { status: 400 });
    }

    // Check existing users
    const db = getDb();
    const existing = db.User.find(u => u.email === email);
    const memExisting = getInMemoryUsers().find(u => u.email === email);
    if (existing || memExisting) {
      return NextResponse.json({ error: 'Cet email est deja utilise' }, { status: 409 });
    }

    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const now = new Date().toISOString();

    const user = {
      id, name, email, password, phone: phone || null,
      role: role || 'farmer', regionId: regionId || null,
      avatar: null, bio: bio || null, rating: 0, createdAt: now, updatedAt: now,
    };

    getInMemoryUsers().push(user);
    return NextResponse.json({ id, name, email, phone, role, regionId, bio, createdAt: now }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: "Echec de l'inscription" }, { status: 500 });
  }
}
