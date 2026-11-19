// Life Atlas v3.0 — Vimshottari Dasha in five levels, consolidated timing chapter.
// Connects each period directly back to the natal houses (owned, occupied, aspected), Lagna lord relationship,
// D9 Navamsha maturation, and Yogas it activates, plus the 20-year house activation windows (Section II.2 & VI.2).
import { DUSTHANA, ENEMIES, FRIENDS, KENDRA, NATURAL_MALEFICS, SIGN_LORD, SIGNS, TRIKONA, mod, type GrahaId } from "../engine/constants.ts";
import { aspectOffsets } from "../engine/rules.ts";
import { transitAt, type Support } from "../engine/transit.ts";
import { vargaChart } from "../engine/vargas.ts";
import {
  dashaChildren, dashaMahas, dashaOrigin, dashaReliability, levelTrust, LEVEL_NAME, LEVEL_SANSKRIT,
  TIME_WINDOW_MIN, type DashaLevel, type DNode,
} from "../engine/dasha5.ts";
import type { Ctx } from "./ctx.ts";
import { isBenefic, ownedHouses, stateOf, type Tone } from "./shared.ts";
import { lightWindows } from "./story.ts";
import type { HouseWindowSummary, LadderReading, MahaRow, PeriodRead, Timeline, Trust } from "./types.ts";
import { HOUSE_TAG } from "./content/houses-signs.ts";
import { PLANETS } from "./content/planets.ts";
import { CHAPTER, DASHA_LIT, DASHA_STAGE } from "./content/chapters.ts";
import { LADDER_INTRO, TRUST_NOTE, TRUST_SUMMARY, OVERLAP, OVERLAP_EFFECT, OVERLAP_NONE, BLEND_HEAD, BLEND_PRAT } from "./content/dasha-deep.ts";
import {
  DASHA_PLANET, DASHA_DIGNITY, DASHA_SEAT, DASHA_COMPANY, DASHA_LOOK, DASHA_NODE, DASHA_RULES_LEAD, DASHA_SIT_LEAD, DASHA_FRIEND, DASHA_PAIR, DASHA_SELF,
  DASHA_EVENTS_LEAD, DASHA_WATCH, DASHA_CLASSIC, DASHA_CLASSIC_LINE, DASHA_LOOKS, DASHA_TONE_LINE, DASHA_TREND, DASHA_TREND_LABEL, type PairClass,
} from "./content/dasha-story.ts";
import { DIGNITY_VI } from "./shared.ts";
import { nameOf, joinVi, fill, mmYYYY, ddmmyyyy, spanLabel, year, ageAt, lowerFirst, firstSentence } from "./util.ts";

const SIGN_OF = (ctx: Ctx, g: GrahaId) => ctx.n.grahas[g].sign;

/** Houses a lord lights up: the ones it rules, and the one it sits in. Nodes borrow the houses of the lord of their sign. */
export function litHouses(ctx: Ctx, lord: GrahaId): number[] {
  if (ctx.noTime) return [];
  const n = ctx.n;
  const pos = n.grahas[lord].house;
  let owned = ownedHouses(n, lord);
  if (!owned.length) owned = ownedHouses(n, n.houses[pos - 1].lord);
  return [...new Set([...owned, pos])];
}

// ---------------------------------------------------------------- how a period is told

const agent = (ctx: Ctx, g: GrahaId): GrahaId => (g === "rahu" || g === "ketu" ? SIGN_LORD[SIGN_OF(ctx, g)] : g);

/** Parashara's five-fold friendship (Panchadha Maitri) of `holder` toward `held`. */
export function friendGrade(ctx: Ctx, holder: GrahaId, held: GrahaId): keyof typeof DASHA_FRIEND {
  const h = agent(ctx, holder), d = agent(ctx, held);
  if (h === d) return "friend";
  const natural = FRIENDS[h]?.includes(d) ? 1 : ENEMIES[h]?.includes(d) ? -1 : 0;
  const away = mod(SIGN_OF(ctx, held) - SIGN_OF(ctx, holder), 12) + 1;
  const temporary = [2, 3, 4, 10, 11, 12].includes(away) ? 1 : -1;
  const sum = natural + temporary;
  if (sum === 2) return "great";
  if (sum === -2) return "great_enemy";
  if (natural === 0) return temporary === 1 ? "friend" : "enemy";
  return sum === 0 ? "neutral" : sum > 0 ? "friend" : "enemy";
}

function pairClass(ctx: Ctx, holder: GrahaId, held: GrahaId): PairClass {
  const d = mod(SIGN_OF(ctx, held) - SIGN_OF(ctx, holder), 12) + 1;
  if (d === 1) return "same";
  if (d === 3 || d === 11) return "best";
  if (d === 4 || d === 10) return "good";
  if (d === 5 || d === 9) return "dharma";
  if (d === 7) return "facing";
  if (d === 2) return "limited";
  if (d === 12) return "limited12";
  return d === 6 ? "hard" : "hard8";
}

export function pairText(ctx: Ctx, holder: GrahaId, held: GrahaId): string[] {
  const a = nameOf(held), m = nameOf(holder);
  if (holder === held) return [fill(DASHA_SELF, { a })];
  return [fill(DASHA_PAIR[pairClass(ctx, holder, held)], { a, m }), fill(DASHA_FRIEND[friendGrade(ctx, holder, held)], { a, m })];
}

const TONE_OF_CLASS: Record<PairClass, number> = { same: 0, best: 1, good: 0.5, dharma: 0, facing: 0, limited: -0.5, limited12: -0.5, hard: -1, hard8: -1.5 };
const TONE_OF_FRIEND: Record<keyof typeof DASHA_FRIEND, number> = { great: 1, friend: 0.5, neutral: 0, enemy: -0.5, great_enemy: -1 };

function whereLines(ctx: Ctx, lord: GrahaId, span: string, rulesFirst: boolean): string[] {
  const n = ctx.n, a = nameOf(lord);
  if (ctx.noTime) return [`${a} đang ở cung ${SIGNS[SIGN_OF(ctx, lord)]}, nên màu sắc của cung này dẫn nhịp chính cho cả ${span}.`];
  const pos = n.grahas[lord].house;
  const owned = ownedHouses(n, lord);
  const named = (hs: number[]) => joinVi(hs.map((h) => `nhà ${h} (${HOUSE_TAG[h - 1]})`));
  const sit = `${fill(DASHA_SIT_LEAD, { a, p: pos })} ${span} này diễn ra ${DASHA_STAGE[pos - 1]}`;
  if (!owned.length) {
    const ref = n.houses[pos - 1].lord;
    return [sit, fill(DASHA_NODE, { a, ref: nameOf(ref), refRules: named(ownedHouses(n, ref)) })];
  }
  const lit = owned.slice(0, 2).map((h) => lowerFirst(firstSentence(DASHA_LIT[h - 1])));
  const rule = `${fill(DASHA_RULES_LEAD, { a, rules: named(owned) })} ${lit[0]}${lit[1] ? ` Còn ${lit[1]}` : ""}`;
  const looked = aspectOffsets(lord).map((off) => mod(pos + off - 2, 12) + 1).filter((hh) => !owned.includes(hh));
  const look = looked.length ? [fill(DASHA_LOOKS, { a, list: joinVi(looked.map((hh) => `nhà ${hh} (${HOUSE_TAG[hh - 1]})`)) })] : [];
  return rulesFirst ? [rule, sit, ...look] : [sit, rule, ...look];
}

function conditionLines(ctx: Ctx, lord: GrahaId): string[] {
  const n = ctx.n, g = n.grahas[lord], a = nameOf(lord);
  const out: string[] = [];
  if (!ctx.noTime) {
    const lagnaLord = SIGN_LORD[n.lagna.sign];
    if (lord === lagnaLord) {
      out.push(`Vì ${a} chính là hành tinh cai quản cung mọc của bạn, giai đoạn này luôn mang lại điểm tựa nội tại để bạn sống đúng với bản chất và chủ động cầm lái cuộc đời mình.`);
    } else {
      const llRel = friendGrade(ctx, lagnaLord, lord);
      if (llRel === "great" || llRel === "friend") {
        out.push(`${a} có quan hệ tương hợp với hành tinh cai quản cung mọc (${nameOf(lagnaLord)}), nên nhịp vận hành của giai đoạn này khá thuận chiều với định hướng sống tự nhiên của bạn.`);
      }
    }
    const seat: string[] = [];
    if (DUSTHANA.includes(g.house)) seat.push(DASHA_SEAT.dusthana);
    else if (TRIKONA.includes(g.house)) seat.push(DASHA_SEAT.trikona);
    else if (KENDRA.includes(g.house)) seat.push(DASHA_SEAT.kendra);
    if ([3, 6, 10, 11].includes(g.house) && NATURAL_MALEFICS.includes(lord)) seat.push(DASHA_SEAT.upachaya);
    out.push(...seat.map((t) => fill(t, { a, p: g.house })));
  }
  const dig = g.dignity;
  if (dig === "exalted" || dig === "own" || dig === "moolatrikona") out.push(fill(DASHA_DIGNITY.strong, { a }));
  else if (dig === "enemy") out.push(fill(DASHA_DIGNITY.enemy, { a }));
  else if (dig === "debilitated") out.push(fill(DASHA_DIGNITY.weak, { a }));
  if (g.combust && lord !== "sun") out.push(fill(DASHA_DIGNITY.combust, { a }));
  if (g.retro && lord !== "rahu" && lord !== "ketu") out.push(fill(DASHA_DIGNITY.retro, { a }));

  const ids: GrahaId[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"];
  const company = ids.filter((x) => x !== lord && SIGN_OF(ctx, x) === g.sign).slice(0, 2);
  for (const x of company) {
    const p = PLANETS[x];
    out.push(fill(isBenefic(n, x) ? DASHA_COMPANY.benefic : DASHA_COMPANY.malefic, { a, x: nameOf(x), gift: p.gift, shadow: p.shadow }));
  }
  if (!company.length && lord !== "rahu" && lord !== "ketu") {
    const seven: GrahaId[] = ["jupiter", "saturn", "mars", "venus", "mercury", "moon", "sun"];
    const looks = seven.filter((x) => x !== lord && aspectOffsets(x).includes(mod(g.sign - SIGN_OF(ctx, x), 12) + 1)).slice(0, 2);
    for (const x of looks) out.push(fill(isBenefic(n, x) ? DASHA_LOOK.benefic : DASHA_LOOK.malefic, { a, x: nameOf(x) }));
  }
  // Cross-reference Yogas involving this planet in the natal chart (Section VI.2)
  const relYogas = n.yogas.filter((y) => y.grahas.includes(lord)).slice(0, 2);
  if (relYogas.length) {
    out.push(`Trong lá số gốc, ${a} còn tham gia tạo nên tổ hợp ${joinVi(relYogas.map((y) => y.name))}, nên đây cũng là thời điểm những phẩm chất của tổ hợp đó bước ra đời sống thực tế rõ nét nhất.`);
  }
  // Cross-reference D9 Navamsha placement of the Dasha lord
  if (!ctx.noTime) {
    const d9 = vargaChart(n, 9).planets[lord];
    if (d9.dignity === "exalted" || d9.dignity === "own" || d9.dignity === "moolatrikona" || g.vargottama) {
      out.push(`Trên biểu đồ nội tâm D9 (Navamsha), ${a} đứng vững tại cung ${SIGNS[d9.sign]} (nhà ${d9.house} D9), giúp bạn giữ được độ chín chắn và cảm giác bình tâm nơi đáy lòng suốt giai đoạn này.`);
    }
  }
  return out;
}

const trustCache = new WeakMap<Ctx, Map<number, ReturnType<typeof dashaReliability>>>();
export function trustAt(ctx: Ctx, ms: number, level: DashaLevel): Trust {
  let m = trustCache.get(ctx);
  if (!m) { m = new Map(); trustCache.set(ctx, m); }
  const key = Math.round(ms / 86_400_000);
  let r = m.get(key);
  if (!r) { r = dashaReliability(ctx.n.utcMs, ms, ctx.windowMin); m.set(key, r); }
  return levelTrust(level, r);
}

const fmtEdge = (level: DashaLevel, ms: number) => (level <= 2 ? mmYYYY(ms) : ddmmyyyy(ms));

function classicLine(ctx: Ctx, lord: GrahaId): string {
  const c = DASHA_CLASSIC[lord], p = nameOf(lord);
  const t = periodTone(ctx, lord).tone;
  return t === "good" ? fill(DASHA_CLASSIC_LINE.up, { p, up: c.up }) : t === "hard" ? fill(DASHA_CLASSIC_LINE.down, { p, down: c.down }) : fill(DASHA_CLASSIC_LINE.mixed, { p, up: c.up, down: c.down });
}

export function readPeriod(ctx: Ctx, node: DNode): PeriodRead {
  const { lord, level } = node;
  const mid = (node.startMs + node.endMs) / 2;
  const holder = level > 1 ? node.path[level - 2] : null;
  const paragraphs: string[] = [];
  const a = nameOf(lord);
  const plan = DASHA_PLANET[lord];
  let title: string;
  let tone: Tone | undefined;
  const houses = litHouses(ctx, lord);

  let layers: { title: string; text: string }[] | undefined;
  if (level === 1) {
    const ch = CHAPTER[lord];
    title = `Giai đoạn “${ch.title}”`;
    const R = mahaRead(ctx, lord);
    layers = [
      { title: "Chủ đề bao trùm", text: R.theme },
      { title: "Điều kiện thuận lợi", text: R.plus },
      { title: "Yếu tố trái chiều", text: R.minus },
      { title: "Các lĩnh vực liên kết với nhau", text: R.links },
    ];
    paragraphs.push(...layers.map((l) => l.text));
    tone = periodTone(ctx, lord).tone;
  } else {
    title = `${a} · ${LEVEL_NAME[level].toLowerCase()} trong ${node.path.slice(0, level - 1).map(nameOf).join(" › ")}`;
    const pair = holder ? pairText(ctx, holder, lord) : [];
    if (level === 2) {
      tone = antarTone(ctx, holder as GrahaId, lord);
      paragraphs.push(...antarRead(ctx, holder as GrahaId, lord, tone));
    } else if (level === 3) {
      paragraphs.push(`${plan.about} ${fill(DASHA_EVENTS_LEAD, { list: plan.events.slice(0, 2).join("; ") })}`);
      if (pair.length) paragraphs.push(pair.join(" "));
      tone = antarTone(ctx, holder as GrahaId, lord);
    } else {
      paragraphs.push(`${plan.about}${pair.length ? " " + pair[pair.length - 1] : ""}`);
    }
  }

  return {
    level, lord, lordName: a, name: LEVEL_NAME[level], sanskrit: LEVEL_SANSKRIT[level],
    from: fmtEdge(level, node.startMs), to: fmtEdge(level, node.endMs), fromMs: node.startMs, toMs: node.endMs,
    span: spanLabel(node.endMs - node.startMs),
    trust: trustAt(ctx, mid, level),
    path: node.path.map(nameOf), pathIds: node.path, title, paragraphs, layers,
    litHouses: houses,
    state: stateOf(ctx.now, node.startMs, node.endMs), tone,
  };
}

// ---------------------------------------------------------------- Mahadasha and Antardasha, synthesised

const AREA = (h: number) => HOUSE_TAG[h - 1];
const areaList = (hs: number[]) => { const a = hs.map((h) => `chuyện ${AREA(h)}`); return a.length <= 1 ? a.join("") : a.length === 2 ? `${a[0]} cùng ${a[1]}` : `${a.slice(0, -1).join(", ")}, cùng ${a[a.length - 1]}`; };
/** The areas a lord brings forward, heaviest first: the houses it rules (trikona and kendra first), then the one it sits in. */
function areasOf(ctx: Ctx, lord: GrahaId): number[] {
  if (ctx.noTime) return [];
  const n = ctx.n, pos = n.grahas[lord].house;
  let owned = ownedHouses(n, lord);
  if (!owned.length) owned = ownedHouses(n, n.houses[pos - 1].lord);
  const w = (h: number) => ([1, 5, 9].includes(h) ? 3 : [4, 7, 10].includes(h) ? 2.5 : [2, 11].includes(h) ? 2 : 1);
  return [...new Set([pos, ...owned.sort((x, y) => w(y) - w(x))])];
}

function mahaRead(ctx: Ctx, lord: GrahaId): { theme: string; plus: string; minus: string; links: string } {
  const n = ctx.n, g = n.grahas[lord], nm = nameOf(lord), ch = CHAPTER[lord];
  const areas = areasOf(ctx, lord);
  const pos = ctx.noTime ? null : g.house;
  const themeBase = firstSentence(ch.asks);
  const focus = areas.length ? ` Với bạn, giai đoạn này đặt ${areaList(areas.slice(0, 3))} vào trọng tâm.` : "";
  const plus: string[] = [], minus: string[] = [];
  const dig = g.dignity;
  if (dig === "exalted" || dig === "own" || dig === "moolatrikona") plus.push("những gì giai đoạn này mở ra có đủ sức để thành hiện thực");
  if (dig === "debilitated") minus.push("kết quả thường đến chậm và đòi nhiều lần điều chỉnh");
  if (dig === "enemy") minus.push("nhịp của giai đoạn hay bị cản bởi hoàn cảnh");
  if (g.combust && lord !== "sun") minus.push("những mong muốn riêng dễ bị lấn át bởi áp lực bên ngoài");
  if (!ctx.noTime) {
    const LL = SIGN_LORD[n.lagna.sign];
    if (lord === LL) plus.push("đây là giai đoạn bạn có nhiều quyền tự quyết hơn thường lệ");
    else { const fg = friendGrade(ctx, LL, lord); if (fg === "great" || fg === "friend") plus.push("hướng đi của giai đoạn khá thuận với con người bạn"); else if (fg === "great_enemy") minus.push("điều giai đoạn đòi hỏi có lúc ngược với mong muốn tự nhiên của bạn"); }
    if (KENDRA.includes(g.house) || TRIKONA.includes(g.house)) plus.push(TRIKONA.includes(g.house) ? "giai đoạn thường có may mắn và người tốt đi kèm" : "giai đoạn có chỗ đứng vững và thường hiện rõ trong đời sống");
    if (DUSTHANA.includes(g.house)) minus.push(`giai đoạn hay đi qua chuyện ${AREA(g.house)}, nên có những việc khó nói hoặc tốn sức`);
    const owned = ownedHouses(n, lord);
    if (owned.some((h) => [5, 9].includes(h)) && owned.some((h) => [4, 7, 10].includes(h))) plus.push("đây là một trong những giai đoạn được truyền thống xem là thuận nhất trong lá số của bạn");
    if (owned.some((h) => DUSTHANA.includes(h)) && !owned.some((h) => [1, 5, 9].includes(h))) minus.push(`${areaList(owned.filter((h) => DUSTHANA.includes(h)))} cũng thường đi kèm trong giai đoạn`);
  }
  const ids: GrahaId[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
  const looks = ids.filter((x) => x !== lord && aspectOffsets(x).includes(mod(g.sign - SIGN_OF(ctx, x), 12) + 1));
  if (looks.includes("jupiter")) plus.push("bạn có thêm sự che chở và người giúp đỡ");
  if (looks.includes("saturn") && lord !== "saturn") minus.push("giai đoạn có phần nặng nề và chậm");
  const yg = n.yogas.filter((y) => y.grahas.includes(lord) && y.strength !== "weak");
  for (const y of yg.slice(0, 2)) (y.tone === "good" ? plus : minus).push(y.tone === "good" ? "những điểm mạnh đặc biệt trong lá số có dịp thể hiện" : "một điểm khó trong lá số dễ lộ ra");
  if (!ctx.noTime) {
    const d9 = vargaChart(n, 9).planets[lord];
    if (d9.dignity === "exalted" || d9.dignity === "own" || g.vargottama) plus.push("những gì đạt được trong giai đoạn này có xu hướng bền");
    else if (d9.dignity === "debilitated") minus.push("điều đạt được cần được chăm để giữ lâu");
  }
  const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
  const plusT = plus.length ? `${cap(plus.slice(0, 3).join("; "))}.` : "Không có thuận lợi nào nổi bật hơn mức bình thường; giai đoạn đi theo công sức bạn đặt vào.";
  const minusT = minus.length ? `${cap(minus.slice(0, 3).join("; "))}. ${ch.trap}` : ch.trap;
  let links = "";
  if (areas.length >= 2) links = `${ch.scene} Chuyện ${AREA(areas[0])} và chuyện ${AREA(areas[1])} đi cùng nhau trong giai đoạn này: thay đổi ở bên này thường kéo theo việc sắp xếp lại bên kia.`;
  else links = ch.scene;
  return { theme: `${themeBase}${focus}`, plus: plusT, minus: minusT, links };
}

const PAIR_PLAIN: Record<string, string> = {
  same: "", best: "Giai đoạn nhỏ này nâng đỡ giai đoạn lớn: công sức bỏ ra thường có kết quả và có thêm thu nhập hoặc tiến bộ.",
  good: "Giai đoạn nhỏ này khá hợp với giai đoạn lớn, nên mọi việc thường trôi chảy hơn.", dharma: "Giai đoạn nhỏ này mang lại sự hài lòng và thường có người tốt giúp đỡ.",
  facing: "Giai đoạn nhỏ này đặt bạn trước một người hoặc một lựa chọn quan trọng; nhiều việc cần thương lượng.", limited: "Giai đoạn nhỏ này hạn chế hơn: kết quả có nhưng không nhiều, và hay đi kèm chi tiêu.",
  limited12: "Giai đoạn nhỏ này hạn chế hơn: kết quả có nhưng không nhiều, và hay đi kèm chi tiêu.", hard: "Giai đoạn nhỏ này dễ có va chạm, áp lực hoặc việc phải giải quyết gấp.",
  hard8: "Giai đoạn nhỏ này dễ có thay đổi bất ngờ; nên giữ nhịp an toàn hơn là mạo hiểm.",
};
function antarRead(ctx: Ctx, maha: GrahaId, lord: GrahaId, tone: Tone): string[] {
  const out: string[] = [];
  if (maha === lord) out.push("Đây là đoạn mở đầu của giai đoạn lớn, khi chủ đề của nó hiện ra rõ và thuần nhất.");
  else {
    const fg = friendGrade(ctx, maha, lord);
    out.push(`${PAIR_PLAIN[pairClass(ctx, maha, lord)]}${fg === "great" || fg === "friend" ? " Hai giai đoạn hiểu nhau, nên việc của giai đoạn lớn được đẩy đi tiếp." : fg === "enemy" || fg === "great_enemy" ? " Hai giai đoạn không hợp nhau lắm, nên có lúc bạn bị kéo về hai hướng." : ""}`.trim());
  }
  const A = areasOf(ctx, maha), B = areasOf(ctx, lord);
  if (A.length && B.length && maha !== lord) {
    const common = B.filter((h) => A.includes(h)), fresh = B.filter((h) => !A.includes(h));
    if (common.length) out.push(`Chuyện ${AREA(common[0])} là mảng nổi bật nhất của khoảng thời gian này.`);
    if (fresh.length) out.push(`Điều mới so với trước là ${areaList(fresh.slice(0, 2))} được đưa lên.`);
  }
  out.push(`${DASHA_TONE_LINE[tone]} ${fill(DASHA_WATCH, { watch: DASHA_PLANET[lord].watch, doing: DASHA_PLANET[lord].doing })}`);
  return out;
}

function antarTone(ctx: Ctx, holder: GrahaId, lord: GrahaId): Tone {
  let s = periodTone(ctx, lord).score;
  if (holder !== lord) s += TONE_OF_CLASS[pairClass(ctx, holder, lord)] + TONE_OF_FRIEND[friendGrade(ctx, holder, lord)];
  return s >= 1 ? "good" : s <= -1 ? "hard" : "mixed";
}

export function readTrend(ctx: Ctx, p: PeriodRead): { kind: "up" | "flat" | "down"; label: string; text: string } | null {
  if (p.level !== 2 || p.toMs - p.fromMs < 270 * 86_400_000) return null;
  const worth = (x: Support) => (x === "tốt" ? 1 : x === "khó" ? -1 : 0);
  const sc = [1, 3, 5, 7].map((k) => {
    const t = transitAt(ctx.n, p.fromMs + ((p.toMs - p.fromMs) * k) / 8);
    return (worth(t.grahas.jupiter.support) + worth(t.grahas.saturn.support)) / 2;
  });
  const d = (sc[2] + sc[3]) / 2 - (sc[0] + sc[1]) / 2;
  const kind = d >= 0.5 ? "up" : d <= -0.5 ? "down" : "flat";
  return { kind, label: DASHA_TREND_LABEL[kind], text: DASHA_TREND[kind] };
}

export function readChildren(ctx: Ctx, p: PeriodRead): PeriodRead[] {
  if (p.level >= 5) return [];
  const node: DNode = { level: p.level, lord: p.lord, startMs: p.fromMs, endMs: p.toMs, path: p.pathIds };
  return dashaChildren(node).map((c) => readPeriod(ctx, c));
}

// ---------------------------------------------------------------- tone of a chapter

function periodTone(ctx: Ctx, lord: GrahaId): { tone: Tone; why: string[]; score: number } {
  const n = ctx.n;
  const g = n.grahas[lord];
  const why: string[] = [];
  let s = 0;
  const add = (pts: number, text: string) => { s += pts; why.push(`${pts > 0 ? "+" : "−"}${Math.abs(pts)} · ${text}`); };
  if (g.dignity === "exalted" || g.dignity === "own" || g.dignity === "moolatrikona") add(1, `${nameOf(lord)} đang mạnh (${DIGNITY_VI[g.dignity].toLowerCase()})`);
  if (g.dignity === "debilitated") add(-1, `${nameOf(lord)} đang ở cung hãm`);
  if (g.combust) add(-0.5, `${nameOf(lord)} bị cháy sáng`);
  if (!ctx.noTime) {
    const lagnaLord = SIGN_LORD[n.lagna.sign];
    if (lord === lagnaLord) add(0.5, `${nameOf(lord)} là hành tinh cai quản cung mọc`);
    if ([1, 4, 5, 7, 9, 10, 11].includes(g.house)) add(0.5, `${nameOf(lord)} ngồi ở nhà ${g.house}`);
    if (DUSTHANA.includes(g.house)) add(-0.5, `${nameOf(lord)} ngồi ở nhà ${g.house}`);
    const lorded = ownedHouses(n, lord);
    if (lorded.length) {
      const t: number[] = lorded.map((h) => (ctx.tones[h - 1] === "good" ? 0.5 : ctx.tones[h - 1] === "hard" ? -0.5 : 0));
      const avg = t.reduce((a, b) => a + b, 0) / t.length;
      if (avg !== 0) add(avg, `các nhà nó cai quản (${lorded.join(", ")}) phần lớn ${avg > 0 ? "thuận" : "nhiều thử thách"}`);
    } else {
      const disp = n.grahas[n.houses[g.house - 1].lord];
      if ([1, 4, 5, 7, 9, 10, 11].includes(disp.house)) add(0.5, `hành tinh cai quản cung nó đứng (${nameOf(disp.id)}) ở nhà ${disp.house}`);
      if (DUSTHANA.includes(disp.house)) add(-0.5, `hành tinh cai quản cung nó đứng (${nameOf(disp.id)}) ở nhà ${disp.house}`);
    }
  }
  return { tone: s >= 1 ? "good" : s <= -1 ? "hard" : "mixed", why, score: s };
}

const timeKind = (w: number) => (w <= TIME_WINDOW_MIN.exact ? "exact" : w <= TIME_WINDOW_MIN.canh ? "canh" : "unknown");

export function readTimeline(ctx: Ctx): Timeline {
  const n = ctx.n;
  const origin = dashaOrigin(n.grahas.moon.lon, n.utcMs);
  const mahas: MahaRow[] = [];
  for (const m of dashaMahas(origin, 12)) {
    if (ageAt(n, m.startMs) >= 85) break;
    const pt = periodTone(ctx, m.lord);
    const houses = litHouses(ctx, m.lord);
    mahas.push({
      lord: m.lord, name: nameOf(m.lord), from: mmYYYY(m.startMs), to: mmYYYY(m.endMs),
      startYear: year(m.startMs), endYear: year(m.endMs),
      ageFrom: Math.max(0, Math.round(ageAt(n, m.startMs))), ageTo: Math.round(ageAt(n, m.endMs)),
      state: stateOf(ctx.now, m.startMs, m.endMs), tone: pt.tone, why: pt.why,
      title: CHAPTER[m.lord].title, theme: PLANETS[m.lord].dasha,
      litHouses: houses,
      read: readPeriod(ctx, m),
      antars: dashaChildren(m).map((a) => readPeriod(ctx, a)),
    });
  }
  const houseWindows: HouseWindowSummary[] = ctx.noTime
    ? []
    : n.houses.map((h) => ({
        n: h.n,
        tag: HOUSE_TAG[h.n - 1],
        lordName: nameOf(h.lord),
        windows: lightWindows(ctx, h, 3),
      }));

  const months = Math.round(origin.balanceYears * 12);
  const birth = `Bạn sinh trong đại vận ${nameOf(origin.lord)}; lúc sinh, đại vận này còn lại khoảng ${Math.floor(months / 12)} năm ${months % 12} tháng. Con số này được tính từ chòm sao Mặt Trăng đang đứng lúc bạn sinh.`;
  return {
    intro: LADDER_INTRO, birth, mahas, houseWindows,
    reliability: { windowMin: ctx.windowMin, stableLevels: ctx.rel.stableLevels, note: TRUST_SUMMARY[timeKind(ctx.windowMin)] },
  };
}

// ---------------------------------------------------------------- the five levels right now, together with the sky

export interface Overlap { n: number; tag: string; who: string; planet: GrahaId; effect: string }

export function findOverlaps(ctx: Ctx): Overlap[] {
  if (ctx.noTime) return [];
  const lit = new Map<number, string[]>();
  ctx.chain.slice(0, 3).forEach((node, i) => {
    if (levelTrust((i + 1) as 1 | 2 | 3, ctx.rel) === "chỉ tham khảo") return;
    const who = `${["đại vận", "tiểu vận", "chặng"][i]} ${nameOf(node.lord)}`;
    for (const h of litHouses(ctx, node.lord)) lit.set(h, [...(lit.get(h) ?? []), who]);
  });
  const out: Overlap[] = [];
  for (const id of ["saturn", "jupiter", "rahu", "ketu"] as const) {
    const h = ctx.transit.grahas[id].fromLagna;
    const who = lit.get(h);
    if (who) out.push({ n: h, tag: HOUSE_TAG[h - 1], who: joinVi(who), planet: id, effect: OVERLAP_EFFECT[id] });
  }
  return out;
}

export function readLadder(ctx: Ctx): LadderReading {
  const levels = ctx.chain.map((node) => readPeriod(ctx, node));

  const blend: string[] = [];
  const [maha, antar, prat] = ctx.chain;
  if (maha && antar) {
    const showPrat = prat && levels[2].trust !== "chỉ tham khảo";
    blend.push(fill(BLEND_HEAD, {
      maha: CHAPTER[maha.lord].title, mahaTo: mmYYYY(maha.endMs), antar: nameOf(antar.lord), antarTo: mmYYYY(antar.endMs),
      prat: showPrat ? fill(BLEND_PRAT, { prat: nameOf(prat.lord), pratTo: ddmmyyyy(prat.endMs) }) : "",
    }));
  }
  if (!ctx.noTime && maha) {
    const overlaps = findOverlaps(ctx).map((o) => fill(OVERLAP, { n: o.n, tag: o.tag, who: o.who, planet: nameOf(o.planet), effect: o.effect }));
    blend.push(...(overlaps.length ? overlaps.slice(0, 2) : [OVERLAP_NONE]));
  }
  return {
    ms: ctx.now, dateLabel: ddmmyyyy(ctx.now), levels, blend,
    trustNote: TRUST_SUMMARY[timeKind(ctx.windowMin)],
  };
}

export { TRUST_NOTE };
