import {STYLES} from "./style.jsx";
import { useState } from "react";
import { Page1 } from "./pages/Page1.jsx";
import { Page2 } from "./pages/Page2.jsx";

export default function App() {
  const [page, setPage] = useState(1);
  return (
    <>
      <style>{STYLES}</style>
      <div className="app-bg">
        <nav className="top-nav">
          <div className="nav-brand"><span className="brand-icon">◉</span>STRATOS</div>
          <div className="nav-tabs">
            <button className={`nav-tab ${page===1?"active":""}`} onClick={()=>setPage(1)}>Now &amp; Hourly</button>
            <button className={`nav-tab ${page===2?"active":""}`} onClick={()=>setPage(2)}>Historical</button>
          </div>
        </nav>
        <div className="page-content">
          {page===1 ? <Page1/> : <Page2/>}
        </div>
      </div>
    </>
  );
}