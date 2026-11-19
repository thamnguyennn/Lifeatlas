// Life Atlas v3.0 — One deep page per house, focused strictly on natal structure and the meaning of that house.
// All Mahadasha/Antardasha timing analysis is consolidated in the dedicated Đại vận và tiểu vận chapter (Section II.2).
import { HOUSE_CLASSIC, HOUSE_CLASSIC_LINE } from "./content/story.ts";
import { SIGNS, fmtDeg, NAKSHATRA_VI, mod, DUSTHANA, type GrahaId } from "../engine/constants.ts";
import { savBand } from "../engine/ashtakavarga.ts";
import { isSeven, type PlanetStrength } from "../engine/shadbala.ts";
import type { HouseInfo, Natal } from "../engine/types.ts";
import type { Ctx } from "./ctx.ts";
import { conditionSentences, importance, lordState } from "./shared.ts";
import { narrateHouse4, PATH_LABEL4 } from "./house4.ts";
import { buildFacts } from "./facts.ts";
import type { HousePathway, HouseReading, Section, SectionBlock } from "./types.ts";
import { yogaDetail, yogaKey } from "./yogapage.ts";
import { HOUSES, HOUSE_FACULTIES, HOUSE_TAG, SIGN_FACULTY } from "./content/houses-signs.ts";
import { ASPECT_TEXT, ASPECT_BY_DISTANCE } from "./content/planets.ts";
import { PLANET_IN_HOUSE } from "./content/planet-in-house.ts";
import { SAV_LINES } from "./content/house-lines.ts";
import { MIRROR } from "./content/mirror.ts";
import { LORD_IN } from "./content/lord-in-house.ts";
import { SUPPORT_SUMMARY, SUPPORT_SUMMARY_DUST, SIGN_ON_HOUSE_DEEP, LORD_IN_TITLE, type Strength, type Support } from "./content/house-summary.ts";
import { YOGA_TEXT } from "./content/yogas.ts";
import {
  HOUSE_OPEN, SIGN_ON_HOUSE, SIGN_ON_HOUSE_SHORT, LORD_INTRO, LORD_INTRO_SHORT, LORD_SELF, NAK_SENTENCE, NAK_EXPLAIN, NAK_STYLE, EMPTY_HOUSE,
  OCCUPANT_INTRO_ONE, OCCUPANT_INTRO_MANY, OCCUPANT_INTRO_SHORT, ASPECT_INTRO, ASPECT_INTRO_SHORT, ASPECT_NONE, BAND_LINE,
  PART_TEXT, PART_SPREAD, BHAVA_LINE, BHAVA_DIVERGE, SAV_INTRO, SAV_INTRO_SHORT, SAV_REVERSE, YOGA_INTRO_ONE, YOGA_INTRO_MANY, YOGA_SHORT_ONE, YOGA_SHORT_MANY,
  EMPTY_HOUSE_SHORT, HOUSE_SECTION_TITLES as T, type PartKey,
} from "./content/house-deep.ts";
import { nameOf, domain, joinVi, fill, firstSentence } from "./util.ts";

const nakName = (name: string) => NAKSHATRA_VI[name] ?? name;
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

/** The two parts of a planet's strength that stand out most, one high and one low, if either really stands out. */
export function partRemarks(p: PlanetStrength, skipDig = false): string[] {
  const spread = PART_SPREAD[p.id];
  if (!spread) return [];
  const vals: Record<PartKey, number> = { sthana: p.sthana.total, dig: p.dig, kala: p.kala.total, cheshta: p.cheshta, drik: p.drik };
  let hi: { k: PartKey; z: number } | null = null, lo: { k: PartKey; z: number } | null = null;
  for (const k of Object.keys(vals) as PartKey[]) {
    const sp = spread[k];
    if (!sp || (skipDig && k === "dig")) continue;
    const z = (vals[k] - sp[1]) / ((sp[2] - sp[0]) / 1.68);
    if (!hi || z > hi.z) hi = { k, z };
    if (!lo || z < lo.z) lo = { k, z };
  }
  const out: string[] = [];
  if (hi && hi.z >= 0.7) out.push(PART_TEXT[hi.k].high);
  if (lo && lo.z <= -0.7) out.push(PART_TEXT[lo.k].low);
  return out;
}

/** Strength sentence(s) for one planet. The nodes have no Shadbala, so they get nothing here. */
export function strengthLines(ctx: Ctx, id: GrahaId, skipDig = false): string[] {
  if (!ctx.sb || !isSeven(id)) return [];
  const p = ctx.sb.planets[id];
  const rankPhrase = p.rank === 1 ? "mạnh nhất trong bảy hành tinh của bạn" : p.rank === 7 ? "yếu nhất trong bảy hành tinh của bạn" : `đứng thứ ${p.rank} trong bảy hành tinh của bạn`;
  return [[fill(BAND_LINE[p.band], { p: nameOf(id), pct: Math.round(p.ratio * 100), rankPhrase }), ...partRemarks(p, skipDig)].join(" ")];
}

export type Told = Map<GrahaId, number>;

const noted = new WeakMap<Told, Set<string>>();
const lastPaths = new WeakMap<Told, HousePathway[]>();

function firstTime(told: Told, key: string): boolean {
  let s = noted.get(told);
  if (!s) { s = new Set(); noted.set(told, s); }
  if (s.has(key)) return false;
  s.add(key);
  return true;
}

export function profileLines(ctx: Ctx, id: GrahaId, houseN: number, told: Told, explain = false, skipDig = false): string[] {
  const first = told.get(id);
  if (first === undefined) {
    told.set(id, houseN);
    return [`${explain ? NAK_EXPLAIN + " " : ""}${nakSentence(ctx.n, id)}`, ...strengthLines(ctx, id, skipDig)];
  }
  return [];
}

export function nakSentence(n: Natal, id: GrahaId): string {
  const g = n.grahas[id];
  return fill(NAK_SENTENCE, { p: nameOf(id), nak: nakName(g.nak.name), pada: g.nak.pada, style: NAK_STYLE[g.nak.index] });
}

function aspectBlocks(n: Natal, h: HouseInfo): SectionBlock[] {
  const tag = HOUSE_TAG[h.n - 1];
  const out: SectionBlock[] = [];
  for (const g of h.aspectedBy) {
    const from = n.grahas[g].house;
    const offset = mod(h.n - from, 12) + 1;
    const tpl = ASPECT_BY_DISTANCE[g]?.[offset] ?? ASPECT_TEXT[g];
    if (!tpl) continue;
    out.push({ label: `${nameOf(g)}, chiếu từ nhà ${from}`, paragraphs: [fill(tpl, { dH: tag })] });
  }
  return out;
}

export function readHousePage(ctx: Ctx, h: HouseInfo, told: Told = new Map()): HouseReading {
  const { n } = ctx;
  const idx = h.n - 1;
  const sign = SIGNS[h.sign];
  const full = h.n === 1;
  const dH = HOUSE_TAG[idx];
  const tone = ctx.tones[idx];
  const lordName = nameOf(h.lord);
  const lg = n.grahas[h.lord];
  const lp = h.lordHouse;
  const band = savBand(h.sav);
  const savLabel = { very_low: "rất thấp", low: "thấp", mid: "trung bình", high: "cao", very_high: "rất cao" }[band];
  const bandKey = band === "very_low" || band === "low" ? "low" : band === "mid" ? "mid" : "high";
  const dust = DUSTHANA.includes(h.n);
  const bh = ctx.sb?.bhava[idx];

  const F = buildFacts(ctx);
  const hf = F.houses[idx];
  const recent = lastPaths.get(told) ?? [];
  const narr = narrateHouse4(ctx, F, hf, recent);
  lastPaths.set(told, [...recent, narr.path]);
  const pathwayLabel = PATH_LABEL4[narr.path];
  const story = { pathway: narr.path, expressiveLevel: narr.expressive, supportLevel: narr.support };
  const sections: Section[] = [
    { id: "summary", title: narr.title, paragraphs: narr.paragraphs },
  ];
  const yogaIds = hf.yogas.filter((y) => y.strength !== "weak").map((y) => y.id);

  const facts: HouseReading["facts"] = [
    { label: "Cung trên nhà", value: sign },
    { label: `Hành tinh cai quản (${lordName})`, value: `${SIGNS[lg.sign]} ${fmtDeg(lg.deg)}, nhà ${lp}, chòm sao ${nakName(lg.nak.name)} pada ${lg.nak.pada}` },
    ...h.occupants.map((g) => {
      const gr = n.grahas[g];
      return { label: `${nameOf(g)} trong nhà`, value: `${SIGNS[gr.sign]} ${fmtDeg(gr.deg)}, chòm sao ${nakName(gr.nak.name)} pada ${gr.nak.pada}` };
    }),
    { label: "Mức độ biểu hiện", value: story.expressiveLevel },
    { label: "Mức độ nâng đỡ", value: story.supportLevel },
    { label: "Hướng dẫn dắt cấu trúc", value: pathwayLabel },
    { label: "Điểm hỗ trợ (SAV)", value: `${h.sav} (${savLabel})` },
    ...(bh ? [{ label: "Độ vững nội tại (Bhava Bala)", value: `${(bh.total / 60).toFixed(1)} rupa, xếp thứ ${bh.rank} trong 12 nhà` }] : []),
  ];

  const whyWithAxes = narr.why;

  const allText = sections.flatMap((s) => [...s.paragraphs, ...(s.blocks ?? []).flatMap((b) => b.paragraphs)]);
  return {
    n: h.n, tag: HOUSE_TAG[idx], theme: HOUSES[idx].short, ask: HOUSES[idx].ask, plain: HOUSES[idx].plain,
    signName: sign, lordName, lordHouse: lp, occupants: h.occupants.map(nameOf),
    sav: h.sav, savLabel, rank: bh?.rank ?? null, tone, score: ctx.scored[idx].score,
    pathway: story.pathway, pathwayLabel, expressiveLevel: story.expressiveLevel, supportLevel: story.supportLevel,
    why: whyWithAxes,
    sections, facts, yogaIds, words: words(allText.join(" ")),
  };
}
