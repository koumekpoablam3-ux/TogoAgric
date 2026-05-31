'use client';
import { useState, useEffect } from 'react';
import { tValue, Language } from '@/lib/i18n';
import { X, Plus } from 'lucide-react';

interface Product { id: string; name: string; emoji: string; }
interface Region { id: string; name: string; }
interface Market { id: string; name: string; regionId: string; }

interface CreateListingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  lang: Language;
}

export default function CreateListingDialog({ isOpen, onClose, onCreated, lang }: CreateListingDialogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', type: 'vente', productId: '',
    sellerName: '', sellerPhone: '', regionId: '', marketId: '',
    price: '', quantity: '', paymentMethod: 'cash',
  });

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/regions').then(r => r.json()),
        fetch('/api/markets').then(r => r.json()),
      ]).then(([prods, regs, mrks]) => {
        setProducts(prods || []);
        setRegions(regs || []);
        setMarkets(mrks || []);
      }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.productId || !form.sellerName) return;

    setLoading(true);
    try {
      await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      onCreated();
      onClose();
    } catch {}
    setLoading(false);
  };

  const filteredMarkets = markets.filter(m => !form.regionId || m.regionId === form.regionId);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b bg-green-50 rounded-t-2xl">
          <h2 className="font-bold text-green-800 flex items-center gap-2"><Plus className="w-5 h-5" /> {tValue('createListing', lang)}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-200"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('listingTitle', lang)} *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('description', lang)}</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none h-20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
                <option value="vente">{tValue('sale', lang)}</option>
                <option value="achat">{tValue('buy', lang)}</option>
                <option value="service">{tValue('service', lang)}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('product', lang)} *</label>
              <select value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" required>
                <option value="">--</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('sellerName', lang)} *</label>
              <input type="text" value={form.sellerName} onChange={e => setForm({ ...form, sellerName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('sellerPhone', lang)}</label>
              <input type="tel" value={form.sellerPhone} onChange={e => setForm({ ...form, sellerPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('region', lang)}</label>
              <select value={form.regionId} onChange={e => setForm({ ...form, regionId: e.target.value, marketId: '' })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
                <option value="">{tValue('allRegions', lang)}</option>
                {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('market', lang)}</label>
              <select value={form.marketId} onChange={e => setForm({ ...form, marketId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
                <option value="">{tValue('allRegions', lang)}</option>
                {filteredMarkets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('amount', lang)}</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('quantity', lang)}</label>
              <input type="text" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tValue('paymentMethod', lang)}</label>
              <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
                <option value="cash">💵 Cash</option>
                <option value="t-money">📱 T-Money</option>
                <option value="flooz">📱 Flooz</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition">
            {loading ? '...' : tValue('submit', lang)}
          </button>
        </form>
      </div>
    </div>
  );
}
