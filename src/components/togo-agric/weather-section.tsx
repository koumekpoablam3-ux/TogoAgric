'use client';
import { useState, useEffect } from 'react';
import { tValue, Language } from '@/lib/i18n';
import { WEATHER_CONDITIONS, WEATHER_ADVICE } from '@/lib/togo-data';

interface WeatherSectionProps {
  lang: Language;
}

interface Region { id: string; name: string; capital: string; }
interface Forecast { date: string; tempMax: number; tempMin: number; humidity: number; condition: string; rainfall: number | null; windSpeed: number | null; }

export default function WeatherSection({ lang }: WeatherSectionProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/regions').then(r => r.json()).then(data => {
      setRegions(data || []);
      if (data && data.length > 0 && !selectedRegion) {
        setSelectedRegion(data[0].id);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedRegion) return;
    setLoading(true);
    fetch(`/api/weather?regionId=${selectedRegion}`)
      .then(r => r.json())
      .then(data => { setForecasts(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedRegion]);

  const getDayLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const diff = Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return tValue('today', lang);
    if (diff === 1) return 'Demain';
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
  };

  const currentCondition = forecasts[0]?.condition || 'ensoleille';
  const conditionInfo = WEATHER_CONDITIONS[currentCondition] || WEATHER_CONDITIONS.ensoleille;
  const advice = WEATHER_ADVICE[currentCondition] || '';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{tValue('weatherForecast', lang)}</h1>

      {/* Region selector */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {regions.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedRegion === r.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {i === 0 ? '🏖️' : i === 1 ? '⛰️' : i === 2 ? '🏘️' : i === 3 ? '🐄' : '🏜️'} {r.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" /></div>
      ) : forecasts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">{tValue('noData', lang)}</div>
      ) : (
        <>
          {/* Current weather highlight */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 md:p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">{regions.find(r => r.id === selectedRegion)?.name} — {tValue('today', lang)}</p>
                <p className="text-5xl font-bold mb-2">{forecasts[0]?.tempMax}°C</p>
                <p className="text-blue-100">{conditionInfo.emoji} {conditionInfo.label}</p>
              </div>
              <div className="text-7xl">{conditionInfo.emoji}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <p className="text-blue-200 text-xs">{tValue('humidity', lang)}</p>
                <p className="font-bold text-lg">{forecasts[0]?.humidity}%</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs">{tValue('windSpeed', lang)}</p>
                <p className="font-bold text-lg">{forecasts[0]?.windSpeed} km/h</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs">{tValue('rainfall', lang)}</p>
                <p className="font-bold text-lg">{forecasts[0]?.rainfall || 0} mm</p>
              </div>
            </div>
          </div>

          {/* Agricultural advice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-800 mb-1">🌱 {tValue('agriculturalAdvice', lang)}</p>
            <p className="text-sm text-amber-700">{advice}</p>
          </div>

          {/* 5-day forecast */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-bold text-gray-900">5 {tValue('weatherForecast', lang).toLowerCase()}</h2>
            </div>
            <div className="divide-y">
              {forecasts.map((f, i) => {
                const ci = WEATHER_CONDITIONS[f.condition] || WEATHER_CONDITIONS.ensoleille;
                return (
                  <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3 w-28">
                      <span className="text-2xl">{ci.emoji}</span>
                      <span className="text-sm font-medium text-gray-700">{getDayLabel(f.date)}</span>
                    </div>
                    <span className="text-xs text-gray-500">{ci.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">{f.tempMax}°</span>
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-red-400 rounded-full" style={{ width: `${((f.tempMax - 15) / 30) * 100}%` }} />
                      </div>
                      <span className="text-gray-500 text-sm">{f.tempMin}°</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 w-40 justify-end">
                      <span>💧 {f.humidity}%</span>
                      {f.rainfall && <span className="text-blue-500">{f.rainfall}mm</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
