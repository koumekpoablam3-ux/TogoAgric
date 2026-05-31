'use client';
import { useState, useEffect } from 'react';
import { tValue, Language } from '@/lib/i18n';
import { Search, Phone, MapPin, Plus, Star, ShoppingCart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import OrderDialog from './order-dialog';

// DONNÉES DE SECOURS
const FALLBACK_LISTINGS = [
  { id: '1', title: 'Vente Maïs frais - Récolte de la semaine', description: 'Maïs frais de qualité supérieure, récolté cette semaine dans la région de Sokodé.', type: 'vente', price: 200, quantity: '500 kg', sellerName: 'Kossi Amouzou', sellerPhone: '+22890123456', product: { name: 'Maïs', emoji: '🌽' }, region: { name: 'Centrale' }, market: { name: 'Marché de Sokodé' } },
  { id: '2', title: 'Achat Tomates en grande quantité', description: 'Je recherche des tomates fraîches pour mon restaurant à Lomé. Minimum 100 kg par semaine.', type: 'achat', price: 250, quantity: '100 kg/semaine', sellerName: 'Yao Degbe', sellerPhone: '+22891234567', product: { name: 'Tomate', emoji: '🍅' }, region: { name: 'Maritime' }, market: null },
  { id: '3', title: 'Vente Igname de Bassar - Primeur', description: 'Igname premium de Bassar, connue pour sa qualité exceptionnelle.', type: 'vente', price: 350, quantity: '200 kg', sellerName: 'Tchao Palouki', sellerPhone: '+22892345678', product: { name: 'Igname', emoji: '🥔' }, region: { name: 'Kara' }, market: { name: 'Marché de Bassar' } },
  { id: '4', title: 'Service Transport agricole', description: 'Transport de produits agricoles entre toutes les régions du Togo.', type: 'service', price: 50000, quantity: 'par trajet', sellerName: 'Esso Kpelou', sellerPhone: '+22893456789', product: { name: 'Transport', emoji: '🚛' }, region: { name: 'Maritime' }, market: null },
  { id: '5', title: 'Vente Gari de manioc artisanal', description: 'Gari de manioc préparé artisanalement dans la région des Plateaux.', type: 'vente', price: 350, quantity: '300 kg', sellerName: 'Adjo Dzokoto', sellerPhone: '+22894567890', product: { name: 'Gari', emoji: '🫘' }, region: { name: 'Plateaux' }, market: { name: "Marché d'Atakpamé" } },
  { id: '6', title: 'Vente Volaille - Poulets de chair', description: 'Poulets de chair élevés naturellement. Commande minimale 10 pièces.', type: 'vente', price: 3500, quantity: '50 pièces', sellerName: 'Kpémissi Lawson', sellerPhone: '+22895678901', product: { name: 'Volaille', emoji: '🐔' }, region: { name: 'Maritime' }, market: { name: 'Marché de Lomé' } },
  { id: '7', title: 'Vente Poisson fumé - Tilapia', description: 'Tilapia fumé artisanal du lac Togo. Emballé et prêt à la vente.', type: 'vente', price: 3000, quantity: '100 kg', sellerName: 'Mawunyo Agbo', sellerPhone: '+22896789012', product: { name: 'Poisson fumé', emoji: '🐟' }, region: { name: 'Maritime' }, market: null },
  { id: '8', title: 'Vente Huile de palme pure', description: 'Huile de palme extraite localement, sans additifs.', type: 'vente', price: 800, quantity: '50 litres', sellerName: 'Adjo Dzokoto', sellerPhone: '+22894567890', product: { name: 'Huile de palme', emoji: '🫙' }, region: { name: 'Plateaux' }, market: { name: 'Marché de Kpalimé' } },
  { id: '9', title: 'Vente Chèvres - Race locale', description: 'Chèvres de race locale, bien nourries. Idéales pour élevage.', type: 'vente', price: 25000, quantity: '20 têtes', sellerName: 'Bouraïma Ouro', sellerPhone: '+22897890123', product: { name: 'Chèvre', emoji: '🐐' }, region: { name: 'Savanes' }, market: { name: 'Marché de Dapaong' } },
  { id: '10', title: 'Vente Café robusta des Plateaux', description: 'Café robusta des monts du Togo. Torréfaction artisanale.', type: 'vente', price: 1800, quantity: '100 kg', sellerName: 'Adjo Dzokoto', sellerPhone: '+22894567890', product: { name: 'Café', emoji: '☕' }, region: { name: 'Plateaux' }, market: null },
  { id: '11', title: 'Achat Piment fort en gros', description: 'Recherche piment fort en grande quantité pour sauce pimentée.', type: 'achat', price: 400, quantity: '200 kg', sellerName: 'Sena Bodjona', sellerPhone: '+22898901234', product: { name: 'Piment', emoji: '🌶️' }, region: { name: 'Maritime' }, market: null },
  { id: '12', title: 'Vente Ananas de Bafilo', description: 'Ananas de Bafilo, les meilleurs du Togo.', type: 'vente', price: 400, quantity: '1000 pièces', sellerName: 'Producteur local', sellerPhone: '+22890012345', product: { name: 'Ananas', emoji: '🍍' }, region: { name: 'Kara' }, market: { name: 'Marché de Bafilo' } },
];

const FALLBACK_REGIONS = [
  { id: 'r1', name: 'Maritime' },
  { id: 'r2', name: 'Plateaux' },
  { id: 'r3', name: 'Centrale' },
  { id: 'r4', name: 'Kara' },
  { id: 'r5', name: 'Savanes' },
];

interface MarketplaceSectionProps {
  lang: Language;
  onCreateListing: () => void;
}

function getWhatsAppLink(phone: string, listing: any): string {
  const cleanPhone = phone?.replace(/[\s\-()]/g, '').replace(/^\+?228/, '228');
  const msg = encodeURIComponent(
    `Bonjour ! Je suis intéressé(e) par votre annonce sur TogoAgric :\n\n` +
    `📦 ${listing.title}\n` +
    `💰 Prix : ${listing.price?.toLocaleString()} FCFA\n` +
    `📦 Quantité dispo : ${listing.quantity || 'N/A'}\n\n` +
    `Merci de me donner plus de détails.`
  );
  return `https://wa.me/${cleanPhone}?text=${msg}`;
}

export default function MarketplaceSection({ lang, onCreateListing }: MarketplaceSectionProps) {
  const [listings, setListings] = useState<any[]>(FALLBACK_LISTINGS);
  const [regions, setRegions] = useState<any[]>(FALLBACK_REGIONS);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [orderListing, setOrderListing] = useState<any>(null);
  const [orderSuccess, setOrderSuccess] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (regionFilter !== 'all') params.set('regionId', regionFilter);
      if (searchTerm) params.set('search', searchTerm);

      const [listingsRes, regionsRes] = await Promise.all([
        fetch(`/api/listings?${params}`).then(r => r.json()).catch(() => []),
        fetch('/api/regions').then(r => r.json()).catch(() => []),
      ]);

      const l = Array.isArray(listingsRes) ? listingsRes : [];
      const r = Array.isArray(regionsRes) ? regionsRes : [];
      if (l.length > 0) { setListings(l); setDataLoaded(true); }
      if (r.length > 0) setRegions(r);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [typeFilter, regionFilter, searchTerm]);

  const typeColors: Record<string, string> = {
    vente: 'bg-green-100 text-green-700',
    achat: 'bg-blue-100 text-blue-700',
    service: 'bg-amber-100 text-amber-700',
  };

  const typeLabels: Record<string, string> = {
    vente: '💰 Vente',
    achat: '🛒 Achat',
    service: '🔧 Service',
  };

  const filtered = typeFilter === 'all' ? listings : listings.filter((l: any) => l.type === typeFilter);
  const regionFiltered = regionFilter === 'all' ? filtered : filtered.filter((l: any) => l.region?.name === regions.find((r: any) => r.id === regionFilter)?.name);
  const displayed = searchTerm
    ? regionFiltered.filter((l: any) => l.title?.toLowerCase().includes(searchTerm.toLowerCase()) || l.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()))
    : regionFiltered;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tValue('marketplace', lang)}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{displayed.length} annonce{displayed.length > 1 ? 's' : ''} disponible{displayed.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={onCreateListing}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition text-sm shadow-md">
          <Plus className="w-4 h-4" /> {tValue('createListing', lang)}
        </button>
      </div>

      {/* Comment ça marche */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
        <p className="font-semibold text-emerald-800 text-sm mb-2">🛒 Comment acheter et vendre sur TogoAgric ?</p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-emerald-700">
          <div className="flex items-start gap-2">
            <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
            <span><strong>Cherchez</strong> un produit ou publiez une annonce de vente</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
            <span><strong>Contactez</strong> le vendeur via WhatsApp ou passez une commande</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
            <span><strong>Payaient</strong> par Cash, T-Money ou Flooz</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">4</span>
            <span><strong>Récupérez</strong> votre produit au marché ou via livraison</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder={tValue('searchPlaceholder', lang)} value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
            <option value="all">{tValue('allTypes', lang)}</option>
            <option value="vente">💰 {tValue('sale', lang)}</option>
            <option value="achat">🛒 {tValue('buy', lang)}</option>
            <option value="service">🔧 {tValue('service', lang)}</option>
          </select>
          <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
            <option value="all">{tValue('allRegions', lang)}</option>
            {regions.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>

      {orderSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ {orderSuccess}
        </div>
      )}

      {/* Listings Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map((l: any, idx: number) => (
          <div key={l.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            {/* Header du produit */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-center relative">
              {idx < 3 && (
                <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full shadow-sm">
                  <Star className="w-3 h-3 fill-amber-400" /> En vedette
                </span>
              )}
              <span className="text-5xl">{l.product?.emoji || '📦'}</span>
              <p className="text-xs text-gray-500 mt-1">{l.product?.name || 'Produit'}</p>
            </div>

            <div className="p-4 space-y-2">
              {/* Type + Prix */}
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[l.type] || 'bg-gray-100'}`}>
                  {typeLabels[l.type] || l.type}
                </span>
                {l.price && <span className="font-bold text-green-700 text-lg">{l.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">FCFA</span></span>}
              </div>

              {/* Titre */}
              <h3 className="font-semibold text-gray-900 text-sm leading-snug">{l.title}</h3>

              {/* Description */}
              {l.description && (
                <p className="text-xs text-gray-500 line-clamp-2">{l.description}</p>
              )}

              {/* Quantité */}
              {l.quantity && <p className="text-xs text-gray-500">📦 Quantité : {l.quantity}</p>}

              {/* Localisation */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{l.region?.name || ''} {l.market?.name ? `— ${l.market.name}` : ''}</span>
              </div>

              {/* Vendeur */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">
                  {l.sellerName?.charAt(0) || '?'}
                </div>
                <span className="text-xs font-medium text-gray-700">{l.sellerName || 'Vendeur'}</span>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-2 pt-1">
                {l.type === 'vente' && l.sellerPhone && (
                  <>
                    {/* WhatsApp */}
                    <a
                      href={getWhatsAppLink(l.sellerPhone, l)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                    {/* Commander */}
                    <button
                      onClick={() => setOrderListing(l)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Commander
                    </button>
                  </>
                )}
                {l.type === 'achat' && l.sellerPhone && (
                  <a
                    href={getWhatsAppLink(l.sellerPhone, l)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Proposer mes produits
                  </a>
                )}
                {l.type === 'service' && l.sellerPhone && (
                  <a
                    href={getWhatsAppLink(l.sellerPhone, l)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Contacter
                  </a>
                )}
                {!l.sellerPhone && (
                  <span className="flex-1 text-center py-2 text-xs text-gray-400">Pas de contact disponible</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!dataLoaded && (
        <div className="text-center py-3">
          <p className="text-sm text-amber-600">⚡ Chargement des annonces en temps réel...</p>
        </div>
      )}

      {/* Order Dialog */}
      {orderListing && (
        <OrderDialog
          isOpen={!!orderListing}
          onClose={() => setOrderListing(null)}
          listing={orderListing}
          lang={lang}
          onOrdered={() => {
            setOrderSuccess('Commande envoyée avec succès ! Le vendeur va vous contacter.');
          }}
        />
      )}
    </div>
  );
}
