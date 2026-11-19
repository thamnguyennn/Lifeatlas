// Divisional charts (D2, D3, D9, D10) and the Jaimini soul layer (chara karakas, Karakamsa).
// Sign rules come from caelus' varga(): Parashari hora, drekkana (1-5-9), navamsa, dasamsa.
import { varga } from "caelus";
import { GRAHAS, SEVEN, mod, type GrahaId } from "./constants.ts";
import { dignityOf } from "./rules.ts";
import type { Dignity, Natal } from "./types.ts";

export type VargaN = 2 | 3 | 4 | 7 | 9 | 10;

export interface VargaPlanet {
  id: GrahaId;
  sign: number; // sign in this divisional chart, 0 = Aries
  house: number; // house counted from this chart's own lagna (D3, D9, D10 only; D2 uses horas)
  dignity: Dignity; // by sign alone (a divisional chart has no degrees to test Moolatrikona)
  d1Dignity: Dignity;
  sameAsD1: boolean;
}

export interface VargaChart {
  n: VargaN;
  lagnaSign: number;
  planets: Record<GrahaId, VargaPlanet>;
  /** Occupants per house of this chart (index 0 = house 1). */
  occupants: GrahaId[][];
}

const LEO = 4;

/**
 * The method is fixed to the Parashara rules (BPHS) so that the same birth always gives the same divisional charts:
 *   D2  Parashari hora: odd signs Sun's hora first (Leo, then Cancer), even signs Moon's hora first;
 *   D3  Drekkana: the sign, the 5th and the 9th from it;
 *   D4  Chaturthamsa: the sign, then the 4th, 7th and 10th from it;
 *   D7  Saptamsa: odd signs count from the sign itself, even signs from the 7th;
 *   D9  Navamsa: the usual nine divisions of 3°20′;
 *   D10 Dasamsa: odd signs count from the sign itself, even signs from the 9th.
 * D4 and D7 are computed here; the others come from caelus, which follows the same rules.
 */
export function vargaSign(lon: number, n: VargaN): number {
  if (n === 4 || n === 7) {
    const sign = Math.floor(mod(lon, 360) / 30), deg = mod(lon, 360) - sign * 30;
    const part = Math.min(n - 1, Math.floor(deg / (30 / n)));
    if (n === 4) return mod(sign + 3 * part, 12);
    return mod((sign % 2 === 0 ? sign : sign + 6) + part, 12);
  }
  return varga(lon, n).sign_index;
}

/** Strength of a planet in a sign of a divisional chart. Moolatrikona is folded into "own". */
export function vargaDignity(id: GrahaId, sign: number): Dignity {
  return dignityOf(id, sign, 99);
}

export function vargaChart(natal: Natal, n: VargaN): VargaChart {
  const lagnaSign = vargaSign(natal.lagna.lon, n);
  const planets = {} as Record<GrahaId, VargaPlanet>;
  const occupants: GrahaId[][] = Array.from({ length: 12 }, () => []);
  for (const id of GRAHAS) {
    const g = natal.grahas[id];
    const sign = vargaSign(g.lon, n);
    const house = mod(sign - lagnaSign, 12) + 1;
    planets[id] = {
      id, sign, house, dignity: vargaDignity(id, sign), d1Dignity: g.dignity === "moolatrikona" ? "own" : g.dignity, sameAsD1: sign === g.sign,
    };
    occupants[house - 1].push(id);
  }
  return { n, lagnaSign, planets, occupants };
}

/** D2 view: the two horas. Leo is the Sun's hora, Cancer is the Moon's hora. */
export function horaSplit(natal: Natal): { sun: GrahaId[]; moon: GrahaId[]; lagna: "sun" | "moon" } {
  const sun: GrahaId[] = [], moon: GrahaId[] = [];
  for (const id of SEVEN) (vargaSign(natal.grahas[id].lon, 2) === LEO ? sun : moon).push(id);
  return { sun, moon, lagna: vargaSign(natal.lagna.lon, 2) === LEO ? "sun" : "moon" };
}

// ---------------------------------------------------------------- Jaimini

export type KarakaRole = "AK" | "AmK" | "BK" | "MK" | "PK" | "GK" | "DK";
const ROLES: KarakaRole[] = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"];

export interface Karaka { role: KarakaRole; planet: GrahaId; deg: number }

/**
 * Seven chara karakas: the seven planets from the Sun to Saturn ranked by degrees travelled inside their sign.
 * The highest is the Atmakaraka (the "soul planet"). Rahu is left out of this seven-planet scheme.
 */
export function charaKarakas(natal: Natal): Karaka[] {
  const ranked = [...SEVEN].sort((a, b) => natal.grahas[b].deg - natal.grahas[a].deg);
  return ranked.map((planet, i) => ({ role: ROLES[i], planet, deg: natal.grahas[planet].deg }));
}

export interface Karakamsa {
  ak: GrahaId;
  /** Sign the Atmakaraka occupies in the Navamsa (D9). */
  sign: number;
  /** The same sign seen in the rashi chart, as a house counted from the Lagna. */
  house: number;
  /** Planets standing in that sign of the rashi chart. */
  occupants: GrahaId[];
}

export function karakamsa(natal: Natal): Karakamsa {
  const ak = charaKarakas(natal)[0].planet;
  const sign = natal.grahas[ak].navamsaSign;
  const house = mod(sign - natal.lagna.sign, 12) + 1;
  return { ak, sign, house, occupants: GRAHAS.filter((g) => natal.grahas[g].sign === sign) };
}
