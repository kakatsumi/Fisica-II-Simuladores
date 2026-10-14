import test from 'node:test';
import assert from 'node:assert/strict';
import { K, evaluate, presets, validateCharges, pointSegmentDistance } from './physics.js';
import { contours2D, surfaces3D, fieldLines2D } from './contours.js';
import { rk4, advanceParticle, INITIAL_PARTICLE, validateParticle } from './trajectory.js';
const close=(a,b,tolerance=1e-10)=>assert.ok(Math.abs(a-b)<=tolerance*Math.max(1,Math.abs(b)),`${a} ≠ ${b}`);

test('1. Carga positiva: campo a 2 m en +X',()=>{
  const r=evaluate(presets('positive'),[2,0,0]);
  close(r.field[0],K*5e-9/4);close(r.field[1],0);close(r.field[2],0);close(r.magnitude,11.234439740375);
  assert.deepEqual(r.direction,[1,0,0]);
});
test('2. Carga negativa: campo dirigido hacia la carga',()=>{
  const r=evaluate(presets('negative'),[2,0,0]);
  close(r.field[0],-K*5e-9/4);assert.deepEqual(r.direction,[-1,0,0]);
});
test('3. Superposición vectorial: dipolo en el punto medio',()=>{
  const r=evaluate(presets(),[0,0,0]);close(r.field[0],2*K*5e-9/.6**2);close(r.potential,0);
  close(evaluate(presets('pair'),[0,0,0]).magnitude,0);
});
test('4. Potencial de una carga positiva y negativa a 2 m',()=>{
  close(evaluate(presets('positive'),[2,0,0]).potential,22.46887948075);
  close(evaluate(presets('negative'),[2,0,0]).potential,-22.46887948075);
});
test('5. Potencial de dos cargas: suma de aportes',()=>{
  const r=evaluate(presets('pair'),[0,0,0]);close(r.potential,2*K*5e-9/.6);
  close(r.potential,r.contributions.reduce((s,c)=>s+c.potential,0));
});
test('6. Singularidades, cercanía y entradas no finitas',()=>{
  assert.ok(evaluate(presets('positive'),[0,0,0]).error);
  assert.ok(evaluate(presets('positive'),[1e-9,0,0]).error);
  assert.ok(Number.isFinite(evaluate(presets('positive'),[1e-4,0,0]).potential));
  assert.ok(evaluate(presets(),[NaN,0,0]).error);
  assert.ok(evaluate(presets(),['',0,0]).error);
});
test('7. RK4: movimiento en campo uniforme conocido',()=>{
  // q=1e-9 C, m=1e-9 kg, E=(2,0,0) N/C => a=(2,0,0) m/s².
  let state=[0,0,0,1,0,0];for(let i=0;i<100;i++)state=rk4(state,.01,()=>[2,0,0]);
  close(state[0],2);close(state[3],3);close(state[1],0);
});
test('8. Curvas: vértices y puntos medios mantienen el potencial',()=>{
  const charges=presets('positive'), level=45;
  const [{segments}]=contours2D(charges,[level]);assert.ok(segments.length>50);
  for(const segment of segments){for(const p of segment)close(evaluate(charges,p).potential,level,2e-5);
    const mid=segment[0].map((v,i)=>(v+segment[1][i])/2);close(evaluate(charges,mid).potential,level,.005);}
});
test('9. Superficies 3D: vértices y centroides mantienen el potencial',()=>{
  const charges=presets('positive'), level=45;
  const [{vertices}]=surfaces3D(charges,[level]);assert.ok(vertices.length>300);
  for(let i=0;i<vertices.length;i+=9){const triangle=[vertices.slice(i,i+3),vertices.slice(i+3,i+6),vertices.slice(i+6,i+9)];
    for(const p of triangle)close(evaluate(charges,p).potential,level,3e-5);
    const center=[0,1,2].map(j=>triangle.reduce((sum,p)=>sum+p[j],0)/3);close(evaluate(charges,center).potential,level,.04);}
});
test('Gestión: límite de 10, rangos y valores vacíos',()=>{
  assert.ok(validateCharges(Array.from({length:11},()=>presets('positive')[0])));
  assert.ok(validateCharges([{...presets('positive')[0],x:3}]));
  assert.ok(validateCharges([{...presets('positive')[0],q:''}]));
  assert.equal(validateCharges([]),null);assert.equal(evaluate([], [0,0,0]).potential,0);
});
test('Campo y potencial 3D usan la coordenada Z real',()=>{
  const charges=[{id:1,q:5,x:0,y:0,z:1}];const r=evaluate(charges,[0,0,2]);
  close(r.field[2],K*5e-9);close(r.field[0],0);close(r.potential,K*5e-9);
});
test('Líneas 2D siguen el sentido positivo y negativo',()=>{
  const positive=fieldLines2D(presets('positive'))[0];assert.ok(positive.at(-1)[0]>positive[0][0]);
  const negative=fieldLines2D(presets('negative'))[0];assert.ok(negative.at(-1)[0]<negative[0][0]);
  assert.deepEqual(fieldLines2D([{id:1,q:5,x:0,y:0,z:1}]),[]);
});
test('Trayectoria real: aceleración positiva, movimiento neutro y parada cercana',()=>{
  const p={...INITIAL_PARTICLE,q:1,mass:1e-9};
  const r=advanceParticle(presets('positive'),p,[1,0,0,0,0,0],.001);
  assert.ok(!r.error);assert.ok(r.state[0]>1);assert.ok(r.state[3]>0);
  const n=advanceParticle([],p,[0,0,0,1,0,0],.001);close(n.state[0],.001);close(n.state[3],1);
  assert.ok(advanceParticle(presets('positive'),p,[.05,0,0,0,0,0],.001).error);
  close(pointSegmentDistance([0,0,0],[-1,0,0],[1,0,0]),0);
});
test('Validación de partícula: masa, tiempo, coordenadas y datos finitos',()=>{
  assert.equal(validateParticle(INITIAL_PARTICLE),null);
  for(const p of [{mass:0},{mass:-1},{duration:0},{q:Infinity},{vx:20},{z:''}])assert.ok(validateParticle({...INITIAL_PARTICLE,...p}));
});
