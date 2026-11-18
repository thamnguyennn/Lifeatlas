// A curated, conservative set of yogas. Each rule is a textbook definition
// that depends only on signs, houses, lordship and the standard aspects.
import { GRAHAS, SEVEN, SIGN_LORD, KENDRA, DUSTHANA, EXALT, mod, type GrahaId } from "./constants.ts";
import { aspectsHouse } from "./rules.ts";
import type { Natal, Yoga } from "./types.ts";

const ownedHouses = (n: Natal, g: GrahaId) => n.houses.filter((h) => h.lord === g).map((h) => h.n);
const fromMoon = (n: Natal, g: GrahaId) => mod(n.grahas[g].sign - n.grahas.moon.sign, 12) + 1;
const sameSign = (n: Natal, a: GrahaId, b: GrahaId) => n.grahas[a].sign === n.grahas[b].sign;
const inSignOfOther = (n: Natal, a: GrahaId, b: GrahaId) => SIGN_LORD[n.grahas[a].sign] === b;
const exchange = (n: Natal, a: GrahaId, b: GrahaId) => a !== b && inSignOfOther(n, a, b) && inSignOfOther(n, b, a);
const mutualAspect = (n: Natal, a: GrahaId, b: GrahaId) =>
  aspectsHouse(a, n.grahas[a].house, n.grahas[b].house) && aspectsHouse(b, n.grahas[b].house, n.grahas[a].house);
const linked = (n: Natal, a: GrahaId, b: GrahaId): "conj" | "exchange" | "aspect" | null =>
  a === b ? null : sameSign(n, a, b) ? "conj" : exchange(n, a, b) ? "exchange" : mutualAspect(n, a, b) ? "aspect" : null;
const weakened = (n: Natal, g: GrahaId) => n.grahas[g].dignity === "debilitated" || n.grahas[g].combust;

export function detectYogas(n: Natal): Yoga[] {
  const out: Yoga[] = [];
  const G = n.grahas;

  // --- Pancha Mahapurusha: a planet in its own/exalted sign in a kendra from the Lagna ---
  const MAHA: [GrahaId, string, string][] = [
    ["mars", "Ruchaka", "Ruchaka"], ["mercury", "Bhadra", "Bhadra"], ["jupiter", "Hamsa", "Hamsa"],
    ["venus", "Malavya", "Malavya"], ["saturn", "Sasa", "Sasa"],
  ];
  for (const [g, id, sa] of MAHA) {
    const d = G[g].dignity;
    if ((d === "own" || d === "exalted" || d === "moolatrikona") && KENDRA.includes(G[g].house)) {
      out.push({ id: `mahapurusha_${id.toLowerCase()}`, name: `${sa} Yoga`, sanskrit: sa, grahas: [g], houses: [G[g].house],
        tone: "good", strength: weakened(n, g) ? "normal" : "strong", kind: id.toLowerCase() });
    }
  }

  // --- Gajakesari: Jupiter in a kendra from the Moon ---
  if (KENDRA.includes(fromMoon(n, "jupiter"))) {
    const bad = G.jupiter.dignity === "debilitated" || G.jupiter.combust || DUSTHANA.includes(G.jupiter.house);
    out.push({ id: "gajakesari", name: "Gajakesari Yoga", sanskrit: "Gajakesari", grahas: ["jupiter", "moon"],
      houses: [G.jupiter.house, G.moon.house], tone: "good", strength: bad ? "weak" : "strong" });
  }

  // --- Budha-Aditya: Sun and Mercury in one sign ---
  if (sameSign(n, "sun", "mercury")) {
    const sep = Math.abs(G.sun.deg - G.mercury.deg);
    out.push({ id: "budhaditya", name: "Budha-Aditya Yoga", sanskrit: "Budha-Aditya", grahas: ["sun", "mercury"],
      houses: [G.sun.house], tone: "good", strength: sep < 8 ? "weak" : "normal" });
  }

  // --- Chandra-Mangala: Moon with Mars ---
  if (sameSign(n, "moon", "mars")) {
    out.push({ id: "chandra_mangala", name: "Chandra-Mangala Yoga", sanskrit: "Chandra-Mangala", grahas: ["moon", "mars"],
      houses: [G.moon.house], tone: "mixed", strength: "normal" });
  }

  // --- Amala: only natural benefics in the 10th from the Lagna or from the Moon ---
  {
    const benefic = new Set<GrahaId>(["jupiter", "venus", "mercury"]);
    const tenth = (sign: number) => mod(sign + 9, 12);
    const check = (sign: number) => {
      const occ = GRAHAS.filter((g) => G[g].sign === tenth(sign));
      return occ.length > 0 && occ.every((g) => benefic.has(g)) ? occ : null;
    };
    const fromLagna = check(n.lagna.sign);
    const fromMoonSign = check(G.moon.sign);
    const occ = fromLagna ?? fromMoonSign;
    if (occ) {
      out.push({ id: "amala", name: "Amala Yoga", sanskrit: "Amala", grahas: occ,
        houses: [fromLagna ? 10 : mod(G.moon.sign + 9 - n.lagna.sign, 12) + 1], tone: "good", strength: "normal",
        kind: fromLagna ? "lagna" : "moon" });
    }
  }

  // --- Moon-based: Sunapha / Anapha / Durudhara, and Kemadruma ---
  {
    const five: GrahaId[] = ["mars", "mercury", "jupiter", "venus", "saturn"];
    const second = five.filter((g) => fromMoon(n, g) === 2);
    const twelfth = five.filter((g) => fromMoon(n, g) === 12);
    const withMoon = five.filter((g) => fromMoon(n, g) === 1);
    if (second.length && twelfth.length) {
      out.push({ id: "durudhara", name: "Durudhara Yoga", sanskrit: "Durudhara", grahas: [...second, ...twelfth], houses: [], tone: "good", strength: "normal" });
    } else if (second.length) {
      out.push({ id: "sunapha", name: "Sunapha Yoga", sanskrit: "Sunapha", grahas: second, houses: [], tone: "good", strength: "normal" });
    } else if (twelfth.length) {
      out.push({ id: "anapha", name: "Anapha Yoga", sanskrit: "Anapha", grahas: twelfth, houses: [], tone: "good", strength: "normal" });
    }
    if (!second.length && !twelfth.length && !withMoon.length) {
      const cancelled = KENDRA.includes(G.moon.house) || five.some((g) => KENDRA.includes(fromMoon(n, g)));
      out.push({ id: "kemadruma", name: "Kemadruma Yoga", sanskrit: "Kemadruma", grahas: ["moon"], houses: [G.moon.house],
        tone: "challenge", strength: cancelled ? "weak" : "normal", kind: cancelled ? "cancelled" : "active" });
    }
  }

  // --- Parivartana: two planets in each other's signs ---
  for (let i = 0; i < SEVEN.length; i++) {
    for (let j = i + 1; j < SEVEN.length; j++) {
      const a = SEVEN[i], b = SEVEN[j];
      if (!exchange(n, a, b)) continue;
      const ha = ownedHouses(n, a), hb = ownedHouses(n, b);
      const all = [...ha, ...hb];
      const kind = all.some((h) => DUSTHANA.includes(h)) ? "dainya" : all.includes(3) ? "khala" : "maha";
      out.push({ id: `parivartana_${a}_${b}`, name: "Parivartana Yoga", sanskrit: "Parivartana", grahas: [a, b],
        houses: [G[a].house, G[b].house], tone: kind === "maha" ? "good" : kind === "khala" ? "mixed" : "challenge",
        strength: weakened(n, a) || weakened(n, b) ? "normal" : "strong", kind });
    }
  }

  // --- Raja yoga: a kendra lord linked with a trikona lord ---
  {
    const kendraLords = new Set<GrahaId>(), trikonaLords = new Set<GrahaId>();
    for (const h of n.houses) {
      if ([4, 7, 10].includes(h.n)) kendraLords.add(h.lord);
      if ([5, 9].includes(h.n)) trikonaLords.add(h.lord);
    }
    const seen = new Set<string>();
    const found: Yoga[] = [];
    for (const k of kendraLords) for (const t of trikonaLords) {
      if (k === t) continue;
      const how = linked(n, k, t);
      const key = [k, t].sort().join("-");
      if (!how || seen.has(key)) continue;
      seen.add(key);
      found.push({ id: `raja_${key}`, name: "Raja Yoga", sanskrit: "Raja Yoga", grahas: [k, t], houses: [G[k].house, G[t].house],
        tone: "good", strength: how !== "aspect" && !weakened(n, k) && !weakened(n, t) ? "strong" : "normal", kind: how });
    }
    out.push(...found.slice(0, 2));
    // A planet that rules both a kendra and a trikona (Yogakaraka)
    for (const g of SEVEN) {
      const owned = ownedHouses(n, g);
      if (owned.some((h) => [4, 7, 10].includes(h)) && owned.some((h) => [5, 9].includes(h))) {
        out.push({ id: `yogakaraka_${g}`, name: "Yogakaraka", sanskrit: "Yogakaraka", grahas: [g], houses: [G[g].house],
          tone: "good", strength: weakened(n, g) || DUSTHANA.includes(G[g].house) ? "weak" : "strong" });
      }
    }
  }

  // --- Dhana yoga: lords of 2 / 11 linked with lords of 1 / 5 / 9 ---
  {
    const lordOf = (h: number) => n.houses[h - 1].lord;
    const wealth = [2, 11].map(lordOf);
    const support = [1, 5, 9].map(lordOf);
    const seen = new Set<string>();
    const found: Yoga[] = [];
    for (const w of wealth) for (const s of support) {
      const how = linked(n, w, s);
      const key = [w, s].sort().join("-");
      if (!how || seen.has(key)) continue;
      seen.add(key);
      found.push({ id: `dhana_${key}`, name: "Dhana Yoga", sanskrit: "Dhana Yoga", grahas: [w, s], houses: [G[w].house, G[s].house],
        tone: "good", strength: how !== "aspect" ? "normal" : "weak", kind: how });
    }
    out.push(...found.slice(0, 1));
  }

  // --- Viparita Raja: a 6/8/12 lord sitting in 6/8/12 ---
  for (const h of [6, 8, 12]) {
    const lord = n.houses[h - 1].lord;
    if (DUSTHANA.includes(G[lord].house) && !(G[lord].dignity === "debilitated")) {
      const nm = h === 6 ? "Harsha" : h === 8 ? "Sarala" : "Vimala";
      out.push({ id: `viparita_${nm.toLowerCase()}`, name: `${nm} Yoga`, sanskrit: nm, grahas: [lord], houses: [G[lord].house],
        tone: "good", strength: "normal", kind: String(h) });
    }
  }

  // --- Neecha Bhanga: a weak (debilitated) planet whose weakness is cancelled ---
  for (const g of SEVEN) {
    if (G[g].dignity !== "debilitated") continue;
    const dispositor = SIGN_LORD[G[g].sign];
    const exaltedHere = SEVEN.find((x) => EXALT[x]?.sign === G[g].sign);
    const strongKendra = (x: GrahaId | undefined) =>
      !!x && (KENDRA.includes(G[x].house) || KENDRA.includes(fromMoon(n, x)));
    if (strongKendra(dispositor) || strongKendra(exaltedHere)) {
      out.push({ id: `neecha_bhanga_${g}`, name: "Neecha Bhanga", sanskrit: "Neecha Bhanga", grahas: [g], houses: [G[g].house],
        tone: "good", strength: "normal" });
    }
  }

  // --- Node conjunctions ---
  if (sameSign(n, "jupiter", "rahu")) {
    out.push({ id: "guru_chandala", name: "Guru-Chandala Yoga", sanskrit: "Guru-Chandala", grahas: ["jupiter", "rahu"], houses: [G.jupiter.house], tone: "mixed", strength: "normal" });
  }
  for (const lum of ["sun", "moon"] as GrahaId[]) {
    for (const node of ["rahu", "ketu"] as GrahaId[]) {
      if (sameSign(n, lum, node)) {
        out.push({ id: `grahan_${lum}_${node}`, name: "Grahan Yoga", sanskrit: "Grahan", grahas: [lum, node], houses: [G[lum].house], tone: "mixed", strength: "normal", kind: lum });
      }
    }
  }

  return out;
}
