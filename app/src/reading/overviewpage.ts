// Life Atlas v3.0 — Concise Opening (Mở lá số) and Preliminary Overview (Tổng quan).
// Cut by ~50% per user feedback: crisp, evocative, focused primarily on Cung mọc, Mặt Trời, and Mặt Trăng.

import { SIGNS, SEVEN, SIGN_LORD, DUSTHANA, fmtDeg, NAKSHATRA_VI, mod, GRAHAS, type GrahaId } from "../engine/constants.ts";
import { dashaOrigin } from "../engine/dasha5.ts";
import type { Ctx } from "./ctx.ts";
import type { Keystone, Letter, OpeningPathway, Overview, OverviewSynthesis, PlanetRow, StrengthRow } from "./types.ts";
import { isSeven } from "../engine/shadbala.ts";
import { DIGNITY_VI, ownedHouses, planetFlags } from "./shared.ts";
import { LAGNA_SIGN, MOON_PHASE_AT_BIRTH, NAKSHATRA_TEXT } from "./content/lagna-nakshatra.ts";
import { PLANETS } from "./content/planets.ts";
import { HOUSE_TAG } from "./content/houses-signs.ts";
import {
  SUN_SIGN, SUN_DIGNITY, ELEMENT_OF, ELEMENT_VI, ELEMENT_LINES, ELEMENT_BALANCED, ELEMENT_COUNT, RETRO_LINE, STELLIUM_LINE,
  STRONG_LINE, WEAK_LINE, SHADBALA_INTRO, SHADBALA_BEST, SHADBALA_WORST, SHADBALA_ALL_FINE, MOON_SIGN,
  MOON_NAK_LEAD, LETTER_FACE, LETTER_NEED, LETTER_LINES, OVERVIEW_INTRO, LETTER_NOTE, KEY_LINK, KEY_LINK_TITLE,
  OPENING_P1_BY_PATHWAY, type Element,
} from "./content/overview.ts";
import { nameOf, domain, joinVi, fill, greetName, lowerFirst } from "./util.ts";

const nakName = (name: string) => NAKSHATRA_VI[name] ?? name;

const elemRel = (a: Element, b: Element): "same" | "friend" | "tension" =>
  a === b
    ? "same"
    : (a === "fire" && b === "air") || (a === "air" && b === "fire") || (a === "earth" && b === "water") || (a === "water" && b === "earth")
      ? "friend"
      : "tension";

function moonPhase(n: Ctx["n"]): keyof typeof MOON_PHASE_AT_BIRTH {
  const el = mod(n.grahas.moon.lon - n.grahas.sun.lon, 360);
  if (el < 20 || el > 340) return "new";
  if (el >= 160 && el <= 200) return "full";
  return el < 180 ? "waxing" : "waning";
}

const hooks = [
    [
        "Có những lúc bạn chỉ biết mình can đảm đến đâu sau khi đã bước ra nhận phần việc mà cả phòng còn ngần ngại.",
        "Có lẽ bạn dám đi xa đến thế vì trong lòng vẫn nhớ rất rõ đường về.",
        "Đôi khi cả một ngã rẽ trong đời bạn bắt đầu bằng câu hỏi mà giữa bao người, chỉ mình bạn chịu hỏi thành tiếng.",
        "Có những chuyện bạn từng nghĩ mình chẳng đủ can đảm để làm, cho đến ngày một người bạn thương cần có bạn."
    ],
    [
        "Bạn có thể quyết định trong một thoáng, nhưng điều khiến người khác nhớ về bạn lại là bao lần sau đó bạn vẫn giữ lời.",
        "Ở bên bạn lâu, người ta mới hiểu cảm giác bình yên đôi khi chỉ là biết ngày mai bạn vẫn sẽ đến như đã hẹn.",
        "Một ý nghĩ thoáng qua có thể ở lại với bạn rất lâu, đủ lâu để một ngày người khác được cầm trên tay thứ từng chỉ có trong đầu bạn.",
        "Có những lời thương bạn nói bằng cách nhớ một thói quen rất nhỏ của ai đó, cả khi chính họ đã quên từng kể cho bạn nghe."
    ],
    [
        "Đôi khi, giữa lúc kể với một người bạn thân về điều mình ấp ủ, bạn chợt biết nên bắt đầu từ đâu.",
        "Bạn có thể mải mê với bao câu hỏi mới, rồi lại muốn đem câu thú vị nhất về kể bên một mâm cơm quen.",
        "Đôi khi bạn hiểu mình nhất vào giữa một cuộc trò chuyện, khi chợt nghe chính mình nói ra điều đã nghĩ bấy lâu.",
        "Có lẽ người ta nhớ những lần trò chuyện với bạn vì có những điều chỉ khi ngồi cạnh bạn, họ mới tìm được lời để kể."
    ],
    [
        "Bạn có thể nghe một người nói rất khẽ giữa đám đông, rồi lại là người đầu tiên đứng dậy khi họ cần ai đó lên tiếng.",
        "Có lẽ cách bạn nói “mình ở đây” rõ nhất là kéo thêm một chiếc ghế và để người vừa đến ngồi bao lâu tùy thích.",
        "Bạn thường nhận ra câu chuyện vẫn còn dang dở ở đúng chỗ người kia mỉm cười và bảo rằng họ ổn.",
        "Có những người chỉ khi ngồi yên bên bạn mới nhận ra mình đã gắng gượng suốt một ngày dài."
    ]
];
function recurringTheme(ctx: Ctx) {
    const {n, noTime, uncertainMoon} = ctx;
    const scores = [0, 0, 0, 0];
    const ruler = noTime ? null : SIGN_LORD[n.lagna.sign];
    for (const [id, planet] of Object.entries(n.grahas)) {
        if (id === "moon" && uncertainMoon) continue;
        const node = id === "rahu" || id === "ketu";
        let weight = node ? 0.5 : 1;
        if (id === "sun" || id === "moon") weight += 1;
        if (id === ruler) weight += 1;
        if (["own", "exalted", "moolatrikona"].includes(planet.dignity)) weight += 0.5;
        if (ctx.sb?.order[0] === id) weight += 0.5;
        scores[planet.sign % 4] += weight;
        // Houses 1/5/9, 2/6/10, 3/7/11 and 4/8/12 describe different pursuits.
        if (!noTime) scores[(planet.house - 1) % 4] += weight * 0.65;
    }
    if (!noTime) scores[n.lagna.sign % 4] += 2;
    const highest = Math.max(...scores);
    const sunTone = n.grahas.sun.sign % 4;
    return scores[sunTone] === highest ? sunTone : scores.indexOf(highest);
}
export function readLetter(ctx: Ctx): Letter {
    const tone = ctx.uncertainMoon ? ctx.n.grahas.sun.sign : ctx.n.grahas.moon.sign;
    const line = hooks[recurringTheme(ctx)][tone % 4];
    return {line, paragraphs: [line]};
}

// Each Sun scene is an invitation to do something meaningful. The rising
// sign describes how the reader meets it. The Moon decides what makes it fit.
const invitations = [
    "Có người rủ bạn thử một việc chưa ai biết sẽ đi đến đâu. Phần hấp dẫn nhất có lẽ là được tự mình làm thử và xem chuyện gì xảy ra.",
    "Nếu được chọn một việc để dành nhiều buổi tối cho nó, bạn có thể nghiêng về thứ ngày mai còn dùng được, như một món đồ tự tay làm.",
    "Một người quen rủ bạn tìm hiểu chuyện họ vừa khám phá. Có khi điều giữ bạn ở lại là một câu nói vu vơ khiến bạn nghĩ ra thêm ba câu hỏi.",
    "Giữa những việc đáng để dành thời gian, bạn có thể để lòng mình nghiêng về việc khiến cuộc sống của một người thân dễ chịu hơn đôi chút.",
    "Ai đó mời bạn góp sức vào một việc chung. Bạn dễ thấy hào hứng nếu được mang vào đó một ý tưởng mà người quen nhìn qua cũng nhận ra là của bạn.",
    "Nhìn ai đó loay hoay với một công việc rườm rà, có thể bạn đã thấy một cách làm gọn hơn và muốn thử xem nó giúp họ được bao nhiêu.",
    "Hai người bạn quý đang muốn hai điều khác nhau. Có thể bạn thấy đáng bỏ cả một buổi để cùng họ tìm ra cách mà cả hai đều thật lòng muốn chọn.",
    "Có những câu chuyện tưởng đã rõ nhưng một chi tiết cứ khiến bạn băn khoăn. Bạn có thể quay lại tìm hiểu vì muốn biết chuyện gì thực sự đã xảy ra.",
    "Một lời rủ đi xa hay học điều lạ có thể làm bạn nghĩ mãi, nhất là khi nó hứa hẹn thay đổi cách bạn nhìn một chuyện vốn rất quen.",
    "Một việc khó có thể đáng để bạn nhận lời chỉ vì bạn hình dung được sau vài năm, thành quả ấy vẫn còn có ích cho ai đó.",
    "Khi một nhóm người cứ vướng ở cùng một chỗ, bạn có thể muốn thử đổi cách mọi người cùng làm, nhất là khi người ít tiếng nói cũng được lợi.",
    "Một câu chuyện người khác kể thoáng qua có thể theo bạn về tận nhà. Bạn muốn dành thời gian cho nó vì còn điều gì đó ở người ấy mà bạn muốn hiểu."
];
const approaches = [
    "bạn thường lên tiếng trước và sẵn lòng nhận phần thử đầu tiên",
    "bạn thường chọn một việc vừa tay để thử trước khi hứa đi đường dài",
    "bạn hay mở lời bằng một câu hỏi rồi theo đuổi chi tiết thú vị nhất trong câu trả lời",
    "bạn thường để ý xem người trong cuộc đang thấy thế nào trước khi góp ý",
    "bạn hay nói rõ điều mình tin và sẵn lòng đứng ra chịu trách nhiệm",
    "bạn dễ nhận ra bước nào làm được ngay và bắt tay vào phần cụ thể ấy",
    "bạn thường nghe thêm một phía trước khi nói mình muốn làm gì",
    "bạn thường lắng nghe khá lâu rồi mới hỏi đúng điều còn vướng trong lòng",
    "bạn hay bắt đầu bằng việc hình dung chuyện này có thể đưa mọi người đi đến đâu",
    "bạn hay tính xem mình thực sự dành được bao nhiêu thời gian rồi mới nhận lời",
    "bạn thường lùi lại nhìn cách mọi người đang làm và thử gợi một cách khác",
    "bạn thường cảm được bầu không khí giữa mọi người trước khi biết mình muốn nói gì"
];
const moonNeeds = [
    "được tự quyết bước kế tiếp, dù chỉ là một việc nhỏ có thể làm ngay chiều nay",
    "biết mình vẫn giữ được vài điều thân thuộc, như bữa tối đúng giờ sau một ngày bận rộn",
    "có ai đó chịu nghe bạn nói thành lời, kể cả khi ý nghĩ còn đang dang dở",
    "có một người thân đủ gần để bạn có thể nói thật rằng hôm nay mình mệt",
    "được người bạn quý nhìn thấy công sức của mình và nhắc đến một chi tiết họ thật lòng trân trọng",
    "biết rõ ngày mai nên bắt đầu từ đâu để có thể tạm đặt công việc xuống tối nay",
    "biết mình và người kia vẫn nói chuyện được với nhau ngay cả khi hai bên chưa đồng ý",
    "có đủ riêng tư và tin cậy để kể cả phần câu chuyện mà bạn thường giữ lại",
    "còn khoảng trời riêng để đi đâu đó, học thêm hoặc đổi góc nhìn khi thấy bế tắc",
    "biết đâu là phần của mình và phần nào mình có thể yên tâm giao lại cho người khác",
    "được giữ cách nghĩ riêng mà vẫn có một chỗ giữa những người mình quý",
    "có một quãng yên sau cuộc chuyện trò để nhận ra đâu là cảm xúc của chính mình"
];
// The same emotional need has a different place in each kind of pursuit.
const bridges = [
    ["Khi đã bắt tay vào thử, bạn dễ thấy mình đi đúng hướng nếu ", "Lúc hào hứng, bạn có thể nhận lời rất nhanh. Để hôm sau vẫn vui với lời mình đã hứa, bạn cần ", "Quyết tâm ban đầu thường sáng rõ hơn khi bạn ", "Có lúc bạn đã sẵn sàng bước tới mà lòng vẫn còn vương một chuyện. Khi ấy, điều giúp bạn an lòng là "],
    ["Giữa lúc kiên nhẫn làm cho đến nơi, có khi bạn thấy mình cần ", "Những gì bạn bỏ công vun đắp cũng nâng đỡ bạn theo một cách rất đời thường. Bạn thấy an lòng khi ", "Lắm khi phần việc đã ổn mà trong đầu bạn vẫn còn bao ý nghĩ. Lúc ấy, điều bạn cần là ", "Kết quả có thể đã đâu vào đấy mà bạn vẫn thấy thiếu một điều. Bạn dễ thở hơn khi "],
    ["Có lúc bạn đã nghe đủ các phía và chỉ muốn ", "Càng nghĩ ra nhiều khả năng, bạn càng thấy thảnh thơi khi ", "Chuyện ấy vẫn còn thú vị với bạn chừng nào bạn còn ", "Có những điều bạn đã nghĩ rất thông mà lòng vẫn chưa yên. Khi ấy, điều bạn cần là "],
    ["Sau khi đã lắng nghe đủ lâu, có lúc điều bạn mong nhất là ", "Khi đã dành nhiều tâm sức cho một chuyện, bạn dễ tìm lại nhịp của mình nếu ", "Một điều cứ quanh quẩn trong lòng có thể nhẹ đi khi bạn ", "Sau những lúc để tâm nhiều đến cảm xúc của người khác, bạn cũng cần "]
];
function buildOverviewSynthesis(ctx: Ctx): OverviewSynthesis {
    const {n, noTime, uncertainMoon} = ctx;
    const sun = n.grahas.sun.sign, moon = n.grahas.moon.sign;
    const signs = SIGNS;
    const story = [invitations[sun]];
    const anchors = [`Mặt Trời ở ${signs[sun]} gợi điều khiến bạn muốn theo đuổi việc ấy.`];
    if (!noTime) {
        const rising = n.lagna.sign;
        const entry = rising === sun ? "Khi điều ấy đáng để thử, " : "Còn lúc thực sự nhập cuộc, ";
        story[0] += " " + entry + approaches[rising] + ".";
        anchors.unshift(`Cung mọc ${signs[rising]} gợi cách bạn nhập cuộc.`);
    }
    if (uncertainMoon) {
        story.push("Ngày bạn sinh, Mặt Trăng chuyển cung. Giờ sinh sẽ giúp đọc rõ hơn cả cách bạn nhập cuộc lẫn điều khiến bạn thấy an lòng.");
    } else {
        const outer = noTime ? sun : n.lagna.sign;
        const moonLead = sun === moon
            ? "Điều khiến bạn muốn bắt đầu cũng khá gần với điều giúp bạn thấy an lòng. Bạn dễ nhận ra mình đã chọn đúng khi "
            : outer === moon ? "Cách bạn bắt đầu đã hé lộ điều bạn cần để thấy an lòng, đó là "
            : bridges[sun % 4][moon % 4];
        story.push(moonLead + moonNeeds[moon] + ".");
        anchors.push(`Mặt Trăng ở ${signs[moon]} gợi điều giúp bạn thấy an lòng.`);
    }
    if (noTime) anchors.push("Cần giờ sinh để xác định cung mọc.");
    return {paragraphs: story, anchors};
}


function strengthNote(ctx: Ctx, id: GrahaId): string | null {
  if (!ctx.sb || !isSeven(id)) return null;
  const p = ctx.sb.planets[id];
  const verdict = p.ishta >= p.kashta
    ? "phần thuận (Ishta) lớn hơn nên hành tinh này nâng đỡ bạn khá tự nhiên"
    : "phần thử thách (Kashta) nhỉnh hơn nên hành tinh này rèn bạn qua va chạm thực tế";
  return `Shadbala đạt ${Math.round(p.ratio * 100)}% ngưỡng chuẩn (hạng ${p.rank}/7). Ishta ${Math.round(p.ishta)}/60 · Kashta ${Math.round(p.kashta)}/60: ${verdict}.`;
}

export function readPlanets(ctx: Ctx): PlanetRow[] {
  const n = ctx.n;
  const sa: Record<GrahaId, string> = {
    sun: "Surya", moon: "Chandra", mars: "Mangala", mercury: "Budha", jupiter: "Guru", venus: "Shukra", saturn: "Shani", rahu: "Rahu", ketu: "Ketu",
  };
  return GRAHAS.map((id) => {
    const g = n.grahas[id];
    return {
      id, name: nameOf(id), sanskrit: sa[id], sign: SIGNS[g.sign], deg: fmtDeg(g.deg), house: ctx.noTime ? null : g.house,
      nakshatra: nakName(g.nak.name), pada: g.nak.pada, nakLord: nameOf(g.nak.lord), nakText: NAKSHATRA_TEXT[g.nak.index],
      dignity: DIGNITY_VI[g.dignity], flags: planetFlags(n, id), navamsa: SIGNS[g.navamsaSign],
      strengthNote: strengthNote(ctx, id),
    };
  });
}

export function readOverview(ctx: Ctx): Overview {
  const n = ctx.n;
  const sun = n.grahas.sun, moon = n.grahas.moon;

  // ---- the three keystones (1 concise paragraph each)
  const keystones: Keystone[] = [];
  if (!ctx.noTime) {
    keystones.push({
      id: "lagna", title: "Cung mọc", role: "dáng vẻ và cách bạn bước vào đời", sign: SIGNS[n.lagna.sign],
      paragraphs: [LAGNA_SIGN[n.lagna.sign]],
    });
  }
  const sunExtra =
    sun.dignity === "exalted" || sun.dignity === "own" || sun.dignity === "moolatrikona"
      ? ` ${SUN_DIGNITY.strong}`
      : sun.dignity === "debilitated"
        ? ` ${SUN_DIGNITY.weak}`
        : "";
  keystones.push({
    id: "sun", title: "Mặt Trời", role: "bản ngã và định hướng sống", sign: SIGNS[sun.sign],
    paragraphs: [`${SUN_SIGN[sun.sign]}${sunExtra}`],
  });
  keystones.push({
    id: "moon", title: "Mặt Trăng", role: "cảm xúc và nhịp tâm trí", sign: SIGNS[moon.sign],
    paragraphs: [
      `${MOON_SIGN[moon.sign]} ${fill(MOON_NAK_LEAD, { nak: nakName(moon.nak.name) })} ${NAKSHATRA_TEXT[moon.nak.index]}`,
    ],
  });

  // ---- common points
  const common: Overview["common"] = [];

  const counts: Record<Element, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  for (const id of SEVEN) counts[ELEMENT_OF(n.grahas[id].sign)]++;
  if (!ctx.noTime) counts[ELEMENT_OF(n.lagna.sign)]++;
  const total = SEVEN.length + (ctx.noTime ? 0 : 1);
  const parts = (["fire", "earth", "air", "water"] as Element[]).map((e) => `${ELEMENT_VI[e]} ${counts[e]}`);
  const elParas = [fill(ELEMENT_COUNT, { parts: joinVi(parts) })];
  const dominant = (Object.keys(counts) as Element[]).find((e) => counts[e] >= Math.ceil(total / 2));
  const missing = (Object.keys(counts) as Element[]).filter((e) => counts[e] === 0);
  if (dominant) elParas.push(ELEMENT_LINES[dominant].more);
  for (const e of missing.slice(0, 2)) elParas.push(ELEMENT_LINES[e].none);
  if (!dominant && !missing.length) elParas.push(ELEMENT_BALANCED);
  common.push({ id: "element", title: "Bốn nguyên tố: Lửa, Đất, Khí, Nước", paragraphs: elParas });

  const retro = (["mars", "mercury", "jupiter", "venus", "saturn"] as GrahaId[]).filter((id) => n.grahas[id].retro);
  if (retro.length) {
    common.push({
      id: "retro", title: "Hành tinh nghịch hành lúc sinh",
      paragraphs: [fill(RETRO_LINE, { list: joinVi(retro.map(nameOf)), it: retro.length === 1 ? "nó" : "chúng" })],
    });
  }

  const bySign = new Map<number, GrahaId[]>();
  for (const id of SEVEN) bySign.set(n.grahas[id].sign, [...(bySign.get(n.grahas[id].sign) ?? []), id]);
  const crowded = [...bySign.entries()].find(([, ids]) => ids.length >= 3);
  if (crowded) {
    const [sign, ids] = crowded;
    const h = ctx.noTime ? null : n.grahas[ids[0]].house;
    common.push({
      id: "crowd", title: "Vùng tụ hội nhiều hành tinh nhất",
      paragraphs: [
        h
          ? `${fill(STELLIUM_LINE, { k: ids.length, n: h, tag: `cung ${SIGNS[sign]}`, domain: HOUSE_TAG[h - 1] })} Các hành tinh tại đây gồm ${joinVi(ids.map(nameOf))}.`
          : `Có ${ids.length} hành tinh (${joinVi(ids.map(nameOf))}) cùng đứng ở cung ${SIGNS[sign]}, dồn trọng lực về chủ đề của cung này.`,
      ],
    });
  }

  common.push({ id: "phase", title: "Pha trăng lúc bạn chào đời", paragraphs: [MOON_PHASE_AT_BIRTH[moonPhase(n)]] });

  const strong = SEVEN.filter((id) => ["exalted", "own", "moolatrikona"].includes(n.grahas[id].dignity));
  const weak = SEVEN.filter((id) => n.grahas[id].dignity === "debilitated");
  if (strong.length || weak.length) {
    const paras: string[] = [];
    if (strong.length) paras.push(fill(STRONG_LINE, { list: joinVi(strong.map(nameOf)), it: strong.length === 1 ? "nó" : "chúng" }));
    if (weak.length) paras.push(fill(WEAK_LINE, { list: joinVi(weak.map(nameOf)), it: weak.length === 1 ? "nó" : "chúng" }));
    common.push({ id: "dignity", title: "Vị thế nổi bật của các hành tinh", paragraphs: paras });
  }

  let strength: Overview["strength"] = null;
  if (ctx.sb) {
    const rows: StrengthRow[] = ctx.sb.order.map((id) => {
      const p = ctx.sb!.planets[id];
      return { id, name: nameOf(id), pct: Math.round(p.ratio * 100), band: p.band, rank: p.rank };
    });
    const best = ctx.sb.planets[ctx.sb.order[0]], worst = ctx.sb.planets[ctx.sb.order[6]];
    const roleOf = (id: GrahaId) => lowerFirst(PLANETS[id].role);
    strength = {
      intro: SHADBALA_INTRO, rows,
      best: fill(SHADBALA_BEST, { p: nameOf(best.id), pct: Math.round(best.ratio * 100), role: roleOf(best.id) }),
      worst: worst.ratio >= 1 ? SHADBALA_ALL_FINE : fill(SHADBALA_WORST, { p: nameOf(worst.id), pct: Math.round(worst.ratio * 100), role: roleOf(worst.id) }),
    };
  }

  const el = (e: Element) => ELEMENT_VI[e].toLowerCase();
  const eSun = ELEMENT_OF(sun.sign), eMoon = ELEMENT_OF(moon.sign);
  const linkParas = [fill(KEY_LINK.sunMoon[elemRel(eSun, eMoon)], { a: el(eSun), b: el(eMoon) })];
  if (!ctx.noTime) {
    const eLag = ELEMENT_OF(n.lagna.sign);
    linkParas.push(`${fill(KEY_LINK.lagnaSun[elemRel(eLag, eSun)], { a: el(eLag), b: el(eSun) })} ${fill(KEY_LINK.lagnaMoon[elemRel(eLag, eMoon)], { a: el(eLag), b: el(eMoon) })}`);
  }

  const synthesis = buildOverviewSynthesis(ctx);

  return {
    intro: OVERVIEW_INTRO,
    synthesis,
    keystones,
    link: { title: KEY_LINK_TITLE, paragraphs: linkParas },
    common,
    strength,
    planets: readPlanets(ctx),
  };
}
