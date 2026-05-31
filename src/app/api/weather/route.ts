import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

// =============================================
// Météo RÉELLE via Open-Meteo API (gratuit, sans clé)
// Températures, humidité, vent, pluie — données réelles
// =============================================

// Coordonnées des capitales régionales du Togo
const REGION_COORDS: Record<string, { lat: number; lon: number }> = {
  'rvkztbnjwvrly7db9axk9': { lat: 6.1319, lon: 1.2228 },   // Maritime — Lomé
  'fom6efyenck7qf7i11hq1b': { lat: 7.5319, lon: 1.135 },     // Plateaux — Atakpamé
  'zc1yq3nbwma9795wwu3g4m': { lat: 9.2, lon: 1.1333 },      // Centrale — Sokodé
  '9ob5bzxffhdjk1wugb9d4l': { lat: 9.551, lon: 1.166 },     // Kara
  'ztle9wqkxnc5hzxvu8iza9': { lat: 10.86, lon: 0.23 },       // Savanes — Dapaong
};

const CONDITION_MAP: Record<string, { label: string; emoji: string }> = {
  'clearsky': { label: 'Ensoleillé', emoji: '☀️' },
  'mainly_clear': { label: 'Ensoleillé', emoji: '🌤️' },
  'partly_cloudy': { label: 'Partiellement nuageux', emoji: '⛅' },
  'overcast': { label: 'Nuageux', emoji: '☁️' },
  'fog': { label: 'Brouillard', emoji: '🌫️' },
  'drizzle': { label: 'Bruine', emoji: '🌦️' },
  'rainy': { label: 'Pluvieux', emoji: '🌧️' },
  'heavy_rain': { label: 'Fortes pluies', emoji: '🌧️' },
  'thunderstorm': { label: 'Orageux', emoji: '⛈️' },
  'snow': { label: 'Neige', emoji: '❄️' },
};

function mapWeatherCode(code: number): string {
  if (code === 0) return 'clearsky';
  if (code === 1) return 'mainly_clear';
  if (code === 2) return 'partly_cloudy';
  if (code === 3) return 'overcast';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code >= 56 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 63) return 'rainy';
  if (code >= 65 && code <= 67) return 'heavy_rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rainy';
  if (code >= 85 && code <= 86) return 'heavy_rain';
  if (code >= 95 && code <= 99) return 'thunderstorm';
  return 'clearsky';
}

function mapToConditionKey(code: number): string {
  if (code === 0 || code === 1) return 'ensoleille';
  if (code === 2 || code === 3) return 'nuageux';
  if (code >= 45 && code <= 48) return 'nuageux';
  if (code >= 51 && code <= 57) return 'pluvieux';
  if (code >= 61 && code <= 67) return 'pluvieux';
  if (code >= 71 && code <= 77) return 'nuageux';
  if (code >= 80 && code <= 86) return 'pluvieux';
  if (code >= 95 && code <= 99) return 'orageux';
  return 'ensoleille';
}

async function fetchRealWeather(lat: number, lon: number) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max,relative_humidity_2m_mean&timezone=Africa/Lome&forecast_days=5`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1h
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Fallback si l'API ne répond pas — données réalistes basées sur la saison
function generateFallback(regionId: string) {
  const month = new Date().getMonth() + 1;
  const profiles: Record<string, { tMax: number; tMin: number; hum: number }> = {
    'rvkztbnjwvrly7db9axk9': { tMax: 29, tMin: 24, hum: 78 }, // Lomé
    'fom6efyenck7qf7i11hq1b': { tMax: 27, tMin: 20, hum: 70 }, // Atakpamé
    'zc1yq3nbwma9795wwu3g4m': { tMax: 31, tMin: 22, hum: 55 }, // Sokodé
    '9ob5bzxffhdjk1wugb9d4l': { tMax: 33, tMin: 23, hum: 50 }, // Kara
    'ztle9wqkxnc5hzxvu8iza9': { tMax: 35, tMin: 25, hum: 40 }, // Dapaong
  };

  const p = profiles[regionId] || profiles['rvkztbnjwvrly7db9axk9'];
  // Ajustement saisonnier
  const seasonMod = (month >= 6 && month <= 10) ? -2 : (month >= 3 && month <= 5) ? 2 : 0;
  const rainChance = (month >= 6 && month <= 10) ? 0.5 : 0.15;

  const today = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const seed = date.getDate() * 31 + month * 7 + regionId.charCodeAt(0);
    const r = Math.abs(Math.sin(seed * 9301 + 49297) % 1);
    const willRain = r < rainChance;
    return {
      date: date.toISOString().split('T')[0],
      tempMax: p.tMax + seasonMod + Math.round((r - 0.5) * 3),
      tempMin: p.tMin + seasonMod + Math.round((r - 0.5) * 2),
      humidity: p.hum + Math.round((r - 0.5) * 10),
      windSpeed: 10 + Math.round(r * 8),
      rainfall: willRain ? Math.round(r * 25 + 3) : null,
      condition: willRain ? (r > 0.8 ? 'orageux' : 'pluvieux') : 'ensoleille',
      realData: false,
    };
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('regionId');

    if (!regionId) {
      return NextResponse.json({ error: 'regionId requis' }, { status: 400 });
    }

    const db = getDb();
    const region = db.Region.find(r => r.id === regionId);
    if (!region) {
      return NextResponse.json({ error: 'Region inconnue' }, { status: 404 });
    }

    const coords = REGION_COORDS[regionId];
    let forecasts: any[] = [];

    if (coords) {
      const weatherData = await fetchRealWeather(coords.lat, coords.lon);

      if (weatherData && weatherData.daily) {
        const d = weatherData.daily;
        forecasts = (d.time || []).map((date: string, i: number) => {
          const wCode = (d.weathercode?.[i]) ?? 0;
          const rain = d.precipitation_sum?.[i] ?? 0;
          return {
            id: `wf-${regionId}-${i}`,
            regionId,
            date,
            tempMax: Math.round(d.temperature_2m_max?.[i] ?? 28),
            tempMin: Math.round(d.temperature_2m_min?.[i] ?? 22),
            humidity: Math.round(d.relative_humidity_2m_mean?.[i] ?? 60),
            windSpeed: Math.round(d.windspeed_10m_max?.[i] ?? 10),
            rainfall: rain > 0 ? Math.round(rain * 10) / 10 : null,
            condition: mapToConditionKey(wCode),
            weatherCode: wCode,
            conditionLabel: CONDITION_MAP[mapWeatherCode(wCode)]?.label || 'Ensoleillé',
            conditionEmoji: CONDITION_MAP[mapWeatherCode(wCode)]?.emoji || '☀️',
            realData: true,
            source: 'Open-Meteo',
          };
        });
      }
    }

    // Fallback si pas de données réelles
    if (forecasts.length === 0) {
      forecasts = generateFallback(regionId).map((f, i) => ({
        ...f,
        id: `wf-${regionId}-${i}`,
        regionId,
        conditionLabel: f.condition === 'ensoleille' ? 'Ensoleillé' : f.condition === 'nuageux' ? 'Nuageux' : f.condition === 'pluvieux' ? 'Pluvieux' : 'Orageux',
        conditionEmoji: f.condition === 'ensoleille' ? '☀️' : f.condition === 'nuageux' ? '☁️' : f.condition === 'pluvieux' ? '🌧️' : '⛈️',
      }));
    }

    const result = forecasts.map(f => ({
      ...f,
      regionName: region.name,
      regionCapital: region.capital,
      region: { id: region.id, name: region.name, capital: region.capital },
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Weather error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
