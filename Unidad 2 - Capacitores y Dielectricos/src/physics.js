export const EPSILON_0 = 8.8541878128e-12;
export const MATERIALS = { vacuum: { name: 'Vacío', er: 1 }, air: { name: 'Aire', er: 1.0006 }, glass: { name: 'Vidrio', er: 5 } };
export const DEFAULTS = { area: '0.01', distance: '0.001', er: '1', voltage: '12', material: 'vacuum' };

export function calculate({ area, distance, er, voltage }) {
  const values = [area, distance, er, voltage];
  if (values.some(value => String(value).trim() === '' || !Number.isFinite(Number(value)))) {
    return { error: 'Completa todos los campos con números finitos.' };
  }
  const [a, d, k, v] = values.map(Number);
  if (a <= 0) return { error: 'El área debe ser mayor que cero.' };
  if (d <= 0) return { error: 'La distancia debe ser mayor que cero.' };
  if (k < 1) return { error: 'La constante dieléctrica debe ser mayor o igual que 1.' };
  const capacitance = EPSILON_0 * k * a / d;
  const energy = 0.5 * capacitance * v * v;
  if (!Number.isFinite(capacitance) || !Number.isFinite(energy) || capacitance <= 0 || (v !== 0 && energy <= 0)) {
    return { error: 'Los valores exceden el rango numérico. Utiliza magnitudes menos extremas.' };
  }
  return { capacitance, energy };
}
