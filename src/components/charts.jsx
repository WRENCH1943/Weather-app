
import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

import { toMinsIST, minsToHHMM } from "../api.jsx";

const TICK_STYLE = { fill: "#7faec0", fontSize: 10 };
const GRID_PROPS = { strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.05)" };

function CT({ active, payload, label, unit, custom }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ctt">
      <div className="ctt-label">{label}</div>
      {custom ? custom(payload) : payload.map((p,i) => (
        <div key={i} className="ctt-val" style={{ color: p.color }}>{p.name}: {p.value}{unit ? ` ${unit}` : ""}</div>
      ))}
    </div>
  );
}

function ZChart({ title, minW=700, extraControls, children }) {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="glass-card chart-card">
      <div className="chart-header">
        <span className="chart-title">{title}</span>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          {extraControls}
          <div className="zoom-controls">
            <button className="zoom-btn" onClick={() => setZoom(z=>Math.max(z-0.3,1))}>−</button>
            <button className="zoom-pct" onClick={() => setZoom(1)}>{Math.round(zoom*100)}%</button>
            <button className="zoom-btn" onClick={() => setZoom(z=>Math.min(z+0.3,5))}>+</button>
          </div>
        </div>
      </div>
      <div className="chart-wrap">
        <div style={{ minWidth: minW*zoom, height: 220 }}>{children()}</div>
      </div>
    </div>
  );
}

/* ── Hourly Charts ── */
function TempChart({ data }) {
  const [u, setU] = useState("C");
  const d = data.map(x => ({ ...x, temp: u==="F" ? +((x.temp*9/5)+32).toFixed(1) : x.temp }));
  return (
    <ZChart title="Temperature" extraControls={
      <div className="toggle-group">
        <button className={`toggle-btn ${u==="C"?"active":""}`} onClick={()=>setU("C")}>°C</button>
        <button className={`toggle-btn ${u==="F"?"active":""}`} onClick={()=>setU("F")}>°F</button>
      </div>
    }>
      {() => <ResponsiveContainer width="100%" height="100%">
        <LineChart data={d} margin={{top:8,right:20,left:0,bottom:0}}>
          <CartesianGrid {...GRID_PROPS}/>
          <XAxis dataKey="time" tick={TICK_STYLE} tickLine={false} axisLine={false}/>
          <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={44} unit={`°${u}`}/>
          <Tooltip content={<CT unit={`°${u}`}/>}/>
          <Line type="monotone" dataKey="temp" name="Temp" stroke="#14d2c8" strokeWidth={2} dot={false} activeDot={{r:5}}/>
        </LineChart>
      </ResponsiveContainer>}
    </ZChart>
  );
}

function HumChart({ data }) {
  return <ZChart title="Relative Humidity">
    {() => <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{top:8,right:20,left:0,bottom:0}}>
        <CartesianGrid {...GRID_PROPS}/><XAxis dataKey="time" tick={TICK_STYLE} tickLine={false} axisLine={false}/>
        <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={40} unit="%" domain={[0,100]}/>
        <Tooltip content={<CT unit="%"/>}/>
        <Line type="monotone" dataKey="value" name="Humidity" stroke="#818cf8" strokeWidth={2} dot={false} activeDot={{r:5}}/>
      </LineChart>
    </ResponsiveContainer>}
  </ZChart>;
}

function PChart({ data }) {
  return <ZChart title="Precipitation">
    {() => <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{top:8,right:20,left:0,bottom:0}}>
        <CartesianGrid {...GRID_PROPS}/><XAxis dataKey="time" tick={TICK_STYLE} tickLine={false} axisLine={false}/>
        <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={40} unit="mm"/>
        <Tooltip content={<CT unit="mm"/>}/>
        <Bar dataKey="value" name="Precip" fill="#38bdf8" radius={[3,3,0,0]}/>
      </BarChart>
    </ResponsiveContainer>}
  </ZChart>;
}

function VisChart({ data }) {
  return <ZChart title="Visibility">
    {() => <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{top:8,right:20,left:0,bottom:0}}>
        <CartesianGrid {...GRID_PROPS}/><XAxis dataKey="time" tick={TICK_STYLE} tickLine={false} axisLine={false}/>
        <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={52} tickFormatter={v=>`${(v/1000).toFixed(0)}km`}/>
        <Tooltip content={<CT unit="m"/>}/>
        <Line type="monotone" dataKey="value" name="Visibility" stroke="#34d399" strokeWidth={2} dot={false} activeDot={{r:5}}/>
      </LineChart>
    </ResponsiveContainer>}
  </ZChart>;
}

function WChart({ data }) {
  return <ZChart title="Wind Speed (10m)">
    {() => <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{top:8,right:20,left:0,bottom:0}}>
        <CartesianGrid {...GRID_PROPS}/><XAxis dataKey="time" tick={TICK_STYLE} tickLine={false} axisLine={false}/>
        <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={52} unit=" km/h"/>
        <Tooltip content={<CT unit="km/h"/>}/>
        <Line type="monotone" dataKey="value" name="Wind" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{r:5}}/>
      </LineChart>
    </ResponsiveContainer>}
  </ZChart>;
}

function PMHChart({ data }) {
  return <ZChart title="PM10 & PM2.5 (Hourly)">
    {() => <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{top:8,right:20,left:0,bottom:0}}>
        <CartesianGrid {...GRID_PROPS}/><XAxis dataKey="time" tick={TICK_STYLE} tickLine={false} axisLine={false}/>
        <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={48} unit="μg"/>
        <Tooltip content={<CT unit="μg/m³"/>}/>
        <Legend wrapperStyle={{fontSize:"0.72rem",color:"#7faec0"}}/>
        <Line type="monotone" dataKey="pm10" name="PM10" stroke="#f87171" strokeWidth={2} dot={false} activeDot={{r:5}}/>
        <Line type="monotone" dataKey="pm25" name="PM2.5" stroke="#fb923c" strokeWidth={2} dot={false} activeDot={{r:5}}/>
      </LineChart>
    </ResponsiveContainer>}
  </ZChart>;
}

/* ── Historical Charts ── */
function HTempChart({ data }) {
  return <ZChart title="Temperature — Mean / Max / Min" minW={900}>
    {() => <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{top:8,right:20,left:0,bottom:0}}>
        <CartesianGrid {...GRID_PROPS}/><XAxis dataKey="date" tick={TICK_STYLE} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
        <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={40} unit="°C"/>
        <Tooltip content={<CT unit="°C"/>}/>
        <Legend wrapperStyle={{fontSize:"0.72rem",color:"#7faec0"}}/>
        <Line type="monotone" dataKey="mean" name="Mean" stroke="#14d2c8" strokeWidth={1.5} dot={false}/>
        <Line type="monotone" dataKey="max" name="Max" stroke="#f87171" strokeWidth={1.5} dot={false}/>
        <Line type="monotone" dataKey="min" name="Min" stroke="#818cf8" strokeWidth={1.5} dot={false}/>
      </LineChart>
    </ResponsiveContainer>}
  </ZChart>;
}

function SunChart({ data }) {
  const conv = data.map(d => ({ ...d, sr: toMinsIST(d.sunrise), ss: toMinsIST(d.sunset) }));
  return <ZChart title="Sunrise & Sunset (IST)" minW={900}>
    {() => <ResponsiveContainer width="100%" height="100%">
      <LineChart data={conv} margin={{top:8,right:20,left:0,bottom:0}}>
        <CartesianGrid {...GRID_PROPS}/><XAxis dataKey="date" tick={TICK_STYLE} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
        <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={50} tickFormatter={minsToHHMM} domain={["auto","auto"]}/>
        <Tooltip content={<CT custom={pl=>pl.map((p,i)=><div key={i} className="ctt-val" style={{color:p.color}}>{p.name}: {minsToHHMM(p.value)}</div>)}/>}/>
        <Legend wrapperStyle={{fontSize:"0.72rem",color:"#7faec0"}}/>
        <Line type="monotone" dataKey="sr" name="Sunrise" stroke="#fbbf24" strokeWidth={1.5} dot={false}/>
        <Line type="monotone" dataKey="ss" name="Sunset" stroke="#f59e0b" strokeWidth={1.5} dot={false}/>
      </LineChart>
    </ResponsiveContainer>}
  </ZChart>;
}

function HPChart({ data }) {
  return <ZChart title="Total Precipitation" minW={900}>
    {() => <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{top:8,right:20,left:0,bottom:0}}>
        <CartesianGrid {...GRID_PROPS}/><XAxis dataKey="date" tick={TICK_STYLE} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
        <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={40} unit="mm"/>
        <Tooltip content={<CT unit="mm"/>}/>
        <Bar dataKey="value" name="Precip" fill="#38bdf8" radius={[2,2,0,0]} maxBarSize={10}/>
      </BarChart>
    </ResponsiveContainer>}
  </ZChart>;
}

function HWChart({ data }) {
  return <ZChart title="Max Wind Speed & Dominant Direction" minW={900}>
    {() => <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{top:8,right:20,left:0,bottom:0}}>
        <CartesianGrid {...GRID_PROPS}/><XAxis dataKey="date" tick={TICK_STYLE} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
        <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={52} unit=" km/h"/>
        <Tooltip content={<CT custom={pl=><><div className="ctt-val" style={{color:"#f59e0b"}}>Speed: {pl[0]?.value} km/h</div><div className="ctt-val" style={{color:"#818cf8"}}>Dir: {pl[0]?.payload?.dir}</div></>}/>}/>
        <Line type="monotone" dataKey="speed" name="Wind" stroke="#f59e0b" strokeWidth={1.5} dot={false} activeDot={{r:4}}/>
      </LineChart>
    </ResponsiveContainer>}
  </ZChart>;
}

function HPMChart({ data }) {
  return <ZChart title="PM10 & PM2.5 Daily Mean" minW={900}>
    {() => <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{top:8,right:20,left:0,bottom:0}}>
        <CartesianGrid {...GRID_PROPS}/><XAxis dataKey="date" tick={TICK_STYLE} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
        <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={48} unit="μg"/>
        <Tooltip content={<CT unit="μg/m³"/>}/>
        <Legend wrapperStyle={{fontSize:"0.72rem",color:"#7faec0"}}/>
        <Line type="monotone" dataKey="pm10" name="PM10" stroke="#f87171" strokeWidth={1.5} dot={false}/>
        <Line type="monotone" dataKey="pm25" name="PM2.5" stroke="#fb923c" strokeWidth={1.5} dot={false}/>
      </LineChart>
    </ResponsiveContainer>}
  </ZChart>;
}
export {
  TempChart,
  HumChart,
  PChart,
  VisChart,
  WChart,
  PMHChart,
  HTempChart,
  SunChart,
  HPChart,
  HWChart,
  HPMChart
};