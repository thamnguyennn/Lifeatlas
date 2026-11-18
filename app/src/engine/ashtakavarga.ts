// Ashtakavarga (Brihat Parashara Hora Shastra tables).
//
// Editions of the BPHS differ on four Moon/Venus entries. We use the readings
// that Jagannatha Hora uses by default (after P.V.R. Narasimha Rao): the Moon
// counts the 9th from itself and the 2nd from Jupiter as benefic and not the
// 9th from Mars or the 12th from Jupiter; Venus counts the 4th from Mars and
// not the 5th. Cross-checked against the open-source PyJHora tables.
//
// For each of the seven planets there is one table. Every contributor (the
// seven planets plus the Lagna) gives a bindu to the signs listed below,
// counted from the contributor's own sign (1 = the same sign).
// Column order in every row: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna.
// Totals: Sun 48, Moon 49, Mars 39, Mercury 54, Jupiter 56, Venus 52, Saturn 39 = 337.

import type { GrahaId } from "./constants.ts";

export const CONTRIBUTORS = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "lagna"] as const;
export type Contributor = (typeof CONTRIBUTORS)[number];

export const BAV_TABLES: Record<string, number[][]> = {
  sun: [
    [1, 2, 4, 7, 8, 9, 10, 11], [3, 6, 10, 11], [1, 2, 4, 7, 8, 9, 10, 11], [3, 5, 6, 9, 10, 11, 12],
    [5, 6, 9, 11], [6, 7, 12], [1, 2, 4, 7, 8, 9, 10, 11], [3, 4, 6, 10, 11, 12],
  ],
  moon: [
    [3, 6, 7, 8, 10, 11], [1, 3, 6, 7, 9, 10, 11], [2, 3, 5, 6, 10, 11], [1, 3, 4, 5, 7, 8, 10, 11],
    [1, 2, 4, 7, 8, 10, 11], [3, 4, 5, 7, 9, 10, 11], [3, 5, 6, 11], [3, 6, 10, 11],
  ],
  mars: [
    [3, 5, 6, 10, 11], [3, 6, 11], [1, 2, 4, 7, 8, 10, 11], [3, 5, 6, 11],
    [6, 10, 11, 12], [6, 8, 11, 12], [1, 4, 7, 8, 9, 10, 11], [1, 3, 6, 10, 11],
  ],
  mercury: [
    [5, 6, 9, 11, 12], [2, 4, 6, 8, 10, 11], [1, 2, 4, 7, 8, 9, 10, 11], [1, 3, 5, 6, 9, 10, 11, 12],
    [6, 8, 11, 12], [1, 2, 3, 4, 5, 8, 9, 11], [1, 2, 4, 7, 8, 9, 10, 11], [1, 2, 4, 6, 8, 10, 11],
  ],
  jupiter: [
    [1, 2, 3, 4, 7, 8, 9, 10, 11], [2, 5, 7, 9, 11], [1, 2, 4, 7, 8, 10, 11], [1, 2, 4, 5, 6, 9, 10, 11],
    [1, 2, 3, 4, 7, 8, 10, 11], [2, 5, 6, 9, 10, 11], [3, 5, 6, 12], [1, 2, 4, 5, 6, 7, 9, 10, 11],
  ],
  venus: [
    [8, 11, 12], [1, 2, 3, 4, 5, 8, 9, 11, 12], [3, 4, 6, 9, 11, 12], [3, 5, 6, 9, 11],
    [5, 8, 9, 10, 11], [1, 2, 3, 4, 5, 8, 9, 10, 11], [3, 4, 5, 8, 9, 10, 11], [1, 2, 3, 4, 5, 8, 9, 11],
  ],
  saturn: [
    [1, 2, 4, 7, 8, 10, 11], [3, 6, 11], [3, 5, 6, 10, 11, 12], [6, 8, 9, 10, 11, 12],
    [5, 6, 11, 12], [6, 11, 12], [3, 5, 6, 11], [1, 3, 4, 6, 10, 11],
  ],
};

export const BAV_TOTALS: Record<string, number> = {
  sun: 48, moon: 49, mars: 39, mercury: 54, jupiter: 56, venus: 52, saturn: 39,
};

export interface Ashtakavarga {
  /** bav[planet][sign] */
  bav: Record<string, number[]>;
  /** sav[sign] = sum of the seven planets' bindus in that sign */
  sav: number[];
}

/** `signs` holds the 0-based sign of the seven planets and of the Lagna. */
export function ashtakavarga(signs: Record<Contributor, number>): Ashtakavarga {
  const bav: Record<string, number[]> = {};
  const sav = new Array<number>(12).fill(0);
  for (const planet of Object.keys(BAV_TABLES)) {
    const row = new Array<number>(12).fill(0);
    BAV_TABLES[planet].forEach((positions, ci) => {
      const from = signs[CONTRIBUTORS[ci]];
      for (const p of positions) row[(from + p - 1) % 12] += 1;
    });
    bav[planet] = row;
    row.forEach((v, s) => { sav[s] += v; });
  }
  return { bav, sav };
}

/** Plain-language band for a house's SAV (average is 28). */
export type SavBand = "very_low" | "low" | "mid" | "high" | "very_high";
export function savBand(points: number): SavBand {
  if (points <= 22) return "very_low";
  if (points <= 26) return "low";
  if (points <= 30) return "mid";
  if (points <= 33) return "high";
  return "very_high";
}

export type { GrahaId };
