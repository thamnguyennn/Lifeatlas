// Shadbala: the six-fold strength of the seven planets, Ishta/Kashta Phala and Bhava Bala.
//
// Written from the classical rules (Brihat Parashara Hora Shastra ch. 27-29, in the form taught by
// B.V. Raman and P.V.R. Narasimha Rao). Values are in virupas (60 virupas = 1 rupa).
// Where schools differ we pick the reading that agrees with Jagannatha Hora; tests/shadbala-check.py
// compares every component with the open-source PyJHora port and lists the deliberate differences.
import { riseSet, varga } from "caelus";
import { engine, HOUSE_SYSTEM, ZODIAC } from "./instance.ts";
import {
  SIGN_LORD, OWN_SIGNS, EXALT, MOOLATRIKONA, FRIENDS, ENEMIES, mod, signOf, degInSign, type GrahaId,
} from "./constants.ts";
import type { Natal } from "./types.ts";

export type Seven = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";
export const SEVEN_IDS: Seven[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

/** Minimum total (in rupas) a planet needs to count as strong. */
export const REQUIRED_RUPAS: Record<Seven, number> = {
  sun: 6.5, moon: 6, mars: 5, mercury: 7, jupiter: 6.5, venus: 5.5, saturn: 5,
};
const NAISARGIKA: Record<Seven, number> = {
  sun: 60, moon: 51.43, venus: 42.86, jupiter: 34.29, mercury: 25.71, mars: 17.14, saturn: 8.57,
};
/** Apparent disc diameters (arc-seconds) used to settle a planetary war. */
const DISC: Partial<Record<Seven, number>> = { mars: 9.4, mercury: 6.6, jupiter: 190.4, venus: 16.6, saturn: 158 };

const angDist = (a: number, b: number) => {
  const d = mod(a - b, 360);
  return d > 180 ? 360 - d : d;
};

// ------------------------------------------------------------------ Sthana (position)

export function uchchaBala(id: Seven, lon: number): number {
  const ex = EXALT[id]!;
  return angDist(lon, mod(ex.sign * 30 + ex.deg + 180, 360)) / 3;
}

/** D7 (Saptamsa): odd signs count from the sign itself, even signs from the 7th sign. */
export function saptamsaSign(lon: number): number {
  const s = signOf(lon);
  return mod(s + (s % 2 === 0 ? 0 : 6) + Math.floor(degInSign(lon) / (30 / 7)), 12);
}

/** D30 (Trimsamsa, Parashari): unequal parts ruled by Mars, Saturn, Jupiter, Mercury, Venus. */
export function trimsamsaSign(lon: number): number {
  const s = signOf(lon), d = degInSign(lon);
  if (s % 2 === 0) {
    if (d < 5) return 0; // Aries (Mars)
    if (d < 10) return 10; // Aquarius (Saturn)
    if (d < 18) return 8; // Sagittarius (Jupiter)
    if (d < 25) return 2; // Gemini (Mercury)
    return 6; // Libra (Venus)
  }
  if (d < 5) return 1; // Taurus (Venus)
  if (d < 12) return 5; // Virgo (Mercury)
  if (d < 20) return 11; // Pisces (Jupiter)
  if (d < 25) return 9; // Capricorn (Saturn)
  return 7; // Scorpio (Mars)
}

/** The seven vargas Shadbala looks at, as the sign a longitude falls in. */
export function saptaVargaSigns(lon: number): number[] {
  return [
    signOf(lon), varga(lon, 2).sign_index, varga(lon, 3).sign_index, saptamsaSign(lon),
    varga(lon, 9).sign_index, varga(lon, 12).sign_index, trimsamsaSign(lon),
  ];
}

export type Relation = "adhimitra" | "mitra" | "sama" | "satru" | "adhisatru";

/** Natural friendship combined with the temporary one (2nd, 3rd, 4th, 10th, 11th, 12th sign away). */
export function compoundRelation(p: Seven, q: Seven, rasiSigns: Record<Seven, number>): Relation {
  const natural = FRIENDS[p]?.includes(q) ? 1 : ENEMIES[p]?.includes(q) ? -1 : 0;
  const temporary = [1, 2, 3, 9, 10, 11].includes(mod(rasiSigns[q] - rasiSigns[p], 12)) ? 1 : -1;
  const s = natural + temporary;
  return s === 2 ? "adhimitra" : s === 1 ? "mitra" : s === 0 ? "sama" : s === -1 ? "satru" : "adhisatru";
}

const VARGA_SCORE: Record<Relation, number> = { adhimitra: 22.5, mitra: 15, sama: 7.5, satru: 3.75, adhisatru: 1.875 };

export interface SaptavargajaOpts { mtIgnoresDegrees?: boolean }

export function saptavargajaBala(
  id: Seven, lon: number, rasiSigns: Record<Seven, number>, opts: SaptavargajaOpts = {},
): number {
  const signs = saptaVargaSigns(lon);
  let total = 0;
  signs.forEach((sign, i) => {
    const mt = MOOLATRIKONA[id]!;
    const inMt = i === 0 && sign === mt.sign && (opts.mtIgnoresDegrees || (degInSign(lon) >= mt.from && degInSign(lon) < mt.to));
    if (inMt) { total += 45; return; }
    if (OWN_SIGNS[id]?.includes(sign)) { total += 30; return; }
    total += VARGA_SCORE[compoundRelation(id, SIGN_LORD[sign] as Seven, rasiSigns)];
  });
  return total;
}

/** Moon and Venus like even signs, the rest like odd signs: 15 for the rashi and 15 for the navamsa. */
export function ojhayugmaBala(id: Seven, rasiSign: number, navamsaSign: number): number {
  const wantEven = id === "moon" || id === "venus";
  const ok = (s: number) => (s % 2 === 1) === wantEven;
  return (ok(rasiSign) ? 15 : 0) + (ok(navamsaSign) ? 15 : 0);
}

export function kendradiBala(house: number): number {
  if ([1, 4, 7, 10].includes(house)) return 60;
  if ([2, 5, 8, 11].includes(house)) return 30;
  return 15;
}

export function drekkanaBala(id: Seven, degInSignValue: number): number {
  const third = Math.min(2, Math.floor(degInSignValue / 10));
  const group: Seven[][] = [["sun", "mars", "jupiter"], ["mercury", "saturn"], ["moon", "venus"]];
  return group[third].includes(id) ? 15 : 0;
}

// ------------------------------------------------------------------ Dig (direction)

export function digBala(id: Seven, lon: number, asc: number, mc: number): number {
  const strong: Record<Seven, number> = {
    jupiter: asc, mercury: asc, sun: mc, mars: mc, saturn: mod(asc + 180, 360), moon: mod(mc + 180, 360), venus: mod(mc + 180, 360),
  };
  return angDist(lon, mod(strong[id] + 180, 360)) / 3;
}

// ------------------------------------------------------------------ Drik (aspects)

/** Sphuta drishti in virupas of a planet standing `d` degrees behind the aspected point (BPHS ch. 26 table). */
export function aspectValue(by: Seven, d: number, capped = true): number {
  let v: number;
  if (d < 30) v = 0;
  else if (d < 60) v = (d - 30) / 2;
  else if (d < 90) v = d - 45;
  else if (d < 120) v = (120 - d) / 2 + 30;
  else if (d < 150) v = 150 - d;
  else if (d < 180) v = (d - 150) * 2;
  else if (d < 300) v = (300 - d) / 2;
  else v = 0;
  if (by === "saturn" && d >= 60 && d < 90) v += 45;
  if (by === "mars" && d >= 90 && d < 120) v += 15;
  if (by === "jupiter" && d >= 120 && d < 150) v += 30;
  if (by === "mars" && d >= 210 && d < 240) v += 15;
  if (by === "jupiter" && d >= 240 && d < 270) v += 30;
  if (by === "saturn" && d >= 270 && d < 300) v += 45;
  return capped ? Math.min(60, v) : v;
}

/** Net aspect strength received by each planet: benefic aspects add, malefic aspects subtract, a quarter of the sum. */
export function drikBala(
  lons: Record<Seven, number>, benefics: Seven[], capped = true,
): Record<Seven, number> {
  const out = {} as Record<Seven, number>;
  for (const x of SEVEN_IDS) {
    let sum = 0;
    for (const y of SEVEN_IDS) {
      if (y === x) continue;
      const v = aspectValue(y, mod(lons[x] - lons[y], 360), capped);
      sum += benefics.includes(y) ? v : -v;
    }
    out[x] = sum / 4;
  }
  return out;
}

/** Which planets count as benefic when the Drik and Paksha scores are worked out. */
export function beneficSet(lons: Record<Seven, number>): { benefics: Seven[]; malefics: Seven[] } {
  const benefics: Seven[] = ["jupiter", "venus"];
  const malefics: Seven[] = ["sun", "mars", "saturn"];
  (mod(lons.moon - lons.sun, 360) < 180 ? benefics : malefics).push("moon");
  // Mercury follows its company: with more benefics it is benefic, with more malefics malefic.
  const mercSign = signOf(lons.mercury);
  const mates = SEVEN_IDS.filter((p) => p !== "mercury" && signOf(lons[p]) === mercSign);
  const nb = mates.filter((p) => benefics.includes(p)).length;
  const nm = mates.filter((p) => malefics.includes(p)).length;
  let mercuryGood = true;
  if (nm > nb) mercuryGood = false;
  else if (nb === nm && nb > 0) {
    const nearest = [...mates].sort((a, b) => Math.abs(lons[a] - lons.mercury) - Math.abs(lons[b] - lons.mercury))[0];
    mercuryGood = benefics.includes(nearest);
  }
  (mercuryGood ? benefics : malefics).push("mercury");
  return { benefics, malefics };
}

// ------------------------------------------------------------------ Kala (time)

const WEEKDAY_LORD: Seven[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
/** Order in which the planetary hours follow one another, starting from the weekday lord. */
const HORA_SEQ: Seven[] = ["sun", "venus", "mercury", "moon", "saturn", "jupiter", "mars"];
/** Raman's tables count the year and month lords from this weekday order (Tuesday first). */
const RAMAN_ORDER: Seven[] = ["mars", "mercury", "jupiter", "venus", "saturn", "sun", "moon"];

/** Civil date to Julian day number (noon-based integer), proleptic Gregorian. */
export function jdn(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

const JDN_1951_12_31 = jdn(1951, 12, 31);

/** Greenwich mean sidereal time in degrees. */
export function gmstDeg(jd: number): number {
  const T = (jd - 2451545) / 36525;
  return mod(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T - (T * T * T) / 38710000, 360);
}

export interface SunDay {
  /** Sunrise at or before the birth moment (start of the Hindu day), as a Julian day. */
  rise: number;
  /** Start and end of the day-part or night-part the birth falls in. */
  partStart: number;
  partEnd: number;
  isDay: boolean;
}

export function sunDay(jd: number, lat: number, lon: number): SunDay {
  const find = (kind: "rise" | "set") => {
    const out: number[] = [];
    let t = jd - 1.6;
    for (let i = 0; i < 5; i++) {
      const r = riseSet(engine, "sun", t, lat, lon, kind);
      if (r === null) break;
      out.push(r);
      t = r + 0.5;
    }
    return out;
  };
  const rises = find("rise"), sets = find("set");
  const before = (a: number[]) => a.filter((x) => x <= jd).pop();
  const after = (a: number[]) => a.find((x) => x > jd);
  let pr = before(rises), ns = after(sets), ps = before(sets), nr = after(rises);
  if (pr === undefined || ns === undefined || ps === undefined || nr === undefined) {
    // Polar day or night: fall back to a 6 o'clock / 18 o'clock local solar day.
    const lmt = jd + lon / 360 + 0.5;
    const day0 = Math.floor(lmt) - lon / 360 - 0.5;
    pr = day0 + 0.25; ns = day0 + 0.75; ps = day0 - 0.25; nr = day0 + 1.25;
    if (jd < pr) { pr -= 1; ns -= 1; ps -= 1; nr -= 1; }
  }
  const isDay = pr > ps;
  return isDay
    ? { rise: pr, partStart: pr, partEnd: ns, isDay }
    : { rise: pr, partStart: ps, partEnd: nr, isDay };
}

/** Weekday (0 = Sunday) of the Hindu day that started at `riseJd`, using local mean time for the date. */
export function weekdayOfSunrise(riseJd: number, lonDeg: number): number {
  return mod(Math.floor(riseJd + lonDeg / 360 + 0.5) + 1, 7);
}

export function natonnatha(id: Seven, jd: number, lon: number, sunRaDeg: number): number {
  if (id === "mercury") return 60;
  const lst = mod(gmstDeg(jd) + lon, 360);
  const h = Math.abs(mod(lst - sunRaDeg + 180, 360) - 180); // 0 at noon, 180 at midnight
  return id === "sun" || id === "jupiter" || id === "venus" ? 60 - h / 3 : h / 3;
}

export function pakshaBala(id: Seven, lons: Record<Seven, number>): number {
  const pb = angDist(lons.moon, lons.sun) / 3;
  // Jupiter, Venus, Mercury and the Moon gain with the Moon's light; Sun, Mars and Saturn lose it.
  return id === "sun" || id === "mars" || id === "saturn" ? 60 - pb : pb;
}

export function tribhagaBala(id: Seven, jd: number, day: SunDay): number {
  if (id === "jupiter") return 60;
  const third = Math.min(2, Math.floor(((jd - day.partStart) / (day.partEnd - day.partStart)) * 3));
  const owner: Seven = day.isDay ? (["mercury", "sun", "saturn"] as Seven[])[third] : (["moon", "venus", "mars"] as Seven[])[third];
  return owner === id ? 60 : 0;
}

export function abdaMasaLords(civilJdn: number): { abda: Seven; masa: Seven } {
  const days = 174 + (civilJdn - JDN_1951_12_31);
  return {
    abda: RAMAN_ORDER[mod(Math.floor(days / 360) * 3 + 1, 7)],
    masa: RAMAN_ORDER[mod(Math.floor(days / 30) * 2 + 1, 7)],
  };
}

export function horaLord(weekday: number, hoursSinceSunrise: number): Seven {
  const start = HORA_SEQ.indexOf(WEEKDAY_LORD[weekday]);
  return HORA_SEQ[mod(start + Math.floor(hoursSinceSunrise), 7)];
}

/** Declination strength. Sun, Mars, Jupiter, Venus like the north, Moon and Saturn the south, Mercury either. */
export function ayanaBala(id: Seven, dec: number): number {
  const k = 60 / 46.9; // 60 virupas over twice 23°27′
  const eps = 23.45;
  const raw = id === "moon" || id === "saturn" ? eps - dec : id === "mercury" ? eps + Math.abs(dec) : eps + dec;
  return Math.min(60, Math.max(0, raw * k));
}

// ------------------------------------------------------------------ Cheshta (motion)

// Mean heliocentric longitudes (JPL approximate elements, degrees at J2000 and per Julian century).
const MEAN_L: Record<string, [number, number]> = {
  mercury: [252.2503235, 149472.67411175],
  venus: [181.9790995, 58517.81538729],
  earth: [100.46457166, 35999.37306329],
  mars: [-4.55343205, 19140.30268499],
  jupiter: [34.39644051, 3034.74612775],
  saturn: [49.95424423, 1222.49362201],
};
const LAHIRI_J2000 = 23.857;

export function meanLongitudeSid(body: Seven, jd: number): number {
  const T = (jd - 2451545) / 36525;
  if (body === "sun") return mod(MEAN_L.earth[0] + 180 + MEAN_L.earth[1] * T - LAHIRI_J2000, 360);
  const [l0, l1] = MEAN_L[body];
  return mod(l0 + l1 * T - LAHIRI_J2000, 360);
}

/** Cheshta Kendra folded to 0..180 degrees and turned into virupas. */
export function cheshtaFromMotion(id: Seven, trueLon: number, jd: number): number {
  const sunMean = meanLongitudeSid("sun", jd);
  const planetMean = meanLongitudeSid(id, jd);
  const inner = id === "mercury" || id === "venus";
  const manda = inner ? sunMean : planetMean;
  const sighra = inner ? planetMean : sunMean;
  const avg = manda + ((mod(trueLon - manda + 180, 360) - 180) / 2);
  return angDist(sighra, avg) / 3;
}

// ------------------------------------------------------------------ Assembly

export interface PlanetStrength {
  id: Seven;
  sthana: { uchcha: number; saptavargaja: number; ojhayugma: number; kendradi: number; drekkana: number; total: number };
  dig: number;
  kala: {
    nathonnatha: number; paksha: number; tribhaga: number; abda: number; masa: number; vara: number; hora: number;
    ayana: number; yuddha: number; total: number;
  };
  cheshta: number;
  naisargika: number;
  drik: number;
  total: number;
  rupas: number;
  required: number;
  /** rupas / required. 1 = just enough. */
  ratio: number;
  rank: number; // 1 = strongest by ratio
  band: "rất mạnh" | "mạnh" | "vừa" | "yếu";
  ishta: number;
  kashta: number;
  /** Uchcha Bala on its own, 0..60, the part of Ishta/Kashta that comes from the sign. */
  inDignity: boolean;
}

export interface BhavaStrength {
  house: number;
  adhipati: number;
  dig: number;
  drishti: number;
  total: number;
  rank: number; // 1 = strongest
}

export interface Shadbala {
  planets: Record<Seven, PlanetStrength>;
  bhava: BhavaStrength[];
  /** Planet ids ordered from the strongest to the weakest ratio. */
  order: Seven[];
  warInPairs: [Seven, Seven][];
}

export function bandOf(ratio: number): PlanetStrength["band"] {
  return ratio >= 1.3 ? "rất mạnh" : ratio >= 1.05 ? "mạnh" : ratio >= 0.85 ? "vừa" : "yếu";
}

const BODY: Record<Seven, string> = {
  sun: "sun", moon: "moon", mars: "mars", mercury: "mercury", jupiter: "jupiter", venus: "venus", saturn: "saturn",
};

export interface ShadbalaOpts extends SaptavargajaOpts {
  /** Test switch: keep Sun and Moon Cheshta at zero as some ports do. */
  noLuminaryCheshta?: boolean;
}

export function shadbala(natal: Natal, opts: ShadbalaOpts = {}): Shadbala {
  const jd = natal.jd;
  const lons = {} as Record<Seven, number>;
  const rasiSigns = {} as Record<Seven, number>;
  for (const id of SEVEN_IDS) { lons[id] = natal.grahas[id].lon; rasiSigns[id] = natal.grahas[id].sign; }

  const chart = engine.chartAt(jd, natal.lat, natal.lon, { houseSystem: HOUSE_SYSTEM, zodiac: ZODIAC });
  const asc = chart.angles.asc, mc = chart.angles.mc;
  const tropical = {} as Record<Seven, { dec: number; ra: number; lat: number }>;
  for (const id of SEVEN_IDS) {
    const p = engine.position(BODY[id], jd);
    tropical[id] = { dec: p.dec, ra: p.ra, lat: p.lat };
  }
  const day = sunDay(jd, natal.lat, natal.lon);
  const wd = weekdayOfSunrise(day.rise, natal.lon);
  const civil = Math.floor(jd + natal.lon / 360 + 0.5);
  const { abda, masa } = abdaMasaLords(civil);
  const hora = horaLord(wd, (jd - day.rise) * 24);
  const { benefics } = beneficSet(lons);
  const drik = drikBala(lons, benefics);

  const base: Record<string, Omit<PlanetStrength, "yuddha" | "rank" | "band" | "ratio" | "ishta" | "kashta">> = {} as never;
  const kalaBeforeWar: Record<Seven, number> = {} as never;
  for (const id of SEVEN_IDS) {
    const g = natal.grahas[id];
    const uchcha = uchchaBala(id, lons[id]);
    const sapta = saptavargajaBala(id, lons[id], rasiSigns, opts);
    const ojha = ojhayugmaBala(id, g.sign, g.navamsaSign);
    const kend = kendradiBala(g.house);
    const drek = drekkanaBala(id, g.deg);
    const sthana = uchcha + sapta + ojha + kend + drek;
    const dig = digBala(id, lons[id], asc, mc);
    const nata = natonnatha(id, jd, natal.lon, tropical.sun.ra);
    const paksha = pakshaBala(id, lons) * (id === "moon" ? 2 : 1);
    const tri = tribhagaBala(id, jd, day);
    const ab = abda === id ? 15 : 0;
    const ma = masa === id ? 30 : 0;
    const va = WEEKDAY_LORD[wd] === id ? 45 : 0;
    const ho = hora === id ? 60 : 0;
    const ayanaRaw = ayanaBala(id, tropical[id].dec);
    const ayana = id === "sun" ? ayanaRaw * 2 : ayanaRaw;
    const kala = nata + paksha + tri + ab + ma + va + ho + ayana;
    let cheshta: number;
    if (id === "sun") cheshta = opts.noLuminaryCheshta ? 0 : ayanaRaw;
    else if (id === "moon") cheshta = opts.noLuminaryCheshta ? 0 : pakshaBala("moon", lons);
    else cheshta = cheshtaFromMotion(id, lons[id], jd);
    kalaBeforeWar[id] = kala;
    base[id] = {
      id,
      sthana: { uchcha, saptavargaja: sapta, ojhayugma: ojha, kendradi: kend, drekkana: drek, total: sthana },
      dig,
      kala: { nathonnatha: nata, paksha, tribhaga: tri, abda: ab, masa: ma, vara: va, hora: ho, ayana, yuddha: 0, total: kala },
      cheshta,
      naisargika: NAISARGIKA[id],
      drik: drik[id],
      total: 0, rupas: 0, required: REQUIRED_RUPAS[id], inDignity: ["exalted", "moolatrikona", "own"].includes(g.dignity),
    };
  }

  // Planetary war: two of Mars..Saturn within one degree. The more northern planet wins.
  const war: Record<Seven, number> = { sun: 0, moon: 0, mars: 0, mercury: 0, jupiter: 0, venus: 0, saturn: 0 };
  const warInPairs: [Seven, Seven][] = [];
  const fighters: Seven[] = ["mars", "mercury", "jupiter", "venus", "saturn"];
  for (let i = 0; i < fighters.length; i++) {
    for (let j = i + 1; j < fighters.length; j++) {
      const a = fighters[i], b = fighters[j];
      if (angDist(lons[a], lons[b]) >= 1) continue;
      const north = tropical[a].lat >= tropical[b].lat ? a : b;
      const south = north === a ? b : a;
      const partial = (p: Seven) => base[p].sthana.total + base[p].dig + kalaBeforeWar[p];
      const v = Math.abs(partial(a) - partial(b)) / Math.abs((DISC[a] ?? 0) - (DISC[b] ?? 0) || 1);
      war[north] += v; war[south] -= v;
      warInPairs.push([north, south]);
    }
  }

  const planets = {} as Record<Seven, PlanetStrength>;
  for (const id of SEVEN_IDS) {
    const b = base[id];
    b.kala.yuddha = war[id];
    b.kala.total += war[id];
    const total = b.sthana.total + b.dig + b.kala.total + b.cheshta + b.naisargika + b.drik;
    const rupas = total / 60;
    const ratio = rupas / b.required;
    const uch = b.sthana.uchcha;
    const ch = Math.min(60, Math.max(0, b.cheshta));
    planets[id] = {
      ...b, total, rupas, ratio, rank: 0, band: bandOf(ratio),
      ishta: Math.sqrt(uch * ch), kashta: Math.sqrt((60 - uch) * (60 - ch)),
    };
  }
  const order = [...SEVEN_IDS].sort((a, b) => planets[b].ratio - planets[a].ratio);
  order.forEach((id, i) => { planets[id].rank = i + 1; });

  const bhava = bhavaBala(natal, planets, lons, benefics);
  return { planets, bhava, order, warInPairs };
}

// ------------------------------------------------------------------ Bhava Bala (Whole Sign frame)

// Sign groups for the directional strength of a house.
const NARA = [2, 5, 6, 10]; // Gemini, Virgo, Libra, Aquarius
const CHATUSHPADA = [0, 1, 4]; // Aries, Taurus, Leo
const JALACHARA = [3, 11]; // Cancer, Pisces
const KEETA = [7]; // Scorpio

function houseDig(sign: number, house: number): number {
  // Strongest house for each kind of sign; the weakest is the house opposite.
  const strongest = (kind: "nara" | "chatushpada" | "jalachara" | "keeta") =>
    ({ nara: 1, chatushpada: 10, jalachara: 4, keeta: 7 })[kind];
  const score = (kind: "nara" | "chatushpada" | "jalachara" | "keeta") => {
    const d = Math.abs(((house - strongest(kind) + 18) % 12) - 6); // 0 = strongest .. 6 = opposite
    return 60 - d * 10;
  };
  if (NARA.includes(sign)) return score("nara");
  if (CHATUSHPADA.includes(sign)) return score("chatushpada");
  if (JALACHARA.includes(sign)) return score("jalachara");
  if (KEETA.includes(sign)) return score("keeta");
  // Sagittarius and Capricorn change their nature half-way: share the two readings equally.
  if (sign === 8) return (score("nara") + score("chatushpada")) / 2;
  return (score("chatushpada") + score("jalachara")) / 2; // Capricorn
}

function bhavaBala(
  natal: Natal, planets: Record<Seven, PlanetStrength>, lons: Record<Seven, number>, benefics: Seven[],
): BhavaStrength[] {
  const rows: BhavaStrength[] = natal.houses.map((h) => {
    const mid = h.sign * 30 + 15;
    let aspects = 0;
    for (const p of SEVEN_IDS) {
      const v = aspectValue(p, mod(mid - lons[p], 360), true);
      aspects += benefics.includes(p) ? v : -v;
    }
    const adhipati = planets[h.lord as Seven].total;
    const dig = houseDig(h.sign, h.n);
    const drishti = aspects / 4;
    return { house: h.n, adhipati, dig, drishti, total: adhipati + dig + drishti, rank: 0 };
  });
  [...rows].sort((a, b) => b.total - a.total).forEach((r, i) => { r.rank = i + 1; });
  return rows;
}

export const isSeven = (id: GrahaId): id is Seven => id !== "rahu" && id !== "ketu";
