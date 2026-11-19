// The fact base: everything the reading engines need to know about a chart, worked out once and named in plain terms.
// Nothing here writes a sentence. The engines (overview, houses, nodes, vargas, dasha, forecast, explore) ask this file
// "how strong is Jupiter?", "who looks at the 7th house?", "which yogas pass through house 10?" and write from the answers,
// so every claim in the reading can be traced back to a fact in this file.
import { GRAHAS, SEVEN, SIGN_LORD, KENDRA, TRIKONA, DUSTHANA, NATURAL_BENEFICS, mod, type GrahaId } from "../engine/constants.ts";
import { savBand, type SavBand } from "../engine/ashtakavarga.ts";
import { aspectsHouse } from "../engine/rules.ts";
import { isSeven, type BhavaStrength, type PlanetStrength } from "../engine/shadbala.ts";
import type { Dignity, Graha, HouseInfo, Natal, Yoga } from "../engine/types.ts";
import type { Ctx } from "./ctx.ts";

/** How well a planet can deliver what it stands for, put together from its sign, Shadbala and the small conditions. */
export type Grade = "strong" | "good" | "mixed" | "weak";

/** What a planet means for THIS rising sign, by the houses it rules. */
export type Role = "yogakaraka" | "lagna" | "trikona" | "kendra" | "dhana" | "upachaya" | "dusthana" | "node";

export interface PlanetFact {
  id: GrahaId;
  g: Graha;
  sign: number;
  /** Null when there is no birth time. */
  house: number | null;
  lorded: number[];
  role: Role;
  grade: Grade;
  /** The number behind the grade (about −3 … +4). */
  score: number;
  dignity: Dignity;
  sb: PlanetStrength | null;
  /** Other planets in the same sign. */
  conj: GrahaId[];
  /** Planets that cast a full aspect on the house this planet stands in. */
  aspectedBy: GrahaId[];
  /** The lord of the sign this planet stands in. */
  dispositor: GrahaId;
  natural: "benefic" | "malefic";
}

export type Tier = "top" | "mid" | "low";

export interface HouseFact {
  n: number;
  sign: number;
  lord: GrahaId;
  lordHouse: number;
  lord_: PlanetFact;
  occupants: GrahaId[];
  /** Planets that look at the house without standing in it. */
  aspects: GrahaId[];
  sav: number;
  savBand: SavBand;
  bhava: BhavaStrength | null;
  tier: Tier;
  dusthana: boolean;
  /** Natural significators of the house (Jupiter for the 5th, Venus for the 7th ...). */
  karakas: GrahaId[];
  yogas: Yoga[];
}

export interface Facts {
  n: Natal;
  noTime: boolean;
  window: number;
  planets: Record<GrahaId, PlanetFact>;
  houses: HouseFact[];
  /** Planets from the strongest to the weakest, with the nodes left out. */
  order: GrahaId[];
}

export const KARAKA: Record<number, GrahaId[]> = {
  1: ["sun"], 2: ["jupiter"], 3: ["mars"], 4: ["moon"], 5: ["jupiter"], 6: ["mars", "saturn"], 7: ["venus"], 8: ["saturn"], 9: ["jupiter", "sun"],
  10: ["sun", "saturn", "mercury"], 11: ["jupiter"], 12: ["saturn"],
};

const DIGNITY_SCORE: Record<Dignity, number> = { exalted: 2, moolatrikona: 1.6, own: 1.4, friend: 0.5, neutral: 0, none: 0, enemy: -0.6, debilitated: -1.7 };

function roleOf(lorded: number[], id: GrahaId): Role {
  if (id === "rahu" || id === "ketu") return "node";
  const k = lorded.some((h) => [4, 7, 10].includes(h)), t = lorded.some((h) => [5, 9].includes(h));
  if (k && t) return "yogakaraka";
  if (lorded.includes(1)) return "lagna";
  if (t) return "trikona";
  if (lorded.some((h) => DUSTHANA.includes(h)) && !k) return "dusthana";
  if (k) return "kendra";
  if (lorded.some((h) => [2, 11].includes(h))) return "dhana";
  return "upachaya";
}

/** The yoga is placed in the houses it names; one with no house of its own (Sunapha ...) goes where its planets stand. */
export function yogaHomes(n: Natal, y: Yoga): number[] {
  const hs = y.houses.length ? y.houses : y.grahas.map((g) => n.grahas[g].house);
  return [...new Set(hs)];
}

/** A yoga that is worth saying: one that is not weakened to nothing. */
export const effectiveYoga = (y: Yoga) => y.strength !== "weak";

const cache = new WeakMap<Natal, Map<number, Facts>>();

export function buildFacts(ctx: Ctx): Facts {
  const byWindow = cache.get(ctx.n) ?? new Map<number, Facts>();
  const hit = byWindow.get(ctx.windowMin + (ctx.noTime ? 0.5 : 0));
  if (hit) return hit;
  const { n, noTime, sb } = ctx;

  const planets = {} as Record<GrahaId, PlanetFact>;
  for (const id of GRAHAS) {
    const g = n.grahas[id];
    const lorded = noTime ? [] : n.houses.filter((h) => h.lord === id).map((h) => h.n);
    const strength = sb && isSeven(id) ? sb.planets[id] : null;
    let score = DIGNITY_SCORE[g.dignity];
    if (strength) score += strength.ratio >= 1.35 ? 0.8 : strength.ratio >= 1.1 ? 0.4 : strength.ratio >= 0.95 ? 0 : -0.6;
    if (g.combust) score -= 0.8;
    if (g.digBala) score += 0.3;
    if (g.vargottama) score += 0.4;
    const grade: Grade = score >= 1.6 ? "strong" : score >= 0.5 ? "good" : score > -0.5 ? "mixed" : "weak";
    planets[id] = {
      id, g, sign: g.sign, house: noTime ? null : g.house, lorded, role: roleOf(lorded, id), grade, score, dignity: g.dignity, sb: strength,
      conj: GRAHAS.filter((o) => o !== id && n.grahas[o].sign === g.sign),
      aspectedBy: noTime ? [] : SEVEN.filter((o) => o !== id && n.grahas[o].house !== g.house && aspectsHouse(o, n.grahas[o].house, g.house)),
      dispositor: SIGN_LORD[g.sign],
      natural: NATURAL_BENEFICS.includes(id) ? "benefic" : "malefic",
    };
  }

  const houses: HouseFact[] = noTime ? [] : n.houses.map((h: HouseInfo, i) => {
    const bhava = sb ? sb.bhava[i] : null;
    return {
      n: h.n, sign: h.sign, lord: h.lord, lordHouse: h.lordHouse, lord_: planets[h.lord], occupants: h.occupants, aspects: h.aspectedBy,
      sav: h.sav, savBand: savBand(h.sav), bhava, tier: bhava ? (bhava.rank <= 4 ? "top" : bhava.rank <= 8 ? "mid" : "low") : "mid",
      dusthana: DUSTHANA.includes(h.n), karakas: KARAKA[h.n] ?? [],
      yogas: n.yogas.filter((y) => yogaHomes(n, y).includes(h.n)),
    };
  });

  const order = (sb ? sb.order : [...SEVEN].sort((a, b) => planets[b].score - planets[a].score)) as GrahaId[];
  const facts: Facts = { n, noTime, window: ctx.windowMin, planets, houses, order };
  byWindow.set(ctx.windowMin + (noTime ? 0.5 : 0), facts);
  cache.set(ctx.n, byWindow);
  return facts;
}

// ------------------------------------------------------------------ small questions the engines ask all the time

export const isGood = (p: PlanetFact) => p.grade === "strong" || p.grade === "good";
export const isKendra = (h: number) => KENDRA.includes(h);
export const isTrikona = (h: number) => TRIKONA.includes(h);
export const isDusthana = (h: number) => DUSTHANA.includes(h);
export const isUpachaya = (h: number) => [3, 6, 10, 11].includes(h);

/** Where the planet stands, counted from another planet (1 = same sign). */
export const fromPlanet = (n: Natal, a: GrahaId, b: GrahaId) => mod(n.grahas[a].sign - n.grahas[b].sign, 12) + 1;

/** Natural friendship of two planets as the classical tables give it: "mitra", "satru" or "sama" (looked at both ways). */
export { FRIENDS, ENEMIES } from "../engine/constants.ts";

/** Short names of the houses that read well inside a list ("bản thân, tiền bạc và nhà cửa"). */
export const HOUSE_SHORT = ["bản thân", "tiền bạc", "sự chủ động", "nhà cửa", "sáng tạo", "công việc hằng ngày", "chuyện chung sống", "những biến chuyển lớn", "niềm tin", "sự nghiệp", "thành quả", "sự buông bỏ"];
