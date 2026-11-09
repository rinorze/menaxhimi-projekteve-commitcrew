import map from '@/data/kosovo-map.json';
import { municipalities } from '@/data';

// The SVG map of Kosovo has no stored projection, so we fit one: a straight line from each municipality's
// lat/lng to the centre of its drawn shape (least squares). Kosovo is small, so this lands within a few points.

function shapeCentre(d: string) {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    minX = Math.min(minX, nums[i]);
    maxX = Math.max(maxX, nums[i]);
    minY = Math.min(minY, nums[i + 1]);
    maxY = Math.max(maxY, nums[i + 1]);
  }
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

function fit(pairs: [number, number][]) {
  const n = pairs.length;
  const mx = pairs.reduce((s, [a]) => s + a, 0) / n;
  const my = pairs.reduce((s, [, b]) => s + b, 0) / n;
  const k = pairs.reduce((s, [a, b]) => s + (a - mx) * (b - my), 0) / pairs.reduce((s, [a]) => s + (a - mx) ** 2, 0);
  return (v: number) => my + k * (v - mx);
}

const samples = map.municipalities
  .map((m) => {
    const info = municipalities.find((x) => x.slug === m.slug);
    return info ? { ...shapeCentre(m.d), lat: info.lat, lng: info.lng } : undefined;
  })
  .filter((x) => x !== undefined);

const toX = fit(samples.map((p) => [p.lng, p.x]));
const toY = fit(samples.map((p) => [p.lat, p.y]));

export const MAP_W = Number(map.viewBox.split(' ')[2]);
export const MAP_H = Number(map.viewBox.split(' ')[3]);

/** lat/lng to the map's own coordinates (0..300 x 0..325). */
export function project(lat: number, lng: number) {
  return { x: toX(lng), y: toY(lat) };
}
