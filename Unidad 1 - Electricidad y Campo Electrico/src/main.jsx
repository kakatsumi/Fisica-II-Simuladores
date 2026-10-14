import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { K, axes, evaluate, presets, validateCharges, finiteInput, scientific as sci, length } from './physics.js';
import { advanceParticle, INITIAL_PARTICLE, validateParticle } from './trajectory.js';
import View2D from './View2D.jsx';
import './style.css';
const View3D = lazy(() => import('./View3D.jsx'));

function NumberField({ label, value, onChange, min, max, disabled=false }) {
  return <label className="number-field"><span>{label}</span><input type="number" step="any" min={min} max={max} value={value} disabled={disabled} onChange={e=>onChange(e.target.value)}/></label>;
}
const initialState=p=>[...axes.map(a=>Number(p[a])),...axes.map(a=>Number(p[`v${a}`]))];
function App() {
  const [charges,setCharges]=useState(()=>presets());
  const nextId=useRef(3);
  const [point,setPoint]=useState(['0','1','0']);
  const [tab,setTab]=useState('2d'), [showLines,setLines]=useState(true), [showVectors,setVectors]=useState(true), [showContours,setContours]=useState(false);
  const [level,setLevel]=useState('20'),[resetKey,setResetKey]=useState(0);
  const [config,setConfig]=useState({...INITIAL_PARTICLE});
  const [sim,setSim]=useState({state:initialState(INITIAL_PARTICLE),time:0,path:[],steps:0,status:'Lista para iniciar.'});
  const [running,setRunning]=useState(false);
  const live=useRef(sim);
  const chargeError=validateCharges(charges), particleError=validateParticle(config);
  const levelValid=finiteInput(level)&&Number(level)>0&&Number(level)<=10000;
  const validCharges=useMemo(()=>chargeError?[]:charges,[charges,chargeError]);
  const numericPoint=useMemo(()=>point.map(v=>finiteInput(v)?Number(v):NaN),[point]);
  const result=chargeError?{error:chargeError}:point.some(v=>!finiteInput(v)||Math.abs(Number(v))>10)?{error:'Introduce coordenadas finitas entre −10 y 10 m.'}:evaluate(charges,numericPoint);
  const resetParticle=()=>{setRunning(false);const s={state:initialState(config),time:0,path:[],steps:0,status:'Lista para iniciar.'};live.current=s;setSim(s);};
  const changeCharges=next=>{setCharges(next);resetParticle();};
  const applyPreset=name=>{const next=presets(name);nextId.current=3;changeCharges(next);};
  const changeConfig=(key,value)=>{setRunning(false);const p={...config,[key]:value};setConfig(p);const s={state:initialState(p),time:0,path:[],steps:0,status:'Parámetros modificados. Inicia una nueva trayectoria.'};live.current=s;setSim(s);};
  useEffect(()=>{
    if(!running)return;
    let frame;
    const tick=()=>{
      let s=live.current, stopped=false;
      const budgetEnd=performance.now()+10;
      for(let i=0;i<30&&performance.now()<budgetEnd;i++){
        const remaining=Number(config.duration)-s.time;
        if(remaining<=1e-10){s={...s,status:'Tiempo de simulación completado.'};stopped=true;break;}
        if(s.steps>=20000){s={...s,status:'Detenida: límite de 20 000 pasos.'};stopped=true;break;}
        const next=advanceParticle(charges,config,s.state,remaining);
        if(next.error){s={...s,status:next.error};stopped=true;break;}
        s={state:next.state,time:s.time+next.dt,path:[...s.path,next.state.slice(0,3)],steps:s.steps+1,status:'Simulando…'};
      }
      live.current=s;setSim(s);
      if(stopped)setRunning(false);else frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[running,charges,config]);
  const start=()=>{
    if(chargeError||particleError)return;
    if(live.current.time>=Number(config.duration)-1e-10||live.current.status.startsWith('Detenida')||live.current.status.startsWith('La partícula'))resetParticle();
    if(live.current.path.length===0){const s={...live.current,state:initialState(config),path:[initialState(config).slice(0,3)]};live.current=s;setSim(s);}
    setRunning(true);
  };
  const drawParticle=sim.state.every(Number.isFinite)?sim.state:null;
  return <main>
    <header><span className="eyebrow">FÍSICA II · UNIDAD 1</span><h1>Electricidad y campo eléctrico</h1><p>Cargas puntuales, potencial y movimiento de una partícula de prueba</p></header>
    <div className="workspace">
      <section className="card charges-panel"><h2>Cargas eléctricas <span className="badge">{charges.length}/10</span></h2>
        <label className="field">Ejemplo predefinido<select defaultValue="" onChange={e=>{if(e.target.value)applyPreset(e.target.value);e.target.value='';}}><option value="">Seleccionar ejemplo…</option><option value="positive">Una carga positiva</option><option value="negative">Una carga negativa</option><option value="dipole">Dipolo</option><option value="pair">Dos cargas positivas</option></select></label>
        <div className="charge-list">{charges.map(c=><article className="charge" key={c.id}><div className="charge-heading"><b className={Number(c.q)>0?'positive':Number(c.q)<0?'negative':''}>q{c.id} · {Number(c.q)>0?'+':Number(c.q)<0?'−':'0'}</b><button className="text-button" onClick={()=>changeCharges(charges.filter(v=>v.id!==c.id))} aria-label={`Eliminar carga ${c.id}`}>Eliminar</button></div>
          <NumberField label="Carga (nC, con signo)" value={c.q} min={-1000} max={1000} onChange={v=>changeCharges(charges.map(a=>a.id===c.id?{...a,q:v}:a))}/>
          <div className="coordinates">{axes.map(a=><NumberField key={a} label={`${a.toUpperCase()} (m)`} value={c[a]} min={-2} max={2} onChange={v=>changeCharges(charges.map(b=>b.id===c.id?{...b,[a]:v}:b))}/>)}</div>
        </article>)}</div>
        <div className="button-row"><button disabled={charges.length>=10} onClick={()=>changeCharges([...charges,{id:nextId.current++,q:5,x:0,y:0,z:0}])}>Agregar carga</button><button className="secondary" onClick={()=>applyPreset('dipole')}>Restablecer cargas</button></div>
        {chargeError&&<p role="alert" className="error">{chargeError}</p>}<p className="note">Rojo: positiva · Azul: negativa · Gris: carga nula. Coordenadas entre −2 y 2 m. Editar las cargas reinicia la trayectoria.</p>
      </section>
      <section className="card visual"><div className="section-heading"><h2>Visualización</h2><div className="tabs" role="group" aria-label="Dimensiones"><button aria-pressed={tab==='2d'} className={tab==='2d'?'':'secondary'} onClick={()=>setTab('2d')}>2D</button><button aria-pressed={tab==='3d'} className={tab==='3d'?'':'secondary'} onClick={()=>setTab('3d')}>3D</button></div></div>
        <div className="view-options"><label><input type="checkbox" checked={showLines} onChange={e=>setLines(e.target.checked)}/> Líneas 2D</label><label><input type="checkbox" checked={showVectors} onChange={e=>setVectors(e.target.checked)}/> Vectores</label><label><input type="checkbox" checked={showContours} onChange={e=>setContours(e.target.checked)}/> Equipotenciales</label><button className="text-button" onClick={()=>{setResetKey(v=>v+1);setTab('2d');setLines(true);setVectors(true);setContours(false);setLevel('20');}}>Restablecer vista</button></div>
        {showContours&&<div className="iso-control"><NumberField label="Nivel |V| (V) · curvas/superficies −V, 0, +V" value={level} min={.0001} max={10000} onChange={setLevel}/><p className="note">Rojo: positivo · Azul: negativo · Gris: cero. Un nivel puede no cruzar el dominio.</p></div>}
        {showContours&&!levelValid&&<p className="error" role="alert">El nivel debe ser mayor que 0 y como máximo 10 000 V.</p>}
        {chargeError?<p className="error">Corrige las cargas para mostrar el campo.</p>:tab==='2d'?<View2D charges={validCharges} point={numericPoint} showLines={showLines} showVectors={showVectors} showContours={showContours&&levelValid} level={Number(level)} path={sim.path} particle={drawParticle} onPoint={p=>setPoint(p.map(v=>v.toFixed(4)))}/>:<Suspense fallback={<p>Cargando vista 3D…</p>}><View3D charges={validCharges} point={numericPoint} showVectors={showVectors} showContours={showContours&&levelValid} level={Number(level)} resetKey={resetKey} path={sim.path} particle={drawParticle}/></Suspense>}
        <p className="note">{tab==='2d'?'Plano z = 0. Haz clic para evaluar un punto. Las cargas y trayectorias fuera del plano se proyectan; los vectores muestran Ex y Ey. Las líneas solo se dibujan si todas las cargas están en z = 0.':'Arrastra para girar; rueda para acercar o alejar; botón derecho para desplazar. Ejes: X rojo, Y verde, Z azul. Las esferas muestran posiciones reales.'} Las longitudes de las flechas están acotadas para facilitar la lectura.</p>
      </section>
    </div>
    <section className="card calculator"><h2>Campo eléctrico y potencial en un punto</h2><div className="coordinates point">{axes.map((a,i)=><NumberField key={a} label={`${a.toUpperCase()} (m)`} value={point[i]} min={-10} max={10} onChange={v=>setPoint(point.map((p,j)=>j===i?v:p))}/>)}</div>
      {result.error?<p className="error" role="alert">{result.error}</p>:<>
        <div className="results-grid"><article><h3>Campo eléctrico</h3><p className="formula">E(r) = k Σ qᵢ (r − rᵢ) / |r − rᵢ|³</p>{axes.map((a,i)=><p key={a}>E{a} = <strong>{sci(result.field[i])} N/C</strong></p>)}<p>|E| = <strong>{sci(result.magnitude)} N/C</strong></p><p>Dirección unitaria: {result.direction?`(${result.direction.map(v=>v.toFixed(5)).join(', ')})`:'Indefinida: campo nulo dentro de la tolerancia numérica.'}</p></article>
        <article><h3>Potencial eléctrico</h3><p className="formula">V(r) = k Σ qᵢ / |r − rᵢ|</p><strong className="big-result">{sci(result.potential)} V</strong><p className="note">Referencia: V = 0 en el infinito. k = {sci(K)} N·m²/C²; cargas internas en C.</p><p>V = {result.contributions.length?result.contributions.map(c=>`(${sci(c.potential)})`).join(' + '):'0'} V</p></article></div>
        <details><summary>Aportes y sustitución numérica por carga</summary><div className="contributions">{result.contributions.map(c=><article key={c.id}><b>q{c.id}: {c.q} nC = {sci(c.q*1e-9)} C</b><p>Δr = ({c.delta.map(v=>sci(v)).join(', ')}) m; R = {sci(c.distance)} m</p>{c.q===0?<p>Carga nula: Eᵢ = (0, 0, 0) N/C y Vᵢ = 0 V; no se realiza una división por R.</p>:<><p>Eᵢ = ({sci(K)}) × ({sci(c.q*1e-9)}) × Δr / ({sci(c.distance)})³ = ({c.field.map(v=>sci(v)).join(', ')}) N/C</p><p>Vᵢ = ({sci(K)}) × ({sci(c.q*1e-9)}) / ({sci(c.distance)}) = {sci(c.potential)} V</p></>}</article>)}</div></details>
      </>}
    </section>
    <section className="card trajectory"><h2>Trayectoria de una partícula de prueba</h2><p className="formula">F = qE · a = qE/m · Integración RK4 con control del paso</p>
      <div className="particle-settings"><NumberField label="Carga q (nC)" value={config.q} min={-100} max={100} onChange={v=>changeConfig('q',v)}/><NumberField label="Masa m (kg)" value={config.mass} min={1e-12} max={1} onChange={v=>changeConfig('mass',v)}/><NumberField label="Tiempo total (s)" value={config.duration} min={.0001} max={10} onChange={v=>changeConfig('duration',v)}/>
      {axes.map(a=><NumberField key={a} label={`Posición inicial ${a} (m)`} value={config[a]} min={-2} max={2} onChange={v=>changeConfig(a,v)}/>)}{axes.map(a=><NumberField key={`v${a}`} label={`Velocidad inicial v${a} (m/s)`} value={config[`v${a}`]} min={-10} max={10} onChange={v=>changeConfig(`v${a}`,v)}/>)}</div>
      <div className="button-row"><button onClick={start} disabled={running||Boolean(particleError)||Boolean(chargeError)}>Iniciar / continuar</button><button className="secondary" disabled={!running} onClick={()=>{setRunning(false);const s={...live.current,status:'Pausada.'};live.current=s;setSim(s);}}>Pausar</button><button className="secondary" onClick={resetParticle}>Reiniciar</button></div>
      {particleError&&<p role="alert" className="error">{particleError}</p>}<div className="simulation-results" aria-live="polite"><b>{sim.status}</b><p>t = {sci(sim.time)} s · Posición: ({sim.state.slice(0,3).map(sci).join(', ')}) m</p><p>Velocidad: ({sim.state.slice(3).map(sci).join(', ')}) m/s · Rapidez: {sci(length(sim.state.slice(3)))} m/s</p></div>
      <p className="note">La partícula no modifica las cargas fuente. Se detiene a menos de 0.06 m de una carga, al salir del dominio de ±2 m o superar límites numéricos. La línea ocre muestra su recorrido; la flecha indica la velocidad. El tiempo físico no equivale necesariamente al tiempo de la animación.</p>
    </section>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
