'use client';
import { useState, useEffect } from 'react';
import { tValue, Language } from '@/lib/i18n';
import { Bell, Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react';

interface AlertsSectionProps {
  lang: Language;
}

export default function AlertsSection({ lang }: AlertsSectionProps) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newAlert, setNewAlert] = useState({ productId: '', targetPrice: '', direction: 'below' });
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [alertsRes, productsRes] = await Promise.all([
        fetch('/api/alerts').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
      ]);
      setAlerts(alertsRes || []);
      setProducts(productsRes || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.productId || !newAlert.targetPrice) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlert),
      });
      setShowCreate(false);
      setNewAlert({ productId: '', targetPrice: '', direction: 'below' });
      fetchData();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">🔔 {tValue('priceAlerts', lang)}</h1>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition text-sm">
          <Plus className="w-4 h-4" /> {tValue('createAlert', lang)}
        </button>
      </div>

      {/* Alerts list */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{tValue('noAlerts', lang)}</p>
          </div>
        ) : (
          <div className="divide-y">
            {alerts.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.direction === 'below' ? 'bg-red-100' : 'bg-green-100'}`}>
                    {a.direction === 'below'
                      ? <TrendingDown className="w-5 h-5 text-red-600" />
                      : <TrendingUp className="w-5 h-5 text-green-600" />
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{a.product?.emoji}</span>
                      <p className="font-medium text-gray-900 text-sm">{a.product?.name}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {a.direction === 'below' ? tValue('below', lang) : tValue('above', lang)} {a.targetPrice.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.active ? 'Active' : 'Désactivée'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create alert dialog */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b bg-green-50 rounded-t-2xl">
              <h2 className="font-bold text-green-800 flex items-center gap-2"><Bell className="w-5 h-5" /> {tValue('createAlert', lang)}</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-gray-200">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('product', lang)}</label>
                <select value={newAlert.productId} onChange={e => setNewAlert({ ...newAlert, productId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" required>
                  <option value="">-- Sélectionner --</option>
                  {products.map((p: any) => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('targetPrice', lang)}</label>
                <input type="number" value={newAlert.targetPrice} onChange={e => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="150" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('whenPriceGoes', lang)}</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setNewAlert({ ...newAlert, direction: 'below' })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1 ${newAlert.direction === 'below' ? 'bg-red-100 text-red-700 border-2 border-red-300' : 'bg-gray-100 text-gray-600'}`}>
                    <TrendingDown className="w-4 h-4" /> {tValue('below', lang)}
                  </button>
                  <button type="button" onClick={() => setNewAlert({ ...newAlert, direction: 'above' })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1 ${newAlert.direction === 'above' ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-gray-100 text-gray-600'}`}>
                    <TrendingUp className="w-4 h-4" /> {tValue('above', lang)}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition">
                {tValue('createAlert', lang)}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
