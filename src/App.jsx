import React, { useState, useEffect, useRef, useMemo } from "react";
 
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:wght@300;400;500;600&display=swap";
 
/* ─────────────────────────── CSS ─────────────────────────────────────────── */
const CSS = `
  :root {
    --void:#02030d; --panel:rgba(8,14,35,.82);
    --bdim:rgba(99,179,237,.12); --bglow:rgba(99,179,237,.4);
    --cyan:#38bdf8; --cdim:rgba(56,189,248,.14);
    --purple:#a78bfa; --pdim:rgba(167,139,250,.14);
    --gold:#fbbf24; --green:#34d399; --red:#f87171;
    --tbr:#e2eeff; --tmid:#7ea3c4; --tdim:#3d607e;
    --fh:'Orbitron',monospace; --fb:'Exo 2',sans-serif;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--void);font-family:var(--fb);color:var(--tbr);min-height:100vh}
 
  /* starfield */
  .sf{position:fixed;inset:0;z-index:0;pointer-events:none;
    background:radial-gradient(ellipse 80% 50% at 20% 10%,rgba(56,189,248,.04) 0%,transparent 60%),
               radial-gradient(ellipse 60% 40% at 80% 90%,rgba(167,139,250,.05) 0%,transparent 60%)}
  .star{position:absolute;border-radius:50%;background:#fff;
    animation:twinkle var(--d,3s) var(--dl,0s) ease-in-out infinite}
  @keyframes twinkle{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}
 
  /* panels */
  .panel{background:var(--panel);backdrop-filter:blur(16px);
    border:1px solid var(--bdim);border-radius:18px;transition:border-color .3s}
  .panel:hover{border-color:var(--bglow)}
  .lbl{font-family:var(--fh);font-size:.6rem;letter-spacing:.2em;color:var(--tdim);text-transform:uppercase}
 
  /* timer digits */
  .digits{font-family:var(--fh);font-size:clamp(3rem,10vw,4.8rem);font-weight:700;line-height:1;
    color:var(--cyan);text-shadow:0 0 22px rgba(56,189,248,.7),0 0 44px rgba(56,189,248,.3);letter-spacing:.04em}
  .digits.free{color:var(--purple);text-shadow:0 0 22px rgba(167,139,250,.7)}
 
  /* tabs */
  .tabs{display:flex;border-radius:12px;overflow:hidden;border:1px solid var(--bdim)}
  .tab{flex:1;padding:10px 0;font-family:var(--fh);font-size:.6rem;letter-spacing:.12em;
    background:transparent;color:var(--tdim);border:none;cursor:pointer;transition:all .25s}
  .tab.on{background:var(--cdim);color:var(--cyan)}
  .tab.on.ft{background:var(--pdim);color:var(--purple)}
 
  /* presets */
  .pre{padding:7px 14px;border-radius:8px;font-family:var(--fh);font-size:.65rem;letter-spacing:.08em;
    background:transparent;color:var(--tmid);border:1px solid var(--bdim);cursor:pointer;transition:all .2s}
  .pre:hover,.pre.on{background:var(--cdim);color:var(--cyan);border-color:var(--cyan)}
  .ci{width:76px;padding:7px 10px;border-radius:8px;text-align:center;
    font-family:var(--fh);font-size:.65rem;background:transparent;color:var(--cyan);
    border:1px solid var(--bdim);outline:none;transition:border .2s}
  .ci:focus{border-color:var(--cyan)}
  .ci::placeholder{color:var(--tdim)}
  input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{opacity:.3}
 
  /* buttons */
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;
    padding:12px 26px;border-radius:10px;border:none;cursor:pointer;
    font-family:var(--fh);font-size:.68rem;letter-spacing:.12em;font-weight:600;
    transition:all .25s;text-transform:uppercase}
  .btn-go{background:linear-gradient(135deg,#1e3a5f,#2d1b6b);color:var(--cyan);
    border:1px solid var(--cyan);box-shadow:0 0 14px rgba(56,189,248,.2)}
  .btn-go:hover{box-shadow:0 0 26px rgba(56,189,248,.45);transform:translateY(-2px)}
  .btn-gof{background:linear-gradient(135deg,#1a0e3f,#2e1060);color:var(--purple);
    border:1px solid var(--purple);box-shadow:0 0 14px rgba(167,139,250,.2)}
  .btn-gof:hover{box-shadow:0 0 26px rgba(167,139,250,.45);transform:translateY(-2px)}
  .btn-stop{background:linear-gradient(135deg,#3b0a0a,#5a0a2a);color:var(--red);
    border:1px solid var(--red);box-shadow:0 0 14px rgba(248,113,113,.2)}
  .btn-stop:hover{box-shadow:0 0 26px rgba(248,113,113,.4);transform:translateY(-2px)}
 
  /* category chips */
  .chip{padding:5px 13px;border-radius:999px;cursor:pointer;transition:all .2s;
    font-family:var(--fb);font-size:.78rem;font-weight:500;
    background:transparent;color:var(--tdim);border:1px solid var(--bdim)}
  .chip.on{background:var(--cdim);color:var(--cyan);border-color:rgba(56,189,248,.5)}
  .chip:hover:not(.on):not(:disabled){color:var(--tmid);border-color:var(--bglow)}
  /* locked state during active session */
  .chip:disabled{opacity:.28;cursor:not-allowed;pointer-events:none}
 
  /* module badges */
  .mbadge{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:10px;
    font-family:var(--fb);font-size:.8rem;font-weight:500;
    border:1px solid transparent;transition:all .5s}
  .mbadge.lk{background:rgba(255,255,255,.03);color:var(--tdim);border-color:rgba(255,255,255,.05)}
  .dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
 
  /* history rows */
  .hrow{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:10px;
    background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.04);
    font-size:.82rem;color:var(--tmid);transition:background .2s}
  .hrow:hover{background:rgba(56,189,248,.04)}
  .sc::-webkit-scrollbar{width:4px}
  .sc::-webkit-scrollbar-track{background:transparent}
  .sc::-webkit-scrollbar-thumb{background:rgba(56,189,248,.2);border-radius:2px}
 
  /* unlock progress bar */
  .ubt{height:4px;border-radius:2px;background:rgba(255,255,255,.06);overflow:hidden}
  .ubf{height:100%;border-radius:2px;transition:width .6s ease}
 
  /* timer glow + ping */
  .tglow{position:absolute;inset:-20%;border-radius:50%;filter:blur(38px);opacity:.1;
    animation:gpulse 3s ease-in-out infinite;pointer-events:none}
  @keyframes gpulse{0%,100%{opacity:.07;transform:scale(1)}50%{opacity:.16;transform:scale(1.08)}}
  @keyframes ping{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.65);opacity:0}}
  .ping{animation:ping 1.8s ease-out infinite}
 
  /* fade-in entrance */
  .fi{animation:fup .45s ease both}
  @keyframes fup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
 
  .ring-track{transition:stroke-dashoffset .55s cubic-bezier(.4,0,.2,1)}
 
  /* ── modal base ── */
  .mo{position:fixed;inset:0;z-index:999;background:rgba(0,0,0,.82);
    backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:16px}
  .mb{background:linear-gradient(145deg,rgba(10,5,28,.99),rgba(8,14,35,.99));
    border-radius:22px;padding:34px 28px;text-align:center;max-width:430px;width:100%;
    animation:mbin .38s cubic-bezier(.34,1.56,.64,1);position:relative;overflow:hidden}
  @keyframes mbin{from{opacity:0;transform:scale(.7) translateY(28px)}to{opacity:1;transform:scale(1) translateY(0)}}
  @keyframes bpop{0%{transform:scale(.8);opacity:0}100%{transform:scale(1);opacity:1}}
 
  /* ── crash rings ── */
  @keyframes ering{0%{r:8;opacity:1;stroke-width:3}100%{r:58;opacity:0;stroke-width:.5}}
  .er1{animation:ering .85s ease-out forwards}
  .er2{animation:ering .85s .25s ease-out forwards}
  @keyframes spline{0%{transform:scaleX(0);opacity:.8}100%{transform:scaleX(1);opacity:0}}
 
  /* ── module-unlock SVG anims ── */
  @keyframes bdrop{0%{transform:scaleY(0);opacity:0}40%{transform:scaleY(1);opacity:1}80%{opacity:1}100%{opacity:0}}
  .sbeam{animation:bdrop 2.2s ease forwards;transform-origin:top center}
  @keyframes dgrow{0%{transform:scale(0);opacity:0}60%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:1}}
  .dgrow{animation:dgrow 1.2s cubic-bezier(.34,1.56,.64,1) forwards}
  @keyframes sorbit{from{transform:rotate(0deg) translateX(46px) rotate(0deg)}
    to{transform:rotate(360deg) translateX(46px) rotate(-360deg)}}
  .sorbit{animation:sorbit 2s linear infinite;transform-origin:0 0}
  @keyframes wout{0%{r:8;opacity:.9}100%{r:52;opacity:0}}
  .cw1{animation:wout 1.6s 0s ease-out infinite}
  .cw2{animation:wout 1.6s .5s ease-out infinite}
  .cw3{animation:wout 1.6s 1s ease-out infinite}
  @keyframes wspin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .wspin{animation:wspin 2s linear infinite;transform-origin:70px 65px}
  @keyframes wcore{0%,100%{r:10;opacity:.6}50%{r:14;opacity:1}}
  .wcore{animation:wcore .9s ease-in-out infinite}
 
  /* ── mission success ── */
  /* expanding glow rings */
  @keyframes sring{0%{r:14;opacity:.9;stroke-width:3}100%{r:80;opacity:0;stroke-width:.3}}
  .sring1{animation:sring 1.1s .05s ease-out forwards}
  .sring2{animation:sring 1.1s .3s  ease-out forwards}
  .sring3{animation:sring 1.1s .55s ease-out forwards}
  /* tick checkmark draw */
  @keyframes tick{from{stroke-dashoffset:52}to{stroke-dashoffset:0}}
  .tick{stroke-dasharray:52;stroke-dashoffset:52;animation:tick .55s .25s ease-out forwards}
  /* rocket flies up and fades */
  @keyframes rlaunch{0%{transform:translateY(0) scale(1);opacity:1}
    55%{transform:translateY(-50px) scale(1.18);opacity:1}
    100%{transform:translateY(-100px) scale(.7);opacity:0}}
  .rlaunch{animation:rlaunch 1.8s .1s ease-in forwards}
  /* star particles burst */
  @keyframes spark{0%{transform:translate(0,0) scale(1.2);opacity:1}
    100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
  .spark{animation:spark .9s var(--sd,0s) ease-out both}
  /* success badge pop */
  @keyframes sbadge{0%{transform:scale(0) rotate(-12deg);opacity:0}
    65%{transform:scale(1.1) rotate(2deg);opacity:1}
    100%{transform:scale(1) rotate(0deg);opacity:1}}
  .sbadge{animation:sbadge .6s .15s cubic-bezier(.34,1.56,.64,1) both}
  /* outer glow pulse on success modal */
  @keyframes mglow{0%,100%{box-shadow:0 0 40px rgba(56,189,248,.15),0 0 80px rgba(56,189,248,.05)}
    50%{box-shadow:0 0 60px rgba(56,189,248,.35),0 0 120px rgba(56,189,248,.12)}}
  .mglow{animation:mglow 2s ease-in-out infinite}
 
  /* ── all-done confetti ── */
  @keyframes cffall{0%{transform:translateY(-16px) rotate(0deg);opacity:1}
    100%{transform:translateY(90px) rotate(720deg);opacity:0}}
  @keyframes rbw{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}
  .rbw{animation:rbw 3s linear infinite}
 
  @media(min-width:720px){.twocol{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}}
`;
 
/* ─────────────────────────── helpers ─────────────────────────────────────── */
function fmt(s) {
  const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sc=s%60;
  if(h>0) return `${h}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;
  return `${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;
}
function fmtm(s) {
  const h=Math.floor(s/3600), m=Math.floor((s%3600)/60);
  return h>0 ? `${h}h ${m}m` : `${m}m`;
}
 
/* ─────────────────────────── data ────────────────────────────────────────── */
const MODS = [
  {id:"solar", name:"Solar Panels", thr:600,   col:"#fbbf24", icon:"◈", desc:"Power grid online — the station hums to life."},
  {id:"bio",   name:"Biodome",      thr:1800,  col:"#34d399", icon:"⬡", desc:"Life support active. Oxygen flowing."},
  {id:"sat",   name:"Satellite",    thr:3600,  col:"#38bdf8", icon:"✦", desc:"Orbital link established. Signal strong."},
  {id:"comms", name:"Comm Array",   thr:7200,  col:"#a78bfa", icon:"⊛", desc:"Deep-space channel open. Transmitting."},
  {id:"warp",  name:"Warp Core",    thr:18000, col:"#f87171", icon:"⊕", desc:"FTL drive primed. Stars await."},
];
const CATS = ["Coding","Studying","Designing","Writing","Research","Other"];
 
/* ─────────────────────────── Starfield ───────────────────────────────────── */
function Starfield() {
  const stars = useMemo(() => Array.from({length:65},(_,i)=>({
    id:i, left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
    sz:Math.random()*1.6+0.4, d:`${Math.random()*4+2}s`, dl:`${Math.random()*5}s`,
  })),[]);
  return (
    <div className="sf">
      {stars.map(s=>(
        <div key={s.id} className="star"
          style={{left:s.left,top:s.top,width:s.sz,height:s.sz,"--d":s.d,"--dl":s.dl}}/>
      ))}
    </div>
  );
}
 
/* ─────────────────────────── Ring ────────────────────────────────────────── */
function Ring({pct=0,size=190,sw=7,color="#38bdf8"}) {
  const r=(size-sw*2)/2, circ=2*Math.PI*r, off=circ*(1-Math.min(pct,1));
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(56,189,248,0.07)" strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        className="ring-track" style={{filter:`drop-shadow(0 0 5px ${color})`}}/>
    </svg>
  );
}
 
/* ─────────────────────── Module unlock SVGs ──────────────────────────────── */
function SolarSVG() {
  return (
    <svg width="140" height="148" viewBox="0 0 140 148">
      <defs>
        <linearGradient id="bg_solar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0"/>
          <stop offset="50%" stopColor="#fde68a" stopOpacity=".95"/>
          <stop offset="100%" stopColor="#fbbf24" stopOpacity=".7"/>
        </linearGradient>
      </defs>
      <circle cx="70" cy="18" r="12" fill="#fbbf24" opacity=".9" style={{filter:"drop-shadow(0 0 7px #fbbf24)"}}/>
      {[0,45,90,135,180,225,270,315].map(a=>(
        <line key={a} x1={70+Math.cos(a*Math.PI/180)*14} y1={18+Math.sin(a*Math.PI/180)*14}
          x2={70+Math.cos(a*Math.PI/180)*21} y2={18+Math.sin(a*Math.PI/180)*21}
          stroke="#fde68a" strokeWidth="1.5" opacity=".8"/>
      ))}
      <rect x="65" y="30" width="10" height="50" rx="5" fill="url(#bg_solar)" className="sbeam"/>
      <circle cx="70" cy="82" r="14" fill="#fbbf24" opacity=".18"/>
      <g style={{animation:"bpop .5s .4s cubic-bezier(.34,1.56,.64,1) both"}}>
        <rect x="14" y="86" width="42" height="26" rx="3" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5"/>
        <rect x="16" y="88" width="11" height="22" rx="2" fill="#fbbf24" opacity=".75"/>
        <rect x="29" y="88" width="11" height="22" rx="2" fill="#fde68a" opacity=".85"/>
        <rect x="43" y="88" width="11" height="22" rx="2" fill="#fbbf24" opacity=".75"/>
        <line x1="14" y1="99" x2="56" y2="99" stroke="rgba(255,255,255,.25)" strokeWidth=".8"/>
        <rect x="84" y="86" width="42" height="26" rx="3" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5"/>
        <rect x="86" y="88" width="11" height="22" rx="2" fill="#fbbf24" opacity=".75"/>
        <rect x="99" y="88" width="11" height="22" rx="2" fill="#fde68a" opacity=".85"/>
        <rect x="113" y="88" width="11" height="22" rx="2" fill="#fbbf24" opacity=".75"/>
        <line x1="84" y1="99" x2="126" y2="99" stroke="rgba(255,255,255,.25)" strokeWidth=".8"/>
        <rect x="58" y="88" width="24" height="22" rx="3" fill="#92400e" stroke="#fbbf24" strokeWidth="1.5"/>
        <circle cx="70" cy="99" r="5" fill="#fbbf24" opacity=".9"/>
      </g>
      <text x="70" y="146" textAnchor="middle" fill="#fbbf24" fontSize="10"
        fontFamily="Orbitron,monospace" letterSpacing="2">CHARGING</text>
    </svg>
  );
}
function BioSVG() {
  return (
    <svg width="140" height="148" viewBox="0 0 140 148">
      <g transform="translate(70,84)" className="dgrow">
        <ellipse cx="0" cy="18" rx="54" ry="16" fill="rgba(52,211,153,.08)" stroke="#34d399" strokeWidth="1"/>
        <path d="M-54,18 Q-54,-37 0,-54 Q54,-37 54,18" fill="rgba(52,211,153,.07)" stroke="#34d399" strokeWidth="1.5"/>
        <path d="M-54,18 Q-27,-10 0,-18 Q27,-10 54,18" fill="none" stroke="rgba(52,211,153,.25)" strokeWidth="1"/>
        <line x1="-22" y1="18" x2="-22" y2="-10" stroke="#34d399" strokeWidth="2"/>
        <polygon points="-22,-28 -31,-8 -13,-8" fill="#34d399" opacity=".9"/>
        <polygon points="-22,-42 -29,-24 -15,-24" fill="#34d399" opacity=".7"/>
        <line x1="6" y1="18" x2="6" y2="-4" stroke="#34d399" strokeWidth="1.5"/>
        <polygon points="6,-20 -1,-2 13,-2" fill="#34d399" opacity=".85"/>
        <line x1="26" y1="18" x2="26" y2="-12" stroke="#34d399" strokeWidth="2"/>
        <polygon points="26,-30 17,-10 35,-10" fill="#34d399" opacity=".9"/>
        <ellipse cx="0" cy="18" rx="52" ry="5" fill="rgba(52,211,153,.12)"/>
      </g>
      <text x="70" y="146" textAnchor="middle" fill="#34d399" fontSize="10"
        fontFamily="Orbitron,monospace" letterSpacing="2">GROWING</text>
    </svg>
  );
}
function SatSVG() {
  return (
    <svg width="140" height="148" viewBox="0 0 140 148">
      <ellipse cx="70" cy="76" rx="50" ry="20" fill="none" stroke="rgba(56,189,248,.2)" strokeWidth="1" strokeDasharray="4,3"/>
      <circle cx="70" cy="76" r="22" fill="rgba(56,189,248,.08)" stroke="#38bdf8" strokeWidth="1.5"/>
      <circle cx="70" cy="76" r="13" fill="rgba(26,42,108,.9)" stroke="rgba(56,189,248,.4)" strokeWidth="1"/>
      <ellipse cx="66" cy="73" rx="5" ry="4" fill="rgba(56,189,248,.4)" opacity=".7"/>
      <ellipse cx="76" cy="80" rx="4" ry="3" fill="rgba(56,189,248,.35)" opacity=".6"/>
      <g style={{transformOrigin:"70px 76px"}} className="sorbit">
        <g transform="translate(116,76)">
          <rect x="-6" y="-5" width="12" height="10" rx="2" fill="#38bdf8"/>
          <rect x="-14" y="-3" width="8" height="6" rx="1" fill="rgba(56,189,248,.6)"/>
          <rect x="6" y="-3" width="8" height="6" rx="1" fill="rgba(56,189,248,.6)"/>
          <line x1="0" y1="-9" x2="0" y2="-15" stroke="#38bdf8" strokeWidth="1.2"/>
          <circle cx="0" cy="-17" r="2.5" fill="#38bdf8"/>
        </g>
      </g>
      <text x="70" y="146" textAnchor="middle" fill="#38bdf8" fontSize="10"
        fontFamily="Orbitron,monospace" letterSpacing="2">ORBITING</text>
    </svg>
  );
}
function CommsSVG() {
  return (
    <svg width="140" height="148" viewBox="0 0 140 148">
      <g transform="translate(70,92)">
        <circle cx="0" cy="0" r="8" fill="none" stroke="#a78bfa" strokeWidth="2.5" className="cw1"/>
        <circle cx="0" cy="0" r="8" fill="none" stroke="#a78bfa" strokeWidth="2"   className="cw2"/>
        <circle cx="0" cy="0" r="8" fill="none" stroke="#a78bfa" strokeWidth="1.5" className="cw3"/>
        <g style={{animation:"bpop .4s .1s cubic-bezier(.34,1.56,.64,1) both"}}>
          <line x1="0" y1="0" x2="0" y2="-42" stroke="#a78bfa" strokeWidth="2"/>
          <path d="M-26,-28 Q0,-48 26,-28" fill="rgba(167,139,250,.12)" stroke="#a78bfa" strokeWidth="1.8"/>
          <path d="M-36,-18 Q0,-55 36,-18" fill="none" stroke="rgba(167,139,250,.25)" strokeWidth="1.2"/>
          <circle cx="0" cy="-42" r="5" fill="#a78bfa"/>
          <line x1="-20" y1="0" x2="20" y2="0" stroke="#a78bfa" strokeWidth="2"/>
        </g>
      </g>
      <text x="70" y="146" textAnchor="middle" fill="#a78bfa" fontSize="10"
        fontFamily="Orbitron,monospace" letterSpacing="2">TRANSMITTING</text>
    </svg>
  );
}
function WarpSVG() {
  return (
    <svg width="140" height="148" viewBox="0 0 140 148">
      {Array.from({length:12},(_,i)=>i).map(i=>{
        const a=(i/12)*Math.PI*2;
        return <line key={i} x1={70+Math.cos(a)*38} y1={65+Math.sin(a)*38}
          x2={70+Math.cos(a)*60} y2={65+Math.sin(a)*60}
          stroke="#f87171" strokeWidth="1.2" opacity=".4"
          style={{transformOrigin:`${70+Math.cos(a)*38}px ${65+Math.sin(a)*38}px`,
            animation:`spline ${.5+i*.05}s ${i*.04}s ease-out infinite`}}/>;
      })}
      <g className="wspin">
        <ellipse cx="70" cy="65" rx="44" ry="14" fill="none" stroke="rgba(248,113,113,.55)" strokeWidth="1.5"/>
        <ellipse cx="70" cy="65" rx="44" ry="14" fill="none" stroke="rgba(248,113,113,.3)"  strokeWidth="1.2" transform="rotate(60,70,65)"/>
        <ellipse cx="70" cy="65" rx="44" ry="14" fill="none" stroke="rgba(248,113,113,.3)"  strokeWidth="1.2" transform="rotate(120,70,65)"/>
      </g>
      <circle cx="70" cy="65" r="30" fill="rgba(248,113,113,.06)" stroke="#f87171" strokeWidth="1.5"/>
      <circle cx="70" cy="65" r="16" fill="rgba(248,113,113,.12)" stroke="#f87171" strokeWidth="1.5"/>
      <circle cx="70" cy="65" r="7" fill="#f87171" className="wcore"/>
      <circle cx="70" cy="65" r="3" fill="white" opacity=".9"/>
      <text x="70" y="146" textAnchor="middle" fill="#f87171" fontSize="10"
        fontFamily="Orbitron,monospace" letterSpacing="2">WARPING</text>
    </svg>
  );
}
const ANIM = {solar:SolarSVG,bio:BioSVG,sat:SatSVG,comms:CommsSVG,warp:WarpSVG};
 
/* ─────────────────────── Mission Success Modal ───────────────────────────── */
function SuccessModal({duration, cat, onClose}) {
  // 12 spark particles bursting outward
  const sparks = useMemo(() => Array.from({length:12},(_,i)=>{
    const a=(i/12)*Math.PI*2;
    const dist=55+Math.random()*30;
    return {
      id:i,
      tx:`${Math.cos(a)*dist}px`,
      ty:`${Math.sin(a)*dist}px`,
      sd:`${i*0.055}s`,
      col:["#fbbf24","#38bdf8","#34d399","#a78bfa","#f87171","#fff"][i%6],
    };
  }),[]);
 
  return (
    <div className="mo" onClick={onClose}>
      <div className="mb mglow" onClick={e=>e.stopPropagation()} style={{
        border:"1px solid rgba(56,189,248,.55)",
        boxShadow:"0 0 50px rgba(56,189,248,.2)",
      }}>
        {/* top accent line */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,
          background:"linear-gradient(90deg,transparent,#38bdf8,#a78bfa,transparent)",
          borderRadius:"22px 22px 0 0"}}/>
 
        {/* animated graphic */}
        <div style={{position:"relative",width:120,height:130,margin:"0 auto 16px",display:"flex",
          alignItems:"center",justifyContent:"center"}}>
 
          {/* expanding success rings */}
          <svg width="160" height="160" viewBox="0 0 160 160"
            style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
            <circle cx="80" cy="80" r="14" fill="none" stroke="#38bdf8" strokeWidth="3" className="sring1"/>
            <circle cx="80" cy="80" r="14" fill="none" stroke="#a78bfa" strokeWidth="2" className="sring2"/>
            <circle cx="80" cy="80" r="14" fill="none" stroke="#34d399" strokeWidth="1.5" className="sring3"/>
          </svg>
 
          {/* spark particles */}
          <div style={{position:"absolute",top:"50%",left:"50%"}}>
            {sparks.map(s=>(
              <div key={s.id} className="spark" style={{
                position:"absolute",width:6,height:6,borderRadius:"50%",
                background:s.col,top:-3,left:-3,
                "--tx":s.tx,"--ty":s.ty,"--sd":s.sd,
                boxShadow:`0 0 6px ${s.col}`,
              }}/>
            ))}
          </div>
 
          {/* rocket launches up */}
          <div className="rlaunch" style={{fontSize:"3rem",lineHeight:1,zIndex:2}}>🚀</div>
 
          {/* checkmark circle fades in after rocket */}
          <div className="sbadge" style={{position:"absolute",top:"50%",left:"50%",
            transform:"translate(-50%,-50%)"}}>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="rgba(56,189,248,.12)"
                stroke="#38bdf8" strokeWidth="2"/>
              <polyline points="19,33 28,42 45,22" fill="none"
                stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                className="tick"/>
            </svg>
          </div>
        </div>
 
        <div style={{fontFamily:"var(--fh)",fontSize:".58rem",letterSpacing:".28em",
          color:"rgba(56,189,248,.7)",marginBottom:8}}>MISSION STATUS</div>
 
        <h2 style={{fontFamily:"var(--fh)",fontSize:"1.5rem",fontWeight:900,
          letterSpacing:".08em",marginBottom:10,
          background:"linear-gradient(120deg,#38bdf8,#a78bfa)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          textShadow:"none"}}>
          MISSION COMPLETE
        </h2>
 
        <p style={{color:"var(--tmid)",fontFamily:"var(--fb)",fontSize:".88rem",
          lineHeight:1.6,marginBottom:10}}>
          Outstanding work, Commander. All objectives achieved.
        </p>
 
        {/* stats row */}
        <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:22,flexWrap:"wrap"}}>
          <div style={{padding:"8px 16px",borderRadius:10,
            background:"rgba(56,189,248,.08)",border:"1px solid rgba(56,189,248,.25)"}}>
            <div style={{fontFamily:"var(--fh)",fontSize:"1rem",fontWeight:700,
              color:"var(--cyan)"}}>{fmt(duration)}</div>
            <div className="lbl" style={{marginTop:3}}>FOCUS TIME</div>
          </div>
          <div style={{padding:"8px 16px",borderRadius:10,
            background:"rgba(167,139,250,.08)",border:"1px solid rgba(167,139,250,.25)"}}>
            <div style={{fontFamily:"var(--fh)",fontSize:"1rem",fontWeight:700,
              color:"var(--purple)"}}>{cat}</div>
            <div className="lbl" style={{marginTop:3}}>CATEGORY</div>
          </div>
        </div>
 
        <button className="btn btn-go" onClick={onClose} style={{margin:"0 auto"}}>
          🌌 CONTINUE
        </button>
      </div>
    </div>
  );
}
 
/* ─────────────────────────── Crash Modal ─────────────────────────────────── */
function CrashModal({saved, onClose}) {
  return (
    <div className="mo" onClick={onClose}>
      <div className="mb" onClick={e=>e.stopPropagation()} style={{
        border:"1px solid rgba(248,113,113,.55)",
        boxShadow:"0 0 48px rgba(248,113,113,.18)",
      }}>
        <div style={{position:"relative",width:96,height:96,margin:"0 auto 18px"}}>
          <svg width="96" height="96" viewBox="0 0 96 96" style={{position:"absolute",inset:0}}>
            <circle cx="48" cy="48" r="8" fill="none" stroke="#f87171" strokeWidth="3" className="er1"/>
            <circle cx="48" cy="48" r="8" fill="none" stroke="#fb923c" strokeWidth="2" className="er2"/>
          </svg>
          <svg width="96" height="96" viewBox="0 0 96 96" style={{position:"absolute",inset:0}}>
            {[0,36,72,108,144,180,216,252,288,324].map((a,i)=>{
              const rd=a*Math.PI/180;
              return <line key={i} x1="48" y1="48"
                x2={48+Math.cos(rd)*44} y2={48+Math.sin(rd)*44}
                stroke="#f87171" strokeWidth="1.5" opacity=".6"
                style={{transformOrigin:"48px 48px",
                  animation:`spline ${.4+i*.06}s ${i*.04}s ease-out infinite`}}/>;
            })}
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
            justifyContent:"center",fontSize:"2.4rem"}}>💥</div>
        </div>
        <div style={{fontFamily:"var(--fh)",fontSize:".58rem",letterSpacing:".25em",
          color:"rgba(248,113,113,.7)",marginBottom:8}}>MISSION STATUS</div>
        <h2 style={{fontFamily:"var(--fh)",fontSize:"1.45rem",fontWeight:900,
          color:"var(--red)",letterSpacing:".08em",marginBottom:10,
          textShadow:"0 0 22px rgba(248,113,113,.7)"}}>MISSION CRASHED</h2>
        <p style={{color:"var(--tmid)",fontFamily:"var(--fb)",fontSize:".88rem",
          lineHeight:1.6,marginBottom:8}}>Hull breach detected. Mission aborted.</p>
        {saved>0 && (
          <p style={{fontFamily:"var(--fh)",fontSize:".6rem",letterSpacing:".15em",
            color:"rgba(248,113,113,.6)",marginBottom:22}}>
            {fmt(saved)} OF FOCUS SALVAGED
          </p>
        )}
        <button className="btn btn-stop" onClick={onClose} style={{margin:"0 auto"}}>
          RETURN TO BASE
        </button>
      </div>
    </div>
  );
}
 
/* ─────────────────────────── Unlock Modal ────────────────────────────────── */
function UnlockModal({mod, onClose}) {
  const A = ANIM[mod.id];
  return (
    <div className="mo" onClick={onClose}>
      <div className="mb" onClick={e=>e.stopPropagation()} style={{
        border:`1px solid ${mod.col}66`,
        boxShadow:`0 0 48px ${mod.col}1e`,
      }}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,
          background:`linear-gradient(90deg,transparent,${mod.col},transparent)`,
          borderRadius:"22px 22px 0 0"}}/>
        <div style={{marginBottom:10}}><A/></div>
        <div style={{fontFamily:"var(--fh)",fontSize:".58rem",letterSpacing:".25em",
          color:mod.col,marginBottom:8,opacity:.85}}>MODULE UNLOCKED</div>
        <h2 style={{fontFamily:"var(--fh)",fontSize:"1.4rem",fontWeight:900,
          letterSpacing:".06em",marginBottom:10,color:"var(--tbr)",
          textShadow:`0 0 18px ${mod.col}99`}}>
          {mod.icon} {mod.name.toUpperCase()}
        </h2>
        <p style={{color:"var(--tmid)",fontFamily:"var(--fb)",fontSize:".88rem",
          lineHeight:1.6,marginBottom:24}}>{mod.desc}</p>
        <button className="btn" onClick={onClose} style={{
          background:`linear-gradient(135deg,${mod.col}22,${mod.col}0a)`,
          color:mod.col,border:`1px solid ${mod.col}88`,margin:"0 auto",
        }}>⭐ ACKNOWLEDGED</button>
      </div>
    </div>
  );
}
 
/* ─────────────────────────── All-Done Modal ──────────────────────────────── */
function AllDoneModal({onClose}) {
  const cf = useMemo(()=>Array.from({length:18},(_,i)=>({
    id:i, x:Math.random()*100,
    col:["#fbbf24","#34d399","#38bdf8","#a78bfa","#f87171"][i%5],
    dl:Math.random()*2, dr:1.5+Math.random()*.8,
  })),[]);
  return (
    <div className="mo" onClick={onClose}>
      <div className="mb" onClick={e=>e.stopPropagation()} style={{
        border:"1px solid rgba(251,191,36,.5)",
        boxShadow:"0 0 56px rgba(251,191,36,.14)",maxWidth:450,
      }}>
        {cf.map(c=>(
          <div key={c.id} style={{position:"absolute",left:`${c.x}%`,top:-10,
            width:8,height:8,borderRadius:2,background:c.col,
            animation:`cffall ${c.dr}s ${c.dl}s ease-in infinite`}}/>
        ))}
        <div style={{fontSize:"3.2rem",marginBottom:12,animation:"bpop .6s both"}}>🏆</div>
        <div style={{fontFamily:"var(--fh)",fontSize:".58rem",letterSpacing:".3em",
          color:"var(--gold)",marginBottom:10}}>ACHIEVEMENT UNLOCKED</div>
        <h2 className="rbw" style={{fontFamily:"var(--fh)",fontSize:"1.45rem",fontWeight:900,
          letterSpacing:".06em",marginBottom:12,
          background:"linear-gradient(90deg,#fbbf24,#f87171,#a78bfa,#38bdf8,#34d399)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          STATION COMPLETE
        </h2>
        <p style={{color:"var(--tmid)",fontFamily:"var(--fb)",fontSize:".88rem",
          lineHeight:1.6,marginBottom:6}}>
          All 5 modules online. Your station is fully operational, Commander.
        </p>
        <p style={{color:"var(--tdim)",fontFamily:"var(--fh)",fontSize:".57rem",
          letterSpacing:".15em",marginBottom:22}}>NEW GOAL: KEEP EXPLORING THE COSMOS</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center",marginBottom:24}}>
          {MODS.map(m=>(
            <span key={m.id} style={{padding:"4px 11px",borderRadius:999,
              background:`${m.col}18`,color:m.col,border:`1px solid ${m.col}44`,
              fontFamily:"var(--fh)",fontSize:".57rem",letterSpacing:".1em"}}>
              {m.icon} {m.name}
            </span>
          ))}
        </div>
        <button className="btn btn-go" onClick={onClose} style={{margin:"0 auto"}}>
          🚀 CONTINUE
        </button>
      </div>
    </div>
  );
}
 
/* ─────────────────────────── Main App ───────────────────────────────────── */
export default function CosmicCommand() {
  const [mode,    setMode]    = useState("mission");
  const [time,    setTime]    = useState(25*60);
  const [preset,  setPreset]  = useState(25);
  const [custom,  setCustom]  = useState("");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  // category locked while running — set on session start, editable only when idle
  const [cat,     setCat]     = useState("Coding");
 
  const [history, setHistory] = useState(()=>{
    try{return JSON.parse(localStorage.getItem("cc_hist"))||[];}catch{return[];}
  });
  // total cumulative focus seconds — persists across sessions and carries over for unlocks
  const [total,   setTotal]   = useState(()=>{
    try{return parseInt(localStorage.getItem("cc_tot")||"0");}catch{return 0;}
  });
 
  const [success,  setSuccess]  = useState(null);  // { duration, cat }
  const [crash,    setCrash]    = useState(null);   // { saved }
  const [unlock,   setUnlock]   = useState(null);   // mod object
  const [allDone,  setAllDone]  = useState(false);
  const shownAll = useRef(false);
 
  // ── timer refs: zero stale closures ──
  const startRef   = useRef(null);
  const baseRef    = useRef(0);
  const rafRef     = useRef(null);
  const runningRef = useRef(false);
  const timeRef    = useRef(time);
  const modeRef    = useRef(mode);
  const elapsedRef = useRef(0);
  const catRef     = useRef(cat);   // capture category at tick time for saving
 
  useEffect(()=>{timeRef.current=time;},[time]);
  useEffect(()=>{modeRef.current=mode;},[mode]);
  useEffect(()=>{catRef.current=cat;},[cat]);
 
  // inject font once
  useEffect(()=>{
    if(!document.querySelector("link[data-ccf]")){
      const l=document.createElement("link");
      l.rel="stylesheet";l.href=FONT_LINK;l.dataset.ccf="1";
      document.head.appendChild(l);
    }
  },[]);
 
  // tick stored in ref so it never goes stale
  const tick = useRef(()=>{
    if(!startRef.current||!runningRef.current) return;
    const now = Date.now();
    const e   = baseRef.current + Math.floor((now-startRef.current)/1000);
    setElapsed(e);
    elapsedRef.current = e;
 
    // auto-complete when mission timer hits zero
    if(modeRef.current==="mission" && e>=timeRef.current){
      runningRef.current = false;
      setRunning(false);
      startRef.current = null;
      baseRef.current  = 0;
      setElapsed(0);
      elapsedRef.current = 0;
      // show success first, then save
      const dur = timeRef.current;
      const savedCat = catRef.current;
      saveSession(dur, savedCat, true);
      return;
    }
    rafRef.current = requestAnimationFrame(tick.current);
  });
 
  useEffect(()=>{
    runningRef.current = running;
    if(running){
      rafRef.current = requestAnimationFrame(tick.current);
    } else {
      if(rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return()=>{if(rafRef.current) cancelAnimationFrame(rafRef.current);};
  },[running]);
 
  // ── session persistence ──
  // FIX: total is always additive — every session adds to the running total
  // so unlocks accumulate across many sessions, user never starts from zero
  function saveSession(duration, sessionCat, completed=false) {
    setTotal(prevTotal=>{
      const newTotal = prevTotal + duration;
      localStorage.setItem("cc_tot", String(newTotal));
 
      // check for newly crossed unlock threshold
      const justUnlocked = MODS.find(m=>prevTotal<m.thr && newTotal>=m.thr);
      if(justUnlocked){
        setTimeout(()=>setUnlock(justUnlocked), completed ? 2200 : 0);
      }
      // check all done
      if(MODS.every(m=>newTotal>=m.thr) && !shownAll.current){
        shownAll.current = true;
        const delay = completed ? (justUnlocked ? 5500 : 2200) : (justUnlocked ? 3500 : 500);
        setTimeout(()=>setAllDone(true), delay);
      }
      return newTotal;
    });
 
    const sess = {
      duration, cat:sessionCat, mode:modeRef.current,
      date:new Date().toLocaleString(), id:Date.now(),
      completed,
    };
    setHistory(prev=>{
      const h=[sess,...prev].slice(0,20);
      localStorage.setItem("cc_hist",JSON.stringify(h));
      return h;
    });
 
    if(completed && modeRef.current==="mission"){
      setSuccess({duration, cat:sessionCat});
    }
  }
 
  function startSession(){
    startRef.current = Date.now();
    baseRef.current  = 0;
    setElapsed(0);
    setRunning(true);
  }
 
  function stopSession(){
    const e = elapsedRef.current;
    runningRef.current = false;
    setRunning(false);
    startRef.current = null;
    baseRef.current  = 0;
    setElapsed(0);
    elapsedRef.current = 0;
    if(e>5) saveSession(e, catRef.current, false);
    if(modeRef.current==="mission") setCrash({saved:e>5?e:0});
  }
 
  function pickPreset(m){
    if(running) return;
    setPreset(m); setCustom(""); setTime(m*60);
  }
  function pickCustom(v){
    setCustom(v);
    const m=parseInt(v);
    if(m>0&&m<=480){setTime(m*60);setPreset(null);}
  }
 
  // ── derived ──
  const displayTime = mode==="mission" ? Math.max(time-elapsed,0) : elapsed;
  const ringPct     = mode==="mission" ? elapsed/time : Math.min(elapsed/3600,1);
  const ringCol     = mode==="mission" ? "#38bdf8" : "#a78bfa";
  const missions    = history.filter(h=>h.completed).length;
  const nextMod     = MODS.find(m=>total<m.thr);
  const prevThr     = nextMod ? (MODS[MODS.indexOf(nextMod)-1]?.thr??0) : 0;
  const unlockPct   = nextMod ? (total-prevThr)/(nextMod.thr-prevThr) : 1;
 
  return (
    <>
      <style>{CSS}</style>
      <Starfield/>
 
      {success  && <SuccessModal duration={success.duration} cat={success.cat} onClose={()=>setSuccess(null)}/>}
      {crash    && <CrashModal   saved={crash.saved}          onClose={()=>setCrash(null)}/>}
      {unlock   && <UnlockModal  mod={unlock}                 onClose={()=>setUnlock(null)}/>}
      {allDone  && <AllDoneModal                              onClose={()=>setAllDone(false)}/>}
 
      <div style={{position:"relative",zIndex:1,maxWidth:960,margin:"0 auto",padding:"20px 16px 48px"}}>
 
        {/* HEADER */}
        <header className="fi" style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          flexWrap:"wrap",gap:14,marginBottom:28}}>
          <div>
            <h1 style={{fontFamily:"var(--fh)",fontWeight:900,fontSize:"clamp(1.4rem,4vw,2rem)",
              letterSpacing:".04em",background:"linear-gradient(120deg,#38bdf8 20%,#a78bfa 80%)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              COSMIC COMMAND
            </h1>
            <p style={{fontFamily:"var(--fh)",fontSize:".55rem",letterSpacing:".25em",
              color:"var(--tdim)",marginTop:3}}>DEEP-SPACE FOCUS TERMINAL</p>
          </div>
          <div style={{display:"flex",gap:12}}>
            {[{lbl:"FOCUS TIME",val:fmtm(total),col:"var(--cyan)"},
              {lbl:"MISSIONS",  val:missions,   col:"var(--purple)"}
            ].map(({lbl,val,col})=>(
              <div key={lbl} className="panel" style={{padding:"10px 18px",textAlign:"center",minWidth:82}}>
                <div style={{fontFamily:"var(--fh)",fontSize:"1.15rem",fontWeight:700,
                  color:col,lineHeight:1}}>{val}</div>
                <div className="lbl" style={{marginTop:4}}>{lbl}</div>
              </div>
            ))}
          </div>
        </header>
 
        {/* GRID */}
        <div className="twocol">
 
          {/* ── LEFT ── */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
 
            {/* mode tabs — locked while running */}
            <div className="tabs fi" style={{animationDelay:".07s"}}>
              <button className={`tab ${mode==="mission"?"on":""}`}
                onClick={()=>{if(!running){setMode("mission");setElapsed(0);}}}>
                🚀 MISSION
              </button>
              <button className={`tab ft ${mode==="free"?"on":""}`}
                onClick={()=>{if(!running){setMode("free");setElapsed(0);}}}>
                🌌 FREE EXPLORE
              </button>
            </div>
 
            {/* timer card */}
            <div className="panel fi" style={{padding:"26px 22px",animationDelay:".12s"}}>
 
              {/* presets — mission only, not while running */}
              {mode==="mission"&&!running&&(
                <div style={{marginBottom:20}}>
                  <div className="lbl" style={{marginBottom:10}}>DURATION</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                    {[15,25,50].map(m=>(
                      <button key={m} className={`pre ${preset===m?"on":""}`}
                        onClick={()=>pickPreset(m)}>{m}m</button>
                    ))}
                    <input type="number" className="ci"
                      value={custom} placeholder="custom" min="1" max="480"
                      onChange={e=>pickCustom(e.target.value)}/>
                  </div>
                </div>
              )}
 
              {/* ring */}
              <div style={{position:"relative",display:"flex",alignItems:"center",
                justifyContent:"center",marginBottom:22}}>
                <div className="tglow" style={{background:ringCol}}/>
                {running&&(
                  <div className="ping" style={{position:"absolute",width:178,height:178,
                    borderRadius:"50%",border:`1px solid ${ringCol}`,opacity:.28}}/>
                )}
                <Ring pct={ringPct} color={ringCol}/>
                <div style={{position:"absolute",textAlign:"center"}}>
                  <div className={`digits ${mode==="free"?"free":""}`}>{fmt(displayTime)}</div>
                  {running&&(
                    <div style={{fontFamily:"var(--fh)",fontSize:".5rem",letterSpacing:".2em",
                      color:"var(--tdim)",marginTop:6}}>
                      {mode==="mission"?"MISSION ACTIVE":"EXPLORING"}
                    </div>
                  )}
                </div>
              </div>
 
              {/* category — LOCKED while running, editable only when idle */}
              <div style={{marginBottom:20}}>
                <div className="lbl" style={{marginBottom:10,display:"flex",
                  alignItems:"center",gap:8}}>
                  FOCUS CATEGORY
                  {running ? (
                    <span style={{fontFamily:"var(--fb)",fontSize:".65rem",
                      color:"rgba(248,113,113,.8)",padding:"1px 8px",borderRadius:999,
                      background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.25)",
                      letterSpacing:".04em"}}>locked</span>
                  ) : (
                    <span style={{fontFamily:"var(--fb)",fontSize:".65rem",
                      color:"var(--tdim)",padding:"1px 8px",borderRadius:999,
                      letterSpacing:".04em"}}>pick before launching</span>
                  )}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,
                  opacity:running?0.4:1,
                  transition:"opacity .3s",
                  pointerEvents:running?"none":"auto",
                }}>
                  {CATS.map(c=>(
                    <button key={c}
                      className={`chip ${cat===c?"on":""}`}
                      disabled={running}
                      onClick={()=>!running&&setCat(c)}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
 
              {/* action buttons */}
              <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
                {!running ? (
                  <button className={`btn ${mode==="mission"?"btn-go":"btn-gof"}`}
                    onClick={startSession}>
                    {mode==="mission"?"🚀 LAUNCH MISSION":"▶ START EXPLORING"}
                  </button>
                ) : (
                  <button className="btn btn-stop" onClick={stopSession}>
                    {mode==="mission"?"💥 ABORT MISSION":"⬛ STOP"}
                  </button>
                )}
              </div>
 
              {mode==="free"&&!running&&(
                <p style={{textAlign:"center",marginTop:14,fontSize:".75rem",
                  color:"var(--tdim)",fontFamily:"var(--fb)",lineHeight:1.5}}>
                  Stopwatch counts up freely. Hit Stop when done — session saved automatically.
                </p>
              )}
            </div>
 
            {/* next-unlock bar */}
            <div className="panel fi" style={{padding:"14px 18px",animationDelay:".18s"}}>
              {nextMod ? (
                <>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span className="lbl">NEXT MODULE</span>
                    <span style={{fontFamily:"var(--fh)",fontSize:".6rem",
                      color:nextMod.col,letterSpacing:".1em"}}>
                      {nextMod.icon} {nextMod.name.toUpperCase()}
                    </span>
                  </div>
                  <div className="ubt">
                    <div className="ubf" style={{
                      width:`${Math.min(unlockPct,1)*100}%`,
                      background:`linear-gradient(90deg,rgba(56,189,248,.5),${nextMod.col})`,
                      boxShadow:`0 0 7px ${nextMod.col}`,
                    }}/>
                  </div>
                  <div style={{textAlign:"right",marginTop:5}}>
                    <span style={{fontSize:".72rem",color:"var(--tdim)",fontFamily:"var(--fb)"}}>
                      {fmtm(nextMod.thr-total)} remaining
                    </span>
                  </div>
                </>
              ) : (
                <div style={{textAlign:"center",fontFamily:"var(--fh)",
                  fontSize:".62rem",color:"var(--gold)",letterSpacing:".15em"}}>
                  ⭐ ALL MODULES UNLOCKED — STATION COMPLETE
                </div>
              )}
            </div>
          </div>
 
          {/* ── RIGHT ── */}
          <div style={{display:"flex",flexDirection:"column",gap:16,marginTop:16}}>
 
            {/* space station tools */}
            <div className="panel" style={{padding:"22px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"var(--cdim)",
                  border:"1px solid rgba(56,189,248,.3)",display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:"16px"}}>🛰</div>
                <span style={{fontFamily:"var(--fh)",fontSize:".7rem",
                  letterSpacing:".15em",color:"var(--tmid)"}}>SPACE STATION TOOLS</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {MODS.map(m=>{
                  const on=total>=m.thr;
                  return (
                    <div key={m.id} className={`mbadge ${on?"":"lk"}`}
                      style={on?{background:`${m.col}12`,borderColor:`${m.col}55`,
                        color:m.col,boxShadow:`0 0 11px ${m.col}16`}:{}}>
                      <div className="dot" style={on?
                        {background:m.col,boxShadow:`0 0 7px ${m.col}`}:{background:"var(--tdim)"}}/>
                      <span style={{fontFamily:"var(--fb)",fontWeight:500,letterSpacing:".04em"}}>
                        {m.icon} {m.name}
                      </span>
                      <span style={{marginLeft:"auto",fontFamily:"var(--fh)",fontSize:".6rem",
                        color:on?m.col:"var(--tdim)",letterSpacing:".08em"}}>
                        {on?"ONLINE":`${fmtm(m.thr-total)} left`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
 
            {/* mission log */}
            <div className="panel" style={{padding:"22px",flex:1}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                marginBottom:16}}>
                <span style={{fontFamily:"var(--fh)",fontSize:".7rem",
                  letterSpacing:".15em",color:"var(--tmid)"}}>📜 MISSION LOG</span>
                <span style={{fontFamily:"var(--fh)",fontSize:".6rem",
                  color:"var(--tdim)",letterSpacing:".1em"}}>{history.length} ENTRIES</span>
              </div>
              {history.length===0 ? (
                <div style={{textAlign:"center",padding:"26px 0",
                  color:"var(--tdim)",fontSize:".85rem",fontFamily:"var(--fb)"}}>
                  <div style={{fontSize:"1.8rem",marginBottom:8}}>🌌</div>
                  No sessions logged yet
                </div>
              ) : (
                <div className="sc" style={{maxHeight:260,overflowY:"auto",
                  display:"flex",flexDirection:"column",gap:6}}>
                  {history.map(h=>(
                    <div key={h.id} className="hrow">
                      <span style={{fontSize:"16px"}}>
                        {h.completed?"✅":h.mode==="mission"?"💥":"🌌"}
                      </span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                          <span style={{fontFamily:"var(--fh)",fontSize:".75rem",
                            color:"var(--tbr)",fontWeight:600}}>{fmt(h.duration)}</span>
                          <span style={{padding:"2px 9px",borderRadius:999,
                            background:"var(--cdim)",color:"var(--cyan)",
                            fontFamily:"var(--fb)",fontSize:".7rem"}}>{h.cat}</span>
                          {h.completed&&(
                            <span style={{padding:"2px 9px",borderRadius:999,
                              background:"rgba(52,211,153,.1)",color:"var(--green)",
                              fontFamily:"var(--fb)",fontSize:".7rem",
                              border:"1px solid rgba(52,211,153,.25)"}}>complete</span>
                          )}
                        </div>
                        <div style={{fontSize:".7rem",color:"var(--tdim)",marginTop:2}}>{h.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
 