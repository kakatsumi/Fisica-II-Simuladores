import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { calculateOhm, calculateCircuit, DEFAULTS, MAX_RESISTORS, format as f } from './physics.js';
import CircuitDiagram from './CircuitDiagram.jsx';
import './style.css';

const MODES = {
  ohm: { name: 'Ley de Ohm', subtitle: 'Relaciona voltaje, corriente y resistencia.', badge: 'UNA RESISTENCIA', description: 'Elige la incógnita e introduce los dos valores conocidos.' },
  series: { name: 'Circuito en serie', subtitle: 'Una trayectoria. La misma corriente.', badge: 'CONEXIÓN EN SERIE', description: 'Las resistencias se conectan una después de otra.' },
  parallel: { name: 'Circuito en paralelo', subtitle: 'Varias ramas. El mismo voltaje.', badge: 'CONEXIÓN EN PARALELO', description: 'Cada resistencia está conectada directamente a la fuente.' },
  mixed: { name: 'Circuito mixto', subtitle: 'Una conexión en serie y un grupo paralelo.', badge: 'SERIE + PARALELO', description: 'R1 está en serie con el grupo formado por R2, R3…' },
};
const VARIABLES = { voltage: { name: 'Voltaje', symbol: 'V', unit: 'V' }, current: { name: 'Corriente', symbol: 'I', unit: 'A' }, resistance: { name: 'Resistencia', symbol: 'R', unit: 'Ω' } };
const cloneDefaults = () => structuredClone(DEFAULTS);

function NumberField({ id, label, unit, value, onChange, positive = false }) {
  return <label className="number-field" htmlFor={id}><span>{label}</span><div className="input-wrap"><input id={id} type="number" step="any" min={positive ? '0' : undefined} value={value} onChange={event => onChange(event.target.value)} /><span className="input-unit" aria-hidden="true">{unit}</span></div></label>;
}

function Derivation({ title, formula, substitution }) {
  return <article className="derivation"><h4>{title}</h4><p className="formula">{formula}</p><p className="substitution">{substitution}</p></article>;
}

function CircuitResults({ mode, result }) {
  const { equivalent, current, power, voltage, components, parallelResistance: rp, parallelVoltage: vp } = result;
  const branches = mode === 'mixed' ? components.slice(1) : components;
  const resistanceSum = components.map(c => `${f(c.resistance)} Ω`).join(' + ');
  const reciprocal = branches.map(c => `1/(${f(c.resistance)} Ω)`).join(' + ');
  return <>
    <section className="result-cards" aria-label="Resultados principales">
      <article><span>Resistencia equivalente</span><p><strong>{f(equivalent)}</strong> Ω</p><small>{mode === 'mixed' ? 'R1 + grupo paralelo' : mode === 'series' ? 'Suma de resistencias' : 'Equivalente de todas las ramas'}</small></article>
      <article className="highlight"><span>Corriente total</span><p><strong>{f(current)}</strong> A</p><small>Corriente suministrada por la fuente</small></article>
      <article><span>Potencia total</span><p><strong>{f(power)}</strong> W</p><small>Potencia disipada en resistencias</small></article>
    </section>
    {mode === 'mixed' && <div className="group-summary"><span>Grupo paralelo: <b>{f(rp)} Ω</b></span><span>Voltaje en R1: <b>{f(components[0].voltage)} V</b></span><span>Voltaje en el grupo: <b>{f(vp)} V</b></span></div>}
    <section className="card component-results"><div className="section-heading"><h3>Resultados por resistencia</h3><span className="small-label">UNIDADES SI</span></div><div className="table-scroll"><table><caption>Distribución de voltaje, corriente y potencia</caption><thead><tr><th scope="col">Componente</th><th scope="col">R (Ω)</th><th scope="col">V (V)</th><th scope="col">I (A)</th><th scope="col">P (W)</th></tr></thead><tbody>{components.map(c => <tr key={c.label}><th scope="row"><span className="component-dot" />{c.label}</th><td>{f(c.resistance)}</td><td>{f(c.voltage)}</td><td>{f(c.current)}</td><td>{f(c.power)}</td></tr>)}</tbody></table></div></section>
    <section className="card"><div className="section-heading"><h3>Cálculo paso a paso</h3><span className="small-label">FÓRMULA → SUSTITUCIÓN</span></div>
      <div className="derivation-grid">
        {mode === 'series' ? <Derivation title="01 · Resistencia equivalente" formula="R_eq = R1 + R2 + … + Rn" substitution={`R_eq = ${resistanceSum} = ${f(equivalent)} Ω`} /> : <Derivation title="01 · Grupo paralelo" formula={mode === 'mixed' ? 'R_p = (1/R2 + 1/R3 + …)⁻¹' : 'R_eq = (1/R1 + 1/R2 + …)⁻¹'} substitution={`${mode === 'mixed' ? 'R_p' : 'R_eq'} = (${reciprocal})⁻¹ = ${f(rp)} Ω`} />}
        {mode === 'mixed' && <Derivation title="02 · Resistencia total" formula="R_eq = R1 + R_p" substitution={`R_eq = ${f(components[0].resistance)} Ω + ${f(rp)} Ω = ${f(equivalent)} Ω`} />}
        <Derivation title={`${mode === 'mixed' ? '03' : '02'} · Corriente total`} formula={mode === 'parallel' ? 'I_total = V / R_eq = Σ I_i' : 'I_total = V / R_eq'} substitution={`I_total = (${f(voltage)} V) / (${f(equivalent)} Ω) = ${f(current)} A${mode === 'parallel' ? ` = ${components.map(c => `(${f(c.current)} A)`).join(' + ')}` : ''}`} />
        <Derivation title={`${mode === 'mixed' ? '04' : '03'} · Potencia total`} formula="P_total = V × I_total = Σ P_i" substitution={`P_total = (${f(voltage)} V) × (${f(current)} A) = ${f(power)} W`} />
        {mode === 'mixed' && <Derivation title="05 · Reparto del voltaje" formula="V_R1 = I_total × R1; V_p = I_total × R_p" substitution={`V_R1 = (${f(current)} A) × (${f(components[0].resistance)} Ω) = ${f(components[0].voltage)} V; V_p = (${f(current)} A) × (${f(rp)} Ω) = ${f(vp)} V. V_R1 + V_p = ${f(voltage)} V.`} />}
      </div>
      <details className="per-component"><summary>Ver fórmulas y sustituciones de cada resistencia</summary><div className="derivation-grid">{components.map((c, index) => <Derivation key={c.label} title={c.label} formula={mode === 'series' || (mode === 'mixed' && index === 0) ? 'I_i = I_total; V_i = I_total × R_i; P_i = I_i² × R_i' : 'V_i = V_grupo; I_i = V_grupo / R_i; P_i = V_i × I_i'} substitution={`${c.label}: V = ${mode === 'series' || (mode === 'mixed' && index === 0) ? `(${f(current)} A) × (${f(c.resistance)} Ω)` : `${f(c.voltage)} V`} = ${f(c.voltage)} V; I = ${mode === 'series' || (mode === 'mixed' && index === 0) ? `${f(current)} A` : `(${f(c.voltage)} V) / (${f(c.resistance)} Ω)`} = ${f(c.current)} A; P = (${f(c.voltage)} V) × (${f(c.current)} A) = ${f(c.power)} W.`} />)}</div></details>
      <p className="interpretation">{mode === 'series' ? 'La corriente es la misma en todas las resistencias. Las caídas de voltaje suman el voltaje de la fuente.' : mode === 'parallel' ? 'Todas las ramas tienen el mismo voltaje. La corriente total es la suma de las corrientes de las ramas.' : 'Primero se reduce el grupo paralelo y después se suma R1. La corriente total atraviesa R1 y se divide al llegar al grupo.'}</p>
    </section>
  </>;
}

function OhmResults({ config, result }) {
  const variable = VARIABLES[config.target];
  const { voltage: v, current: i, resistance: r } = result;
  const formula = config.target === 'current' ? 'I = V / R' : config.target === 'voltage' ? 'V = I × R' : 'R = V / I';
  const substitution = config.target === 'current' ? `I = (${f(v)} V) / (${f(r)} Ω) = ${f(i)} A` : config.target === 'voltage' ? `V = (${f(i)} A) × (${f(r)} Ω) = ${f(v)} V` : `R = (${f(v)} V) / (${f(i)} A) = ${f(r)} Ω`;
  return <section className="card ohm-result"><span className="small-label">RESULTADO · {variable.name.toUpperCase()}</span><p className="answer"><strong>{f(result.value)}</strong><span>{variable.unit}</span></p><div className="ohm-values">{Object.entries(VARIABLES).map(([key, item]) => <span key={key}>{item.symbol} = <b>{f(result[key])} {item.unit}</b></span>)}</div><Derivation title="Ley de Ohm" formula={formula} substitution={substitution} /><p className="interpretation">{config.target === 'current' ? `Con ${f(v)} V aplicados a ${f(r)} Ω, la corriente es ${f(i)} A.` : config.target === 'voltage' ? `Para que circulen ${f(i)} A por ${f(r)} Ω se necesitan ${f(v)} V.` : `Una relación de ${f(v)} V entre ${f(i)} A corresponde a ${f(r)} Ω de resistencia.`}</p></section>;
}

function App() {
  const [mode, setMode] = useState('ohm');
  const [configs, setConfigs] = useState(cloneDefaults);
  const config = configs[mode];
  const result = mode === 'ohm' ? calculateOhm(config) : calculateCircuit(mode, config);
  const update = (key, value) => setConfigs(previous => ({ ...previous, [mode]: { ...previous[mode], [key]: value } }));
  const reset = () => setConfigs(previous => ({ ...previous, [mode]: structuredClone(DEFAULTS[mode]) }));
  const editResistor = (index, value) => update('resistors', config.resistors.map((r, i) => i === index ? value : r));
  return <main>
    <div className="topbar"><a className="brand" href="https://github.com/kakatsumi/Fisica-II-Simuladores" target="_blank" rel="noreferrer"><span className="brand-mark" aria-hidden="true">φ</span><span>Física II<span className="brand-divider">/</span>Laboratorio de circuitos</span></a><span className="university">UPeU · SIMULADORES INTERACTIVOS</span></div>
    <header><div><span className="eyebrow">UNIDAD III</span><h1>Corriente eléctrica<br /><em>y Ley de Ohm.</em></h1><p>Construye, calcula y observa cómo se distribuye la electricidad.</p></div><div className="unit-stamp"><span>V = I · R</span><small>RESISTENCIAS · CORRIENTE CONTINUA</small></div></header>
    <nav className="mode-selector" aria-label="Seleccionar simulación">{Object.entries(MODES).map(([key, item], index) => <button key={key} className={mode === key ? 'mode active' : 'mode'} aria-pressed={mode === key} onClick={() => setMode(key)}><span className="mode-index">0{index + 1}</span><span>{key === 'ohm' ? item.name : key === 'series' ? 'Serie' : key === 'parallel' ? 'Paralelo' : 'Mixto'}</span><span className="mode-dot" /></button>)}</nav>
    <div className="workspace">
      <aside className="card controls"><div className="section-heading"><h2>Parámetros</h2><span className="small-label">ENTRADAS</span></div><p className="control-description">{MODES[mode].description}</p>
        {mode === 'ohm' ? <>
          <label className="select-field" htmlFor="target"><span>¿Qué deseas calcular?</span><select id="target" value={config.target} onChange={e => update('target', e.target.value)}>{Object.entries(VARIABLES).map(([key, item]) => <option key={key} value={key}>{item.name} ({item.unit})</option>)}</select></label>
          {Object.entries(VARIABLES).map(([key, item]) => config.target === key ? <div className="calculated-field" key={key}><span>{item.name} ({item.symbol})</span><output aria-label={`${item.name} calculada`}>{result.error ? 'Pendiente' : `${f(result.value)} ${item.unit}`}</output><small>Se obtiene automáticamente</small></div> : <NumberField key={key} id={`ohm-${key}`} label={`${item.name} (${item.symbol})`} unit={item.unit} value={config[key]} positive={key === 'resistance'} onChange={v => update(key, v)} />)}
        </> : <>
          <NumberField id="source-voltage" label="Voltaje de la fuente" unit="V" value={config.voltage} onChange={v => update('voltage', v)} />
          <div className="divider" />
          {mode === 'mixed' && <div className="fixed-resistor"><span className="small-label">EN SERIE · R1</span><NumberField id="series-resistance" label="Resistencia R1" unit="Ω" value={config.seriesResistance} positive onChange={v => update('seriesResistance', v)} /></div>}
          <div className="section-heading resistor-heading"><h3>{mode === 'mixed' ? 'Grupo paralelo' : 'Resistencias'}</h3><span className="count">{config.resistors.length}/{MAX_RESISTORS}</span></div>
          <div className="resistor-list">{config.resistors.map((value, index) => <div className="resistor-row" key={index}><span className="resistor-id">R{index + (mode === 'mixed' ? 2 : 1)}</span><NumberField id={`resistor-${index}`} label={`Resistencia R${index + (mode === 'mixed' ? 2 : 1)}`} unit="Ω" value={value} positive onChange={v => editResistor(index, v)} /><button className="remove" disabled={config.resistors.length <= 1} aria-label={`Eliminar R${index + (mode === 'mixed' ? 2 : 1)}`} onClick={() => update('resistors', config.resistors.filter((_, i) => i !== index))}>×</button></div>)}</div>
          <button className="add-button" disabled={config.resistors.length >= MAX_RESISTORS} onClick={() => update('resistors', [...config.resistors, '100'])}><span aria-hidden="true">＋</span> Agregar resistencia</button>
        </>}
        <button className="reset-button" onClick={reset}><span aria-hidden="true">↺</span> Restablecer valores</button>
        <p className="input-note">R debe ser mayor que cero. Los signos de V e I indican el sentido respecto a la polaridad de referencia.</p>
      </aside>
      <div className="simulation">
        <section className={`card diagram-card${result.error ? ' diagram-invalid' : ''}`}><div className="section-heading diagram-heading"><div><span className="small-label">{MODES[mode].badge}</span><h2>{MODES[mode].name}</h2><p>{MODES[mode].subtitle}</p></div><span className={`status${result.error ? ' invalid' : ''}`}><span />{result.error ? 'Revisar datos' : 'Cálculo en tiempo real'}</span></div><CircuitDiagram mode={mode} config={config} result={result} /><div className="diagram-caption"><span><i className="legend-wire" />Conexiones ideales</span><span><i className="legend-resistor" />Resistencias óhmicas</span><span>Esquema sin escala</span></div></section>
        <div className="results-region" aria-live="polite" aria-atomic="true">{result.error ? <section className="error" role="alert"><b>Revisa los parámetros</b><p>{result.error}</p></section> : mode === 'ohm' ? <OhmResults config={config} result={result} /> : <CircuitResults mode={mode} result={result} />}</div>
      </div>
    </div>
    <footer><span>Pedro Ricardo Alva Pardave · Física II</span><span>Universidad Peruana Unión · Modelo ideal de corriente continua</span></footer>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
