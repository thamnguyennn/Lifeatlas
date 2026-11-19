// "Khám phá thêm": câu hỏi cụ thể về bản thân, đọc từ lá số thay vì từ từng cấu trúc. Mỗi chủ đề có một nhận định, hai ba điểm
// nổi bật và phần "Vì sao mình nói điều này?". Mọi câu đều đi ra từ facts.ts: nhà nào vững, hành tinh nào khỏe, yoga nào đi qua.
import { SIGNS, type GrahaId } from "../engine/constants.ts";
import { vargaChart } from "../engine/vargas.ts";
import type { Ctx } from "./ctx.ts";
import { buildFacts, effectiveYoga, isGood, HOUSE_SHORT, type Facts, type PlanetFact } from "./facts.ts";
import { nameOf, joinVi, lowerFirst } from "./util.ts";

export interface ExploreTopic {
  id: string;
  title: string;
  ask: string;
  lead: string;
  points: { title: string; text: string }[];
  why: string[];
  /** The topic needs the birth time (houses); false means it still reads with only the planets. */
  needsTime: boolean;
}
export interface ExploreGroup { id: string; title: string; intro: string; topics: ExploreTopic[] }

interface Spec {
  id: string; title: string; ask: string; houses: number[]; planets: GrahaId[];
  /** What each planet stands for in this topic. */
  lens: Partial<Record<GrahaId, string>>;
  strong: string; weak: string; mid: string;
  needsTime?: boolean;
}

const SPECS: Spec[] = [
  { id: "talent", title: "Năng khiếu", ask: "Bạn học nhanh, sáng tạo hay giỏi nhất ở kiểu việc nào?", houses: [1, 3, 5, 9], planets: ["mercury", "jupiter", "venus", "mars"],
    lens: { mercury: "học, phân tích và diễn đạt", jupiter: "hiểu sâu, dạy và định hướng", venus: "thẩm mỹ và sáng tạo", mars: "thực hành kỹ thuật và hành động", sun: "lãnh đạo và tạo dấu ấn", saturn: "tổ chức và bền bỉ" },
    strong: "Bạn có nhiều năng khiếu có chỗ dựa thật, nên cứ thử là sẽ thấy mình có đà.", weak: "Năng khiếu của bạn không lộ sớm; chúng đến từ luyện tập đều hơn là thiên phú.", mid: "Năng khiếu của bạn nghiêng rõ về vài hướng, các hướng còn lại cần tập thêm." },
  { id: "career", title: "Nghề nghiệp", ask: "Môi trường, vai trò và nhóm nghề nào hợp với bạn?", houses: [2, 6, 10, 11], planets: ["sun", "saturn", "mercury", "mars"],
    lens: { sun: "vai trò đứng ra chịu trách nhiệm, quản lý", saturn: "việc cần kỷ luật, hệ thống, quy trình", mercury: "nghiên cứu, kinh doanh, giao tiếp", mars: "việc cần sức bật, kỹ thuật, cạnh tranh", jupiter: "giáo dục, tư vấn, hướng dẫn", venus: "sáng tạo, dịch vụ, làm đẹp" },
    strong: "Lá số cho bạn nhiều chỗ dựa trong chuyện nghề: bạn có thể đi xa trong những vai trò đòi trách nhiệm.", weak: "Nghề của bạn cần xây bằng kỹ năng thật và nếp làm việc đều; chỗ dựa có sẵn không nhiều.", mid: "Nghề nghiệp của bạn có vài mạch tốt, hợp với việc chọn đúng một hướng và đi sâu." },
  { id: "money", title: "Tài chính", ask: "Bạn tạo dựng và giữ nguồn lực theo cách nào?", houses: [2, 5, 9, 11], planets: ["jupiter", "venus", "mercury", "saturn"],
    lens: { jupiter: "tích lũy và may mắn tài chính", venus: "tiền đến từ quan hệ, thẩm mỹ, dịch vụ", mercury: "tiền từ trí óc, buôn bán, thông tin", saturn: "tiền bền, chậm mà chắc", mars: "tiền từ sức bật, đất đai", sun: "tiền từ vị thế" },
    strong: "Nền tài chính của bạn có nhiều chỗ dựa; điều cần là quản lý đều để chúng phát huy.", weak: "Tài chính của bạn dễ thất thường hơn mức trung bình; kế hoạch rõ ràng và quỹ dự phòng quan trọng hơn người khác.", mid: "Tài chính của bạn có thuận có khó; thu nhập thường tốt hơn khả năng giữ hoặc ngược lại." },
  { id: "leader", title: "Lãnh đạo", ask: "Bạn dẫn dắt người khác theo kiểu nào?", houses: [1, 3, 10], planets: ["sun", "mars", "jupiter", "saturn"],
    lens: { sun: "uy tín và sự hiện diện", mars: "quyết đoán và dám làm trước", jupiter: "dẫn dắt bằng tầm nhìn và sự công bằng", saturn: "dẫn dắt bằng kỷ luật và sự bền", mercury: "dẫn dắt bằng lời nói và sự rõ ràng", moon: "dẫn dắt bằng sự thấu hiểu" },
    strong: "Bạn có đủ nền để đứng đầu một nhóm, và người khác có xu hướng tin ở bạn.", weak: "Bạn ít tự nhiên ở vị trí đứng đầu; sự dẫn dắt của bạn mạnh nhất khi ở cạnh người cùng làm.", mid: "Sự dẫn dắt của bạn có phong cách riêng, hợp với những tình huống cụ thể hơn là mọi tình huống." },
  { id: "study", title: "Học tập", ask: "Bạn tiếp thu và nhớ điều gì tốt nhất, và cách học nào hợp?", houses: [4, 5, 9], planets: ["mercury", "jupiter", "moon"],
    lens: { mercury: "ghi nhớ, phân tích và diễn đạt", jupiter: "hiểu bản chất và học lên cao", moon: "học khi thấy an toàn và hứng thú", saturn: "học sâu bằng kiên nhẫn", venus: "học qua hình ảnh, nghệ thuật" },
    strong: "Nền học tập của bạn tốt: bạn tiếp thu nhanh khi có hứng và có người dẫn.", weak: "Học tập với bạn cần một phương pháp riêng; học theo khuôn chung dễ nản.", mid: "Bạn học giỏi ở một số lĩnh vực và mất hứng ở lĩnh vực khác; chọn đúng môn quan trọng hơn học nhiều." },
  { id: "health", title: "Sức khỏe và nhịp sống", ask: "Năng lượng của bạn đến từ đâu, và nhịp sống nào hợp với bạn?", houses: [1, 6, 8, 12], planets: ["sun", "moon", "mars", "saturn"],
    lens: { sun: "sinh lực chung", moon: "tâm trí, giấc ngủ và nhịp sinh hoạt", mars: "sức bật và việc vận động", saturn: "độ bền, khả năng duy trì thói quen", mercury: "thần kinh và tiêu hóa nhẹ", jupiter: "sự hồi phục" },
    strong: "Nền sinh lực của bạn khá tốt và hồi phục nhanh khi nghỉ đúng cách.", weak: "Năng lượng của bạn dễ hao nếu sống thiếu nhịp; ngủ, ăn và nghỉ đều quan trọng hơn mức thường.", mid: "Sinh lực của bạn lên xuống theo nhịp; biết lúc nào cần nghỉ là chìa khóa.",
    },
  { id: "family", title: "Gia đình", ask: "Gia đình đóng vai trò gì trong đời bạn, và bạn tạo ra điều gì cho nhà mình?", houses: [2, 4, 12], planets: ["moon", "sun", "jupiter", "venus"],
    lens: { moon: "mẹ và cảm giác an toàn", sun: "cha và nền nếp", jupiter: "sự che chở và hậu phương", venus: "sự gắn bó và hòa thuận", mars: "anh em và nhà đất", saturn: "trách nhiệm với gia đình" },
    strong: "Gia đình là chỗ dựa thật của bạn, và bạn cũng là người giữ nhịp cho nhà mình.", weak: "Gia đình là bài học nhiều hơn là chỗ tựa; bạn học dựng cho mình một mái ấm theo cách riêng.", mid: "Gia đình vừa là nguồn nâng đỡ vừa là chỗ có nhiều chuyện phải dung hòa." },
  { id: "dharma", title: "Dharma", ask: "Điều gì cho cuộc đời bạn một hướng đi, và bạn thấy có ý nghĩa nhất khi làm gì?", houses: [1, 5, 9, 10], planets: ["jupiter", "sun", "saturn"],
    lens: { jupiter: "niềm tin và điều bạn coi là đúng", sun: "mục đích và điều bạn muốn để lại", saturn: "trách nhiệm dài hạn", moon: "điều làm lòng bạn yên", venus: "điều bạn thấy đẹp và đáng gìn giữ" },
    strong: "Hướng đi của bạn khá rõ khi bạn lắng nghe chính mình; lá số cho nhiều chỗ dựa cho điều ấy.", weak: "Hướng đi của bạn không rõ ngay; nó hiện ra dần qua trải nghiệm hơn là có sẵn từ đầu.", mid: "Hướng đi của bạn có vài mạch ý nghĩa song song; bạn cần chọn mạch nào đáng đi lâu nhất." },
  { id: "love", title: "Phong cách yêu", ask: "Bạn yêu và muốn được yêu như thế nào?", houses: [5, 7, 11], planets: ["venus", "moon", "mars", "jupiter"],
    lens: { venus: "cách bạn yêu và muốn được yêu", moon: "nhu cầu an toàn trong tình cảm", mars: "đam mê và sự chủ động", jupiter: "sự chân thành và tin vào nhau", mercury: "yêu qua trò chuyện", saturn: "yêu chậm và chắc" },
    strong: "Tình cảm của bạn có nhiều chỗ dựa; bạn biết cho đi và nhận lại tương đối cân bằng.", weak: "Tình cảm là chỗ cần chăm với bạn; bạn dễ giữ khoảng cách hoặc khó mở lòng ngay.", mid: "Phong cách yêu của bạn có những nét rất rõ cùng vài vùng cần học hỏi." },
  { id: "marriage", title: "Hôn nhân", ask: "Bạn cần gì trong một mối quan hệ cam kết lâu dài?", houses: [2, 7, 8], planets: ["venus", "jupiter", "saturn"],
    lens: { venus: "sự gắn bó và hòa hợp", jupiter: "sự đồng hành và niềm tin chung", saturn: "sự bền bỉ và trách nhiệm", mars: "đam mê và va chạm", moon: "cảm giác an toàn cùng nhau" },
    strong: "Nền hôn nhân trong lá số khá vững; điều cần là chọn người cùng nhịp và nói rõ điều mình cần.", weak: "Chuyện cam kết đến chậm hoặc cần nhiều chăm sóc; chọn kỹ và đi từ từ có lợi cho bạn.", mid: "Chuyện cam kết có thuận có khó; nó tốt dần khi bạn hiểu rõ mình." },
  { id: "inner", title: "Mâu thuẫn nội tâm", ask: "Trong bạn có những giằng co nào, và chúng đến từ đâu?", houses: [1, 4, 8, 12], planets: ["moon", "saturn", "mars", "rahu"],
    lens: { moon: "điều lòng bạn cần", saturn: "sự tự nghiêm khắc và nỗi lo", mars: "cơn nóng và sự bực bội", rahu: "khát vọng lớn hơn mức hiện tại", ketu: "cảm giác tách rời, buông", sun: "cái tôi và sự công nhận" },
    strong: "Bạn có nhiều giằng co nhưng cũng đủ sức nội tâm để nhìn thẳng vào chúng.", weak: "Bạn nhạy với những giằng co bên trong; viết ra, nói ra và có nhịp nghỉ rõ giúp bạn nhẹ đi nhiều.", mid: "Những giằng co của bạn có tên gọi rõ ràng; nhận ra chúng là bước đầu để bớt bị chúng dẫn." },
];

const GROUPS: { id: string; title: string; intro: string; ids: string[] }[] = [
  { id: "relations", title: "Kết nối và các mối quan hệ", intro: "Cách bạn yêu, cam kết, và hợp với ai.", ids: ["love", "marriage"] },
  { id: "potential", title: "Tiềm năng và con đường phát triển", intro: "Điều bạn làm tốt và nơi nó dẫn bạn tới.", ids: ["talent", "career", "money", "leader", "study"] },
  { id: "inside", title: "Đời sống và chiều sâu nội tâm", intro: "Năng lượng, gia đình, ý nghĩa và những giằng co bên trong.", ids: ["health", "family", "dharma", "inner"] },
];

const tierWord = { top: "vững", mid: "ở mức giữa bảng", low: "mỏng hơn các nhà khác" } as const;
const gradeWord = (p: PlanetFact) => (p.grade === "strong" ? "rất vững" : p.grade === "good" ? "khá vững" : p.grade === "weak" ? "còn yếu" : "ở mức vừa");

function build(ctx: Ctx, F: Facts, s: Spec): ExploreTopic {
  const noTime = F.noTime;
  const ps = s.planets.map((id) => F.planets[id]);
  const hs = noTime ? [] : s.houses.map((h) => F.houses[h - 1]);
  const goodP = ps.filter(isGood).length, goodH = hs.filter((h) => h.tier === "top").length, lowH = hs.filter((h) => h.tier === "low").length;
  const net = goodP / ps.length + (hs.length ? (goodH - lowH) / hs.length : 0) / 1;
  const lead = net >= 0.75 ? s.strong : net <= 0.1 ? s.weak : s.mid;
  const points: ExploreTopic["points"] = [];

  const best = [...ps].sort((a, b) => b.score - a.score)[0], worst = [...ps].sort((a, b) => a.score - b.score)[0];
  points.push({ title: `${nameOf(best.id)}: chỗ mạnh nhất`, text: `${nameOf(best.id)} đại diện cho ${s.lens[best.id] ?? "chủ đề này"}; trong lá số của bạn nó ${gradeWord(best)}${best.house ? `, đứng ở nhà ${best.house} (${HOUSE_SHORT[best.house - 1]})` : `, ở ${SIGNS[best.sign]}`}. Đây là mạch bạn nên dựa vào đầu tiên.` });
  if (worst.id !== best.id && (worst.grade === "weak" || worst.grade === "mixed")) points.push({ title: `${nameOf(worst.id)}: chỗ cần chăm`, text: `${nameOf(worst.id)} đại diện cho ${s.lens[worst.id] ?? "chủ đề này"} và ${gradeWord(worst)}${worst.house ? `, ở nhà ${worst.house} (${HOUSE_SHORT[worst.house - 1]})` : ""}. Phần này không tự đến; hãy cho nó thời gian và nếp luyện đều.` });
  if (hs.length) {
    const top = [...hs].sort((a, b) => (a.tier === "top" ? 0 : a.tier === "mid" ? 1 : 2) - (b.tier === "top" ? 0 : b.tier === "mid" ? 1 : 2) || b.sav - a.sav)[0];
    const low = [...hs].reverse().find((h) => h.tier === "low");
    points.push({ title: `Nhà ${top.n}: ${HOUSE_SHORT[top.n - 1]}`, text: `Nhà ${top.n} (${HOUSE_SHORT[top.n - 1]}) có nền ${tierWord[top.tier]}; chủ nhà là ${nameOf(top.lord)} ở nhà ${top.lordHouse}${top.occupants.length ? `, và có ${joinVi(top.occupants.map(nameOf))} ngồi trong nhà` : ""}.${low && low.n !== top.n ? ` Ngược lại nhà ${low.n} (${HOUSE_SHORT[low.n - 1]}) mỏng hơn, nên đó là nơi cần kiên nhẫn hơn.` : ""}` });
    const ys = F.houses.filter((h) => s.houses.includes(h.n)).flatMap((h) => h.yogas.filter(effectiveYoga)).filter((y, i, a) => a.findIndex((z) => z.id === y.id) === i).slice(0, 2);
    if (ys.length) points.push({ title: "Tổ hợp hỗ trợ", text: `${joinVi(ys.map((y) => y.name))} đi qua những nhà này, nên ${lowerFirst(s.title)} của bạn có thêm một lớp nâng đỡ ngoài các chỉ báo trên.` });
  }
  const extra = special(ctx, F, s);
  if (extra) points.push(extra);
  return {
    id: s.id, title: s.title, ask: s.ask, lead, points: points.slice(0, 3), needsTime: !!s.needsTime,
    why: [
      ...ps.map((p) => `${nameOf(p.id)}: ${SIGNS[p.sign]}${p.house ? `, nhà ${p.house}` : ""}, ${p.dignity}, điểm ${p.score.toFixed(1)} (${p.grade}).`),
      ...hs.map((h) => `Nhà ${h.n} (${SIGNS[h.sign]}): chủ ${nameOf(h.lord)}, SAV ${h.sav}, nền ${tierWord[h.tier]}.`),
      noTime ? "Chưa có giờ sinh nên mình chỉ đọc từ vị trí các hành tinh, không đọc các nhà." : "",
    ].filter(Boolean),
  };
}

function special(ctx: Ctx, F: Facts, s: Spec): { title: string; text: string } | null {
  const n = ctx.n;
  if (s.id === "marriage" && !F.noTime) {
    const d9 = vargaChart(n, 9);
    return { title: "Lớp cam kết ở D9", text: `Cung mọc của D9 là ${SIGNS[d9.lagnaSign]}; Sao Kim ở D9 là ${SIGNS[d9.planets.venus.sign]} (${d9.planets.venus.dignity}). Đây là lớp cho thấy bạn cam kết thế nào khi trưởng thành. Trang D9 trong phần Biểu đồ chuyên sâu đọc kỹ hơn.` };
  }
  if (s.id === "inner") {
    const m = F.planets.moon, pairs = (["saturn", "mars", "rahu", "ketu"] as GrahaId[]).filter((id) => F.planets[id].sign === m.sign);
    const asp = (["saturn", "mars"] as GrahaId[]).filter((id) => m.aspectedBy.includes(id));
    const hard = [...new Set([...pairs, ...asp])];
    if (hard.length) return { title: "Mặt Trăng đang bị chạm", text: `Mặt Trăng, nơi giữ cảm xúc của bạn, ${pairs.length ? `ở cùng cung với ${joinVi(pairs.map(nameOf))}` : `bị ${joinVi(asp.map(nameOf))} nhìn vào`}. Nó làm tâm trí bạn sâu hơn nhưng cũng dễ căng; bạn nhẹ đi khi có nhịp nghỉ và một nơi để nói ra.` };
    return { title: "Mặt Trăng khá yên", text: "Mặt Trăng của bạn không bị hành tinh khó nào chạm trực tiếp, nên những giằng co của bạn thiên về do hoàn cảnh hơn là do tính khí." };
  }
  if (s.id === "career" && !F.noTime) {
    const d10 = vargaChart(n, 10);
    return { title: "Lớp nghề ở D10", text: `Cung mọc của D10 là ${SIGNS[d10.lagnaSign]} và chủ nhà 10 ở D1 (${nameOf(F.houses[9].lord)}) đứng ở ${SIGNS[d10.planets[F.houses[9].lord].sign]} trong D10. Đây là lớp nói về cách bạn gánh vai trò, không phải chức danh.` };
  }
  if (s.id === "money" && !F.noTime) {
    return { title: "Hai nhà của dòng tiền", text: `Nhà 2 (tích lũy) có nền ${tierWord[F.houses[1].tier]}, nhà 11 (thu nhập) có nền ${tierWord[F.houses[10].tier]}. ${F.houses[10].tier === "top" && F.houses[1].tier !== "top" ? "Bạn kiếm tốt hơn giữ; chia ra một phần cố định mỗi lần có thu nhập." : F.houses[1].tier === "top" && F.houses[10].tier !== "top" ? "Bạn giữ tốt hơn kiếm; hãy mở thêm nguồn thu thay vì chỉ tiết kiệm." : "Hai khả năng này ở mức gần nhau."}` };
  }
  if (s.id === "health") return { title: "Lưu ý", text: "Phần này nói về nhịp sống và sinh lực theo truyền thống, không thay thế chẩn đoán hay lời khuyên y tế." };
  return null;
}

export function readExplore(ctx: Ctx): ExploreGroup[] {
  const F = buildFacts(ctx);
  const byId = new Map(SPECS.map((s) => [s.id, build(ctx, F, s)]));
  return GROUPS.map((g) => ({ id: g.id, title: g.title, intro: g.intro, topics: g.ids.map((id) => byId.get(id)!) }));
}
