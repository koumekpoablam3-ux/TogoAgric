import { getDb, getInMemoryForumPosts } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'recent';

    let posts = [...db.ForumPost, ...getInMemoryForumPosts()];

    if (category !== 'all') {
      posts = posts.filter(p => p.category === category);
    }

    if (sort === 'popular') {
      posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sort === 'replies') {
      posts.sort((a, b) => (b.replies || 0) - (a.replies || 0));
    } else {
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json(posts.slice(0, 50));
  } catch (error) {
    console.error('Forum posts error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { authorName, title, content, category, regionId } = body;

    if (!authorName || !title || !content) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const now = new Date().toISOString();

    const post = {
      id, authorName, title, content,
      category: category || 'conseil', regionId: regionId || null,
      likes: 0, replies: 0, createdAt: now, updatedAt: now,
    };

    getInMemoryForumPosts().push(post);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Forum post create error:', error);
    return NextResponse.json({ error: 'Echec de la creation du post' }, { status: 500 });
  }
}
