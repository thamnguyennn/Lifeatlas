// Life Atlas v3.0 — Deep chapters: Rahu-Ketu axis, Jaimini Soul (Atmakaraka/Karakamsa/Chara Karakas),
// and Divisional Charts (D2 Hora, D9 Navamsha, D10 Dashamsha) with explicit D1-to-Varga synthesis
// grounded in Brihat Parashara Hora Shastra and classical Parashara varga principles.
import { DUSTHANA, KENDRA, TRIKONA, SIGNS, SEVEN, GRAHAS, SIGN_LORD, fmtDeg, NAKSHATRA_VI, mod, type GrahaId } from "../engine/constants.ts";
import type { Dignity, Graha, Natal } from "../engine/types.ts";
import { vargaChart, horaSplit, charaKarakas, karakamsa } from "../engine/vargas.ts";
import { DIGNITY_VI } from "./shared.ts";
import type { AxisReading, KarakaCard, SoulReading, VargaHouseRead, VargaReading } from "./types.ts";
import { SIGN_FACULTY, HOUSE_TAG } from "./content/houses-signs.ts";
import { NAK } from "./content/nakshatra.ts";
import { AXIS, AXIS_INTRO, RAHU_SIGN, KETU_SIGN, WITH_RAHU, WITH_KETU } from "./content/axis.ts";
import { AK_PLANET, AK_HOUSE, KARAKAMSA_SIGN, SOUL_INTRO, KARAKA_ROLE } from "./content/soul.ts";
import { KARAKA_FRAME, KARAKA_WHERE } from "./content/today.ts";
import { PLANETS } from "./content/planets.ts";
import {
  VARGA_META, VARGA_NOTE, D2_BALANCE, D2_LAGNA, D2_FIT, D2_UNFIT, D2_HOUSES, D2_NOTE,
  D9_LAGNA, D9_SEVENTH, D9_SHIFT, D10_LAGNA, D10_LORD, D10_LORD_IN, D9_HOUSES_INTRO, D10_HOUSES_INTRO,
} from "./content/vargas.ts";
import { D9_HOUSE, D10_HOUSE, D9_STRONG, D9_LAGNA_SAME, VARGA_HOUSE_LORD, VARGA_HOUSE_OCC, type VargaHouse } from "./content/varga-houses.ts";
import { nameOf, domain, joinVi, fill } from "./util.ts";

const nakName = (g: { nak: { name: string } }) => NAKSHATRA_VI[g.nak.name] ?? g.nak.name;

// ---------------------------------------------------------------- Rahu-Ketu

function companions(n: Natal, node: Graha, table: Record<string, string>): string[] {
  return SEVEN.filter((p) => n.grahas[p].sign === node.sign).map((p) => table[p]).filter(Boolean);
}

function dispositorLine(n: Natal, node: Graha, who: "Rahu" | "Ketu"): string {
  const d = SIGN_LORD[node.sign];
  const dg = n.grahas[d];
  const what = who === "Rahu" ? "điều bạn khao khát" : "sở trường này";
  const lead = `Cung ${SIGNS[node.sign]} do ${nameOf(d)} cai quản`;
  if (dg.house === node.house) {
    return `${lead}, và ${nameOf(d)} của bạn cũng đứng ở nhà ${dg.house}, cùng chỗ với ${who}. Vì vậy ${what} dồn hết vào chuyện ${domain(node.house)}.`;
  }
  return `${lead}, và ${nameOf(d)} của bạn đang ở nhà ${dg.house}. Vì vậy ${what} lộ ra rõ nhất ở chuyện ${domain(dg.house)}.`;
}

export function readAxis(n: Natal, noTime: boolean): AxisReading {
  const R = n.grahas.rahu, K = n.grahas.ketu;
  const A = AXIS[R.house - 1];
  const dR = SIGN_LORD[R.sign], dK = SIGN_LORD[K.sign];

  const ketu: string[] = [];
  if (!noTime) ketu.push(A.ketu);
  ketu.push(`Ketu đứng ở cung ${SIGNS[K.sign]}, nên cái bạn đã thạo ${KETU_SIGN[K.sign]}`);
  ketu.push(NAK[K.nak.index].memory);
  if (!noTime) ketu.push(dispositorLine(n, K, "Ketu"));
  ketu.push(...companions(n, K, WITH_KETU));

  const rahu: string[] = [];
  if (!noTime) rahu.push(A.rahu);
  rahu.push(`Rahu đứng ở cung ${SIGNS[R.sign]}, nên điều bạn khao khát ${RAHU_SIGN[R.sign]}`);
  rahu.push(NAK[R.nak.index].quest);
  if (!noTime) rahu.push(dispositorLine(n, R, "Rahu"));
  rahu.push(...companions(n, R, WITH_RAHU));

  const where = (g: Graha) => `${SIGNS[g.sign]} ${fmtDeg(g.deg)}${noTime ? "" : `, nhà ${g.house}`}, chòm sao ${nakName(g)} pada ${g.nak.pada}`;
  return {
    intro: AXIS_INTRO,
    headline: noTime ? `Rahu ở ${SIGNS[R.sign]} · Ketu ở ${SIGNS[K.sign]}` : `Rahu ở nhà ${R.house} · Ketu ở nhà ${K.house}`,
    lesson: noTime ? null : A.lesson,
    pull: noTime ? null : A.pull,
    ketu: { title: "Điều bạn đã thạo (Ketu)", paragraphs: ketu },
    rahu: { title: "Điều bạn đến để mở rộng (Rahu)", paragraphs: rahu },
    bridge: noTime ? null : A.bridge,
    ask: noTime ? null : A.ask,
    facts: [
      { label: "Rahu", value: where(R) },
      { label: "Ketu", value: where(K) },
      { label: "Hành tinh cai quản cung của Rahu", value: `${nameOf(dR)}${noTime ? "" : `, ở nhà ${n.grahas[dR].house}`}` },
      { label: "Hành tinh cai quản cung của Ketu", value: `${nameOf(dK)}${noTime ? "" : `, ở nhà ${n.grahas[dK].house}`}` },
    ],
  };
}

// ---------------------------------------------------------------- soul (Jaimini)

export function soulKnown(n: Natal, noTime: boolean): boolean {
  if (!noTime) return true;
  const m = n.grahas.moon.deg;
  const top = Math.max(...SEVEN.filter((p) => p !== "moon").map((p) => n.grahas[p].deg));
  if (m + 7 >= top) return false;
  if (m < 7 && 30 + m - 7 >= top) return false;
  return true;
}

function akCondition(n: Natal, ak: GrahaId): string[] {
  const g = n.grahas[ak];
  const out: string[] = [];
  if (g.dignity === "exalted" || g.dignity === "own" || g.dignity === "moolatrikona") out.push("Hành tinh này đang đứng vững trong lá số của bạn, nên bài học có nền tốt để tiếp nhận: bạn thường cảm thấy mình đi đúng đường khi lắng nghe nó.");
  else if (g.dignity === "debilitated") out.push("Hành tinh này đang ở vị trí yếu, nên bài học đòi nhiều kiên nhẫn hơn và thường thấm dần theo năm tháng. Chính chỗ cần công sức này lại là nơi bạn rèn được nhiều bản lĩnh nhất.");
  if (g.vargottama) out.push("Nó còn nằm cùng một cung ở cả lá số chính và lá số phụ D9, nên bài học này rất rõ nét và khớp nhau ở cả hai lá số.");
  if (g.combust && ak !== "sun") out.push("Nó đứng sát Mặt Trời, nên bạn hay nhận ra bài học này muộn hơn người khác, thường sau khi đã thử qua nhiều cách khác.");
  if (g.retro && ak !== "sun" && ak !== "moon") out.push("Lúc bạn sinh, nó đang ở giai đoạn đi lùi trên bầu trời (gọi là nghịch hành), nên bài học hay quay lại nhiều lần và mỗi lần đều gợi mở sâu hơn.");
  return out.slice(0, 2);
}

export function readSoul(n: Natal, noTime: boolean): SoulReading | null {
  if (!soulKnown(n, noTime)) return null;
  const karakas = charaKarakas(n);
  const ak = karakas[0].planet;
  const g = n.grahas[ak];
  const A = AK_PLANET[ak]!;
  const kk = karakamsa(n);

  const akParas = [A.lesson];
  if (!noTime) akParas.push(AK_HOUSE[g.house - 1]);
  akParas.push(...akCondition(n, ak));

  const kkParas = [KARAKAMSA_SIGN[kk.sign]];
  if (!noTime) {
    kkParas.push(`Trong lá số chính của bạn, cung ${SIGNS[kk.sign]} nằm ở nhà ${kk.house}, nên điều bạn muốn thể hiện đi qua chuyện ${domain(kk.house)}.`);
    const others = kk.occupants;
    if (others.length) kkParas.push(`Trong cung ${SIGNS[kk.sign]} của lá số chính có ${joinVi(others.map(nameOf))}. ${others.length > 1 ? "Những hành tinh này" : "Hành tinh này"} tô màu cho cách bạn thể hiện điều đó.`);
  }

  return {
    intro: SOUL_INTRO,
    ak: { planet: nameOf(ak), title: A.title, paragraphs: akParas, ask: A.ask },
    karakamsa: { title: `Nơi bạn muốn thể hiện điều sâu nhất (Karakamsa ở ${SIGNS[kk.sign]})`, paragraphs: kkParas },
    karakas: karakas.map((k): KarakaCard => {
      const g = n.grahas[k.planet];
      const fr = KARAKA_FRAME[k.role];
      const where = noTime ? "" : fill(KARAKA_WHERE, { h: g.house, tag: HOUSE_TAG[g.house - 1] });
      return {
        role: k.role, sa: KARAKA_ROLE[k.role].sa, meaning: KARAKA_ROLE[k.role].vi,
        planetId: k.planet, planet: nameOf(k.planet), deg: `${SIGNS[g.sign]} ${fmtDeg(g.deg)}`, house: noTime ? null : g.house,
        paragraphs: [fr.intro, fill(fr.line, { p: nameOf(k.planet), gift: PLANETS[k.planet].gift, shadow: PLANETS[k.planet].shadow, where })],
      };
    }),
  };
}

// ---------------------------------------------------------------- divisional charts (Section VI.1)

const RANK: Record<Dignity, number> = { debilitated: 0, enemy: 1, neutral: 2, none: 2, friend: 3, own: 4, moolatrikona: 4, exalted: 5 };
const isStrong = (d: Dignity) => d === "own" || d === "exalted" || d === "moolatrikona";
const isKendraOrTrikona = (h: number) => KENDRA.includes(h) || TRIKONA.includes(h);

function placements(n: Natal, v: 9 | 10): VargaReading["chart"] {
  const vc = vargaChart(n, v);
  const planets = {} as Record<GrahaId, number>;
  for (const id of GRAHAS) planets[id] = vc.planets[id].sign;
  return { lagnaSign: vc.lagnaSign, planets };
}

function readD2(n: Natal): VargaReading {
  const hs = horaSplit(n);
  const meta = VARGA_META[2];
  const paragraphs: string[] = [];
  paragraphs.push(hs.sun.length >= 5 ? D2_BALANCE.sun : hs.moon.length >= 5 ? D2_BALANCE.moon : D2_BALANCE.even);
  paragraphs.push(D2_LAGNA[hs.lagna]);
  const sunGroup = new Set<GrahaId>(hs.sun);
  const horaOf = (p: GrahaId) => (sunGroup.has(p) ? "sun" : "moon");
  const verdict = (p: GrahaId): "fit" | "unfit" | "mid" => {
    if (D2_FIT[`${p}-${horaOf(p)}`]) return "fit";
    if (D2_UNFIT[`${p}-${horaOf(p)}`]) return p === "mars" || p === "venus" ? "mid" : "unfit";
    return "mid";
  };
  for (const p of SEVEN) {
    const line = D2_FIT[`${p}-${horaOf(p)}`] ?? D2_UNFIT[`${p}-${horaOf(p)}`];
    if (line) paragraphs.push(line);
  }
  paragraphs.push(D2_HOUSES.intro);
  for (const h of [2, 11] as const) {
    const lord = n.houses[h - 1].lord;
    if (!SEVEN.includes(lord)) continue;
    const state = D2_HOUSES[verdict(lord)];
    paragraphs.push(fill(D2_HOUSES.lord, { h, what: h === 2 ? D2_HOUSES.what2 : D2_HOUSES.what11, lord: nameOf(lord), state }));
  }
  paragraphs.push(D2_NOTE);
  const why = [
    `Cung mọc D2 thuộc nhóm ${hs.lagna === "sun" ? "Mặt Trời (Hora Surya)" : "Mặt Trăng (Hora Chandra)"}.`,
    `Nhóm Mặt Trời (${hs.sun.length} hành tinh): ${hs.sun.length ? joinVi(hs.sun.map(nameOf)) : "không có"}.`,
    `Nhóm Mặt Trăng (${hs.moon.length} hành tinh): ${hs.moon.length ? joinVi(hs.moon.map(nameOf)) : "không có"}.`,
  ];
  return { n: 2, code: meta.code, name: meta.name, short: meta.short, lead: meta.lead, how: meta.how, paragraphs, why, hora: hs };
}

function readVargaHouses(n: Natal, v: 9 | 10, table: VargaHouse[]): VargaHouseRead[] {
  const vc = vargaChart(n, v);
  const code = `D${v}`;
  return table.map((row, i) => {
    const sign = mod(vc.lagnaSign + i, 12);
    const lord = SIGN_LORD[sign];
    const lp = vc.planets[lord];
    const notes: string[] = [];
    notes.push(fill(VARGA_HOUSE_LORD.line, { lord: nameOf(lord), k: lp.house, code, domain: domain(lp.house) }));
    if (isStrong(lp.dignity)) notes.push(fill(VARGA_HOUSE_LORD.strong, { lord: nameOf(lord) }));
    else if (lp.dignity === "debilitated") notes.push(fill(VARGA_HOUSE_LORD.weak, { lord: nameOf(lord) }));
    const occ = vc.occupants[i];
    if (!occ.length) notes.push(VARGA_HOUSE_OCC.empty);
    for (const p of occ) {
      const d = vc.planets[p].dignity;
      notes.push(fill(VARGA_HOUSE_OCC.one, {
        p: nameOf(p), state: isStrong(d) ? VARGA_HOUSE_OCC.strongState : d === "debilitated" ? VARGA_HOUSE_OCC.weakState : "",
        gift: PLANETS[p].gift, shadow: PLANETS[p].shadow,
      }));
    }
    return { house: i + 1, sign: SIGNS[sign], topic: row.topic, text: row.text, notes };
  });
}

function readD9(n: Natal): VargaReading {
  const vc = vargaChart(n, 9);
  const meta = VARGA_META[9];
  const paragraphs: string[] = [];
  const why: string[] = [];

  // 1. D1 Lagna & D9 Lagna bridge + D1 Lord Filtering Mechanism into D9 Kendra/Trikona vs. Dusthana
  const d1LagnaLord = SIGN_LORD[n.lagna.sign];
  const d1LLinD9 = vc.planets[d1LagnaLord];
  const llFilterNote = isKendraOrTrikona(d1LLinD9.house)
    ? `Vì nhà ${d1LLinD9.house} là cung trục/tam hợp của D9, lời hứa ở lá số gốc có điểm tựa nội tâm thuận lợi để kết trái khi bạn bước qua tuổi trưởng thành.`
    : DUSTHANA.includes(d1LLinD9.house)
      ? `Vì nhà ${d1LLinD9.house} là vùng thử thách của D9, những tiềm năng ở lá số gốc đòi hỏi sự chuyển hóa nội tâm và tính nhẫn nại trước khi thật sự đơm hoa kết trái.`
      : `Vị trí này cho thấy càng trải đời, trọng tâm tự hoàn thiện của bạn càng hướng về chuyện ${domain(d1LLinD9.house)}.`;
  paragraphs.push(
    `Nếu lá số gốc D1 với cung mọc ${SIGNS[n.lagna.sign]} là hạt giống và điểm xuất phát thuở đầu đời, thì biểu đồ D9 (Navamsha) với cung mọc ${SIGNS[vc.lagnaSign]} cho thấy độ chín của hạt giống ấy khi bạn đi qua tuổi trưởng thành. ${D9_LAGNA[vc.lagnaSign]} Đặc biệt, hành tinh đại diện cho bản thân bạn ở D1 là ${nameOf(d1LagnaLord)} khi bước sang D9 đứng tại cung ${SIGNS[d1LLinD9.sign]} (nhà ${d1LLinD9.house} của D9, vị thế: ${DIGNITY_VI[d1LLinD9.dignity].toLowerCase()}). ${llFilterNote}`,
  );
  why.push(`Đối chiếu gốc - quả: Cung mọc D1 là ${SIGNS[n.lagna.sign]}, cung mọc D9 là ${SIGNS[vc.lagnaSign]}.`);
  why.push(`Cơ chế lọc hành tinh cai quản cung mọc D1 sang D9: ${nameOf(d1LagnaLord)} sang D9 đặt tại ${SIGNS[d1LLinD9.sign]} (nhà ${d1LLinD9.house} D9, vị thế: ${DIGNITY_VI[d1LLinD9.dignity]}).`);

  // 2. D1 7th house + D9 7th house (Kalatramsa) + Venus/Jupiter synthesis for partnership & marriage
  const d1SeventhLord = n.houses[6].lord;
  const d1S7inD9 = vc.planets[d1SeventhLord];
  const s7 = mod(vc.lagnaSign + 6, 12);
  const d9SeventhLord = SIGN_LORD[s7];
  const d9S7Pos = vc.planets[d9SeventhLord];
  const occ7 = vc.occupants[6];
  const s7FilterNote = isKendraOrTrikona(d1S7inD9.house)
    ? `Việc ${nameOf(d1SeventhLord)} bước vào nhà ${d1S7inD9.house} (trục/tam hợp của D9) giúp đời sống cam kết càng về sau càng có sự đồng điệu và nâng đỡ từ chiều sâu tâm hồn.`
    : DUSTHANA.includes(d1S7inD9.house)
      ? `Việc ${nameOf(d1SeventhLord)} đi vào nhà ${d1S7inD9.house} của D9 cho thấy hai người cần thời gian cùng tháo gỡ những va vấp ban đầu để chạm tới sự thấu hiểu sâu sắc.`
      : `Sự kết hợp này nối liền hình mẫu bạn đời ở D1 với trải nghiệm gắn kết thực tế ở D9.`;
  paragraphs.push(
    `Trong chuyện gắn kết đôi lứa và hôn nhân, truyền thống Parashara đọc song song nhà 7 của D1 cùng nhà 7 của D9 (Kalatramsa). Ở lá số gốc, nhà 7 của bạn do ${nameOf(d1SeventhLord)} giữ chìa khóa; khi sang D9, ${nameOf(d1SeventhLord)} đi về nhà ${d1S7inD9.house} (${SIGNS[d1S7inD9.sign]}), kết hợp cùng cung nhà 7 của D9 là ${SIGNS[s7]} do ${nameOf(d9SeventhLord)} (đứng ở nhà ${d9S7Pos.house} D9) dẫn dắt. ${s7FilterNote} ${D9_SEVENTH[s7]}${occ7.length ? ` Sự góp mặt của ${joinVi(occ7.map(nameOf))} ngay trong nhà 7 của D9 càng làm đậm thêm sắc thái của ${occ7.length > 1 ? "những hành tinh này" : "hành tinh này"} trong đời sống bạn đời.` : ""}`,
  );
  why.push(`Trục quan hệ D1 -> D9: Hành tinh giữ nhà 7 D1 (${nameOf(d1SeventhLord)}) sang D9 ở nhà ${d1S7inD9.house} (${SIGNS[d1S7inD9.sign]}); nhà 7 D9 là ${SIGNS[s7]} (do ${nameOf(d9SeventhLord)} ở nhà ${d9S7Pos.house} D9 quản lý).`);

  // 3. Vargottama & dignity shifts between D1 and D9
  const varg = SEVEN.filter((p) => n.grahas[p].vargottama);
  if (varg.length) {
    paragraphs.push(fill(D9_SHIFT.vargottama, { list: joinVi(varg.map(nameOf)) }));
    why.push(`Vargottama (đồng cung D1 & D9): ${joinVi(varg.map(nameOf))}.`);
  }
  const up: GrahaId[] = [], down: GrahaId[] = [];
  for (const p of SEVEN) {
    const diff = RANK[vc.planets[p].dignity] - RANK[vc.planets[p].d1Dignity];
    if (diff >= 2) up.push(p);
    else if (diff <= -2) down.push(p);
  }
  if (up.length || down.length) {
    const shiftParts: string[] = [];
    if (up.length) {
      shiftParts.push(fill(D9_SHIFT.up, { list: joinVi(up.map(nameOf)), it: up.length === 1 ? "nó" : "chúng" }));
      why.push(`Mạnh lên ở D9 so với D1: ${joinVi(up.map((p) => `${nameOf(p)} (${DIGNITY_VI[vc.planets[p].d1Dignity]} -> ${DIGNITY_VI[vc.planets[p].dignity]})`))}.`);
    }
    if (down.length) {
      shiftParts.push(fill(D9_SHIFT.down, { list: joinVi(down.map(nameOf)), it: down.length === 1 ? "nó" : "chúng" }));
      why.push(`Giảm vị thế ở D9 so với D1: ${joinVi(down.map((p) => `${nameOf(p)} (${DIGNITY_VI[vc.planets[p].d1Dignity]} -> ${DIGNITY_VI[vc.planets[p].dignity]})`))}.`);
    }
    paragraphs.push(shiftParts.join(" "));
  } else {
    paragraphs.push(D9_SHIFT.none);
    why.push(`Tương quan vị thế D1 - D9: Các hành tinh giữ nhịp ổn định giữa hai biểu đồ.`);
  }

  if (vc.lagnaSign === n.lagna.sign) paragraphs.push(D9_LAGNA_SAME);
  const strongKey = (["sun", "moon", "venus", "jupiter"] as GrahaId[]).filter((p) => isStrong(vc.planets[p].dignity));
  if (strongKey.length) {
    paragraphs.push(strongKey.map((p) => D9_STRONG[p]!).join(" "));
  }

  return {
    n: 9, code: meta.code, name: meta.name, short: meta.short, lead: meta.lead, how: meta.how, paragraphs, why, chart: placements(n, 9),
    housesTitle: "Mười hai nhà của D9: đời sống nội tâm và gắn kết sau tuổi trưởng thành", housesIntro: D9_HOUSES_INTRO,
    houses: readVargaHouses(n, 9, D9_HOUSE),
  };
}

function readD10(n: Natal): VargaReading {
  const vc = vargaChart(n, 10);
  const meta = VARGA_META[10];
  const paragraphs: string[] = [];
  const why: string[] = [];

  const d1TenthLord = n.houses[9].lord;
  const d1L10inD10 = vc.planets[d1TenthLord];
  const s10 = mod(vc.lagnaSign + 9, 12);
  const lord = SIGN_LORD[s10];
  const lp = vc.planets[lord];
  const occ10 = vc.occupants[9];

  // 1. D1 10th house vs. D10 Lagna & D10 10th house synthesis (Mahat Phala / Karmamsha)
  const l10PlaceNote = isKendraOrTrikona(d1L10inD10.house)
    ? `Vì nhà ${d1L10inD10.house} thuộc trục/tam hợp của D10, định hướng nghề nghiệp ở lá số gốc dễ tìm được môi trường thực thi thuận lợi và có đà thăng tiến rõ ràng.`
    : [3, 6, 8, 12].includes(d1L10inD10.house)
      ? `Vì nhà ${d1L10inD10.house} trong D10 gắn với những khúc quanh hoặc áp lực cạnh tranh nghề nghiệp, con đường làm việc của bạn thường trưởng thành qua những lần tự xoay xở và đổi mới phương thức.`
      : `Vị trí này nối liền định hướng ban đầu ở D1 với cách bạn tạo dựng thành quả mỗi ngày trong D10.`;
  paragraphs.push(
    `Trong hệ Parashara, biểu đồ D10 (Dashamsha hay Karmamsha) cho thấy "Mahat Phala" — quả lớn từ hành động và chỗ đứng nghề nghiệp của bạn giữa xã hội. Nếu nhà 10 của D1 (cung ${SIGNS[n.houses[9].sign]}, do ${nameOf(d1TenthLord)} dẫn dắt) phác họa khung cảnh sự nghiệp tổng quát, thì cung mọc D10 tại ${SIGNS[vc.lagnaSign]} cho thấy phong thái làm việc trực tiếp của bạn khi bước vào chuyên môn. ${D10_LAGNA[vc.lagnaSign]} Đáng chú ý, ${nameOf(d1TenthLord)} — hành tinh giữ chìa khóa sự nghiệp ở D1 — khi sang D10 đứng tại nhà ${d1L10inD10.house} (${SIGNS[d1L10inD10.sign]}, vị thế: ${DIGNITY_VI[d1L10inD10.dignity].toLowerCase()}). ${l10PlaceNote}`,
  );
  why.push(`Cung mọc D10 là ${SIGNS[vc.lagnaSign]}; nhà 10 D1 (${SIGNS[n.houses[9].sign]}) do ${nameOf(d1TenthLord)} quản lý, sang D10 đặt tại nhà ${d1L10inD10.house} (${SIGNS[d1L10inD10.sign]}, ${DIGNITY_VI[d1L10inD10.dignity]}).`);

  // 2. D10 10th house, D10 10th lord & Artha Trikona (2, 6, 10) / 7th house (10th from 10th)
  const lordStrengthSentence = isStrong(lp.dignity)
    ? fill(D10_LORD.strong, { planet: nameOf(lord), sign: SIGNS[lp.sign] })
    : lp.dignity === "debilitated"
      ? fill(D10_LORD.weak, { planet: nameOf(lord), sign: SIGNS[lp.sign] })
      : `Vị thế ${DIGNITY_VI[lp.dignity].toLowerCase()} của ${nameOf(lord)} tại ${SIGNS[lp.sign]} giúp bạn xây dựng uy tín nghề nghiệp từng nấc qua năng lực thực chất.`;
  paragraphs.push(
    `Ngay tại đỉnh sự nghiệp (nhà 10) của D10 là cung ${SIGNS[s10]}. ${SIGN_FACULTY[s10].work} ${fill(D10_LORD.line, { planet: nameOf(lord), k: lp.house })} ${D10_LORD_IN[lp.house - 1]} ${lordStrengthSentence}`,
  );
  why.push(`Đỉnh sự nghiệp D10 (nhà 10 D10) là cung ${SIGNS[s10]}; hành tinh cai quản là ${nameOf(lord)} đứng ở nhà ${lp.house} D10 (${SIGNS[lp.sign]}, ${DIGNITY_VI[lp.dignity]}).`);

  // 3. Occupants of D10 10th house, Career Karakas (Sun, Saturn, Mercury) & strong planets in D10
  const strong = SEVEN.filter((p) => isStrong(vc.planets[p].dignity));
  const upachayaSunSat = (["sun", "saturn"] as GrahaId[]).filter((p) => [3, 6, 10, 11].includes(vc.planets[p].house));
  const extraParts: string[] = [];
  if (occ10.length) {
    extraParts.push(
      `Trong nhà sự nghiệp của lá số D10 có sự góp mặt trực tiếp của ${joinVi(occ10.map(nameOf))}, nên ${occ10.length > 1 ? "những hành tinh này" : "hành tinh này"} in dấu ấn rất rõ lên chuyên môn và danh tiếng nghề nghiệp của bạn.`,
    );
    why.push(`Hành tinh đóng tại nhà 10 của D10: ${joinVi(occ10.map(nameOf))}.`);
  }
  if (upachayaSunSat.length) {
    extraParts.push(
      `Các hành tinh chỉ báo tác phong nghề nghiệp là ${joinVi(upachayaSunSat.map(nameOf))} đứng tại nhà tăng trưởng (Upachaya: ${upachayaSunSat.map((p) => `nhà ${vc.planets[p].house}`).join(", ")}) trong D10, mang lại sức bền tổ chức và khả năng chịu nhiệt tốt khi công việc mở rộng quy mô.`,
    );
    why.push(`Hành tinh chỉ báo sự nghiệp ở nhà tăng trưởng D10 (3/6/10/11): ${upachayaSunSat.map((p) => `${nameOf(p)} (nhà ${vc.planets[p].house})`).join(", ")}.`);
  }
  if (strong.length) {
    extraParts.push(
      `Xét toàn biểu đồ D10, ${joinVi(strong.map(nameOf))} đứng ở vị thế vững vàng, đóng vai trò những trụ đỡ nghề nghiệp đặc biệt đắc lực mỗi khi bạn bước vào đại vận hoặc tiểu vận của ${strong.length > 1 ? "chúng" : "hành tinh này"}.`,
    );
    why.push(`Hành tinh đắc vị/vững trong D10: ${joinVi(strong.map(nameOf))}.`);
  }
  if (extraParts.length) {
    paragraphs.push(extraParts.join(" "));
  }

  return {
    n: 10, code: meta.code, name: meta.name, short: meta.short, lead: meta.lead, how: meta.how, paragraphs, why, chart: placements(n, 10),
    housesTitle: "Mười hai nhà của D10: các chiều kích chuyên môn và sự nghiệp", housesIntro: D10_HOUSES_INTRO,
    houses: readVargaHouses(n, 10, D10_HOUSE),
  };
}

export function readVargas(n: Natal): VargaReading[] {
  return [readD2(n), readD9(n), readD10(n)].map((v) => ({ ...v, note: VARGA_NOTE[v.n] }));
}
