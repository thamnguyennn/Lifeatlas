// The house narrator. For every house it follows the same five steps a Jyotishi would, and then chooses what to say:
//   1. the nature of the house (the house, the sign on it, the planets that naturally stand for it),
//   2. its lord (quality, strength, where it stands, who looks at it, which other house it ties the story to),
//   3. the planets inside the house and the planets that look at it (helping, pressing, sharing the sign, the houses they rule),
//   4. the evidence (strength of the house, the support points, the yogas that really work, the nakshatra),
//   5. a synthesis of the two or three things that matter most, saying how they help or contradict each other.
// The numbers stay in the folded "Vì sao mình nói điều này?"; the story speaks in plain words. The way the story begins is
// chosen by a fixed rule from the facts (see choosePath), and two neighbouring houses never begin the same way when the chart
// gives another honest way to begin. A house with little to say says little: nothing is made up to fill space.
import { SIGNS, mod, type GrahaId } from "../engine/constants.ts";
import type { Ctx } from "./ctx.ts";
import { buildFacts, effectiveYoga, isGood, type Facts, type HouseFact, type PlanetFact } from "./facts.ts";
import { beats, stateLine, type Beats } from "./story.ts";
import { friendGrade } from "./timeline.ts";
import { HOUSE_TAG } from "./content/houses-signs.ts";
import { PLANET_IN_HOUSE } from "./content/planet-in-house.ts";
import { LORD_IN } from "./content/lord-in-house.ts";
import { SIGN_ON_HOUSE_DEEP, LORD_IN_TITLE } from "./content/house-voice.ts";
import { ASPECT_TEXT, ASPECT_BY_DISTANCE } from "./content/planets.ts";
import { YOGA_TEXT } from "./content/yogas.ts";
import { conjOf } from "./content/conjunctions.ts";
import { MIRROR } from "./content/mirror.ts";
import { yogaKey } from "./yogapage.ts";
import { nameOf, joinVi, fill, lowerFirst, firstSentence } from "./util.ts";
import type { ExpressiveLevel, HousePathway, SupportLevel } from "./types.ts";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const pick = <T,>(list: T[], seed: number): T => list[Math.abs(Math.round(seed)) % list.length];
const stripCost = (s: string) => s.replace(/^Cái giá là\s+/, "").replace(/\.$/, "");
const stripView = (s: string) => s.replace(/^Người ngoài (?:thấy|nhìn vào dễ cho rằng|nhìn vào thấy|nhìn vào)\s+/, "").replace(/\.$/, "");

/** The way each house begins when the story starts from its place in life. */
const LIFE_OPEN: string[] = [
  "Nhà 1 là cách bạn hiện diện trước khi nói một lời: dáng đứng, sức khỏe nền và nhịp sống riêng của bạn.",
  "Nhà 2 là cách bạn gom, giữ và dùng những gì mình có: tiền trong tay, lời nói và nếp nhà đã nuôi bạn lớn.",
  "Nhà 3 là cách bạn tự ra tay: việc bạn dám bắt đầu, nghề tay chân và chữ nghĩa, cùng những người sát vai như anh chị em và bạn đồng lứa.",
  "Nhà 4 là chỗ bạn quay về: mái nhà, người đã nuôi dưỡng bạn và cảm giác thuộc về khiến lòng được yên.",
  "Nhà 5 là nơi niềm vui và sáng tạo chảy ra: tình yêu lúc chớm nở, con cái, những việc bạn làm vì thích và cách bạn học.",
  "Nhà 6 là nhịp làm việc và rèn mình mỗi ngày: thói quen, sức khỏe, những khoản nợ và cách bạn xử lý va chạm.",
  "Nhà 7 là cách bạn đứng cạnh một người khác: tình yêu, hôn nhân, đối tác và những cam kết đường dài.",
  "Nhà 8 là phần ít ai thấy trong đời bạn: những chuyển biến lớn, nguồn lực chung với người khác và khả năng làm mới mình sau mất mát.",
  "Nhà 9 là chân trời bạn nhìn tới: niềm tin, thầy học, người cha và những chặng đi xa để học và để hiểu.",
  "Nhà 10 là chỗ bạn đứng giữa xã hội: nghề nghiệp, những trách nhiệm đã nhận và dấu ấn công việc của bạn.",
  "Nhà 11 là mùa gặt của công sức: thu nhập, bạn bè và những ước vọng dài hạn.",
  "Nhà 12 là khoảng lặng phía sau sân khấu: giấc ngủ, những lúc ở một mình, những khoản cho đi và sự buông bỏ.",
];

const HOUSE_CLASS = (h: number) => (h === 1 ? "lagna" : [4, 7, 10].includes(h) ? "kendra" : [5, 9].includes(h) ? "trikona" : [6, 8, 12].includes(h) ? "dusthana" : [2, 11].includes(h) ? "dhana" : "upachaya");

export interface Narr {
  path: HousePathway;
  /** The atoms that the story used whole, so the folded layers do not say them again. */
  used: string[];
  paragraphs: string[];
  title: string;
  expressive: ExpressiveLevel;
  support: SupportLevel;
  /** Why this way of telling was chosen, and the indicators behind it (shown folded). */
  why: string[];
}

// ------------------------------------------------------------------ the indicators

interface Ind { key: string; v: number; plus?: string; minus?: string }

function indicators(ctx: Ctx, hf: HouseFact, F: Facts): Ind[] {
  const out: Ind[] = [];
  const L = hf.lord_, nm = nameOf(hf.lord), tagP = HOUSE_TAG[hf.lordHouse - 1];
  out.push({ key: "lord", v: L.grade === "strong" ? 1.2 : L.grade === "good" ? 0.7 : L.grade === "weak" ? -1 : 0, plus: `${nm}, chủ của nhà ${hf.n}, đứng vững`, minus: `${nm}, chủ của nhà ${hf.n}, còn yếu` });
  const lc = HOUSE_CLASS(hf.lordHouse);
  const placeV = hf.lordHouse === hf.n ? 0.6 : lc === "lagna" || lc === "kendra" || lc === "trikona" ? 1 : lc === "dhana" ? 0.5 : lc === "dusthana" ? (hf.dusthana ? 0.5 : -1) : 0;
  out.push({ key: "place", v: placeV, plus: `${nm} đi vào nhà ${hf.lordHouse} (${tagP}), một chỗ thuận`, minus: `${nm} đi vào nhà ${hf.lordHouse} (${tagP}), một nhà nhiều thử thách` });
  let occV = 0;
  const occ = hf.occupants.filter((o) => o !== hf.lord);
  for (const id of occ) {
    const p = F.planets[id];
    if (p.natural === "benefic") occV += isGood(p) ? 1 : 0.3;
    else occV += [3, 6, 10, 11].includes(hf.n) ? (isGood(p) ? 0.8 : 0.3) : isGood(p) ? -0.3 : -0.8;
  }
  out.push({ key: "occ", v: Math.max(-1.5, Math.min(1.5, occV)), plus: occ.length ? `${joinVi(occ.map(nameOf))} ngồi trong nhà và nâng đỡ` : undefined, minus: occ.length ? `${joinVi(occ.map(nameOf))} ngồi trong nhà và mang theo sức ép` : undefined });
  let aspV = 0;
  for (const id of hf.aspects) aspV += F.planets[id].natural === "benefic" ? 0.5 : [3, 6, 10, 11].includes(hf.n) ? 0.2 : -0.4;
  out.push({ key: "asp", v: Math.max(-1, Math.min(1.2, aspV)), plus: "những ánh nhìn che chở đổ vào nhà", minus: "những ánh nhìn nặng đổ vào nhà" });
  const sv = hf.savBand === "very_high" ? 1.3 : hf.savBand === "high" ? 1 : hf.savBand === "low" ? -1 : hf.savBand === "very_low" ? -1.3 : 0;
  const sav = hf.dusthana ? -sv * 0.6 : sv;
  out.push({ key: "sav", v: sav, plus: hf.dusthana ? "rắc rối từ hoàn cảnh bên ngoài ít" : "trợ lực từ hoàn cảnh bên ngoài dồi dào", minus: hf.dusthana ? "áp lực từ hoàn cảnh bên ngoài nhiều" : "trợ lực từ hoàn cảnh bên ngoài còn mỏng" });
  out.push({ key: "bhava", v: hf.tier === "top" ? 1 : hf.tier === "low" ? -1 : 0, plus: "nền của chính ngôi nhà thuộc nhóm vững nhất lá số", minus: "nền của chính ngôi nhà thuộc nhóm mỏng nhất lá số" });
  const ys = hf.yogas.filter(effectiveYoga);
  out.push({ key: "yoga", v: ys.reduce((s, y) => s + (y.tone === "good" ? 0.8 : y.tone === "challenge" ? -0.5 : 0.2), 0), plus: ys.length ? `${joinVi(ys.map((y) => y.name))} đi qua nhà` : undefined, minus: ys.length ? `${joinVi(ys.map((y) => y.name))} đi qua nhà` : undefined });
  const kar = hf.karakas.filter((k) => k !== hf.lord).map((k) => F.planets[k]);
  if (kar.length) {
    const kv = kar.every((k) => k.grade === "weak") ? -0.6 : kar.some(isGood) ? 0.4 : 0;
    out.push({ key: "karaka", v: kv, plus: `${joinVi(kar.map((k) => nameOf(k.id)))}, hành tinh đại diện tự nhiên cho chuyện này, đủ lực`, minus: `${joinVi(kar.map((k) => nameOf(k.id)))}, hành tinh đại diện tự nhiên cho chuyện này, còn yếu` });
  }
  return out;
}

interface Divergence { pos: string; neg: string; weight: number }

function divergences(inds: Ind[]): Divergence[] {
  const g = (k: string) => inds.find((i) => i.key === k);
  const out: Divergence[] = [];
  const pairs: [string, string][] = [["bhava", "sav"], ["lord", "place"], ["occ", "lord"], ["asp", "occ"], ["sav", "lord"], ["bhava", "lord"], ["place", "occ"]];
  for (const [a, b] of pairs) {
    const x = g(a), y = g(b);
    if (!x || !y) continue;
    if (x.v >= 0.9 && y.v <= -0.9) out.push({ pos: x.plus ?? "", neg: y.minus ?? "", weight: x.v - y.v });
    else if (y.v >= 0.9 && x.v <= -0.9) out.push({ pos: y.plus ?? "", neg: x.minus ?? "", weight: y.v - x.v });
  }
  return out.filter((d) => d.pos && d.neg).sort((p, q) => q.weight - p.weight);
}

// ------------------------------------------------------------------ the two axes

export function axes(ctx: Ctx, hf: HouseFact, inds: Ind[]): { expressive: ExpressiveLevel; support: SupportLevel } {
  const ys = hf.yogas.filter(effectiveYoga).length;
  const score = hf.occupants.length + hf.aspects.length * 0.6 + ys * 0.8 + (hf.tier === "top" ? 1 : hf.tier === "low" ? -0.5 : 0) + (hf.lord_.grade === "strong" ? 0.5 : 0);
  const expressive: ExpressiveLevel = score >= 3 ? "sôi động" : score >= 1.5 ? "vừa phải" : "yên tĩnh";
  const tone = ctx.tones[hf.n - 1];
  const support: SupportLevel = tone === "good" ? "thuận lợi" : tone === "hard" ? "cần rèn giũa" : "có thuận có khó";
  return { expressive, support };
}

function axisLine(e: ExpressiveLevel, s: SupportLevel, tag: string): string {
  if (e === "sôi động" && s === "cần rèn giũa") return `Ở đây ồn ào không đồng nghĩa với dễ dàng: nhiều tiếng nói cùng tham gia chuyện ${tag}, và chúng chưa kéo cùng một hướng.`;
  if (e === "sôi động" && s === "thuận lợi") return `Chuyện ${tag} vừa đông vừa thuận: nhiều chuyển động diễn ra, và phần lớn đi về phía có lợi cho bạn.`;
  if (e === "sôi động") return `Chuyện ${tag} có nhiều chuyển động, nhưng không phải chuyển động nào cũng đỡ lưng cho bạn, nên cần chọn đâu là điều đáng theo.`;
  if (e === "yên tĩnh" && s === "thuận lợi") return `Ít biến động ồn ào ở chuyện ${tag}, nhưng nền ở đây đáng tin: mọi thứ đi êm hơn người ta tưởng.`;
  if (e === "yên tĩnh" && s === "cần rèn giũa") return `Chuyện ${tag} ít khi tự lên tiếng, và chỗ này không tự trôi: nó đòi bạn chủ động đặt tay vào, vì sẽ không có nhiều người làm thay.`;
  return "";
}

// ------------------------------------------------------------------ choosing how to begin

export function choosePath(hf: HouseFact, inds: Ind[], F: Facts, recent: HousePathway[]): { path: HousePathway; reason: string } {
  const pos = inds.filter((i) => i.v >= 0.5).length, neg = inds.filter((i) => i.v <= -0.5).length;
  const dv = divergences(inds);
  const occ = hf.occupants.filter((o) => o !== hf.lord);
  const ys = hf.yogas.filter(effectiveYoga);
  const lc = HOUSE_CLASS(hf.lordHouse);
  const cand: { path: HousePathway; s: number; reason: string }[] = [];
  if (dv.length) cand.push({ path: "contrast", s: 7 + dv[0].weight, reason: "các chỉ báo đi ngược chiều nhau" });
  if (pos >= 3 && neg <= 1) cand.push({ path: "strength", s: 6.5 + pos * 0.1, reason: `có ${pos} chỉ báo nâng đỡ và hầu như không có chỉ báo trái chiều` });
  if (neg >= 3 && pos <= 2) cand.push({ path: "care", s: 6.2 + neg * 0.1, reason: `có ${neg} chỉ báo cần cân nhắc` });
  if (ys.length && ys.some((y) => y.strength === "strong" || y.tone === "good")) cand.push({ path: "yoga", s: 5.6, reason: "có một yoga thật sự có hiệu lực đi qua nhà" });
  if (occ.length) cand.push({ path: "occupant", s: 5 + occ.length * 0.2 + (occ.some((o) => F.planets[o].grade === "strong") ? 0.6 : 0), reason: "có hành tinh ngồi trong nhà" });
  if (hf.lordHouse !== hf.n) cand.push({ path: "bridge", s: 4.6 + (hf.lordHouse === 1 || hf.lordHouse === 10 ? 0.4 : 0), reason: `chủ nhà nối chuyện này sang nhà ${hf.lordHouse}` });
  if (!occ.length && !hf.aspects.length) cand.push({ path: "quiet", s: 4.2, reason: "không hành tinh nào ngồi hay nhìn vào nhà" });
  cand.push({ path: "life", s: 2, reason: "chưa có dữ kiện nào nổi hơn các dữ kiện khác" });
  cand.sort((a, b) => b.s - a.s);
  // a way of beginning that the last two houses used is passed over while another honest way is nearly as good; the way the
  // previous house used is passed over whenever any other way exists
  const best = cand[0].s;
  const fresh = cand.find((c) => !recent.slice(-2).includes(c.path) && c.s >= best - 3) ?? cand.find((c) => c.path !== recent[recent.length - 1]) ?? cand[0];
  return { path: fresh.path, reason: fresh.reason };
}

// ------------------------------------------------------------------ pieces of language

function gradeWord(p: PlanetFact): string {
  return p.grade === "strong" ? "rất vững" : p.grade === "good" ? "khá vững" : p.grade === "weak" ? "còn yếu" : "ở mức vừa";
}

const PLACE_MEANING: Record<string, string> = {
  self: "nên chuyện này có gốc rễ riêng và ít phải nhờ ai",
  lagna: "chính là bản thân bạn, nên chuyện này gắn chặt với con người bạn và thường do bạn chủ động đặt tay vào",
  kendra: "một nhà trụ cột, nên chuyện này dựa vào mảng ấy như dựa vào một chiếc cột",
  trikona: "một nhà của phúc phần, nên mảng ấy nuôi chuyện này khá tự nhiên",
  dhana: "nhà của tích lũy và thành quả, nên chuyện này gắn với những gì bạn gom được",
  upachaya: "một nhà của sự rèn luyện, nên chuyện này lớn dần theo công sức và kinh nghiệm",
  dusthana: "một nhà nhiều thử thách, nên chuyện này thường phải đi qua mảng ấy mới trưởng thành",
};

function lordBridge(hf: HouseFact): string {
  const lc = hf.lordHouse === hf.n ? "self" : HOUSE_CLASS(hf.lordHouse);
  const tag = HOUSE_TAG[hf.n - 1], tagP = HOUSE_TAG[hf.lordHouse - 1], nm = nameOf(hf.lord);
  if (lc === "self") return `${nm}, chủ của nhà ${hf.n}, ngồi ngay trong nhà của mình, ${PLACE_MEANING.self}`;
  if (lc === "lagna") return `${nm}, chủ của nhà ${hf.n}, đứng ở nhà 1, ${PLACE_MEANING.lagna}`;
  if (lc === "dusthana" && hf.dusthana) return `${nm}, chủ của nhà ${hf.n}, đi vào nhà ${hf.lordHouse} (${tagP}): chủ của một nhà khó đứng trong một nhà khó là thế mà truyền thống gọi là Viparita, nên những rắc rối của ${tag} có xu hướng tự triệt tiêu bớt`;
  return `${nm}, chủ của nhà ${hf.n}, đứng ở nhà ${hf.lordHouse} (${tagP}), ${PLACE_MEANING[lc]}`;
}

const rel = (a: GrahaId, b: GrahaId, ctx: Ctx) => friendGrade(ctx, a, b);

function occupantSentences(ctx: Ctx, hf: HouseFact, F: Facts, occAtoms: Beats[]): string[] {
  const occ = hf.occupants.filter((o) => o !== hf.lord);
  if (!occ.length) return [];
  const out: string[] = [occAtoms[0].nature];
  const st = stateLine(ctx.n, occ[0]);
  if (st) out.push(st);
  if (occ.length > 1) {
    out.push(occAtoms[1].nature);
    const cj = conjOf(occ[0], occ[1]);
    if (cj) out.push(`${nameOf(occ[0])} và ${nameOf(occ[1])} cùng ở đây nên thường cho ${cj.gift}; điều cần để ý là ${cj.care}.`);
    if (occ.length > 2) out.push(`Trong nhà còn có ${joinVi(occ.slice(2).map(nameOf))}, mỗi sao được nói riêng ở phần bằng chứng.`);
  }
  if (hf.lord !== occ[0]) {
    const g = rel(hf.lord, occ[0], ctx);
    const A = nameOf(hf.lord), B = nameOf(occ[0]);
    out.push(g === "friend" ? `${A} và ${B} là hai hành tinh thân nhau, nên chủ nhà và người ngồi trong nhà làm việc thuận tay.`
      : g === "enemy" ? `${A} và ${B} không ưa nhau, nên chủ nhà và người ngồi trong nhà hay kéo chuyện này về hai phía.`
      : `${A} và ${B} ở thế trung lập với nhau, nên mỗi sao làm phần việc của mình mà ít khi cản nhau.`);
  }
  return out;
}

function aspectSentence(ctx: Ctx, hf: HouseFact, F: Facts): string {
  if (!hf.aspects.length) return "";
  const dH = HOUSE_TAG[hf.n - 1];
  const order: GrahaId[] = ["jupiter", "venus", "mercury", "moon", "saturn", "mars", "sun", "rahu", "ketu"];
  const g = [...hf.aspects].sort((a, b) => order.indexOf(a) - order.indexOf(b))[0];
  const from = F.planets[g].house!;
  const off = mod(hf.n - from, 12) + 1;
  const tpl = ASPECT_BY_DISTANCE[g]?.[off] ?? ASPECT_TEXT[g];
  if (!tpl) return "";
  return fill(tpl, { dH });
}

/** The cost and what others see, taken from the atoms that were used, said once for the whole house. */
function costView(b: Beats[]): string[] {
  const costs = b.map((x) => x.cost).filter(Boolean).map(stripCost).slice(0, 2);
  const views = b.map((x) => x.view).filter(Boolean).map(stripView).slice(0, 2);
  const out: string[] = [];
  if (costs.length > 1) out.push(`Cái giá là ${costs[0]}, và thêm nữa, ${costs[1]}.`);
  else if (costs.length) out.push(`Cái giá là ${costs[0]}.`);
  if (views.length > 1) out.push(`Người ngoài thấy ${views[0]}, mà cũng thấy ${views[1]}.`);
  else if (views.length) out.push(`Người ngoài thấy ${views[0]}.`);
  return out;
}

// ------------------------------------------------------------------ the narration

export function narrateHouse(ctx: Ctx, hf: HouseFact, recent: HousePathway[]): Narr {
  const F = buildFacts(ctx);
  const n = hf.n, idx = n - 1, tag = HOUSE_TAG[idx], tagP = HOUSE_TAG[hf.lordHouse - 1];
  const L = hf.lord_, nm = nameOf(hf.lord);
  const inds = indicators(ctx, hf, F);
  const { path, reason } = choosePath(hf, inds, F, recent);
  const { expressive, support } = axes(ctx, hf, inds);

  const signAtom = SIGN_ON_HOUSE_DEEP[n]?.[hf.sign] ?? "";
  const lordAtom = LORD_IN[idx][hf.lordHouse - 1];
  const occ = hf.occupants.filter((o) => o !== hf.lord);
  const occAtomsRaw = occ.slice(0, 2).map((g) => PLANET_IN_HOUSE[g][idx]);
  const used = [signAtom, lordAtom, ...occAtomsRaw];
  const sign = beats(signAtom), lord = beats(lordAtom), occB = occAtomsRaw.map(beats);
  const seeds = n * 7 + hf.sign + hf.lordHouse;
  const ys = hf.yogas.filter(effectiveYoga);
  const yogaLine = ys.slice(0, 2).map((y) => {
    const tpl = YOGA_TEXT[yogaKey(y)];
    if (!tpl) return "";
    const full = fill(tpl, { p: nameOf(y.grahas[0]) });
    const cut = full.indexOf(" (Cách nhận ra:");
    const one = firstSentence(cut < 0 ? full : full.slice(0, cut));
    return one.startsWith(y.name) ? one.replace(y.name, `${y.name} đi qua nhà ${hf.n} và`) : `${y.name} đi qua nhà ${hf.n}. ${one}`;
  }).filter(Boolean).join(" ");
  const pluses = inds.filter((i) => i.v >= 0.5 && i.plus).sort((a, b) => b.v - a.v);
  const minuses = inds.filter((i) => i.v <= -0.5 && i.minus).sort((a, b) => a.v - b.v);
  const dv = divergences(inds)[0];
  const axis = axisLine(expressive, support, tag);
  const lordCondS = L.grade === "strong" ? `${nm} đang rất vững, nên chuyện ${tag} của bạn có chỗ để tin.`
    : L.grade === "good" ? `${nm} đang khá vững, đủ để chuyện ${tag} có sức nặng.`
    : L.grade === "weak" ? `${nm} còn yếu, nên chuyện ${tag} cần bạn chủ động nuôi thay vì chờ có sẵn.`
    : `${nm} ở mức vừa phải, đủ dùng cho chuyện ${tag} nhưng không phải chỗ để gồng quá sức.`;
  const nature = lowerFirst(sign.nature);
  const bridge = lordBridge(hf);
  const occS = occupantSentences(ctx, hf, F, occB);
  const asp = aspectSentence(ctx, hf, F);
  const cv = costView([sign, lord, ...occB.slice(0, 1)]);
  const seeks = [...new Set([sign, lord, ...occB].map((b) => b.seek).filter(Boolean))].slice(0, 2);
  const seekLine = seeks.length ? `Điều bạn đang tìm ở đây là ${seeks.some((x) => x.includes(",")) ? seeks.join("; ") : joinVi(seeks)}.` : "";
  const lordBlock = [`${cap(bridge)}.`, lord.nature, lordCondS].join(" ");
  const para: string[] = [];
  const list = (xs: string[]) => xs.join("; ");

  switch (path) {
    case "strength": {
      const top = pluses.slice(0, 3).map((p) => p.plus!);
      para.push(pick([
        `Nhà ${n}, nơi nói về ${tag}, là một trong những chỗ có nền vững nhất của lá số: ${list(top)}.`,
        `Ở chuyện ${tag}, lá số cho bạn khá nhiều điểm tựa cùng một lúc: ${list(top)}.`,
        `Nếu phải kể những mảng được lá số nâng đỡ rõ, ${tag} nằm trong số đó: ${list(top)}.`,
        `${cap(tag)} là chỗ bạn ít phải tự gồng: ${list(top)}.`,
        `Lá số đứng khá chắc sau lưng bạn ở chuyện ${tag}: ${list(top)}.`,
      ], seeds));
      para.push(`${sign.nature} ${lordBlock}`);
      if (occS.length) para.push(occS.join(" "));
      para.push([seekLine, ...cv].filter(Boolean).join(" "));
      break;
    }
    case "contrast": {
      para.push(pick([
        `Nhà ${n} cho hai tín hiệu khác nhau về ${tag}: ${dv.pos}, nhưng ${dv.neg}.`,
        `Về ${tag}, lá số vừa cho một điểm sáng vừa cho một điểm cần để ý: ${dv.pos}, trong khi ${dv.neg}.`,
        `Ở nhà ${n}, các chỉ báo không đi cùng một hướng: ${dv.pos}; ngược lại, ${dv.neg}.`,
        `Chuyện ${tag} có một nghịch lý đáng để ý: ${dv.pos}, vậy mà ${dv.neg}.`,
        `Hai điều cùng đúng ở nhà ${n}: ${dv.pos}, và ${dv.neg}.`,
      ], seeds));
      para.push(`Với nhà ${n}, cách đọc hợp lý là hiểu hai tín hiệu ấy như hai tầng của cùng một câu chuyện, không lấy trung bình giữa chúng. ${sign.nature} ${lordBlock}`);
      if (occS.length) para.push(occS.join(" "));
      para.push([asp, axis, ...cv].filter(Boolean).join(" "));
      break;
    }
    case "bridge": {
      para.push(pick([
        `Chuyện ${tag} của bạn không đứng một mình: ${bridge}.`,
        `Muốn hiểu ${tag} ở lá số này, hãy đi theo ${nm}: ${bridge}.`,
        `Mạch của nhà ${n} chạy sang nhà ${hf.lordHouse}: ${bridge}.`,
        `Để đọc ${tag}, phải nhìn sang nhà ${hf.lordHouse}: ${bridge}.`,
      ], seeds));
      para.push(`${lord.nature} ${lordCondS}`);
      para.push([sign.nature, ...occS].join(" "));
      para.push([asp, axis, ...cv].filter(Boolean).join(" "));
      break;
    }
    case "care": {
      const m = minuses.slice(0, 3).map((p) => p.minus!);
      para.push(pick([
        `Nhà ${n}, nơi nói về ${tag}, là chỗ cần nhiều tay nghề hơn là may mắn có sẵn: ${list(m)}.`,
        `Với ${tag}, lá số không cho sẵn một nền dễ dàng: ${list(m)}.`,
        `Chuyện ${tag} là một mảng bạn phải tự dựng nhiều hơn người ta tưởng: ${list(m)}.`,
        `Nhà ${n} đòi bạn nhiều kiên nhẫn hơn các nhà khác: ${list(m)}.`,
        `Lá số không giấu rằng ${tag} là mảng khó hơn cả: ${list(m)}.`,
      ], seeds));
      const eased = pluses.slice(0, 2).map((p) => p.plus!);
      para.push(`${eased.length ? `Điều làm nhẹ bớt là ${list(eased)}. ` : ""}${sign.nature} ${lordBlock}`);
      if (occS.length) para.push(occS.join(" "));
      para.push([asp, `Cách ổn nhất là xử lý từng việc cụ thể thay vì chờ mọi thứ tự ổn: chuyện ${tag} thường chuyển biến rõ khi bạn có một nếp làm việc đều và một người đồng hành đáng tin.`, ...cv].filter(Boolean).join(" "));
      break;
    }
    case "yoga": {
      para.push(pick([
        `Điều nổi bật nhất ở nhà ${n} là một cấu trúc có tên. ${yogaLine}`,
        `Chuyện ${tag} có một điểm riêng mà không phải lá số nào cũng có. ${yogaLine}`,
      ], seeds));
      para.push(`${sign.nature} ${lordBlock}`);
      if (occS.length) para.push(occS.join(" "));
      para.push([asp, axis, ...cv].filter(Boolean).join(" "));
      break;
    }
    case "occupant": {
      para.push(`${occB[0].nature}${stateLine(ctx.n, occ[0]) ? " " + stateLine(ctx.n, occ[0]) : ""}`);
      para.push([`Chủ nhà thì sao? ${lordBlock}`, occS.slice(occB.length > 1 ? 2 : 1).join(" ")].filter(Boolean).join(" "));
      para.push([sign.nature, asp].filter(Boolean).join(" "));
      para.push([axis, seekLine, ...cv].filter(Boolean).join(" "));
      break;
    }
    case "quiet": {
      para.push(pick([
        `Không hành tinh nào ngồi trong nhà ${n} hay nhìn thẳng vào nó, nên chuyện ${tag} không bị pha thêm màu nào khác: nó đi theo ${nm} và cung ${SIGNS[hf.sign]}.`,
        `Nhà ${n} là một căn phòng trống không có ai ghé qua: chuyện ${tag} chạy theo ${nm}, chủ nhà, và theo chất liệu của cung ${SIGNS[hf.sign]}.`,
      ], seeds));
      para.push(`${sign.nature} ${lordBlock}`);
      para.push([axis, ...cv].filter(Boolean).join(" "));
      break;
    }
    default: {
      para.push(`${LIFE_OPEN[idx]} ${sign.nature}`);
      para.push(`${lordBlock}${occS.length ? " " + occS.join(" ") : ""}`);
      para.push([asp, axis, seekLine, ...cv].filter(Boolean).join(" "));
    }
  }

  // a yoga that really works is always said in the story, even when the story did not begin with it
  if (path !== "yoga" && yogaLine) para.splice(Math.min(2, para.length), 0, yogaLine);

  const tone = ctx.tones[idx];
  const title = LORD_IN_TITLE[n]?.[hf.lordHouse - 1] ?? "Câu chuyện của ngôi nhà";
  void MIRROR; void tone;
  return {
    path, used, title, expressive, support, paragraphs: para.filter((p) => p && p.trim()),
    why: [
      `Hướng kể: ${PATH_LABEL[path]}, vì ${reason}.`,
      ...inds.filter((i) => Math.abs(i.v) >= 0.3).map((i) => `${INDICATOR_NAME[i.key]}: ${i.v > 0 ? "nâng đỡ" : "cần cân nhắc"} (${i.v > 0 ? "+" : ""}${i.v.toFixed(1)}).`),
    ],
  };
}

export const PATH_LABEL: Record<HousePathway, string> = {
  strength: "đi từ điểm mạnh nổi bật", contrast: "đi từ sự đối lập giữa các chỉ báo", bridge: "đi từ mối nối của chủ nhà", care: "đi từ điều kiện cần cân nhắc",
  yoga: "đi từ một yoga có hiệu lực", occupant: "đi từ hành tinh ngồi trong nhà", quiet: "đi từ chủ nhà vì nhà không có hành tinh", life: "đi từ chủ đề đời sống của nhà",
};
const INDICATOR_NAME: Record<string, string> = {
  lord: "Chủ nhà", place: "Vị trí của chủ nhà", occ: "Hành tinh ngồi trong nhà", asp: "Góc chiếu", sav: "Điểm hỗ trợ (SAV)", bhava: "Độ vững của nhà (Bhava Bala)", yoga: "Yoga", karaka: "Hành tinh đại diện tự nhiên",
};
