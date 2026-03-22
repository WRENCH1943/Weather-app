import { useState, useEffect } from "react";
import { reverseGeocode } from "../api.jsx";


function useGeoLocation() {
  const [loc, setLoc] = useState(null);
  const [locName, setLocName] = useState("Detecting…");
  useEffect(() => {
    const fb = () => { setLoc({ lat:22.8046, lon:86.2029 }); setLocName("Jamshedpur, IN"); };
    if (!navigator.geolocation) { fb(); return; }
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude:lat, longitude:lon } = pos.coords;
      setLoc({ lat, lon });
      try { const i = await reverseGeocode(lat,lon); setLocName(`${i.name}${i.country?", "+i.country:""}`); }
      catch { setLocName(`${lat.toFixed(2)}, ${lon.toFixed(2)}`); }
    }, fb, { timeout:6000 });
  }, []);
  return { loc, locName, setLoc, setLocName };
}

function LocBar({ locName, onSearch }) {
  const [q, setQ] = useState("");
  const go = () => { if (q.trim()) { onSearch(q.trim()); setQ(""); } };
  return (
    <div className="location-bar">
      <div className="location-display"><span className="location-pin">◎</span><span>{locName}</span></div>
      <div className="search-form">
        <input className="search-input" placeholder="Search city…" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/>
        <button className="btn btn-accent btn-sm" onClick={go}>Go</button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, unit, accent }) {
  return (
    <div className="glass-card stat-card">
      <span className="stat-icon">{icon}</span>
      <div className="card-label">{label}</div>
      <div className="card-value" style={accent?{color:accent}:{}}>{value??"—"}{unit&&<span className="card-unit">{unit}</span>}</div>
    </div>
  );
}

function AQCard({ label, value, unit, accent }) {
  return (
    <div className="glass-card aq-card">
      <div className="aq-value" style={accent?{color:accent}:{}}>{value!=null?Number(value).toFixed(1):"—"}</div>
      <div className="aq-label">{label}</div>
      {unit&&<div className="aq-unit">{unit}</div>}
    </div>
  );
}

export {
  useGeoLocation,
  LocBar,
  StatCard,
  AQCard
};