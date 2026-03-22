import {
  HTempChart,
  SunChart,
  HPChart,
  HWChart,
  HPMChart
} from "../components/charts";

import { useGeoLocation,LocBar } from "../components/shared";
import { useState,useEffect,useCallback } from "react";
import {
  daysAgo,
  todayStr,
  minHistDate,
  fetchHistorical,
  fetchHistoricalAQ,
  fmtDate,
  geocodeCity,
  addDays,
  hourlyToDailyMean,
  dirLabel
} from "../api.jsx";



const PRESETS = [{label:"30d",days:30},{label:"90d",days:90},{label:"6mo",days:180},{label:"1yr",days:365},{label:"2yr",days:730}];


export function Page2() {
  const { loc, locName, setLoc, setLocName } = useGeoLocation();
  const [start, setStart] = useState(daysAgo(30));
  const [end, setEnd] = useState(todayStr());
  const [preset, setPreset] = useState("30d");
  const [hist, setHist] = useState(null);
  const [aqD, setAqD] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!loc) return;
    setLoading(true); setErr(null);
    Promise.all([fetchHistorical(loc.lat,loc.lon,start,end), fetchHistoricalAQ(loc.lat,loc.lon,start,end)])
      .then(([h,a]) => { setHist(h); setAqD(a); setLoading(false); })
      .catch(e => { setErr(e.message); setLoading(false); });
  }, [loc, start, end]);

  const handleSearch = useCallback(async q => {
    try { const g = await geocodeCity(q); setLoc({lat:g.lat,lon:g.lon}); setLocName(`${g.name}, ${g.country}`); }
    catch { alert("City not found."); }
  }, []);

  const applyPreset = p => { setPreset(p.label); setStart(daysAgo(p.days)); setEnd(todayStr()); };
  const onStart = v => { setPreset(null); const mx=addDays(v,730); setStart(v); if(end>mx)setEnd(mx); };
  const onEnd = v => { setPreset(null); const mn=addDays(v,-730); setEnd(v); if(start<mn)setStart(mn); };

  const d = hist?.daily;
  const tempCD  = d?.time?.map((x,i)=>({date:fmtDate(x),mean:d.temperature_2m_mean?.[i],max:d.temperature_2m_max?.[i],min:d.temperature_2m_min?.[i]}))??[];
  const sunCD   = d?.time?.map((x,i)=>({date:fmtDate(x),sunrise:d.sunrise?.[i],sunset:d.sunset?.[i]}))??[];
  const precipCD= d?.time?.map((x,i)=>({date:fmtDate(x),value:d.precipitation_sum?.[i]}))??[];
  const windCD  = d?.time?.map((x,i)=>({date:fmtDate(x),speed:d.windspeed_10m_max?.[i],dir:dirLabel(d.winddirection_10m_dominant?.[i])}))??[];
  const pm10D = aqD ? hourlyToDailyMean(aqD.hourly.time, aqD.hourly.pm10) : [];
  const pm25D = aqD ? hourlyToDailyMean(aqD.hourly.time, aqD.hourly.pm2_5) : [];
  const pmCD = pm10D.map((x,i)=>({date:fmtDate(x.date),pm10:x.value,pm25:pm25D[i]?.value??null}));

  return (
    <div>
      <LocBar locName={locName} onSearch={handleSearch}/>
      <div className="date-range-bar">
        <span className="mono-label">FROM</span>
        <input type="date" className="date-input" value={start} min={minHistDate()} max={end} onChange={e=>onStart(e.target.value)}/>
        <span className="range-sep">→</span>
        <input type="date" className="date-input" value={end} min={start} max={todayStr()} onChange={e=>onEnd(e.target.value)}/>
        <div className="preset-pills">
          {PRESETS.map(p=><button key={p.label} className={`preset-pill ${preset===p.label?"active":""}`} onClick={()=>applyPreset(p)}>{p.label}</button>)}
        </div>
      </div>

      {loading && <div className="loading-state"><div className="spinner"/><span>Loading historical data…</span></div>}
      {err && <div className="error-state">⚠ {err}</div>}

      {!loading && !err && hist && (
        <div className="fade-in">
          <div className="section-title">Temperature Trends</div>
          <HTempChart data={tempCD}/>
          <div className="section-title">Sun Cycle (IST)</div>
          <SunChart data={sunCD}/>
          <div className="section-title">Precipitation</div>
          <HPChart data={precipCD}/>
          <div className="section-title">Wind</div>
          <HWChart data={windCD}/>
          <div className="section-title">Air Quality Trends</div>
          {pmCD.length>0 ? <HPMChart data={pmCD}/> : <div className="error-state">PM data unavailable for this range.</div>}
        </div>
      )}
    </div>
  );
}
