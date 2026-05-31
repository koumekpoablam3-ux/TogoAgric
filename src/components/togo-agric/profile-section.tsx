'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { tValue, Language } from '@/lib/i18n';
import { User, Mail, Phone, MapPin, Star, ShoppingBag, Heart, Edit3, Save, X, Camera, Shield, Star as StarIcon, Package } from 'lucide-react';

interface ProfileSectionProps {
  lang: Language;
}

export default function ProfileSection({ lang }: ProfileSectionProps) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBio, setEditBio] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setEditName(user?.name || '');
      setEditPhone(user?.phone || '');
      setEditBio(user?.bio || '');
      Promise.all([
        fetch('/api/notifications').then(r => r.json()),
        fetch('/api/favorites').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
      ]).then(([notifs, favs, ords]) => {
        setNotifications(Array.isArray(notifs) ? notifs.slice(0, 10) : []);
        setFavorites(Array.isArray(favs) ? favs : []);
        setOrders(Array.isArray(ords) ? ords.slice(0, 10) : []);
      }).catch(() => {});
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{tValue('login', lang)}</h2>
        <p className="text-gray-500 mb-4">Connectez-vous pour voir votre profil</p>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, name: editName, phone: editPhone, bio: editBio }),
      });
      const stored = localStorage.getItem('togoagric_user');
      if (stored) {
        const u = JSON.parse(stored);
        u.name = editName;
        u.phone = editPhone;
        u.bio = editBio;
        localStorage.setItem('togoagric_user', JSON.stringify(u));
      }
      setEditing(false);
    } catch {}
  };

  const roleLabels: Record<string, string> = {
    admin: tValue('admin', lang),
    farmer: tValue('farmer', lang),
    buyer: tValue('buyer', lang),
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-700 border-red-200',
    farmer: 'bg-green-100 text-green-700 border-green-200',
    buyer: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const avatarUrl = user?.id === 'admin1' ? '/admin-photo.png' : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{tValue('profile', lang)}</h1>

      {/* Profile card with photo */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Cover + Avatar */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 left-10 text-6xl">🌾</div>
              <div className="absolute top-4 right-20 text-5xl">🇹🇬</div>
              <div className="absolute bottom-2 left-1/2 text-4xl">🌱</div>
              <div className="absolute top-6 right-8 text-4xl"> mercato</div>
            </div>
          </div>
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || 'Admin'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              {isAdmin && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                  <Shield className="w-3.5 h-3.5 text-amber-900" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-14 px-6 pb-6">
          {/* Name + Role */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-3 py-1 rounded-full font-medium border ${roleColors[user?.role || 'farmer']}`}>
                  {roleLabels[user?.role || 'farmer']}
                </span>
                {isAdmin && (
                  <span className="text-xs px-3 py-1 rounded-full font-medium bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <Star className="w-3 h-3" /> Fondateur
                  </span>
                )}
              </div>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition border border-green-200">
                <Edit3 className="w-4 h-4" /> Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition">
                  <Save className="w-4 h-4" /> Sauvegarder
                </button>
                <button onClick={() => setEditing(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
                  <X className="w-4 h-4" /> Annuler
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          {editing ? (
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('phone', lang)}</label>
                <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('description', lang)}</label>
                <textarea value={editBio} onChange={e => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none h-20" />
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium">{user?.email}</p>
                </div>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{tValue('phone', lang)}</p>
                    <p className="text-gray-800 font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
              {user?.bio && (
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bio</p>
                    <p className="text-gray-800">{user.bio}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-xl font-bold text-blue-600">{notifications.filter(n => !n.read).length}</p>
              <p className="text-xs text-gray-500">Notifications</p>
            </div>
            <div className="text-center p-3 bg-pink-50 rounded-xl">
              <p className="text-xl font-bold text-pink-600">{favorites.length}</p>
              <p className="text-xs text-gray-500">Favoris</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-xl font-bold text-green-600">{isAdmin ? 'Admin' : 'User'}</p>
              <p className="text-xs text-gray-500">Statut</p>
            </div>
          </div>

          <div className="pt-4 border-t mt-4">
            <button onClick={logout}
              className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1.5">
              <X className="w-4 h-4" /> {tValue('logout', lang)}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">🔔 {tValue('notifications', lang)}</h2>
          <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">{notifications.filter(n => !n.read).length}</span>
        </div>
        <div className="divide-y max-h-64 overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-400">{tValue('noNotifications', lang)}</div>
          ) : (
            notifications.map((n: any) => (
              <div key={n.id} className={`px-4 py-3 ${n.read ? '' : 'bg-green-50 border-l-3 border-l-green-500'}`}>
                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                <p className="text-xs text-gray-500 mt-1">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mes commandes */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">📦 Mes commandes ({orders.length})</h2>
        </div>
        <div className="divide-y max-h-80 overflow-y-auto custom-scrollbar">
          {orders.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Aucune commande pour le moment</p>
              <p className="text-xs mt-1">Visitez la Marketplace pour passer commande</p>
            </div>
          ) : (
            orders.map((o: any) => {
              const statusColors: Record<string, string> = {
                en_attente: 'bg-amber-100 text-amber-700',
                acceptee: 'bg-green-100 text-green-700',
                livree: 'bg-blue-100 text-blue-700',
                annulee: 'bg-red-100 text-red-700',
              };
              const statusLabels: Record<string, string> = {
                en_attente: '⏳ En attente',
                acceptee: '✅ Acceptée',
                livree: '📦 Livrée',
                annulee: '❌ Annulée',
              };
              const pmLabels: Record<string, string> = {
                cash: '💵 Cash',
                't-money': '📱 T-Money',
                flooz: '📱 Flooz',
              };
              return (
                <div key={o.id} className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{o.product?.emoji || '📦'}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{o.title}</p>
                        <p className="text-xs text-gray-500">👤 {o.sellerName} • {o.quantity} • {pmLabels[o.paymentMethod] || o.paymentMethod}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[o.status] || 'bg-gray-100'}`}>{statusLabels[o.status] || o.status}</span>
                      {o.price > 0 && <p className="text-xs font-bold text-gray-700 mt-1">{o.price.toLocaleString()} FCFA</p>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Favorites */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">❤️ {tValue('favorites', lang)}</h2>
        </div>
        <div className="divide-y max-h-64 overflow-y-auto custom-scrollbar">
          {favorites.length === 0 ? (
            <div className="p-6 text-center text-gray-400">{tValue('noFavorites', lang)}</div>
          ) : (
            favorites.map((f: any) => (
              <div key={f.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50">
                <span className="text-2xl">{f.product?.emoji || '📦'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{f.product?.name || 'Produit'}</p>
                  <p className="text-xs text-gray-500">{f.product?.category || ''}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
