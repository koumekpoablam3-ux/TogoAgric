'use client';
import { useState, useEffect } from 'react';
import { tValue, Language } from '@/lib/i18n';
import { SAMPLE_FARMERS } from '@/lib/togo-data';
import { MapPin, Star, Phone, Store } from 'lucide-react';

interface DirectorySectionProps {
  lang: Language;
}

export default function DirectorySection({ lang }: DirectorySectionProps) {
  const [markets, setMarkets] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'markets' | 'farmers'>('markets');
  const [regionFilter, setRegionFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      fetch('/api/markets').then(r => r.json()),
      fetch('/api/regions').then(r => r.json()),
    ]).then(([mrkts, regs]) => {
      setMarkets(mrkts || []);
      setRegions(regs || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredMarkets = markets.filter((m: any) => regionFilter === 'all' || m.regionId === regionFilter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{tValue('directory', lang)}</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('markets')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'markets' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}>
          🏪 {tValue('directoryMarkets', lang)}
        </button>
        <button onClick={() => setTab('farmers')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'farmers' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}>
          👨‍🌾 {tValue('directoryFarmers', lang)}
        </button>
      </div>

      {tab === 'markets' && (
        <>
          {/* Region filter */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setRegionFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${regionFilter === 'all' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-white text-gray-600 border'}`}>
              {tValue('allRegions', lang)}
            </button>
            {regions.map((r: any) => (
              <button key={r.id} onClick={() => setRegionFilter(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${regionFilter === r.id ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-white text-gray-600 border'}`}>
                {r.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>
          ) : filteredMarkets.length === 0 ? (
            <div className="text-center py-20 text-gray-400">{tValue('noData', lang)}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMarkets.map((m: any) => (
                <div key={m.id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm">{m.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{m.prefecture}, {m.region?.name}</span>
                      </div>
                    </div>
                  </div>
                  {m.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{m.description}</p>}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-gray-500">
                    <span>📊 {(m._count?.prices || 0)} prix</span>
                    <span>📋 {(m._count?.listings || 0)} annonces</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'farmers' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_FARMERS.map((f, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{f.emoji}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{f.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500"><MapPin className="w-3 h-3" /> {f.region}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{f.specialty}</p>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-1 text-sm text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="font-bold">{f.rating}</span>
                </div>
                <span className="text-xs text-green-600 font-medium">Voir profil →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
