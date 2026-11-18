// Per-house score cut-offs: "hard" = bottom ~22% of charts for that house, "good" = top ~22%.
// Run once; paste the printed table into compose.ts (TONE_CUTS).
import { computeNatal } from "../src/engine/core.ts";
import { scoreHouse } from "../src/reading/compose.ts";

let seed = 20240607;
const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
const perHouse: number[][] = Array.from({ length: 12 }, () => []);
const N = 3000;
for (let i = 0; i < N; i++) {
  const ms = Date.UTC(1920, 0, 1) + rnd() * (Date.UTC(2030, 0, 1) - Date.UTC(1920, 0, 1));
  const n = computeNatal(ms, 8 + rnd() * 15, 102 + rnd() * 8);
  n.houses.forEach((h, k) => perHouse[k].push(scoreHouse(n, h).score));
}
const TARGET = 0.26;
const cuts = perHouse.map((a) => {
  const vals = [...new Set(a)].sort((x, y) => x - y);
  const cumLow = (v: number) => a.filter((s) => s <= v).length / a.length;
  const cumHigh = (v: number) => a.filter((s) => s >= v).length / a.length;
  let lo = vals[0] - 0.5;
  for (const v of vals) if (cumLow(v) <= TARGET) lo = v;
  let hi = vals[vals.length - 1] + 0.5;
  for (const v of [...vals].reverse()) if (cumHigh(v) <= TARGET) hi = v;
  return [lo, hi];
});
console.log("export const TONE_CUTS: [number, number][] = " + JSON.stringify(cuts) + ";");
// resulting shares with the rule: hard if s <= lo, good if s >= hi
const share = perHouse.map((a, k) => {
  const [lo, hi] = cuts[k];
  const g = a.filter((s) => s >= hi).length / a.length, h = a.filter((s) => s <= lo).length / a.length;
  return `${(100 * h).toFixed(0)}/${(100 * g).toFixed(0)}`;
});
console.log("hard%/good% per house:", share.join("  "));
