// The house essay (v4). The analysis runs through every step a Jyotishi would take, but the page says only what the steps add up to.
//
//   Step 1 – nature of the house: the topic, the sign on it, its group (kendra, trikona, upachaya, dusthana), its natural karaka.
//   Step 2 – the lord: where it goes (which other area of life it ties this one to), its dignity, its Shadbala grade, combustion.
//   Step 3 – planets inside and planets looking in (Graha Drishti), each weighed by nature, functional role and dignity.
//   Step 4 – cross-checks: Bhava Bala rank, SAV, yogas that really hold, the karaka's condition.
//   Step 5 – synthesis: every piece of evidence is a signed weight with a plain-language meaning. The central sentence is built from
//            the overall balance and the heaviest piece; two or three paragraphs follow, grouping the evidence that points the same
//            way, and a contrast paragraph appears only when strong evidence points both ways.
//
// Every claim on the page comes from one evidence item, and every evidence item is listed (with its numbers) in `why`.
// Nothing is concluded from a single symbolic indicator: the wording stays at "có xu hướng", "thường", "dễ".
import { SIGNS, FRIENDS, ENEMIES, type GrahaId } from "../engine/constants.ts";
import type { Ctx } from "./ctx.ts";
import { effectiveYoga, isGood, type Facts, type HouseFact, type PlanetFact } from "./facts.ts";
import { HOUSE_TAG } from "./content/houses-signs.ts";
import { DIGNITY_VI } from "./shared.ts";
import { nameOf, joinVi } from "./util.ts";
import type { ExpressiveLevel, HousePathway, SupportLevel } from "./types.ts";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const pick = <T,>(list: T[], seed: number): T => list[Math.abs(Math.round(seed)) % list.length];
const area = (h: number) => HOUSE_TAG[h - 1];

/** What each house is about, said so it can follow "chuyện …". */
export const TOPIC: string[] = [
  "bản thân, sức khỏe nền và cách bạn bước vào đời",
  "tiền bạc, lời nói và nếp nhà đã nuôi bạn lớn",
  "sự chủ động, kỹ năng tự tay làm và anh chị em",
  "nhà cửa, mẹ và cảm giác có chỗ để về",
  "sáng tạo, tình yêu lúc chớm nở, con cái và việc học",
  "công việc hằng ngày, sức khỏe, nợ nần và những va chạm",
  "hôn nhân, người đồng hành và các mối hợp tác",
  "những biến chuyển lớn, nguồn lực chung và điều ít người thấy",
  "niềm tin, thầy học, người cha và những chặng đi xa",
  "nghề nghiệp, vị thế và trách nhiệm trước xã hội",
  "thu nhập, bạn bè và những mục tiêu dài hạn",
  "giấc ngủ, những lúc ở một mình, chi tiêu và sự buông bỏ",
];

/** How each house looks in daily life when the balance is favourable, and when it asks for work. */
const PRACTICE: { plus: string; minus: string }[] = [
  { plus: "Bạn thường hồi sức nhanh, đủ tự tin để đứng ra trước người khác, và khó bị hoàn cảnh làm lệch hướng lâu.", minus: "Sức khỏe nền và sự tự tin của bạn phụ thuộc nhiều vào nhịp sống; khi kiệt sức, bạn dễ nghi ngờ chính mình hơn người khác." },
  { plus: "Tiền bạc có xu hướng tích lại khi bạn giữ được một nếp chi tiêu, và lời bạn nói thường có trọng lượng.", minus: "Tiền dễ đến rồi đi theo hoàn cảnh; một kế hoạch tiết kiệm cụ thể có tác dụng với bạn nhiều hơn là hy vọng thu nhập tăng." },
  { plus: "Bạn dám tự bắt đầu và học kỹ năng mới khá nhanh; anh chị em hay bạn đồng lứa thường là chỗ cùng làm.", minus: "Sự chủ động của bạn cần một mục tiêu rõ mới bật lên; với anh chị em, khoảng cách hoặc khác biệt là chuyện cần chấp nhận hơn là sửa." },
  { plus: "Bạn có xu hướng tìm được hoặc tạo được một nơi ở yên ổn, và gia đình thường là chỗ nạp lại sức.", minus: "Cảm giác yên ổn trong nhà không tự có; chuyển chỗ ở, trách nhiệm với gia đình hoặc những khác biệt với mẹ có thể là đề tài lặp lại." },
  { plus: "Bạn học tốt khi được hứng thú, sáng tạo có duyên và thường tìm được niềm vui trong những việc mình tự chọn.", minus: "Niềm vui, chuyện yêu đương và con cái có thể đến chậm hoặc kèm nhiều lo lắng; điều giúp bạn nhất là cho phép mình làm một việc chỉ vì thích." },
  { plus: "Bạn xử lý việc hằng ngày gọn, chịu được áp lực và thường thắng trong cạnh tranh nhờ bền hơn người.", minus: "Công việc hằng ngày dễ dồn lên bạn, và sức khỏe phản ánh khá rõ mức căng thẳng; nếp nghỉ đều có giá trị như một phần của công việc." },
  { plus: "Bạn có xu hướng gặp được người đồng hành tử tế, và hợp tác thường mang lại cho bạn nhiều hơn là làm một mình.", minus: "Các mối quan hệ gắn bó đòi bạn nhiều điều chỉnh; chọn người chậm và nói rõ kỳ vọng từ đầu giúp bạn tránh nhiều hiểu lầm." },
  { plus: "Bạn có sức đứng dậy sau biến cố và thường hiểu sâu những chuyện người khác né tránh.", minus: "Những thay đổi lớn có thể đến bất ngờ; giữ quỹ dự phòng và rõ ràng trong tiền chung là cách đơn giản nhất để chúng bớt chao đảo." },
  { plus: "Bạn thường gặp được người dẫn đường đúng lúc, và niềm tin của bạn là chỗ dựa thật trong những ngã rẽ.", minus: "Niềm tin của bạn hình thành qua nghi ngờ và tự kiểm chứng; với cha hoặc thầy, khác biệt quan điểm có thể là chuyện quen thuộc." },
  { plus: "Bạn có xu hướng được giao trách nhiệm và giữ được vị trí khi đã đặt chân vào.", minus: "Con đường nghề nghiệp có thể nhiều đổi hướng hoặc chậm được ghi nhận; kỹ năng cụ thể và sự bền bỉ quan trọng với bạn hơn là thời cơ." },
  { plus: "Công sức của bạn thường ra kết quả, và những mối quan hệ rộng mở thêm cơ hội.", minus: "Kết quả thường đến muộn hơn công sức; đặt mục tiêu nhỏ và đo được giúp bạn thấy mình đang tiến." },
  { plus: "Bạn biết lấy lại sức bằng khoảng yên tĩnh, và những gì cho đi thường quay về theo cách khác.", minus: "Chi tiêu, mất ngủ hoặc cảm giác hao sức là điều cần để ý; ranh giới rõ với thời gian và tiền của mình giúp bạn nhiều." },
];

/** What a planet brings into any topic, in its helping and in its harder form. */
const FLAVOR: Record<GrahaId, { adds: string; risk: string }> = {
  sun: { adds: "ý chí, sự rõ ràng và mong muốn được ghi nhận", risk: "cái tôi và sự cứng nhắc" },
  moon: { adds: "sự nhạy cảm, quan tâm và nhu cầu gần gũi", risk: "tâm trạng lên xuống" },
  mars: { adds: "sức bật, sự quyết liệt và tinh thần dám làm", risk: "vội vàng và va chạm" },
  mercury: { adds: "sự linh hoạt, óc tính toán và khả năng trao đổi", risk: "lo nghĩ và phân tán" },
  jupiter: { adds: "sự rộng rãi, hiểu biết và người nâng đỡ", risk: "kỳ vọng quá mức" },
  venus: { adds: "sự hòa nhã, thẩm mỹ và cảm giác dễ chịu", risk: "chiều theo cảm giác dễ chịu" },
  saturn: { adds: "sự nghiêm túc, bền bỉ và chậm mà chắc", risk: "chậm trễ và cảm giác nặng gánh" },
  rahu: { adds: "khát khao, cái mới và những lối đi khác thường", risk: "sự không yên và cái nhìn phóng đại" },
  ketu: { adds: "sự tách biệt, trực giác và ít bám víu", risk: "sự thờ ơ hoặc khó thấy đủ" },
};

/** Plain meaning of the lord of the house going to another house, by the kind of house it goes to. */
function lordLink(hf: HouseFact): { text: string; w: number } {
  const n = hf.n, p = hf.lordHouse, t = area(n), to = area(p);
  const K = `${nameOf(hf.lord)}, hành tinh giữ chìa khóa của mảng này,`;
  if (p === n) return { text: `${K} ở ngay trong nhà của mình, nên chuyện ${t} khá tự chủ, ít phải dựa vào mảng khác`, w: 1 };
  if (p === 1) return { text: `${K} đi về cung mọc, nên chuyện ${t} gắn chặt với chính con người bạn và những gì bạn tự quyết`, w: 0.8 };
  if ([6, 8, 12].includes(p)) {
    if ([6, 8, 12].includes(n)) return { text: `${K} đi vào một mảng khó khác (${to}); truyền thống xem đây là thế "khó gặp khó", khó khăn của mảng này có xu hướng tự hóa giải hoặc chuyển thành sức bền`, w: 0.6 };
    return { text: `${K} đi vào chuyện ${to}, nên chuyện ${t} thường phải đi qua ${p === 6 ? "cạnh tranh, áp lực hoặc công việc nặng" : p === 8 ? "những thay đổi bất ngờ hoặc giai đoạn khó nói" : "những lúc phải lùi lại, chi phí hoặc khoảng cách"} trước khi ổn định`, w: -0.9 };
  }
  if ([5, 9].includes(p)) return { text: `${K} đi về chuyện ${to}, một vùng phúc phần, nên chuyện ${t} thường được nâng đỡ bởi hiểu biết, may mắn hoặc người tốt`, w: 0.9 };
  if ([4, 7, 10].includes(p)) return { text: `${K} đi về chuyện ${to}, một trụ cột của lá số, nên chuyện ${t} có chỗ đứng vững và thường hiện ra rõ trong đời sống`, w: 0.7 };
  if (p === 11) return { text: `${K} đi về chuyện ${to}, nên chuyện ${t} có xu hướng ra kết quả cụ thể và gắn với những người bạn quen`, w: 0.6 };
  if (p === 2) return { text: `${K} đi về chuyện ${to}, nên chuyện ${t} gắn với tiền bạc, lời nói và gia đình gốc`, w: 0.4 };
  return { text: `${K} đi về chuyện ${to}, nên chuyện ${t} lớn dần theo công sức và sự chủ động của bạn`, w: 0.3 };
}

const SIGN_STYLE = ["nhanh và thẳng", "chậm mà chắc", "linh hoạt, nhiều hướng", "giàu cảm xúc, thiên về che chở", "muốn được thấy và tự hào về nó", "kỹ lưỡng, thực tế", "cân nhắc, coi trọng sự công bằng", "kín, sâu và dứt khoát", "rộng mở, theo lý tưởng", "nghiêm túc, có kế hoạch", "độc lập, khác lối quen", "mềm mại, giàu trực giác"];

/** Where the house leads, said as a plain fact of life. */
function plainLink(hf: HouseFact, it = ""): string {
  const n = hf.n, p = hf.lordHouse, to = area(p);
  const t = area(n);
  const S = it || `chuyện ${t}`;
  if (p === n) return `${S} khá tự chủ, ít phụ thuộc vào hoàn cảnh bên ngoài`;
  if (p === 1) return `${S} gắn chặt với chính con người bạn: bạn tự quyết và tự gánh lấy nó`;
  if ([6, 8, 12].includes(p) && [6, 8, 12].includes(n)) return `những khó khăn ở mảng này thường tự gỡ được theo thời gian và để lại cho bạn sức bền`;
  if (p === 6) return `${S} thường phải đi qua cạnh tranh, áp lực hoặc nhiều việc nặng rồi mới ổn định`;
  if (p === 8) return `${S} hay có những thay đổi bất ngờ trước khi đi vào nếp`;
  if (p === 12) return `${S} hay gắn với khoảng cách, những lúc phải lùi lại hoặc những khoản chi tiêu`;
  if ([5, 9].includes(p)) return `${S} thường được may mắn hoặc người tốt nâng đỡ, nhất là qua chuyện ${to}`;
  if ([4, 7, 10].includes(p)) return `${S} gắn với chuyện ${to} và thường hiện rõ trong đời sống của bạn`;
  if (p === 11) return `${S} dễ mang lại kết quả cụ thể và hay gắn với bạn bè, các mối quan hệ rộng`;
  if (p === 2) return `${S} gắn với tiền bạc, lời nói và gia đình`;
  return `${S} lớn dần theo sự chủ động và công sức của bạn`;
}

/** What a planet does to any area, said as a clause about the person (no planet name). */
const DOES: Record<GrahaId, { does: string; risk: string }> = {
  sun: { does: "bạn muốn được ghi nhận và làm việc theo ý mình", risk: "dễ cứng nhắc hoặc nặng cái tôi" },
  moon: { does: "bạn đặt nhiều cảm xúc và sự quan tâm vào chuyện này", risk: "dễ lên xuống theo tâm trạng" },
  mars: { does: "bạn dám làm, quyết liệt và hành động nhanh", risk: "dễ vội vàng và va chạm" },
  mercury: { does: "bạn linh hoạt, tính toán giỏi và trao đổi khéo", risk: "dễ lo nghĩ và phân tán" },
  jupiter: { does: "bạn có cái nhìn rộng và thường gặp người nâng đỡ", risk: "dễ kỳ vọng quá mức" },
  venus: { does: "bạn xử lý chuyện này bằng sự hòa nhã và gu thẩm mỹ", risk: "dễ chiều theo cảm giác dễ chịu" },
  saturn: { does: "bạn nghiêm túc, bền bỉ, đi chậm mà chắc", risk: "dễ thấy chậm trễ và nặng gánh" },
  rahu: { does: "bạn bị cuốn về những điều mới và khác thường", risk: "dễ không yên hoặc kỳ vọng quá xa" },
  ketu: { does: "bạn khá tách biệt, sống bằng trực giác và ít bám víu", risk: "dễ thờ ơ hoặc khó thấy đủ" },
};

const NATURE_GOOD: GrahaId[] = ["jupiter", "venus", "mercury", "moon"];
const UPACHAYA = [3, 6, 10, 11];
const rel = (a: GrahaId, b: GrahaId) => (a === b ? 1 : FRIENDS[a]?.includes(b) ? 1 : ENEMIES[a]?.includes(b) ? -1 : 0);

interface Ev { key: string; group: "lord" | "inside" | "look" | "base" | "yoga"; w: number; plus?: string; minus?: string; fact: string }

function gradeWord(p: PlanetFact): string {
  return p.grade === "strong" ? "rất vững" : p.grade === "good" ? "khá vững" : p.grade === "weak" ? "đang yếu" : "ở mức vừa";
}

function evidence(ctx: Ctx, F: Facts, hf: HouseFact): Ev[] {
  const ev: Ev[] = [];
  const L = hf.lord_, lk = lordLink(hf);
  ev.push({ key: "lordPlace", group: "lord", w: lk.w, plus: lk.w > 0 ? lk.text : undefined, minus: lk.w < 0 ? lk.text : undefined,
    fact: `Chủ nhà ${hf.n} là ${nameOf(L.id)}, ở nhà ${hf.lordHouse} (${SIGNS[L.sign]}), ${DIGNITY_VI[L.dignity].toLowerCase()}.` });
  const gw = L.grade === "strong" ? 1 : L.grade === "good" ? 0.5 : L.grade === "weak" ? -1 : 0;
  if (gw) ev.push({ key: "lordGrade", group: "lord", w: gw,
    plus: gw > 0 ? `${nameOf(L.id)} ${gradeWord(L)}, nên những gì nó hứa cho chuyện ${area(hf.n)} có sức để thành hiện thực` : undefined,
    minus: gw < 0 ? `${nameOf(L.id)}, hành tinh giữ chìa khóa của chuyện ${area(hf.n)}, ${gradeWord(L)}${L.g.combust ? " và bị Mặt Trời che khuất" : ""}, nên kết quả thường chậm hơn mong đợi` : undefined,
    fact: `${nameOf(L.id)}: điểm tổng hợp ${L.score.toFixed(1)} (${L.grade})${L.sb ? `, Shadbala ${Math.round(L.sb.ratio * 100)}%` : ""}${L.g.combust ? ", cháy sáng" : ""}${L.g.retro ? ", nghịch hành" : ""}.` });
  for (const id of hf.occupants) {
    const p = F.planets[id];
    const benefic = NATURE_GOOD.includes(id) && id !== "moon" || (id === "moon" && p.grade !== "weak");
    let w = benefic ? 0.6 : id === "rahu" || id === "ketu" ? -0.3 : -0.5;
    if (!benefic && UPACHAYA.includes(hf.n)) w = 0.5;
    if (p.grade === "strong") w += 0.4; else if (p.grade === "weak") w -= 0.4;
    if (["exalted", "own", "moolatrikona"].includes(p.dignity)) w += 0.3;
    if (p.dignity === "debilitated") w -= 0.5;
    const f = FLAVOR[id];
    const friendly = rel(L.id, id) > 0 && rel(id, L.id) >= 0;
    const other = p.lorded.filter((h) => h !== hf.n);
    const tie = !ctx.noTime && other.length ? `; vì nó cũng cai quản chuyện ${area(other[0])}, hai mảng này hay đi cùng nhau` : "";
    ev.push({ key: `in-${id}`, group: "inside", w,
      plus: w > 0 ? `${nameOf(id)} ${pick(["đứng ngay trong mảng này", "có mặt trực tiếp ở đây", "ở ngay trong nhà này"], hf.n + id.length)}, mang vào ${f.adds}${friendly && id !== L.id ? ", và nó hợp với hành tinh giữ chìa khóa nên hai bên làm việc thuận" : ""}${tie}` : undefined,
      minus: w <= 0 ? `${nameOf(id)} ${pick(["đứng ngay trong mảng này", "có mặt trực tiếp ở đây", "ở ngay trong nhà này"], hf.n + id.length)}, mang vào ${f.adds} nhưng cũng kéo theo ${f.risk}${tie}` : undefined,
      fact: `${nameOf(id)} trong nhà ${hf.n}: ${SIGNS[p.sign]}, ${DIGNITY_VI[p.dignity].toLowerCase()}, ${p.grade}${p.lorded.length ? `, chủ nhà ${p.lorded.join(", ")}` : ""}.` });
  }
  for (const id of hf.aspects) {
    if (hf.occupants.includes(id)) continue;
    const p = F.planets[id];
    let w = id === "jupiter" ? 0.8 : id === "venus" || id === "mercury" ? 0.4 : id === "moon" ? 0.2 : id === "saturn" ? -0.6 : id === "mars" ? -0.4 : -0.3;
    if ((id === "saturn" || id === "mars") && UPACHAYA.includes(hf.n)) w = 0.3;
    if (p.grade === "weak") w *= 0.6;
    const f = FLAVOR[id];
    ev.push({ key: `look-${id}`, group: "look", w,
      plus: w > 0 ? `${nameOf(id)} nhìn vào chuyện ${area(hf.n)} từ xa, góp thêm ${f.adds}` : undefined,
      minus: w <= 0 ? `${nameOf(id)} nhìn vào chuyện ${area(hf.n)} từ xa, đặt thêm ${f.risk}` : undefined,
      fact: `Góc chiếu: ${nameOf(id)} từ nhà ${p.house} nhìn vào nhà ${hf.n}.` });
  }
  if (hf.bhava) {
    const r = hf.bhava.rank;
    if (r <= 3) ev.push({ key: "bhava", group: "base", w: 0.7, plus: `bản thân chuyện ${area(hf.n)} có điều kiện mạnh hơn phần lớn các mảng khác (Bhava Bala cao)`, fact: `Bhava Bala: hạng ${r}/12.` });
    else if (r >= 10) ev.push({ key: "bhava", group: "base", w: -0.6, minus: `bản thân chuyện ${area(hf.n)} có điều kiện yếu hơn phần lớn các mảng khác (Bhava Bala thấp)`, fact: `Bhava Bala: hạng ${r}/12.` });
  }
  if (hf.sav >= 31) ev.push({ key: "sav", group: "base", w: 0.5, plus: `điểm hỗ trợ tổng hợp của chuyện ${area(hf.n)} cao, nên những gì đi qua mảng này thường được đỡ`, fact: `SAV ${hf.sav} (trung bình 28).` });
  else if (hf.sav <= 23) ev.push({ key: "sav", group: "base", w: -0.5, minus: `điểm hỗ trợ tổng hợp của chuyện ${area(hf.n)} thấp, nên những gì đi qua mảng này ít được đỡ sẵn`, fact: `SAV ${hf.sav} (trung bình 28).` });
  for (const k of hf.karakas) {
    if (k === L.id || hf.occupants.includes(k)) continue;
    const p = F.planets[k];
    if (p.grade === "strong" || p.grade === "weak") ev.push({ key: `karaka-${k}`, group: "base", w: p.grade === "strong" ? 0.4 : -0.4,
      plus: p.grade === "strong" ? `${nameOf(k)}, hành tinh tự nhiên của chuyện ${area(hf.n)}, đang khỏe` : undefined,
      minus: p.grade === "weak" ? `${nameOf(k)}, hành tinh tự nhiên của chuyện ${area(hf.n)}, đang yếu` : undefined,
      fact: `Karaka của nhà ${hf.n}: ${nameOf(k)} (${p.grade}).` });
  }
  for (const y of hf.yogas.filter(effectiveYoga).slice(0, 2)) {
    const good = y.tone === "good";
    ev.push({ key: `yoga-${y.id}`, group: "yoga", w: good ? 0.8 : -0.7,
      plus: good ? `${y.name} hình thành qua mảng này: ${yogaMeaning(y.id)}` : undefined,
      minus: !good ? `${y.name} hình thành qua mảng này: ${yogaMeaning(y.id)}` : undefined,
      fact: `Yoga: ${y.name} (${y.sanskrit}), ${y.strength === "strong" ? "mạnh" : "bình thường"}; hành tinh ${joinVi(y.grahas.map(nameOf))}.` });
  }
  return ev;
}

function yogaMeaning(id: string): string {
  const maha: Record<string, string> = { mahapurusha_ruchaka: "bạn có sức quyết đoán và khả năng chỉ huy hơn hẳn người thường", mahapurusha_bhadra: "bạn có trí óc sắc và khả năng trình bày rất rõ ràng", mahapurusha_hamsa: "bạn dễ được tin cậy nhờ hiểu biết và cách sống tử tế", mahapurusha_malavya: "bạn có gu thẩm mỹ, sự duyên dáng và khả năng làm người khác thấy dễ chịu", mahapurusha_shasha: "bạn có kỷ luật và khả năng tổ chức bền bỉ" };
  if (maha[id]) return maha[id];
  if (id.startsWith("raja")) return "đây là dấu hiệu của vị thế và sự ghi nhận";
  if (id.startsWith("dhana")) return "nó hỗ trợ khả năng tích lũy của bạn";
  if (id.startsWith("viparita")) return "khó khăn ở đây thường chuyển thành sức bền";
  if (id === "gajakesari") return "bạn dễ có uy tín nhờ sự hiểu biết";
  if (id === "budhaditya") return "bạn có trí óc sáng và khả năng trình bày";
  if (id.startsWith("parivartana")) return "mảng này gắn chặt với một mảng khác của đời bạn, bên này đổi thì bên kia cũng đổi";
  if (id.startsWith("kemadruma")) return "bạn thường quen tự lo cho mình hơn là trông vào người khác";
  if (id.startsWith("amala")) return "bạn dễ có tiếng tốt nhờ cách làm việc tử tế";
  if (id.startsWith("neecha")) return "một điểm yếu ban đầu có thể trở thành sức mạnh sau một chặng";
  return "những đặc điểm của mảng này được làm đậm thêm";
}

export const PATH_LABEL4: Record<HousePathway, string> = {
  strength: "bắt đầu từ điểm mạnh", contrast: "bắt đầu từ một sự trái chiều", bridge: "bắt đầu từ mối liên hệ với mảng khác",
  care: "bắt đầu từ điều kiện cần lưu ý", life: "bắt đầu từ đời sống thực tế", occupant: "bắt đầu từ hành tinh trong nhà",
  yoga: "bắt đầu từ một yoga", quiet: "mảng ít nổi bật",
};

export interface Narr4 { path: HousePathway; title: string; paragraphs: string[]; why: string[]; support: SupportLevel; expressive: ExpressiveLevel }

export function narrateHouse4(ctx: Ctx, F: Facts, hf: HouseFact, recent: HousePathway[]): Narr4 {
  const ev = evidence(ctx, F, hf);
  const n = hf.n, topic = TOPIC[n - 1], t = area(n);
  const plus = ev.filter((e) => e.w > 0 && e.plus).sort((a, b) => b.w - a.w);
  const minus = ev.filter((e) => e.w < 0 && e.minus).sort((a, b) => a.w - b.w);
  const sum = ev.reduce((s, e) => s + e.w, 0);
  const P = plus.reduce((s, e) => s + e.w, 0), M = -minus.reduce((s, e) => s + e.w, 0);
  const support: SupportLevel = sum >= 1.2 ? "thuận lợi" : sum <= -0.8 ? "cần rèn giũa" : "có thuận có khó";
  const weight = hf.occupants.length * 1 + hf.aspects.length * 0.5 + hf.yogas.filter(effectiveYoga).length;
  const expressive: ExpressiveLevel = weight >= 3 ? "sôi động" : weight >= 1.2 ? "vừa phải" : "yên tĩnh";

  // the way in: chosen from the facts, avoiding the way the previous house began
  const cands: HousePathway[] = [];
  if (P >= 1.2 && M >= 1.2) cands.push("contrast");
  if (plus.some((e) => e.group === "yoga")) cands.push("yoga");
  if (plus[0] && plus[0].w >= 0.8 && support === "thuận lợi") cands.push("strength");
  if (hf.occupants.length) cands.push("occupant");
  if (support === "cần rèn giũa") cands.push("care");
  cands.push("bridge", "life");
  if (weight < 1 && Math.abs(sum) < 0.8) cands.unshift("quiet");
  const last = recent[recent.length - 1];
  const path = cands.find((c) => c !== last) ?? cands[0];

  const seed = n * 3 + hf.sign;
  // ---- plain-language composition: no planet names, no technical terms (those stay in `why`)
  const lk = plainLink(hf);
  const grade = hf.lord_.grade;
  const hardLink = [6, 8, 12].includes(hf.lordHouse) && ![6, 8, 12].includes(n);
  const gradeTail = grade === "weak" ? (hardLink ? ", nên mảng này cần nhiều kiên nhẫn" : ", dù kết quả thường đến chậm hơn mong đợi") : grade === "strong" ? (hardLink ? ", nhưng bạn có đủ sức để vượt qua" : ", và đây là một mối liên kết bền") : "";
  const inside = ev.filter((e) => e.group === "inside" || e.group === "look");
  const adds = [...new Set(inside.filter((e) => e.w > 0).map((e) => DOES[e.key.split("-")[1] as GrahaId].does))].slice(0, 2);
  const risks = [...new Set(inside.filter((e) => e.w <= 0).map((e) => DOES[e.key.split("-")[1] as GrahaId].risk))].slice(0, 2);
  const ties = [...new Set(hf.occupants.flatMap((id) => F.planets[id].lorded.filter((h) => h !== n)).filter((h) => h !== n))].slice(0, 2);
  const yogas = hf.yogas.filter(effectiveYoga).slice(0, 1).map((y) => yogaMeaning(y.id));
  const baseGood = ev.some((e) => e.group === "base" && e.key !== "karaka" && e.w > 0 && !e.key.startsWith("karaka"));
  const baseBad = ev.some((e) => e.group === "base" && e.w < 0 && !e.key.startsWith("karaka"));
  const two = (xs: string[]) => (xs.length > 1 ? `${xs[0]}, cùng với ${xs[1]}` : xs[0] ?? "");
  const practice = PRACTICE[n - 1][sum >= 0 ? "plus" : "minus"];

  let central: string, usedPractice = false, usedLink = false, usedAdds = false, usedYoga = false;
  switch (path) {
    case "strength": case "life": central = practice; usedPractice = true; break;
    case "care": central = PRACTICE[n - 1].minus; usedPractice = true; break;
    case "contrast": central = `Chuyện ${t} ở bạn có cả thuận lợi lẫn những điều phải tự xoay xở${adds[0] && risks[0] ? `: ${adds[0]}, có điều ${risks[0]}` : ""}.`; usedAdds = true; break;
    case "yoga": central = yogas.length ? `Chuyện ${t} có một điểm sáng riêng: ${yogas[0]}.` : practice; usedYoga = true; break;
    case "occupant": central = adds[0] ? `Trong chuyện ${t}, ${adds[0]}${adds[1] ? `; ${adds[1]}` : ""}${risks[0] ? `, có điều ${risks[0]}` : ""}.` : `Chuyện ${t} là nơi bạn ${risks[0]}, nên cần để ý nhiều hơn các mảng khác.`; usedAdds = true; break;
    case "quiet": central = `Chuyện ${t} không phải tâm điểm trong đời bạn; nó diễn ra khá lặng lẽ, theo nhịp của những mảng khác.`; break;
    default: central = `${cap(lk)}${gradeTail}.`; usedLink = true;
  }
  const paras: string[] = [central];
  const OPEN = [`Bạn tiếp cận mảng này theo cách ${SIGN_STYLE[hf.sign]}`, `Ở đây, cách làm của bạn thường ${SIGN_STYLE[hf.sign]}`, `Ở mảng này, bạn có xu hướng hành xử ${SIGN_STYLE[hf.sign]}`];
  paras.push(`${OPEN[seed % OPEN.length]}.${usedLink ? "" : ` ${plainLink(hf, `Chuyện ${t}`)}${gradeTail}.`}`);
  const p3: string[] = [];
  if (!usedAdds && adds.length) p3.push(`Trong chuyện ${t}, ${adds.join("; ")}${risks.length ? `; có điều, bạn cũng ${risks.join("; ")}` : ""}.`);
  else if (!usedAdds && risks.length) p3.push(`Điều cần để ý ở chuyện ${t} là bạn ${risks.join("; ")}.`);
  if (ties.length) p3.push(`Chuyện ${t} cũng hay gắn với chuyện ${area(ties[0])}: thay đổi ở bên này thường kéo theo bên kia.`);
  if (!usedYoga && yogas.length) p3.push(`Chuyện ${t} còn có một điểm đặc biệt: ${yogas[0]}.`);
  if (p3.length) paras.push(p3.join(" "));
  if (!usedPractice) paras.push(`${baseGood && !baseBad ? `Nhìn chung, chuyện ${t} có nhiều điều kiện thuận. ` : baseBad && !baseGood ? `Nhìn chung, chuyện ${t} ít được nâng đỡ sẵn hơn các mảng khác. ` : ""}${practice}`);
  else if (baseBad && sum > 0) paras.push(`Dù vậy, chuyện ${t} ít được nâng đỡ sẵn hơn các mảng khác, nên những điều tốt ở đây cần được giữ bằng sự đều đặn.`);
  void plus; void minus; void pick;

  const title = path === "quiet" ? "Một mảng vận hành lặng lẽ" : support === "thuận lợi" ? "Nhiều điều kiện thuận" : support === "cần rèn giũa" ? "Cần xây dựng từng bước" : "Có thuận, có khó";
  const why = [
    `Nhà ${n}: cung ${SIGNS[hf.sign]}, nhóm ${[1, 4, 7, 10].includes(n) ? "Kendra" : ""}${[1, 5, 9].includes(n) ? (n === 1 ? ", Trikona" : "Trikona") : ""}${[3, 6, 10, 11].includes(n) ? (n === 10 ? ", Upachaya" : "Upachaya") : ""}${[6, 8, 12].includes(n) ? (n === 6 ? ", Dusthana" : "Dusthana") : ""}${n === 2 ? "Maraka/Dhana" : ""}; karaka: ${joinVi(hf.karakas.map(nameOf))}.`,
    ...ev.map((e) => `${e.w > 0 ? "+" : e.w < 0 ? "−" : "·"}${Math.abs(e.w).toFixed(1)} · ${e.fact}`),
    `Cân bằng: thuận ${P.toFixed(1)}, khó ${M.toFixed(1)}, tổng ${sum.toFixed(1)} → ${support}; mức biểu hiện ${expressive}.`,
    `Cách kể: ${PATH_LABEL4[path]}.`,
  ];
  return { path, title, paragraphs: paras, why, support, expressive };
}
