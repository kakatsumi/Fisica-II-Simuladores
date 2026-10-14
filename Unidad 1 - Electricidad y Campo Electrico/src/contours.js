import { evaluate } from './physics.js';

// Marching triangles / marching tetrahedra. Se refinan las intersecciones
// de las aristas mediante bisección del potencial real, sin suavizar cargas.
export function edgeRoot(a, b, va, vb, level, sample) {
  let lo = a, hi = b, flo = va - level;
  if (Math.abs(flo) < 1e-12) return a;
  if (Math.abs(vb - level) < 1e-12) return b;
  for (let i = 0; i < 14; i++) {
    const mid = lo.map((v, j) => (v + hi[j]) / 2);
    const fm = sample(mid) - level;
    if (!Number.isFinite(fm)) return null;
    if ((fm >= 0) === (flo >= 0)) { lo = mid; flo = fm; } else hi = mid;
  }
  return lo.map((v, j) => (v + hi[j]) / 2);
}

function intersections(points, values, level, edges, sample) {
  if (!values.every(Number.isFinite)) return [];
  const hits = [];
  for (const [i, j] of edges) {
    if ((values[i] >= level) === (values[j] >= level)) continue;
    const p = edgeRoot(points[i], points[j], values[i], values[j], level, sample);
    if (p && !hits.some(h => Math.hypot(...h.map((v, k) => v - p[k])) < 1e-9)) hits.push(p);
  }
  return hits;
}

export function contours2D(charges, levels, resolution = 64, bound = 2, z = 0) {
  const sample = p => { const r = evaluate(charges, p, 0.055); return r.error ? NaN : r.potential; };
  const points = [], values = [];
  for (let y = 0; y <= resolution; y++) for (let x = 0; x <= resolution; x++) {
    const p = [-bound + x * 2 * bound / resolution, -bound + y * 2 * bound / resolution, z];
    points.push(p); values.push(sample(p));
  }
  return levels.map(level => {
    const segments = [];
    for (let y = 0; y < resolution; y++) for (let x = 0; x < resolution; x++) {
      const a = y * (resolution + 1) + x, b = a + 1, d = a + resolution + 1, c = d + 1;
      for (const ids of [[a, b, c], [a, c, d]]) {
        const hits = intersections(ids.map(i => points[i]), ids.map(i => values[i]), level, [[0, 1], [1, 2], [2, 0]], sample);
        if (hits.length === 2) segments.push(hits);
      }
    }
    return { level, segments };
  });
}

export function surfaces3D(charges, levels, resolution = 18, bound = 2) {
  const sample = p => { const r = evaluate(charges, p, 0.07); return r.error ? NaN : r.potential; };
  const points = [], values = [], n = resolution + 1;
  const index = (x, y, z) => x + n * y + n * n * z;
  for (let z = 0; z < n; z++) for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const p = [x, y, z].map(v => -bound + v * 2 * bound / resolution);
    points.push(p); values.push(sample(p));
  }
  const tetrahedra = [[0, 5, 1, 6], [0, 1, 2, 6], [0, 2, 3, 6], [0, 3, 7, 6], [0, 7, 4, 6], [0, 4, 5, 6]];
  return levels.map(level => {
    const vertices = [], cache = new Map();
    const root = (a, b) => {
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      if (!cache.has(key)) cache.set(key, edgeRoot(points[a], points[b], values[a], values[b], level, sample));
      return cache.get(key);
    };
    for (let z = 0; z < resolution; z++) for (let y = 0; y < resolution; y++) for (let x = 0; x < resolution; x++) {
      const cube = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]].map(([dx,dy,dz]) => index(x+dx,y+dy,z+dz));
      for (const tet of tetrahedra) {
        const ids = tet.map(i => cube[i]);
        if (!ids.every(i => Number.isFinite(values[i]))) continue;
        const inside = ids.filter(i => values[i] >= level), outside = ids.filter(i => values[i] < level);
        if (!inside.length || !outside.length) continue;
        let triangles;
        if (inside.length === 2) {
          const a = root(inside[0], outside[0]), b = root(inside[0], outside[1]);
          const c = root(inside[1], outside[0]), d = root(inside[1], outside[1]);
          triangles = [[a,b,c], [b,d,c]];
        } else {
          const one = inside.length === 1 ? inside[0] : outside[0];
          const rest = inside.length === 1 ? outside : inside;
          triangles = [rest.map(i => root(one, i))];
        }
        for (const triangle of triangles) if (triangle.every(Boolean)) vertices.push(...triangle.flat());
      }
    }
    return { level, vertices };
  });
}

export function fieldLines2D(charges, bound = 2) {
  // Las líneas físicas en este plano solo existen como tales si todas las
  // fuentes están en z=0. Para otras configuraciones se muestran vectores.
  if (charges.some(c => Number(c.z) !== 0)) return [];
  const paths = [];
  for (const c of charges.filter(c => Number(c.q) !== 0)) {
    const sign = Number(c.q) > 0 ? 1 : -1;
    for (let seed = 0; seed < 8; seed++) {
      const angle = seed * Math.PI / 4;
      let p = [Number(c.x) + 0.08 * Math.cos(angle), Number(c.y) + 0.08 * Math.sin(angle), 0];
      const path = [p];
      for (let step = 0; step < 350; step++) {
        const r = evaluate(charges, p, 0.06);
        if (r.error || r.magnitude < 1e-10) break;
        const mid = p.map((v, i) => v + sign * 0.0125 * r.field[i] / r.magnitude);
        const m = evaluate(charges, mid, 0.06);
        if (m.error || m.magnitude < 1e-10) break;
        p = p.map((v, i) => v + sign * 0.025 * m.field[i] / m.magnitude);
        if (Math.abs(p[0]) > bound || Math.abs(p[1]) > bound) break;
        path.push(p);
      }
      if (sign < 0) path.reverse();
      paths.push(path);
    }
  }
  return paths;
}
