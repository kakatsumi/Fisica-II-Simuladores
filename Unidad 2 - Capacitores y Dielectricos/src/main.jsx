import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { calculate, DEFAULTS, MATERIALS } from './physics.js';
import './style.css';

const sci = value => Number(value).toExponential(6).replace('e', ' × 10^');
function App() {
  const [params, setParams] = useState({ ...DEFAULTS });
  const result = calculate(params);
  const update = (key, value) => setParams(previous => ({ ...previous, [key]: value, ...(key === 'er' ? { material: 'custom' } : {}) }));
  const chooseMaterial = value => setParams(previous => ({ ...previous, material: value, ...(MATERIALS[value] ? { er: String(MATERIALS[value].er) } : {}) }));
  // Dimensiones esquemáticas acotadas; el ancho varía con la raíz del área.
  const valid = !result.error;
  const width = valid ? 100 + 240 * Math.sqrt(Number(params.area)) / (Math.sqrt(Number(params.area)) + 0.1) : 220;
  const gap = valid ? 32 + 120 * Number(params.distance) / (Number(params.distance) + 0.003) : 60;
  const x = (480 - width) / 2, top = 150 - gap / 2, bottom = 150 + gap / 2;
  const field = (key, label, min, step) => <label className="field" htmlFor={key}><span>{label}</span><input id={key} type="number" value={params[key]} min={min} step={step} onChange={event => update(key, event.target.value)} aria-invalid={Boolean(result.error)} /></label>;
  return <main>
    <header><span className="eyebrow">FÍSICA II · UNIDAD 2</span><h1>Capacitores y dieléctricos</h1><p>Simulador de placas paralelas y energía almacenada</p></header>
    <div className="workspace">
      <section className="card controls" aria-labelledby="controls-title"><h2 id="controls-title">Parámetros</h2>
        {field('area', 'Área de las placas A (m²)', '0', 'any')}
        {field('distance', 'Distancia entre placas d (m)', '0', 'any')}
        <label className="field" htmlFor="material"><span>Material dieléctrico</span><select id="material" value={params.material} onChange={event => chooseMaterial(event.target.value)}>{Object.entries(MATERIALS).map(([key, material]) => <option key={key} value={key}>{material.name}</option>)}<option value="custom">Personalizado</option></select></label>
        {field('er', 'Constante dieléctrica εr (adimensional)', '1', 'any')}
        {params.material === 'glass' && <p className="note">Vidrio: εr = 5 como valor representativo; depende de su composición.</p>}
        {field('voltage', 'Voltaje aplicado V (V)', undefined, 'any')}
        <button onClick={() => setParams({ ...DEFAULTS })}>Restablecer valores</button>
      </section>
      <section className="card visual" aria-labelledby="visual-title"><h2 id="visual-title">Capacitor de placas paralelas</h2>
        <svg viewBox="0 0 480 300" role="img" aria-label={`Capacitor esquemático con área ${params.area} metros cuadrados y separación ${params.distance} metros`}>
          <defs><pattern id="dielectric" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12L12 0" stroke="#a4d8b5" strokeWidth="1"/></pattern></defs>
          <rect x={x} y={top + 8} width={width} height={gap - 8} fill={Number(params.er) > 1 ? 'url(#dielectric)' : '#f1f6f3'}/>
          <path d={`M240 35V${top} M240 ${bottom + 8}V265`} stroke="#87988c" strokeWidth="3"/>
          <rect x={x} y={top} width={width} height="8" rx="3" fill="#23754a"/>
          <rect x={x} y={bottom} width={width} height="8" rx="3" fill="#23754a"/>
          <path d={`M${x + width + 16} ${top + 8}v${gap - 8}`} stroke="#557462" strokeWidth="2"/>
          <text x={x + width + 24} y="155" fill="#355642">d</text>
          <text x="240" y={top - 14} textAnchor="middle" fill="#355642">Área A</text>
          <text x="240" y="156" textAnchor="middle" fill="#355642">εr = {valid ? Number(params.er) : '—'}</text>
        </svg>
        <p className="note">Esquema sin escala real. El ancho representa placas cuadradas y la separación se ajusta para facilitar la visualización.</p>
      </section>
      <section className="card results" aria-labelledby="results-title"><h2 id="results-title">Resultados</h2>
        {result.error ? <p className="error" role="alert">{result.error}</p> : <div className="result-grid">
          <article><h3>Capacitancia</h3><strong>{sci(result.capacitance)} <span>F</span></strong><p className="formula">C = ε₀ · εr · A / d</p><p className="substitution">C = (8.8541878128 × 10^-12 F/m) × {params.er} × ({params.area} m²) / ({params.distance} m)</p></article>
          <article><h3>Energía almacenada</h3><strong>{sci(result.energy)} <span>J</span></strong><p className="formula">U = ½ · C · V²</p><p className="substitution">U = ½ × ({sci(result.capacitance)} F) × ({params.voltage} V)² = {sci(result.energy)} J</p></article>
        </div>}
      </section>
    </div>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
