// Life Atlas v3.0 — House narrative composer with 5 deterministic narrative pathways
// and explicit separation of expressive intensity vs. supportiveness.
import { SIGNS, DUSTHANA, type GrahaId } from "../engine/constants.ts";
import { savBand } from "../engine/ashtakavarga.ts";
import { dashaChildren, dashaMahas, dashaOrigin, levelTrust } from "../engine/dasha5.ts";
import { YEAR_MS } from "../engine/core.ts";
import type { HouseInfo, Natal } from "../engine/types.ts";
import type { Ctx } from "./ctx.ts";
import { friendGrade, trustAt } from "./timeline.ts";
import { isBenefic, lordState } from "./shared.ts";
import type { ExpressiveLevel, HousePathway, SupportLevel } from "./types.ts";
import { HOUSE_TAG } from "./content/houses-signs.ts";
import { PLANET_IN_HOUSE } from "./content/planet-in-house.ts";
import { LORD_IN } from "./content/lord-in-house.ts";
import { SIGN_ON_HOUSE_DEEP } from "./content/house-voice.ts";
import { WHY_CA_HAI, WHY_CAI_QUAN, WHY_O_TRONG } from "./content/house-deep.ts";
import {
  STORY_LORD_LINK, STORY_LORD_HOME, STORY_STATE, STORY_REL, STORY_TOGETHER, STORY_MANY, STORY_EMPTY, STORY_COST_ONE, STORY_COST_MANY,
  STORY_VIEW_ONE, STORY_VIEW_MANY, STORY_SEEK, STORY_NEXT_INTRO, STORY_NEXT_MAHA, STORY_NEXT_ANTAR, STORY_NEXT_NOW, STORY_NEXT_APPROX, STORY_NEXT_HINT, STORY_NEXT_NONE,
} from "./content/story.ts";
import { DASHA_PLANET } from "./content/dasha-story.ts";
import { CONJ_LINE, conjOf } from "./content/conjunctions.ts";
import { domain, fill, joinVi, lowerFirst, mmYYYY, nameOf, ageAt } from "./util.ts";

export interface Beats { nature: string; seek: string; cost: string; view: string; extra: string[] }

export function beats(atom: string): Beats {
  const parts = atom.split(/(?<=\.)\s+/).filter(Boolean);
  const out: Beats = { nature: parts[0] ?? "", seek: "", cost: "", view: "", extra: [] };
  const m = out.nature.match(/,\s*còn bạn tìm\s+(.+?)\.?$/);
  if (m) { out.seek = m[1]; out.nature = out.nature.slice(0, m.index) + "."; }
  for (const p of parts.slice(1)) {
    if (!out.cost && /^Cái giá/.test(p)) out.cost = p;
    else if (!out.view && /^Người ngoài/.test(p)) out.view = p;
    else out.extra.push(p);
  }
  return out;
}

const stripCost = (s: string) => s.replace(/^Cái giá là\s+/, "").replace(/\.$/, "");
const stripView = (s: string) => s.replace(/^Người ngoài thấy\s+/, "").replace(/\.$/, "");

export function stateLine(n: Natal, g: GrahaId): string | null {
  const gr = n.grahas[g];
  const x = nameOf(g);
  if (gr.dignity === "exalted" || gr.dignity === "own" || gr.dignity === "moolatrikona") return fill(STORY_STATE.strong, { x });
  if (gr.dignity === "debilitated") return fill(STORY_STATE.weak, { x });
  if (gr.dignity === "enemy") return fill(STORY_STATE.enemy, { x });
  if (gr.combust && g !== "sun") return fill(STORY_STATE.combust, { x });
  if (gr.retro && g !== "rahu" && g !== "ketu") return fill(STORY_STATE.retro, { x });
  return null;
}

export const PATHWAY_LABELS: Record<HousePathway, string> = {
  strength_lead: "Đi từ điểm mạnh nổi bật",
  tension_contrast: "Đi từ sự đối lập và độ vênh nội tại",
  lord_bridge: "Đi từ mối liên kết của hành tinh cai quản",
  care_condition: "Đi từ điều kiện cần lưu tâm",
  domain_steady: "Đi từ chủ đề đời sống của nhà",
};

/** Evaluate expressive intensity (sôi động / vừa phải / yên tĩnh) vs. supportiveness (thuận lợi / pha trộn / cần rèn giũa). */
export function evaluateHouseAxes(ctx: Ctx, h: HouseInfo): {
  expressiveLevel: ExpressiveLevel;
  supportLevel: SupportLevel;
  axisSentence: string;
} {
  const idx = h.n - 1;
  const tone = ctx.tones[idx];
  const dH = domain(h.n);
  const lordName = nameOf(h.lord);
  const supportLevel: SupportLevel = tone === "good" ? "thuận lợi" : tone === "hard" ? "cần rèn giũa" : "pha trộn";

  let expScore = 0;
  expScore += h.occupants.length * 2;
  if (h.lordHouse === h.n) expScore += 1.5;
  expScore += h.aspectedBy.length * 0.8;
  if (h.sav >= 32) expScore += 1.5;
  else if (h.sav <= 24) expScore -= 1;

  const expressiveLevel: ExpressiveLevel =
    expScore >= 3 ? "sôi động" : h.occupants.length === 0 && h.aspectedBy.length <= 1 && h.sav <= 29 ? "yên tĩnh" : "vừa phải";

  let axisSentence = "";
  if (expressiveLevel === "sôi động" && supportLevel === "thuận lợi") {
    axisSentence = `Xét trên hai trục biểu hiện và nâng đỡ, nhà ${h.n} vừa có mật độ biểu hiện rất sôi động vừa nhận được nền tảng nâng đỡ thuận lợi: các sự kiện thuộc về ${dH} thường diễn ra rõ nét, giàu sinh khí và trở thành bệ phóng tự nhiên cho bạn.`;
  } else if (expressiveLevel === "sôi động" && supportLevel === "cần rèn giũa") {
    axisSentence = `Cần phân biệt rõ giữa độ sôi động và độ thuận lợi tại nhà ${h.n}: sự góp mặt của nhiều yếu tố khiến chuyện ${dH} diễn ra rất mạnh mẽ và thu hút nhiều tâm sức của bạn, song mức độ nâng đỡ lại đòi hỏi sự rèn giũa kỹ lưỡng để biến va chạm thành tay nghề vững chắc.`;
  } else if (expressiveLevel === "sôi động" && supportLevel === "pha trộn") {
    axisSentence = `Ở nhà ${h.n}, mức độ biểu hiện rất sôi động với nhiều tiếng nói cùng tham gia vào chuyện ${dH}, trong khi sự nâng đỡ ở thế pha trộn: cơ hội mở ra nhiều đến đâu thì càng cần bạn giữ nhịp chọn lọc và tỉnh táo đến đó.`;
  } else if (expressiveLevel === "yên tĩnh" && supportLevel === "thuận lợi") {
    axisSentence = `Nhà ${h.n} mang dáng dấp của một khoảng sân yên tĩnh nhưng có nền tảng nâng đỡ rất êm thuận: chuyện ${dH} không ồn ào phô trương mà vận hành trôi chảy, ổn định theo nhịp dẫn dắt của ${lordName} tại nhà ${h.lordHouse}.`;
  } else if (expressiveLevel === "yên tĩnh" && supportLevel === "cần rèn giũa") {
    axisSentence = `Nhà ${h.n} thuộc nhóm biểu hiện yên tĩnh nhưng cần sự chăm chút bền bỉ: ít có biến động ồn ào từ hoàn cảnh chung quanh, song để chuyện ${dH} thực sự đứng vững, bạn cần chủ động bồi đắp đều đặn qua từng việc nhỏ tại nhà ${h.lordHouse} nơi ${lordName} đang đứng.`;
  } else if (expressiveLevel === "yên tĩnh") {
    axisSentence = `Trên bản đồ sao, nhà ${h.n} là một vùng không gian yên tĩnh và cân bằng: chuyện ${dH} không bị các xung lực cực đoan làm xáo trộn, cứ thế điềm đạm chảy theo hướng của ${lordName} ở nhà ${h.lordHouse}.`;
  } else if (supportLevel === "thuận lợi") {
    axisSentence = `Nhà ${h.n} giữ nhịp biểu hiện vừa phải cùng nền tảng nâng đỡ thuận lợi, giúp chuyện ${dH} phát triển đều đặn và đáng tin cậy mỗi khi bạn dành tâm sức cho nó.`;
  } else if (supportLevel === "cần rèn giũa") {
    axisSentence = `Nhà ${h.n} có mức độ biểu hiện vừa phải nhưng đặt ra những điều kiện cần rèn giũa nghiêm túc: chuyện ${dH} tiến chậm mà chắc khi bạn ưu tiên kỷ luật và sự chuẩn bị đường dài.`;
  } else {
    axisSentence = `Nhà ${h.n} giữ mức biểu hiện và nâng đỡ cân bằng: chuyện ${dH} phản hồi trung thực với công sức và sự chủ động mà bạn đặt vào đó mỗi ngày.`;
  }

  return { expressiveLevel, supportLevel, axisSentence };
}

/** Deterministic selection of 1 of 5 narrative pathways for each house, avoiding adjacent repetition. */
export function selectHousePathway(ctx: Ctx, h: HouseInfo, prevPathway: HousePathway | null): HousePathway {
  const { n } = ctx;
  const idx = h.n - 1;
  const lg = n.grahas[h.lord];
  const bh = ctx.sb?.bhava[idx];
  const band = savBand(h.sav);
  const dust = DUSTHANA.includes(h.n);
  const tone = ctx.tones[idx];

  const lordStrong = ["exalted", "own", "moolatrikona"].includes(lg.dignity);
  const lordWeak = lg.dignity === "debilitated" || lg.combust || (!dust && DUSTHANA.includes(h.lordHouse));
  const hasBeneficOcc = h.occupants.some((g) => isBenefic(n, g));
  const hasMaleficOcc = h.occupants.some((g) => !isBenefic(n, g));
  const savHigh = band === "high" || band === "very_high";
  const savLow = band === "low" || band === "very_low";
  const bhTop = bh ? bh.rank <= 4 : false;
  const bhLow = bh ? bh.rank >= 9 : false;
  const diverge = (!dust && ((bhTop && savLow) || (bhLow && savHigh))) || (lordStrong && hasMaleficOcc) || (lordWeak && hasBeneficOcc);

  // Score each of the 5 pathways deterministically from the chart's structural parameters
  const scores: Record<HousePathway, number> = {
    strength_lead: (lordStrong ? 5 : 0) + (tone === "good" ? 4 : 0) + (bhTop ? 2 : 0) + (hasBeneficOcc ? 2 : 0) + (h.n % 5 === 1 ? 0.4 : 0),
    tension_contrast: (diverge ? 7 : 0) + (h.occupants.length >= 2 ? 3 : 0) + (tone === "mixed" && h.occupants.length === 1 ? 2.5 : 0) + (h.n % 5 === 2 ? 0.4 : 0),
    care_condition: (lordWeak ? 5.5 : 0) + (tone === "hard" ? 4.5 : 0) + (dust && h.occupants.length > 0 ? 3 : 0) + (h.n % 5 === 4 ? 0.4 : 0),
    lord_bridge: (h.occupants.length === 0 && h.lordHouse !== h.n ? 5.5 : 1.5) + (Math.abs(h.lordHouse - h.n) >= 4 ? 2 : 0) + (h.n % 5 === 3 ? 0.4 : 0),
    domain_steady: (h.occupants.length === 0 && tone === "mixed" ? 4.5 : 2) + (h.lordHouse === h.n ? 3 : 0) + (h.n % 5 === 0 ? 0.4 : 0),
  };

  const ordered = (Object.keys(scores) as HousePathway[]).sort((a, b) => scores[b] - scores[a]);
  if (prevPathway && ordered[0] === prevPathway) {
    return ordered[1];
  }
  return ordered[0];
}

export interface Story {
  paragraphs: string[];
  used: string[];
  pathway: HousePathway;
  expressiveLevel: ExpressiveLevel;
  supportLevel: SupportLevel;
}

export function houseStory(ctx: Ctx, h: HouseInfo, prevPathway: HousePathway | null = null): Story {
  const { n } = ctx;
  const idx = h.n - 1;
  const lordName = nameOf(h.lord);
  const lp = h.lordHouse;
  const dH = domain(h.n);
  const signName = SIGNS[h.sign];

  const pathway = selectHousePathway(ctx, h, prevPathway);
  const { expressiveLevel, supportLevel, axisSentence } = evaluateHouseAxes(ctx, h);

  const signAtom = SIGN_ON_HOUSE_DEEP[h.n]?.[h.sign] ?? "";
  const lordAtom = LORD_IN[idx][lp - 1];
  const inside = h.occupants.filter((g) => g !== h.lord);
  const occAtoms = inside.slice(0, 2).map((g) => PLANET_IN_HOUSE[g][idx]);
  const used = [signAtom, lordAtom, ...occAtoms];

  const sign = beats(signAtom), lord = beats(lordAtom), occ = occAtoms.map(beats);
  const lordSays = lordState(n, h)[0] ?? null;
  if (lordSays) used.push(lordSays);

  const lordLead = fill(lp === h.n ? STORY_LORD_HOME : STORY_LORD_LINK, {
    lord: lordName, p: lp, tagP: HOUSE_TAG[lp - 1], text: lowerFirst(lord.nature),
  });

  // Build occupant narrative block
  let occBody = "";
  if (!inside.length) {
    occBody = h.occupants.length
      ? `${lordName} cư ngụ ngay trong ngôi nhà của chính mình, giúp chuyện ${dH} giữ được mạch vận hành thuần nhất theo phẩm chất của ${lordName}.`
      : fill(STORY_EMPTY, { dH, lord: lordName, sign: signName });
  } else {
    const first = inside[0];
    const lines = [occ[0].nature];
    const st = stateLine(n, first);
    if (st) lines.push(st);
    if (inside.length > 1) {
      lines.push(occ[1].nature);
      const cj = conjOf(inside[0], inside[1]);
      lines.push(cj ? fill(CONJ_LINE, { a: nameOf(inside[0]), b: nameOf(inside[1]), gift: cj.gift, care: cj.care }) : fill(STORY_TOGETHER, { a: nameOf(inside[0]), b: nameOf(inside[1]) }));
      if (inside.length > 2) lines.push(fill(STORY_MANY, { list: joinVi(inside.slice(2).map(nameOf)) }));
    }
    if (h.lord !== first) lines.push(fill(STORY_REL[friendGrade(ctx, h.lord, first)], { lord: lordName, x: nameOf(first) }));
    occBody = lines.join(" ");
  }

  const seeks = [...new Set([sign, lord, ...occ].map((b) => b.seek).filter(Boolean))].slice(0, 3);
  const seekLine = seeks.length ? fill(STORY_SEEK, { list: seeks.some((x) => x.includes(",")) ? seeks.join("; ") : joinVi(seeks) }) : "";

  const three = [sign, lord, ...occ.slice(0, 1)];
  const costs = three.map((b) => b.cost).filter(Boolean).map(stripCost).slice(0, 2);
  const views = three.map((b) => b.view).filter(Boolean).map(stripView).slice(0, 2);
  const extras = [...sign.extra, ...lord.extra, ...occ.flatMap((b) => b.extra)].slice(0, 1);
  const costLine = costs.length > 1 ? fill(STORY_COST_MANY, { a: costs[0], b: costs[1] }) : costs.length ? fill(STORY_COST_ONE, { a: costs[0] }) : "";
  const viewLine = views.length > 1
    ? fill(STORY_VIEW_MANY, { first: views[0], rest: views[1] })
    : views.length ? fill(STORY_VIEW_ONE, { a: views[0] }) : "";

  const paragraphs: string[] = [];

  // Compose paragraphs differently according to the 5 deterministic pathways (Section V.3)
  if (pathway === "strength_lead") {
    // Hướng 1: Đi từ một điểm mạnh nổi bật
    paragraphs.push(
      `Điểm tựa sáng rõ nhất khi đọc vào nhà ${h.n} của bạn nằm ở sự vững vàng của cấu trúc dẫn dắt: ${lordSays ?? `cung ${signName} kết hợp cùng ${lordName} tạo nên nền tảng rất thuận cho chuyện ${dH}.`} ${lordLead} ${sign.nature}`,
      `${occBody}${seekLine ? " " + seekLine : ""} ${axisSentence}`,
      [viewLine, costLine, ...extras].filter(Boolean).join(" "),
    );
  } else if (pathway === "tension_contrast") {
    // Hướng 2: Đi từ sự đối lập hoặc độ vênh nội tại
    paragraphs.push(
      `Nhà ${h.n} mang một cấu trúc đối xứng rất đáng suy ngẫm khi có hai dòng lực cùng hoạt động song song trong chuyện ${dH}. ${axisSentence} Trên nền cung ${signName}, ${lowerFirst(sign.nature)}`,
      `Trong khi ${lordLead}${lordSays ? " " + lordSays : ""}, thì ở ngay lòng nhà: ${lowerFirst(occBody)}${seekLine ? " " + seekLine : ""}`,
      [costLine, ...extras, viewLine].filter(Boolean).join(" "),
    );
  } else if (pathway === "lord_bridge") {
    // Hướng 3: Đi từ mối liên kết của chủ nhà
    paragraphs.push(
      `Để hiểu mạch vận hành của chuyện ${dH} ở nhà ${h.n}, ta cần nhìn theo bước chân của ${lordName} — hành tinh giữ chìa khóa cung ${signName} trên nhà này. ${lordLead}${lordSays ? " " + lordSays : ""} Nhờ sợi dây liên kết ấy, mỗi chuyển động ở nhà ${lp} (${HOUSE_TAG[lp - 1]}) đều trực tiếp dội về nuôi dưỡng cho nhà ${h.n}.`,
      `${sign.nature} ${occBody}${seekLine ? " " + seekLine : ""}`,
      [axisSentence, costLine, viewLine, ...extras].filter(Boolean).join(" "),
    );
  } else if (pathway === "care_condition") {
    // Hướng 4: Đi từ điều kiện cần lưu tâm
    paragraphs.push(
      `Với chuyện ${dH} (nhà ${h.n}), bản đồ sao đặt ra một số điều kiện thực tế cần bạn lưu tâm và kiên nhẫn bồi đắp ngay từ nền móng. ${lordSays ? `${lordSays} ` : ""}${lordLead} ${axisSentence}`,
      `Trên chất liệu của cung ${signName}, ${lowerFirst(sign.nature)} ${occBody}${seekLine ? " " + seekLine : ""}`,
      [costLine, ...extras, viewLine].filter(Boolean).join(" "),
    );
  } else {
    // Hướng 5 (domain_steady): Đi từ chủ đề đời sống của nhà
    paragraphs.push(
      `${sign.nature} ${lordLead}${lordSays ? " " + lordSays : ""}`,
      `${occBody}${seekLine ? " " + seekLine : ""} ${axisSentence}`,
      [costLine, ...extras, viewLine].filter(Boolean).join(" "),
    );
  }

  return { paragraphs: paragraphs.filter(Boolean), used, pathway, expressiveLevel, supportLevel };
}

// ---------------------------------------------------------------- when the house lights up (used by timeline.ts in Đại vận chapter)

/** The next periods in which the planet that rules the house, or a planet inside it, runs the dasha. Only periods that can be trusted. */
export function lightWindows(ctx: Ctx, h: HouseInfo, max = 3): string[] {
  const rel = new Set<GrahaId>([h.lord, ...h.occupants]);
  const why = (g: GrahaId) => (g === h.lord ? (h.occupants.includes(g) ? WHY_CA_HAI : WHY_CAI_QUAN) : WHY_O_TRONG);
  const origin = dashaOrigin(ctx.n.grahas.moon.lon, ctx.n.utcMs);
  const horizon = ctx.now + 20 * YEAR_MS;
  const found: { at: number; lord: GrahaId; running: boolean; text: string }[] = [];
  for (const m of dashaMahas(origin, 12)) {
    if (m.endMs < ctx.now) continue;
    if (m.startMs > horizon) break;
    const running = (a: { startMs: number; endMs: number }) => ctx.now >= a.startMs && ctx.now < a.endMs;
    if (rel.has(m.lord) && levelTrust(1, ctx.rel) !== "chỉ tham khảo") {
      found.push({
        at: m.startMs, lord: m.lord, running: running(m),
        text: fill(STORY_NEXT_MAHA, { p: nameOf(m.lord), why: why(m.lord), from: mmYYYY(m.startMs), to: mmYYYY(m.endMs), a: Math.max(0, Math.round(ageAt(ctx.n, m.startMs))), b: Math.round(ageAt(ctx.n, m.endMs)) }) + (running(m) ? STORY_NEXT_NOW : ""),
      });
    }
    for (const a of dashaChildren(m)) {
      if (a.endMs < ctx.now || a.startMs > horizon || !rel.has(a.lord)) continue;
      const trust = trustAt(ctx, (a.startMs + a.endMs) / 2, 2);
      if (trust === "chỉ tham khảo") continue;
      found.push({
        at: a.startMs, lord: a.lord, running: running(a),
        text: fill(STORY_NEXT_ANTAR, { p: nameOf(a.lord), why: why(a.lord), from: mmYYYY(a.startMs), to: mmYYYY(a.endMs), m: nameOf(m.lord) })
          + (running(a) ? STORY_NEXT_NOW : "") + (trust === "gần đúng" ? STORY_NEXT_APPROX : ""),
      });
    }
  }
  found.sort((x, y) => x.at - y.at);
  const hinted = new Set<GrahaId>();
  const list = found.slice(0, max).map((f) => {
    if (f.running || hinted.has(f.lord)) return f.text;
    hinted.add(f.lord);
    return f.text + fill(STORY_NEXT_HINT, { e1: DASHA_PLANET[f.lord].events[0], e2: DASHA_PLANET[f.lord].events[1], dH: domain(h.n) });
  });
  return list.length ? [STORY_NEXT_INTRO, ...list] : [fill(STORY_NEXT_NONE, { dH: domain(h.n) })];
}
