'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { tValue, Language } from '@/lib/i18n';
import { BarChart3, Users, Store, FileText, ShoppingCart, Bell, TrendingUp, Activity, DollarSign, Leaf, Shield } from 'lucide-react';

interface DashboardSectionProps {
  lang: Language;
}

export default function DashboardSection({ lang }: DashboardSectionProps) {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    users: 0, products: 0, markets: 0, regions: 0,
    listings: 0, prices: 0, alerts: 0, forumPosts: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/users').then(r => r.json()).catch(() => []),
      fetch('/api/listings').then(r => r.json()).catch(() => []),
      fetch('/api/products').then(r => r.json()).catch(() => []),
      fetch('/api/prices').then(r => r.json()).catch(() => []),
      fetch('/api/markets').then(r => r.json()).catch(() => []),
      fetch('/api/regions').then(r => r.json()).catch(() => []),
      fetch('/api/alerts').then(r => r.json()).catch(() => []),
      fetch('/api/forum-posts').then(r => r.json()).catch(() => []),
    ]).then(([usersRes, listingsRes, productsRes, pricesRes, marketsRes, regionsRes, alertsRes, forumRes]) => {
      setUsers(Array.isArray(usersRes) ? usersRes : []);
      setRecentListings((listingsRes || []).slice(0, 5));
      setStats({
        users: Array.isArray(usersRes) ? usersRes.length : 0,
        products: Array.isArray(productsRes) ? productsRes.length : 0,
        markets: Array.isArray(marketsRes) ? marketsRes.length : 0,
        regions: Array.isArray(regionsRes) ? regionsRes.length : 0,
        listings: Array.isArray(listingsRes) ? listingsRes.length : 0,
        prices: Array.isArray(pricesRes) ? pricesRes.length : 0,
        alerts: Array.isArray(alertsRes) ? alertsRes.length : 0,
        forumPosts: Array.isArray(forumRes) ? forumRes.length : 0,
      });
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: 'Utilisateurs', value: stats.users, icon: Users, color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50' },
    { label: 'Produits', value: stats.products, icon: Leaf, color: 'from-green-500 to-green-600', bgLight: 'bg-green-50' },
    { label: 'Marchés', value: stats.markets, icon: Store, color: 'from-amber-500 to-amber-600', bgLight: 'bg-amber-50' },
    { label: 'Régions', value: stats.regions, icon: TrendingUp, color: 'from-purple-500 to-purple-600', bgLight: 'bg-purple-50' },
    { label: 'Annonces', value: stats.listings, icon: ShoppingCart, color: 'from-teal-500 to-teal-600', bgLight: 'bg-teal-50' },
    { label: 'Prix enregistrés', value: stats.prices, icon: DollarSign, color: 'from-indigo-500 to-indigo-600', bgLight: 'bg-indigo-50' },
    { label: 'Alertes actives', value: stats.alerts, icon: Bell, color: 'from-red-500 to-red-600', bgLight: 'bg-red-50' },
    { label: 'Posts forum', value: stats.forumPosts, icon: FileText, color: 'from-pink-500 to-pink-600', bgLight: 'bg-pink-50' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>;
  }

  const avatarUrl = user?.id === 'admin1' ? '/admin-photo.png' : null;

  return (
    <div className="space-y-6">
      {/* Dashboard header with admin info */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10 flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Admin" className="w-16 h-16 rounded-full border-4 border-white/30 object-cover shadow-lg" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {tValue('dashboard', lang)}
              {isAdmin && <Shield className="w-5 h-5 text-yellow-300" />}
            </h1>
            <p className="text-green-100 text-sm mt-1">
              Bienvenue, {user?.name || 'Administrateur'} — Vue d'ensemble de la plateforme TogoAgric
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className={`bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition ${s.bgLight}`}>
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center shadow-sm`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity chart placeholder */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-green-600" /> Activité de la plateforme
        </h2>
        <div className="grid grid-cols-7 gap-2 items-end h-32">
          {[65, 45, 80, 55, 70, 90, 75].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg transition-all hover:from-green-600 hover:to-emerald-500 cursor-pointer"
                style={{ height: `${h}%` }}
                title={`${h} activités`}
              />
              <span className="text-[10px] text-gray-400">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Users table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> Utilisateurs ({users.length})</h2>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold text-gray-600">Utilisateur</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-600">Rôle</th>
                  <th className="text-left px-4 py-2 font-semibold text-gray-600">Région</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          u.id === 'admin1' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                          u.role === 'farmer' ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                          {u.id === 'admin1' ? (
                            <img src="/admin-photo.png" className="w-8 h-8 rounded-full object-cover" alt="" />
                          ) : u.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'farmer' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>{u.role === 'admin' ? '👑 Admin' : u.role === 'farmer' ? '🌾 Agri' : '🛒 Achat'}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">{u.region?.name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent listings */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-green-500" /> Dernières annonces</h2>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto custom-scrollbar">
            {recentListings.length === 0 ? (
              <div className="p-6 text-center text-gray-400">Aucune annonce</div>
            ) : (
              recentListings.map((l: any) => (
                <div key={l.id} className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{l.product?.emoji || '📦'}</span>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{l.title}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      l.type === 'vente' ? 'bg-green-100 text-green-700' : l.type === 'achat' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>{l.type}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                    <span>👤 {l.sellerName}</span>
                    {l.price && <span className="font-bold text-gray-700">{l.price.toLocaleString()} FCFA</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
