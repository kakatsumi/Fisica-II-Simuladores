import React, { useId } from 'react';
import { format as f, isNumber } from './physics.js';

function Resistor({ x, y, label, value, vertical = false }) {
  return <g>
    <g transform={`translate(${x} ${y})${vertical ? ' rotate(90)' : ''}`}>
      <path d="M-48 0H-32L-26 -10L-16 10L-6 -10L4 10L14 -10L24 10L32 0H48" className="resistor-symbol" />
    </g>
    <text x={vertical ? x + 26 : x} y={vertical ? y - 3 : y - 25} textAnchor={vertical ? 'start' : 'middle'} className="component-label">{label}</text>
    <text x={vertical ? x + 26 : x} y={vertical ? y + 17 : y + 34} textAnchor={vertical ? 'start' : 'middle'} className="component-value">{isNumber(value) ? f(Number(value)) : '—'} Ω</text>
  </g>;
}

export default function CircuitDiagram({ mode, config, result }) {
  const arrowId = useId().replaceAll(':', '');
  const simple = mode === 'ohm' || mode === 'series';
  const values = mode === 'ohm' ? [result.error ? null : result.resistance] : config.resistors;
  const height = simple ? Math.max(300, values.length * 100 + 110) : Math.max(320, values.length * 78 + 130);
  const top = 60, bottom = height - 45, cy = (top + bottom) / 2;
  const sourceX = 90, voltage = mode === 'ohm' ? (result.error ? null : result.voltage) : config.voltage;
  const bus = mode === 'mixed' ? 300 : 235, right = 600;
  const current = result.error ? null : result.current;
  const title = { ohm: 'Circuito resistivo simple', series: 'Resistencias conectadas en serie', parallel: 'Resistencias conectadas en paralelo', mixed: 'R1 en serie con un grupo paralelo' }[mode];
  const dot = (x, y, key) => <circle key={key} cx={x} cy={y} r="4" className="junction" />;
  return <div className="diagram-scroll">
    <svg viewBox={`0 0 760 ${height}`} role="img" aria-label={title} className="circuit-svg">
      <title>{title}</title>
      <desc>Fuente ideal de {isNumber(voltage) ? f(Number(voltage)) : 'valor pendiente'} voltios. {simple ? 'Una sola trayectoria de corriente.' : 'Las ramas comparten los mismos dos nodos.'}</desc>
      <defs><marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#c66a12" /></marker></defs>
      <g className="wire">
        <path d={`M${sourceX} ${top}V${cy - 29}M${sourceX} ${cy + 29}V${bottom}`} />
        {simple ? <>
          <path d={`M${sourceX} ${top}H500`} />
          {values.map((_, i) => {
            const y = cy + (i - (values.length - 1) / 2) * 100;
            return <path key={i} d={`M500 ${i === 0 ? top : y - 100 + 48}V${y - 48}`} />;
          })}
          <path d={`M500 ${cy + (values.length - 1) * 50 + 48}V${bottom}H${sourceX}`} />
        </> : <>
          {mode === 'mixed' ? <><path d={`M${sourceX} ${top}H147M243 ${top}H${bus}`} /><Resistor x={195} y={top} label="R1" value={config.seriesResistance} /></> : <path d={`M${sourceX} ${top}H${bus}`} />}
          <path d={`M${bus} ${top}V${110 + (values.length - 1) * 78}M${right} 110V${bottom}H${sourceX}`} />
          {values.map((_, i) => <path key={i} d={`M${bus} ${110 + i * 78}H${(bus + right) / 2 - 48}M${(bus + right) / 2 + 48} ${110 + i * 78}H${right}`} />)}
        </>}
      </g>
      <circle cx={sourceX} cy={cy} r="29" className="source-symbol" />
      <text x={sourceX} y={cy - 5} textAnchor="middle" className="source-polarity">+</text>
      <text x={sourceX} y={cy + 18} textAnchor="middle" className="source-polarity">−</text>
      <text x={sourceX + 45} y={cy - 3} className="component-label">Fuente</text>
      <text x={sourceX + 45} y={cy + 18} className="component-value">{isNumber(voltage) ? f(Number(voltage)) : '—'} V</text>
      {values.map((value, i) => simple ?
        <Resistor key={i} x={500} y={cy + (i - (values.length - 1) / 2) * 100} label={mode === 'ohm' ? 'R' : `R${i + 1}`} value={value} vertical /> :
        <g key={i}><Resistor x={(bus + right) / 2} y={110 + i * 78} label={`R${i + (mode === 'mixed' ? 2 : 1)}`} value={value} />{dot(bus, 110 + i * 78, 'left')}{dot(right, 110 + i * 78, 'right')}</g>)}
      {current !== null && current !== 0 && <g className="current-arrow">
        <path d={simple ? (current > 0 ? 'M280 60H355' : 'M355 60H280') : (current > 0 ? `M${bus} 70V94` : `M${bus} 94V70`)} markerEnd={`url(#${arrowId})`} />
        <text x={simple ? 317 : bus + 16} y={simple ? 39 : 87} textAnchor={simple ? 'middle' : 'start'}>I</text>
      </g>}
    </svg>
  </div>;
}
