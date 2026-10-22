import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOhm, calculateCircuit, DEFAULTS, MAX_RESISTORS, format } from './physics.js';

const close = (actual, expected) => assert.ok(
  Math.abs(actual - expected) <= 1e-12 * Math.max(1, Math.abs(expected)),
  `${actual} debe coincidir con ${expected}`,
);
const ohm = overrides => calculateOhm({ ...DEFAULTS.ohm, ...overrides });
const circuit = (mode, overrides = {}) => calculateCircuit(mode, { ...DEFAULTS[mode], ...overrides });

test('01 · Ohm: I = 12 V / 100 Ω = 0.12 A', () => close(ohm({ target: 'current' }).value, 0.12));
test('02 · Ohm: V = 0.12 A × 100 Ω = 12 V', () => close(ohm({ target: 'voltage' }).value, 12));
test('03 · Ohm: R = 12 V / 0.12 A = 100 Ω', () => close(ohm({ target: 'resistance' }).value, 100));
test('04 · Serie: R_eq = 100 + 200 = 300 Ω', () => close(circuit('series').equivalent, 300));
test('05 · Paralelo: R_eq = (1/100 + 1/200)⁻¹ Ω', () => close(circuit('parallel').equivalent, 200 / 3));
test('06 · Mixto: R_p = 100 Ω y R_eq = 200 Ω', () => {
  const r = circuit('mixed'); close(r.parallelResistance, 100); close(r.equivalent, 200);
});
test('07 · Serie: I_total = 12/300 = 0.04 A', () => close(circuit('series').current, 0.04));
test('08 · Paralelo: ramas de 0.12 A y 0.06 A, total de 0.18 A', () => {
  const r = circuit('parallel'); close(r.components[0].current, 0.12); close(r.components[1].current, 0.06); close(r.current, 0.18);
});
test('09 · Serie: V1 = 4 V y V2 = 8 V', () => {
  const r = circuit('series'); close(r.components[0].voltage, 4); close(r.components[1].voltage, 8);
});
test('10 · Serie: P1 = 0.16 W, P2 = 0.32 W y P_total = 0.48 W', () => {
  const r = circuit('series'); close(r.components[0].power, 0.16); close(r.components[1].power, 0.32); close(r.power, 0.48);
});
test('11 · Todas las topologías rechazan resistencias cero y negativas', () => {
  for (const mode of ['series', 'parallel', 'mixed']) for (const value of ['0', '-5']) assert.ok(circuit(mode, { resistors: [value] }).error);
  for (const value of ['0', '-5']) assert.ok(circuit('mixed', { seriesResistance: value }).error);
  assert.ok(ohm({ resistance: 0 }).error); assert.ok(ohm({ resistance: -1 }).error);
});
test('12 · Campos vacíos, texto, NaN e Infinity se rechazan', () => {
  for (const invalid of ['', ' ', 'abc', NaN, Infinity, -Infinity, null, false]) {
    assert.ok(ohm({ voltage: invalid }).error);
    assert.ok(circuit('series', { voltage: invalid }).error);
    assert.ok(circuit('parallel', { resistors: [invalid] }).error);
    assert.ok(circuit('mixed', { seriesResistance: invalid }).error);
  }
});
test('13 · Ohm: corriente cero al calcular resistencia y resistencia resultante no positiva', () => {
  assert.ok(ohm({ target: 'resistance', current: 0 }).error);
  assert.ok(ohm({ target: 'resistance', voltage: 0, current: 1 }).error);
  assert.ok(ohm({ target: 'resistance', voltage: 12, current: -1 }).error);
});
test('14 · Mixto: I = 0.06 A, V_R1 = V_p = 6 V y ramas de 0.03 A', () => {
  const r = circuit('mixed'); close(r.current, 0.06); close(r.components[0].voltage, 6); close(r.parallelVoltage, 6);
  close(r.components[1].current, 0.03); close(r.components[2].current, 0.03);
});
test('15 · Mixto: P1 = 0.36 W, P2 = P3 = 0.18 W y total = 0.72 W', () => {
  const r = circuit('mixed'); close(r.power, 0.72); close(r.components[0].power, 0.36); close(r.components[1].power, 0.18); close(r.components[2].power, 0.18);
});
test('16 · Conservación: potencia de la fuente igual a suma de potencias', () => {
  for (const mode of ['series', 'parallel', 'mixed']) {
    const r = circuit(mode); close(r.power, r.components.reduce((sum, c) => sum + c.power, 0));
    for (const c of r.components) close(c.power, c.current ** 2 * c.resistance);
  }
});
test('17 · Conservación: suma de voltajes en serie y de corrientes en paralelo', () => {
  const s = circuit('series'); close(s.voltage, s.components.reduce((sum, c) => sum + c.voltage, 0));
  for (const mode of ['parallel', 'mixed']) {
    const r = circuit(mode), branches = mode === 'mixed' ? r.components.slice(1) : r.components;
    close(r.current, branches.reduce((sum, c) => sum + c.current, 0));
    if (mode === 'mixed') close(r.voltage, r.components[0].voltage + r.parallelVoltage);
  }
});
test('18 · Voltaje cero produce corriente y potencia cero sin error', () => {
  for (const mode of ['series', 'parallel', 'mixed']) {
    const r = circuit(mode, { voltage: '0' }); assert.equal(r.current, 0); assert.equal(r.power, 0); assert.ok(!r.error);
  }
  assert.equal(ohm({ voltage: 0 }).value, 0);
});
test('19 · Polaridad negativa: corriente negativa y potencia disipada positiva', () => {
  for (const mode of ['series', 'parallel', 'mixed']) {
    const r = circuit(mode, { voltage: -12 }); assert.ok(r.current < 0); assert.ok(r.power > 0); assert.ok(r.components.every(c => c.power > 0));
  }
  close(ohm({ target: 'resistance', voltage: -12, current: -0.12 }).value, 100);
});
test('20 · Límites: de 1 a 8 resistencias editables', () => {
  for (const mode of ['series', 'parallel', 'mixed']) {
    assert.ok(!circuit(mode, { resistors: ['100'] }).error);
    assert.ok(!circuit(mode, { resistors: Array(MAX_RESISTORS).fill('100') }).error);
    assert.ok(circuit(mode, { resistors: [] }).error);
    assert.ok(circuit(mode, { resistors: Array(MAX_RESISTORS + 1).fill('100') }).error);
  }
});
test('21 · Desbordamiento y subdesbordamiento producen un mensaje de error', () => {
  assert.ok(ohm({ voltage: 1e308, resistance: 1e-308 }).error);
  assert.ok(ohm({ voltage: 1e-308, resistance: 1e308 }).error);
  assert.ok(circuit('series', { resistors: [1e308, 1e308] }).error);
  assert.ok(circuit('parallel', { resistors: [5e-324, 5e-324] }).error);
  assert.ok(circuit('mixed', { voltage: 1e308 }).error);
});
test('22 · Ohm solo valida los dos datos conocidos, no el valor a calcular', () => {
  close(ohm({ target: 'current', current: '' }).value, 0.12);
  close(ohm({ target: 'resistance', resistance: '' }).value, 100);
});
test('23 · La función de formato evita NaN e Infinity', () => {
  assert.equal(format(NaN), '—'); assert.equal(format(Infinity), '—'); assert.equal(format(0), '0');
  assert.ok(format(1e-9).includes('10^')); assert.ok(format(1e8).includes('10^'));
});
test('24 · Cambiar una resistencia actualiza el equivalente sin mutar las entradas', () => {
  const input = { voltage: '12', resistors: ['100', '100'] };
  const original = structuredClone(input);
  close(calculateCircuit('series', input).equivalent, 200);
  close(calculateCircuit('series', { ...input, resistors: ['200', '100'] }).equivalent, 300);
  assert.deepEqual(input, original);
});
