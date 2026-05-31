'use client';
import { useState, useEffect } from 'react';
import { tValue, Language } from '@/lib/i18n';
import { PRODUCT_CATEGORIES } from '@/lib/togo-data';
import { Search, TrendingUp, TrendingDown, ArrowUpDown, Filter, X, Check, BarChart3 } from 'lucide-react';

// DONNÉES DE SECOURS - affichées immédiatement
const FALLBACK_PRICES = [
  { product: { name: 'Maïs', emoji: '🌽' }, market: { name: 'Marché de Lomé', region: { name: 'Maritime' } }, price: 250, unit: 'kg', variation: -3.2 },
  { product: { name: 'Igname', emoji: '🥔' }, market: { name: 'Marché de Sokodé', region: { name: 'Centrale' } }, price: 350, unit: 'kg', variation: 5.1 },
  { product: { name: 'Tomate', emoji: '🍅' }, market: { name: 'Marché de Kpalimé', region: { name: 'Plateaux' } }, price: 400, unit: 'kg', variation: -1.5 },
  { product: { name: 'Manioc', emoji: '🥔' }, market: { name: 'Marché de Kara', region: { name: 'Kara' } }, price: 200, unit: 'kg', variation: 0 },
  { product: { name: 'Poisson fumé', emoji: '🐟' }, market: { name: 'Marché d\'Adawlito', region: { name: 'Maritime' } }, price: 3000, unit: 'kg', variation: 2.8 },
  { product: { name: 'Riz', emoji: '🍚' }, market: { name: 'Marché de Tokoin', region: { name: 'Maritime' } }, price: 450, unit: 'kg', variation: -4.0 },
  { product: { name: 'Volaille', emoji: '🐔' }, market: { name: 'Marché de Kégué', region: { name: 'Maritime' } }, price: 3500, unit: 'pièce', variation: 1.2 },
  { product: { name: 'Huile de palme', emoji: '🫙' }, market: { name: 'Marché d\'Atakpamé', region: { name: 'Plateaux' } }, price: 800, unit: 'litre', variation: -2.0 },
  { product: { name: 'Piment', emoji: '🌶️' }, market: { name: 'Marché de Lomé', region: { name: 'Maritime' } }, price: 500, unit: 'kg', variation: 3.5 },
  { product: { name: 'Gari', emoji: '🫘' }, market: { name: 'Marché de Sokodé', region: { name: 'Centrale' } }, price: 350, unit: 'kg', variation: -1.0 },
  { product: { name: 'Banane plantain', emoji: '🍌' }, market: { name: 'Marché d\'Agoè', region: { name: 'Maritime' } }, price: 800, unit: 'botte', variation: 2.0 },
  { product: { name: 'Ananas', emoji: '🍍' }, market: { name: 'Marché de Bafilo', region: { name: 'Kara' } }, price: 400, unit: 'pièce', variation: -5.0 },
];

const FALLBACK_REGIONS = [
  { id: 'r1', name: 'Maritime' },
  { id: 'r2', name: 'Plateaux' },
  { id: 'r3', name: 'Centrale' },
  { id: 'r4', name: 'Kara' },
  { id: 'r5', name: 'Savanes' },
];

interface PricesSectionProps {
  lang: Language;
}

export default function PricesSection({ lang }: PricesSectionProps) {
  const [prices, setPrices] = useState<any[]>(FALLBACK_PRICES);
  const [regions, setRegions] = useState<any[]>(FALLBACK_REGIONS);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [regionFilter, setRegionFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'price' | 'variation'>('price');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (regionFilter !== 'all') params.set('regionId', regionFilter);
      if (productFilter !== 'all') params.set('productId', productFilter);

      const [pricesRes, regionsRes, productsRes] = await Promise.all([
        fetch(`/api/prices?${params}`).then(r => r.json()).catch(() => []),
        fetch('/api/regions').then(r => r.json()).catch(() => []),
        fetch('/api/products').then(r => r.json()).catch(() => []),
      ]);

      const p = Array.isArray(pricesRes) ? pricesRes : [];
      const r = Array.isArray(regionsRes) ? regionsRes : [];
      const pr = Array.isArray(productsRes) ? productsRes : [];

      if (p.length > 0) setPrices(p);
      if (r.length > 0) setRegions(r);
      if (pr.length > 0) setProducts(pr);
      if (p.length > 0) setDataLoaded(true);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [regionFilter, productFilter]);

  const filteredProducts = products.filter((p: any) =>
    categoryFilter === 'all' || p.category === categoryFilter
  );

  const displayedPrices = prices
    .filter((p: any) => {
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        return p.product?.name?.toLowerCase().includes(s) || p.market?.name?.toLowerCase().includes(s);
      }
      return true;
    })
    .sort((a: any, b: any) => {
      if (sortField === 'price') return sortDir === 'desc' ? b.price - a.price : a.price - b.price;
      return sortDir === 'desc' ? (b.variation || 0) - (a.variation || 0) : (a.variation || 0) - (b.variation || 0);
    });

  const toggleSort = (field: 'price' | 'variation') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const activeFilterCount = (regionFilter !== 'all' ? 1 : 0) + (categoryFilter !== 'all' ? 1 : 0) + (productFilter !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);

  const clearAllFilters = () => {
    setRegionFilter('all');
    setCategoryFilter('all');
    setProductFilter('all');
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tValue('priceDashboard', lang)}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{displayedPrices.length} {tValue('prices', lang).toLowerCase()} disponibles</p>
        </div>
        {loading && (
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Actualisation...
          </div>
        )}
      </div>

      {/* Price comparison chart - top 5 */}
      <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
        <h2 className="font-semibold text-gray-900 text-sm mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-green-600" /> Comparaison des prix — Top 5
        </h2>
        <div className="space-y-3">
          {displayedPrices.slice(0, 5).map((p: any, i: number) => {
            const maxPrice = Math.max(...displayedPrices.slice(0, 5).map((x: any) => x.price || 0), 1);
            const pct = Math.min(((p.price || 0) / maxPrice) * 100, 100);
            const colors = [
              'bg-gradient-to-r from-green-500 to-emerald-500',
              'bg-gradient-to-r from-green-400 to-teal-500',
              'bg-gradient-to-r from-emerald-400 to-green-500',
              'bg-gradient-to-r from-teal-400 to-emerald-400',
              'bg-gradient-to-r from-green-300 to-teal-400',
            ];
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-24 sm:w-32 text-xs text-gray-600 font-medium truncate flex items-center gap-1.5 shrink-0">
                  <span>{p.product?.emoji || '📦'}</span>
                  <span className="truncate">{p.product?.name || 'Produit'}</span>
                </div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full ${colors[i]} rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2`}
                    style={{ width: `${pct}%` }}
                  >
                    <span className="text-[10px] text-white font-bold whitespace-nowrap">
                      {(p.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 w-14 text-right shrink-0">FCFA/{p.unit || 'kg'}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder={tValue('searchPlaceholder', lang)} value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-gray-50 focus:bg-white transition" />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Pill-style region filter */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> {tValue('allRegions', lang)}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRegionFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                regionFilter === 'all'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              Toutes
            </button>
            {regions.map((r: any) => (
              <button
                key={r.id}
                onClick={() => setRegionFilter(r.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  regionFilter === r.id
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Pill-style category filter */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Catégories
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setCategoryFilter('all'); setProductFilter('all'); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                categoryFilter === 'all'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              Toutes
            </button>
            {PRODUCT_CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => { setCategoryFilter(c.id); setProductFilter('all'); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                  categoryFilter === c.id
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <span>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product filter + active filters summary */}
        {filteredProducts.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Produit
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setProductFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  productFilter === 'all'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                Tous
              </button>
              {filteredProducts.map((p: any) => (
                <button
                  key={p.id}
                  onClick={() => setProductFilter(p.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                    productFilter === p.id
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  <span>{p.emoji}</span> {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active filters bar */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''} actif{activeFilterCount > 1 ? 's' : ''}
            </span>
            <button onClick={clearAllFilters} className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
              <X className="w-3 h-3" /> Effacer tout
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">{tValue('product', lang)}</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">{tValue('market', lang)}</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  <button onClick={() => toggleSort('price')} className="flex items-center gap-1.5 hover:text-green-600 transition-colors">
                    {tValue('price', lang)} <ArrowUpDown className="w-3.5 h-3.5" />
                    {sortField === 'price' && (
                      <span className="text-green-600">{sortDir === 'desc' ? '↓' : '↑'}</span>
                    )}
                  </button>
                </th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">{tValue('unit', lang)}</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                  <button onClick={() => toggleSort('variation')} className="flex items-center gap-1.5 hover:text-green-600 transition-colors">
                    Tendance <ArrowUpDown className="w-3.5 h-3.5" />
                    {sortField === 'variation' && (
                      <span className="text-green-600">{sortDir === 'desc' ? '↓' : '↑'}</span>
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedPrices.map((p: any, i: number) => {
                const variation = p.variation || 0;
                const isUp = variation > 0;
                const isDown = variation < 0;
                const isNeutral = variation === 0;
                return (
                  <tr
                    key={p.id || i}
                    className={`border-b border-gray-50 hover:bg-green-50/40 transition-colors ${
                      i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl w-8 text-center">{p.product?.emoji || '📦'}</span>
                        <span className="font-semibold text-gray-900">{p.product?.name || 'Produit'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-gray-700 text-sm font-medium">{p.market?.name || 'Marché'}</div>
                      <div className="text-xs text-gray-400">{p.market?.region?.name || ''}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-gray-900 tabular-nums">{(p.price || 0).toLocaleString()}</span>
                      <span className="text-xs text-gray-500 ml-1">FCFA</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-gray-500 text-xs font-medium bg-gray-100 px-2 py-0.5 rounded">{p.unit || 'kg'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                        isUp ? 'bg-green-50 text-green-700 border border-green-200' :
                        isDown ? 'bg-red-50 text-red-600 border border-red-200' :
                        'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        {isUp ? (
                          <><TrendingUp className="w-3.5 h-3.5" /> +{variation.toFixed(1)}%</>
                        ) : isDown ? (
                          <><TrendingDown className="w-3.5 h-3.5" /> {variation.toFixed(1)}%</>
                        ) : (
                          <><span className="w-2 h-0.5 bg-gray-400 rounded" /> 0%</>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t bg-gradient-to-r from-gray-50 to-gray-100/50 text-xs text-gray-500 flex justify-between items-center">
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-green-500" />
            {displayedPrices.length} {tValue('prices', lang).toLowerCase()} affiché{displayedPrices.length > 1 ? 's' : ''}
          </span>
          {!dataLoaded && (
            <span className="text-amber-600 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              Chargement des prix en temps réel...
            </span>
          )}
          {dataLoaded && (
            <span className="text-green-600 flex items-center gap-1">
              <Check className="w-3 h-3" /> Données à jour
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
