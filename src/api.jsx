// API FUNCTIONS
export async function geocodeCity(q) {
  const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`);
  const d = await r.json();
  if (!d.results?.length) throw new Error("City not found");
  const x = d.results[0];
  return { lat: x.latitude, lon: x.longitude, name: x.name, country: x.country };
}

export async function reverseGeocode(lat, lon) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, { headers: { "Accept-Language": "en" } });
    const d = await r.json();
    return {
      name: d.address?.city || d.address?.town || d.address?.village || "Unknown",
      country: d.address?.country_code?.toUpperCase() || ""
    };
  } catch {
    return { name: "Unknown", country: "" };
  }
}

export async function fetchDayWeather(lat, lon, date) {
  const daily = "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,windspeed_10m_max,sunrise,sunset";
  const hourly = "temperature_2m,relativehumidity_2m,precipitation,visibility,windspeed_10m";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=${daily}&hourly=${hourly}&start_date=${date}&end_date=${date}&timezone=auto&current_weather=true`;

  const r = await fetch(url);
  if (!r.ok) throw new Error("Weather API error");
  return r.json();
}

export async function fetchAirQuality(lat, lon, date) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,us_aqi&start_date=${date}&end_date=${date}&timezone=auto`;

  const r = await fetch(url);
  if (!r.ok) throw new Error("AQ API error");
  return r.json();
}

export async function fetchHistorical(lat, lon, s, e) {
  const daily = "temperature_2m_mean,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant";
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&daily=${daily}&start_date=${s}&end_date=${e}&timezone=auto`;

  const r = await fetch(url);
  if (!r.ok) throw new Error("Historical API error");
  return r.json();
}

export async function fetchHistoricalAQ(lat, lon, s, e) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5&start_date=${s}&end_date=${e}&timezone=auto`;

  const r = await fetch(url);
  if (!r.ok) return null;
  return r.json();
}


// UTILS (same file for now)
export const todayStr = () => new Date().toISOString().slice(0, 10);

export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};

export const daysAgo = (n) => addDays(todayStr(), -n);

export const minHistDate = () => addDays(todayStr(), -730);

export function toIST(s) {
  if (!s) return "—";
  return new Date(s).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata"
  });
}

export function fmtDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  });
}

export function aqiCat(v) {
  if (v <= 50) return { label: "Good", cls: "badge-good", color: "#34d399" };
  if (v <= 100) return { label: "Moderate", cls: "badge-moderate", color: "#fbbf24" };
  if (v <= 150) return { label: "Sensitive", cls: "badge-moderate", color: "#fbbf24" };
  if (v <= 200) return { label: "Unhealthy", cls: "badge-poor", color: "#f87171" };
  if (v <= 300) return { label: "Very Unhealthy", cls: "badge-poor", color: "#f87171" };
  return { label: "Hazardous", cls: "badge-hazardous", color: "#a855f7" };
}
export function minsToHHMM(m) {
  if (m == null) return "--";
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
export function toMinsIST(s) {
  if (!s) return null;

  const d = new Date(s);
  const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);

  return ist.getUTCHours() * 60 + ist.getUTCMinutes();
}
export function hourlyToDailyMean(times, vals) {
  const m = {};

  (times || []).forEach((t, i) => {
    const d = t.slice(0, 10);
    if (!m[d]) m[d] = [];
    if (vals[i] != null) m[d].push(vals[i]);
  });

  return Object.entries(m).map(([date, v]) => ({
    date,
    value: v.length
      ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)
      : null
  }));
}

export function dirLabel(deg) {
  if (deg == null) return "—";
  return ["N","NE","E","SE","S","SW","W","NW"][
    Math.round(deg / 45) % 8
  ];
}