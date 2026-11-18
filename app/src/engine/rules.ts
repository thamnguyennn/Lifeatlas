// Pure classical rules shared by the chart builder and the yoga detector.
import {
  SIGN_LORD, OWN_SIGNS, EXALT, MOOLATRIKONA, FRIENDS, ENEMIES, SPECIAL_ASPECTS, mod, type GrahaId,
} from "./constants.ts";
import type { Dignity } from "./types.ts";

/** Dignity of a planet in a sign. Nodes carry no dignity here (schools disagree). */
export function dignityOf(id: GrahaId, sign: number, deg: number): Dignity {
  if (id === "rahu" || id === "ketu") return "none";
  const ex = EXALT[id];
  if (ex && ex.sign === sign) return "exalted";
  if (ex && mod(ex.sign + 6, 12) === sign) return "debilitated";
  const mt = MOOLATRIKONA[id];
  if (mt && mt.sign === sign && deg >= mt.from && deg < mt.to) return "moolatrikona";
  if (OWN_SIGNS[id]?.includes(sign)) return "own";
  const lord = SIGN_LORD[sign];
  if (FRIENDS[id]?.includes(lord)) return "friend";
  if (ENEMIES[id]?.includes(lord)) return "enemy";
  return "neutral";
}

/** House offsets (counted from the planet itself) that a planet fully aspects. */
export function aspectOffsets(id: GrahaId): number[] {
  if (id === "rahu" || id === "ketu") return [];
  return [7, ...(SPECIAL_ASPECTS[id] ?? [])];
}

/** Does planet `id`, standing in house `from`, aspect house `to`? */
export function aspectsHouse(id: GrahaId, from: number, to: number): boolean {
  return aspectOffsets(id).some((off) => mod(from + off - 2, 12) + 1 === to);
}

