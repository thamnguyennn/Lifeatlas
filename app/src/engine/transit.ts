// Transits (Gochar): where the sky stands on a given day, counted from the person's own Lagna and Moon.
import { crossings } from "caelus";
import { engine, ZODIAC, jdFromMs, msFromJd } from "./instance.ts";
import { mod, signOf, SEVEN, type GrahaId } from "./constants.ts";
import { skyAt, type SkyNow } from "./sky.ts";
import type { Natal } from "./types.ts";

/** Houses (counted from the natal Moon) in which a transiting planet is traditionally favourable. */
export const GOCHAR_GOOD: Record<GrahaId, number[]> = {
  sun: [3, 6, 10, 11],
  moon: [1, 3, 6, 7, 10, 11],
  mars: [3, 6, 11],
  mercury: [2, 4, 6, 8, 10, 11],
  jupiter: [2, 5, 7, 9, 11],
  venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  saturn: [3, 6, 11],
  rahu: [3, 6, 10, 11],
  ketu: [3, 6, 10, 11],
};

export type Support = "tốt" | "vừa" | "khó";

export interface TransitGraha {
  id: GrahaId;
  lon: number;
  sign: number;
  deg: number;
  retro: boolean;
  /** House (Whole Sign) counted from the natal Lagna. */
  fromLagna: number;
  /** House counted from the natal Moon. */
  fromMoon: number;
  /** Ashtakavarga bindus the natal chart gives this planet in the sign it is crossing (0..8), null for the nodes. */
  bindus: number | null;
  /** The classical reading from the Moon, softened or sharpened by the bindus. */
  support: Support;
}

export type TaraKind = "tốt" | "vừa" | "khó";
export interface Tara { n: number; kind: TaraKind }

export interface SlowStay {
  id: GrahaId;
  sign: number;
  since: number | null;
  until: number | null;
}

export interface NatalHit {
  transit: GrahaId;
  natal: GrahaId | "lagna";
  kind: "trùng" | "đối";
  orb: number;
}

export interface Transit {
  ms: number;
  sky: SkyNow;
  grahas: Record<GrahaId, TransitGraha>;
  moon: {
    fromLagna: number;
    fromMoon: number;
    chandraBala: boolean;
    tara: Tara;
    nakIndex: number;
  };
  sadeSati: { phase: "none" | "rising" | "peak" | "setting"; house: number };
  saturnFromMoon: number;
  ashtamaShani: boolean;
  kantakaShani: boolean;
  jupiterFromMoon: { house: number; good: boolean };
  hits: NatalHit[];
  stays?: SlowStay[];
}

const BODY: Record<GrahaId, string> = {
  sun: "sun", moon: "moon", mars: "mars", mercury: "mercury", jupiter: "jupiter", venus: "venus",
  saturn: "saturn", rahu: "true_node", ketu: "true_node",
};

const houseFrom = (sign: number, base: number) => mod(sign - base, 12) + 1;

function support(id: GrahaId, fromMoon: number, bindus: number | null): Support {
  const good = GOCHAR_GOOD[id].includes(fromMoon);
  if (bindus === null) return good ? "tốt" : "khó";
  if (good) return bindus >= 4 ? "tốt" : "vừa";
  return bindus >= 5 ? "vừa" : "khó";
}

export function taraOf(transitMoonNak: number, natalMoonNak: number): Tara {
  const n = mod(transitMoonNak - natalMoonNak, 9) + 1;
  const kind: TaraKind = [2, 4, 6, 8, 9].includes(n) ? "tốt" : n === 1 ? "vừa" : "khó";
  return { n, kind };
}

const angDist = (a: number, b: number) => {
  const d = mod(a - b, 360);
  return d > 180 ? 360 - d : d;
};

export function transitAt(natal: Natal, ms: number, opts: { stays?: boolean } = {}): Transit {
  const sky = skyAt(ms);
  const lagnaSign = natal.lagna.sign;
  const moonSign = natal.grahas.moon.sign;
  const grahas = {} as Record<GrahaId, TransitGraha>;
  for (const g of sky.grahas) {
    const fromMoon = houseFrom(g.sign, moonSign);
    const bindus = (SEVEN as GrahaId[]).includes(g.id) ? natal.bav[g.id][g.sign] : null;
    grahas[g.id] = {
      id: g.id, lon: g.lon, sign: g.sign, deg: g.deg, retro: g.retro,
      fromLagna: houseFrom(g.sign, lagnaSign), fromMoon, bindus, support: support(g.id, fromMoon, bindus),
    };
  }
  const tm = grahas.moon;
  const sat = grahas.saturn;
  const jup = grahas.jupiter;
  const sadeHouse = sat.fromMoon;
  const phase = sadeHouse === 12 ? "rising" : sadeHouse === 1 ? "peak" : sadeHouse === 2 ? "setting" : "none";

  const hits: NatalHit[] = [];
  const slow: GrahaId[] = ["saturn", "jupiter", "rahu", "ketu", "mars"];
  const points: { id: GrahaId | "lagna"; lon: number }[] = [
    { id: "lagna", lon: natal.lagna.lon },
    ...SEVEN.map((id) => ({ id: id as GrahaId, lon: natal.grahas[id].lon })),
  ];
  for (const t of slow) {
    for (const p of points) {
      if (p.id === t) continue;
      const orbTight = t === "mars" ? 2 : 3;
      const conj = angDist(grahas[t].lon, p.lon);
      const opp = Math.abs(180 - conj);
      if (conj <= orbTight) hits.push({ transit: t, natal: p.id, kind: "trùng", orb: conj });
      else if (opp <= orbTight && t !== "rahu" && t !== "ketu") hits.push({ transit: t, natal: p.id, kind: "đối", orb: opp });
    }
  }
  hits.sort((a, b) => a.orb - b.orb);

  const out: Transit = {
    ms, sky, grahas,
    moon: {
      fromLagna: tm.fromLagna, fromMoon: tm.fromMoon,
      chandraBala: GOCHAR_GOOD.moon.includes(tm.fromMoon),
      tara: taraOf(sky.moonNak.index, natal.grahas.moon.nak.index),
      nakIndex: sky.moonNak.index,
    },
    sadeSati: { phase, house: sadeHouse },
    saturnFromMoon: sadeHouse,
    ashtamaShani: sadeHouse === 8,
    kantakaShani: sadeHouse === 4,
    jupiterFromMoon: { house: jup.fromMoon, good: GOCHAR_GOOD.jupiter.includes(jup.fromMoon) },
    hits,
  };
  if (opts.stays) out.stays = (["saturn", "jupiter", "rahu", "ketu"] as GrahaId[]).map((id) => stayIn(id, ms, grahas[id].sign));
  return out;
}

// Search windows (days either side) wide enough to hold one stay in a sign.
const WINDOW: Partial<Record<GrahaId, number>> = { saturn: 1100, jupiter: 480, rahu: 640, ketu: 640 };

// How far apart the samples are when looking for a sign edge. Small enough that a slow planet cannot dip over an edge and back between two samples.
const SAMPLE_DAYS: Partial<Record<GrahaId, number>> = { saturn: 6, jupiter: 3, rahu: 4, ketu: 4 };

/** Times (Julian days) at which a body's longitude crosses `target`: coarse steps to find the edge, then halving to pin it down. */
function edgeCrossings(body: Parameters<typeof crossings>[1], target: number, jd0: number, jd1: number, step: number): number[] {
  const f = (t: number) => mod(engine.longitude(body, t, { zodiac: ZODIAC }) - target + 180, 360) - 180;
  const out: number[] = [];
  let tPrev = jd0, prev = f(jd0);
  while (tPrev < jd1) {
    const t = Math.min(tPrev + step, jd1);
    const cur = f(t);
    if (prev * cur < 0 && Math.abs(cur - prev) < 180) {
      let a = tPrev, b = t, fa = prev;
      for (let i = 0; i < 28; i++) {
        const m = (a + b) / 2, fm = f(m);
        if (fa * fm <= 0) b = m; else { a = m; fa = fm; }
      }
      out.push((a + b) / 2);
    }
    tPrev = t; prev = cur;
  }
  return out;
}

/** When a slow planet entered the sign it is crossing and when it will leave it. */
export function stayIn(id: GrahaId, ms: number, sign: number): SlowStay {
  const w = WINDOW[id] ?? 400;
  const step = SAMPLE_DAYS[id] ?? 3;
  const jd = jdFromMs(ms);
  const node = id === "rahu" || id === "ketu";
  const shift = id === "ketu" ? 180 : 0; // Ketu is Rahu turned half a circle
  const lo = mod(sign * 30 + shift, 360), hi = mod((sign + 1) * 30 + shift, 360);
  const body = BODY[id];
  // Direct planets walk in through the low edge and out through the high edge; the nodes do the opposite.
  // The entry is only looked for behind today and the exit only ahead of it.
  const entry = edgeCrossings(body, node ? hi : lo, jd - w, jd, step);
  const exit = edgeCrossings(body, node ? lo : hi, jd, jd + w, step);
  const before = entry.filter((t) => t <= jd).pop();
  const after = exit.find((t) => t > jd);
  return { id, sign, since: before === undefined ? null : msFromJd(before), until: after === undefined ? null : msFromJd(after) };
}

/** The Moon moves through one sign in about two and a half days: when does it leave the current one? */
export function moonLeavesAt(ms: number): number | null {
  const jd = jdFromMs(ms);
  const moon = engine.position("moon", jd, { zodiac: ZODIAC });
  const hi = mod((signOf(moon.lon) + 1) * 30, 360);
  const hits = crossings(engine, "moon", hi, jd, jd + 4, ZODIAC, 2);
  return hits.length ? msFromJd(hits[0]) : null;
}
