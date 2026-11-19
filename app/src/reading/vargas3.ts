// The divisional charts (D2, D3, D4, D7, D9, D10) of Life Atlas v3. Each chart answers one question and is read in three parts:
//   1. a judgement built from D1 and from the divisional chart together,
//   2. two or three features that really stand out in this chart (chosen by salience, so two charts rarely say the same things),
//   3. "Vì sao mình nói điều này?": the technical facts behind the judgement.
// The method is fixed to the Parashara rules (see engine/vargas.ts). When the birth time is uncertain, a chart whose rising sign can
// change inside the error window is not read house by house (see stability.ts).
import { SIGNS, SIGN_LORD, mod, type GrahaId } from "../engine/constants.ts";
import { vargaChart, vargaSign, type VargaChart, type VargaN } from "../engine/vargas.ts";
import type { Dignity } from "../engine/types.ts";
import type { Ctx } from "./ctx.ts";
import { buildFacts, isGood, HOUSE_SHORT, type Facts } from "./facts.ts";
import { stability, vargaTrust, type Stability } from "./stability.ts";
import { D9_LAGNA, D9_SEVENTH, D10_LAGNA, D10_LORD_IN } from "./content/vargas.ts";
import { PLANETS } from "./content/planets.ts";
import { ELEMENT_OF } from "./content/overview.ts";
import { HOUSE_TAG } from "./content/houses-signs.ts";
import { nameOf, joinVi, lowerFirst } from "./util.ts";

export interface VargaPoint { title: string; paragraphs: string[] }
export interface VargaReading {
  n: VargaN;
  code: string;
  name: string;
  short: string;
  /** The question the chart answers. */
  question: string;
  trust: { level: "chắc" | "một phần" | "thấp" | "không"; note: string };
  summary: string[];
  points: VargaPoint[];
  why: string[];
  how: string;
  chart: { lagnaSign: number; planets: Record<GrahaId, number> };
  /** Hora split of D2: planets of the Sun's hora and of the Moon's hora. */
  hora?: { sun: GrahaId[]; moon: GrahaId[] };
}

export const VARGA_META: Record<VargaN, { code: string; name: string; short: string; question: string; how: string }> = {
  2: { code: "D2", name: "Hora", short: "tiền bạc và nguồn lực", question: "Bạn có xu hướng tạo lập, giữ và dùng nguồn lực vật chất theo cách nào?", how: "D2 (Hora) chia mỗi cung làm hai nửa 15 độ. Cung lẻ (Bạch Dương, Song Tử, Sư Tử, Thiên Bình, Nhân Mã, Bảo Bình): nửa đầu thuộc Mặt Trời (Sư Tử), nửa sau thuộc Mặt Trăng (Cự Giải); cung chẵn thì ngược lại. D2 là lớp phụ của nhà 2 và nhà 11." },
  3: { code: "D3", name: "Drekkana", short: "nghị lực và anh chị em", question: "Bạn có xu hướng tự hành động, dựng bản lĩnh và quan hệ với anh chị em, người đồng lứa như thế nào?", how: "D3 (Drekkana) chia mỗi cung làm ba phần 10 độ: phần đầu thuộc chính cung, phần hai thuộc cung thứ năm, phần ba thuộc cung thứ chín tính từ nó. D3 là lớp phụ của nhà 3." },
  4: { code: "D4", name: "Chaturthamsha", short: "nhà cửa và nền tảng sống", question: "Những điều gì tạo nên cảm giác ổn định và nền tảng vật chất lâu dài cho bạn?", how: "D4 (Chaturthamsha) chia mỗi cung làm bốn phần 7 độ 30 phút: phần đầu thuộc chính cung, ba phần sau thuộc cung thứ tư, thứ bảy và thứ mười tính từ nó. D4 là lớp phụ của nhà 4." },
  7: { code: "D7", name: "Saptamsha", short: "con cái và sự tiếp nối", question: "Những chỉ dấu nào liên quan tới con cái, trách nhiệm nuôi dưỡng và sự tiếp nối giữa các thế hệ?", how: "D7 (Saptamsha) chia mỗi cung làm bảy phần: cung lẻ đếm từ chính nó, cung chẵn đếm từ cung thứ bảy tính từ nó. D7 là lớp phụ của nhà 5." },
  9: { code: "D9", name: "Navamsha", short: "hôn nhân, cam kết và chiều sâu của các hành tinh", question: "Các hành tinh của bạn thật sự có sức đến đâu khi trưởng thành, và bạn cam kết với một mối quan hệ như thế nào?", how: "D9 (Navamsha) chia mỗi cung làm chín phần 3 độ 20 phút. D9 là lớp phụ của nhà 7 và của cả lá số; hành tinh ở cùng một cung trong D1 và D9 gọi là Vargottama." },
  10: { code: "D10", name: "Dashamsha", short: "nghề nghiệp và vai trò", question: "Bạn có xu hướng đảm nhận trách nhiệm, vai trò và phát triển chuyên môn như thế nào?", how: "D10 (Dashamsha) chia mỗi cung làm mười phần 3 độ: cung lẻ đếm từ chính nó, cung chẵn đếm từ cung thứ chín. D10 là lớp phụ của nhà 10; mình không dùng nó để đoán một chức danh." },
};

const RANK: Record<Dignity, number> = { exalted: 4, moolatrikona: 3, own: 3, friend: 2, neutral: 1, none: 1, enemy: 0, debilitated: -1 };
const DIG_WORD: Record<Dignity, string> = { exalted: "cung vượng", moolatrikona: "cung gốc", own: "cung của chính nó", friend: "cung của một hành tinh bạn", neutral: "một cung trung tính", none: "", enemy: "cung của một hành tinh không thân", debilitated: "cung suy" };
const KEY: Record<string, string> = { sun: "ý chí", moon: "cảm xúc", mars: "sức bật", mercury: "trí óc", jupiter: "niềm tin", venus: "tình cảm", saturn: "kỷ luật", rahu: "khát vọng vượt khuôn", ketu: "sự buông bỏ và trực giác" };
const el = (sign: number) => ({ fire: "Lửa", earth: "Đất", air: "Khí", water: "Nước" })[ELEMENT_OF(sign)];

interface Pt { s: number; title: string; text: string[] }
const top = (pts: Pt[], k: number): VargaPoint[] => pts.sort((a, b) => b.s - a.s).slice(0, k).map((p) => ({ title: p.title, paragraphs: p.text }));

interface Ctx3 { c: Ctx; F: Facts; vc: VargaChart; st: Stability; n: VargaN; trust: VargaReading["trust"]; read: boolean }

const vSign = (x: Ctx3, id: GrahaId) => x.vc.planets[id].sign;
const shift = (x: Ctx3, id: GrahaId) => RANK[x.vc.planets[id].dignity] - RANK[x.vc.planets[id].d1Dignity];
const vHouseSign = (x: Ctx3, h: number) => mod(x.vc.lagnaSign + h - 1, 12);
const vHouseLord = (x: Ctx3, h: number) => SIGN_LORD[vHouseSign(x, h)];
const place = (x: Ctx3, id: GrahaId) => `${nameOf(id)} ở ${SIGNS[vSign(x, id)]}${DIG_WORD[x.vc.planets[id].dignity] ? ` (${DIG_WORD[x.vc.planets[id].dignity]})` : ""}`;
/** The house a planet takes in this chart, or null when the chart cannot be read by houses. */
const vHouse = (x: Ctx3, id: GrahaId) => (x.read ? x.vc.planets[id].house : null);

/** A planet that is at once Vargottama-like (same sign as D1) or changes strength between D1 and the divisional chart. */
function movement(x: Ctx3, id: GrahaId, topic: string, code: string): Pt | null {
  const p = x.vc.planets[id], d = shift(x, id);
  if (d >= 2) return { s: 2 + d * 0.3, title: `${nameOf(id)} mạnh lên ở ${code}`, text: [`${place(x, id)} ở ${code}, trong khi ở D1 phẩm vị của nó kém hơn. Phần ${KEY[id]} của bạn có chỗ chưa lộ hết ở lá số chính và thường chắc dần theo năm tháng. Với ${topic}, đây là một mạch ngầm đáng tin.`] };
  if (d <= -2) return { s: 2 + Math.abs(d) * 0.3, title: `${nameOf(id)} kém đi ở ${code}`, text: [`${nameOf(id)} có phẩm vị tốt hơn ở D1 so với ${code}: ${place(x, id)}. Phần ${KEY[id]} cần được chăm bằng việc làm đều đặn mới thành, nhất là với ${topic}.`] };
  void p;
  return null;
}

// ------------------------------------------------------------------ D9

function d9(x: Ctx3): { summary: string[]; points: VargaPoint[]; why: string[] } {
  const { F, vc, c } = x, n = c.n;
  const pts: Pt[] = [];
  const vg = (["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"] as GrahaId[]).filter((id) => n.grahas[id].vargottama);
  if (vg.length) pts.push({ s: 2.6 + vg.length * 0.2, title: "Những hành tinh giữ nguyên cung", text: [`${joinVi(vg.map(nameOf))} đứng cùng một cung ở D1 và D9 (Vargottama). ${vg.length > 1 ? "Những hành tinh này" : "Hành tinh này"} cho thấy điều nó đại diện không đổi theo tuổi tác: ${joinVi(vg.map((id) => KEY[id]))} là phần rất rõ nét và bền ở bạn.`] });
  for (const id of ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"] as GrahaId[]) { const m = movement(x, id, "chiều sâu của các hành tinh khi trưởng thành", "D9"); if (m) pts.push(m); }
  // marriage and commitment: the 7th of D1 against the 7th of D9, and Venus
  const L7 = F.houses[6].lord_;
  const venusShift = shift(x, "venus");
  const venusPhrase = venusShift >= 1 ? "Sao Kim, hành tinh của tình cảm, mạnh lên ở D9" : venusShift <= -1 ? "Sao Kim, hành tinh của tình cảm, yếu hơn ở D9" : "Sao Kim giữ nguyên sức ở D9";
  if (x.read) {
    const seventhSign = vHouseSign(x, 7), lord7 = vHouseLord(x, 7);
    pts.push({ s: 2.9, title: "Chuyện đôi lứa và cam kết", text: [
      D9_SEVENTH[seventhSign],
      `Ở D1, chủ nhà 7 là ${nameOf(L7.id)} đang ${L7.grade === "strong" ? "rất vững" : L7.grade === "good" ? "khá vững" : L7.grade === "weak" ? "còn yếu" : "ở mức vừa"}; ở D9, nhà 7 là cung ${SIGNS[seventhSign]} do ${nameOf(lord7)} cai quản, và ${place(x, lord7)}. ${venusPhrase}.`,
    ] });
    const d1Good = x.c.tones[6] === "good", d9Hard = vc.planets[lord7].dignity === "debilitated" || [6, 8, 12].includes(vc.planets[lord7].house);
    if ((d1Good && d9Hard) || (x.c.tones[6] === "hard" && !d9Hard && RANK[vc.planets[lord7].dignity] >= 3)) pts.push({ s: 3.2, title: "Hai lá số nói hai điều khác nhau", text: [d1Good ? "Lá số chính cho chuyện đôi lứa nhiều chỉ báo thuận, còn D9 cho thấy chủ nhà 7 đứng ở thế khó. Mình không coi D9 là kết luận cuối phủ nhận D1: hãy đọc D1 là điều dễ đến với bạn, D9 là điều cần chăm để nó bền." : "Lá số chính cho chuyện đôi lứa nhiều điều kiện cần cân nhắc, còn D9 cho thấy chủ nhà 7 đứng khá vững. Điều đó nói rằng càng trưởng thành, phần cam kết của bạn càng chắc hơn những gì D1 gợi ý."] });
  } else {
    pts.push({ s: 2.9, title: "Chuyện đôi lứa và cam kết", text: [`${venusPhrase}. Vì cung mọc của D9 có thể đổi trong sai số giờ sinh, mình không đọc nhà 7 của D9 và chỉ dựa vào Sao Kim.`] });
  }
  // dharma: Jupiter and the 9th of D9
  const jup = F.planets.jupiter;
  pts.push({ s: 2, title: "Giá trị dài hạn", text: [`${place(x, "jupiter")} ở D9, trong khi ở D1 Sao Mộc ${isGood(jup) ? "khá vững" : "chưa nổi trội"}. ${shift(x, "jupiter") >= 1 ? "Niềm tin và nguyên tắc sống của bạn chín dần và chắc hơn so với vẻ ngoài lúc trẻ." : shift(x, "jupiter") <= -1 ? "Niềm tin và nguyên tắc sống của bạn cần được chăm bằng việc học và làm đúng điều mình tin, vì chúng dễ đứng yên ở mức ý định." : "Niềm tin và nguyên tắc sống của bạn khá nhất quán giữa hai lá số."}`] });
  const lagnaLine = x.read ? D9_LAGNA[vc.lagnaSign] : "";
  const summary = [
    `${lagnaLine ? lagnaLine + " " : ""}${vg.length ? `Có ${vg.length} hành tinh đứng cùng cung ở D1 và D9, nên phần lớn con người bạn nhìn thấy ở lá số chính cũng là con người bạn khi trưởng thành.` : "Không có hành tinh nào đứng cùng cung ở D1 và D9, nên con người bạn khi trưởng thành có những nét khác với lúc còn trẻ."}`,
  ];
  return { summary, points: top(pts, 3), why: [
    `D9 lagna: ${SIGNS[vc.lagnaSign]} (${el(vc.lagnaSign)}).`,
    ...(["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"] as GrahaId[]).map((id) => `${nameOf(id)}: D1 ${SIGNS[n.grahas[id].sign]} (${n.grahas[id].dignity}) → D9 ${SIGNS[vSign(x, id)]} (${vc.planets[id].dignity})${n.grahas[id].vargottama ? " · Vargottama" : ""}.`),
    ...(x.read ? [`Nhà 7 của D9: ${SIGNS[vHouseSign(x, 7)]}, chủ ${nameOf(vHouseLord(x, 7))}.`] : []),
  ] };
}

// ------------------------------------------------------------------ D10

function d10(x: Ctx3): { summary: string[]; points: VargaPoint[]; why: string[] } {
  const { F, vc, c } = x, n = c.n;
  const pts: Pt[] = [];
  const L10 = F.houses[9].lord_;
  const l10 = L10.id;
  const s10 = shift(x, l10);
  const h = vHouse(x, l10);
  pts.push({ s: 3, title: "Chủ nhà 10 trong D10", text: [
    `Ở D1, chủ nhà 10 là ${nameOf(l10)}${F.planets[l10].house ? `, đứng ở nhà ${F.planets[l10].house}` : ""}. Ở D10, ${place(x, l10)}${h ? `, nhà ${h} (${HOUSE_TAG[h - 1]})` : ""}.`,
    `${h ? D10_LORD_IN[h - 1] : ""} ${s10 >= 1 ? "Nó mạnh lên ở D10 nên phần nghề nghiệp trông dần rõ nét và chắc theo thời gian." : s10 <= -1 ? "Nó yếu hơn ở D10 nên điều hứa ở D1 cần được xây bằng kỹ năng thật và nếp làm việc đều." : "Sức của nó giữ nguyên giữa hai lá số, nên hướng nghề của bạn khá nhất quán."}`.trim(),
  ] });
  for (const id of ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"] as GrahaId[]) { const m = movement(x, id, "nghề nghiệp và vai trò", "D10"); if (m) pts.push(m); }
  if (x.read) {
    const lagLord = vHouseLord(x, 1), tenth = vHouseSign(x, 10), tenthLord = vHouseLord(x, 10);
    pts.push({ s: 2.5, title: "Cách bạn đảm nhận trách nhiệm", text: [`${D10_LAGNA[vc.lagnaSign]} Người cầm lái của D10 là ${nameOf(lagLord)}, ${place(x, lagLord)}${vHouse(x, lagLord) ? ` ở nhà ${vHouse(x, lagLord)}` : ""}.`] });
    const occ = vc.occupants[9].map(nameOf);
    pts.push({ s: occ.length ? 3.1 : 1.6, title: "Nhà 10 của D10", text: [occ.length ? `Nhà 10 của D10 là cung ${SIGNS[tenth]}, có ${joinVi(occ)} ngồi trong đó: ${occ.length > 1 ? "những hành tinh này" : "hành tinh này"} in dấu trực tiếp lên nghề của bạn. Chủ của nhà là ${nameOf(tenthLord)}, ${place(x, tenthLord)}.` : `Nhà 10 của D10 là cung ${SIGNS[tenth]}, không có hành tinh nào ngồi trong đó, nên nghề của bạn đi theo ${nameOf(tenthLord)}, ${place(x, tenthLord)}.`] });
    const work = [6, 7].map((k) => ({ k, occ: vc.occupants[k - 1] })).filter((o) => o.occ.length);
    if (work.length) pts.push({ s: 2.2, title: "Môi trường làm việc", text: [`Ở D10, ${work.map((w) => `nhà ${w.k} (${w.k === 6 ? "công việc hằng ngày và cạnh tranh" : "đối tác và khách hàng"}) có ${joinVi(w.occ.map(nameOf))}`).join("; ")}, nên đây là phần bạn hay phải để ý trong cách làm việc cùng người khác.`] });
    const wealth = [2, 11].flatMap((k) => vc.occupants[k - 1]);
    if (wealth.length) pts.push({ s: 2, title: "Thành quả từ nghề", text: [`${joinVi(wealth.map(nameOf))} đứng ở nhà thu nhập của D10, nên thành quả vật chất từ nghề gắn với ${joinVi(wealth.map((id) => KEY[id]))}.`] });
  }
  const mism = F.houses[9].tier === "top" && x.read && [6, 8, 12].includes(vc.planets[l10].house);
  if (mism) pts.push({ s: 3.2, title: "D1 và D10 chưa cùng nhịp", text: ["Ở D1, nhà 10 có nền vững, nhưng chủ nhà 10 đứng ở một nhà khó của D10. Điều đó không phủ nhận D1: nó nói rằng vị thế bạn có được cần đi cùng kỹ năng và sự bền bỉ thì mới giữ vững."] });
  const summary = [`D10 đặt cạnh nhà 10 của D1: ${F.houses[9].tier === "top" ? "nhà nghề nghiệp ở lá số chính có nền vững" : F.houses[9].tier === "low" ? "nhà nghề nghiệp ở lá số chính có nền mỏng hơn các nhà khác" : "nhà nghề nghiệp ở lá số chính ở mức giữa bảng"}, và ${s10 >= 1 ? "D10 cho thấy chủ nhà ấy khỏe hơn, nên phần nghề của bạn có xu hướng rõ nét hơn theo năm tháng" : s10 <= -1 ? "D10 cho thấy chủ nhà ấy yếu hơn, nên điều hứa ở lá số chính cần được kiểm chứng bằng kỹ năng thật" : "D10 giữ nguyên sức của chủ nhà ấy, nên hướng đi giữa hai lá số nhất quán"}. Đây là bản đồ về cách bạn làm việc, không phải lời đoán chức danh.`];
  return { summary, points: top(pts, 3), why: [
    `D10 lagna: ${SIGNS[vc.lagnaSign]}.`,
    `Chủ nhà 10 (D1): ${nameOf(l10)}, D1 ${SIGNS[n.grahas[l10].sign]} (${n.grahas[l10].dignity}) → D10 ${SIGNS[vSign(x, l10)]} (${vc.planets[l10].dignity}).`,
    ...(x.read ? [`Nhà 10 của D10: ${SIGNS[vHouseSign(x, 10)]}, chủ ${nameOf(vHouseLord(x, 10))}.`] : []),
  ] };
}

// ------------------------------------------------------------------ D7

function d7(x: Ctx3): { summary: string[]; points: VargaPoint[]; why: string[] } {
  const { F, vc, c } = x, n = c.n;
  const pts: Pt[] = [];
  const L5 = F.houses[4].lord_, jup = F.planets.jupiter;
  pts.push({ s: 3, title: "Sao Mộc, hành tinh của con cháu", text: [`Trong truyền thống, Sao Mộc là hành tinh đại diện cho con cái. Ở D1 nó ${jup.grade === "strong" ? "rất vững" : jup.grade === "good" ? "khá vững" : jup.grade === "weak" ? "còn yếu" : "ở mức vừa"}; ở D7, ${place(x, "jupiter")}${vHouse(x, "jupiter") ? `, nhà ${vHouse(x, "jupiter")}` : ""}. ${shift(x, "jupiter") >= 1 ? "Nó mạnh lên ở D7, nên phần che chở và dạy dỗ thế hệ sau của bạn có nền tốt." : shift(x, "jupiter") <= -1 ? "Nó yếu hơn ở D7, nên chuyện nuôi dạy cần thêm sự kiên nhẫn chủ động." : "Sức của nó giữ nguyên, nên nhịp chăm sóc và dạy dỗ của bạn ổn định."}`] });
  const l5 = L5.id;
  pts.push({ s: 2.8, title: "Chủ nhà 5", text: [`Ở D1, chủ nhà 5 là ${nameOf(l5)}${F.planets[l5].house ? `, nhà ${F.planets[l5].house}` : ""}, đang ${F.planets[l5].grade === "weak" ? "còn yếu" : isGood(F.planets[l5]) ? "khá vững" : "ở mức vừa"}. Ở D7, ${place(x, l5)}${vHouse(x, l5) ? `, nhà ${vHouse(x, l5)} (${HOUSE_TAG[vHouse(x, l5)! - 1]})` : ""}.`] });
  for (const id of ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"] as GrahaId[]) { if (id === "jupiter") continue; const m = movement(x, id, "con cái và sự tiếp nối", "D7"); if (m) pts.push(m); }
  if (x.read) {
    const lagLord = vHouseLord(x, 1), fifth = vHouseSign(x, 5), fifthLord = vHouseLord(x, 5);
    pts.push({ s: 2.4, title: "Vai trò chăm sóc", text: [`Cung mọc của D7 là ${SIGNS[vc.lagnaSign]} (${el(vc.lagnaSign)}), do ${nameOf(lagLord)} cai quản; ${place(x, lagLord)}. ${({ Lửa: "Bạn nuôi dạy bằng việc làm gương và khuyến khích con dám thử.", Đất: "Bạn nuôi dạy bằng nề nếp và sự lo trước cho một tương lai vững.", Khí: "Bạn nuôi dạy bằng trò chuyện, giảng giải và để con hiểu vì sao.", Nước: "Bạn nuôi dạy bằng sự gần gũi và nhạy với tâm trạng của con." } as Record<string, string>)[el(vc.lagnaSign)]}`] });
    const occ = vc.occupants[4];
    pts.push({ s: occ.length ? 2.9 : 1.5, title: "Nhà 5 của D7", text: [occ.length ? `Nhà 5 của D7 là cung ${SIGNS[fifth]}, có ${joinVi(occ.map(nameOf))} ngồi trong đó, nên chuyện con cái và sự tiếp nối mang thêm màu của ${joinVi(occ.map((id) => KEY[id]))}.` : `Nhà 5 của D7 là cung ${SIGNS[fifth]}, chưa có hành tinh nào ngồi trong đó, nên chuyện này đi theo ${nameOf(fifthLord)}, ${place(x, fifthLord)}.`] });
  }
  const summary = ["D7 là lá số về những gì bạn nuôi dưỡng và để lại: con ruột, học trò và cả những người bạn dẫn dắt. Nó không cho biết bạn có bao nhiêu con hay khi nào, và mình không đọc nó theo cách ấy; nó nói về cách bạn chăm sóc thế hệ sau và những điều kiện hỗ trợ việc đó.", `Đọc chung với nhà 5 của D1 (nền ${F.houses[4].tier === "top" ? "vững" : F.houses[4].tier === "low" ? "mỏng hơn các nhà khác" : "ở mức giữa"}) thì phần nuôi dạy của bạn ${F.houses[4].tier === "low" ? "cần chủ động hơn" : "có chỗ dựa khá tự nhiên"}.`];
  return { summary, points: top(pts, 3), why: [
    `D7 lagna: ${SIGNS[vc.lagnaSign]}.`,
    `Sao Mộc: D1 ${SIGNS[n.grahas.jupiter.sign]} (${n.grahas.jupiter.dignity}) → D7 ${SIGNS[vSign(x, "jupiter")]} (${vc.planets.jupiter.dignity}).`,
    `Chủ nhà 5 (D1): ${nameOf(l5)} → D7 ${SIGNS[vSign(x, l5)]}.`,
  ] };
}

// ------------------------------------------------------------------ D4

function d4(x: Ctx3): { summary: string[]; points: VargaPoint[]; why: string[] } {
  const { F, vc, c } = x, n = c.n;
  const pts: Pt[] = [];
  const L4 = F.houses[3].lord_, l4 = L4.id;
  pts.push({ s: 3, title: "Chủ nhà 4", text: [`Ở D1, chủ nhà 4 là ${nameOf(l4)}${F.planets[l4].house ? `, nhà ${F.planets[l4].house}` : ""}, đang ${L4.grade === "weak" ? "còn yếu" : isGood(L4) ? "khá vững" : "ở mức vừa"}. Ở D4, ${place(x, l4)}${vHouse(x, l4) ? `, nhà ${vHouse(x, l4)}` : ""}. ${shift(x, l4) >= 1 ? "Nó mạnh lên ở D4, nên cảm giác có chỗ để về sẽ rõ dần." : shift(x, l4) <= -1 ? "Nó yếu hơn ở D4, nên nền nhà cửa cần được dựng bằng kế hoạch rõ ràng, đừng chỉ dựa vào hoàn cảnh." : "Sức của nó giữ nguyên giữa hai lá số."}`] });
  const kar = (["moon", "mars", "venus"] as GrahaId[]).map((id) => ({ id, d: shift(x, id) }));
  const best = kar.sort((a, b) => b.d - a.d)[0];
  pts.push({ s: 2.4 + Math.abs(best.d) * 0.2, title: "Các hành tinh đại diện cho chốn an cư", text: [`Mặt Trăng (nơi chốn, người nuôi dưỡng), Sao Hỏa (đất đai) và Sao Kim (tiện nghi, phương tiện) đại diện cho chuyện này; ở D4, ${joinVi(["moon", "mars", "venus"].map((id) => place(x, id as GrahaId)))}. ${best.d >= 1 ? `${nameOf(best.id)} là chỗ tựa mạnh nhất.` : "Không hành tinh nào nổi trội hẳn, nên chuyện này đi theo công sức hơn là may mắn có sẵn."}`] });
  for (const id of ["sun", "mercury", "jupiter", "saturn"] as GrahaId[]) { const m = movement(x, id, "nhà cửa và nền tảng sống", "D4"); if (m) pts.push(m); }
  if (x.read) {
    const lagLord = vHouseLord(x, 1), fourth = vHouseSign(x, 4), fourthLord = vHouseLord(x, 4), ninthLord = vHouseLord(x, 9);
    pts.push({ s: 2.3, title: "Sự ổn định", text: [`Cung mọc của D4 là ${SIGNS[vc.lagnaSign]}, do ${nameOf(lagLord)} cai quản; ${place(x, lagLord)}. Nhà 4 của D4 là cung ${SIGNS[fourth]}${vc.occupants[3].length ? `, có ${joinVi(vc.occupants[3].map(nameOf))}` : ", chưa có hành tinh ngồi trong"}, do ${nameOf(fourthLord)} cai quản.`] });
    pts.push({ s: 2, title: "Phúc vận cho chuyện an cư", text: [`Chủ nhà 9 của D4 là ${nameOf(ninthLord)}, ${place(x, ninthLord)}. Đọc cạnh nhà 9 của D1 (niềm tin và vận may), đây là chỗ chỉ ra việc ổn định chỗ ở của bạn ${RANK[vc.planets[ninthLord].dignity] >= 2 ? "có thêm sự nâng đỡ từ phúc phần" : "chủ yếu do bạn tự gây dựng"}.`] });
  }
  const summary = ["D4 gom lại những yếu tố tạo cảm giác bạn có một nơi để về: nhà cửa, đất đai, xe cộ và những tài sản đứng yên một chỗ. Mình đọc nó cạnh nhà 4 của D1, không dùng nó để đoán việc mua bán cụ thể.", `Nhà 4 ở lá số chính có nền ${F.houses[3].tier === "top" ? "vững" : F.houses[3].tier === "low" ? "mỏng hơn các nhà khác" : "ở mức giữa bảng"}, và D4 ${shift(x, l4) >= 1 ? "bổ sung thêm sức cho chủ nhà ấy" : shift(x, l4) <= -1 ? "cho thấy chủ nhà ấy cần được chăm hơn" : "giữ nguyên bức tranh ấy"}.`];
  return { summary, points: top(pts, 3), why: [
    `D4 lagna: ${SIGNS[vc.lagnaSign]}.`,
    `Chủ nhà 4 (D1): ${nameOf(l4)}, D1 ${SIGNS[n.grahas[l4].sign]} → D4 ${SIGNS[vSign(x, l4)]} (${vc.planets[l4].dignity}).`,
  ] };
}

// ------------------------------------------------------------------ D3

function d3(x: Ctx3): { summary: string[]; points: VargaPoint[]; why: string[] } {
  const { F, vc, c } = x, n = c.n;
  const pts: Pt[] = [];
  const L3 = F.houses[2].lord_, l3 = L3.id, mars = F.planets.mars;
  pts.push({ s: 3, title: "Sao Hỏa và nghị lực", text: [`Sao Hỏa là hành tinh của sức bật và của anh chị em. Ở D1 nó ${mars.grade === "strong" ? "rất vững" : mars.grade === "good" ? "khá vững" : mars.grade === "weak" ? "còn yếu" : "ở mức vừa"}; ở D3, ${place(x, "mars")}${vHouse(x, "mars") ? `, nhà ${vHouse(x, "mars")}` : ""}. ${shift(x, "mars") >= 1 ? "Nó mạnh lên ở D3, nên bản lĩnh hành động của bạn càng dùng càng chắc." : shift(x, "mars") <= -1 ? "Nó yếu hơn ở D3, nên sức bật của bạn cần được nuôi bằng vận động đều và mục tiêu rõ." : "Sức của nó giữ nguyên giữa hai lá số."}`] });
  pts.push({ s: 2.7, title: "Chủ nhà 3", text: [`Chủ nhà 3 ở D1 là ${nameOf(l3)}${F.planets[l3].house ? `, nhà ${F.planets[l3].house}` : ""}; ở D3, ${place(x, l3)}${vHouse(x, l3) ? `, nhà ${vHouse(x, l3)} (${HOUSE_TAG[vHouse(x, l3)! - 1]})` : ""}. ${shift(x, l3) >= 1 ? "Nó mạnh lên, nên sự tự lập của bạn có nền tốt." : shift(x, l3) <= -1 ? "Nó yếu hơn, nên sự tự lập của bạn đến từ rèn luyện hơn là có sẵn." : ""}`.trim()] });
  for (const id of ["sun", "moon", "mercury", "jupiter", "venus", "saturn"] as GrahaId[]) { const m = movement(x, id, "nghị lực và người đồng lứa", "D3"); if (m) pts.push(m); }
  if (x.read) {
    const lagLord = vHouseLord(x, 1), third = vHouseSign(x, 3), thirdLord = vHouseLord(x, 3), eleventh = vc.occupants[10];
    pts.push({ s: 2.4, title: "Cách bạn đối diện nỗi sợ", text: [`Cung mọc của D3 là ${SIGNS[vc.lagnaSign]} (${el(vc.lagnaSign)}), do ${nameOf(lagLord)} cai quản; ${place(x, lagLord)}. ${({ Lửa: "Dũng khí của bạn bùng lên khi hành động, và bạn thường hết sợ sau khi đã bắt đầu.", Đất: "Dũng khí của bạn bền: bạn không phô, nhưng đã quyết là đi đến cùng.", Khí: "Dũng khí của bạn nằm ở lời nói và trí óc: bạn dám hỏi, dám nghĩ khác.", Nước: "Dũng khí của bạn đến từ tình thương: có thể nhút nhát vì mình nhưng đứng ra vì người mình yêu." } as Record<string, string>)[el(vc.lagnaSign)]}`] });
    pts.push({ s: vc.occupants[2].length ? 2.8 : 1.6, title: "Nhà 3 của D3", text: [vc.occupants[2].length ? `Nhà 3 của D3 là cung ${SIGNS[third]}, có ${joinVi(vc.occupants[2].map(nameOf))} ngồi trong đó, nên quan hệ với anh chị em và người cùng chí hướng mang màu của ${joinVi(vc.occupants[2].map((id) => KEY[id]))}.` : `Nhà 3 của D3 là cung ${SIGNS[third]}, do ${nameOf(thirdLord)} cai quản, ${place(x, thirdLord)}.`] });
    if (eleventh.length) pts.push({ s: 1.9, title: "Anh chị em lớn và bạn bè thân", text: [`Nhà 11 của D3 có ${joinVi(eleventh.map(nameOf))}, nên những người đi trước hoặc cùng thế hệ thân thiết với bạn mang thêm màu của ${joinVi(eleventh.map((id) => KEY[id]))}.`] });
  }
  const summary = ["D3 là tấm gương soi lòng can đảm của bạn: nguồn ý chí giúp bạn tự đứng lên, cách bạn ứng phó trở ngại và những người sát vai như anh chị em, bạn đồng lứa. Mình đọc nó cạnh nhà 3 của D1 và Sao Hỏa.", `Nhà 3 ở lá số chính có nền ${F.houses[2].tier === "top" ? "vững" : F.houses[2].tier === "low" ? "mỏng hơn các nhà khác" : "ở mức giữa bảng"}; D3 ${shift(x, "mars") >= 1 || shift(x, l3) >= 1 ? "bổ sung thêm sức cho phần này" : shift(x, "mars") <= -1 || shift(x, l3) <= -1 ? "cho thấy phần này cần được rèn" : "giữ nguyên bức tranh ấy"}.`];
  return { summary, points: top(pts, 3), why: [
    `D3 lagna: ${SIGNS[vc.lagnaSign]}.`,
    `Sao Hỏa: D1 ${SIGNS[n.grahas.mars.sign]} (${n.grahas.mars.dignity}) → D3 ${SIGNS[vSign(x, "mars")]} (${vc.planets.mars.dignity}).`,
    `Chủ nhà 3 (D1): ${nameOf(l3)} → D3 ${SIGNS[vSign(x, l3)]}.`,
  ] };
}

// ------------------------------------------------------------------ D2

function d2(x: Ctx3): { summary: string[]; points: VargaPoint[]; why: string[]; hora: { sun: GrahaId[]; moon: GrahaId[] } } {
  const { F, c } = x, n = c.n;
  const seven: GrahaId[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
  const sun = seven.filter((id) => vSign(x, id) === 4), moon = seven.filter((id) => vSign(x, id) === 3);
  // Parashara: Sun, Mars, Jupiter are at home in the Sun's hora; Moon, Venus, Saturn in the Moon's hora; Mercury in either.
  const fitS = sun.filter((id) => ["sun", "mars", "jupiter"].includes(id)), fitM = moon.filter((id) => ["moon", "venus", "saturn"].includes(id));
  const pts: Pt[] = [];
  const earn = sun.length >= 5 ? "việc tự mình chủ động, tự nắm" : moon.length >= 5 ? "quan hệ, trao đổi và thị trường" : "cả hai cách, khá cân bằng";
  pts.push({ s: 3, title: "Cách kiếm và giữ", text: [`${sun.length} hành tinh của bạn đứng ở hora Mặt Trời (${sun.length ? joinVi(sun.map(nameOf)) : "không có"}) và ${moon.length} ở hora Mặt Trăng (${moon.length ? joinVi(moon.map(nameOf)) : "không có"}). Hora Mặt Trời nghiêng về nguồn thu tự mình chủ động, tự nắm; hora Mặt Trăng nghiêng về nguồn thu qua quan hệ, trao đổi và thị trường. Ở bạn, nguồn lực nghiêng về phía ${earn}.`] });
  const l2 = F.houses[1].lord_.id, l11 = F.houses[10].lord_.id;
  const uniq = [...new Set([l2, l11, "jupiter", "venus"] as GrahaId[])];
  const hora = (id: GrahaId) => (vSign(x, id) === 4 ? "Mặt Trời" : "Mặt Trăng");
  const one = uniq.every((id) => hora(id) === hora(uniq[0]));
  pts.push({ s: 2.8, title: "Những hành tinh của tiền bạc", text: [`Chủ nhà 2 là ${nameOf(l2)}, chủ nhà 11 ${l11 === l2 ? "cũng là nó" : "là " + nameOf(l11)}; Sao Mộc và Sao Kim là hai hành tinh tự nhiên của nguồn lực. Ở D2: ${joinVi(uniq.map((id) => `${nameOf(id)} ở hora ${hora(id)}`))}. ${one ? "Tất cả nghiêng về một hora, nên cách bạn tạo và dùng tiền khá nhất quán." : "Chúng chia ra hai hora, nên bạn có hai mạch thu nhập khác nhau và hay phải cân giữa tự làm và nhờ quan hệ."}`] });
  pts.push({ s: 2.2 + (fitS.length + fitM.length) * 0.2, title: "Hành tinh đứng đúng hora", text: [fitS.length + fitM.length ? `${joinVi([...fitS, ...fitM].map(nameOf))} đứng đúng hora quen thuộc của mình theo Parashara, nên phần tiền bạc gắn với ${joinVi([...fitS, ...fitM].map((id) => KEY[id]))} khá thuận tay.` : "Không hành tinh nào đứng đúng hora quen thuộc của mình theo Parashara, nên cách bạn kiếm tiền khó theo một công thức có sẵn và thường phải tự tìm lối riêng."] });
  const L2 = F.houses[1], L11 = F.houses[10];
  const summary = [`D2 chỉ trả lời một câu hỏi hẹp: bạn tạo lập và giữ nguồn lực theo kiểu nào. Mình đọc nó cạnh nhà 2 (tích lũy) và nhà 11 (thu nhập, thành quả) của D1: nhà 2 có nền ${L2.tier === "top" ? "vững" : L2.tier === "low" ? "mỏng hơn các nhà khác" : "ở mức giữa bảng"}, nhà 11 có nền ${L11.tier === "top" ? "vững" : L11.tier === "low" ? "mỏng hơn các nhà khác" : "ở mức giữa bảng"}. Khả năng kiếm, khả năng giữ và cách quản lý là ba chuyện khác nhau, và D2 chỉ cho biết chuyện đầu tiên rõ hơn hai chuyện còn lại.`];
  return { summary, points: top(pts, 3), why: [
    `Hora Mặt Trời: ${sun.length ? joinVi(sun.map(nameOf)) : "không có"}. Hora Mặt Trăng: ${moon.length ? joinVi(moon.map(nameOf)) : "không có"}.`,
    `Cung mọc ở hora ${vargaSign(n.lagna.lon, 2) === 4 ? "Mặt Trời" : "Mặt Trăng"}.`,
  ], hora: { sun, moon } };
}

// ------------------------------------------------------------------ assembling

export function readVargas(ctx: Ctx): VargaReading[] {
  const F = buildFacts(ctx), n = ctx.n;
  const st = stability(n, ctx.windowMin, ctx.noTime);
  const out: VargaReading[] = [];
  for (const v of [2, 3, 4, 7, 9, 10] as VargaN[]) {
    const meta = VARGA_META[v];
    const vc = vargaChart(n, v);
    const trust = vargaTrust(st, v, ctx.noTime);
    const x: Ctx3 = { c: ctx, F, vc, st, n: v, trust, read: trust.level === "chắc" || trust.level === "một phần" };
    const body = v === 2 ? d2(x) : v === 3 ? d3(x) : v === 4 ? d4(x) : v === 7 ? d7(x) : v === 9 ? d9(x) : d10(x);
    const planets = {} as Record<GrahaId, number>;
    for (const id of Object.keys(vc.planets) as GrahaId[]) planets[id] = vc.planets[id].sign;
    out.push({
      n: v, ...meta, trust, summary: body.summary, points: body.points, why: body.why,
      chart: { lagnaSign: vc.lagnaSign, planets },
      ...(v === 2 ? { hora: (body as ReturnType<typeof d2>).hora } : {}),
    });
  }
  return out;
}
