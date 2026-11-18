// Yogas: tuned phrases the old books name, shown in the house they touch and in one list at the end of the houses.
import { SIGNS, type GrahaId } from "../engine/constants.ts";
import type { Natal, Yoga } from "../engine/types.ts";
import { YOGA_TEXT } from "./content/yogas.ts";
import { YOGA_COUNT_LINE, YOGA_NONE_LINE } from "./content/overview.ts";
import { importance, ownedHouses, type Tone } from "./shared.ts";
import type { YogaReading } from "./types.ts";
import { nameOf, fill } from "./util.ts";

/** Yogas that need only the signs of the planets, so they stay valid when the birth time is unknown. */
export const LAGNA_FREE = (y: Yoga) =>
  ["budhaditya", "chandra_mangala", "durudhara", "sunapha", "anapha", "guru_chandala", "gajakesari"].includes(y.id) || y.id.startsWith("grahan");

export function yogaDetail(n: Natal, y: Yoga, noTime = false): string {
  const G = n.grahas;
  if (noTime) {
    if (y.id === "gajakesari") return `Sao Mộc ở cung ${SIGNS[G.jupiter.sign]}, Mặt Trăng ở cung ${SIGNS[G.moon.sign]}: hai hành tinh cách nhau một góc vuông (khoảng cách 1, 4, 7 hoặc 10 cung).`;
    if (y.id === "budhaditya") return `Mặt Trời và Sao Thủy cùng ở cung ${SIGNS[G.sun.sign]}.`;
    if (y.id === "chandra_mangala") return `Mặt Trăng và Sao Hỏa cùng ở cung ${SIGNS[G.moon.sign]}.`;
    if (y.id === "guru_chandala") return `Sao Mộc và Rahu cùng ở cung ${SIGNS[G.jupiter.sign]}.`;
  }
  const owned = (g: GrahaId) => ownedHouses(n, g);
  const list = (g: GrahaId) => owned(g).join(" và ");
  if (y.id.startsWith("parivartana")) {
    const [a, b] = y.grahas;
    return `Trong lá số của bạn, ${nameOf(a)} (cai quản nhà ${list(a)}) đang ở cung của ${nameOf(b)}. Ngược lại, ${nameOf(b)} (cai quản nhà ${list(b)}) đang ở cung của ${nameOf(a)}. Vì vậy chuyện của nhà ${list(a)} gắn chặt với chuyện của nhà ${list(b)}.`;
  }
  if (y.id.startsWith("raja") || y.id.startsWith("dhana")) {
    const [a, b] = y.grahas;
    const how = y.kind === "conj" ? "đứng cùng một cung" : y.kind === "exchange" ? "đổi chỗ cho nhau" : "nhìn nhau";
    return `Ở lá số này, ${nameOf(a)} (cai quản nhà ${list(a)}) và ${nameOf(b)} (cai quản nhà ${list(b)}) ${how}.`;
  }
  if (y.id.startsWith("viparita")) {
    const g = y.grahas[0];
    return `${nameOf(g)} cai quản nhà ${y.kind} và đang đứng ở nhà ${G[g].house}.`;
  }
  if (y.id.startsWith("grahan")) {
    const node = y.grahas.find((g) => g === "rahu" || g === "ketu")!;
    return `Ở đây là ${nameOf(y.grahas[0])} cùng cung với ${nameOf(node)}, trong cung ${SIGNS[G[node].sign]}.`;
  }
  if (y.id.startsWith("neecha")) {
    const g = y.grahas[0];
    return `${nameOf(g)} đang ở cung hãm ${SIGNS[G[g].sign]} nhưng hành tinh cai quản cung đó, hoặc hành tinh đang mạnh ở cung đó, đứng ở một trụ cột của lá số (nhà 1, 4, 7 hoặc 10).`;
  }
  if (y.id.startsWith("yogakaraka")) {
    const g = y.grahas[0];
    return `${nameOf(g)} cai quản nhà ${list(g)} và đang đứng ở nhà ${G[g].house}.`;
  }
  if (y.id === "gajakesari") return `Sao Mộc ở nhà ${G.jupiter.house}, Mặt Trăng ở nhà ${G.moon.house}: hai hành tinh cách nhau một góc vuông (khoảng cách 1, 4, 7 hoặc 10 cung).`;
  if (y.id === "budhaditya") return `Mặt Trời và Sao Thủy cùng ở cung ${SIGNS[G.sun.sign]} (nhà ${G.sun.house}).`;
  if (y.id === "chandra_mangala") return `Mặt Trăng và Sao Hỏa cùng ở cung ${SIGNS[G.moon.sign]} (nhà ${G.moon.house}).`;
  if (y.id.startsWith("mahapurusha")) {
    const g = y.grahas[0];
    return `${nameOf(g)} đang ${G[g].dignity === "exalted" ? "đắc vị" : "ở cung của mình"} tại ${SIGNS[G[g].sign]}, nhà ${G[g].house}.`;
  }
  return "";
}

export function yogaKey(y: Yoga): string {
  if (y.id.startsWith("mahapurusha")) return y.id;
  if (y.id === "gajakesari") return y.strength === "weak" ? "gajakesari_weak" : "gajakesari_strong";
  if (y.id === "budhaditya") return y.strength === "weak" ? "budhaditya_weak" : "budhaditya_normal";
  if (y.id === "amala") return `amala_${y.kind}`;
  if (y.id === "kemadruma") return `kemadruma_${y.kind}`;
  if (y.id.startsWith("parivartana")) return `parivartana_${y.kind}`;
  if (y.id.startsWith("raja")) return `raja_${y.kind}`;
  if (y.id.startsWith("yogakaraka")) return "yogakaraka";
  if (y.id.startsWith("dhana")) return "dhana";
  if (y.id.startsWith("viparita")) return `viparita_${y.kind}`;
  if (y.id.startsWith("neecha")) return "neecha_bhanga";
  if (y.id.startsWith("grahan")) return `grahan_${y.kind}`;
  return y.id;
}

/** The text of a yoga splits into a plain-language reading and a short "how to recognise it" note. */
function splitText(t: string): { text: string; recognise: string } {
  const i = t.indexOf(" (Cách nhận ra:");
  if (i < 0) return { text: t, recognise: "" };
  return { text: t.slice(0, i), recognise: t.slice(i + 2, t.length - 1) };
}

export function readYogaList(n: Natal, noTime = false): YogaReading[] {
  // Without a birth time the houses are a guess, so only the yogas that need nothing but signs are kept,
  // and a yoga whose strength depended on a house is read at its ordinary strength.
  const kept = noTime ? n.yogas.filter(LAGNA_FREE) : n.yogas;
  const sorted = [...kept].sort((a, b) => importance(b) - importance(a));
  return sorted.map((y0) => {
    const y: Yoga = noTime && y0.id === "gajakesari"
      ? { ...y0, strength: n.grahas.jupiter.dignity === "debilitated" || n.grahas.jupiter.combust ? "weak" : "strong" }
      : y0;
    const tpl = YOGA_TEXT[yogaKey(y)];
    if (!tpl) throw new Error(`No text for yoga ${y.id} (${yogaKey(y)})`);
    const tone: Tone = y.tone === "good" ? "good"
      : y.tone === "challenge" && !y.id.startsWith("parivartana") && y.strength !== "weak" ? "hard" : "mixed";
    const { text, recognise } = splitText(fill(tpl, { p: nameOf(y.grahas[0]) }));
    return {
      id: y.id, name: y.name, tone,
      strength: y.strength === "strong" ? "mạnh" : y.strength === "weak" ? "nhẹ" : "vừa",
      chips: [...y.grahas.map(nameOf), ...(!noTime && y.houses.length ? [`nhà ${[...new Set(y.houses)].join(", ")}`] : [])],
      text, recognise, detail: yogaDetail(n, y, noTime), houses: noTime ? [] : [...new Set(y.houses)],
    };
  });
}

export function readYogas(n: Natal, noTime = false): { intro: string; list: YogaReading[] } {
  const list = readYogaList(n, noTime);
  return { intro: list.length ? fill(YOGA_COUNT_LINE, { k: list.length }) : YOGA_NONE_LINE, list };
}
