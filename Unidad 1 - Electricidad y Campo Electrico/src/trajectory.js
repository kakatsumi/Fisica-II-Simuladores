import { evaluate, finiteInput, axes, length, pointSegmentDistance } from './physics.js';

export const INITIAL_PARTICLE = { q: '0.1', mass: '1e-8', x: '0', y: '0.8', z: '0', vx: '0', vy: '0', vz: '0', duration: '2' };
export function validateParticle(p) {
  if (!Object.values(p).every(finiteInput)) return 'Completa todos los parámetros de la partícula con números finitos.';
  if (Number(p.mass) < 1e-12 || Number(p.mass) > 1) return 'La masa debe estar entre 10⁻¹² y 1 kg.';
  if (Math.abs(Number(p.q)) > 100) return 'La carga de prueba debe estar entre −100 y 100 nC.';
  if (axes.some(a => Math.abs(Number(p[a])) > 2 || Math.abs(Number(p[`v${a}`])) > 10)) return 'Posición inicial entre −2 y 2 m; velocidad por eje entre −10 y 10 m/s.';
  if (Number(p.duration) <= 0 || Number(p.duration) > 10) return 'El tiempo debe ser mayor que 0 y como máximo 10 s.';
  return null;
}

export function rk4(state, dt, acceleration) {
  const derivative = s => [...s.slice(3), ...acceleration(s.slice(0, 3))];
  const offset = (s, k, scale) => s.map((v, i) => v + scale * k[i]);
  const a = derivative(state), b = derivative(offset(state, a, dt / 2));
  const c = derivative(offset(state, b, dt / 2)), d = derivative(offset(state, c, dt));
  return state.map((v, i) => v + dt * (a[i] + 2*b[i] + 2*c[i] + d[i]) / 6);
}

export function advanceParticle(charges, config, state, maxDt) {
  const acceleration = pos => {
    if (pos.some(v => Math.abs(v) > 2.05)) throw Error('La partícula salió del dominio de ±2 m.');
    const result = evaluate(charges, pos, 0.06);
    if (result.error) throw Error('Detenida: la partícula se aproximó a menos de 0.06 m de una carga.');
    return result.field.map(e => Number(config.q) * 1e-9 * e / Number(config.mass));
  };
  let dt = Math.min(0.002, maxDt);
  try {
    for (let attempts = 0; attempts < 16; attempts++) {
      const full = rk4(state, dt, acceleration);
      const half = rk4(state, dt/2, acceleration);
      const next = rk4(half, dt/2, acceleration);
      const error = Math.max(...next.map((v, i) => Math.abs(v - full[i]) / (1 + Math.abs(v))));
      const move = length(next.slice(0,3).map((v,i) => v - state[i]));
      if (error > 1e-7 || move > 0.02) { dt /= 2; continue; }
      if (!next.every(Number.isFinite) || length(next.slice(3)) > 100) return { error: 'Detenida: velocidad o resultado fuera del rango de seguridad.' };
      if (next.slice(0,3).some(v => Math.abs(v) > 2)) return { error: 'La partícula salió del dominio de ±2 m.' };
      if (charges.some(c => Number(c.q) !== 0 && pointSegmentDistance(axes.map(a => Number(c[a])), state.slice(0,3), next.slice(0,3)) <= 0.06)) return { error: 'Detenida: aproximación a una carga (< 0.06 m).' };
      return { state: next, dt };
    }
    return { error: 'Detenida: se requiere un paso de integración demasiado pequeño.' };
  } catch (error) { return { error: error.message }; }
}
