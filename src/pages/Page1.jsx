console.log("page1 running");
import { useState, useEffect, useCallback } from "react";

import {
  TempChart,
  HumChart,
  PChart,
  VisChart,
  WChart,
  PMHChart
} from "../components/charts";

import {
  geocodeCity,
  fetchDayWeather,
  fetchAirQuality,
  todayStr,
  aqiCat,
  toIST
} from "../api.jsx";

import {
  useGeoLocation,
  LocBar,
  StatCard,
  AQCard
} from "../components/shared";


export function Page1() {
  const { loc, locName, setLoc, setLocName } = useGeoLocation();
  const [selDate, setSelDate] = useState(todayStr());
  const [aqDate, setAqDate] = useState(todayStr());
  const [wx, setWx] = useState(null);
  const [aq, setAq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aqLoad, setAqLoad] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!loc) return;
    setLoading(true); setErr(null);
    fetchDayWeather(loc.lat, loc.lon, selDate)
      .then(d => { setWx(d); setLoading(false); })
      .catch(e => { setErr(e.message); setLoading(false); });
  }, [loc, selDate]);

  useEffect(() => {
    if (!loc) return;
    setAqLoad(true);
    fetchAirQuality(loc.lat, loc.lon, aqDate)
      .then(d => { setAq(d); setAqLoad(false); })
      .catch(() => setAqLoad(false));
  }, [loc, aqDate]);

  const handleSearch = useCallback(async q => {
    try { const g = await geocodeCity(q); setLoc({lat:g.lat,lon:g.lon}); setLocName(`${g.name}, ${g.country}`); }
    catch { alert("City not found."); }
  }, []);

  const daily = wx?.daily;
  const hourly = wx?.hourly;
  const times = hourly?.time ?? [];
  const idxs = times.reduce((a,t,i) => { if (t.startsWith(selDate)) a.push(i); return a; }, []);
  const lbl = i => times[i]?.slice(11,16) ?? "";

  const tempD = idxs.map(i=>({time:lbl(i),temp:hourly.temperature_2m[i]}));
  const humD  = idxs.map(i=>({time:lbl(i),value:hourly.relativehumidity_2m[i]}));
  const preD  = idxs.map(i=>({time:lbl(i),value:hourly.precipitation[i]}));
  const visD  = idxs.map(i=>({time:lbl(i),value:hourly.visibility[i]}));
  const winD  = idxs.map(i=>({time:lbl(i),value:hourly.windspeed_10m[i]}));

  const aqT = aq?.hourly?.time ?? [];
  const aqI = aqT.reduce((a,t,i) => { if (t.startsWith(aqDate)) a.push(i); return a; }, []);
  const pmD = aqI.map(i=>({time:aqT[i]?.slice(11,16)??"",pm10:aq.hourly.pm10[i],pm25:aq.hourly.pm2_5[i]}));
  const mid = aqI[Math.floor(aqI.length/2)];
  const snap = mid!=null ? { aqi:aq?.hourly?.us_aqi?.[mid], pm10:aq?.hourly?.pm10?.[mid], pm25:aq?.hourly?.pm2_5?.[mid], co:aq?.hourly?.carbon_monoxide?.[mid], no2:aq?.hourly?.nitrogen_dioxide?.[mid], so2:aq?.hourly?.sulphur_dioxide?.[mid] } : null;
  const cat = snap?.aqi!=null ? aqiCat(snap.aqi) : null;
  const avgH = humD.length ? Math.round(humD.reduce((a,b)=>a+b.value,0)/humD.length) : null;

  return (
    <div>
      <LocBar locName={locName} onSearch={handleSearch}/>
      <div className="date-picker-row">
        <span className="mono-label">DATE</span>
        <input type="date" className="date-input" value={selDate} max={todayStr()} onChange={e=>setSelDate(e.target.value)}/>
      </div>

      {loading && <div className="loading-state"><div className="spinner"/><span>Fetching weather…</span></div>}
      {err && <div className="error-state">⚠ {err}</div>}

      {!loading && !err && daily && (
        <div className="fade-in">
          <div className="section-title">Conditions</div>
          <div className="stat-grid">
            <StatCard icon="🌡" label="Current Temp" value={wx?.current_weather?.temperature} unit="°C" accent="var(--accent)"/>
            <StatCard icon="🔺" label="Max Temp" value={daily.temperature_2m_max?.[0]} unit="°C" accent="#f87171"/>
            <StatCard icon="🔻" label="Min Temp" value={daily.temperature_2m_min?.[0]} unit="°C" accent="#818cf8"/>
            <StatCard icon="💧" label="Precipitation" value={daily.precipitation_sum?.[0]} unit="mm"/>
            <StatCard icon="💦" label="Avg Humidity" value={avgH} unit="%"/>
            <StatCard icon="☀️" label="UV Index Max" value={daily.uv_index_max?.[0]} accent="#f59e0b"/>
            <StatCard icon="🌅" label="Sunrise (IST)" value={toIST(daily.sunrise?.[0])}/>
            <StatCard icon="🌇" label="Sunset (IST)" value={toIST(daily.sunset?.[0])}/>
            <StatCard icon="💨" label="Max Wind" value={daily.windspeed_10m_max?.[0]} unit="km/h"/>
            <StatCard icon="🌂" label="Precip Prob" value={daily.precipitation_probability_max?.[0]} unit="%"/>
          </div>

          <div className="section-title" style={{marginTop:8}}>Air Quality</div>
          <div className="date-picker-row">
            <span className="mono-label">AQ DATE</span>
            <input type="date" className="date-input" value={aqDate} max={todayStr()} onChange={e=>setAqDate(e.target.value)}/>
          </div>

          {aqLoad ? <div className="loading-state" style={{minHeight:100}}><div className="spinner"/></div>
            : snap ? (
              <div className="aq-grid">
                <div className="glass-card aq-card">
                  <div className="aq-value" style={{color:cat?.color??"var(--text-primary)"}}>{snap.aqi!=null?Math.round(snap.aqi):"—"}</div>
                  <div className="aq-label">US AQI</div>
                  {cat&&<span className={`badge ${cat.cls}`}>{cat.label}</span>}
                </div>
                <AQCard label="PM10" value={snap.pm10} unit="μg/m³" accent="#f87171"/>
                <AQCard label="PM2.5" value={snap.pm25} unit="μg/m³" accent="#fb923c"/>
                <AQCard label="CO" value={snap.co} unit="μg/m³"/>
                <AQCard label="NO₂" value={snap.no2} unit="μg/m³" accent="#818cf8"/>
                <AQCard label="SO₂" value={snap.so2} unit="μg/m³" accent="#fbbf24"/>
              </div>
            ) : <div className="error-state">Air quality data unavailable for this date.</div>
          }

          <div className="section-title" style={{marginTop:8}}>Hourly Breakdown</div>
          {tempD.length > 0 ? <>
            <TempChart data={tempD}/>
            <HumChart data={humD}/>
            <PChart data={preD}/>
            <VisChart data={visD}/>
            <WChart data={winD}/>
            {pmD.length>0 && <PMHChart data={pmD}/>}
          </> : <div className="error-state">No hourly data for this date.</div>}
        </div>
      )}
    </div>
  );
}
