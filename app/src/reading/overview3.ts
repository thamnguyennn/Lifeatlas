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
  id: "lagna" | "sun" | "moon" | "link" | "elements" | "moonCycle" | "pillars" | "focus";
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

export function headline(ctx: Ctx, f: Facts): string {
  const n = ctx.n, moon = n.grahas.moon.sign, sun = n.grahas.sun.sign;
  const lag = n.lagna.sign;
  const pillar = f.order.find((id) => isGood(f.planets[id]) && id !== "rahu" && id !== "ketu");
  const tail = pillar ? `, và điểm tựa lớn nhất của bạn là ${GIFT[pillar]}` : "";
  if (ctx.noTime || ctx.uncertainMoon) {
    const need = ctx.uncertainMoon ? null : HEART[moon];
    return need
      ? `Lá số của bạn cho thấy một người nhìn nhận mình qua ${SELF[sun]}, và bên trong ${need}${tail}.`
      : `Lá số của bạn cho thấy một người nhìn nhận mình qua ${SELF[sun]}${tail}.`;
  }
  const rel = ELEMENT_OF(lag) === ELEMENT_OF(moon) ? "same" : lag % 2 === moon % 2 ? "friend" : "tension";
  const frames: Record<"same" | "friend" | "tension", string[]> = {
    same: [`Lá số của bạn cho thấy bạn là người ${FACE[lag]}, và bên trong cũng vậy: bạn ${HEART[moon]}`, `Lá số của bạn vẽ nên một người ${FACE[lag]}, mà bên trong vẫn ${HEART[moon]}`],
    friend: [`Lá số của bạn cho thấy bạn là người ${FACE[lag]}, còn bên trong bạn ${HEART[moon]}`, `Lá số của bạn vẽ nên một người ${FACE[lag]}; bên trong, bạn ${HEART[moon]}`],
    tension: [`Lá số của bạn cho thấy bạn là người ${FACE[lag]}, nhưng bên trong bạn ${HEART[moon]}`, `Lá số của bạn vẽ nên một người ${FACE[lag]}, trong khi bên trong bạn ${HEART[moon]}`],
  };
  const base = pick(frames[rel], lag + moon + sun);
  const withTail = `${base}${tail}.`;
  return withTail.split(/\s+/).length <= 52 ? withTail : `${base}.`;
}

// ------------------------------------------------------------------ the rising sign, the Sun, the Moon

const HOUSE_CLASS = (h: number) => (h === 1 ? "self" : [4, 7, 10].includes(h) ? "kendra" : [5, 9].includes(h) ? "trikona" : [6, 8, 12].includes(h) ? "dusthana" : [2, 11].includes(h) ? "dhana" : "upachaya");

function gradeClause(p: PlanetFact): string {
  const nm = nameOf(p.id);
  switch (p.grade) {
    case "strong": return `${nm} lại đang rất vững, nên điểm tựa này đáng tin`;
    case "good": return `${nm} đứng khá vững, đủ để điều ấy có sức nặng`;
    case "weak": return `${nm} còn yếu, nên phần này lớn dần theo thời gian và trải nghiệm hơn là có sẵn`;
    default: return `${nm} ở mức vừa phải, đủ dùng nhưng không nổi trội`;
  }
}

function lagnaLordSentence(f: Facts, lag: number): string {
  const L = SIGN_LORD[lag], p = f.planets[L], h = p.house!, tag = HOUSE_TAG[h - 1], nm = nameOf(L);
  const cls = HOUSE_CLASS(h);
  const lead: Record<string, string[]> = {
    self: [`${nm}, chủ của cung mọc, nằm ngay trong cung mọc, nên sức sống và hướng đi của bạn tụ về chính bản thân, ít bị chia sẻ cho nơi khác`],
    kendra: [`${nm}, người cầm lái của lá số, đứng ở nhà ${h} (${tag}), nên chuyện ${tag} là nơi bạn đặt nhiều tâm sức và cũng là nơi bạn dễ thấy mình được là mình`],
    trikona: [`${nm}, người cầm lái của lá số, đứng ở nhà ${h} (${tag}), một nhà của phúc phần, nên con đường của bạn có xu hướng đi qua ${tag} và được nâng đỡ ở đó`],
    dusthana: [`${nm}, người cầm lái của lá số, đứng ở nhà ${h} (${tag}), một nhà nhiều thử thách, nên bạn thường trưởng thành qua chính chuyện ${tag}; quãng đường ấy tốn công hơn nhưng để lại nền rất bền`],
    dhana: [`${nm}, người cầm lái của lá số, đứng ở nhà ${h} (${tag}), nên chuyện ${tag} gắn chặt với cảm giác của bạn về giá trị bản thân`],
    upachaya: [`${nm}, người cầm lái của lá số, đứng ở nhà ${h} (${tag}), một nhà của sự rèn luyện, nên bạn càng làm, càng va chạm, càng vững ở chuyện ${tag}`],
  };
  return `${pick(lead[cls], lag)}. ${gradeClause(p)}.`;
}

function conjNote(f: Facts, id: GrahaId): string | null {
  const p = f.planets[id];
  const mate = p.conj.find((o) => conjOf(id, o)) ;
  if (!mate) return null;
  const c = conjOf(id, mate)!;
  return `${nameOf(id)} ngồi cùng cung với ${nameOf(mate)}, nên ở đây thường có ${c.gift}; điều cần để ý là ${c.care}.`;
}

function lagnaBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const n = ctx.n;
  const lag = n.lagna.sign;
  const paras = [LAGNA_SIGN[lag], lagnaLordSentence(f, lag)];
  const L = SIGN_LORD[lag];
  const tenant = f.houses[0].occupants.filter((o) => o !== L);
  if (tenant.length) paras.push(`Trong chính cung mọc có ${joinVi(tenant.map(nameOf))}, nên ${tenant.length > 1 ? "những hành tinh này" : "hành tinh này"} in dấu trực tiếp lên cách bạn xuất hiện: ${tenant.map((t) => lowerFirst(PLANETS[t].gift)).join("; ")}.`);
  return {
    id: "lagna", title: "Cung mọc", role: "thân thể và cách bạn bước vào đời", sign: SIGNS[lag], paragraphs: paras,
    why: [
      `Cung mọc ${SIGNS[lag]} ${fmtDeg(n.lagna.deg)}, chòm sao ${nakName(n.lagna.nak.name)} pada ${n.lagna.nak.pada}.`,
      `Chủ cung mọc là ${nameOf(L)}: ${SIGNS[f.planets[L].sign]} ${fmtDeg(f.planets[L].g.deg)}, nhà ${f.planets[L].house}, ${DIGNITY_VI[f.planets[L].dignity].toLowerCase()}${f.planets[L].sb ? `, Shadbala ${Math.round(f.planets[L].sb!.ratio * 100)}% (hạng ${f.planets[L].sb!.rank}/7)` : ""}.`,
    ],
  };
}

function sunBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const sun = f.planets.sun;
  const paras = [SUN_SIGN[sun.sign]];
  if (sun.house) paras.push(SUN_IN[sun.house - 1]);
  if (sun.dignity === "exalted" || sun.dignity === "own" || sun.dignity === "moolatrikona") paras.push(SUN_DIGNITY.strong);
  else if (sun.dignity === "debilitated") paras.push(SUN_DIGNITY.weak);
  const c = conjNote(f, "sun");
  if (c) paras.push(c);
  return {
    id: "sun", title: "Mặt Trời", role: "bản ngã và linh hồn", sign: SIGNS[sun.sign], paragraphs: paras,
    why: [
      `Mặt Trời ${SIGNS[sun.sign]} ${fmtDeg(sun.g.deg)}${sun.house ? `, nhà ${sun.house}` : ""}, chòm sao ${nakName(sun.g.nak.name)} pada ${sun.g.nak.pada}; ${DIGNITY_VI[sun.dignity].toLowerCase()}.`,
      sun.sb ? `Shadbala ${Math.round(sun.sb.ratio * 100)}% mức cần có, hạng ${sun.sb.rank}/7.` : "",
    ].filter(Boolean),
  };
}

function moonBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const moon = f.planets.moon;
  const paras: string[] = [];
  if (ctx.uncertainMoon) paras.push("Trong ngày bạn sinh, Mặt Trăng đi sang một cung khác, nên khi chưa có giờ sinh mình chỉ đọc phần chắc chắn là chòm sao và nhịp chung của nó; cung Mặt Trăng chính xác cần giờ sinh để xác định.");
  else paras.push(MOON_SIGN[moon.sign]);
  paras.push(`${fill(MOON_NAK_LEAD, { nak: nakName(moon.g.nak.name) })} ${NAKSHATRA_TEXT[moon.g.nak.index]}`);
  if (moon.house && !ctx.uncertainMoon) paras.push(MOON_IN[moon.house - 1]);
  const c = conjNote(f, "moon");
  if (c) paras.push(c);
  return {
    id: "moon", title: "Mặt Trăng", role: "tâm trí và cảm xúc", sign: ctx.uncertainMoon ? undefined : SIGNS[moon.sign], paragraphs: paras,
    why: [
      `Mặt Trăng ${SIGNS[moon.sign]} ${fmtDeg(moon.g.deg)}${moon.house ? `, nhà ${moon.house}` : ""}, chòm sao ${nakName(moon.g.nak.name)} pada ${moon.g.nak.pada}, chủ chòm sao là ${nameOf(moon.g.nak.lord)}.`,
      moon.sb ? `Shadbala ${Math.round(moon.sb.ratio * 100)}% mức cần có, hạng ${moon.sb.rank}/7.` : "",
    ].filter(Boolean),
  };
}

/** The three keystones read against each other: element, and where the Sun and the Moon stand from one another. */
function linkBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const n = ctx.n;
  const rel = (a: Element, b: Element): "same" | "friend" | "tension" => a === b ? "same" : (a === "fire" && b === "air") || (a === "air" && b === "fire") || (a === "earth" && b === "water") || (a === "water" && b === "earth") ? "friend" : "tension";
  const el = (e: Element) => ELEMENT_VI[e].toLowerCase();
  const eS = ELEMENT_OF(n.grahas.sun.sign), eM = ELEMENT_OF(n.grahas.moon.sign);
  const paras: string[] = [];
  if (!ctx.uncertainMoon) paras.push(fill(KEY_LINK.sunMoon[rel(eS, eM)], { a: el(eS), b: el(eM) }));
  if (!ctx.noTime) {
    const eL = ELEMENT_OF(n.lagna.sign);
    paras.push(`${fill(KEY_LINK.lagnaSun[rel(eL, eS)], { a: el(eL), b: el(eS) })}${ctx.uncertainMoon ? "" : " " + fill(KEY_LINK.lagnaMoon[rel(eL, eM)], { a: el(eL), b: el(eM) })}`);
    // where the Sun and the Moon stand in the houses: same house, kendra, trine, or the difficult distances
    const hs = f.planets.sun.house!, hm = f.planets.moon.house!;
    const d = mod(hm - hs, 12) + 1;
    const tS = HOUSE_TAG[hs - 1], tM = HOUSE_TAG[hm - 1];
    if (!ctx.uncertainMoon) {
      const line = d === 1 ? `Mặt Trời và Mặt Trăng cùng đứng ở nhà ${hs}, nên điều bạn muốn thể hiện và điều bạn cần để yên lòng cùng tụ về chuyện ${tS}.`
        : [4, 7, 10].includes(d) ? `Mặt Trời ở nhà ${hs} (${tS}) và Mặt Trăng ở nhà ${hm} (${tM}) đứng ở thế vuông góc hoặc đối diện: hai chuyện này kéo bạn từ hai phía, và đời bạn khá hay đi qua lại giữa chúng.`
        : [5, 9].includes(d) ? `Mặt Trời ở nhà ${hs} (${tS}) và Mặt Trăng ở nhà ${hm} (${tM}) nằm ở thế tam hợp, một thế thuận: chuyện này nuôi chuyện kia khá tự nhiên.`
        : [6, 8].includes(d) ? `Mặt Trời ở nhà ${hs} (${tS}) và Mặt Trăng ở nhà ${hm} (${tM}) cách nhau theo thế 6/8, một thế xa nhau: điều bạn muốn thể hiện và điều bạn cần trong lòng không dễ gặp nhau, nên bạn hay phải tự nối hai đầu ấy lại.`
        : `Mặt Trời ở nhà ${hs} (${tS}) và Mặt Trăng ở nhà ${hm} (${tM}) là hai nhà kề cận về chủ đề, nên hai mảng này thường chạm vào nhau trong đời sống hằng ngày.`;
      paras.push(line);
    }
  }
  return { id: "link", title: "Ba điểm gốc đặt cạnh nhau", paragraphs: paras, why: ["Nguyên tố: Lửa, Đất, Khí, Nước theo cung; quan hệ nhà của Mặt Trời và Mặt Trăng tính theo Whole Sign từ cung mọc."] };
}

// ------------------------------------------------------------------ elements, moon cycle

function elementsBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const n = ctx.n;
  const by: Record<Element, GrahaId[]> = { fire: [], earth: [], air: [], water: [] };
  for (const id of SEVEN) by[ELEMENT_OF(n.grahas[id].sign)].push(id);
  const counts: Record<Element, number> = { fire: by.fire.length, earth: by.earth.length, air: by.air.length, water: by.water.length };
  if (!ctx.noTime) counts[ELEMENT_OF(n.lagna.sign)]++;
  const total = SEVEN.length + (ctx.noTime ? 0 : 1);
  const order = (["fire", "earth", "air", "water"] as Element[]);
  const dominant = order.find((e) => counts[e] >= Math.ceil(total / 2));
  const top = [...order].sort((a, b) => counts[b] - counts[a]);
  const missing = order.filter((e) => counts[e] === 0);
  const paras: string[] = [];
  const who = (e: Element) => by[e].length ? joinVi(by[e].map(nameOf)) : "";
  if (dominant) {
    paras.push(ELEMENT_LINES[dominant].more);
    paras.push(`${who(dominant)} ${by[dominant].length > 1 ? "đều" : ""} nằm ở các cung ${ELEMENT_VI[dominant]}${!ctx.noTime && ELEMENT_OF(n.lagna.sign) === dominant ? ", cùng với cung mọc" : ""}, nên màu ấy ngấm vào cả cách bạn nghĩ lẫn cách bạn hành động.`.replace("  ", " "));
  } else if (!missing.length && counts[top[0]] - counts[top[3]] <= 1) {
    paras.push(ELEMENT_BALANCED);
  } else {
    paras.push(`${ELEMENT_VI[top[0]]} là nguyên tố đậm nhất trong lá số của bạn (${who(top[0]) || "cung mọc"}), kế đó là ${ELEMENT_VI[top[1]]}. ${ELEMENT_LINES[top[0]].more.replace(/^[^:]+:\s*/, "").replace(/^./, (c) => c.toUpperCase())}`);
  }
  for (const e of missing.slice(0, 2)) paras.push(ELEMENT_LINES[e].none);
  const factsLine = order.map((e) => `${ELEMENT_VI[e]} ${counts[e]}`).join(" · ");
  return {
    id: "elements", title: "Bốn nguyên tố: Lửa, Đất, Khí, Nước", paragraphs: paras, facts: factsLine,
    why: order.map((e) => `${ELEMENT_VI[e]}: ${by[e].length ? joinVi(by[e].map(nameOf)) : "không có hành tinh nào"}${!ctx.noTime && ELEMENT_OF(n.lagna.sign) === e ? ", cung mọc" : ""}.`),
  };
}

function moonCycleBlock(ctx: Ctx): OverviewBlock {
  const n = ctx.n;
  const e = mod(n.grahas.moon.lon - n.grahas.sun.lon, 360);
  const tithi = Math.floor(e / 12) + 1;
  const bright = tithi <= 15;
  const k = bright ? tithi : tithi - 15;
  const el = e;
  const phase = el < 20 || el > 340 ? "new" : el >= 160 && el <= 200 ? "full" : el < 180 ? "waxing" : "waning";
  const paras = [MOON_PHASE_AT_BIRTH[phase]];
  const pos = tithi === 15 ? "đúng ngày trăng tròn" : tithi === 30 ? "đúng ngày trăng non" : `ngày thứ ${k} của nửa tháng trăng ${bright ? "đang đầy" : "đang vơi"}`;
  paras.push(`Mặt Trăng của bạn lúc chào đời đứng ở ${pos} (${phaseName(e).toLowerCase()}). Jyotish coi Mặt Trăng sáng, tức nửa đầu của tháng, là Mặt Trăng lành, còn Mặt Trăng ở nửa sau đòi thêm những khoảng nghỉ để lòng được lắng lại; ở bạn, điều ấy ${bright ? "nghiêng về phía thuận" : "nghiêng về phía cần sự riêng tư"}.`);
  return {
    id: "moonCycle", title: "Chu kỳ trăng", paragraphs: paras,
    why: [`Khoảng cách Mặt Trăng và Mặt Trời lúc sinh là ${e.toFixed(1)}°, tức tithi thứ ${tithi} trong chu kỳ 30 tithi; ${bright ? "Shukla Paksha (nửa sáng)" : "Krishna Paksha (nửa tối)"}.`],
  };
}

// ------------------------------------------------------------------ the planets that carry the chart

function whyStrong(p: PlanetFact): string[] {
  const out: string[] = [];
  if (p.dignity === "exalted") out.push("đứng ở cung vượng");
  else if (p.dignity === "own") out.push("ở ngay cung của chính nó");
  else if (p.dignity === "moolatrikona") out.push("ở cung gốc của nó");
  if (p.sb && p.sb.ratio >= 1.1) out.push(p.sb.rank === 1 ? "là hành tinh mạnh nhất lá số theo Shadbala" : `đứng thứ ${p.sb.rank} về sức mạnh theo Shadbala`);
  if (p.g.digBala) out.push("đứng đúng phương vị mạnh nhất của mình");
  if (p.g.vargottama) out.push("giữ nguyên cung ở lá số D9");
  if (!out.length && p.dignity === "friend") out.push("được tiếp đón tử tế ở cung của một hành tinh bạn");
  return out;
}

function pillarsBlock(ctx: Ctx, f: Facts): OverviewBlock {
  const ranked = f.order.filter((id) => id !== "rahu" && id !== "ketu");
  const strong = ranked.filter((id) => isGood(f.planets[id])).slice(0, 3);
  const paras: string[] = [];
  const rules = (p: PlanetFact) => (p.lorded.length ? joinVi(p.lorded.map((h) => HOUSE_SHORT[h - 1])) : "");
  const placed = (p: PlanetFact) => (p.house ? `đứng ở nhà ${p.house} (${HOUSE_TAG[p.house - 1]})` : `đứng ở cung ${SIGNS[p.sign]}`);
  if (!strong.length) {
    const first = f.planets[ranked[0]];
    paras.push(`Trong lá số của bạn không có hành tinh nào nổi trội hẳn: sức mạnh được chia khá đều, và ${nameOf(first.id)} là hành tinh có lực nhất. Điều đó nghĩa là không mảng nào được dựng sẵn và cũng không mảng nào bị bỏ rơi; kết quả đi theo công sức bạn bỏ vào từng mảng.`);
  } else {
    strong.forEach((id, i) => {
      const p = f.planets[id], reasons = whyStrong(p), why = reasons.length ? joinVi(reasons) : "đứng vững";
      const gift = GIFT[id];
      if (i === 0) {
        const flow = p.lorded.length ? `, đồng thời cai quản ${rules(p)}, nên sức vững ấy chảy thẳng vào ${p.lorded.length > 1 ? "những mảng này" : "mảng này"}` : "";
        paras.push(`${nameOf(id)} là trụ cột rõ nhất của lá số: nó ${why}. Nó ${placed(p)}${flow}. Phần ${nameOf(id)} nâng đỡ là ${gift}, và đó là chỗ bạn có thể dựa vào khi những chuyện khác chưa ổn định.`);
      } else if (i === 1) {
        paras.push(`Đứng cạnh đó là ${nameOf(id)}, hành tinh ${why}, ${placed(p)}${p.lorded.length ? ` và cai quản ${rules(p)}` : ""}. ${gift.charAt(0).toUpperCase() + gift.slice(1)} của bạn có thêm một mạch ngầm nâng đỡ từ đây.`);
      } else {
        paras.push(`${nameOf(id)} cũng đủ lực (${why}), góp thêm ${gift} làm chỗ tựa thứ ba.`);
      }
    });
  }
  const weak = ranked.map((id) => f.planets[id]).filter((p) => p.grade === "weak").sort((a, b) => a.score - b.score)[0];
  if (weak) paras.push(`Ngược lại, ${nameOf(weak.id)} là hành tinh cần nhiều thời gian nhất: ${GIFT[weak.id]} của bạn thường chín chậm hơn các mảng khác, và được đền lại khi bạn kiên nhẫn bồi đắp nó.`);
  return {
    id: "pillars", title: "Hành tinh trụ cột nâng đỡ", paragraphs: paras,
    why: [
      ...ranked.map((id) => { const p = f.planets[id]; return `${nameOf(id)}: ${DIGNITY_VI[p.dignity]}${p.sb ? `, Shadbala ${Math.round(p.sb.ratio * 100)}% (hạng ${p.sb.rank}/7)` : ""}${p.g.digBala ? ", Dig Bala" : ""}${p.g.vargottama ? ", Vargottama" : ""}${p.g.combust ? ", cháy sáng" : ""}.`; }),
      ...(ctx.sb ? [] : ["Chưa có giờ sinh nên chưa tính được Shadbala; mức vững dựa vào vị thế trong cung."]),
    ],
  };
}

// ------------------------------------------------------------------ the part of life the chart keeps coming back to

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
  // the lord of the rising sign also puts weight where it stands
  const L = f.planets[SIGN_LORD[f.n.lagna.sign]];
  byHouse[L.house! - 1] += 0.6;
  const total = byHouse.reduce((a, b) => a + b, 0);
  const byArea = FOCUS_AREAS.map((a) => a.houses.reduce((s, h) => s + byHouse[h - 1], 0));
  return { total, byHouse, byArea };
}

function focusBlock(ctx: Ctx, f: Facts): { block: OverviewBlock; share: Overview["focusShare"] } {
  const { total, byHouse, byArea } = focusWeights(f);
  const share = FOCUS_AREAS.map((a, i) => ({ title: a.title, houses: a.houses, pct: Math.round((byArea[i] / total) * 100) }));
  // an area stands out when it holds clearly more than its fair share of the twelve houses
  const scored = FOCUS_AREAS.map((a, i) => ({ a, i, excess: byArea[i] / total - a.houses.length / 12 })).sort((x, y) => y.excess - x.excess);
  const lead = scored.filter((s) => s.excess >= 0.1).slice(0, 2);
  const planetsIn = (hs: number[]) => GRAHAS.filter((id) => hs.includes(f.planets[id].house!));
  const paras: string[] = [];
  if (!lead.length) {
    paras.push("Các hành tinh của bạn trải khá đều qua nhiều mảng của đời sống, không dồn hẳn về một vùng nào. Vì vậy cuộc đời bạn không xoay quanh một chủ đề duy nhất mà thay đổi trọng tâm theo từng giai đoạn; phần đại vận sẽ cho thấy khi nào mảng nào được đặt lên trước.");
  } else {
    lead.forEach((s, k) => {
      const ids = planetsIn(s.a.houses);
      const where = [...new Set(ids.map((id) => f.planets[id].house!))].sort((a, b) => a - b);
      const list = joinVi(ids.map(nameOf));
      const strongest = ids.filter((id) => isSeven(id)).sort((a, b) => f.planets[b].score - f.planets[a].score)[0];
      if (k === 0) paras.push(`Phần lớn hành tinh của bạn tụ về vùng ${s.a.title.toLowerCase()}: ${list} nằm ở ${where.length > 1 ? "các nhà" : "nhà"} ${joinVi(where.map(String))}. Vì vậy ${s.a.says} là nơi cuộc đời hay đưa bạn trở lại, và là nơi những quyết định lớn của bạn thường được cân nhắc.${strongest ? ` ${nameOf(strongest)} là hành tinh có lực nhất ở đây, nên vùng này không chỉ đông mà còn có sức nặng.` : ""}`);
      else paras.push(`Vùng thứ hai đông hành tinh là ${s.a.title.toLowerCase()} (${list}): ${s.a.says}.`);
    });
    const empty = scored[scored.length - 1];
    if (empty.excess <= -0.1) paras.push(`Ít hành tinh nhất nằm ở vùng ${empty.a.title.toLowerCase()}; điều đó không nói rằng mảng ấy thiếu vắng, chỉ là nó ít khi là trung tâm trong cách bạn kể về đời mình, và thường chạy theo hành tinh cai quản các nhà ấy.`);
  }
  return {
    block: {
      id: "focus", title: "Nơi cuộc đời bạn xoay quanh", paragraphs: paras,
      why: [
        ...FOCUS_AREAS.map((a, i) => `${a.title} (nhà ${a.houses.join(", ")}): ${Math.round((byArea[i] / total) * 100)}% trọng lượng, ${planetsIn(a.houses).length ? joinVi(planetsIn(a.houses).map(nameOf)) : "không có hành tinh"}.`),
        "Trọng lượng: mỗi hành tinh một điểm (Rahu, Ketu 0,6; Mặt Trời và Mặt Trăng thêm 0,4; hành tinh đứng vững thêm 0,4), chủ cung mọc thêm 0,6 ở nhà nó đứng.",
        `Chi tiết từng nhà: ${byHouse.map((w, i) => `${i + 1}: ${w.toFixed(1)}`).join(" · ")}.`,
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
    ...(ctx.noTime ? [] : [{ label: "Cung mọc", value: SIGNS[n.lagna.sign], role: "thân thể và cách bạn bước vào đời" }]),
    { label: "Mặt Trời", value: SIGNS[n.grahas.sun.sign], role: "bản ngã và linh hồn" },
    ...(ctx.uncertainMoon ? [] : [{ label: "Mặt Trăng", value: SIGNS[n.grahas.moon.sign], role: "tâm trí và cảm xúc" }]),
  ];
  return { greeting: `Gửi ${greetName(ctx.name)},`, line: headline(ctx, f), chips };
}

export function readOverview(ctx: Ctx): Overview {
  const f = buildFacts(ctx);
  const blocks: OverviewBlock[] = [];
  if (!ctx.noTime) blocks.push(lagnaBlock(ctx, f));
  blocks.push(sunBlock(ctx, f), moonBlock(ctx, f), linkBlock(ctx, f), elementsBlock(ctx, f), moonCycleBlock(ctx), pillarsBlock(ctx, f));
  let share: Overview["focusShare"] = null;
  if (!ctx.noTime) { const fb = focusBlock(ctx, f); blocks.push(fb.block); share = fb.share; }
  const strength: StrengthRow[] | null = ctx.sb ? ctx.sb.order.map((id) => { const p = ctx.sb!.planets[id]; return { id, name: nameOf(id), pct: Math.round(p.ratio * 100), band: p.band, rank: p.rank }; }) : null;
  return { blocks, strength, focusShare: share, planets: readPlanets(ctx) };
}
