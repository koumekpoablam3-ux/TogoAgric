'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { tValue, Language } from '@/lib/i18n';
import { PRODUCT_CATEGORIES, SAMPLE_FARMERS } from '@/lib/togo-data';
import { Search, TrendingUp, TrendingDown, ShoppingCart, CloudRain, BarChart3, ArrowRight, Sun, Cloud, CloudLightning, ThermometerSun, Droplets, Calendar } from 'lucide-react';

// DONNÉES DE SECOURS - toujours visibles même si l'API est lent
const FALLBACK_PRICES = [
  { product: { name: 'Maïs', emoji: '🌽' }, market: { name: 'Marché de Lomé' }, price: 250, unit: 'kg', variation: -3.2 },
  { product: { name: 'Igname', emoji: '🥔' }, market: { name: 'Marché de Sokodé' }, price: 350, unit: 'kg', variation: 5.1 },
  { product: { name: 'Tomate', emoji: '🍅' }, market: { name: 'Marché de Kpalimé' }, price: 400, unit: 'kg', variation: -1.5 },
  { product: { name: 'Manioc', emoji: '🥔' }, market: { name: 'Marché de Kara' }, price: 200, unit: 'kg', variation: 0 },
  { product: { name: 'Poisson fumé', emoji: '🐟' }, market: { name: 'Marché de Lomé' }, price: 3000, unit: 'kg', variation: 2.8 },
  { product: { name: 'Riz', emoji: '🍚' }, market: { name: 'Marché de Tokoin' }, price: 450, unit: 'kg', variation: -4.0 },
  { product: { name: 'Volaille', emoji: '🐔' }, market: { name: 'Marché de Lomé' }, price: 3500, unit: 'pièce', variation: 1.2 },
  { product: { name: 'Huile de palme', emoji: '🫙' }, market: { name: 'Marché d\'Atakpamé' }, price: 800, unit: 'litre', variation: -2.0 },
];

const FALLBACK_LISTINGS = [
  { title: 'Vente Maïs frais - Récolte de la semaine', type: 'vente', sellerName: 'Kossi Amouzou', price: 200 },
  { title: 'Achat Tomates en grande quantité', type: 'achat', sellerName: 'Yao Degbe', price: 250 },
  { title: 'Vente Igname de Bassar - Primeur', type: 'vente', sellerName: 'Tchao Palouki', price: 350 },
  { title: 'Service Transport agricole', type: 'service', sellerName: 'Esso Kpelou', price: 50000 },
];

const FALLBACK_STATS = [
  { label: tValue('products', 'fr'), value: 38, emoji: '🌾' },
  { label: tValue('markets', 'fr'), value: 21, emoji: '🏪' },
  { label: tValue('regions', 'fr'), value: 5, emoji: '🗺️' },
  { label: tValue('listings', 'fr'), value: 20, emoji: '📋' },
];

const WEATHER_DATA = [
  { city: 'Maritime', temp: 32, icon: '☀️', condition: 'Ensoleillé', humidity: 78, wind: 12 },
  { city: 'Plateaux', temp: 28, icon: '⛅', condition: 'Nuageux', humidity: 85, wind: 8 },
  { city: 'Centrale', temp: 34, icon: '☀️', condition: 'Ensoleillé', humidity: 65, wind: 15 },
  { city: 'Kara', temp: 36, icon: '🌤️', condition: 'Partiellement nuageux', humidity: 60, wind: 10 },
  { city: 'Savanes', temp: 38, icon: '☀️', condition: 'Très ensoleillé', humidity: 55, wind: 18 },
];

interface HomeSectionProps {
  lang: Language;
  onNavigate: (tab: string) => void;
}

interface Stat { label: string; value: string | number; emoji: string; }

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

function AnimatedStatCard({ stat, delay }: { stat: Stat; delay: number }) {
  const numericValue = typeof stat.value === 'number' ? stat.value : parseInt(String(stat.value)) || 0;
  const { count, ref } = useAnimatedCounter(numericValue);

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl p-5 shadow-md border border-gray-100 card-hover cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-3xl mb-2">{stat.emoji}</div>
      <div className="text-2xl font-bold text-gray-900 tabular-nums">
        {count.toLocaleString()}+
      </div>
      <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
    </div>
  );
}

export default function HomeSection({ lang, onNavigate }: HomeSectionProps) {
  // Initialiser AVEC les données de secours — l'écran ne sera jamais vide
  const [stats, setStats] = useState<Stat[]>(FALLBACK_STATS);
  const [topPrices, setTopPrices] = useState<any[]>(FALLBACK_PRICES);
  const [latestListings, setLatestListings] = useState<any[]>(FALLBACK_LISTINGS);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const [productsRes, pricesRes, listingsRes, regionsRes, marketsRes] = await Promise.all([
          fetch('/api/products').then(r => r.json()).catch(() => []),
          fetch('/api/prices').then(r => r.json()).catch(() => []),
          fetch('/api/listings').then(r => r.json()).catch(() => []),
          fetch('/api/regions').then(r => r.json()).catch(() => []),
          fetch('/api/markets').then(r => r.json()).catch(() => []),
        ]);

        if (cancelled) return;

        const products = Array.isArray(productsRes) ? productsRes : [];
        const prices = Array.isArray(pricesRes) ? pricesRes : [];
        const listings = Array.isArray(listingsRes) ? listingsRes : [];
        const regions = Array.isArray(regionsRes) ? regionsRes : [];
        const markets = Array.isArray(marketsRes) ? marketsRes : [];

        if (products.length > 0 || prices.length > 0) {
          setStats([
            { label: tValue('products', lang), value: products.length || 38, emoji: '🌾' },
            { label: tValue('markets', lang), value: markets.length || 21, emoji: '🏪' },
            { label: tValue('regions', lang), value: regions.length || 5, emoji: '🗺️' },
            { label: tValue('listings', lang), value: listings.length || 20, emoji: '📋' },
          ]);
          setTopPrices(prices.length > 0 ? prices.slice(0, 8) : FALLBACK_PRICES);
          setLatestListings(listings.length > 0 ? listings.slice(0, 4) : FALLBACK_LISTINGS);
          setDataLoaded(true);
        }
      } catch {
        // Les données de secours restent affichées
      }
    }
    loadData();
    return () => { cancelled = true; };
  }, [lang]);

  // Top 3 trending products
  const topTrending = topPrices
    .slice(0, 3)
    .map((p, i) => ({
      ...p,
      rank: i + 1,
    }));

  return (
    <div className="space-y-8">
      {/* Hero - Gradient welcome banner */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-green-900/20">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/[0.03] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🇹🇬</span>
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
              Plateforme N°1 de l&apos;Agriculture au Togo
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            {tValue('heroTitle', lang)}
          </h1>
          <p className="text-green-100 text-lg mb-2 leading-relaxed">
            {tValue('heroSubtitle', lang)}
          </p>
          <p className="text-green-200/80 text-sm mb-6 italic">
            &quot;L&apos;agriculture est l&apos;épine dorsale de l&apos;économie togolaise — ensemble, cultivons l&apos;avenir.&quot;
          </p>
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder={tValue('searchPlaceholder', lang)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-green-300 outline-none shadow-lg" />
            </div>
            <button onClick={() => onNavigate('prices')} className="px-6 py-3 bg-white text-green-700 rounded-xl font-bold hover:bg-green-50 transition shadow-lg hover:shadow-xl">
              {tValue('prices', lang)}
            </button>
          </div>
        </div>
      </section>

      {/* Stats with animated counters */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <AnimatedStatCard key={i} stat={s} delay={i * 100} />
        ))}
      </section>

      {/* Tendances - Top 3 trending products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-lg">📈</span> Tendances du jour
          </h2>
          <button onClick={() => onNavigate('prices')} className="text-sm text-green-600 hover:underline flex items-center gap-1 font-medium">
            Voir tout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topTrending.map((p, i) => (
            <div
              key={i}
              className="relative bg-white rounded-xl p-5 shadow-md border border-gray-100 card-hover overflow-hidden"
            >
              {/* Rank badge */}
              <div className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-gray-400' : 'bg-amber-700'
              }`}>
                #{p.rank}
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{p.product?.emoji || '📦'}</span>
                <div>
                  <h3 className="font-bold text-gray-900">{p.product?.name || 'Produit'}</h3>
                  <p className="text-xs text-gray-500">{p.market?.name || 'Marché'}</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{(p.price || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">FCFA/{p.unit || 'kg'}</p>
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  (p.variation || 0) > 0
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : (p.variation || 0) < 0
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}>
                  {(p.variation || 0) > 0 ? (
                    <><TrendingUp className="w-3 h-3" /> +{(p.variation || 0).toFixed(1)}%</>
                  ) : (p.variation || 0) < 0 ? (
                    <><TrendingDown className="w-3 h-3" /> {(p.variation || 0).toFixed(1)}%</>
                  ) : (
                    <>— 0%</>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catégories de produits */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{tValue('popularProducts', lang)}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {PRODUCT_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => onNavigate('prices')}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-200 text-center group">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.emoji}</div>
              <div className="text-xs font-medium text-gray-700 group-hover:text-green-700 transition-colors">{cat.label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Prix tendances + Annonces récentes */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Prix tendances */}
        <section className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden card-hover">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" /> {tValue('todayTrends', lang)}
            </h2>
            <button onClick={() => onNavigate('prices')} className="text-sm text-green-600 hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto custom-scrollbar">
            {topPrices.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-green-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.product?.emoji || '📦'}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{p.product?.name || 'Produit'}</p>
                    <p className="text-xs text-gray-500">{p.market?.name || 'Marché'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{(p.price || 0).toLocaleString()} <span className="text-xs text-gray-500 font-normal">FCFA/{p.unit || 'kg'}</span></p>
                  <p className={`text-xs font-medium ${(p.variation || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {(p.variation || 0) >= 0 ? <span>▲ +{(p.variation || 0).toFixed(1)}%</span> : <span>▼ {(p.variation || 0).toFixed(1)}%</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Annonces récentes */}
        <section className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden card-hover">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-green-600" /> {tValue('latestListings', lang)}
            </h2>
            <button onClick={() => onNavigate('marketplace')} className="text-sm text-green-600 hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto custom-scrollbar">
            {latestListings.map((l, i) => (
              <div key={i} className="px-4 py-3 hover:bg-green-50/50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{l.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    l.type === 'vente' ? 'bg-green-100 text-green-700' : l.type === 'achat' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>{l.type === 'vente' ? '💰 Vente' : l.type === 'achat' ? '🛒 Achat' : '🔧 Service'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>👤 {l.sellerName || 'Vendeur'}</span>
                  {l.price && <span className="font-bold text-gray-700">{l.price.toLocaleString()} FCFA</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Météo rapide + Calendrier Agricole + Agriculteurs */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Météo widget */}
        <section className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden card-hover">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-sky-50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-blue-500" /> {tValue('quickWeather', lang)}
            </h2>
            <button onClick={() => onNavigate('weather')} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-5 gap-2 text-center">
              {WEATHER_DATA.map((w, i) => (
                <div key={i} className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 hover:shadow-md transition">
                  <span className="text-3xl mb-1">{w.icon}</span>
                  <p className="text-xs font-semibold text-gray-700 mb-0.5">{w.city}</p>
                  <p className="text-xl font-bold text-gray-900">{w.temp}°</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span className="text-[10px] text-gray-400">{w.humidity}%</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Weather advice strip */}
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-2 text-xs text-blue-700">
              <ThermometerSun className="w-4 h-4 shrink-0 text-blue-500" />
              <span>Conditions chaudes dans les régions du Nord — hydratez vos cultures et planifiez les semis tôt le matin.</span>
            </div>
          </div>
        </section>

        {/* Calendrier Agricole */}
        <section className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden card-hover">
          <div className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" /> 📅 Calendrier Agricole
            </h2>
          </div>
          <div className="p-4">
            {(() => {
              const month = new Date().getMonth();
              let activities: { emoji: string; text: string; color: string }[] = [];
              if (month >= 0 && month <= 2) {
                activities = [
                  { emoji: '🟫', text: 'Préparation des sols', color: 'text-amber-600' },
                  { emoji: '🥔', text: 'Récolte igname & manioc', color: 'text-green-600' },
                  { emoji: '🌱', text: 'Pépinières maraîchères', color: 'text-blue-600' },
                ];
              } else if (month >= 3 && month <= 5) {
                activities = [
                  { emoji: '🌽', text: 'Semis maïs, arachide, niébé, soja', color: 'text-yellow-600' },
                  { emoji: '💧', text: 'Irrigation des cultures', color: 'text-blue-600' },
                  { emoji: '🌱', text: 'Repiquage du riz', color: 'text-green-600' },
                ];
              } else if (month >= 6 && month <= 8) {
                activities = [
                  { emoji: '🌿', text: 'Désherbage & sarclage', color: 'text-green-600' },
                  { emoji: '🐛', text: 'Traitements phytosanitaires', color: 'text-red-600' },
                  { emoji: '🫘', text: 'Récolte niébé & soja', color: 'text-amber-600' },
                ];
              } else {
                activities = [
                  { emoji: '🌽', text: 'Récolte maïs, riz, arachide', color: 'text-yellow-600' },
                  { emoji: '🥔', text: 'Récolte igname & manioc', color: 'text-green-600' },
                  { emoji: '📦', text: 'Stockage & conservation', color: 'text-amber-700' },
                ];
              }
              const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
              return (
                <>
                  <div className="text-center mb-3">
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">{months[month]} {new Date().getFullYear()}</span>
                  </div>
                  <div className="space-y-2.5">
                    {activities.map((a, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm">
                        <span className="text-lg">{a.emoji}</span>
                        <span className={a.color + ' font-medium'}>{a.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-100 text-xs text-green-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Activités recommandées pour cette période</span>
                  </div>
                </>
              );
            })()}
          </div>
        </section>

        {/* Agriculteurs */}
        <section className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden card-hover">
          <div className="p-4 border-b bg-gradient-to-r from-amber-50 to-yellow-50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              👨‍🌾 {tValue('directoryFarmers', lang)}
            </h2>
          </div>
          <div className="divide-y">
            {SAMPLE_FARMERS.slice(0, 4).map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-amber-50/50 transition-colors">
                <span className="text-3xl">{f.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{f.name}</p>
                  <p className="text-xs text-gray-500">🌿 {f.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">📍 {f.region}</p>
                  <p className="text-sm font-bold text-yellow-500">⭐ {f.rating}/5</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {!dataLoaded && (
        <div className="text-center py-4">
          <p className="text-sm text-amber-600">⚡ Chargement des données en temps réel...</p>
        </div>
      )}
    </div>
  );
}
