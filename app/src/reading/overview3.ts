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
import { HOUSE_TAG } from "./content/houses-signs.ts";
import { PLANETS } from "./content/planets.ts";
import { DIGNITY_VI, planetFlags } from "./shared.ts";
import { isSeven } from "../engine/shadbala.ts";
import { nameOf, joinVi, fill, greetName, lowerFirst } from "./util.ts";
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
}

export interface Letter {
  greeting: string;
  /** One sentence about the whole chart. */
  line: string;
  chips: { label: string; value: string; role: string }[];
}

export interface Overview {
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
  "Mặt Trời ở nhà 12, nên bản ngã của bạn không phô ra ngoài mà lặn vào bên trong; bạn lấy lại sức khi ở một mình, và có khuynh hướng làm nhiều hơn nói.",
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

const PILLAR_CLAUSE: Record<string, string> = {
  sun: "ý chí của bạn khó bị bẻ cong, kể cả khi bạn chọn im lặng",
  moon: "lòng bạn có sức bền hơn vẻ ngoài của nó",
  mars: "khi đã quyết, bạn có sức đi đến cùng",
  mercury: "trí óc là công cụ đáng tin nhất của bạn",
  jupiter: "bạn thường nhìn ra ý nghĩa ở những nơi người khác chỉ thấy rắc rối",
  venus: "bạn có con mắt nhận ra cái đẹp và cái vừa đủ",
  saturn: "sự bền bỉ của bạn thường đi xa hơn những khởi đầu ồn ào",
};
const ELEMENT_CLAUSE: Record<Element, string> = {
  fire: "bạn sống bằng nhiệt và thường hành động trước khi kịp nghi ngờ mình",
  earth: "bạn tin vào những gì làm ra được và giữ được qua thời gian",
  air: "bạn hiểu thế giới qua câu hỏi, trò chuyện và những mối liên hệ",
  water: "bạn cảm nhận đời sống trước khi giải thích nó",
};
const AREA_CLAUSE: Record<string, string> = {
  self: "đời bạn hay quay về câu hỏi mình là ai và mình thuộc về đâu",
  learn: "việc học, sáng tạo và niềm tin là nơi bạn tìm thấy mình rõ nhất",
  bond: "những người đồng hành là tấm gương lớn nhất để bạn hiểu mình",
  work: "bạn hiểu mình nhiều qua việc mình làm và những gì mình góp vào",
  depth: "phần quan trọng nhất của bạn diễn ra ở nơi ít ai nhìn thấy",
};

function traits(ctx: Ctx, f: Facts): Trait[] {
  const n = ctx.n, out: Trait[] = [];
  for (const id of f.order) {
    const p = f.planets[id];
    if (p.grade === "strong" && PILLAR_CLAUSE[id]) { out.push({ key: `p-${id}`, s: 2 + p.score * 0.3, kind: "gift", clause: PILLAR_CLAUSE[id] }); break; }
  }
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
    if (L.house && [6, 8, 12].includes(L.house)) out.push({ key: "ll", s: 1.6, kind: "tension", clause: "những gì bạn có thường đến sau một chặng tự rèn mà người ngoài ít thấy" });
    else if (L.house && [1, 5, 9].includes(L.house) && isGood(L)) out.push({ key: "ll", s: 1.3, kind: "gift", clause: "bạn thường được đỡ khi đi đúng con đường của mình" });
    if (!ctx.uncertainMoon) {
      const eL = ELEMENT_OF(n.lagna.sign), eM = ELEMENT_OF(n.grahas.moon.sign);
      const apart = mod(n.grahas.moon.sign - n.lagna.sign, 12) + 1;
      if (eL !== eM && [6, 8, 12].includes(apart)) out.push({ key: "lm", s: 1.7, kind: "tension", clause: "điều người khác thấy ở bạn và điều bạn cần bên trong không hoàn toàn giống nhau" });
    }
  }
  const m = f.planets.moon;
  if (!ctx.uncertainMoon && (m.grade === "weak" || m.aspectedBy.includes("saturn") || m.conj.includes("saturn") || m.conj.includes("rahu") || m.conj.includes("ketu")))
    out.push({ key: "moon", s: 1.5, kind: "tension", clause: "lòng bạn nhạy hơn những gì bạn để lộ ra" });
  return out.sort((a, b) => b.s - a.s);
}

export function headline(ctx: Ctx, f: Facts): string {
  const t = traits(ctx, f);
  const seed = ctx.n.lagna.sign * 7 + ctx.n.grahas.moon.nak.index;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  if (!t.length) return "Lá số của bạn không dồn sức về một phía nào, nên điều làm nên bạn nằm ở cách bạn chọn đặt tâm sức vào đâu.";
  const [a, b] = [t[0], t.find((x) => x.key !== t[0].key && x.clause !== t[0].clause)];
  if (!b) return `${cap(a.clause)}.`;
  if (a.kind === "tension" || b.kind === "tension") {
    const [g, h] = a.kind === "tension" ? [b, a] : [a, b];
    return pick([`${cap(g.clause)}, dù ${h.clause}.`, `${cap(g.clause)}, nhưng ${h.clause}.`], seed);
  }
  return pick([`${cap(a.clause)}, và ${b.clause}.`, `${cap(a.clause)}; đồng thời, ${b.clause}.`], seed);
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
  const paras = [LAGNA_SIGN[lag], lagnaLordSentence(f, lag)];
  const L = SIGN_LORD[lag];
  const tenant = f.houses[0].occupants.filter((o) => o !== L);
  if (tenant.length) paras.push(`Trong chính cung mọc có ${joinVi(tenant.map(nameOf))}, nên cách bạn xuất hiện mang thêm ${tenant.map((t) => lowerFirst(GIFT[t])).join(" và ")}.`);
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
  if (same && gap < 12) text = "Mặt Trăng đứng rất sát Mặt Trời. Ý chí và cảm xúc vì thế dễ chụm về một hướng, nhưng Mặt Trăng ở gần Mặt Trời cũng là Mặt Trăng còn tối: bạn có thể khó tách điều mình thật sự cần ra khỏi điều mình thấy phải làm.";
  else if (same) text = `Mặt Trời và Mặt Trăng cùng một cung nhưng cách nhau khoảng ${Math.round(gap)} độ, nên điều bạn muốn và điều bạn cần được làm từ cùng một chất liệu; điều đó không có nghĩa là chúng luôn đồng thuận, chỉ là khi giằng co, chúng giằng co về cùng một chuyện.`;
  else if (d === 7) text = "Mặt Trăng đứng đối diện Mặt Trời. Bạn thường thấy rõ cả hai phía của một việc, và cũng hay bị kéo giữa điều mình muốn khẳng định với điều lòng mình cần.";
  else if (d === 6 || d === 8) text = "Mặt Trời và Mặt Trăng đứng ở thế cách xa nhau trong vòng cung, nên điều bạn muốn thể hiện và điều bạn cần để yên lòng không tự gặp nhau; bạn thường phải chủ động nối hai đầu ấy.";
  else if (d === 5 || d === 9) text = "Mặt Trời và Mặt Trăng đứng ở thế tam hợp, nên ý chí và cảm xúc của bạn có xu hướng nuôi nhau hơn là cản nhau.";
  else text = "Mặt Trời và Mặt Trăng không đứng ở thế đặc biệt với nhau, nên mối quan hệ giữa ý chí và cảm xúc ở bạn phụ thuộc nhiều vào hoàn cảnh hơn là có sẵn một nhịp.";
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
  if (sm) paras.push(sm.text);
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

function keysBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const n = ctx.n, sun = f.planets.sun, moon = f.planets.moon;
  const paras: string[] = [];
  const self = `nhìn nhận giá trị của mình qua ${SELF[sun.sign]}`;
  const heart = ctx.uncertainMoon ? "" : `bên trong, bạn ${HEART[moon.sign]}`;
  if (!ctx.noTime) {
    const lag = n.lagna.sign;
    paras.push(`Bạn bước vào đời theo cách của một người ${FACE[lag]}; bạn ${self}${heart ? `, còn ${heart}` : ""}.`);
    const rLS = elRel(ELEMENT_OF(lag), ELEMENT_OF(sun.sign));
    const sm = sunMoonLine(ctx, f);
    const link = rLS === "same" ? "Vẻ ngoài và điều bạn muốn khẳng định đi cùng một hướng" : rLS === "friend" ? "Cách bạn bước vào việc thường mở đường cho điều bạn muốn khẳng định" : "Ấn tượng đầu tiên bạn tạo ra có thể khác với điều bạn thật sự muốn được nhận ra";
    paras.push(`${link}. ${sm && !sm.text.startsWith("Mặt Trời và Mặt Trăng không đứng") ? sm.text : ""}`.trim());
    const L = SIGN_LORD[lag], p = f.planets[L];
    const where = p.house === 1 ? "nằm ngay trong cung mọc, nên sức sống và hướng đi của bạn tụ về chính bản thân" : `đi về vùng ${area(p.house!)}, nên đó là nơi bạn đặt nhiều tâm sức`;
    const cond = p.grade === "strong" ? "Hành tinh này đứng rất vững, nên điểm tựa ấy đáng tin." : p.grade === "good" ? "Hành tinh này đứng khá vững." : p.grade === "weak" ? "Hành tinh này đang ở thế yếu, nên kết quả ở đó thường đến chậm và cần nhiều công sức." : "";
    paras.push(`${nameOf(L)}, hành tinh cai quản cung mọc, ${where}. ${cond} Mặt Trăng ở chòm sao ${nakName(moon.g.nak.name)} thêm cho cảm xúc của bạn một nét riêng: ${lowerFirst(NAKSHATRA_TEXT[moon.g.nak.index].split(": ").slice(1).join(": ") || NAKSHATRA_TEXT[moon.g.nak.index])}`.replace(/\s+/g, " "));
  } else {
    paras.push(`Bạn ${self}${heart ? `, còn ${heart}` : ""}.`);
    const sm = sunMoonLine(ctx, f);
    if (sm) paras.push(sm.text);
  }
  const signs = [...(ctx.noTime ? [] : [{ label: "Cung mọc", sign: n.lagna.sign }]), { label: "Mặt Trời", sign: sun.sign }, ...(ctx.uncertainMoon ? [] : [{ label: "Mặt Trăng", sign: moon.sign }])];
  return {
    id: "keys", title: "Cung mọc, Mặt Trời và Mặt Trăng", role: "cách bạn bước vào đời, điều bạn muốn khẳng định và điều lòng bạn cần", paragraphs: paras, meta: { signs },
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
    paras.push(EL_MORE[top[0]]);
    if (counts[top[1]] === counts[top[0]]) paras.push(EL_MORE[top[1]].replace(/ đậm nhất:/, " cũng đậm không kém:"));
    const low = top.filter((e) => counts[e] <= Math.max(0, counts[top[0]] - 3)).slice(-1)[0];
    if (low) paras.push(`${EL_LOW[low]}. Ít hành tinh ở một nguyên tố không có nghĩa là bạn thiếu phẩm chất đó; nó chỉ ít khi là phản xạ đầu tiên.`);
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
  if (dark) paras.push(help ? "Mặt Trăng lúc ấy còn gần Mặt Trời nên ánh sáng chưa nhiều, nhưng vị thế của nó trong cung hoặc sự nâng đỡ từ Sao Mộc bù lại phần lớn, nên tâm trí bạn không thiếu chỗ tựa." : "Mặt Trăng lúc ấy còn gần Mặt Trời nên ánh sáng chưa nhiều. Jyotish xem đó là một Mặt Trăng nhạy: cảm xúc của bạn dễ chịu ảnh hưởng của mệt mỏi và hoàn cảnh, nên giấc ngủ và nhịp nghỉ có ý nghĩa nhiều hơn với bạn so với người khác.");
  else paras.push("Mặt Trăng lúc ấy đã đủ xa Mặt Trời để có nhiều ánh sáng, một điều kiện Jyotish coi là thuận cho sự ổn định của tâm trí; phần còn lại tùy vào vị trí và những hành tinh đi cùng nó.");
  return {
    id: "moonCycle", title: "Chu kỳ trăng", paragraphs: paras, meta: { elong: e },
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
  if (!pillars.length) paras.push("Không hành tinh nào trong lá số của bạn nổi trội hẳn. Sức được chia khá đều, nên không có một năng lực nào được dựng sẵn để dựa vào; điều bạn phát triển được thường đến từ việc chọn và luyện một hướng cụ thể.");
  let saidAmb = 0;
  pillars.forEach((id, i) => {
    const p = f.planets[id];
    const yk = p.role === "yogakaraka" ? " Với cung mọc của bạn, nó còn cai quản cùng lúc một nhà trụ cột và một nhà phúc phần, nên sức của nó dễ chuyển thành kết quả." : "";
    const ambiguous = !ctx.noTime && p.role === "dusthana" ? (saidAmb++ === 0 ? " Cần nói rõ: nó mạnh nhưng cũng cai quản những mảng nhiều thử thách, nên sức mạnh ấy thường lộ ra khi bạn phải xử lý khó khăn hơn là khi mọi thứ suôn sẻ." : " Hành tinh này cũng mạnh theo cách ấy: sức của nó hiện rõ nhất khi gặp việc khó.") : "";
    const why = p.dignity === "exalted" ? "đứng ở vị trí mạnh nhất của nó" : p.dignity === "own" || p.dignity === "moolatrikona" ? "đứng trong cung nhà của chính nó" : p.g.digBala ? "đứng đúng phương vị hợp nhất với nó" : p.g.vargottama ? "giữ nguyên vị trí ở lá số D9" : "được nâng đỡ tốt";
    const via = p.house ? `, và thường phát huy qua chuyện ${area(p.house)}` : "";
    paras.push(i === 0
      ? `${nameOf(id)} ${why}, nên ${CAPACITY[id]} là năng lực có nền rõ nhất trong lá số${via}.${yk}${ambiguous}`
      : `Bên cạnh đó, ${nameOf(id)} ${why}, góp thêm ${CAPACITY[id]}${via}.${yk}${ambiguous}`);
  });
  const weak = seven.map((id) => f.planets[id]).filter((p) => p.grade === "weak").sort((a, b) => a.score - b.score)[0];
  if (weak) paras.push(`Ngược lại, ${nameOf(weak.id)} đang ở thế yếu, nên ${CAPACITY[weak.id]} ở bạn thường cần thời gian và hoàn cảnh phù hợp mới thể hiện hết.`);
  return {
    id: "pillars", title: "Hành tinh trụ cột nâng đỡ", paragraphs: paras, meta: { planets: pillars },
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
  if (!lead.length) paras.push("Các hành tinh của bạn trải khá đều, không dồn về một vùng nào. Đời bạn vì thế ít xoay quanh một chủ đề duy nhất; trọng tâm thường đổi theo từng giai đoạn.");
  lead.forEach((s, k) => {
    const ids = planetsIn(s.a.houses);
    const strongHere = ids.filter((id) => isSeven(id) && isGood(f.planets[id]));
    const bb = f.houses.filter((h) => s.a.houses.includes(h.n) && h.tier === "top").length;
    const quality = strongHere.length ? `, và vì ${joinVi(strongHere.map(nameOf))} ${strongHere.length > 1 ? "đều" : ""} đứng vững ở đây nên vùng này có sức nặng chứ không chỉ đông`.replace("  ", " ") : bb ? ", và sức mạnh nhà ở đây cũng cao" : ", dù các hành tinh ở đây không đặc biệt mạnh nên vùng này đông việc hơn là dễ việc";
    paras.push(`${k === 0 ? "Vùng nổi bật nhất" : "Vùng thứ hai"} là ${s.a.title.toLowerCase()}: ${s.a.says}${ids.length ? `. ${joinVi(ids.map(nameOf))} tập trung ở đây` : ""}${quality}.`);
  });
  // links between areas: the lord of the rising sign, and lords placed in each other's houses
  const L = f.planets[SIGN_LORD[f.n.lagna.sign]];
  const ex = f.houses.find((h) => h.lordHouse !== h.n && f.houses[h.lordHouse - 1].lordHouse === h.n && h.n < h.lordHouse);
  if (ex) paras.push(`Có một sợi dây nối riêng giữa ${area(ex.n)} và ${area(ex.lordHouse)}: chủ của hai vùng này đổi chỗ cho nhau, nên chuyện bên này thường kéo theo chuyện bên kia.`);
  else if (L.house && L.house !== 1 && lead.length && !lead[0].a.houses.includes(L.house)) paras.push(`Hành tinh cai quản cung mọc lại đi về ${area(L.house)}, nên ngoài những vùng trên, chuyện này cũng thường xuyên đòi bạn có mặt.`);
  paras.push("Một vùng ít hành tinh không có nghĩa là mảng ấy kém; nó chỉ ít khi là trung tâm, và đi theo hành tinh cai quản nó.");
  return {
    block: {
      id: "focus", title: "Những lĩnh vực nổi bật trong lá số", paragraphs: paras,
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
  return { greeting: `Gửi ${greetName(ctx.name)},`, line: headline(ctx, f), chips };
}

export function readOverview(ctx: Ctx): Overview {
  const f = buildFacts(ctx);
  const blocks: OverviewBlock[] = [];
  blocks.push(keysBlock(ctx, f), elementsBlock(ctx, f), moonCycleBlock(ctx, f), pillarsBlock(ctx, f));
  let share: Overview["focusShare"] = null;
  if (!ctx.noTime) { const fb = focusBlock(ctx, f); blocks.push(fb.block); share = fb.share; }
  const strength: StrengthRow[] | null = ctx.sb ? ctx.sb.order.map((id) => { const p = ctx.sb!.planets[id]; return { id, name: nameOf(id), pct: Math.round(p.ratio * 100), band: p.band, rank: p.rank }; }) : null;
  return { blocks, strength, focusShare: share, planets: readPlanets(ctx) };
}
