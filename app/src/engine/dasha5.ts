// Vimshottari dasha down to the fifth level, and an honest reliability check against birth-time error.
//
// Every level splits its parent's length among the nine lords in the fixed order, starting from the
// parent's own lord, in proportion to the lord's years out of 120. Years are 365.25 days.
import { engine, ZODIAC, jdFromMs, DASHA_YEAR_DAYS } from "./instance.ts";
import { mod, type GrahaId } from "./constants.ts";

export const DASHA_ORDER: GrahaId[] = ["ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn", "mercury"];
export const DASHA_YEARS: Record<string, number> = {
  ketu: 7, venus: 20, sun: 6, moon: 10, mars: 7, rahu: 18, jupiter: 16, saturn: 19, mercury: 17,
};
const DAY = 86_400_000;
const NAK = 360 / 27;

export type DashaLevel = 1 | 2 | 3 | 4 | 5;

export interface DNode {
  level: DashaLevel;
  lord: GrahaId;
  startMs: number;
  endMs: number;
  /** Lords from level 1 down to this level. */
  path: GrahaId[];
}

export const LEVEL_NAME: Record<DashaLevel, string> = {
  1: "Đại vận", 2: "Tiểu vận", 3: "Chặng", 4: "Nhịp", 5: "Nhịp ngắn nhất",
};
export const LEVEL_SANSKRIT: Record<DashaLevel, string> = {
  1: "Mahadasha", 2: "Antardasha", 3: "Pratyantardasha", 4: "Sukshma", 5: "Prana",
};

export interface DashaOrigin {
  /** Lord of the period running at birth. */
  lord: GrahaId;
  /** When that period began (before birth). */
  startMs: number;
  /** Years of the first period still ahead at birth. */
  balanceYears: number;
}

export function dashaOrigin(moonLon: number, birthMs: number): DashaOrigin {
  const lon = mod(moonLon, 360);
  const idx = Math.min(26, Math.floor(lon / NAK));
  const lord = DASHA_ORDER[idx % 9];
  const elapsed = (lon - idx * NAK) / NAK;
  const years = DASHA_YEARS[lord];
  return { lord, startMs: birthMs - elapsed * years * DASHA_YEAR_DAYS * DAY, balanceYears: (1 - elapsed) * years };
}

/** The nine children of a period, in order, starting from the parent's own lord. */
export function dashaChildren(node: DNode): DNode[] {
  if (node.level >= 5) return [];
  const span = node.endMs - node.startMs;
  const first = DASHA_ORDER.indexOf(node.lord);
  const out: DNode[] = [];
  let t = node.startMs;
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_ORDER[(first + i) % 9];
    const end = i === 8 ? node.endMs : t + (span * DASHA_YEARS[lord]) / 120;
    out.push({ level: (node.level + 1) as DashaLevel, lord, startMs: t, endMs: end, path: [...node.path, lord] });
    t = end;
  }
  return out;
}

/** Maha periods from birth onwards (the first one starts before birth). */
export function dashaMahas(origin: DashaOrigin, count = 10): DNode[] {
  const out: DNode[] = [];
  let t = origin.startMs;
  let i = DASHA_ORDER.indexOf(origin.lord);
  for (let k = 0; k < count; k++) {
    const lord = DASHA_ORDER[i % 9];
    const end = t + DASHA_YEARS[lord] * DASHA_YEAR_DAYS * DAY;
    out.push({ level: 1, lord, startMs: t, endMs: end, path: [lord] });
    t = end; i++;
  }
  return out;
}

/** The running period at each of the five levels, or fewer if the time is outside the 120-year span. */
export function dashaChain(origin: DashaOrigin, ms: number): DNode[] {
  const maha = dashaMahas(origin, 12).find((m) => ms >= m.startMs && ms < m.endMs);
  if (!maha) return [];
  const chain: DNode[] = [maha];
  let cur = maha;
  while (cur.level < 5) {
    const next = dashaChildren(cur).find((c) => ms >= c.startMs && ms < c.endMs) ?? dashaChildren(cur)[8];
    chain.push(next);
    cur = next;
  }
  return chain;
}

export interface Reliability {
  /** How many levels (0..5) keep the same lord for every birth time inside the window. */
  stableLevels: number;
  /** How far every period boundary can slide, in days, across the window (negative = earlier). */
  shiftDays: { min: number; max: number };
  windowMin: number;
  /** True when the Moon could sit in a different nakshatra, which changes the whole sequence. */
  nakshatraUncertain: boolean;
}

/** The window of birth-time error (minutes, plus and minus) that goes with each way of entering the time. */
export const TIME_WINDOW_MIN = { exact: 4, canh: 60, unknown: 720 } as const;

/**
 * Re-runs the dasha for birth times spread across the window and reports how many levels keep the same lord
 * at `targetMs`. Nothing is guessed: the Moon is recomputed for every sample.
 */
export function dashaReliability(birthMs: number, targetMs: number, windowMin: number, samples = 61): Reliability {
  const run = (shiftMin: number) => {
    const ms = birthMs + shiftMin * 60_000;
    const moon = engine.position("moon", jdFromMs(ms), { zodiac: ZODIAC }).lon;
    const o = dashaOrigin(moon, ms);
    return { o, chain: dashaChain(o, targetMs) };
  };
  const nominal = run(0);
  let stable = nominal.chain.length;
  let min = 0, max = 0;
  let nakChange = false;
  for (let i = 0; i < samples; i++) {
    const off = -windowMin + (2 * windowMin * i) / (samples - 1);
    const r = run(off);
    if (r.o.lord !== nominal.o.lord) nakChange = true;
    else {
      const shift = (r.o.startMs - nominal.o.startMs) / DAY;
      min = Math.min(min, shift); max = Math.max(max, shift);
    }
    for (let k = 0; k < nominal.chain.length; k++) {
      if (r.chain[k]?.lord !== nominal.chain[k].lord) { stable = Math.min(stable, k); break; }
    }
  }
  return { stableLevels: stable, shiftDays: { min, max }, windowMin, nakshatraUncertain: nakChange };
}

/** Plain-language word for how far a level can be trusted. */
export function levelTrust(level: DashaLevel, r: Reliability): "chắc" | "gần đúng" | "chỉ tham khảo" {
  if (level <= r.stableLevels) return "chắc";
  if (level === r.stableLevels + 1) return "gần đúng";
  return "chỉ tham khảo";
}
