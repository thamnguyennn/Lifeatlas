// Natal chart assembly: positions, houses, dignities, aspects, dasha, ashtakavarga, yogas.
import { nakshatra, vimshottariDashas, varga } from "caelus";
import { engine, ZODIAC, HOUSE_SYSTEM, DASHA_YEAR_DAYS, jdFromMs, msFromJd } from "./instance.ts";
import {
  GRAHAS, SEVEN, SIGN_LORD, COMBUST_ORB, DIG_HOUSE, asGraha, mod, signOf, degInSign, type GrahaId,
} from "./constants.ts";
import { ashtakavarga } from "./ashtakavarga.ts";
import { detectYogas } from "./yogas.ts";
import { dignityOf, aspectsHouse } from "./rules.ts";
import type { Graha, HouseInfo, Natal, NakshatraInfo, DashaPeriod } from "./types.ts";

const ENGINE_BODY: Record<GrahaId, string> = {
  sun: "sun", moon: "moon", mars: "mars", mercury: "mercury", jupiter: "jupiter",
  venus: "venus", saturn: "saturn", rahu: "true_node", ketu: "true_node",
};

function nakInfo(lon: number): NakshatraInfo {
  const n = nakshatra(lon);
  return { index: n.index, name: n.name, pada: n.pada, lord: asGraha(n.lord), pos: n.pos };
}

export function ascendantLon(jd: number, lat: number, lon: number): number {
  return engine.chartAt(jd, lat, lon, { houseSystem: HOUSE_SYSTEM, zodiac: ZODIAC }).angles.asc;
}

export function computeNatal(utcMs: number, lat: number, lon: number): Natal {
  const jd = jdFromMs(utcMs);
  const chart = engine.chartAt(jd, lat, lon, { houseSystem: HOUSE_SYSTEM, zodiac: ZODIAC });
  const warnings = chart.warnings.map((w) => `${w.kind}:${"body" in w ? w.body : ""}`);

  const lagnaLon = chart.angles.asc;
  const lagnaSign = signOf(lagnaLon);

  const raw: Record<string, { lon: number; speed: number; retro: boolean }> = {};
  for (const id of GRAHAS) {
    const p = engine.position(ENGINE_BODY[id], jd, { zodiac: ZODIAC });
    if (id === "ketu") raw[id] = { lon: mod(p.lon + 180, 360), speed: p.speed, retro: true };
    else if (id === "rahu") raw[id] = { lon: p.lon, speed: p.speed, retro: true };
    else raw[id] = { lon: p.lon, speed: p.speed, retro: p.retrograde };
  }
  const sunLon = raw.sun.lon;

  const grahas = {} as Record<GrahaId, Graha>;
  for (const id of GRAHAS) {
    const { lon: l, speed, retro } = raw[id];
    const sign = signOf(l);
    const deg = degInSign(l);
    const house = mod(sign - lagnaSign, 12) + 1;
    const orb = COMBUST_ORB[id];
    const sep = Math.abs(mod(l - sunLon + 180, 360) - 180);
    const navamsaSign = varga(l, 9).sign_index;
    grahas[id] = {
      id, lon: l, sign, deg, speed, retro,
      nak: nakInfo(l),
      house,
      dignity: dignityOf(id, sign, deg),
      combust: orb !== undefined && id !== "sun" && sep <= (id === "mercury" && retro ? 12 : id === "venus" && retro ? 8 : orb),
      digBala: DIG_HOUSE[id] === house,
      navamsaSign,
      vargottama: navamsaSign === sign && id !== "rahu" && id !== "ketu",
    };
  }

  const av = ashtakavarga({
    sun: grahas.sun.sign, moon: grahas.moon.sign, mars: grahas.mars.sign, mercury: grahas.mercury.sign,
    jupiter: grahas.jupiter.sign, venus: grahas.venus.sign, saturn: grahas.saturn.sign, lagna: lagnaSign,
  });

  const houses: HouseInfo[] = [];
  for (let n = 1; n <= 12; n++) {
    const sign = mod(lagnaSign + n - 1, 12);
    const lord = SIGN_LORD[sign];
    houses.push({
      n, sign, lord,
      lordHouse: grahas[lord].house,
      occupants: GRAHAS.filter((g) => grahas[g].house === n),
      aspectedBy: SEVEN.filter((g) => grahas[g].house !== n && aspectsHouse(g, grahas[g].house, n)),
      sav: av.sav[sign],
    });
  }

  const tl = vimshottariDashas(grahas.moon.lon, jd, 2, DASHA_YEAR_DAYS, 10);
  const dasha: DashaPeriod[] = tl.dashas.map((d) => ({
    lord: asGraha(d.lord), startMs: msFromJd(d.start), endMs: msFromJd(d.end),
    sub: d.sub.map((s) => ({ lord: asGraha(s.lord), startMs: msFromJd(s.start), endMs: msFromJd(s.end) })),
  }));

  const tropSun = engine.longitude("sun", jd);
  const natal: Natal = {
    utcMs, jd, lat, lon,
    ayanamsa: mod(tropSun - sunLon, 360),
    lagna: { lon: lagnaLon, sign: lagnaSign, deg: degInSign(lagnaLon), nak: nakInfo(lagnaLon) },
    grahas, houses, bav: av.bav, sav: av.sav,
    dasha, dashaStartLord: asGraha(tl.start_lord), dashaBalanceYears: tl.balance_years,
    yogas: [], warnings,
  };
  natal.yogas = detectYogas(natal);
  return natal;
}

export function dashaAt(natal: Natal, ms: number) {
  const maha = natal.dasha.find((d) => ms >= d.startMs && ms < d.endMs) ?? null;
  const antar = maha?.sub.find((s) => ms >= s.startMs && ms < s.endMs) ?? null;
  return { maha, antar };
}

export const YEAR_MS = 365.25 * 86_400_000;
