export const K = 8.9875517923e9;
export const SINGULAR_DISTANCE = 1e-8;
export const axes = ['x', 'y', 'z'];
export const length = v => Math.hypot(...v);
export const scientific = n => Number.isFinite(n) ? n.toExponential(5).replace('e', ' × 10^') : '—';
export const finiteInput = v => String(v).trim() !== '' && Number.isFinite(Number(v));

export function presets(name = 'dipole') {
  const charge = (id, q, x = 0) => ({ id, q, x, y: 0, z: 0 });
  if (name === 'positive') return [charge(1, 5)];
  if (name === 'negative') return [charge(1, -5)];
  return [charge(1, 5, -0.6), charge(2, name === 'pair' ? 5 : -5, 0.6)];
}

export function validateCharges(charges) {
  if (charges.length > 10) return 'Se permiten como máximo 10 cargas.';
  for (const c of charges) {
    if (![c.q, c.x, c.y, c.z].every(finiteInput)) return `Completa los valores de la carga ${c.id}.`;
    if (Math.abs(Number(c.q)) > 1000) return 'Utiliza cargas entre −1000 y 1000 nC.';
    if (axes.some(a => Math.abs(Number(c[a])) > 2)) return 'Las cargas deben estar entre −2 y 2 m en cada eje.';
  }
  return null;
}

// q se ingresa en nC y se convierte a C en cada evaluación.
export function evaluate(charges, point, exclusion = SINGULAR_DISTANCE) {
  if (point.length !== 3 || !point.every(finiteInput) || validateCharges(charges)) return { error: 'Entradas inválidas.' };
  const field = [0, 0, 0];
  let potential = 0;
  const contributions = [];
  for (const c of charges) {
    const q = Number(c.q) * 1e-9;
    const delta = axes.map((a, i) => Number(point[i]) - Number(c[a]));
    const distance = length(delta);
    if (q !== 0 && distance <= exclusion) return { error: 'Campo y potencial no definidos en la posición de una carga puntual (o demasiado cerca para este cálculo).' };
    const v = q === 0 ? 0 : K * q / distance;
    const e = q === 0 ? [0, 0, 0] : delta.map(d => K * q * d / distance ** 3);
    potential += v;
    e.forEach((value, i) => { field[i] += value; });
    contributions.push({ id: c.id, q: Number(c.q), delta, distance, potential: v, field: e });
  }
  if (![...field, potential].every(Number.isFinite)) return { error: 'Resultado fuera del rango numérico.' };
  const magnitude = length(field);
  return { field, potential, magnitude, direction: magnitude > 1e-12 ? field.map(e => e / magnitude) : null, contributions };
}

export function pointSegmentDistance(point, a, b) {
  const ab = b.map((v, i) => v - a[i]);
  const denominator = ab.reduce((s, v) => s + v * v, 0);
  const t = denominator === 0 ? 0 : Math.max(0, Math.min(1, point.reduce((s, v, i) => s + (v - a[i]) * ab[i], 0) / denominator));
  return length(point.map((v, i) => v - a[i] - t * ab[i]));
}
