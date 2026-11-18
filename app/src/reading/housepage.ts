// Life Atlas v3.0 — One deep page per house, focused strictly on natal structure and the meaning of that house.
// All Mahadasha/Antardasha timing analysis is consolidated in the dedicated Đại vận và tiểu vận chapter (Section II.2).
import { HOUSE_CLASSIC, HOUSE_CLASSIC_LINE } from "./content/story.ts";
import { SIGNS, fmtDeg, NAKSHATRA_VI, mod, DUSTHANA, type GrahaId } from "../engine/constants.ts";
import { savBand } from "../engine/ashtakavarga.ts";
import { isSeven, type PlanetStrength } from "../engine/shadbala.ts";
import type { HouseInfo, Natal } from "../engine/types.ts";
import type { Ctx } from "./ctx.ts";
import { conditionSentences, importance, lordState } from "./shared.ts";
import { houseStory, PATHWAY_LABELS } from "./story.ts";
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
import { nameOf, domain, joinVi, fill } from "./util.ts";

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
const lastPathway = new WeakMap<Told, HousePathway>();

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

  const prevPath = lastPathway.get(told) ?? null;
  const story = houseStory(ctx, h, prevPath);
  lastPathway.set(told, story.pathway);
  const pathwayLabel = PATHWAY_LABELS[story.pathway];

  const sections: Section[] = [];

  sections.push({ id: "open", title: T.open, paragraphs: [HOUSE_OPEN[idx]] });

  const strength: Strength = bh ? (bh.rank <= 4 ? "strong" : bh.rank <= 8 ? "mid" : "weak") : "mid";
  const supportKey: Support = bandKey;
  const verdictLine = tone === "mixed" ? "" : MIRROR[idx][tone].scene;
  const hc = HOUSE_CLASSIC[h.n - 1];
  const classicHouse = fill(HOUSE_CLASSIC_LINE[tone], { up: hc.up, down: hc.down });
  const ASPECT_ORDER: GrahaId[] = ["jupiter", "venus", "mercury", "moon", "saturn", "mars", "sun", "rahu", "ketu"];
  const aspectBlocksAll = aspectBlocks(n, h);
  const aspectLines = [...h.aspectedBy]
    .sort((a, b) => ASPECT_ORDER.indexOf(a) - ASPECT_ORDER.indexOf(b)).slice(0, 2)
    .map((g) => aspectBlocksAll.find((bl) => bl.label.startsWith(`${nameOf(g)},`))?.paragraphs[0])
    .filter((x): x is string => !!x);
  const supportLine = dust ? fill(SUPPORT_SUMMARY_DUST[supportKey], { dH }) : fill(SUPPORT_SUMMARY[strength][supportKey], { dH });
  const summaryAtoms = [verdictLine, ...story.used, ...aspectLines, supportLine];
  sections.push({
    id: "summary", title: LORD_IN_TITLE[h.n]?.[lp - 1] ?? T.summary,
    paragraphs: [verdictLine, ...story.paragraphs, [...aspectLines, supportLine].join(" "), classicHouse].filter(Boolean),
  });

  sections.push({
    id: "sign", title: T.sign(sign), fold: true,
    paragraphs: [fill(full ? SIGN_ON_HOUSE : SIGN_ON_HOUSE_SHORT, { sign }), ...HOUSE_FACULTIES[idx].map((f) => SIGN_FACULTY[h.sign][f])],
  });

  // the lord
  const lordParas = [
    fill(full ? LORD_INTRO : LORD_INTRO_SHORT, { n: h.n, lord: lordName }),
    ...(lp === h.n ? [fill(LORD_SELF, { dH })] : []),
    LORD_IN[idx][lp - 1],
    ...lordState(n, h),
    ...profileLines(ctx, h.lord, h.n, told, full),
  ];
  sections.push({ id: "lord", title: T.lord(lordName), fold: true, paragraphs: lordParas });

  // who sits inside
  if (!h.occupants.length) {
    sections.push({ id: "inside", title: T.inside, fold: true, paragraphs: [fill(firstTime(told, "empty") ? EMPTY_HOUSE : EMPTY_HOUSE_SHORT[h.n % EMPTY_HOUSE_SHORT.length], { dH, lord: lordName })] });
  } else {
    const list = joinVi(h.occupants.map(nameOf));
    sections.push({
      id: "inside", title: T.inside, fold: true,
      paragraphs: [fill(full ? (h.occupants.length > 1 ? OCCUPANT_INTRO_MANY : OCCUPANT_INTRO_ONE) : OCCUPANT_INTRO_SHORT, { list, dH })],
      blocks: h.occupants.map((g) => {
        const rulesIt = g === h.lord;
        return {
          label: `${nameOf(g)} ở nhà ${h.n}`,
          paragraphs: [
            PLANET_IN_HOUSE[g][idx],
            ...conditionSentences(n, g, rulesIt).slice(0, 2),
            ...(rulesIt ? [] : profileLines(ctx, g, h.n, told, false, n.grahas[g].digBala)),
          ],
        };
      }),
    });
  }

  // who looks at it
  const ab = aspectBlocksAll;
  sections.push({
    id: "aspects", title: T.aspects, fold: true,
    paragraphs: [fill(ab.length ? (full ? ASPECT_INTRO : ASPECT_INTRO_SHORT) : ASPECT_NONE, { dH })],
    blocks: ab.length ? ab : undefined,
  });

  // support
  const supportParas = [
    `${full ? SAV_INTRO + " " : ""}${dust ? SAV_REVERSE[h.n as 6 | 8 | 12] + " " : ""}${fill(full ? "Nhà này được {sav} điểm, ở mức {label}." : SAV_INTRO_SHORT, { sav: h.sav, label: savLabel })} ${SAV_LINES[idx][bandKey]}`,
  ];
  if (bh) {
    const tier = bh.rank <= 4 ? "top" : bh.rank <= 8 ? "mid" : "low";
    const rankClause = bh.rank === 1 ? "khỏe nhất trong mười hai nhà" : bh.rank === 12 ? "yếu nhất trong mười hai nhà"
      : `đứng thứ ${bh.rank} trong mười hai nhà, ${tier === "top" ? "thuộc nhóm khỏe nhất lá số" : tier === "mid" ? "ở giữa bảng" : "thuộc nhóm cần bồi đắp nhiều nhất"}`;
    supportParas.push(fill(BHAVA_LINE[tier], { rankClause, dH }));
    if (!dust && tier === "top" && bandKey === "low") supportParas.push(BHAVA_DIVERGE.strongLowSupport);
    if (!dust && tier === "low" && bandKey === "high") supportParas.push(BHAVA_DIVERGE.weakHighSupport);
  }
  sections.push({ id: "support", title: T.support, fold: true, paragraphs: supportParas });

  // yogas that pass through the house
  const ys = n.yogas.filter((y) => y.houses.includes(h.n)).sort((a, b) => importance(b) - importance(a)).slice(0, 2);
  const yogaIds = ys.map((y) => y.id);
  if (ys.length) {
    sections.push({
      id: "yoga", title: T.yoga, fold: true,
      paragraphs: [firstTime(told, "yoga")
        ? (ys.length > 1 ? fill(YOGA_INTRO_MANY, { k: ys.length }) : YOGA_INTRO_ONE)
        : (ys.length > 1 ? fill(YOGA_SHORT_MANY, { k: ys.length }) : YOGA_SHORT_ONE)],
      yogaIds,
      blocks: ys.map((y) => {
        const tpl = YOGA_TEXT[yogaKey(y)];
        const text = fill(tpl, { p: nameOf(y.grahas[0]) });
        const cut = text.indexOf(" (Cách nhận ra:");
        const detail = yogaDetail(n, y);
        return { label: y.name, paragraphs: [cut < 0 ? text : text.slice(0, cut), ...(detail ? [detail] : [])] };
      }),
    });
  }

  // Actionable self-observation & grounding turn (natal structure only — no Dasha/Antardasha here per Section II.2)
  sections.push({ id: "turn", title: T.turn, paragraphs: [MIRROR[idx][tone].turn] });

  // Drop from the folded layers what the summary has already said, and any layer that is left empty.
  const said = new Set(summaryAtoms);
  for (const sec of sections) {
    if (!sec.fold) continue;
    sec.paragraphs = sec.paragraphs.filter((x) => !said.has(x));
    if (sec.blocks) {
      sec.blocks = sec.blocks.map((b) => ({ ...b, paragraphs: b.paragraphs.filter((x) => !said.has(x)) })).filter((b) => b.paragraphs.length);
      if (!sec.blocks.length) { sec.blocks = undefined; if (sec.id === "aspects") sec.paragraphs = []; }
    }
  }
  const bare = (sec: Section) => (sec.id === "lord" && sec.paragraphs.length <= 1 && !sec.blocks) || (sec.id === "inside" && !h.occupants.length);
  const kept = sections.filter((sec) => !bare(sec) && (!sec.fold || sec.paragraphs.length || (sec.blocks && sec.blocks.length)));
  sections.length = 0; sections.push(...kept);

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

  const whyWithAxes = [
    `Hướng dẫn dắt: ${pathwayLabel}`,
    `Trục biểu hiện: ${story.expressiveLevel} · Trục nâng đỡ: ${story.supportLevel}`,
    ...ctx.scored[idx].why,
  ];

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
