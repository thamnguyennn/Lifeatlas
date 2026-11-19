// Độ hòa hợp của hai lá số: Ashtakoota (36 điểm từ Mặt Trăng và nakshatra) cộng vài liên hệ giữa hai lá số.
// Varna, Tara, Gana, Bhakoot, Nadi và Graha Maitri tính đủ theo bảng cổ điển. Yoni và Vashya dùng cách chấm gọn
// (cùng nhóm, khắc nhau, còn lại), và được ghi rõ trong phần "Vì sao mình nói điều này?".
import { SIGNS, SIGN_LORD, FRIENDS, ENEMIES, mod, type GrahaId } from "../engine/constants.ts";
import { vargaChart } from "../engine/vargas.ts";
import type { Natal } from "../engine/types.ts";
import { nameOf } from "./util.ts";

export interface Koota { name: string; max: number; got: number; note: string }
export interface Compat {
  total: number;
  band: "rất hợp" | "khá hợp" | "cần chăm" | "nhiều khác biệt";
  summary: string[];
  kootas: Koota[];
  points: { title: string; text: string }[];
  why: string[];
}

const ELEMENT = ["Lửa", "Đất", "Khí", "Nước"];
const el = (s: number) => ELEMENT[s % 4];

const VARNA = [3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4]; // Kshatriya, Vaishya, Shudra, Brahmin ...
// Gana of the 27 nakshatras: 0 Deva, 1 Manushya, 2 Rakshasa.
const GANA = [0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0];
const GANA_SCORE = [[6, 6, 1], [5, 6, 0], [1, 0, 6]];
const NADI = (i: number) => [0, 1, 2, 2, 1, 0][i % 6];
const YONI = ["ngựa", "voi", "cừu", "rắn", "rắn", "chó", "mèo", "cừu", "mèo", "chuột", "chuột", "bò", "trâu", "hổ", "trâu", "hổ", "nai", "nai", "chó", "khỉ", "cầy", "khỉ", "sư tử", "ngựa", "sư tử", "bò", "voi"];
const YONI_ENEMY: [string, string][] = [["bò", "hổ"], ["voi", "sư tử"], ["ngựa", "trâu"], ["chó", "nai"], ["rắn", "cầy"], ["khỉ", "cừu"], ["mèo", "chuột"]];
// Vashya groups: 0 bốn chân, 1 người, 2 sống nước, 3 rừng, 4 bọ cạp
const VASHYA = [0, 0, 1, 2, 3, 1, 1, 2, 4, 1, 1, 2];
const MAITRI = (a: GrahaId, b: GrahaId): number => {
  if (a === b) return 5;
  const rel = (x: GrahaId, y: GrahaId) => (FRIENDS[x]?.includes(y) ? 1 : ENEMIES[x]?.includes(y) ? -1 : 0);
  const s = rel(a, b) + rel(b, a);
  return s === 2 ? 5 : s === 1 ? 4 : s === 0 ? 3 : s === -1 ? 1 : 0;
};
const friendly = (a: GrahaId, b: GrahaId) => a === b || (FRIENDS[a]?.includes(b) && FRIENDS[b]?.includes(a)) || (FRIENDS[a]?.includes(b) && !ENEMIES[b]?.includes(a)) || (FRIENDS[b]?.includes(a) && !ENEMIES[a]?.includes(b));
const relWord = (a: GrahaId, b: GrahaId) => (a === b ? "cùng một hành tinh" : MAITRI(a, b) >= 4 ? "hợp nhau" : MAITRI(a, b) === 3 ? "trung tính với nhau" : "khá khác nhau");

export function readCompat(a: Natal, b: Natal, nameA: string, nameB: string): Compat {
  const ma = a.grahas.moon, mb = b.grahas.moon;
  const k: Koota[] = [];
  const varna = VARNA[ma.sign] >= VARNA[mb.sign] ? 1 : 0;
  k.push({ name: "Varna (nền tinh thần)", max: 1, got: varna, note: varna ? "nền tinh thần của hai người ăn khớp" : "mỗi người có một nền tinh thần và cách nhìn đời khá khác nhau" });
  const va = VASHYA[ma.sign], vb = VASHYA[mb.sign];
  const vashya = va === vb ? 2 : (va === 1 && vb === 0) || (va === 0 && vb === 1) ? 1 : 0.5;
  k.push({ name: "Vashya (sức hút, ai nhường ai)", max: 2, got: vashya, note: vashya >= 2 ? "dễ thấy gần gũi và cân bằng nhau" : vashya >= 1 ? "có sức hút lẫn nhau, thỉnh thoảng lệch vai" : "khó đoán ai nhường ai, cần nói rõ kỳ vọng" });
  const t1 = mod(mb.nak.index - ma.nak.index, 9), t2 = mod(ma.nak.index - mb.nak.index, 9);
  const bad = (t: number) => [2, 4, 6].includes(t);
  const tara = (bad(t1) ? 0 : 1.5) + (bad(t2) ? 0 : 1.5);
  k.push({ name: "Tara (nhịp may rủi)", max: 3, got: tara, note: tara >= 3 ? "nhịp sống của hai người nâng đỡ nhau" : tara > 0 ? "một chiều thuận, một chiều cần để ý" : "nhịp sống dễ lệch nhau; cần kiên nhẫn" });
  const ya = YONI[ma.nak.index], yb = YONI[mb.nak.index];
  const yoni = ya === yb ? 4 : YONI_ENEMY.some(([x, y]) => (x === ya && y === yb) || (x === yb && y === ya)) ? 0 : 2;
  k.push({ name: "Yoni (tính khí, sự thân mật)", max: 4, got: yoni, note: yoni === 4 ? "tính khí rất gần nhau" : yoni === 0 ? "tính khí dễ va vào nhau" : "tính khí khác nhưng không xung khắc" });
  const gm = MAITRI(SIGN_LORD[ma.sign], SIGN_LORD[mb.sign]);
  k.push({ name: "Graha Maitri (tình bạn tinh thần)", max: 5, got: gm, note: gm >= 4 ? "hai người hiểu nhau về mặt tâm trí" : gm >= 3 ? "hiểu nhau ở mức vừa; cần trò chuyện nhiều" : "cách nghĩ khác nhau khá rõ" });
  const gana = GANA_SCORE[GANA[ma.nak.index]][GANA[mb.nak.index]];
  k.push({ name: "Gana (bản tính)", max: 6, got: gana, note: gana >= 5 ? "bản tính hòa hợp" : gana >= 1 ? "bản tính khác nhau, cần tôn trọng nhịp của nhau" : "bản tính ở hai cực, dễ hiểu lầm nếu không nói thẳng" });
  const d = mod(mb.sign - ma.sign, 12) + 1, e = mod(ma.sign - mb.sign, 12) + 1;
  const dosha = [d, e].sort().join("-");
  const bad7 = ["2-12", "5-9", "6-8"].includes(dosha);
  k.push({ name: "Bhakoot (sự gắn bó cảm xúc)", max: 7, got: bad7 ? 0 : 7, note: bad7 ? `vị trí hai Mặt Trăng (cung ${d} và ${e}) khiến cảm xúc dễ lệch nhịp` : "vị trí hai Mặt Trăng ủng hộ sự gắn bó" });
  const nadi = NADI(ma.nak.index) === NADI(mb.nak.index) ? 0 : 8;
  k.push({ name: "Nadi (năng lượng và sức khỏe chung)", max: 8, got: nadi, note: nadi ? "hai thể chất bổ sung cho nhau" : "cùng một kiểu năng lượng; nên chăm sức khỏe chung và tránh cùng dồn một hướng" });
  const total = k.reduce((s, x) => s + x.got, 0);
  const band = total >= 28 ? "rất hợp" : total >= 21 ? "khá hợp" : total >= 14 ? "cần chăm" : "nhiều khác biệt";

  // links between the two charts
  const lordA = SIGN_LORD[a.lagna.sign], lordB = SIGN_LORD[b.lagna.sign];
  const d9a = vargaChart(a, 9), d9b = vargaChart(b, 9);
  const d9m = (x: ReturnType<typeof vargaChart>) => x.planets.moon.sign;
  const venusA = SIGN_LORD[a.grahas.venus.sign], venusB = SIGN_LORD[b.grahas.venus.sign];
  const points = [
    { title: "Cảm xúc của hai người", text: `Mặt Trăng của ${nameA} ở ${SIGNS[ma.sign]} (${el(ma.sign)}), của ${nameB} ở ${SIGNS[mb.sign]} (${el(mb.sign)}). ${el(ma.sign) === el(mb.sign) ? "Cùng nguyên tố nên hai người nhạy với nhau và hiểu nhanh những điều không nói." : (["Lửa", "Khí"].includes(el(ma.sign)) === ["Lửa", "Khí"].includes(el(mb.sign))) ? "Hai nguyên tố khác nhau nhưng cùng nhịp (chủ động hoặc nhạy cảm), nên dễ bổ sung cho nhau." : "Một người xử lý cảm xúc bằng hành động và trò chuyện, người kia bằng im lặng và cảm nhận; đó là chỗ cần dịch cho nhau."}` },
    { title: "Cách hai người nhìn đời", text: `Chủ cung mọc của hai bạn là ${nameOf(lordA)} và ${nameOf(lordB)}: ${relWord(lordA, lordB)}. Chủ cung của Sao Kim là ${nameOf(venusA)} và ${nameOf(venusB)}: ${relWord(venusA, venusB)}. ${friendly(lordA, lordB) && friendly(venusA, venusB) ? "Cả cách sống lẫn cách yêu đều có điểm chung." : friendly(lordA, lordB) || friendly(venusA, venusB) ? "Một trong hai điểm này có sự hợp, điểm còn lại cần thời gian làm quen." : "Cả cách sống lẫn cách yêu đều khác nhau; sự hòa hợp ở đây đến từ cố gắng hơn là sẵn có."}` },
    { title: "Lớp sâu hơn (D9)", text: `Ở D9, Mặt Trăng của ${nameA} ở ${SIGNS[d9m(d9a)]} và của ${nameB} ở ${SIGNS[d9m(d9b)]}: ${el(d9m(d9a)) === el(d9m(d9b)) ? "cùng nguyên tố nên khi trưởng thành hai người càng hiểu nhau." : "khác nguyên tố nên sự hòa hợp cần được nuôi bằng thời gian ở cạnh nhau."}` },
  ];
  const strong = [...k].sort((x, y) => y.got / y.max - x.got / x.max)[0], weak = [...k].sort((x, y) => x.got / x.max - y.got / y.max)[0];
  const summary = [
    `${nameA} và ${nameB} được ${total} trên 36 điểm Ashtakoota, mức “${band}”. Con số này chỉ nói về nền tảng cảm xúc và tính khí, không quyết định một mối quan hệ có bền hay không.`,
    `Điểm tựa lớn nhất của hai người là ${strong.name.split(" (")[0]}: ${strong.note}. Chỗ cần chăm nhất là ${weak.name.split(" (")[0]}: ${weak.note}.`,
  ];
  return { total, band, summary, kootas: k, points, why: [
    `Mặt Trăng ${nameA}: ${SIGNS[ma.sign]}, nakshatra ${ma.nak.name} (${ma.nak.index + 1}). Mặt Trăng ${nameB}: ${SIGNS[mb.sign]}, nakshatra ${mb.nak.name} (${mb.nak.index + 1}).`,
    ...k.map((x) => `${x.name}: ${x.got}/${x.max}.`),
    "Yoni và Vashya được chấm gọn (cùng nhóm, khắc nhau, còn lại); sáu koota còn lại theo bảng cổ điển.",
    "Thứ tự hai người ảnh hưởng nhẹ đến Varna và Gana, theo đúng truyền thống.",
  ] };
}
