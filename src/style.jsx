
export const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-base: #060b14;
  --bg-surface: rgba(255,255,255,0.04);
  --bg-surface-hover: rgba(255,255,255,0.07);
  --bg-card: rgba(255,255,255,0.05);
  --border: rgba(255,255,255,0.09);
  --border-accent: rgba(20,210,200,0.35);
  --accent: #14d2c8;
  --accent-dim: rgba(20,210,200,0.18);
  --text-primary: #e8f4f8;
  --text-secondary: #7faec0;
  --text-muted: #4a7a8a;
  --danger: #f87171;
  --success: #34d399;
  --warn: #fbbf24;
  --font-display: 'Syne', sans-serif;
  --font-body: 'Outfit', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius: 14px;
  --radius-sm: 8px;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg-base); color: var(--text-primary); font-family: var(--font-body); font-size: 15px; line-height: 1.6; min-height: 100vh; overflow-x: hidden; }
.app-bg { min-height: 100vh; background: radial-gradient(ellipse 80% 60% at 10% 0%, rgba(20,210,200,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(129,140,248,0.05) 0%, transparent 60%), #060b14; }

.top-nav { display: flex; align-items: center; justify-content: space-between; padding: 0 24px; height: 60px; background: rgba(6,11,20,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
.nav-brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 800; font-size: 1.1rem; letter-spacing: 0.15em; color: var(--accent); }
.brand-icon { animation: spin 12s linear infinite; display:inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
.nav-tabs { display: flex; gap: 4px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: 100px; padding: 4px; }
.nav-tab { display: flex; align-items: center; gap: 6px; padding: 7px 18px; border-radius: 100px; border: none; background: transparent; color: var(--text-secondary); font-family: var(--font-body); font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
.nav-tab:hover { color: var(--text-primary); background: var(--bg-surface-hover); }
.nav-tab.active { background: var(--accent); color: #060b14; font-weight: 600; }

.page-content { padding: 28px 24px; max-width: 1400px; margin: 0 auto; }

.glass-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); backdrop-filter: blur(12px); box-shadow: 0 4px 32px rgba(0,0,0,0.4); transition: border-color 0.2s, box-shadow 0.2s; }
.glass-card:hover { border-color: var(--border-accent); box-shadow: 0 4px 32px rgba(0,0,0,0.4), 0 0 32px rgba(20,210,200,0.08); }

.section-title { font-family: var(--font-display); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
.section-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--border-accent), transparent); }

.location-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.location-display { display: flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; }
.location-pin { color: var(--accent); }
.search-form { display: flex; gap: 8px; align-items: center; flex: 1; max-width: 360px; }
.search-input { flex: 1; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 8px 14px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.875rem; outline: none; transition: border-color 0.2s; }
.search-input:focus { border-color: var(--accent); }
.search-input::placeholder { color: var(--text-muted); }

.btn { padding: 8px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg-surface); color: var(--text-primary); font-family: var(--font-body); font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.btn:hover { border-color: var(--accent); color: var(--accent); }
.btn-accent { background: var(--accent); border-color: var(--accent); color: #060b14; font-weight: 600; }
.btn-accent:hover { background: #11b8af; color: #060b14; }
.btn-sm { padding: 6px 14px; font-size: 0.8rem; }

.date-picker-row { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
.date-input { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 7px 12px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.875rem; outline: none; transition: border-color 0.2s; color-scheme: dark; }
.date-input:focus { border-color: var(--accent); }

.stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 10px; margin-bottom: 24px; }
.stat-card { padding: 16px; position: relative; overflow: hidden; }
.stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, var(--accent), transparent); opacity: 0; transition: opacity 0.3s; }
.stat-card:hover::before { opacity: 1; }
.stat-icon { font-size: 1.2rem; margin-bottom: 8px; display: block; }
.card-label { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; }
.card-value { font-family: var(--font-display); font-size: 1.65rem; font-weight: 700; line-height: 1; color: var(--text-primary); }
.card-unit { font-family: var(--font-body); font-size: 0.78rem; color: var(--text-secondary); margin-left: 3px; }

.aq-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-bottom: 24px; }
.aq-card { padding: 14px; text-align: center; }
.aq-value { font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; line-height: 1.1; }
.aq-label { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-top: 4px; }
.aq-unit { font-size: 0.62rem; color: var(--text-secondary); margin-top: 2px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 100px; font-size: 0.6rem; font-weight: 600; font-family: var(--font-mono); letter-spacing: 0.08em; margin-top: 6px; }
.badge-good { background: rgba(52,211,153,0.2); color: #34d399; }
.badge-moderate { background: rgba(251,191,36,0.2); color: #fbbf24; }
.badge-poor { background: rgba(248,113,113,0.2); color: #f87171; }
.badge-hazardous { background: rgba(167,85,247,0.2); color: #a855f7; }

.chart-card { padding: 18px; margin-bottom: 14px; }
.chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px; }
.chart-title { font-family: var(--font-display); font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
.chart-wrap { overflow-x: auto; scrollbar-width: thin; scrollbar-color: var(--accent) transparent; }
.chart-wrap::-webkit-scrollbar { height: 4px; }
.chart-wrap::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

.zoom-controls { display: flex; gap: 4px; align-items: center; }
.zoom-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-surface); color: var(--text-primary); font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.zoom-btn:hover { border-color: var(--accent); color: var(--accent); }
.zoom-pct { font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted); min-width: 38px; text-align: center; cursor: pointer; padding: 4px 6px; border-radius: 4px; border: 1px solid var(--border); background: var(--bg-surface); }
.zoom-pct:hover { color: var(--accent); }

.toggle-group { display: flex; gap: 3px; background: var(--bg-base); border: 1px solid var(--border); border-radius: 6px; padding: 3px; }
.toggle-btn { padding: 3px 10px; border-radius: 4px; border: none; background: transparent; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.7rem; cursor: pointer; transition: all 0.15s; }
.toggle-btn.active { background: var(--accent); color: #060b14; font-weight: 600; }

.ctt { background: rgba(6,11,20,0.96); border: 1px solid var(--border-accent); border-radius: var(--radius-sm); padding: 10px 14px; font-family: var(--font-body); font-size: 0.8rem; }
.ctt-label { font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-muted); margin-bottom: 4px; }
.ctt-val { font-weight: 600; font-size: 0.88rem; }

.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 180px; gap: 14px; color: var(--text-secondary); }
.spinner { width: 34px; height: 34px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .8s linear infinite; }
.error-state { background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.25); border-radius: var(--radius); padding: 18px; color: var(--danger); text-align: center; margin-bottom: 16px; }

.fade-in { animation: fadeIn 0.4s ease forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.date-range-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; padding: 14px 18px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); }
.range-sep { color: var(--text-muted); font-size: 0.8rem; }
.preset-pills { display: flex; gap: 6px; flex-wrap: wrap; }
.preset-pill { padding: 4px 12px; border-radius: 100px; border: 1px solid var(--border); background: transparent; color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.68rem; cursor: pointer; transition: all 0.15s; }
.preset-pill:hover, .preset-pill.active { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
.mono-label { font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 0.08em; color: var(--text-muted); }

@media (max-width: 640px) {
  .page-content { padding: 14px 12px; }
  .stat-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .aq-grid { grid-template-columns: repeat(3, 1fr); }
  .card-value { font-size: 1.3rem; }
  .top-nav { padding: 0 14px; }
  .nav-tab { padding: 7px 12px; font-size: 0.78rem; }
  .location-display { font-size: 1rem; }
}
`;
