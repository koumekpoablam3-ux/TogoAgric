import { getDb, getInMemoryNotifications } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = getDb();
    const allNotifications = [...db.Notification, ...getInMemoryNotifications()];
    allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(allNotifications.slice(0, 50));
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      // Mark all as read in memory
      for (const n of getInMemoryNotifications()) {
        n.read = 1;
      }
      for (const n of getDb().Notification) {
        n.read = 1;
      }
    } else if (notificationId) {
      const n = getInMemoryNotifications().find(x => x.id === notificationId) ||
                getDb().Notification.find(x => x.id === notificationId);
      if (n) n.read = 1;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification update error:', error);
    return NextResponse.json({ error: 'Echec de la mise a jour' }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    const db = getDb();
    const allNotifications = [...db.Notification, ...getInMemoryNotifications()];
    const count = allNotifications.filter(n => n.read === 0 || n.read === false).length;
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Notification count error:', error);
    return NextResponse.json({ count: 0 });
  }
}
