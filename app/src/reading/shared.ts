// Helpers shared by the composer files: tone scoring for houses, the state of a house lord, the state of a planet.
// Nothing here writes new sentences except through the atoms in ./content.
import { SIGNS, NATURAL_BENEFICS, DUSTHANA, mod, type GrahaId } from "../engine/constants.ts";
import { savBand } from "../engine/ashtakavarga.ts";
import type { Natal, HouseInfo, Yoga, Dignity, DashaPeriod } from "../engine/types.ts";
import { CONDITION } from "./content/planets.ts";
import { nameOf, domain, fill, ageAt } from "./util.ts";

export type Tone = "good" | "mixed" | "hard";


export const DIGNITY_VI: Record<Dignity, string> = {
  exalted: "Đắc vị", moolatrikona: "Rất vững", own: "Cung nhà", friend: "Cung bạn",
  neutral: "Trung tính", enemy: "Cung địch", debilitated: "Hãm", none: "—",
};

export const isBenefic = (n: Natal, g: GrahaId) => {
  if (!NATURAL_BENEFICS.includes(g)) return false;
  if (g === "mercury" && n.grahas.mercury.combust) return false;
  if (g === "moon") {
    const el = mod(n.grahas.moon.lon - n.grahas.sun.lon, 360);
    return el > 20 && el < 340; // not new moon
  }
  return true;
};

// ---------------------------------------------------------------- scoring

/**
 * Cut-offs per house, measured on 3,000 random charts (scripts/calibrate.ts): "hard" = about the lowest
 * fifth of scores that house usually gets, "good" = about the highest fifth. So no house is "bad" by default.
 */
export const TONE_CUTS: [number, number][] = [[-0.5,2.5],[-1,2.5],[0.5,3.5],[-0.5,2.5],[-1.5,2],[-1,1.5],[-1.5,1.5],[-0.5,2.5],[-1.5,2],[0.5,3.5],[0.5,4],[0,2.5]];

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const half = (x: number) => Math.round(x * 2) / 2;

export function scoreHouse(n: Natal, h: HouseInfo): { score: number; why: string[] } {
  const why: string[] = [];
  let score = 0;
  const dust = DUSTHANA.includes(h.n);
  const add = (pts: number, text: string) => {
    if (pts === 0) return;
    score += pts;
    why.push(`${pts > 0 ? "+" : "−"}${Math.abs(pts)} · ${text}`);
  };

  // 1. Sarvashtakavarga: more points help, except in 6/8/12 where fewer points mean fewer troubles.
  const delta = (h.sav - 28) / 4;
  add(half(clamp(dust ? -delta : delta, -2, 2)), `điểm SAV ${h.sav}${dust ? " (nhà 6/8/12 tính ngược: ít điểm là nhẹ)" : ""}`);

  // 2. Where the lord sits.
  const lord = n.grahas[h.lord];
  const lp = lord.house;
  if (!dust) {
    if (DUSTHANA.includes(lp)) add(-1, `hành tinh cai quản nhà này đứng ở nhà ${lp}`);
    else if (lp !== 3) add(1, `hành tinh cai quản nhà này đứng ở nhà ${lp}`);
    if (lord.dignity === "exalted" || lord.dignity === "own" || lord.dignity === "moolatrikona") add(1, `hành tinh cai quản nhà này đang mạnh (${DIGNITY_VI[lord.dignity].toLowerCase()})`);
    if (lord.dignity === "debilitated") add(-1, "hành tinh cai quản nhà này đang ở cung hãm");
    if (lord.combust) add(-0.5, "hành tinh cai quản nhà này bị cháy sáng");
  } else if (DUSTHANA.includes(lp)) {
    add(1, `hành tinh cai quản nhà này đứng ở nhà ${lp}, vị trí làm nhẹ sức nặng của một nhà khó`);
  }

  // 3. Planets inside the house.
  for (const g of h.occupants) {
    const gr = n.grahas[g];
    const benefic = isBenefic(n, g);
    if (!dust) {
      if (benefic) add(1, `${nameOf(g)} (hành tinh lành) ngồi trong nhà`);
      else add([3, 10, 11].includes(h.n) ? 0.5 : -0.5, `${nameOf(g)} (hành tinh khó) ngồi trong nhà`);
      if (gr.dignity === "exalted" || gr.dignity === "own" || gr.dignity === "moolatrikona") add(0.5, `${nameOf(g)} đang mạnh`);
      if (gr.dignity === "debilitated") add(-0.5, `${nameOf(g)} đang ở cung hãm`);
    } else if (!benefic && h.n === 6) {
      add(0.5, `${nameOf(g)} (hành tinh khó) ngồi ở nhà 6, vị trí quen thuộc của nó`);
    }
  }

  // 4. Full aspects onto the house.
  for (const g of h.aspectedBy) {
    if (g === "jupiter") add(dust ? 0.5 : 1, "Sao Mộc nhìn vào nhà");
    else if (isBenefic(n, g)) add(dust ? 0 : 0.5, `${nameOf(g)} nhìn vào nhà`);
    else if (!dust && ![3, 10, 11].includes(h.n)) add(-0.5, `${nameOf(g)} nhìn vào nhà`);
  }
  return { score, why };
}

export const toneOf = (score: number, house: number): Tone => {
  const [lo, hi] = TONE_CUTS[house - 1];
  return score >= hi ? "good" : score <= lo ? "hard" : "mixed";
};

/** For ranking houses against each other we compare how far each score sits from that house's usual spread. */
export const rankValue = (score: number, house: number) => {
  const [lo, hi] = TONE_CUTS[house - 1];
  return (score - (lo + hi) / 2) / Math.max(1, hi - lo);
};

// ---------------------------------------------------------------- lord state atoms

const LORD_STATE: Record<string, string[]> = {
  exalted: [
    "{L} đang ở cung mạnh nhất của nó, nên chuyện {dH} có một người cai quản đủ sức.",
    "Hành tinh cai quản nhà này đang ở cung mạnh nhất của nó, tức là {L} làm việc ở mức tốt nhất; chuyện {dH} nhờ vậy được nâng đỡ rõ.",
  ],
  moolatrikona: [
    "{L} đứng ở một đoạn rất vững trong cung của chính nó, nên chuyện {dH} được cai quản ổn định.",
    "Hành tinh cai quản nhà này đứng ở một đoạn rất vững của {L}; chuyện {dH} vì thế khá đáng tin.",
  ],
  own: [
    "{L} đang ở trong cung của chính mình, nên chuyện {dH} có người cai quản tự tin.",
    "Hành tinh cai quản nhà này đang ở cung nhà mình, nên {L} làm việc thoải mái và chuyện {dH} ít bị cản trở.",
  ],
  debilitated: [
    "{L} đang ở vị trí yếu nhất của nó, nên chuyện {dH} cần nhiều nỗ lực hơn mức bình thường.",
    "Hành tinh cai quản nhà này đang ở vị trí yếu nhất của nó, tức {L} yếu sức hơn; với chuyện {dH}, bạn nên dựa vào kỷ luật nhiều hơn dựa vào may mắn.",
  ],
  combust: [
    "{L} đang quá gần Mặt Trời nên phần thực tế, vật chất của chuyện {dH} dễ yếu đi; phần tinh thần của nó thì thường được gạn cho sâu hơn.",
    "Hành tinh cai quản nhà này đứng quá gần Mặt Trời, ánh sáng của {L} bị lấn át; chuyện {dH} khó cho kết quả vật chất rõ ràng, nhưng phần ý nghĩa tinh thần lại sâu hơn.",
  ],
  enemy: [
    "{L} đang ở cung của hành tinh không thân, nên chuyện {dH} hay gặp cản trở và tranh chấp, và bạn cần kiên nhẫn hơn.",
    "Hành tinh cai quản nhà này ở cung không thân, nên {L} làm việc trong chỗ không hợp; chuyện {dH} vì vậy dễ gặp chống đối và cần bạn bền bỉ.",
  ],
  friend: [
    "{L} đang ở cung của một hành tinh thân thiện, nên chuyện {dH} được hỗ trợ từ bên cạnh.",
    "Hành tinh cai quản nhà này ở cung của người bạn, nên {L} làm việc thuận và chuyện {dH} có người đỡ.",
  ],
  retro: [
    "{L} đang nghịch hành (nhìn từ Trái Đất, nó có vẻ đi lùi), nên chuyện {dH} hay quay lại để xem xét hơn là đi thẳng một mạch.",
    "Hành tinh cai quản nhà này đang đi lùi trên bầu trời (nghịch hành), nên với chuyện {dH} bạn thường phải làm lại hoặc cân nhắc nhiều lần.",
  ],
};

export function lordState(n: Natal, h: HouseInfo, alt = false): string[] {
  const g = n.grahas[h.lord];
  const keys: string[] = [];
  if (g.dignity === "exalted" || g.dignity === "moolatrikona" || g.dignity === "own" || g.dignity === "debilitated") keys.push(g.dignity);
  else if (g.combust) keys.push("combust");
  else if (g.dignity === "enemy" || g.dignity === "friend") keys.push(g.dignity);
  if (g.combust && !keys.includes("combust") && keys.length < 2) keys.push("combust");
  if (g.retro) keys.push("retro");
  return keys.slice(0, 2).map((k) => fill(LORD_STATE[k][(h.n + (alt ? 1 : 0)) % 2], { L: nameOf(h.lord), dH: domain(h.n) }));
}

// ---------------------------------------------------------------- planet sentences

export function conditionSentences(n: Natal, id: GrahaId, onlyExtras = false): string[] {
  const g = n.grahas[id];
  const v = { p: nameOf(id), sign: SIGNS[g.sign] };
  const out: string[] = [];
  if (onlyExtras) {
    // the sentences that the lord section of a house page does not already say
    if (g.vargottama) out.push(fill(CONDITION.vargottama, v));
    if (g.digBala) out.push(fill(CONDITION.digBala, v));
    return out;
  }
  if (g.dignity === "exalted" || g.dignity === "moolatrikona" || g.dignity === "own" || g.dignity === "debilitated") out.push(fill(CONDITION[g.dignity], v));
  if (g.combust) out.push(fill(CONDITION.combust, v));
  if (g.retro && id !== "rahu" && id !== "ketu" && id !== "sun" && id !== "moon") out.push(fill(CONDITION.retro, v));
  if (g.vargottama) out.push(fill(CONDITION.vargottama, v));
  if (g.digBala) out.push(fill(CONDITION.digBala, v));
  if (!out.length && (g.dignity === "friend" || g.dignity === "enemy")) out.push(fill(CONDITION[g.dignity], v));
  return out.slice(0, 3);
}

export function planetFlags(n: Natal, id: GrahaId): string[] {
  const g = n.grahas[id];
  const f: string[] = [];
  if (g.retro && id !== "rahu" && id !== "ketu") f.push("Nghịch hành");
  if (g.combust) f.push("Cháy sáng");
  if (g.vargottama) f.push("Cùng cung ở lá số phụ D9");
  if (g.digBala) f.push("Đứng đúng nhà mạnh nhất của nó");
  return f;
}

// ---------------------------------------------------------------- dasha helpers

export const mahaOf = (n: Natal, g: GrahaId): DashaPeriod[] =>
  n.dasha.filter((d) => d.lord === g && ageAt(n, d.startMs) < 90 && ageAt(n, d.endMs) > 0);

export function ownedHouses(n: Natal, g: GrahaId): number[] {
  return n.houses.filter((h) => h.lord === g).map((h) => h.n);
}

export function stateOf(now: number, from: number, to: number): "past" | "now" | "future" {
  return now >= to ? "past" : now >= from ? "now" : "future";
}

export function importance(y: Yoga): number {
  const w = y.strength === "strong" ? 3 : y.strength === "normal" ? 2 : 1;
  const base = y.id.startsWith("raja") || y.id.startsWith("mahapurusha") || y.id.startsWith("dhana") ? 3 : y.id.startsWith("yogakaraka") ? 2.5 : 1;
  return w + base;
}
