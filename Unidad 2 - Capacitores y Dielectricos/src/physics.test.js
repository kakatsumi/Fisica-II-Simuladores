import test from 'node:test';
import assert from 'node:assert/strict';
import { calculate, DEFAULTS } from './physics.js';
const base = calculate(DEFAULTS);
test('La capacitancia aumenta con el área', () => assert.ok(calculate({ ...DEFAULTS, area: 0.02 }).capacitance > base.capacitance));
test('La capacitancia disminuye con la distancia', () => assert.ok(calculate({ ...DEFAULTS, distance: 0.002 }).capacitance < base.capacitance));
test('La capacitancia aumenta con εr', () => assert.ok(calculate({ ...DEFAULTS, er: 5 }).capacitance > base.capacitance));
test('La energía aumenta con la magnitud del voltaje', () => assert.equal(calculate({ ...DEFAULTS, voltage: 24 }).energy, base.energy * 4));
test('Coincide con cálculo manual: A=0.01, d=0.001, εr=1, V=12', () => {
  assert.ok(Math.abs(base.capacitance / 8.8541878128e-11 - 1) < 1e-12);
  assert.ok(Math.abs(base.energy / 6.375015225216e-9 - 1) < 1e-12);
});
test('Rechaza áreas, distancias y constantes inválidas', () => {
  for (const [key, values] of Object.entries({ area: [0, -1], distance: [0, -1], er: [0, 0.99], voltage: ['', Infinity, NaN] })) {
    for (const value of values) assert.ok(calculate({ ...DEFAULTS, [key]: value }).error);
  }
});
test('Rechaza desbordamiento y subdesbordamiento', () => {
  assert.ok(calculate({ ...DEFAULTS, er: 1e308, area: 1e308 }).error);
  assert.ok(calculate({ ...DEFAULTS, area: 5e-324 }).error);
});
test('Voltaje cero y negativo son físicamente válidos', () => {
  assert.equal(calculate({ ...DEFAULTS, voltage: 0 }).energy, 0);
  assert.equal(calculate({ ...DEFAULTS, voltage: -12 }).energy, base.energy);
});
