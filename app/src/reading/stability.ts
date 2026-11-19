// How much of a chart survives the error in the birth time. The birth time is moved across the error window the person chose and
// every divisional chart is cast again; what changes inside the window is what the reading must not lean on.
import { computeNatal } from "../engine/core.ts";
import { GRAHAS, signOf, type GrahaId } from "../engine/constants.ts";
import { vargaSign, type VargaN } from "../engine/vargas.ts";
import type { Natal } from "../engine/types.ts";

export const VARGAS: VargaN[] = [2, 3, 4, 7, 9, 10];

export interface Stability {
  windowMin: number;
  /** Rising signs the birth time can give inside the window (D1). */
  lagna: number[];
  /** For each divisional chart: the lagna signs and, per planet, the signs it can take. */
  varga: Record<VargaN, { lagna: number[]; planets: Record<GrahaId, number[]> }>;
  /** True when no sign of the rising sign or any planet changes in D1. */
  d1Stable: boolean;
}

const uniq = (xs: number[]) => [...new Set(xs)];

export function stability(n: Natal, windowMin: number, noTime = false): Stability {
  const offsets = windowMin <= 1 ? [0, -1, 1] : [-1, -0.5, 0, 0.5, 1].map((k) => k * windowMin);
  const casts = offsets.map((m) => (m === 0 ? n : computeNatal(n.utcMs + m * 60_000, n.lat, n.lon)));
  const varga = {} as Stability["varga"];
  for (const v of VARGAS) {
    const planets = {} as Record<GrahaId, number[]>;
    for (const id of GRAHAS) planets[id] = uniq(casts.map((c) => vargaSign(c.grahas[id].lon, v)));
    varga[v] = { lagna: uniq(casts.map((c) => vargaSign(c.lagna.lon, v))), planets };
  }
  const lagna = uniq(casts.map((c) => signOf(c.lagna.lon)));
  const d1Stable = !noTime && lagna.length === 1 && GRAHAS.every((id) => uniq(casts.map((c) => c.grahas[id].sign)).length === 1);
  return { windowMin, lagna, varga, d1Stable };
}

/** How far the reading of one divisional chart can be trusted. */
export function vargaTrust(s: Stability, v: VargaN, noTime: boolean): { level: "chắc" | "một phần" | "thấp" | "không"; note: string } {
  if (noTime) return { level: "không", note: "Chưa có giờ sinh nên chưa dựng được cung mọc của lá số này; mình không đoán các nhà của nó." };
  const lagnaStable = s.varga[v].lagna.length === 1 && s.lagna.length === 1;
  const moving = GRAHAS.filter((id) => s.varga[v].planets[id].length > 1);
  if (lagnaStable && !moving.length) return { level: "chắc", note: "Trong sai số giờ sinh bạn chọn, cung mọc và vị trí các hành tinh của lá số này không đổi, nên các nhận định ở đây khá chắc." };
  if (lagnaStable) return { level: "một phần", note: `Cung mọc của lá số này giữ nguyên trong sai số giờ sinh, nhưng ${moving.length > 1 ? "các hành tinh" : "hành tinh"} ${moving.join(", ")} có thể sang cung khác; mình chỉ nêu những cấu trúc không dựa vào ${moving.length > 1 ? "chúng" : "nó"}.` };
  return { level: "thấp", note: "Trong sai số giờ sinh bạn chọn, cung mọc của lá số này có thể đổi, nên mình không đọc các nhà tính từ nó mà chỉ đọc vị trí các hành tinh khi chúng ổn định." };
}
