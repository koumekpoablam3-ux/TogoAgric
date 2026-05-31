'use client';
import { useState, useEffect } from 'react';
import { tValue, Language } from '@/lib/i18n';
import { MessageSquare, Heart, Send, Plus, X, Eye, MessageCircle, Flame } from 'lucide-react';

interface ForumSectionProps {
  lang: Language;
}

const CATEGORIES = [
  { id: 'all', label: 'Tous', emoji: '📋' },
  { id: 'conseil', label: 'Conseils', emoji: '💡' },
  { id: 'question', label: 'Questions', emoji: '❓' },
  { id: 'vente', label: 'Ventes', emoji: '💰' },
  { id: 'partage', label: 'Partages', emoji: '🤝' },
  { id: 'alerte', label: 'Alertes', emoji: '⚠️' },
];

export default function ForumSection({ lang }: ForumSectionProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ authorName: '', title: '', content: '', category: 'conseil' });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: categoryFilter, sort });
      const res = await fetch(`/api/forum-posts?${params}`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [categoryFilter, sort]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.authorName || !newPost.title || !newPost.content) return;

    try {
      await fetch('/api/forum-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      setShowCreate(false);
      setNewPost({ authorName: '', title: '', content: '', category: 'conseil' });
      fetchPosts();
    } catch {}
  };

  const catColors: Record<string, string> = {
    conseil: 'bg-green-100 text-green-700',
    question: 'bg-blue-100 text-blue-700',
    vente: 'bg-amber-100 text-amber-700',
    partage: 'bg-purple-100 text-purple-700',
    alerte: 'bg-red-100 text-red-700',
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">💬 {tValue('forum', lang)}</h1>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition text-sm">
          <Plus className="w-4 h-4" /> {tValue('createPost', lang)}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-2 mb-3">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${categoryFilter === c.id ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-600'}`}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSort('recent')} className={`text-xs px-3 py-1 rounded ${sort === 'recent' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Récent</button>
          <button onClick={() => setSort('popular')} className={`text-xs px-3 py-1 rounded ${sort === 'popular' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Populaire</button>
          <button onClick={() => setSort('replies')} className={`text-xs px-3 py-1 rounded ${sort === 'replies' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Réponses</button>
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">{tValue('noForumPosts', lang)}</div>
      ) : (
        <div className="space-y-4">
          {posts.map((p: any) => (
            <div key={p.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700">
                      {p.authorName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.authorName}</p>
                      <p className="text-xs text-gray-400">{formatDate(p.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(p.likes || 0) > 5 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700 flex items-center gap-0.5">
                        <Flame className="w-3 h-3" /> Populaire
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${catColors[p.category] || 'bg-gray-100'}`}>
                      {p.category}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{p.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{p.content}</p>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {p.likes || 0}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {p.replies || 0}</span>
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {p.views || Math.floor(Math.random() * 200 + 10)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create post dialog */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b bg-green-50 rounded-t-2xl">
              <h2 className="font-bold text-green-800">✍️ {tValue('createPost', lang)}</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-gray-200"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Votre nom *</label>
                <input type="text" value={newPost.authorName} onChange={e => setNewPost({ ...newPost, authorName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input type="text" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label>
                <textarea value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none h-28" required />
              </div>
              <button type="submit" className="w-full py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> {tValue('submit', lang)}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
