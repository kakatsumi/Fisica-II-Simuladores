// Modelos de corriente continua: fuente ideal, cables ideales y R > 0.
export const MAX_RESISTORS = 8;

export const DEFAULTS = {
  ohm: { target: 'current', voltage: '12', resistance: '100', current: '0.12' },
  series: { voltage: '12', resistors: ['100', '200'] },
  parallel: { voltage: '12', resistors: ['100', '200'] },
  mixed: { voltage: '12', seriesResistance: '100', resistors: ['200', '200'] },
};

export const isNumber = value =>
  (typeof value === 'number' || typeof value === 'string') &&
  String(value).trim() !== '' && Number.isFinite(Number(value));

function finiteResult(values) {
  return values.every(Number.isFinite);
}

export function calculateOhm({ target, voltage, resistance, current }) {
  const inputs = { voltage, resistance, current };
  if (!['voltage', 'resistance', 'current'].includes(target)) {
    return { error: 'Selecciona una variable válida para calcular.' };
  }
  const required = Object.keys(inputs).filter(key => key !== target);
  if (required.some(key => !isNumber(inputs[key]))) {
    return { error: 'Completa los dos datos conocidos con números finitos.' };
  }
  const v = Number(voltage), r = Number(resistance), i = Number(current);
  if (target !== 'resistance' && r <= 0) return { error: 'La resistencia debe ser mayor que cero.' };
  if (target === 'resistance' && i === 0) return { error: 'No se puede calcular R con corriente igual a cero.' };
  const value = target === 'voltage' ? i * r : target === 'current' ? v / r : v / i;
  if (!Number.isFinite(value) || (target === 'resistance' && value <= 0)) {
    return { error: target === 'resistance' ? 'Los valores deben producir una resistencia positiva y finita.' : 'El resultado está fuera del rango numérico.' };
  }
  if (value === 0 && (target === 'voltage' ? i !== 0 : target === 'current' ? v !== 0 : v !== 0)) {
    return { error: 'Los valores son demasiado extremos para representarse con precisión.' };
  }
  return {
    target, value,
    voltage: target === 'voltage' ? value : v,
    resistance: target === 'resistance' ? value : r,
    current: target === 'current' ? value : i,
  };
}

// Se escala por R mínima para evitar que 1/R desborde innecesariamente.
export function equivalentParallel(resistances) {
  const smallest = Math.min(...resistances);
  return smallest / resistances.reduce((sum, r) => sum + smallest / r, 0);
}

export function calculateCircuit(mode, { voltage, resistors, seriesResistance }) {
  if (!['series', 'parallel', 'mixed'].includes(mode)) return { error: 'Tipo de circuito inválido.' };
  if (!isNumber(voltage)) return { error: 'Introduce un voltaje finito para la fuente.' };
  if (!Array.isArray(resistors) || resistors.length < 1 || resistors.length > MAX_RESISTORS) {
    return { error: `Utiliza entre 1 y ${MAX_RESISTORS} resistencias en el grupo editable.` };
  }
  if (resistors.some(r => !isNumber(r)) || (mode === 'mixed' && !isNumber(seriesResistance))) {
    return { error: 'Completa todas las resistencias con números finitos.' };
  }
  const rs = resistors.map(Number), v = Number(voltage), r1 = Number(seriesResistance);
  if (rs.some(r => r <= 0) || (mode === 'mixed' && r1 <= 0)) {
    return { error: 'Todas las resistencias deben ser mayores que cero.' };
  }
  const parallelResistance = mode === 'series' ? null : equivalentParallel(rs);
  const equivalent = mode === 'series' ? rs.reduce((sum, r) => sum + r, 0)
    : mode === 'parallel' ? parallelResistance : r1 + parallelResistance;
  const current = v / equivalent;
  const parallelVoltage = mode === 'parallel' ? v : mode === 'mixed' ? current * parallelResistance : null;
  const branches = rs.map((resistance, index) => {
    const branchCurrent = mode === 'series' ? current : parallelVoltage / resistance;
    const branchVoltage = mode === 'series' ? current * resistance : parallelVoltage;
    return {
      label: `R${index + (mode === 'mixed' ? 2 : 1)}`,
      resistance, current: branchCurrent, voltage: branchVoltage,
      // V·I equivale a I²R sin elevar al cuadrado antes de multiplicar.
      power: branchVoltage * branchCurrent,
    };
  });
  const seriesComponent = mode === 'mixed' ? {
    label: 'R1', resistance: r1, current, voltage: current * r1, power: (current * r1) * current,
  } : null;
  const components = seriesComponent ? [seriesComponent, ...branches] : branches;
  const power = v * current;
  const allValues = [equivalent, current, power, ...(parallelResistance === null ? [] : [parallelResistance, parallelVoltage]), ...components.flatMap(c => [c.voltage, c.current, c.power])];
  if (!finiteResult(allValues) || equivalent <= 0 || (parallelResistance !== null && parallelResistance <= 0) ||
      (v !== 0 && (current === 0 || power === 0 || components.some(c => c.voltage === 0 || c.current === 0 || c.power === 0)))) {
    return { error: 'Los valores exceden el rango numérico. Utiliza magnitudes menos extremas.' };
  }
  return { voltage: v, equivalent, current, power, parallelResistance, parallelVoltage, components };
}

export function format(value) {
  if (!Number.isFinite(value)) return '—';
  if (value === 0) return '0';
  if (Math.abs(value) < 0.001 || Math.abs(value) >= 1e6) {
    return value.toExponential(5).replace('e', ' × 10^');
  }
  return new Intl.NumberFormat('es-PE', { maximumSignificantDigits: 6 }).format(value);
}
