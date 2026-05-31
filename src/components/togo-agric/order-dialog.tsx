'use client';
import { useState } from 'react';
import { tValue, Language } from '@/lib/i18n';
import { X, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface OrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listing: any;
  lang: Language;
  onOrdered: () => void;
}

export default function OrderDialog({ isOpen, onClose, listing, lang, onOrdered }: OrderDialogProps) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    quantity: '',
    buyerName: user?.name || '',
    buyerPhone: user?.phone || '',
    paymentMethod: 'cash',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          productId: listing.productId,
          buyerId: user?.id || 'guest',
          buyerName: form.buyerName,
          buyerPhone: form.buyerPhone,
          sellerName: listing.sellerName,
          sellerPhone: listing.sellerPhone,
          title: listing.title,
          quantity: form.quantity,
          price: listing.price,
          paymentMethod: form.paymentMethod,
          regionId: listing.regionId || (listing.region?.id || null),
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
        onOrdered();
        setTimeout(() => onClose(), 1500);
      } else {
        setError(data.error || 'Erreur');
      }
    } catch {
      setError('Erreur de connexion');
    }
    setLoading(false);
  };

  const total = form.quantity && listing.price
    ? (parseFloat(form.quantity) * listing.price).toLocaleString()
    : '0';

  const paymentLabels: Record<string, string> = {
    cash: '💵 Cash (espèces)',
    't-money': '📱 T-Money',
    flooz: '📱 Moov Money (Flooz)',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-5 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Passer une commande
            </h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Résumé du produit */}
          <div className="mt-3 bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{listing.product?.emoji || '📦'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{listing.title}</p>
                <p className="text-green-100 text-xs">
                  👤 {listing.sellerName} • {listing.region?.name || ''}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{listing.price?.toLocaleString()}</p>
                <p className="text-xs text-green-200">FCFA/{listing.quantity || 'unité'}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
              <Check className="w-4 h-4" /> {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Votre nom *</label>
              <input type="text" value={form.buyerName} onChange={e => setForm({ ...form, buyerName: e.target.value })}
                className="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input type="tel" value={form.buyerPhone} onChange={e => setForm({ ...form, buyerPhone: e.target.value })}
                placeholder="+228 90 00 00 00"
                className="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantité souhaitée *</label>
            <input type="text" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
              placeholder="Ex: 50 kg, 10 pièces..."
              className="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
            <div className="grid grid-cols-3 gap-2">
              {['cash', 't-money', 'flooz'].map(pm => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: pm })}
                  className={`px-3 py-2.5 rounded-lg text-xs font-medium border-2 transition ${
                    form.paymentMethod === pm
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {paymentLabels[pm]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message pour le vendeur</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
              placeholder="Précisez vos besoins, la livraison, etc."
              className="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none h-16 resize-none" />
          </div>

          {/* Total estimé */}
          <div className="bg-gray-50 rounded-xl p-3 border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total estimé</span>
              <span className="font-bold text-green-700 text-lg">{total} FCFA</span>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</> : <><ShoppingCart className="w-4 h-4" /> Confirmer la commande</>}
          </button>

          <p className="text-center text-xs text-gray-400">
            Le vendeur recevra votre demande et vous contactera pour confirmer
          </p>
        </form>
      </div>
    </div>
  );
}
