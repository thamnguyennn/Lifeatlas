// The Overview (Tổng quan) of Life Atlas v3: one page that opens with a letter and a single sentence about the whole chart,
// then reads the rising sign, the Sun and the Moon together, the four elements, the moon cycle, the planets that carry the chart
// and the part of life the chart keeps coming back to. Every sentence is chosen by a rule from the facts in ./facts.ts; the rules
// are written down in docs/ENGINE.md. Nothing here invents a trait: a block with little to say says little.
import { SIGNS, SEVEN, SIGN_LORD, GRAHAS, mod, fmtDeg, NAKSHATRA_VI, type GrahaId } from "../engine/constants.ts";
import { phaseName } from "../engine/sky.ts";
import type { Ctx } from "./ctx.ts";
import { buildFacts, isGood, HOUSE_SHORT, type Facts, type PlanetFact } from "./facts.ts";
import { LAGNA_SIGN, MOON_PHASE_AT_BIRTH, NAKSHATRA_TEXT } from "./content/lagna-nakshatra.ts";
import { SUN_SIGN, MOON_SIGN, MOON_NAK_LEAD, SUN_DIGNITY, ELEMENT_OF, ELEMENT_VI, ELEMENT_LINES, ELEMENT_BALANCED, KEY_LINK, type Element } from "./content/overview.ts";
import { conjOf } from "./content/conjunctions.ts";
import { MOON_PORTRAIT, SUN_PORTRAIT, LAGNA_PORTRAIT, TRIAD_LINE, type Portrait } from "./content/portraits.ts";
import { PAIRS } from "./content/pairs.ts";
import { EL_MANY, EL_NONE, EL_FEW, EL_EVEN, EL_NONE_SHORT } from "./content/elements.ts";
import { LAGNA_LOOK, EL_NB, PLANET_NB, AREA_NB, SUN_NB, MOON_NB } from "./content/overview-nblm.ts";
import { HOUSE_TAG, AREA_EXAMPLE } from "./content/houses-signs.ts";
import { NAK } from "./content/nakshatra.ts";
import { PLANET_IN_HOUSE } from "./content/planet-in-house.ts";
import { stability } from "./stability.ts";
import { computeNatal } from "../engine/core.ts";
import { PLANETS } from "./content/planets.ts";
import { DIGNITY_VI, planetFlags } from "./shared.ts";
import { isSeven } from "../engine/shadbala.ts";
import { nameOf, joinVi, fill, greetName, lowerFirst, firstSentence } from "./util.ts";
import type { PlanetRow, StrengthRow } from "./types.ts";

export interface OverviewBlock {
  id: "keys" | "lagna" | "sun" | "moon" | "link" | "elements" | "moonCycle" | "pillars" | "focus";
  /** Small data for the icons of the block. */
  meta?: { signs?: { label: string; sign: number }[]; planets?: GrahaId[]; elements?: Record<string, number>; elong?: number };
  title: string;
  /** What the point stands for, shown under the title. */
  role?: string;
  sign?: string;
  paragraphs: string[];
  /** The technical evidence, shown folded under "Vì sao mình nói điều này?". */
  why: string[];
  /** A short line of numbers, e.g. "Lửa 2 · Đất 3 · Khí 1 · Nước 2". */
  facts?: string;
  /** For the rising sign, the Sun and the Moon: a named portrait in five beats (content/portraits.ts). */
  portrait?: { motif: string; beats: { h: string; p: string }[]; why: string };
  /** The three points read in pairs (content/pairs.ts): a small heading and one paragraph each. */
  pairs?: { h: string; p: string }[];
}

export interface Letter {
  greeting: string;
  /** One sentence about the whole chart. */
  line: string;
  /** The rest of the opening letter: where the chart puts its effort, its main pull, and an invitation to read on. */
  paras: string[];
  /** The evidence for the letter, folded under "Vì sao mình nói điều này?". */
  why: string[];
  chips: { label: string; value: string; role: string }[];
}

/** Tổng quan v5: from the outside in, then the highlights, the whole picture, and the data underneath. */
export interface Explore {
  lead: string;
  parts: { key: "lagna" | "sun" | "moon"; title: string; role: string; sign: number; paragraphs: string[]; /** The technical facts behind this part, folded. */ details: string[] }[];
  highlights: { key: "elements" | "planets" | "areas"; title: string; text: string; elements?: Record<string, number>; planets?: GrahaId[] }[];
  summary: string;
  basis: { h: string; lines: string[] }[];
}

export interface Overview {
  explore: Explore;
  blocks: OverviewBlock[];
  strength: StrengthRow[] | null;
  /** Share of the chart's weight in each area of life (null without a birth time). */
  focusShare: { title: string; houses: number[]; pct: number }[] | null;
  planets: PlanetRow[];
}

const nakName = (name: string) => NAKSHATRA_VI[name] ?? name;
/** A steady pick from a list: the same chart always gets the same sentence, different charts spread over the list. */
const pick = <T,>(list: T[], seed: number): T => list[Math.abs(Math.round(seed)) % list.length];

// ------------------------------------------------------------------ small phrase banks

/** How people meet you: said of the rising sign. Fits "một người …". */
const FACE: string[] = [
  "bước vào đời thẳng thắn, nhanh và quen đi trước",
  "chậm rãi, vững chãi và làm gì cũng muốn nó bền",
  "nhanh trí, hay hỏi và kết nối dễ với đủ loại người",
  "nhạy cảm, hay lo cho người khác và giữ một lớp vỏ dè dặt",
  "tự tin, ấm áp và mang sẵn khí chất của người đứng ra dẫn dắt",
  "chỉn chu, tinh ý và để mắt tới những chi tiết người khác bỏ sót",
  "hòa nhã, có gu và luôn tìm thế cân bằng giữa các phía",
  "kín đáo, sâu và nhìn xuyên qua lớp ngoài của sự việc",
  "phóng khoáng, lạc quan và luôn hướng về một chân trời xa hơn",
  "điềm tĩnh, có trách nhiệm và đi lên từng bước chắc",
  "độc lập, nhìn đời từ một góc riêng và nghĩ cho cái chung",
  "dịu dàng, giàu cảm nhận và dễ chạm vào nỗi niềm người khác",
];
/** What the heart carries: said of the Moon's sign. Fits "bên trong, bạn …". */
const HEART: string[] = [
  "cần được tự quyết và được hành động khi lòng đã nghiêng về một hướng",
  "tìm sự yên ổn nơi những điều quen thuộc và đáng tin",
  "cần trò chuyện, tìm hiểu và có thêm điều mới để tâm trí không chững lại",
  "mong một mái ấm thật sự, nơi mình được che chở và cũng che chở lại",
  "muốn được ghi nhận bằng một sự trân trọng chân thành",
  "chỉ thấy yên khi mọi thứ quanh mình rõ ràng và có ích",
  "cần sự hòa thuận và một mối quan hệ mà mình thấy công bằng",
  "giữ một chiều sâu rất riêng và chỉ mở lòng với người đã chứng tỏ sự đáng tin",
  "khao khát tự do và một lẽ sống đủ rộng để theo",
  "cần cảm giác đã dựng được một nền vững thì mới thấy yên lòng",
  "cần một khoảng trời riêng để nghĩ khác và sống theo cách của mình",
  "nhạy cảm sâu và cần những khoảng lặng để lòng được lắng lại",
];
/** How the Sun sees itself: fits "nhìn nhận mình qua …". */
const SELF: string[] = [
  "khả năng mở đường và tự đứng bằng chân mình",
  "những thứ làm ra được, giữ được và có giá trị thật",
  "sự hiểu biết, lời nói và khả năng kết nối",
  "việc che chở cho người thân và giữ gìn nơi mình thuộc về",
  "việc được là chính mình giữa mọi người và tạo ra điều đáng nhớ",
  "sự hữu ích, tay nghề và độ chính xác",
  "những mối quan hệ cân bằng và cách mình đối xử công bằng với người",
  "khả năng nhìn tới tận gốc và đứng vững qua thay đổi",
  "niềm tin, tri thức và những chặng đường dài",
  "thành tựu bền bỉ và những trách nhiệm đảm đương được",
  "tư duy độc lập và những đóng góp cho một cộng đồng rộng hơn",
  "lòng trắc ẩn, trực giác và sức sáng tạo",
];
/** What each planet gives when it is the strong one. */
const GIFT: Record<GrahaId, string> = {
  sun: "ý chí và lòng tự trọng", moon: "đời sống cảm xúc và khả năng chăm sóc", mars: "sức bật và lòng can đảm",
  mercury: "trí óc linh hoạt và lời nói", jupiter: "hiểu biết, niềm tin và sự che chở", venus: "tình cảm, gu thẩm mỹ và sự hòa nhã",
  saturn: "kỷ luật và sức chịu đựng bền bỉ", rahu: "khát vọng vượt khỏi lối cũ", ketu: "khả năng tách khỏi điều đã quen để tìm về bên trong",
};

const SUN_IN: string[] = [
  "Mặt Trời đứng ngay trong nhà 1, nên bản ngã của bạn hiện ra thẳng và rõ: người ta nhận ra bạn qua ý chí và dáng đứng của chính bạn, và bạn khó giả vờ là một người khác.",
  "Mặt Trời ở nhà 2, nên lòng tự trọng gắn với việc bạn tự kiếm, tự giữ và với những lời bạn nói ra; gia đình gốc là nơi bạn học cách đứng vững.",
  "Mặt Trời ở nhà 3, nên bạn khẳng định mình bằng hành động cụ thể, bằng sự chủ động và lòng can đảm, và hay là người đi trước trong nhóm anh chị em hoặc bạn đồng lứa.",
  "Mặt Trời ở nhà 4, nên cái tôi của bạn bén rễ nơi nhà cửa và gia đình; bạn cần một chỗ thật sự thuộc về thì ý chí mới đứng thẳng được.",
  "Mặt Trời ở nhà 5, nên bản ngã của bạn sáng nhất khi sáng tạo, khi dạy dỗ và khi được yêu bằng sự chân thành; những việc bạn tự tay làm ra hay là niềm tự hào.",
  "Mặt Trời ở nhà 6, nhà của công việc hằng ngày, nên bạn tìm giá trị qua việc giải quyết và làm cho ra việc, và thường mạnh nhất khi có một vấn đề thật để vượt qua.",
  "Mặt Trời ở nhà 7, nên bạn thấy mình rõ nhất qua người đối diện; quan hệ đối tác là nơi bản ngã được thử, và bạn cần một người đồng hành đủ độc lập để không ai phải nhỏ lại.",
  "Mặt Trời ở nhà 8, nên bản ngã của bạn được rèn qua những chuyển biến sâu và những điều không phải ai cũng thấy; bạn thường hiểu mình đủ rõ sau những lần thay đổi lớn.",
  "Mặt Trời ở nhà 9, nên ý chí của bạn đứng trên niềm tin và lý tưởng; thầy học và người cha là những hình bóng định hình cách bạn nhìn mình, và bạn sáng nhất khi có điều lớn để theo.",
  "Mặt Trời ở nhà 10, nơi nó mạnh về vị thế, nên bản ngã của bạn gắn với sự nghiệp và trách nhiệm trước xã hội, và bạn muốn việc mình làm được nhìn nhận.",
  "Mặt Trời ở nhà 11, nên bạn tìm thấy mình trong thành quả và trong nhóm người cùng chí hướng; mục tiêu dài hạn và những người bạn có vị thế là chất liệu của lòng tự trọng.",
  "Mặt Trời ở nhà 12, nên bản ngã của bạn không phô ra ngoài mà lặn vào bên trong, và bạn có khuynh hướng làm nhiều hơn nói.",
];
const MOON_IN: string[] = [
  "Mặt Trăng ngay trong nhà 1, nên cảm xúc hiện ra trên gương mặt và cách bạn cư xử; người đối diện đọc được tâm trạng của bạn rất nhanh.",
  "Mặt Trăng ở nhà 2, nên cảm giác an toàn của bạn gắn với bữa cơm gia đình, khoản tiền để dành và những lời nói ấm áp.",
  "Mặt Trăng ở nhà 3, nên lòng bạn yên khi được làm, được viết, được kể, và khi có anh chị em hay bạn đồng lứa ở gần.",
  "Mặt Trăng ở nhà 4, nơi nó thoải mái nhất: nhà cửa, người mẹ và cảm giác thuộc về là nguồn nạp lại sức quan trọng bậc nhất của bạn.",
  "Mặt Trăng ở nhà 5, nên cảm xúc chảy vào sáng tạo, tình yêu và con trẻ; bạn nạp lại sức bằng những điều bạn làm vì thấy vui.",
  "Mặt Trăng ở nhà 6, nên tâm trạng dễ theo nhịp công việc và sức khỏe hằng ngày; nếp sinh hoạt đều đặn là chỗ neo của lòng bạn.",
  "Mặt Trăng ở nhà 7, nên bạn cảm nhận mình qua người đối diện; một mối quan hệ ổn định giữ cho tâm trạng bạn ổn.",
  "Mặt Trăng ở nhà 8, nên cảm xúc của bạn sâu, kín và biết nhớ; bạn cảm nhận rất rõ những điều không ai nói thành lời.",
  "Mặt Trăng ở nhà 9, nên lòng bạn yên khi có một niềm tin để dựa và khi được đi, được học điều mới.",
  "Mặt Trăng ở nhà 10, nên cảm xúc của bạn gắn với công việc và cách người ta nhìn mình; tâm trạng dễ lên xuống theo thành bại ngoài đời.",
  "Mặt Trăng ở nhà 11, nên bạn nạp lại sức qua bạn bè, nhóm người đồng điệu và những mục tiêu đang tiến gần.",
  "Mặt Trăng ở nhà 12, nên bạn cần những khoảng ở một mình, giấc ngủ đủ và nơi yên tĩnh để lòng được lắng lại; cảm xúc của bạn thường kín hơn người ta tưởng.",
];

// ------------------------------------------------------------------ the one sentence
// The sentence is not a frame with sign names swapped in. It is built from the two most salient signatures of the chart
// (a strong carrying planet, a dominant element, the area where planets gather, where the lord of the rising sign goes,
// a gap between the rising sign and the Moon, a sensitive Moon), and the frame is chosen by how those two relate.

interface Trait { key: string; s: number; kind: "gift" | "pull" | "tension"; clause: string }

// gift and pull traits are predicates that follow "Bạn là người …"; tension traits are full clauses that follow "dù …"
const PILLAR_CLAUSE: Record<string, string> = {
  sun: "có ý chí riêng và khó bị lay chuyển", moon: "nhạy cảm nhưng bền lòng hơn vẻ ngoài", mars: "đã quyết thì làm đến cùng",
  mercury: "nghĩ nhanh, nói rõ và học gì cũng mau", jupiter: "biết nhìn ra ý nghĩa ngay cả trong những lúc khó khăn",
  venus: "tinh tế, có gu và biết giữ hòa khí", saturn: "bền bỉ, làm chậm mà chắc",
};
const ELEMENT_CLAUSE: Record<Element, string> = {
  fire: "sống bằng nhiệt huyết và hành động nhanh", earth: "thực tế và tin vào những gì làm ra được",
  air: "hiểu đời qua trò chuyện và những câu hỏi", water: "cảm nhận trước rồi mới lý giải",
};
const AREA_CLAUSE: Record<string, string> = {
  self: "luôn muốn hiểu rõ mình là ai và mình thuộc về đâu", learn: "tìm thấy mình rõ nhất trong việc học, sáng tạo và niềm tin",
  bond: "hiểu mình nhiều nhất qua những người đồng hành", work: "thấy mình có giá trị khi được làm việc và đóng góp",
  depth: "sống sâu hơn nhiều so với những gì người khác nhìn thấy",
};

function traits(ctx: Ctx, f: Facts): Trait[] {
  const n = ctx.n, out: Trait[] = [];
  for (const id of f.order) {
    const p = f.planets[id];
    if (p.grade === "strong" && PILLAR_CLAUSE[id]) { out.push({ key: `p-${id}`, s: 2 + p.score * 0.3, kind: "gift", clause: PILLAR_CLAUSE[id] }); break; }
  }
  if (!ctx.noTime) for (const id of f.houses[0].occupants) { const p = f.planets[id]; if (isGood(p) && PILLAR_CLAUSE[id] && !out.some((x) => x.key === `p-${id}`)) out.push({ key: `p-${id}`, s: 2.9 + p.score * 0.2, kind: "gift", clause: PILLAR_CLAUSE[id] }); }
  const cnt: Record<Element, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  for (const id of SEVEN) cnt[ELEMENT_OF(n.grahas[id].sign)]++;
  if (!ctx.noTime) cnt[ELEMENT_OF(n.lagna.sign)]++;
  const topE = (Object.keys(cnt) as Element[]).sort((a, b) => cnt[b] - cnt[a])[0];
  if (cnt[topE] >= 4) out.push({ key: "el", s: 1.4 + (cnt[topE] - 4) * 0.4, kind: "gift", clause: ELEMENT_CLAUSE[topE] });
  if (!ctx.noTime) {
    const { total, byArea } = focusWeights(f);
    const ex = FOCUS_AREAS.map((a, i) => ({ a, e: byArea[i] / total - a.houses.length / 12 })).sort((x, y) => y.e - x.e)[0];
    if (ex.e >= 0.12) out.push({ key: "area", s: 1.5 + ex.e * 4, kind: "pull", clause: AREA_CLAUSE[ex.a.id] });
    const L = f.planets[SIGN_LORD[n.lagna.sign]];
    if (L.house && [6, 8, 12].includes(L.house)) out.push({ key: "ll", s: 1.6, kind: "tension", clause: "những gì có được thường đến sau một chặng tự rèn mà ít ai thấy" });
    else if (L.house && [1, 5, 9].includes(L.house) && isGood(L)) out.push({ key: "ll", s: 1.3, kind: "gift", clause: "đi đúng con đường của mình thì thường được nâng đỡ" });
    if (!ctx.uncertainMoon) {
      const eL = ELEMENT_OF(n.lagna.sign), eM = ELEMENT_OF(n.grahas.moon.sign);
      const apart = mod(n.grahas.moon.sign - n.lagna.sign, 12) + 1;
      if (eL !== eM && [6, 8, 12].includes(apart)) out.push({ key: "lm", s: 1.7, kind: "tension", clause: "điều bạn cần trong lòng không hẳn giống với hình ảnh bạn tạo ra" });
    }
  }
  const m = f.planets.moon;
  if (!ctx.uncertainMoon && (m.grade === "weak" || m.aspectedBy.includes("saturn") || m.conj.includes("saturn") || m.conj.includes("rahu") || m.conj.includes("ketu")))
    out.push({ key: "moon", s: 1.5, kind: "tension", clause: "lòng bạn nhạy hơn những gì bạn để lộ ra" });
  return out.sort((a, b) => b.s - a.s);
}

export function headline(ctx: Ctx, f: Facts): string {
  const t = traits(ctx, f);
  if (!t.length) return "Bạn là người không dồn hết sức về một phía, và điều làm nên bạn nằm ở cách bạn chọn đặt tâm sức vào đâu.";
  const gifts = t.filter((x) => x.kind !== "tension"), tens = t.filter((x) => x.kind === "tension");
  const a = gifts[0], b = gifts.find((x) => x !== a), h = tens[0];
  if (!a) return `Bạn là người sống khá kín đáo, dù ${h.clause}.`;
  if (h && (!b || h.s >= b.s)) return `Bạn là người ${a.clause}, dù ${h.clause}.`;
  if (b) return `Bạn là người ${a.clause}, và ${b.clause}.`;
  return `Bạn là người ${a.clause}.`;
}

// ------------------------------------------------------------------ the rising sign, the Sun, the Moon

const area = (h: number) => HOUSE_TAG[h - 1];
const HOUSE_CLASS = (h: number) => (h === 1 ? "self" : [4, 7, 10].includes(h) ? "kendra" : [5, 9].includes(h) ? "trikona" : [6, 8, 12].includes(h) ? "dusthana" : [2, 11].includes(h) ? "dhana" : "upachaya");
/** The house-number sentences of SUN_IN / MOON_IN, said through the area instead of the number. */
const viaArea = (s: string) => s.replace(/ngay trong nhà 1/g, "ngay trong cung mọc").replace(/ở nhà (\d+)(, (nhà|nơi) [^,]+)?/g, (_m, h) => `ở vùng ${area(Number(h))}`);

function gradeClause(p: PlanetFact): string {
  const nm = nameOf(p.id);
  switch (p.grade) {
    case "strong": return `${nm} lại đang đứng rất vững`;
    case "good": return `${nm} đứng khá vững`;
    case "weak": return `${nm} đang ở thế yếu, nên phần này thường thành hình chậm, qua trải nghiệm`;
    default: return `${nm} ở thế vừa phải`;
  }
}

function lagnaLordSentence(f: Facts, lag: number): string {
  const L = SIGN_LORD[lag], p = f.planets[L], h = p.house!, nm = nameOf(L);
  const cls = HOUSE_CLASS(h);
  const lead: Record<string, string> = {
    self: `${nm}, hành tinh cai quản cung mọc, nằm ngay trong cung mọc, nên sức sống và hướng đi của bạn tụ về chính bản thân`,
    kendra: `${nm}, hành tinh cai quản cung mọc, đi về vùng ${area(h)}, nên đây là nơi bạn đặt nhiều tâm sức và dễ thấy mình được là mình`,
    trikona: `${nm}, hành tinh cai quản cung mọc, đi về vùng ${area(h)}, một vùng được truyền thống coi là phúc phần, nên con đường của bạn hay đi qua đó`,
    dusthana: `${nm}, hành tinh cai quản cung mọc, đi về vùng ${area(h)}, một vùng nhiều thử thách, nên bạn thường trưởng thành qua chính chuyện ấy`,
    dhana: `${nm}, hành tinh cai quản cung mọc, đi về vùng ${area(h)}, nên chuyện này gắn với cảm giác của bạn về giá trị bản thân`,
    upachaya: `${nm}, hành tinh cai quản cung mọc, đi về vùng ${area(h)}, một vùng càng rèn càng vững`,
  };
  return `${lead[cls]}; ${gradeClause(p)}.`;
}

function conjNote(f: Facts, id: GrahaId): string | null {
  const p = f.planets[id];
  const mate = p.conj.find((o) => conjOf(id, o) && o !== "sun" && o !== "moon");
  if (!mate) return null;
  const c = conjOf(id, mate)!;
  return `${nameOf(id)} đứng cùng cung với ${nameOf(mate)}: thường có ${c.gift}, kèm điều cần để ý là ${c.care}.`;
}

const elRel = (a: Element, b: Element): "same" | "friend" | "tension" => a === b ? "same" : (a === "fire" && b === "air") || (a === "air" && b === "fire") || (a === "earth" && b === "water") || (a === "water" && b === "earth") ? "friend" : "tension";

function lagnaBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const n = ctx.n;
  const lag = n.lagna.sign;
  const paras = [LAGNA_SIGN[lag]];
  const L = SIGN_LORD[lag];
  const tenant = f.houses[0].occupants.filter((o) => o !== L);
  if (tenant.length === 1) paras.push(`Trong chính cung mọc có ${nameOf(tenant[0])}, nên cách bạn xuất hiện mang thêm ${lowerFirst(GIFT[tenant[0]])}.`);
  else if (tenant.length === 2) paras.push(`Trong chính cung mọc có ${joinVi(tenant.map(nameOf))}, nên cách bạn xuất hiện mang thêm ${lowerFirst(GIFT[tenant[0]])}, cùng với ${lowerFirst(GIFT[tenant[1]])}.`);
  else if (tenant.length > 2) paras.push(`Trong chính cung mọc có tới ${tenant.length} hành tinh (${joinVi(tenant.map(nameOf))}), nên con người bạn hiện ra rất đậm ngay từ lần gặp đầu; mỗi hành tinh góp một nét, và trang Nhà 1 kể kỹ từng nét.`);
  return {
    id: "lagna", title: "Cung mọc", role: "cách bạn tiếp cận cuộc sống và hình ảnh bên ngoài", sign: SIGNS[lag], paragraphs: paras,
    why: [
      `Cung mọc ${SIGNS[lag]} ${fmtDeg(n.lagna.deg)}, chòm sao ${nakName(n.lagna.nak.name)} pada ${n.lagna.nak.pada}.`,
      `Chủ cung mọc ${nameOf(L)}: ${SIGNS[f.planets[L].sign]} ${fmtDeg(f.planets[L].g.deg)}, nhà ${f.planets[L].house}, ${DIGNITY_VI[f.planets[L].dignity].toLowerCase()}${f.planets[L].sb ? `, Shadbala ${Math.round(f.planets[L].sb!.ratio * 100)}% mức cần có` : ""}.`,
      ...(tenant.length ? [`Hành tinh trong nhà 1: ${joinVi(tenant.map(nameOf))}.`] : []),
    ],
  };
}

function sunBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const n = ctx.n, sun = f.planets.sun;
  const paras = [SUN_SIGN[sun.sign]];
  if (sun.house) paras.push(viaArea(SUN_IN[sun.house - 1]));
  if (sun.dignity === "exalted" || sun.dignity === "own" || sun.dignity === "moolatrikona") paras.push(SUN_DIGNITY.strong);
  else if (sun.dignity === "debilitated") paras.push(SUN_DIGNITY.weak);
  if (!ctx.noTime) {
    const r = elRel(ELEMENT_OF(n.lagna.sign), ELEMENT_OF(sun.sign));
    paras.push(r === "same" ? "Cung mọc và Mặt Trời cùng một nguyên tố, nên cách bạn xuất hiện và điều bạn muốn khẳng định thường đi cùng một hướng." : r === "friend" ? "Cung mọc và Mặt Trời thuộc hai nguyên tố hợp nhau, nên cách bạn bước vào việc thường mở đường cho điều bạn muốn khẳng định." : "Cung mọc và Mặt Trời thuộc hai nguyên tố khác nhịp, nên ấn tượng đầu tiên bạn tạo ra có thể khác với điều bạn thật sự muốn được nhận ra.");
  }
  const c = conjNote(f, "sun");
  if (c) paras.push(c);
  return {
    id: "sun", title: "Mặt Trời", role: "bản ngã, ý chí và nhận thức về bản thân", sign: SIGNS[sun.sign], paragraphs: paras,
    why: [
      `Mặt Trời ${SIGNS[sun.sign]} ${fmtDeg(sun.g.deg)}${sun.house ? `, nhà ${sun.house}` : ""}, chòm sao ${nakName(sun.g.nak.name)} pada ${sun.g.nak.pada}; ${DIGNITY_VI[sun.dignity].toLowerCase()}.`,
      sun.sb ? `Shadbala ${Math.round(sun.sb.ratio * 100)}% mức cần có.` : "",
      ctx.noTime ? "" : `Nguyên tố: cung mọc ${ELEMENT_VI[ELEMENT_OF(n.lagna.sign)]}, Mặt Trời ${ELEMENT_VI[ELEMENT_OF(sun.sign)]}.`,
    ].filter(Boolean),
  };
}

/** The Sun and the Moon read together, by the degrees between them and the houses they take, not by element alone. */
function sunMoonLine(ctx: Ctx, f: Facts): { text: string; why: string } | null {
  if (ctx.uncertainMoon) return null;
  const n = ctx.n, e = mod(n.grahas.moon.lon - n.grahas.sun.lon, 360), gap = Math.min(e, 360 - e);
  const same = n.grahas.moon.sign === n.grahas.sun.sign;
  const d = mod(n.grahas.moon.sign - n.grahas.sun.sign, 12) + 1;
  let text: string;
  if (same && gap < 12) text = "Ý chí và cảm xúc của bạn thường chụm về một hướng; có điều, bạn đôi khi khó tách điều mình thật sự cần ra khỏi điều mình thấy phải làm.";
  else if (same) text = "Điều bạn muốn và điều bạn cần đến từ cùng một chất liệu, nên khi giằng co, bạn thường giằng co về cùng một chuyện.";
  else if (d === 7) text = "Bạn thường thấy rõ cả hai phía của một việc, và cũng hay bị kéo giữa điều mình muốn khẳng định với điều lòng mình cần.";
  else if (d === 6 || d === 8) text = "Điều bạn muốn thể hiện và điều bạn cần để yên lòng không tự gặp nhau, nên bạn thường phải chủ động dung hòa hai phía ấy.";
  else if (d === 5 || d === 9) text = "Ý chí và cảm xúc của bạn có xu hướng nâng đỡ nhau hơn là cản nhau.";
  else text = "";
  return { text, why: `Mặt Trăng cách Mặt Trời ${gap.toFixed(1)}°; tính theo cung, Mặt Trăng ở cung thứ ${d} từ Mặt Trời.` };
}

function moonBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const moon = f.planets.moon;
  const paras: string[] = [];
  if (ctx.uncertainMoon) paras.push("Trong ngày bạn sinh, Mặt Trăng đi sang một cung khác, nên khi chưa có giờ sinh mình chỉ đọc phần chắc chắn là chòm sao và nhịp chung của nó.");
  else paras.push(MOON_SIGN[moon.sign]);
  paras.push(`${fill(MOON_NAK_LEAD, { nak: nakName(moon.g.nak.name) })} ${NAKSHATRA_TEXT[moon.g.nak.index]}`);
  if (moon.house && !ctx.uncertainMoon) paras.push(viaArea(MOON_IN[moon.house - 1]));
  const sm = sunMoonLine(ctx, f);
  const c = conjNote(f, "moon");
  if (c) paras.push(c);
  return {
    id: "moon", title: "Mặt Trăng", role: "tâm trí, cảm xúc và nhu cầu an toàn", sign: ctx.uncertainMoon ? undefined : SIGNS[moon.sign], paragraphs: paras,
    why: [
      `Mặt Trăng ${SIGNS[moon.sign]} ${fmtDeg(moon.g.deg)}${moon.house ? `, nhà ${moon.house}` : ""}, chòm sao ${nakName(moon.g.nak.name)} pada ${moon.g.nak.pada}, chủ chòm sao là ${nameOf(moon.g.nak.lord)}.`,
      moon.sb ? `Shadbala ${Math.round(moon.sb.ratio * 100)}% mức cần có.` : "",
      sm ? sm.why : "",
    ].filter(Boolean),
  };
}

// ------------------------------------------------------------------ the three keystones in one block, read together

const q = (m: string) => `“${m}”`;
/** One paragraph that names the three portraits, so the reader knows what the next three cards are about. */
const COUNT_VI = ["", "Bức chân dung", "Hai bức chân dung", "Ba bức chân dung"];
function motifLine(ctx: Ctx): string {
  const n = ctx.n, sun = n.grahas.sun.sign, moon = n.grahas.moon.sign;
  const lag = ctx.noTime ? null : n.lagna.sign;
  const out: string[] = [];
  const shown = [lag !== null, true, !ctx.uncertainMoon].filter(Boolean).length;
  const shared = [lag, sun, ctx.uncertainMoon ? null : moon].filter((x) => x !== null);
  if (shared.length === 3 && new Set(shared).size === 1) {
    out.push(`Cung mọc, Mặt Trời và Mặt Trăng của bạn cùng ở ${SIGNS[sun]}: ${q(LAGNA_PORTRAIT[sun].motif)}. Khi ba điểm gốc cùng một cung, chất của cung ấy hiện ra rất đậm, nên ba bức chân dung dưới đây không nhắc lại nhau mà mỗi bức chỉ giữ phần riêng của mình: cách bạn bước vào đời, điều bạn sống vì nó, và điều lòng bạn cần.`);
    return out.join(" ");
  }
  if (lag !== null) out.push(`Người khác gặp bạn trước hết qua cung mọc ${SIGNS[lag]}: ${q(LAGNA_PORTRAIT[lag].motif)}.`);
  out.push(lag === sun ? `Mặt Trời cũng ở ${SIGNS[sun]}, nên điều bạn sống vì nó đi cùng một chất với cách bạn xuất hiện.` : `Điều bạn sống vì nó nằm ở Mặt Trời ${SIGNS[sun]}: ${q(SUN_PORTRAIT[sun].motif)}.`);
  if (!ctx.uncertainMoon) out.push(moon === sun || moon === lag ? `Mặt Trăng cũng ở ${SIGNS[moon]}, nên điều lòng bạn cần không xa với điều người khác thấy ở bạn.` : `Còn điều lòng bạn cần nằm ở Mặt Trăng ${SIGNS[moon]}: ${q(MOON_PORTRAIT[moon].motif)}.`);
  out.push(shown === 1 ? "Bức chân dung dưới đây kể điều ấy." : `${COUNT_VI[shown]} dưới đây kể lần lượt từng điều.`);
  return out.join(" ");
}
/** How the three sit together, by element: agreement or a gap the reader will recognise. */
function triadLine(ctx: Ctx): string {
  if (ctx.uncertainMoon) return "";
  const n = ctx.n, el = (s: number) => ELEMENT_VI[ELEMENT_OF(s)].toLowerCase();
  const sun = n.grahas.sun.sign, moon = n.grahas.moon.sign;
  const out = [fill(TRIAD_LINE.sunMoon[elRel(ELEMENT_OF(sun), ELEMENT_OF(moon))], { a: el(sun), b: el(moon) })];
  return out.join(" ");
}

function keysBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const n = ctx.n, sun = f.planets.sun, moon = f.planets.moon;
  const paras: string[] = [];
  const self = `nhìn nhận giá trị của mình qua ${SELF[sun.sign]}`;
  const heart = ctx.uncertainMoon ? "" : `bên trong, bạn ${HEART[moon.sign]}`;
  // The effort line and the Sun–Moon lines are said once, in the letter (readLetter); this block only names the portraits.
  paras.push(motifLine(ctx));
  if (!ctx.uncertainMoon) {
    const nak = NAKSHATRA_TEXT[moon.g.nak.index].split(": ").slice(1).join(": ");
    if (nak) paras.push(`Về cảm xúc, ${nak}`);
  }
  void n;
  const signs = [...(ctx.noTime ? [] : [{ label: "Cung mọc", sign: n.lagna.sign }]), { label: "Mặt Trời", sign: sun.sign }, ...(ctx.uncertainMoon ? [] : [{ label: "Mặt Trăng", sign: moon.sign }])];
  return {
    id: "keys", title: "Cung mọc, Mặt Trời và Mặt Trăng", role: "cách bạn bước vào đời, điều bạn muốn khẳng định và điều lòng bạn cần", paragraphs: paras, meta: { signs },
    facts: [ctx.noTime ? "" : `Chủ cung mọc: ${nameOf(SIGN_LORD[n.lagna.sign])} ở nhà ${f.planets[SIGN_LORD[n.lagna.sign]].house}`, ctx.uncertainMoon ? "" : `Mặt Trăng ở chòm sao ${nakName(moon.g.nak.name)}`].filter(Boolean).join(" · "),
    why: [...(ctx.noTime ? [] : lagnaBlock(ctx, f).why), ...sunBlock(ctx, f).why, ...moonBlock(ctx, f).why].filter((x, i, a) => a.indexOf(x) === i),
  };
}

// ------------------------------------------------------------------ elements, moon cycle

const EL_MORE: Record<Element, string> = {
  fire: "Lửa đậm nhất: bạn có xu hướng khởi động nhanh, cần thấy mình đang tiến lên, và mệt nhất khi phải chờ lâu mà không được làm gì.",
  earth: "Đất đậm nhất: bạn có xu hướng tin vào điều cụ thể, đo được, và thường chọn cách chắc chắn trước cách nhanh.",
  air: "Khí đậm nhất: bạn có xu hướng nghĩ thành lời, cần trao đổi để hiểu chính mình, và dễ chán khi không có điều mới để suy nghĩ.",
  water: "Nước đậm nhất: bạn có xu hướng cảm trước rồi mới hiểu, nhạy với không khí quanh mình, và cần thời gian để cảm xúc lắng xuống.",
};
const EL_LOW: Record<Element, string> = {
  fire: "Lửa ít được nhấn mạnh, nên sự hăng hái ở bạn thường cần một lý do rõ ràng mới bùng lên",
  earth: "Đất ít được nhấn mạnh, nên nhịp sinh hoạt đều đặn là thứ bạn phải tự dựng hơn là có sẵn",
  air: "Khí ít được nhấn mạnh, nên bạn thường hiểu một việc bằng cách làm hoặc cảm nhận hơn là bàn luận",
  water: "Nước ít được nhấn mạnh, nên cảm xúc của bạn hay đi qua lý trí trước khi được nói ra",
};

function elementsBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const n = ctx.n;
  const by: Record<Element, GrahaId[]> = { fire: [], earth: [], air: [], water: [] };
  for (const id of SEVEN) by[ELEMENT_OF(n.grahas[id].sign)].push(id);
  const counts: Record<Element, number> = { fire: by.fire.length, earth: by.earth.length, air: by.air.length, water: by.water.length };
  if (!ctx.noTime) counts[ELEMENT_OF(n.lagna.sign)]++;
  const order = (["fire", "earth", "air", "water"] as Element[]);
  const top = [...order].sort((a, b) => counts[b] - counts[a] || order.indexOf(a) - order.indexOf(b));
  const paras: string[] = [];
  const spread = counts[top[0]] - counts[top[3]];
  if (spread <= 1) paras.push("Bốn nguyên tố trong lá số của bạn khá cân, không nguyên tố nào lấn át. Bạn vì thế có thể đổi cách tiếp cận theo hoàn cảnh, và ít bị kéo về một thói quen duy nhất.");
  else {
    paras.push(EL_NB[top[0]].more);
    if (counts[top[1]] === counts[top[0]]) paras.push(EL_NB[top[1]].more);
    const low = top.filter((e) => counts[e] <= Math.max(0, counts[top[0]] - 3)).slice(-1)[0];
    if (low) paras.push(EL_NB[low].less);
  }
  return {
    id: "elements", title: "Bốn nguyên tố: Lửa, Đất, Khí, Nước", paragraphs: paras, meta: { elements: counts },
    why: [order.map((e) => `${ELEMENT_VI[e]} ${counts[e]}`).join(" · ") + (ctx.noTime ? " (bảy hành tinh)" : " (bảy hành tinh và cung mọc)"),
      ...order.map((e) => `${ELEMENT_VI[e]}: ${by[e].length ? joinVi(by[e].map(nameOf)) : "không có hành tinh"}${!ctx.noTime && ELEMENT_OF(n.lagna.sign) === e ? ", cung mọc" : ""}.`)],
  };
}

function moonCycleBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const n = ctx.n;
  const e = mod(n.grahas.moon.lon - n.grahas.sun.lon, 360);
  const tithi = Math.floor(e / 12) + 1;
  const bright = tithi <= 15;
  const k = bright ? tithi : tithi - 15;
  const dark = Math.min(e, 360 - e) < 72; // within 72° of the Sun: weak in paksha bala by the classical rule
  const moon = f.planets.moon;
  const help = moon.aspectedBy.includes("jupiter") || moon.conj.includes("jupiter") || ["exalted", "own", "moolatrikona"].includes(moon.dignity);
  const paras: string[] = [];
  const pos = tithi === 15 ? "đúng ngày rằm" : tithi === 30 ? "đúng ngày trăng non" : `ngày thứ ${k} của nửa tháng trăng ${bright ? "đang tròn dần" : "đang khuyết dần"}`;
  paras.push(`Bạn sinh vào ${pos}. ${bright ? "Trăng đang lớn thường đi với nhu cầu hướng ra ngoài: muốn thử, muốn mở rộng, muốn được đáp lại." : "Trăng đang khuyết thường đi với nhu cầu lắng lại: chắt lọc, giữ cho mình những gì thật sự cần."}`);
  if (dark) paras.push(help ? "Lúc ấy trăng còn mỏng, nhưng những yếu tố khác trong lá số giữ cho tâm trí bạn khá vững." : "Lúc ấy trăng còn mỏng, nên cảm xúc của bạn dễ chịu ảnh hưởng của mệt mỏi và hoàn cảnh; giấc ngủ và những khoảng nghỉ quan trọng với bạn hơn với nhiều người.");
  else paras.push("Lúc ấy trăng đã khá sáng, một điều kiện thuận cho sự ổn định của tâm trí.");
  return {
    id: "moonCycle", title: "Chu kỳ trăng", paragraphs: paras, meta: { elong: e }, facts: `Tithi ${tithi}/30 · ${bright ? "Shukla Paksha (trăng tròn dần)" : "Krishna Paksha (trăng khuyết dần)"}`,
    why: [`Khoảng cách Mặt Trăng–Mặt Trời ${e.toFixed(1)}°, tithi thứ ${tithi}/30, ${bright ? "Shukla Paksha" : "Krishna Paksha"} (${phaseName(e).toLowerCase()}).`,
      `Paksha Bala: Mặt Trăng cách Mặt Trời ${Math.min(e, 360 - e).toFixed(0)}° (${dark ? "dưới 72°, ánh sáng ít" : "trên 72°, đủ sáng"}).`,
      help ? "Có yếu tố bù: Mặt Trăng được Sao Mộc nhìn hoặc đi cùng, hoặc ở cung mạnh." : ""].filter(Boolean),
  };
}

// ------------------------------------------------------------------ the planets that carry the chart
// Strength and benefit are kept apart: a planet can be strong and still carry the matters of difficult houses.

const CAPACITY: Record<GrahaId, string> = {
  sun: "khả năng tự đứng ra, chịu trách nhiệm và giữ lập trường", moon: "sự nhạy cảm với người và khả năng chăm sóc",
  mars: "sức bật, sự quyết đoán và khả năng xử lý việc khó", mercury: "khả năng phân tích, diễn đạt và học nhanh",
  jupiter: "khả năng hiểu sâu, dạy lại và nhìn ra hướng đi", venus: "khả năng tạo hòa khí và cảm nhận thẩm mỹ",
  saturn: "sức bền, sự kỷ luật và khả năng làm việc dài hơi", rahu: "khát vọng vượt khỏi lối cũ", ketu: "khả năng tách khỏi điều đã quen",
};

function pillarsBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const seven = f.order.filter((id) => id !== "rahu" && id !== "ketu");
  const weight = (id: GrahaId) => { const p = f.planets[id]; let w = p.score; if (p.role === "yogakaraka") w += 0.8; if (p.role === "lagna") w += 0.5; if (f.n.yogas.some((y) => y.grahas.includes(id) && y.strength !== "weak" && y.tone === "good")) w += 0.4; return w; };
  const pillars = seven.filter((id) => isGood(f.planets[id])).sort((a, b) => weight(b) - weight(a)).slice(0, 2);
  const paras: string[] = [];
  if (!pillars.length) paras.push("Lá số của bạn không có một điểm tựa nào nổi trội hẳn; sức được chia khá đều, nên điều bạn phát triển được thường đến từ việc chọn và luyện một hướng cụ thể.");
  let saidAmb = 0;
  void saidAmb;
  pillars.forEach((id, i) => {
    const t = PLANET_NB[id];
    if (i === 0) paras.push(t ? `${nameOf(id)} là hành tinh hoạt động mạnh nhất trong lá số của bạn. ${t}` : `Điểm tựa lớn nhất của bạn là ${CAPACITY[id]}.`);
    else paras.push(t ? `Kế đó là ${nameOf(id)}. ${t.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ")}` : `Kế đó là ${CAPACITY[id]}.`);
  });
  return {
    id: "pillars", title: "Những hành tinh hoạt động mạnh", paragraphs: paras, meta: { planets: pillars },
    facts: pillars.map((id) => `${nameOf(id)}: ${DIGNITY_VI[f.planets[id].dignity].toLowerCase()}${f.planets[id].sb ? `, sức mạnh ${Math.round(f.planets[id].sb!.ratio * 100)}%` : ""}`).join(" · "),
    why: [
      ...seven.map((id) => { const p = f.planets[id]; return `${nameOf(id)}: ${DIGNITY_VI[p.dignity]}${p.sb ? `, Shadbala ${Math.round(p.sb.ratio * 100)}%` : ""}${p.g.digBala ? ", Dig Bala" : ""}${p.g.vargottama ? ", Vargottama" : ""}${p.g.combust ? ", cháy sáng" : ""}${!ctx.noTime && p.lorded.length ? `, cai quản nhà ${p.lorded.join(", ")}` : ""}.`; }),
      "Chọn trụ cột theo phẩm vị, Shadbala, vai trò chức năng (yogakaraka, chủ cung mọc) và việc tham gia yoga thuận; không theo thứ hạng Shadbala đơn thuần.",
      ...(ctx.sb ? [] : ["Chưa có giờ sinh nên chưa tính được Shadbala; mức vững dựa vào vị thế trong cung."]),
    ],
  };
}

// ------------------------------------------------------------------ the areas that stand out

export const FOCUS_AREAS: { id: string; title: string; houses: number[]; says: string }[] = [
  { id: "self", title: "Bản thân và gia đình", houses: [1, 2, 4], says: "chuyện của chính bạn, tiền bạc, lời nói, nhà cửa và những người thân nhất" },
  { id: "learn", title: "Học hỏi, sáng tạo và niềm tin", houses: [3, 5, 9], says: "việc tự tay làm và học, sáng tạo, con cái, thầy học và những điều bạn tin" },
  { id: "bond", title: "Tình cảm và hợp tác", houses: [7], says: "người đồng hành, hôn nhân và những mối hợp tác" },
  { id: "work", title: "Sự nghiệp, công việc và bạn bè", houses: [6, 10, 11], says: "công việc hằng ngày, sự nghiệp, thu nhập, bạn bè và những mục tiêu dài hạn" },
  { id: "depth", title: "Chiều sâu và buông bỏ", houses: [8, 12], says: "những biến chuyển lớn, điều giữ kín, những lúc ở một mình và sự buông bỏ" },
];

export function focusWeights(f: Facts): { total: number; byHouse: number[]; byArea: number[] } {
  const byHouse = Array(12).fill(0) as number[];
  for (const id of GRAHAS) {
    const p = f.planets[id];
    let w = id === "rahu" || id === "ketu" ? 0.6 : 1;
    if (id === "sun" || id === "moon") w += 0.4;
    if (isSeven(id) && isGood(p)) w += 0.4;
    byHouse[p.house! - 1] += w;
  }
  const L = f.planets[SIGN_LORD[f.n.lagna.sign]];
  byHouse[L.house! - 1] += 0.6;
  // a house looked at by several planets also draws attention
  for (const h of f.houses) byHouse[h.n - 1] += Math.min(h.aspects.length, 3) * 0.25;
  const total = byHouse.reduce((a, b) => a + b, 0);
  const byArea = FOCUS_AREAS.map((a) => a.houses.reduce((s, h) => s + byHouse[h - 1], 0));
  return { total, byHouse, byArea };
}

function focusBlock(ctx: Ctx, f: Facts): { block: OverviewBlock; share: Overview["focusShare"] } {
  const { total, byHouse, byArea } = focusWeights(f);
  const share = FOCUS_AREAS.map((a, i) => ({ title: a.title, houses: a.houses, pct: Math.round((byArea[i] / total) * 100) }));
  const scored = FOCUS_AREAS.map((a, i) => ({ a, i, excess: byArea[i] / total - a.houses.length / 12 })).sort((x, y) => y.excess - x.excess);
  const lead = scored.filter((s) => s.excess >= 0.08).slice(0, 2);
  const planetsIn = (hs: number[]) => GRAHAS.filter((id) => hs.includes(f.planets[id].house!));
  const paras: string[] = [];
  if (!lead.length) paras.push("Lá số của bạn trải khá đều qua nhiều mảng đời sống, không dồn về một vùng nào; trọng tâm thường đổi theo từng giai đoạn.");
  lead.forEach((s, k) => {
    const ids = planetsIn(s.a.houses);
    const strongHere = ids.filter((id) => isSeven(id) && isGood(f.planets[id]));
    const tail = strongHere.length >= 2 ? ", và đây cũng là nơi bạn có nhiều điểm mạnh" : strongHere.length ? ", và bạn có điểm mạnh ở đây" : ", dù ở đây việc thường nhiều hơn thuận lợi";
    paras.push(k === 0 ? (AREA_NB[s.a.id] ? `Lá số của bạn dồn nhiều sức nặng vào ${s.a.says}. ${AREA_NB[s.a.id]}` : `Cuộc sống của bạn xoay nhiều nhất quanh ${s.a.says}${tail}.`) : `Kế đó là ${s.a.says}.`);
  });
  const L = f.planets[SIGN_LORD[f.n.lagna.sign]];
  const ex = f.houses.find((h) => h.lordHouse !== h.n && f.houses[h.lordHouse - 1].lordHouse === h.n && h.n < h.lordHouse);
  if (ex) paras.push(`Chuyện ${area(ex.n)} của bạn hay đi cùng chuyện ${area(ex.lordHouse)}: ${AREA_EXAMPLE[ex.lordHouse - 1]}.`);
  void L;
  return {
    block: {
      id: "focus", title: "Những lĩnh vực nổi trội trong cuộc sống", paragraphs: paras,
      facts: lead.map((x) => `${x.a.title}: ${planetsIn(x.a.houses).map(nameOf).join(", ") || "không có hành tinh"}`).join(" · "),
      why: [
        ...FOCUS_AREAS.map((a, i) => `${a.title} (nhà ${a.houses.join(", ")}): ${Math.round((byArea[i] / total) * 100)}% trọng lượng, ${planetsIn(a.houses).length ? joinVi(planetsIn(a.houses).map(nameOf)) : "không có hành tinh"}.`),
        "Trọng lượng: mỗi hành tinh 1 (Rahu, Ketu 0,6; Mặt Trời, Mặt Trăng +0,4; hành tinh đứng vững +0,4), chủ cung mọc +0,6 ở nhà nó đứng, mỗi góc chiếu vào nhà +0,25 (tối đa 3).",
        `Chi tiết từng nhà: ${byHouse.map((w, i) => `${i + 1}: ${w.toFixed(1)}`).join(" · ")}.`,
        ...(ex ? [`Hoán đổi chủ nhà: nhà ${ex.n} và nhà ${ex.lordHouse}.`] : []),
      ],
    },
    share,
  };
}

// ------------------------------------------------------------------ assembling

export function readPlanets(ctx: Ctx): PlanetRow[] {
  const n = ctx.n;
  const sa: Record<GrahaId, string> = { sun: "Surya", moon: "Chandra", mars: "Mangala", mercury: "Budha", jupiter: "Guru", venus: "Shukra", saturn: "Shani", rahu: "Rahu", ketu: "Ketu" };
  return GRAHAS.map((id) => {
    const g = n.grahas[id];
    let note: string | null = null;
    if (ctx.sb && isSeven(id)) {
      const p = ctx.sb.planets[id];
      note = `Shadbala ${Math.round(p.ratio * 100)}% mức cần có (hạng ${p.rank}/7). Ishta ${Math.round(p.ishta)}/60, Kashta ${Math.round(p.kashta)}/60: ${p.ishta >= p.kashta ? "phần nâng đỡ nhỉnh hơn phần thử thách" : "phần thử thách nhỉnh hơn phần nâng đỡ"}.`;
    }
    return {
      id, name: nameOf(id), sanskrit: sa[id], sign: SIGNS[g.sign], deg: fmtDeg(g.deg), house: ctx.noTime ? null : g.house,
      nakshatra: nakName(g.nak.name), pada: g.nak.pada, nakLord: nameOf(g.nak.lord), nakText: NAKSHATRA_TEXT[g.nak.index],
      dignity: DIGNITY_VI[g.dignity], flags: planetFlags(n, id), navamsa: SIGNS[g.navamsaSign], strengthNote: note,
    };
  });
}

export function readLetter(ctx: Ctx): Letter {
  const f = buildFacts(ctx), n = ctx.n;
  const chips = [
    ...(ctx.noTime ? [] : [{ label: "Cung mọc", value: SIGNS[n.lagna.sign], role: "cách bạn tiếp cận cuộc sống" }]),
    { label: "Mặt Trời", value: SIGNS[n.grahas.sun.sign], role: "bản ngã và ý chí" },
    ...(ctx.uncertainMoon ? [] : [{ label: "Mặt Trăng", value: SIGNS[n.grahas.moon.sign], role: "tâm trí và cảm xúc" }]),
  ];
  const body = letterBody(ctx, f);
  return { greeting: `Gửi ${greetName(ctx.name)},`, line: headline(ctx, f), paras: usesPairs(ctx) ? [] : body.paras, why: body.why, chips };
}

const CLOSE: string[] = [
  "Các trang sau đi vào từng mảng đời. Bạn có thể đọc theo thứ tự, hoặc bắt đầu từ mảng mình đang băn khoăn nhất.",
  "Những trang tiếp theo đi chậm hơn, từng mảng một. Không cần đọc hết một lần; chỗ nào chạm vào điều bạn đang nghĩ, hãy dừng lại ở đó.",
  "Phần còn lại của bài đọc mở từng mảng đời ra. Bạn cứ đọc theo nhịp của mình, và giữ lại những gì thấy đúng với mình.",
];

/** The letter under the headline: where the chart puts its effort (from the lord of the rising sign), the main pull between
 *  the Sun and the Moon, and a closing line. Each of these is said only here, not again in the cards below. */
function letterBody(ctx: Ctx, f: Facts): { paras: string[]; why: string[] } {
  const n = ctx.n, paras: string[] = [], why: string[] = [];
  if (!ctx.noTime) {
    const lag = n.lagna.sign, L = SIGN_LORD[lag], p = f.planets[L];
    const where = p.house === 1 ? "Phần lớn tâm sức của bạn dồn vào chính con đường riêng của mình" : `Phần lớn tâm sức của bạn đổ vào chuyện ${area(p.house!)}`;
    const cond = p.grade === "weak" ? ", và ở đó kết quả thường đến chậm, qua nhiều lần tự rèn" : p.grade === "strong" ? ", và đó cũng là nơi bạn có nhiều điểm tựa nhất" : "";
    paras.push(`${where}${cond}.`);
    why.push(`${lagnaLordSentence(f, lag)}`, `Chủ cung mọc ${nameOf(L)}: ${SIGNS[p.sign]} ${fmtDeg(p.g.deg)}, nhà ${p.house}, ${DIGNITY_VI[p.dignity].toLowerCase()}${p.sb ? `, Shadbala ${Math.round(p.sb.ratio * 100)}% mức tối thiểu của BPHS` : ""}.`);
  }
  if (!ctx.uncertainMoon) {
    const sm = sunMoonLine(ctx, f), triad = triadLine(ctx);
    // with the pair reading below, the Sun–Moon relation is told there, so the letter does not say it first
    const t = usesPairs(ctx) ? "" : [triad, sm ? sm.text : ""].filter(Boolean).join(" ");
    if (t) paras.push(t);
    if (sm) why.push(sm.why);
    why.push(`Nguyên tố: Mặt Trời ${SIGNS[n.grahas.sun.sign]} (${ELEMENT_VI[ELEMENT_OF(n.grahas.sun.sign)]}), Mặt Trăng ${SIGNS[n.grahas.moon.sign]} (${ELEMENT_VI[ELEMENT_OF(n.grahas.moon.sign)]}).`);
    const md = n.grahas.moon.deg;
    if (md < 1 || md > 29) why.push(`Mặt Trăng ở ${fmtDeg(md)} trong cung, sát ranh giới cung. Life Atlas dùng ayanamsa Lahiri; một ayanamsa khác (như Raman, lệch khoảng 1,5°) có thể đặt Mặt Trăng sang cung bên cạnh.`);
  }
  paras.push(pick(CLOSE, n.lagna.lon * 7 + n.grahas.moon.lon));
  why.push("Cách chọn: câu đầu lấy hai đặc điểm nổi nhất của lá số; đoạn sau đọc chủ cung mọc và quan hệ Mặt Trời – Mặt Trăng; chỉ nói điều được nhiều yếu tố cùng chỉ về (nhà, chủ nhà và hành tinh chủ quản).");
  return { paras: paras.map(noPast).filter(Boolean), why };
}

/** Sentences that tell the reader's past or childhood as fact. The chart cannot see these, so the overview never says them. */
const PAST = /(tuổi thơ|thời thơ ấu|từ nhỏ|hồi nhỏ|ngày xưa|tuổi trẻ|đã từng|kiếp trước|tiền kiếp|khi còn bé)/i;
export function noPast(text: string): string {
  return text.split(/(?<=[.!?])\s+/).filter((x) => !PAST.test(x)).join(" ").trim();
}
const keep = (h: string, p: string) => ({ h, p: noPast(p) });

/** A portrait kept to two beats: what this point needs or shows, and one line on what to hold on to. No scenes, no fears read into the person. */
function trimPortrait(P: Portrait, kind: "lagna" | "sun" | "moon"): Portrait {
  const b = P.beats, lesson = firstSentence(b[4].p);
  const beats = kind === "lagna" ? [keep(b[0].h, b[0].p), keep("Điều cần giữ", `${firstSentence(b[3].p)} ${lesson}`)]
    : [keep(b[0].h, b[0].p), keep("Điều cần giữ", lesson)];
  return { ...P, beats: beats.filter((x) => x.p) };
}

/** The rising sign, the Sun and the Moon, each as a short named portrait. A sign already shown is not painted again. */
function portraitBlocks(ctx: Ctx, f: Facts): OverviewBlock[] {
  const n = ctx.n, out: OverviewBlock[] = [];
  const rest = (b: OverviewBlock, drop: string) => b.paragraphs.filter((p) => p && p !== drop).map(noPast).filter(Boolean);
  const lag = ctx.noTime ? null : n.lagna.sign;
  if (lag !== null) {
    const b = lagnaBlock(ctx, f);
    out.push({ ...b, title: `Cung mọc ${SIGNS[lag]}`, role: "thân thể và cách bạn bước vào đời", paragraphs: rest(b, LAGNA_SIGN[lag]), portrait: trimPortrait(LAGNA_PORTRAIT[lag], "lagna"), meta: { signs: [{ label: "Cung mọc", sign: lag }] } });
  }
  const sun = n.grahas.sun.sign, moon = n.grahas.moon.sign;
  const sb = sunBlock(ctx, f);
  const sPar = rest(sb, SUN_SIGN[sun]).filter((p) => lag === null || !p.startsWith("Cung mọc và Mặt Trời"));
  // the same sign as the rising sign: keep the Sun's own beat (what gives meaning), leave out what the rising sign already said
  const sP = trimPortrait(SUN_PORTRAIT[sun], "sun");
  out.push({ ...sb, title: `Mặt Trời ${SIGNS[sun]}`, role: "bản ngã và linh hồn", paragraphs: sPar, portrait: lag === sun ? { ...sP, beats: sP.beats.slice(0, 1) } : sP, meta: { signs: [{ label: "Mặt Trời", sign: sun }] } });
  if (!ctx.uncertainMoon) {
    const mb = moonBlock(ctx, f), M = MOON_PORTRAIT[moon];
    const lead = fill(MOON_NAK_LEAD, { nak: nakName(n.grahas.moon.nak.name) });
    const mP = trimPortrait(M, "moon");
    out.push({ ...mb, title: `Mặt Trăng ${SIGNS[moon]}`, role: "cảm xúc và tâm trí", paragraphs: rest(mb, MOON_SIGN[moon]).filter((p) => !p.startsWith(lead)), portrait: { ...(moon === sun || moon === lag ? { ...mP, beats: mP.beats.slice(0, 1) } : mP), why: `${M.why} ${lead} ${NAKSHATRA_TEXT[n.grahas.moon.nak.index]}` }, meta: { signs: [{ label: "Mặt Trăng", sign: moon }] } });
  }
  return out;
}

// ------------------------------------------------------------------ the three points read in pairs (v4.2)

/** Whole-sign count from a to b, 1–12. */
const relOf = (a: number, b: number) => mod(b - a, 12) + 1;
/** What the count means, in plain words, for the "Vì sao" line. */
const REL_VI: Record<number, string> = {
  1: "cùng một cung: hai điểm mang chung một chất",
  2: "hai cung kề nhau: hai điểm khác nhịp, cần thời gian để quen nhau",
  12: "hai cung kề nhau: hai điểm khác nhịp, cần thời gian để quen nhau",
  3: "thế 3–11: hai điểm tiếp sức cho nhau và mạnh dần theo thời gian",
  11: "thế 3–11: hai điểm tiếp sức cho nhau và mạnh dần theo thời gian",
  4: "thế 4–10: hai điểm thúc nhau, tạo động lực nhưng cũng tạo sức ép",
  10: "thế 4–10: hai điểm thúc nhau, tạo động lực nhưng cũng tạo sức ép",
  5: "thế tam hợp 5–9: hai điểm dễ đỡ nhau",
  9: "thế tam hợp 5–9: hai điểm dễ đỡ nhau",
  6: "thế 6–8: hai điểm lệch nhịp, cần chủ động dung hòa",
  8: "thế 6–8: hai điểm lệch nhịp, cần chủ động dung hòa",
  7: "thế đối diện 1–7: hai điểm soi vào nhau và bổ khuyết cho nhau",
};
const SUN_DIG_VI: Record<number, string> = { 0: "Mặt Trời ở Bạch Dương là vị trí vượng (Uchcha) theo Parashara: ý chí thẳng và chủ động.", 6: "Mặt Trời ở Thiên Bình là vị trí suy (Neecha) theo Parashara: ý chí thiên về dung hòa hơn là áp đặt.", 4: "Mặt Trời ở Sư Tử là cung nhà của chính nó." };
const MOON_DIG_VI: Record<number, string> = { 1: "Mặt Trăng ở Kim Ngưu là vị trí vượng theo Parashara: cảm xúc có nền vững.", 7: "Mặt Trăng ở Thiên Yết là vị trí suy theo Parashara: cảm xúc đi sâu và chậm, cần thời gian để tin.", 3: "Mặt Trăng ở Cự Giải là cung nhà của chính nó." };

function pairsBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const n = ctx.n, L = n.lagna.sign, S = n.grahas.sun.sign, M = n.grahas.moon.sign;
  const pairs: { h: string; p: string }[] = [];
  pairs.push({ h: `Cung mọc ${SIGNS[L]} và Mặt Trời ${SIGNS[S]}`, p: PAIRS.LS[L][S] });
  // When the Sun and the Moon share a sign, the rising sign × Moon paragraph would say again what rising sign × Sun said.
  if (S !== M) pairs.push({ h: `Cung mọc ${SIGNS[L]} và Mặt Trăng ${SIGNS[M]}`, p: PAIRS.LM[L][M] });
  const paras: string[] = [];
  if (S === M) paras.push(`Mặt Trời và Mặt Trăng của bạn cùng ở ${SIGNS[S]}, nên đoạn dưới đây nói chung cho cả điều bạn coi trọng lẫn điều lòng bạn cần.`);
  const rel = (a: string, sa: number, b: string, sb: number) => `${a} ${SIGNS[sa]} → ${b} ${SIGNS[sb]}: ${b} ở cung thứ ${relOf(sa, sb)} tính từ ${a === "Cung mọc" ? "cung mọc" : a} (${REL_VI[relOf(sa, sb)]}).`;
  const why = [
    `Cung mọc ${SIGNS[L]} ${fmtDeg(n.lagna.deg)}, Mặt Trời ${SIGNS[S]} ${fmtDeg(n.grahas.sun.deg)}, Mặt Trăng ${SIGNS[M]} ${fmtDeg(n.grahas.moon.deg)} (Lahiri, cung trọn – Whole Sign).`,
    rel("Cung mọc", L, "Mặt Trời", S),
    ...(S !== M ? [rel("Cung mọc", L, "Mặt Trăng", M)] : []),
    rel("Mặt Trời", S, "Mặt Trăng", M),
    SUN_DIG_VI[S] ?? "", MOON_DIG_VI[M] ?? "",
    ...moonBlock(ctx, f).why.slice(0, 2),
    "Văn bản do NotebookLM viết từ các nguồn Jyotish trong sổ “Chiêm tinh học”.",
  ].filter(Boolean).filter((x, i, a) => a.indexOf(x) === i);
  return {
    id: "keys", title: "Cung mọc, Mặt Trời và Mặt Trăng", role: "cách bạn bước vào đời, điều bạn coi trọng và điều lòng bạn cần, đọc cùng nhau",
    meta: { signs: [{ label: "Cung mọc", sign: L }, { label: "Mặt Trời", sign: S }, { label: "Mặt Trăng", sign: M }] },
    paragraphs: paras, pairs: pairs.map((x) => ({ h: x.h, p: noPast(x.p) })), why,
  };
}
/** The rising sign alone: body, looks and the air a person carries (NotebookLM). */
function lagnaLookBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const L = ctx.n.lagna.sign;
  return {
    id: "lagna", title: `Cung mọc ${SIGNS[L]}`, role: "thân thể, diện mạo và khí chất bên ngoài",
    meta: { signs: [{ label: "Cung mọc", sign: L }] },
    paragraphs: LAGNA_LOOK[L].split(/\n\n+/).map(noPast).filter(Boolean),
    why: [...lagnaBlock(ctx, f).why, "Văn bản do NotebookLM viết từ các nguồn Jyotish trong sổ “Chiêm tinh học”."],
  };
}
/** The pair reading needs all three points; without a birth time or with an uncertain Moon, the portraits are used. */
export const usesPairs = (ctx: Ctx) => !ctx.noTime && !ctx.uncertainMoon;

export function readOverview(ctx: Ctx): Overview {
  const f = buildFacts(ctx);
  const blocks: OverviewBlock[] = [];
  if (usesPairs(ctx)) blocks.push(lagnaLookBlock(ctx, f), pairsBlock(ctx, f), elementsBlock(ctx, f), pillarsBlock(ctx, f));
  else blocks.push(keysBlock(ctx, f), ...portraitBlocks(ctx, f), elementsBlock(ctx, f), moonCycleBlock(ctx, f), pillarsBlock(ctx, f));
  let share: Overview["focusShare"] = null;
  if (!ctx.noTime) { const fb = focusBlock(ctx, f); blocks.push(fb.block); share = fb.share; }
  const strength: StrengthRow[] | null = ctx.sb ? ctx.sb.order.map((id) => { const p = ctx.sb!.planets[id]; return { id, name: nameOf(id), pct: Math.round(p.ratio * 100), band: p.band, rank: p.rank }; }) : null;
  return { explore: readExplore(ctx, f), blocks, strength, focusShare: share, planets: readPlanets(ctx) };
}

// ------------------------------------------------------------------ Tổng quan v5

const sentences = (t: string) => t.split(/(?<=[.!?])\s+/).filter(Boolean);
const lowFirst = (t: string) => (/^(Bạn|Người|Cuộc)/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);
/** The first sentence of a passage, without an opening "Khi …," clause, ready to follow a colon. */
const leadSentence = (t: string) => lowFirst((sentences(t.replace(/\n+/g, " "))[0] ?? "").replace(/^Khi [^,]{3,90}, /, "").replace(/[.!?]$/, ""));
const noHealth = (t: string) => sentences(t).filter((x) => !/sức khỏe|bệnh/.test(x)).join(" ");
const paras = (t: string) => t.split(/\n\n+/).map((x) => noHealth(x.trim())).filter(Boolean);
/** A passage of one long paragraph is split in two, at its middle sentence. */
function twoParas(t: string): string[] {
  const ps = paras(t);
  if (ps.length !== 1) return ps;
  const ss = sentences(ps[0]);
  if (ss.length < 4) return ps;
  void 0;
  const k = Math.max(2, ss.findIndex((x, i) => i >= 2 && /^(Khí chất|Phong thái|Về khí chất|Bạn mang|Bạn tiếp xúc|Bạn bước|Điểm mạnh|Thế mạnh|Về điểm mạnh)/.test(x)));
  const cut = k > 1 && k < ss.length ? k : Math.ceil(ss.length / 2);
  return [ss.slice(0, cut).join(" "), ss.slice(cut).join(" ")];
}

// ------------------------------------------------------------------ v4.2: the three keystones as one portrait
// Each keystone starts from the notebook's passage for its sign, then is modified by what makes this chart different:
// the nakshatra and its lord, the lord of the sign, planets sitting with it and planets looking at it, strength and the Moon's light.
// Definite claims about the body are dropped (the brief forbids them), and so are the harshest labels.

const BODY = /(vóc dáng|thân hình|khung xương|khung người|cánh tay|sống mũi|đôi mắt|ánh mắt|gương mặt|khuôn mặt|làn da|mái tóc|diện mạo|vầng trán|bờ vai|dáng người|cơ thể|chiều cao|cằm|gò má|lông mày)/i;
const HARSH = /(lười biếng|cực kỳ|rất thiếu|cáu gắt|hoang phí|ích kỷ|độc đoán|thô lỗ|tàn nhẫn)/i;
const keepSoft = (t: string) => sentences(t.replace(/\n+/g, " ")).filter((x) => !BODY.test(x) && !HARSH.test(x) && !/sức khỏe|bệnh/.test(x)).join(" ");
const stripLead = (t: string) => t.replace(/^Khi (có )?(cung Mọc|Mặt Trời|Mặt Trăng)[^,]{0,40}, /, "").replace(/^./, (c) => c.toUpperCase());
const condWord = (p: PlanetFact) => (["exalted", "own", "moolatrikona"].includes(p.dignity) ? "đang ở vị trí mạnh" : p.dignity === "debilitated" ? "đang ở thế suy" : p.grade === "strong" || p.grade === "good" ? "đứng khá vững" : p.grade === "weak" ? "đang ở thế yếu" : "ở thế vừa phải");
/** The rising nakshatra, or null when the birth-time window lets it change. */
function lagnaNak(ctx: Ctx): { index: number; name: string; pada: number; lord: GrahaId } | null {
  const n = ctx.n, w = Math.max(1, ctx.windowMin);
  const a = computeNatal(n.utcMs - w * 60_000, n.lat, n.lon).lagna.nak, b = computeNatal(n.utcMs + w * 60_000, n.lat, n.lon).lagna.nak;
  if (a.index !== n.lagna.nak.index || b.index !== n.lagna.nak.index) return null;
  return { index: n.lagna.nak.index, name: n.lagna.nak.name, pada: n.lagna.nak.pada, lord: n.lagna.nak.lord };
}
/** What a planet sitting on the rising sign adds to how you come across, said without naming the planet. */
const FACE_ADD: Record<string, string> = {
  sun: "một vẻ tự tin, rõ ràng, khó bị lẫn giữa đám đông", moon: "một nét mềm mại, dễ gần, cảm xúc hiện ngay trên gương mặt",
  mars: "một sự năng nổ, thẳng thắn và hơi nóng", mercury: "sự lanh lợi và cách nói chuyện có duyên",
  jupiter: "một vẻ điềm đạm, đáng tin, khiến người ta hay tìm đến hỏi ý kiến", venus: "sự duyên dáng, hòa nhã và có gu",
  saturn: "một vẻ nghiêm, dè dặt và chín chắn hơn tuổi", rahu: "một nét khác thường, khó đoán", ketu: "một vẻ hơi xa cách, như sống nhiều bên trong",
};
/** What a planet looking at the rising sign adds, as a full clause. */
const FACE_LOOK: Record<string, string> = {
  mars: "Khi đã có việc phải làm, bạn quyết liệt hơn nhiều so với vẻ ngoài.",
  saturn: "Với những chuyện quan trọng, bạn nghiêm túc và cẩn trọng hơn người ta tưởng.",
  jupiter: "Người xung quanh dễ tin bạn và hay tìm đến bạn khi cần một lời khuyên.",
};
/** A conjunction said without planet names: "Bạn còn có …, kèm điều cần để ý là …". */
const conjPlain = (gift: string, care: string) => `Bạn còn có ${gift.replace(/^có /, "").replace(/\s*\([^)]*\)/g, "")}, kèm điều cần để ý là ${care.replace(/^khi hai sao [^,]+, /, "")}.`;
const strongish = (p: PlanetFact) => ["exalted", "own", "moolatrikona"].includes(p.dignity) || p.grade === "strong";
const weakish = (p: PlanetFact) => p.dignity === "debilitated" || p.grade === "weak";
/** At most `k` sentences of a passage: the opening ones, then its line on strengths and its line on what is hard. */
function trimPassage(t: string, k = 4): string {
  const ss = sentences(stripLead(keepSoft(t)));
  if (ss.length <= k) return ss.join(" ");
  const core = ss.slice(0, 2);
  const good = ss.find((x, i) => i >= 2 && /^(Điểm mạnh|Thế mạnh|Về điểm mạnh)/.test(x));
  const hard = ss.find((x, i) => i >= 2 && /(Tuy nhiên|[Đđ]iểm khó|[Đđ]iều khó|[Tt]hử thách)/.test(x));
  const out = [...core, ...(good ? [good] : []), ...(hard ? [hard] : [])];
  return (out.length > 2 ? out : ss.slice(0, k)).join(" ");
}
/** The part of a "… ở nhà N, nên X" sentence after "nên", as its own sentence. */
const afterNen = (t: string) => { const i = t.indexOf(", nên "); return i < 0 ? t : t.slice(i + 6).replace(/^./, (c) => c.toUpperCase()); };

function lagnaPart(ctx: Ctx, f: Facts): { paragraphs: string[]; details: string[] } {
  const n = ctx.n, L = n.lagna.sign, out: string[] = [], det: string[] = [];
  out.push(trimPassage(LAGNA_LOOK[L] || LAGNA_SIGN[L], 3));
  const nk = lagnaNak(ctx), more: string[] = [];
  det.push(`Cung mọc ${SIGNS[L]} ${fmtDeg(n.lagna.deg)}; chủ cung mọc ${nameOf(SIGN_LORD[L])} ở ${SIGNS[f.planets[SIGN_LORD[L]].sign]}, nhà ${f.planets[SIGN_LORD[L]].house}.`);
  if (nk) {
    const NL = f.planets[nk.lord];
    more.push(NAK[nk.index].face.replace(/\.$/, "") + ".");
    if (NL.house === 1 || strongish(NL)) more.push("Nét này hiện ra rất rõ, ngay từ lần gặp đầu.");
    else if (weakish(NL)) more.push("Nét này thường chỉ lộ ra khi người ta đã quen bạn một thời gian.");
    det.push(`Chòm sao của cung mọc: ${nakName(nk.name)} pada ${nk.pada}; chủ chòm sao ${nameOf(nk.lord)} ${NL.house === 1 ? "đứng ngay trên cung mọc" : `ở nhà ${NL.house}`}, ${DIGNITY_VI[NL.dignity].toLowerCase()} → sắc thái “${NAK[nk.index].face.replace(/^Người ta thấy ở bạn /, "").replace(/\.$/, "")}”.`);
  } else det.push("Trong khoảng sai số giờ sinh, cung mọc có thể rơi vào hai chòm sao khác nhau, nên phần này không dùng chi tiết chòm sao.");
  const occ = f.houses[0]?.occupants.filter((id) => id !== nk?.lord) ?? [];
  const asp = (f.houses[0]?.aspects ?? []).filter((id) => !f.houses[0].occupants.includes(id) && FACE_LOOK[id]);
  if (occ.length) { more.push(`Bạn còn mang ${occ.slice(0, 2).map((id) => FACE_ADD[id]).join(", cùng với ")}.`); det.push(`Hành tinh trên cung mọc: ${joinVi(occ.map(nameOf))}.`); }
  if (asp.length) { more.push(FACE_LOOK[asp[0]]); det.push(`Góc chiếu vào cung mọc: ${joinVi(asp.map(nameOf))}.`); }
  if (more.length) out.push(more.join(" "));
  return { paragraphs: out.map(noPast).filter(Boolean), details: det };
}

function sunPart(ctx: Ctx, f: Facts): { paragraphs: string[]; details: string[] } {
  const n = ctx.n, S = n.grahas.sun.sign, sun = f.planets.sun, out: string[] = [], det: string[] = [];
  const nb = SUN_NB[S] && SUN_NB[S] !== "Đang cập nhật." ? paras(SUN_NB[S])[0] : SUN_SIGN[S];
  const sameAsLagna = !ctx.noTime && n.lagna.sign === S;
  out.push(sameAsLagna ? `Mặt Trời cũng ở ${SIGNS[S]}, nên chất của cung này đi từ vẻ ngoài vào tận bản ngã. ${sentences(trimPassage(nb))[0] ?? ""}` : trimPassage(nb));
  const m: string[] = [];
  const nk = sun.g.nak, NL = f.planets[nk.lord];
  const nakTrait = lowerFirst(NAKSHATRA_TEXT[nk.index].split(": ").slice(1).join(": "));
  if (nakTrait) m.push(nk.lord === "sun" ? `Bạn có nguyên tắc riêng rất rõ: ${nakTrait}` : `Ở bạn còn có một nét riêng: ${nakTrait}`);
  det.push(`Mặt Trời ${SIGNS[S]} ${fmtDeg(sun.g.deg)}${sun.house ? `, nhà ${sun.house}` : ""}, ${DIGNITY_VI[sun.dignity].toLowerCase()}${sun.sb ? `, Shadbala ${Math.round(sun.sb.ratio * 100)}%` : ""}.`);
  det.push(`Chòm sao: ${nakName(nk.name)} pada ${nk.pada}, chủ chòm sao ${nameOf(nk.lord)}${nk.lord !== "sun" ? ` (${condWord(NL)})` : " (chính Mặt Trời)"}.`);
  const hidden = !ctx.noTime && sun.house === 12;
  if (!ctx.noTime && sun.house) m.push(afterNen(SUN_IN[sun.house - 1]));
  if ((sun.dignity === "enemy" || sun.dignity === "debilitated") && !hidden) m.push("Sức mạnh ấy không ồn ào: nó cần thời gian mới hiện rõ, nhưng đã hiện thì bền.");
  else if (hidden && (sun.dignity === "enemy" || sun.dignity === "debilitated")) m.push("Đó không phải vì bạn yếu; bạn chỉ chọn cách làm việc lặng lẽ.");
  else if (["exalted", "own", "moolatrikona"].includes(sun.dignity)) m.push("Ý chí của bạn rõ và vững: khi đã muốn điều gì, bạn thường theo được tới cùng.");
  const mate = sun.conj.find((o) => conjOf("sun", o) && o !== "moon");
  if (mate) { const c = conjOf("sun", mate)!; m.push(conjPlain(c.gift, c.care)); det.push(`Mặt Trời đồng cung ${nameOf(mate)}.`); }
  out.push(m.join(" "));
  return { paragraphs: out.map(noPast).filter(Boolean), details: det };
}

function moonPart(ctx: Ctx, f: Facts): { paragraphs: string[]; details: string[] } {
  const n = ctx.n, M = n.grahas.moon.sign, moon = f.planets.moon, out: string[] = [], det: string[] = [];
  const nb = MOON_NB[M] && MOON_NB[M] !== "Đang cập nhật." ? paras(MOON_NB[M])[0] : MOON_SIGN[M];
  const shared = M === n.grahas.sun.sign || (!ctx.noTime && M === n.lagna.sign);
  out.push(shared ? `Mặt Trăng cũng ở ${SIGNS[M]}, nên cảm xúc của bạn nói cùng một tiếng nói với ${M === n.grahas.sun.sign ? "ý chí" : "vẻ ngoài"}. ${sentences(stripLead(keepSoft(nb))).slice(1, 3).join(" ")}`.trim() : trimPassage(nb));
  const m: string[] = [];
  const nk = moon.g.nak, nm = nk.name;
  det.push(`Mặt Trăng ${SIGNS[M]} ${fmtDeg(moon.g.deg)}${moon.house ? `, nhà ${moon.house}` : ""}, ${DIGNITY_VI[moon.dignity].toLowerCase()}${moon.sb ? `, Shadbala ${Math.round(moon.sb.ratio * 100)}% (hạng ${moon.sb.rank}/7)` : ""}.`);
  det.push(`Chòm sao: ${nakName(nm)} pada ${nk.pada}, chủ chòm sao ${nameOf(nk.lord)}.`);
  if (nk.index === n.grahas.sun.nak.index) m.push("Điều bạn tin và điều bạn cảm gần như là một; sức mạnh ở đây là sự nhất quán, còn điều cần giữ là chừa chỗ cho một góc nhìn khác.");
  else {
    const soul = sentences(NAK[nk.index].soul).filter((x) => !x.includes(nm) && !x.includes(nakName(nm)) && !/thuộc (về )?[A-Z]|là (sao|thầy|ngọn|lửa)|Điều cần tập|điều cần tập/.test(x)).slice(0, 2).join(" ");
    if (soul) m.push(`Sâu hơn một chút, ${lowerFirst(soul)}`);
  }
  if (nk.lord !== "rahu" && nk.lord !== "ketu" && strongish(f.planets[nk.lord])) { m.push("Phần sâu ấy lại có chỗ dựa vững, nên bạn chịu đựng được nhiều hơn mình tưởng."); det.push(`Chủ chòm sao ${nameOf(nk.lord)} ${condWord(f.planets[nk.lord])}.`); }
  const LL = ctx.noTime ? null : SIGN_LORD[n.lagna.sign];
  if (LL && LL !== "moon" && moon.conj.includes(LL)) { m.push("Điều bạn cảm và điều bạn nghĩ đi rất sát nhau, nên bạn khó giả vờ vui khi trong lòng không vui."); det.push(`Mặt Trăng đồng cung ${nameOf(LL)}, chủ cung mọc.`); }
  else { const mate = moon.conj.find((o) => conjOf("moon", o) && o !== "sun"); if (mate) { const c = conjOf("moon", mate)!; m.push(conjPlain(c.gift, c.care)); det.push(`Mặt Trăng đồng cung ${nameOf(mate)}.`); } }
  if (m.length) out.push(m.join(" "));
  // strength and light
  const e = mod(n.grahas.moon.lon - n.grahas.sun.lon, 360), gap = Math.min(e, 360 - e);
  const weakest = moon.sb && moon.sb.rank === 7;
  const disp = f.planets[SIGN_LORD[M]];
  det.push(`Mặt Trăng cách Mặt Trời ${gap.toFixed(0)}° (${gap < 72 ? "dưới 72°, trăng mỏng" : "trên 72°, trăng đủ sáng"}).`);
  if (gap < 72 || weakest) {
    out.push(`Nguồn năng lượng cảm xúc của bạn mỏng hơn những gì người khác thấy: sau những ngày căng thẳng bạn dễ cạn sức, nên giấc ngủ đủ, nhịp nghỉ đều và những người làm bạn thấy an toàn quan trọng với bạn hơn với nhiều người.${isGood(disp) ? " Điều tốt là khi được nghỉ đúng cách, bạn hồi lại khá nhanh." : ""}`);
    if (isGood(disp)) det.push(`Chủ cung của Mặt Trăng, ${nameOf(disp.id)}, ${condWord(disp)}: yếu tố bù.`);
  }
  return { paragraphs: out.map(noPast).filter(Boolean), details: det };
}

function readExplore(ctx: Ctx, f: Facts): Explore {
  const n = ctx.n, S = n.grahas.sun.sign, M = n.grahas.moon.sign, L = ctx.noTime ? null : n.lagna.sign;
  const parts: Explore["parts"] = [];
  if (L !== null) parts.push({ key: "lagna", title: `Cung Mọc ${SIGNS[L]}`, role: "Thân thể & Khí chất", sign: L, ...lagnaPart(ctx, f) });
  parts.push({ key: "sun", title: `Mặt Trời ${SIGNS[S]}`, role: "Bản ngã & Linh hồn", sign: S, ...sunPart(ctx, f) });
  if (!ctx.uncertainMoon) parts.push({ key: "moon", title: `Mặt Trăng ${SIGNS[M]}`, role: "Tâm trí & Cảm xúc", sign: M, ...moonPart(ctx, f) });

  // ---- highlights, one or two sentences each
  const highlights: Explore["highlights"] = [];
  const by: Record<Element, GrahaId[]> = { fire: [], earth: [], air: [], water: [] };
  for (const id of SEVEN) by[ELEMENT_OF(n.grahas[id].sign)].push(id);
  const counts: Record<Element, number> = { fire: by.fire.length, earth: by.earth.length, air: by.air.length, water: by.water.length };
  if (L !== null) counts[ELEMENT_OF(L)]++;
  const order = ["fire", "earth", "air", "water"] as Element[];
  const top = [...order].sort((a, b) => counts[b] - counts[a] || order.indexOf(a) - order.indexOf(b));
  const lacking = order.filter((e) => counts[e] === 0);
  const few = order.filter((e) => counts[e] === 1);
  const spread = counts[top[0]] - counts[top[3]];
  const elParts: string[] = [];
  if (spread <= 1) elParts.push(EL_EVEN);
  else {
    if (counts[top[0]] >= 3) elParts.push(EL_MANY[top[0]]);
    if (counts[top[1]] === counts[top[0]] && counts[top[1]] >= 3 && !lacking.length) elParts.push(EL_MANY[top[1]].split(/(?<=[.!?])\s+/).slice(0, 2).join(" "));
    if (lacking.length) elParts.push(EL_NONE[lacking[0]]);
    else if (few.length && counts[top[0]] >= 4) elParts.push(EL_FEW[few[0]]);
  }
  const elText = elParts.join(" ");
  highlights.push({ key: "elements", title: "Nguyên tố nổi bật", text: elText, elements: counts });
  const seven = f.order.filter((id) => id !== "rahu" && id !== "ketu");
  const weight = (id: GrahaId) => { const p = f.planets[id]; let w = p.score; if (p.role === "yogakaraka") w += 0.8; if (p.role === "lagna") w += 0.5; if (f.n.yogas.some((y) => y.grahas.includes(id) && y.strength !== "weak" && y.tone === "good")) w += 0.4; return w; };
  const pillars = seven.filter((id) => isGood(f.planets[id])).sort((a, b) => weight(b) - weight(a)).slice(0, 2);
  let plText = "Không có hành tinh nào nổi trội hẳn; sức được chia khá đều giữa các hành tinh.";
  if (pillars.length) {
    plText = `${nameOf(pillars[0])} hoạt động mạnh nhất: ${leadSentence(PLANET_NB[pillars[0]] ?? GIFT[pillars[0]])}.`;
    if (pillars[1]) plText += ` Kế đó là ${nameOf(pillars[1])}, nâng đỡ ${GIFT[pillars[1]]}.`;
  }
  highlights.push({ key: "planets", title: "Hành tinh nổi bật", text: plText, planets: pillars });
  let areaTitle = "";
  if (L !== null) {
    const { total, byArea } = focusWeights(f);
    const scored = FOCUS_AREAS.map((a, i) => ({ a, excess: byArea[i] / total - a.houses.length / 12 })).sort((x, y) => y.excess - x.excess);
    const lead = scored.filter((x) => x.excess >= 0.08).slice(0, 2);
    let t = "Lá số trải khá đều qua nhiều mảng đời sống, không dồn về một vùng nào; trọng tâm thường đổi theo từng giai đoạn.";
    if (lead.length) {
      const a = lead[0].a; areaTitle = a.title;
      t = `Lá số dồn nhiều sức nặng vào ${a.says}; đây là nơi các giai đoạn quan trọng của đời bạn thường diễn ra.`;
      if (lead[1]) t += ` Kế đó là ${lead[1].a.says}.`;
    }
    highlights.push({ key: "areas", title: "Lĩnh vực được nhấn mạnh", text: t });
  }

  // ---- the whole picture: who you are outside, what you value, what your heart needs, where your strength is, what to keep in mind
  const pic: string[] = [];
  if (L !== null) pic.push(`Người mới gặp thường thấy ở bạn một người ${FACE[L]}.`);
  pic.push(`${L !== null ? "Bên trong, điều" : "Điều"} bạn thật sự coi trọng là ${SELF[S]}${!ctx.uncertainMoon ? `, còn lòng bạn ${HEART[M]}` : ""}.`);
  const strong = pillars[0] ? CAPACITY[pillars[0]] : "";
  let areaSays = "";
  if (L !== null) {
    const { total, byArea } = focusWeights(f);
    const top1 = FOCUS_AREAS.map((a, i) => ({ a, excess: byArea[i] / total - a.houses.length / 12 })).sort((x, y) => y.excess - x.excess)[0];
    if (top1.excess >= 0.08) areaSays = top1.a.says;
  }
  if (strong && areaSays) pic.push(`Điểm tựa lớn nhất của bạn là ${strong}, và phần lớn tâm sức đời bạn dồn vào ${areaSays}.`);
  else if (strong) pic.push(`Điểm tựa lớn nhất của bạn là ${strong}.`);
  else if (areaSays) pic.push(`Phần lớn tâm sức đời bạn dồn vào ${areaSays}.`);
  const tens = traits(ctx, f).find((x) => x.kind === "tension");
  const careBits = [tens ? tens.clause : "", lacking.length ? EL_NONE_SHORT[lacking[0]] : ""].filter(Boolean);
  if (careBits.length) pic.push(`Điều nên nhớ: ${careBits.join("; và ")}.`);
  const summary = pic.join(" ");

  // ---- the data underneath, shown once, folded
  const basis: Explore["basis"] = [];
  const pos = (id: GrahaId) => { const p = f.planets[id]; return `${nameOf(id)}: ${SIGNS[p.sign]} ${fmtDeg(p.g.deg)}${p.house ? `, nhà ${p.house}` : ""}, ${DIGNITY_VI[p.dignity].toLowerCase()}${p.sb ? `, Shadbala ${Math.round(p.sb.ratio * 100)}%` : ""}${p.g.retro ? ", nghịch hành" : ""}${p.g.combust ? ", cháy sáng" : ""}${p.g.vargottama ? ", vargottama" : ""}.`; };
  const three: string[] = [];
  if (L !== null) { const LL = SIGN_LORD[L]; three.push(`Cung Mọc: ${SIGNS[L]} ${fmtDeg(n.lagna.deg)}, chòm sao ${nakName(n.lagna.nak.name)} pada ${n.lagna.nak.pada}; chủ cung mọc ${nameOf(LL)} ở ${SIGNS[f.planets[LL].sign]}, nhà ${f.planets[LL].house}.`); }
  three.push(pos("sun"));
  if (!ctx.uncertainMoon) three.push(`${pos("moon")} Chòm sao ${nakName(n.grahas.moon.nak.name)} pada ${n.grahas.moon.nak.pada}, chủ chòm sao ${nameOf(n.grahas.moon.nak.lord)}.`);
  const e = mod(n.grahas.moon.lon - n.grahas.sun.lon, 360), tithi = Math.floor(e / 12) + 1;
  three.push(`Mặt Trăng cách Mặt Trời ${e.toFixed(1).replace(".", ",")}°, tithi ${tithi}/30 (${tithi <= 15 ? "Shukla Paksha" : "Krishna Paksha"}).`);
  basis.push({ h: "Ba điểm gốc", lines: three });
  const rel = (a: string, sa: number, b: string, sb: number) => `${a} ${SIGNS[sa]} → ${b} ${SIGNS[sb]}: cung thứ ${relOf(sa, sb)} (${REL_VI[relOf(sa, sb)].split(":")[0]}).`;
  basis.push({ h: "Quan hệ giữa các điểm (cung trọn – Whole Sign)", lines: [
    ...(L !== null ? [rel("Cung Mọc", L, "Mặt Trời", S)] : []),
    ...(L !== null && !ctx.uncertainMoon ? [rel("Cung Mọc", L, "Mặt Trăng", M)] : []),
    ...(!ctx.uncertainMoon ? [rel("Mặt Trời", S, "Mặt Trăng", M)] : []),
  ] });
  basis.push({ h: "Nguyên tố", lines: [order.map((x) => `${ELEMENT_VI[x]} ${counts[x]}`).join(" · ") + (L !== null ? " (bảy hành tinh và cung mọc)" : " (bảy hành tinh)"),
    ...order.map((x) => `${ELEMENT_VI[x]}: ${by[x].length ? joinVi(by[x].map(nameOf)) : "không có hành tinh"}${L !== null && ELEMENT_OF(L) === x ? ", cung mọc" : ""}.`)] });
  basis.push({ h: "Bảy hành tinh", lines: [...seven.map(pos), ...(["rahu", "ketu"] as GrahaId[]).map((id) => `${nameOf(id)}: ${SIGNS[f.planets[id].sign]} ${fmtDeg(f.planets[id].g.deg)}${f.planets[id].house ? `, nhà ${f.planets[id].house}` : ""}.`),
    ...(pillars.length ? [`Hành tinh nổi bật được chọn theo phẩm vị, Shadbala và vai trò chức năng: ${joinVi(pillars.map(nameOf))}.`] : [])] });
  if (L !== null) {
    const { total, byArea } = focusWeights(f);
    basis.push({ h: "Trọng lượng các lĩnh vực", lines: FOCUS_AREAS.map((a, i) => `${a.title} (nhà ${a.houses.join(", ")}): ${Math.round((byArea[i] / total) * 100)}%.`).concat(areaTitle ? [`Nhấn mạnh nhất: ${areaTitle}.`] : []) });
  }
  return { lead: "Để hiểu chính mình, hãy bắt đầu từ những gì thể hiện ra bên ngoài — thân thể và khí chất; đi sâu vào bản ngã và linh hồn; rồi chạm đến thế giới tâm trí và cảm xúc bên trong.", parts, highlights, summary, basis };
}
