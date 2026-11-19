// "Khám phá thêm": practical questions answered from the whole chart. Each topic is a set of facets (a capability, or a
// sub-question). A facet scores itself from the facts (planet condition, houses, lords, yogas) and keeps the evidence it used.
// Only facets with enough evidence are shown; the central conclusion is built from the facets that came out on top.
// The prose talks about the person (what it looks like, what helps it grow, what limits it); the planets and houses are in `why`.
import { SIGNS, SIGN_LORD, FRIENDS, ENEMIES, mod, type GrahaId } from "../engine/constants.ts";
import { vargaChart } from "../engine/vargas.ts";
import type { Ctx } from "./ctx.ts";
import { buildFacts, effectiveYoga, type Facts, type PlanetFact } from "./facts.ts";
import { HOUSE_TAG } from "./content/houses-signs.ts";
import { ELEMENT_OF } from "./content/overview.ts";
import { DIGNITY_VI } from "./shared.ts";
import { nameOf, joinVi } from "./util.ts";

export interface ExploreFacet { title: string; text: string }
export interface ExploreTopic {
  id: string;
  title: string;
  ask: string;
  lead: string;
  points: ExploreFacet[];
  why: string[];
  needsTime: boolean;
}
export interface ExploreGroup { id: string; title: string; intro: string; topics: ExploreTopic[] }

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const area = (h: number) => HOUSE_TAG[h - 1];

// ------------------------------------------------------------------ evidence helpers

interface Sig { s: number; why: string[]; good: string[]; bad: string[] }
const sig = (): Sig => ({ s: 0, why: [], good: [], bad: [] });

function planet(S: Sig, F: Facts, id: GrahaId, w: number, helps: string, hurts?: string) {
  const p = F.planets[id];
  const v = (p.grade === "strong" ? 1 : p.grade === "good" ? 0.6 : p.grade === "weak" ? -0.6 : 0.1) * w;
  S.s += v;
  S.why.push(`${nameOf(id)}: ${SIGNS[p.sign]}${p.house ? `, nhà ${p.house}` : ""}, ${DIGNITY_VI[p.dignity].toLowerCase()}, điểm ${p.score.toFixed(1)}${p.g.combust ? ", cháy sáng" : ""}.`);
  if (v > 0.3) S.good.push(helps);
  if (v < 0 && hurts) S.bad.push(hurts);
  if (p.g.combust && hurts) S.bad.push(hurts);
}
function house(S: Sig, F: Facts, h: number, w: number, helps: string, hurts?: string) {
  if (F.noTime) return;
  const hf = F.houses[h - 1];
  const v = (hf.tier === "top" ? 0.8 : hf.tier === "low" ? -0.6 : 0.1) * w + (hf.sav >= 30 ? 0.2 : hf.sav <= 24 ? -0.2 : 0) * w;
  S.s += v;
  S.why.push(`Nhà ${h} (${SIGNS[hf.sign]}): chủ ${nameOf(hf.lord)} ở nhà ${hf.lordHouse}, SAV ${hf.sav}${hf.bhava ? `, Bhava Bala hạng ${hf.bhava.rank}` : ""}${hf.occupants.length ? `, có ${joinVi(hf.occupants.map(nameOf))}` : ""}.`);
  if (v > 0.3) S.good.push(helps);
  if (v < -0.2 && hurts) S.bad.push(hurts);
}
function inHouses(S: Sig, F: Facts, id: GrahaId, hs: number[], w: number, note: string) {
  const p = F.planets[id];
  if (p.house && hs.includes(p.house)) { S.s += w; S.good.push(note); S.why.push(`${nameOf(id)} ở nhà ${p.house}.`); }
}
function yoga(S: Sig, F: Facts, test: (id: string) => boolean, w: number, note: string) {
  const ys = F.n.yogas.filter((y) => effectiveYoga(y) && test(y.id));
  if (ys.length) { S.s += w; S.good.push(note); S.why.push(`Yoga: ${joinVi(ys.map((y) => y.name))}.`); }
}
const friendly = (a: GrahaId, b: GrahaId) => a === b || (!!FRIENDS[a]?.includes(b) && !ENEMIES[b]?.includes(a));
const hostile = (a: GrahaId, b: GrahaId) => !!ENEMIES[a]?.includes(b) || !!ENEMIES[b]?.includes(a);

interface FacetDef { title: string; eval: (F: Facts, ctx: Ctx) => Sig; show: string; grow: string; limit: string }
interface Built { title: string; score: number; text: string; why: string[] }

function runFacets(F: Facts, ctx: Ctx, defs: FacetDef[], min = 0.9, max = 3): Built[] {
  const all = defs.map((d) => { const S = d.eval(F, ctx); return { d, S }; }).sort((a, b) => b.S.s - a.S.s);
  let chosen = all.filter((x) => x.S.s >= min).slice(0, max);
  if (chosen.length < 2) chosen = all.slice(0, 2);
  return chosen.map(({ d, S }) => {
    const lim = S.bad.length ? ` Có điều, ${d.limit}` : "";
    return { title: d.title, score: S.s, text: `${d.show} ${d.grow}${lim}`.replace(/\s+/g, " ").trim(), why: [...S.why, ...(S.good.length ? [`Căn cứ: ${joinVi([...new Set(S.good)])}.`] : []), ...(S.bad.length ? [`Hạn chế: ${joinVi([...new Set(S.bad)])}.`] : [])] };
  });
}

// ------------------------------------------------------------------ B4 talents

const TALENTS: FacetDef[] = [
  { title: "Tư duy phân tích và giải quyết vấn đề", show: "Bạn có xu hướng nhìn một việc bằng cách tách nó ra từng phần, tìm chỗ không khớp và sửa cho đúng.", grow: "Năng lực này lớn nhanh khi bạn có những bài toán thật để giải, có dữ liệu, có phản hồi rõ ràng.", limit: "khi quá tải, óc phân tích dễ quay sang lo nghĩ và soi lỗi chính mình.",
    eval: (F) => { const S = sig(); planet(S, F, "mercury", 1.2, "trí óc sắc", "trí óc dễ bị quá tải"); house(S, F, 6, 0.8, "khả năng xử lý vấn đề hằng ngày tốt", "áp lực công việc hằng ngày lớn"); inHouses(S, F, "mercury", [3, 6, 10, 11], 0.4, "trí óc được đặt ở chỗ cần làm việc thực tế"); planet(S, F, "saturn", 0.4, "sự kiên nhẫn với chi tiết"); yoga(S, F, (id) => id === "budhaditya" || id === "mahapurusha_bhadra", 0.6, "một tổ hợp cổ điển về trí tuệ"); return S; } },
  { title: "Sáng tạo và thẩm mỹ", show: "Bạn nhạy với cái đẹp, với cách một thứ được làm ra và cảm giác nó để lại.", grow: "Nó phát triển khi bạn có thời gian tự do để thử, và có người thật sự xem hoặc dùng thứ bạn làm ra.", limit: "khi phải chứng minh ngay, sự sáng tạo dễ tắc lại.",
    eval: (F) => { const S = sig(); planet(S, F, "venus", 1.2, "cảm nhận thẩm mỹ tốt", "gu thẩm mỹ cần thời gian định hình"); house(S, F, 5, 0.9, "nguồn sáng tạo dồi dào", "niềm vui sáng tạo dễ bị việc khác lấn át"); planet(S, F, "moon", 0.5, "trí tưởng tượng giàu"); inHouses(S, F, "venus", [1, 4, 5, 7, 10], 0.4, "thẩm mỹ hiện ra rõ trong đời sống"); yoga(S, F, (id) => id === "mahapurusha_malavya", 0.7, "một tổ hợp cổ điển về nghệ thuật và duyên dáng"); return S; } },
  { title: "Giao tiếp và ngôn ngữ", show: "Bạn có khả năng diễn đạt điều mình nghĩ cho người khác hiểu, bằng lời nói hoặc chữ viết.", grow: "Nó mạnh lên khi bạn viết, dạy, thuyết trình hoặc làm việc cần thuyết phục người khác.", limit: "lời nói đôi khi nhanh hơn sự cân nhắc.",
    eval: (F) => { const S = sig(); planet(S, F, "mercury", 1, "trí óc linh hoạt", "lời nói dễ vội"); house(S, F, 2, 0.6, "lời nói có trọng lượng", "lời nói dễ gây hiểu lầm"); house(S, F, 3, 0.7, "khả năng viết và trao đổi tốt", "cần luyện để tự tin diễn đạt"); planet(S, F, "jupiter", 0.3, "hiểu biết rộng để nói có nội dung"); return S; } },
  { title: "Tổ chức và quản lý", show: "Bạn có xu hướng thấy được toàn cảnh, sắp xếp người và việc theo thứ tự, và chịu trách nhiệm đến cùng.", grow: "Nó phát huy khi bạn được giao một phạm vi rõ ràng và quyền quyết định tương xứng.", limit: "dễ ôm việc của người khác vì thấy mình làm nhanh hơn.",
    eval: (F) => { const S = sig(); planet(S, F, "saturn", 1, "sức bền và tính hệ thống", "khó duy trì kỷ luật lâu"); planet(S, F, "sun", 0.8, "ý chí dẫn dắt", "ngại đứng ra chịu trách nhiệm"); house(S, F, 10, 0.8, "vị trí nghề nghiệp có chỗ dựa", "vị trí nghề nghiệp đến chậm"); yoga(S, F, (id) => id === "mahapurusha_shasha" || id.startsWith("raja"), 0.6, "tổ hợp về vị thế và quyền điều hành"); return S; } },
  { title: "Kỹ năng kỹ thuật và thực hành", show: "Bạn học tốt bằng tay: làm, sửa, lắp ráp, vận hành, và thấy hài lòng khi một thứ chạy đúng.", grow: "Nó lớn lên qua thực hành lặp lại và những dự án có kết quả nhìn thấy được.", limit: "sự sốt ruột có thể khiến bạn bỏ qua bước chuẩn bị.",
    eval: (F) => { const S = sig(); planet(S, F, "mars", 1.2, "sức bật và sự quyết đoán", "sự nóng vội"); house(S, F, 3, 0.7, "đôi tay chủ động", "cần một mục tiêu rõ mới bắt tay vào"); house(S, F, 6, 0.4, "khả năng làm việc nặng"); inHouses(S, F, "mars", [3, 6, 10, 11], 0.5, "sức bật được đặt ở chỗ cần làm thật"); yoga(S, F, (id) => id === "mahapurusha_ruchaka", 0.7, "một tổ hợp cổ điển về năng lực hành động"); return S; } },
  { title: "Học hỏi và nghiên cứu", show: "Bạn có xu hướng muốn hiểu tận gốc, và có thể đi sâu vào một lĩnh vực lâu hơn người khác.", grow: "Nó phát huy khi bạn có người thầy giỏi hoặc một câu hỏi đủ lớn để theo trong nhiều năm.", limit: "dễ đọc nhiều mà ít đúc kết thành việc làm.",
    eval: (F) => { const S = sig(); planet(S, F, "jupiter", 1.1, "khả năng hiểu sâu", "niềm tin vào kiến thức sách vở cần được kiểm chứng"); house(S, F, 9, 0.6, "may mắn với thầy và việc học cao", "việc học cao thường gián đoạn"); house(S, F, 5, 0.5, "trí tuệ sáng"); house(S, F, 8, 0.4, "sự tò mò với những điều ẩn sâu"); inHouses(S, F, "ketu", [8, 12, 4, 9], 0.3, "khuynh hướng đi vào chiều sâu"); yoga(S, F, (id) => id === "mahapurusha_hamsa" || id === "gajakesari", 0.6, "một tổ hợp cổ điển về hiểu biết"); return S; } },
];

// ------------------------------------------------------------------ B5 career

const CAREER_GROUPS: Record<GrahaId, { role: string; fields: string }> = {
  sun: { role: "người đứng ra chịu trách nhiệm, quản lý, ra quyết định", fields: "quản lý, hành chính, cơ quan nhà nước, lãnh đạo dự án" },
  moon: { role: "người chăm sóc, kết nối với công chúng", fields: "chăm sóc sức khỏe, dịch vụ khách hàng, giáo dục trẻ em, ẩm thực, nhân sự" },
  mars: { role: "người xử lý việc khó, làm kỹ thuật, cạnh tranh", fields: "kỹ thuật, xây dựng, cơ khí, thể thao, an ninh, phẫu thuật" },
  mercury: { role: "người phân tích, trao đổi, buôn bán", fields: "kinh doanh, kế toán, công nghệ thông tin, truyền thông, viết lách, dữ liệu" },
  jupiter: { role: "người hướng dẫn, tư vấn, đưa ra định hướng", fields: "giáo dục, tư vấn, luật, tài chính, nghiên cứu học thuật" },
  venus: { role: "người tạo trải nghiệm dễ chịu, làm đẹp, kết nối", fields: "nghệ thuật, thiết kế, thời trang, làm đẹp, ngoại giao, tổ chức sự kiện" },
  saturn: { role: "người vận hành hệ thống, làm việc dài hơi", fields: "vận hành, sản xuất, quản trị quy trình, kỹ thuật hạ tầng, nghiên cứu dài hạn" },
  rahu: { role: "người đi trước ở những lĩnh vực mới", fields: "công nghệ mới, môi trường quốc tế, truyền thông số, những ngành chưa có khuôn" },
  ketu: { role: "người làm chuyên sâu, ít phô trương", fields: "nghiên cứu chuyên sâu, phần mềm, chữa lành, tâm linh, công việc độc lập" },
};

function careerTopic(ctx: Ctx, F: Facts): ExploreTopic {
  const n = ctx.n, noTime = F.noTime;
  const cand: { id: GrahaId; s: number; why: string }[] = [];
  const push = (id: GrahaId, s: number, why: string) => { const c = cand.find((x) => x.id === id); if (c) { c.s += s; c.why += `; ${why}`; } else cand.push({ id, s, why }); };
  if (!noTime) {
    const h10 = F.houses[9];
    push(h10.lord, 2 + F.planets[h10.lord].score * 0.3, "chủ nhà 10");
    for (const o of h10.occupants) push(o, 1.6 + F.planets[o].score * 0.3, "trong nhà 10");
    for (const o of h10.aspects) if (!h10.occupants.includes(o)) push(o, 0.6, "chiếu nhà 10");
    const d10 = vargaChart(n, 10);
    push(SIGN_LORD[d10.lagnaSign], 0.8, "chủ cung mọc D10");
    for (const id of d10.occupants[9]) push(id, 0.8, "trong nhà 10 của D10");
    push(F.houses[5].lord, 0.5, "chủ nhà 6 (môi trường làm việc)");
  }
  for (const id of ["sun", "saturn", "mercury", "jupiter", "mars", "venus", "moon"] as GrahaId[]) push(id, F.planets[id].score * 0.25, "sức chung");
  cand.sort((a, b) => b.s - a.s);
  const [a, b] = cand;
  const sign10 = noTime ? null : F.houses[9].sign;
  const mode = sign10 === null ? null : sign10 % 3; // 0 movable, 1 fixed, 2 dual
  const env = mode === 0 ? "môi trường có thay đổi, có dự án mới và cho bạn chủ động khởi xướng" : mode === 1 ? "môi trường ổn định, nơi bạn xây được vị trí lâu dài và chuyên môn sâu" : mode === 2 ? "môi trường đa nhiệm, nơi bạn được làm nhiều vai và học liên tục" : "môi trường cho bạn chủ động sắp xếp nhịp làm việc";
  const team = !noTime && F.houses[6].tier !== "low" && F.houses[10].tier !== "low" ? "Bạn thường làm tốt hơn khi có đối tác hoặc một nhóm ổn định." : "Bạn thường làm tốt khi có một phạm vi tự quản, ít phụ thuộc vào người khác.";
  const hard: string[] = [];
  if (!noTime) {
    const L10 = F.planets[F.houses[9].lord];
    if (L10.house && [6, 8, 12].includes(L10.house)) hard.push(`con đường nghề có thể phải đi qua ${L10.house === 6 ? "cạnh tranh và áp lực" : L10.house === 8 ? "những lần đổi hướng bất ngờ" : "những lúc phải làm việc xa, ở hậu trường hoặc chờ được ghi nhận"}`);
    if (L10.grade === "weak") hard.push("sự ghi nhận thường đến chậm hơn công sức");
    if (F.houses[9].aspects.includes("saturn") || F.houses[9].occupants.includes("saturn")) hard.push("trách nhiệm đến sớm và nặng, đổi lại vị trí bền");
    if (F.houses[5].tier === "low") hard.push("môi trường làm việc hằng ngày dễ gây mệt; nhịp nghỉ cần được bảo vệ");
  }
  const points: ExploreFacet[] = [
    { title: "Xu hướng làm việc nổi bật", text: `Bạn có xu hướng làm việc như ${CAREER_GROUPS[a.id].role}. Bạn hợp với ${env}. ${team}` },
    { title: "Vai trò và nhóm nghề đáng khám phá", text: `Nhóm nghề nên thử trước: ${CAREER_GROUPS[a.id].fields}.${b && b.id !== a.id ? ` Một hướng khác cũng đáng thử: ${CAREER_GROUPS[b.id].fields}, với vai trò ${CAREER_GROUPS[b.id].role}.` : ""} Đây là gợi ý để khám phá, không phải lời khẳng định về nghề nghiệp thực tế của bạn.` },
    { title: "Điều kiện có thể gây khó khăn", text: hard.length ? `${cap(joinVi(hard))}. Biết trước điều này giúp bạn chọn môi trường và nhịp phát triển phù hợp hơn là ép mình theo con đường của người khác.` : "Lá số không cho thấy cản trở nổi bật trong chuyện nghề; điều quyết định nhiều hơn là bạn chọn đúng một hướng và đi đủ lâu." },
  ];
  return {
    id: "career", title: "Con đường nghề nghiệp phù hợp", ask: "Bạn có xu hướng làm việc ra sao, và nhóm nghề nào đáng để khám phá?",
    lead: `Lá số nghiêng về những công việc mà bạn là ${CAREER_GROUPS[a.id].role}${b && b.id !== a.id ? `, với một hướng phụ là ${CAREER_GROUPS[b.id].role}` : ""}.`,
    points, needsTime: false,
    why: [...cand.slice(0, 4).map((c) => `${nameOf(c.id)}: ${c.s.toFixed(1)} (${c.why}).`), ...(sign10 !== null ? [`Cung nhà 10: ${SIGNS[sign10]} (${["chủ động", "cố định", "song tính"][mode!]}).`] : []), noTime ? "Chưa có giờ sinh: chỉ dùng sức chung của các hành tinh." : "Chỉ dùng phương pháp Parashara (nhà 10, chủ nhà 10, hành tinh trong và chiếu nhà 10, D10); không dùng Amatyakaraka của Jaimini."],
  };
}

// ------------------------------------------------------------------ B6 money, B7 leadership, B8 study, C9 health, C10 family, C11 dharma

const MONEY: FacetDef[] = [
  { title: "Khả năng tạo thu nhập", show: "Bạn có khả năng tạo ra thu nhập từ công sức và các mối quan hệ của mình.", grow: "Thu nhập tăng rõ nhất khi bạn có nhiều hơn một nguồn và biết định giá đúng công sức mình.", limit: "thu nhập có thể thất thường theo giai đoạn.",
    eval: (F) => { const S = sig(); house(S, F, 11, 1, "nhà thu nhập có điều kiện tốt", "thu nhập không đều"); if (!F.noTime) planet(S, F, F.houses[10].lord, 0.8, "hành tinh giữ chìa khóa thu nhập đứng vững", "hành tinh giữ chìa khóa thu nhập đang yếu"); planet(S, F, "jupiter", 0.4, "sự hanh thông chung"); return S; } },
  { title: "Khả năng tích lũy và giữ", show: "Bạn có khả năng giữ lại và làm dày dần những gì mình có.", grow: "Tích lũy hiệu quả nhất với bạn là tích lũy đều, theo kế hoạch, thay vì chờ một khoản lớn.", limit: "chi tiêu cảm xúc hoặc trách nhiệm với người thân có thể làm hao hụt.",
    eval: (F) => { const S = sig(); house(S, F, 2, 1, "nhà tích lũy có điều kiện tốt", "khả năng giữ tiền cần được rèn"); if (!F.noTime) planet(S, F, F.houses[1].lord, 0.8, "hành tinh giữ chìa khóa tích lũy đứng vững", "hành tinh giữ chìa khóa tích lũy đang yếu"); if (!F.noTime && [6, 8, 12].includes(F.houses[1].lordHouse)) { S.s -= 0.5; S.bad.push("tiền tích lũy dễ chảy vào chi phí hoặc biến động"); S.why.push(`Chủ nhà 2 ở nhà ${F.houses[1].lordHouse}.`); } return S; } },
  { title: "Điều kiện hỗ trợ sự thịnh vượng", show: "Bạn có những điều kiện tốt cho việc tích lũy lâu dài, nhất là khi đi đúng giai đoạn thuận của đời mình.", grow: "Những điều kiện này rõ nhất khi bạn kiên trì với một hướng làm ăn đủ lâu.", limit: "điều kiện thuận không thay được việc quản lý cẩn thận.",
    eval: (F) => { const S = sig(); yoga(S, F, (id) => id.startsWith("dhana") || id === "gajakesari" || id.startsWith("raja"), 1.2, "các tổ hợp về tài lộc"); house(S, F, 9, 0.4, "vùng phúc phần có điều kiện tốt"); house(S, F, 5, 0.3, "vùng tư duy và đầu tư có điều kiện tốt"); return S; } },
  { title: "Cách quản lý tài chính", show: "Cách bạn dùng tiền gắn với tính khí hơn là con số.", grow: "Một quy tắc đơn giản đặt ra từ trước (tỷ lệ tiết kiệm cố định, quỹ dự phòng) hợp với bạn hơn là tự kỷ luật theo cảm hứng.", limit: "những lúc cảm xúc lên xuống dễ kéo theo quyết định tiền bạc vội.",
    eval: (F) => { const S = sig(); planet(S, F, "saturn", 0.7, "tính thận trọng và kiên nhẫn", "khó giữ kỷ luật tài chính lâu"); planet(S, F, "moon", 0.5, "cảm xúc ổn định", "cảm xúc dễ ảnh hưởng chi tiêu"); house(S, F, 12, -0.4, "", "vùng chi tiêu khá mạnh"); return S; } },
];

const LEADER: FacetDef[] = [
  { title: "Sự chủ động", show: "Bạn có xu hướng tự bắt đầu thay vì chờ được giao.", grow: "Nó phát huy khi bạn có một mục tiêu đủ rõ và quyền tự quyết cách làm.", limit: "chủ động quá nhanh có thể bỏ người khác lại phía sau.", eval: (F) => { const S = sig(); planet(S, F, "mars", 1, "sức bật", "sự nóng vội"); house(S, F, 3, 0.8, "đôi tay chủ động", "cần thúc đẩy mới bắt đầu"); if (!F.noTime) planet(S, F, SIGN_LORD[F.n.lagna.sign], 0.6, "hành tinh cai quản cung mọc đứng vững"); return S; } },
  { title: "Ra quyết định và chịu trách nhiệm", show: "Bạn có khả năng đứng ra quyết định và nhận phần trách nhiệm về mình.", grow: "Nó lớn lên khi bạn được giao trách nhiệm thật, có cả rủi ro thật.", limit: "dễ thành cứng nhắc khi bị thách thức.", eval: (F) => { const S = sig(); planet(S, F, "sun", 1.2, "ý chí rõ ràng", "sự tự tin chưa ổn định"); house(S, F, 10, 0.7, "vị trí nghề nghiệp có chỗ dựa", "vị trí trách nhiệm đến chậm"); yoga(S, F, (id) => id.startsWith("raja"), 0.6, "tổ hợp về vị thế"); return S; } },
  { title: "Tổ chức và giữ nhịp cho nhóm", show: "Bạn có khả năng giữ cho một nhóm làm việc đều, theo kế hoạch.", grow: "Nó phát huy trong những việc dài hạn, cần quy trình và sự bền bỉ.", limit: "dễ đòi hỏi người khác theo nhịp của mình.", eval: (F) => { const S = sig(); planet(S, F, "saturn", 1.1, "tính hệ thống", "khó duy trì nhịp lâu"); house(S, F, 6, 0.5, "khả năng quản lý việc hằng ngày"); return S; } },
  { title: "Phối hợp và dẫn dắt bằng sự tin cậy", show: "Bạn dẫn dắt bằng việc làm người khác thấy được lắng nghe và được hướng dẫn.", grow: "Nó phát huy khi bạn ở vai trò cố vấn, người kết nối hoặc trưởng nhóm nhỏ.", limit: "dễ né những cuộc nói chuyện khó để giữ hòa khí.", eval: (F) => { const S = sig(); planet(S, F, "jupiter", 1, "hiểu biết và sự công bằng"); planet(S, F, "venus", 0.5, "sự khéo léo"); house(S, F, 7, 0.5, "khả năng hợp tác"); house(S, F, 11, 0.5, "mạng lưới rộng"); return S; } },
];

const STUDY: FacetDef[] = [
  { title: "Cách tiếp nhận kiến thức", show: "", grow: "", limit: "", eval: (F) => { const S = sig(); S.s = 5; S.why.push(`Sao Thủy ở ${SIGNS[F.planets.mercury.sign]}; Mặt Trăng ở ${SIGNS[F.planets.moon.sign]}.`); return S; } },
  { title: "Tư duy và trí nhớ", show: "Bạn có xu hướng nắm ý nhanh và nhớ tốt những gì mình thấy có ích.", grow: "Ôn lại bằng cách giảng cho người khác là cách giúp bạn nhớ lâu nhất.", limit: "dễ phân tán khi học nhiều thứ cùng lúc.", eval: (F) => { const S = sig(); planet(S, F, "mercury", 1.1, "trí óc nhanh", "trí óc dễ phân tán"); house(S, F, 4, 0.5, "nền học vấn sớm tốt", "môi trường học thuở nhỏ không ổn định"); house(S, F, 5, 0.7, "trí tuệ sáng", "cần phương pháp riêng để học vào"); return S; } },
  { title: "Năng lực nghiên cứu", show: "Bạn có thể theo một câu hỏi rất lâu và đi tới phần ít người chạm tới.", grow: "Nó phát huy khi bạn có một lĩnh vực đủ sâu và thời gian yên tĩnh.", limit: "đôi khi khó dừng lại để đúc kết.", eval: (F) => { const S = sig(); house(S, F, 8, 0.7, "sự tò mò với điều ẩn sâu"); planet(S, F, "saturn", 0.6, "sự kiên nhẫn"); planet(S, F, "jupiter", 0.6, "khả năng hệ thống hóa kiến thức"); inHouses(S, F, "ketu", [4, 5, 8, 9, 12], 0.4, "khuynh hướng đi vào chiều sâu"); return S; } },
  { title: "Học cao và người thầy", show: "Việc học cao và những người thầy có vai trò rõ trong đời bạn.", grow: "Một người thầy hoặc người hướng dẫn đúng lúc có thể rút ngắn của bạn nhiều năm.", limit: "việc học cao có thể bị gián đoạn rồi quay lại.", eval: (F) => { const S = sig(); house(S, F, 9, 1, "may mắn với thầy và việc học cao", "con đường học cao không thẳng"); planet(S, F, "jupiter", 0.8, "hiểu biết rộng", "cần tự kiểm chứng điều được dạy"); return S; } },
];
const LEARN_STYLE: Record<string, string> = {
  fire: "Bạn học nhanh nhất khi được làm ngay: thử, sai, sửa, và thấy kết quả sớm. Bài giảng dài mà không có thực hành dễ làm bạn mất hứng.",
  earth: "Bạn học tốt nhất qua ví dụ cụ thể và từng bước có thứ tự; khi thấy kiến thức dùng được vào đâu, bạn nhớ rất lâu.",
  air: "Bạn học tốt nhất qua trao đổi: đặt câu hỏi, tranh luận, giảng lại cho người khác. Học một mình dễ làm bạn chán.",
  water: "Bạn học tốt nhất khi có hứng thú và cảm thấy an toàn; hình ảnh, câu chuyện và người dạy bạn quý có tác dụng lớn.",
};

const HEALTH: FacetDef[] = [
  { title: "Sinh lực nền", show: "Sinh lực nền của bạn khá rõ: bạn biết khi nào mình khỏe và khi nào mình đang cạn sức.", grow: "Vận động đều và ánh sáng ban ngày giữ sinh lực ở mức tốt nhất.", limit: "những giai đoạn làm việc quá sức sẽ thấy rõ trên cơ thể.", eval: (F) => { const S = sig(); planet(S, F, "sun", 1, "ý chí rõ", "sự tự tin cần thời gian"); house(S, F, 1, 1, "cung mọc có điều kiện tốt", "cung mọc có điều kiện kém hơn các nhà khác"); if (!F.noTime) planet(S, F, SIGN_LORD[F.n.lagna.sign], 0.8, "hành tinh cai quản cung mọc đứng vững", "hành tinh cai quản cung mọc đang yếu"); return S; } },
  { title: "Nghỉ ngơi và giấc ngủ", show: "Tâm trí và giấc ngủ là phần nhạy nhất trong nhịp sống của bạn.", grow: "Một giờ đi ngủ cố định và khoảng yên tĩnh mỗi ngày có tác dụng với bạn nhiều hơn mức thường.", limit: "lo nghĩ dễ lấn vào giấc ngủ.", eval: (F) => { const S = sig(); planet(S, F, "moon", 1.1, "cảm xúc ổn định", "cảm xúc nhạy"); house(S, F, 12, 0.6, "khả năng tự hồi phục khi ở một mình", "giấc ngủ dễ bị ảnh hưởng"); return S; } },
  { title: "Nhịp sinh hoạt và trách nhiệm hằng ngày", show: "Bạn gánh được khá nhiều việc hằng ngày, nhưng áp lực thường tích lại mà không báo trước.", grow: "Chia việc thành nhịp đều và có ngày nghỉ thật giúp bạn giữ sức lâu dài.", limit: "dễ coi việc nghỉ là một thứ xa xỉ.", eval: (F) => { const S = sig(); house(S, F, 6, 1, "khả năng chịu áp lực tốt", "áp lực hằng ngày dễ tích tụ"); planet(S, F, "mars", 0.5, "sức bền thể chất", "dễ làm quá sức"); planet(S, F, "saturn", 0.5, "khả năng giữ thói quen", "thói quen khó duy trì"); return S; } },
];

const FAMILY: FacetDef[] = [
  { title: "Mẹ, mái nhà và cảm giác thuộc về", show: "Mái nhà và người nuôi dưỡng bạn là nền cảm xúc quan trọng.", grow: "Một không gian sống bạn thật sự thấy là của mình có tác dụng lớn với sự cân bằng của bạn.", limit: "cảm giác yên ổn trong nhà có thể phải tự dựng lại nhiều lần.", eval: (F) => { const S = sig(); house(S, F, 4, 1.1, "vùng nhà cửa có điều kiện tốt", "vùng nhà cửa có điều kiện kém hơn các nhà khác"); planet(S, F, "moon", 0.9, "cảm xúc ổn định", "cảm xúc nhạy"); return S; } },
  { title: "Gia đình gốc và nếp nhà", show: "Nếp nhà và những giá trị được truyền lại có ảnh hưởng rõ đến cách bạn sống và dùng tiền.", grow: "Giữ lại điều tốt của nếp nhà và tự chọn điều mình không mang theo là một việc trưởng thành quan trọng với bạn.", limit: "kỳ vọng của gia đình gốc có thể nặng.", eval: (F) => { const S = sig(); house(S, F, 2, 1, "gia đình gốc là chỗ dựa", "gia đình gốc có nhiều điều phải dung hòa"); planet(S, F, "jupiter", 0.4, "sự che chở"); return S; } },
  { title: "Cha và người dẫn dắt", show: "Hình ảnh người cha hoặc người dẫn dắt đầu đời có vai trò định hướng.", grow: "Hiểu được những gì mình nhận và không nhận từ người ấy giúp bạn chọn con đường riêng rõ hơn.", limit: "khác biệt quan điểm với cha hoặc người lớn có thể là chủ đề lặp lại.", eval: (F) => { const S = sig(); house(S, F, 9, 1, "vùng người cha và phúc phần có điều kiện tốt", "vùng người cha có nhiều điều phải tự trải"); planet(S, F, "sun", 0.8, "ý chí rõ", "sự tự tin cần thời gian"); return S; } },
];

const DHARMA: FacetDef[] = [
  { title: "Niềm tin và điều bạn coi là đúng", show: "Bạn có một hệ giá trị riêng mà mình muốn sống theo.", grow: "Nó vững nhất khi được kiểm chứng bằng trải nghiệm, không chỉ bằng lời dạy.", limit: "dễ khắt khe với người nghĩ khác.", eval: (F) => { const S = sig(); house(S, F, 9, 1.1, "vùng niềm tin có điều kiện tốt", "niềm tin hình thành qua nhiều nghi ngờ"); planet(S, F, "jupiter", 1, "khả năng tin và hiểu sâu", "niềm tin cần được tự kiểm chứng"); return S; } },
  { title: "Điều làm cuộc sống có ý nghĩa", show: "Bạn thấy có ý nghĩa nhất khi tạo ra điều gì đó, dạy lại, hoặc nuôi dưỡng một người hay một việc.", grow: "Dành thời gian đều đặn cho việc ấy, kể cả khi nó không mang lại tiền, giữ cho bạn một hướng đi.", limit: "những trách nhiệm thực tế dễ đẩy nó xuống sau cùng.", eval: (F) => { const S = sig(); house(S, F, 5, 1, "vùng sáng tạo có điều kiện tốt"); planet(S, F, "sun", 0.6, "ý chí rõ ràng"); return S; } },
  { title: "Trách nhiệm dài hạn", show: "Ý nghĩa với bạn gắn với việc giữ lời và làm tròn trách nhiệm.", grow: "Một cam kết dài hạn mà bạn tự chọn cho bạn cảm giác vững vàng hơn mọi sự công nhận bên ngoài.", limit: "dễ gánh trách nhiệm không phải của mình.", eval: (F) => { const S = sig(); planet(S, F, "saturn", 1, "sức bền", "sự kiên trì cần được rèn"); house(S, F, 10, 0.6, "vùng trách nhiệm có điều kiện tốt"); return S; } },
];

// ------------------------------------------------------------------ A2 love, A3 marriage, C12 inner conflicts

function loveTopic(ctx: Ctx, F: Facts): ExploreTopic {
  const v = F.planets.venus, m = F.planets.moon, ma = F.planets.mars;
  const eV = ELEMENT_OF(v.sign), eM = ELEMENT_OF(m.sign);
  const how: Record<string, string> = { fire: "Tình cảm của bạn thường bắt đầu nhanh và rõ: bạn thích người khiến bạn thấy sống động, và muốn thể hiện bằng hành động.", earth: "Tình cảm của bạn thường lớn dần: bạn tin vào sự có mặt đều đặn, những việc cụ thể và sự chung thủy hơn là lời nói.", air: "Tình cảm của bạn thường bắt đầu từ trò chuyện: bạn cần một người cùng nghĩ, cùng hỏi, và hiểu điều bạn nói.", water: "Tình cảm của bạn thường sâu và chậm mở: bạn cần cảm thấy an toàn trước khi trao lòng, nhưng đã trao thì rất gắn bó." };
  const need: Record<string, string> = { fire: "cần được chủ động và được tôn trọng sự độc lập", earth: "cần sự ổn định và những lời hứa được giữ", air: "cần không gian để là chính mình và nhiều trao đổi", water: "cần sự gần gũi, quan tâm và cảm giác được che chở" };
  const pts: ExploreFacet[] = [
    { title: "Cách tình cảm hình thành", text: `${how[eV]}${v.grade === "weak" ? " Có thể bạn mất khá lâu để tin rằng mình xứng đáng được yêu theo cách mình muốn." : ""}` },
    { title: "Nhu cầu gắn bó", text: `Về cảm xúc, bạn ${need[eM]}.${eV !== eM ? " Điều bạn bị cuốn hút và điều bạn cần để yên lòng không hoàn toàn trùng nhau, nên người làm bạn rung động chưa chắc là người làm bạn thấy bình yên." : " Điều bạn bị cuốn hút và điều bạn cần để yên lòng khá giống nhau, nên bạn thường biết khá rõ mình muốn gì."}` },
  ];
  const diffs: string[] = [];
  if (v.conj.includes("mars") || (v.house && ma.house && mod(ma.house - v.house, 12) === 6)) diffs.push("đam mê và sự dịu dàng trong bạn cùng mạnh, nên quan hệ có thể vừa nồng nhiệt vừa dễ va chạm");
  if (v.conj.includes("saturn") || v.aspectedBy.includes("saturn")) diffs.push("bạn nghiêm túc và thận trọng trong tình cảm, đôi khi tới mức giữ khoảng cách quá lâu");
  if (v.conj.includes("rahu") || v.conj.includes("ketu")) diffs.push("bạn có thể bị cuốn vào những mối quan hệ khác thường, hoặc thấy khó hài lòng trọn vẹn");
  if (hostile(SIGN_LORD[v.sign], SIGN_LORD[m.sign])) diffs.push("điều bạn muốn trong tình yêu và điều lòng bạn cần đôi khi kéo về hai phía");
  pts.push({ title: "Những khác biệt có thể xuất hiện", text: diffs.length ? `${diffs.map((x) => cap(x)).join(". ")}. Nói rõ điều này với người bạn thương giúp tránh nhiều hiểu lầm.` : "Lá số không cho thấy giằng co nổi bật trong cách bạn yêu; điều quan trọng là chọn người có cùng nhịp với mình." });
  return { id: "love", title: "Phong cách yêu", ask: "Bạn yêu thế nào, và cần gì để thấy gắn bó?", lead: `${how[eV].split(":")[0]}, ${eV === eM ? "và" : "nhưng"} về cảm xúc, bạn ${need[eM]}.`, points: pts, needsTime: false,
    why: [`Sao Kim: ${SIGNS[v.sign]}${v.house ? `, nhà ${v.house}` : ""}, ${DIGNITY_VI[v.dignity].toLowerCase()}, ${v.grade}.`, `Mặt Trăng: ${SIGNS[m.sign]}.`, `Sao Hỏa: ${SIGNS[ma.sign]}.`, `Liên hệ của Sao Kim: ${[...v.conj, ...v.aspectedBy].map(nameOf).join(", ") || "không có"}.`] };
}

function marriageTopic(ctx: Ctx, F: Facts): ExploreTopic {
  const n = ctx.n, noTime = F.noTime, pts: ExploreFacet[] = [], why: string[] = [];
  let lead = "";
  if (noTime) {
    lead = "Chưa có giờ sinh nên phần này chỉ đọc được những nét chung về cách bạn gắn bó.";
    pts.push({ title: "Điều bạn coi trọng trong cam kết", text: `${F.planets.venus.grade === "weak" ? "Bạn cần thời gian để tin vào sự gắn bó lâu dài." : "Bạn coi trọng sự hòa hợp và có khả năng giữ một mối quan hệ lâu dài."}` });
  } else {
    const h7 = F.houses[6], L7 = F.planets[h7.lord], d9 = vargaChart(n, 9), d9_7 = mod(d9.lagnaSign + 6, 12), d9L = SIGN_LORD[d9_7];
    const style: Record<number, string> = { 0: "chủ động, thẳng thắn", 1: "ổn định, chung thủy, coi trọng sự an toàn", 2: "trò chuyện, linh hoạt", 3: "che chở, gần gũi", 4: "tự trọng, rõ ràng vai trò", 5: "chu đáo, thực tế", 6: "công bằng, lịch thiệp", 7: "sâu sắc, trung thành", 8: "tự do, cùng lý tưởng", 9: "trách nhiệm, có kế hoạch", 10: "độc lập, tôn trọng khoảng riêng", 11: "dịu dàng, giàu cảm thông" };
    lead = `Trong một mối quan hệ lâu dài, bạn có xu hướng tìm sự gắn bó kiểu ${style[h7.sign]}.`;
    pts.push({ title: "Kiểu quan hệ gắn bó bạn hướng tới", text: `${lead} ${[6, 8, 12].includes(h7.lordHouse) ? "Cam kết của bạn thường cần đi qua một giai đoạn thử thách hoặc điều chỉnh trước khi ổn định; đó không phải dấu hiệu đổ vỡ." : [1, 4, 5, 7, 9, 10, 11].includes(h7.lordHouse) ? "Các mối quan hệ cam kết có chỗ đứng rõ ràng trong đời bạn." : "Chuyện cam kết của bạn hay gắn với chuyện " + area(h7.lordHouse) + "."}` });
    const occ = h7.occupants;
    if (occ.length) pts.push({ title: "Điều đặc biệt trong quan hệ của bạn", text: `${cap(occ.map((o) => ({ sun: "người đồng hành có cá tính mạnh, cần tôn trọng vai trò của nhau", moon: "nhu cầu gần gũi về cảm xúc rất lớn", mars: "đam mê nhưng dễ va chạm; học cách tranh luận mà không làm tổn thương", mercury: "cần một người bạn để trò chuyện", jupiter: "người đồng hành thường hiểu biết và nâng đỡ bạn", venus: "sự hòa hợp và gu thẩm mỹ chung quan trọng", saturn: "cam kết nghiêm túc, có thể đến muộn hoặc với người lớn tuổi hơn", rahu: "sức hút với người khác biệt về văn hóa hoặc hoàn cảnh", ketu: "cần thời gian để thật sự gắn bó; truyền thống không coi đây là dấu hiệu chắc chắn khó kết hôn" } as Record<string, string>)[o]).join("; "))}.` });
    const d9dig = d9.planets[d9L].dignity;
    pts.push({ title: "Về lâu dài", text: `${["exalted", "own", "moolatrikona"].includes(d9dig) ? "Về lâu dài, phần cam kết của bạn có xu hướng chắc dần theo tuổi." : d9dig === "debilitated" ? "Về lâu dài, sự bền vững của cam kết cần được chăm bằng nỗ lực của cả hai người." : "Về lâu dài, mối quan hệ của bạn bền đến đâu phụ thuộc nhiều vào cách hai người cùng lớn lên."}` });
    why.push(`Nhà 7: ${SIGNS[h7.sign]}, chủ ${nameOf(h7.lord)} ở nhà ${h7.lordHouse} (${L7.grade}), trong nhà: ${occ.map(nameOf).join(", ") || "không"}, chiếu: ${h7.aspects.map(nameOf).join(", ") || "không"}.`, `D9: cung mọc ${SIGNS[d9.lagnaSign]}, nhà 7 ${SIGNS[d9_7]}, chủ ${nameOf(d9L)} ${d9dig}.`);
  }
  why.push(`Sao Kim ${F.planets.venus.grade}, Sao Mộc ${F.planets.jupiter.grade}.`, "Không dự đoán thời điểm kết hôn, ly hôn hay ngoại tình.");
  return { id: "marriage", title: "Hôn nhân và cam kết lâu dài", ask: "Bạn cần gì trong một mối quan hệ lâu dài?", lead, points: pts, why, needsTime: true };
}

function innerTopic(ctx: Ctx, F: Facts): ExploreTopic {
  const n = ctx.n, noTime = F.noTime, found: (ExploreFacet & { why: string })[] = [];
  if (!noTime) {
    const eL = ELEMENT_OF(n.lagna.sign), eM = ELEMENT_OF(n.grahas.moon.sign);
    const bad = (eL === "fire" && eM === "water") || (eL === "water" && eM === "fire") || (eL === "earth" && eM === "air") || (eL === "air" && eM === "earth");
    if (bad) found.push({ title: "Bên ngoài và bên trong", text: "Cách bạn xuất hiện và điều bạn cần trong lòng đi theo hai nhịp khác nhau, nên người khác có thể đọc sai bạn, và chính bạn cũng có lúc không hiểu vì sao mình mệt dù mọi thứ trông ổn.", why: `Cung mọc ${SIGNS[n.lagna.sign]}, Mặt Trăng ${SIGNS[n.grahas.moon.sign]}.` });
    const LL = SIGN_LORD[n.lagna.sign], ML = SIGN_LORD[n.grahas.moon.sign];
    if (hostile(LL, ML)) found.push({ title: "Điều muốn làm và điều lòng cần", text: "Những gì bạn chọn làm và những gì làm bạn thấy yên lòng thường kéo về hai phía; quyết định vội theo một phía dễ để lại cảm giác thiếu.", why: `Chủ cung mọc ${nameOf(LL)}, chủ cung Mặt Trăng ${nameOf(ML)}: không thân.` });
  }
  const m = F.planets.moon;
  const heavy = (["saturn", "rahu", "ketu", "mars"] as GrahaId[]).filter((x) => m.conj.includes(x) || m.aspectedBy.includes(x));
  if (heavy.length) found.push({ title: "Một tâm trí bị kéo căng", text: `Cảm xúc của bạn dễ chịu ${joinVi(heavy.map((x) => ({ saturn: "sự tự nghiêm khắc", rahu: "sự không yên", ketu: "cảm giác tách rời", mars: "sự nóng nảy" } as Record<string, string>)[x]))}. Bạn có thể vừa cần người khác vừa muốn được để yên.`, why: `Mặt Trăng cùng cung/nhận chiếu từ ${joinVi(heavy.map(nameOf))}.` });
  const ms = F.planets.mars, sa = F.planets.saturn;
  if (ms.sign === sa.sign || ms.aspectedBy.includes("saturn")) found.push({ title: "Đạp ga và đạp phanh", text: "Trong bạn có một phần muốn lao lên ngay và một phần muốn chắc chắn trước; khi hai phần không đồng ý, bạn dễ bực với chính mình.", why: `Sao Hỏa (${SIGNS[ms.sign]}) và Sao Thổ (${SIGNS[sa.sign]}) liên hệ trực tiếp.` });
  const s = n.grahas.sun.sign, d = mod(n.grahas.moon.sign - s, 12) + 1;
  if (d === 6 || d === 8) found.push({ title: "Ý chí và cảm xúc", text: "Điều bạn muốn khẳng định và điều bạn cần để yên lòng ít khi gặp nhau, nên bạn có thể đạt được việc mình nhắm tới mà vẫn thấy thiếu.", why: "Mặt Trăng cách Mặt Trời theo thế 6/8." });
  const retro = (["mercury", "venus", "mars", "jupiter", "saturn"] as GrahaId[]).filter((x) => n.grahas[x].retro);
  if (retro.length >= 2 && found.length < 3) found.push({ title: "Nghĩ lại nhiều lần", text: "Bạn có xu hướng quay lại xem xét những quyết định đã đưa ra; điều đó cho chiều sâu nhưng cũng khiến bạn khó thấy một việc đã xong.", why: `Nghịch hành lúc sinh: ${joinVi(retro.map(nameOf))}.` });
  const pts = found.slice(0, 3).map(({ title, text }) => ({ title, text }));
  return { id: "inner", title: "Những mâu thuẫn nội tâm", ask: "Trong bạn có những giằng co nào, và chúng đến từ đâu?",
    lead: pts.length ? `Lá số cho thấy ${pts.length} giằng co có căn cứ rõ: ${joinVi(pts.map((p) => p.title.toLowerCase()))}.` : "Lá số không cho thấy giằng co nội tâm nổi bật nào ngoài những điều ai cũng có; những mâu thuẫn bạn cảm thấy có thể đến từ hoàn cảnh nhiều hơn tính khí.",
    points: pts.length ? pts : [{ title: "Một nội tâm khá thống nhất", text: "Các cấu trúc chính của lá số đi cùng hướng, nên bạn thường biết mình muốn gì; khi thấy giằng co, hãy nhìn vào hoàn cảnh trước." }],
    why: found.map((f) => f.why), needsTime: false };
}

// ------------------------------------------------------------------ assembling

function facetTopic(ctx: Ctx, F: Facts, id: string, title: string, ask: string, defs: FacetDef[], leadOf: (b: Built[]) => string, extra?: (b: Built[]) => Built[]): ExploreTopic {
  let b = runFacets(F, ctx, defs);
  if (extra) b = extra(b);
  return { id, title, ask, lead: leadOf(b), points: b.map(({ title, text }) => ({ title, text })), why: [...new Set(b.flatMap((x) => x.why))], needsTime: false };
}

const GROUPS: { id: string; title: string; intro: string; ids: string[] }[] = [
  { id: "relations", title: "Kết nối và các mối quan hệ", intro: "Cách bạn yêu, cam kết, và hòa hợp với một người khác.", ids: ["love", "marriage"] },
  { id: "potential", title: "Tiềm năng và con đường phát triển", intro: "Bạn làm tốt điều gì, và những điều ấy có thể dẫn bạn tới đâu.", ids: ["talent", "career", "money", "leader", "study"] },
  { id: "inside", title: "Đời sống và chiều sâu nội tâm", intro: "Sinh lực, gia đình, ý nghĩa và những giằng co bên trong.", ids: ["health", "family", "dharma", "inner"] },
];

export function readExplore(ctx: Ctx): ExploreGroup[] {
  const F = buildFacts(ctx);
  const low = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
  const T: Record<string, ExploreTopic> = {
    love: loveTopic(ctx, F),
    marriage: marriageTopic(ctx, F),
    talent: facetTopic(ctx, F, "talent", "Năng khiếu và thế mạnh", "Bạn có những năng lực nào có căn cứ rõ trong lá số?", TALENTS, (b) => `Những năng lực có căn cứ rõ nhất trong lá số của bạn là ${joinVi(b.map((x) => low(x.title)))}.`),
    career: careerTopic(ctx, F),
    money: facetTopic(ctx, F, "money", "Tiền bạc và sự thịnh vượng", "Bạn tạo dựng, giữ và quản lý nguồn lực theo cách nào?", MONEY, (b) => `Điểm mạnh nhất của bạn về tài chính nằm ở ${low(b[0].title)}${b[1] ? `, kế đó là ${low(b[1].title)}` : ""}. Đây là xu hướng, không phải lời hứa về sự giàu có, và không nên dùng để quyết định đầu tư.`),
    leader: facetTopic(ctx, F, "leader", "Khả năng lãnh đạo", "Bạn chủ động, ra quyết định và dẫn dắt người khác theo cách nào?", LEADER, (b) => `Phong cách dẫn dắt của bạn dựa trước hết vào ${low(b[0].title)}${b[1] ? ` và ${low(b[1].title)}` : ""}.`),
    study: facetTopic(ctx, F, "study", "Học tập và trí tuệ", "Bạn tiếp nhận kiến thức thế nào, và cách học nào hợp với bạn?", STUDY, (b) => `${LEARN_STYLE[ELEMENT_OF(F.planets.mercury.sign)].split(";")[0].split(":")[0]}.`, (b) => b.map((x) => x.title === "Cách tiếp nhận kiến thức" ? { ...x, text: `${LEARN_STYLE[ELEMENT_OF(F.planets.mercury.sign)]}${ELEMENT_OF(F.planets.moon.sign) !== ELEMENT_OF(F.planets.mercury.sign) ? ` Về cảm xúc, ${low(LEARN_STYLE[ELEMENT_OF(F.planets.moon.sign)].split(";")[0].split(":")[0].replace("Bạn học", "bạn cũng cần học"))}.` : ""}` } : x)),
    health: facetTopic(ctx, F, "health", "Sức khỏe và nhịp sống", "Sinh lực của bạn đến từ đâu, và nhịp sống nào giữ nó tốt nhất?", HEALTH, (b) => `Theo các biểu tượng truyền thống, điều cần chăm nhất cho nhịp sống của bạn là ${low(b[b.length - 1].title)}. Phần này không chẩn đoán bệnh và không thay lời khuyên y tế.`),
    family: facetTopic(ctx, F, "family", "Gia đình và nguồn cội", "Gia đình có vai trò gì, và điều gì cho bạn cảm giác thuộc về?", FAMILY, (b) => `Trong chuyện gia đình, điều nổi bật nhất ở lá số của bạn là ${low(b[0].title)}.`),
    dharma: facetTopic(ctx, F, "dharma", "Dharma: giá trị và định hướng sống", "Điều gì cho cuộc đời bạn một hướng đi?", DHARMA, (b) => `Định hướng sống của bạn được nuôi bằng ${low(b[0].title)}${b[1] ? ` và ${low(b[1].title)}` : ""}.`),
    inner: innerTopic(ctx, F),
  };
  return GROUPS.map((g) => ({ id: g.id, title: g.title, intro: g.intro, topics: g.ids.map((id) => T[id]) }));
}

void friendly;
