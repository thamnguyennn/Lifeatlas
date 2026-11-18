// Life Atlas v3.0 — Gochara (Bầu trời hiện tại) and Lời nhắn tháng này.
// Explicitly separates and compares Gochara from the natal Moon (Chandra Lagna) vs. Gochara from the Ascendant (Udaya Lagna).
import { SIGNS, mod, fmtDeg, type GrahaId } from "../engine/constants.ts";
import { GOCHAR_GOOD, transitAt } from "../engine/transit.ts";
import { levelTrust } from "../engine/dasha5.ts";
import type { Ctx } from "./ctx.ts";
import type { SkyPlanet, SkyReading, TodayReading } from "./types.ts";
import { HOUSE_TAG } from "./content/houses-signs.ts";
import { PLANETS } from "./content/planets.ts";
import { CHAPTER } from "./content/chapters.ts";
import {
  SKY_INTRO, MOON_LENS_INTRO, LAGNA_LENS_INTRO, FROM_MOON_POS, SATURN_FROM_MOON, JUPITER_FROM_MOON, FAST_FROM_MOON,
  SADE_SATI, SPECIALS, HIT_EFFECT, HIT_TEXT, HIT_LAGNA_ROLE, DAY_THEME, DAY_THEME_NOTIME, TARA_TEXT, CHANDRA,
  BINDU_LINE, RETRO_NOW, STAY_LABEL, SKY_LAGNA,
} from "./content/sky.ts";
import {
  TODAY_TITLE, TODAY_SEASON, TODAY_PARTS, TODAY_SKY, HIT_TODAY, ACTION, MONTH_ASK, MONTH_THEME, MONTH_SUN, TODAY_NOTIME_NOTE,
} from "./content/today.ts";
import { OVERLAP_TODAY } from "./content/dasha-deep.ts";
import { findOverlaps } from "./timeline.ts";
import { nameOf, fill, lowerFirst, mmYYYY, ddmmyyyy, firstSentence } from "./util.ts";

const SLOW = ["saturn", "jupiter", "rahu", "ketu", "mars"] as const;
type Slow = (typeof SLOW)[number];

function buildPlanetGochara(ctx: Ctx, id: Slow): {
  moonText: string;
  lagnaText: string | null;
  divergenceNote: string | null;
  text: string;
} {
  const g = ctx.transit.grahas[id];
  const moonParts: string[] = [];
  if (id === "saturn") moonParts.push(SATURN_FROM_MOON[g.fromMoon - 1]);
  else if (id === "jupiter") moonParts.push(JUPITER_FROM_MOON[g.fromMoon - 1]);
  else moonParts.push(fill(FAST_FROM_MOON[id][GOCHAR_GOOD[id].includes(g.fromMoon) ? "good" : "hard"], { pos: FROM_MOON_POS(g.fromMoon) }));
  if (g.bindus !== null) moonParts.push(fill(BINDU_LINE[g.support], { b: g.bindus }));
  if (g.retro && id !== "rahu" && id !== "ketu") moonParts.push(RETRO_NOW);
  const moonText = moonParts.join(" ");

  if (ctx.noTime) {
    return { moonText, lagnaText: null, divergenceNote: null, text: moonText };
  }

  const hLagna = g.fromLagna;
  const tag = HOUSE_TAG[hLagna - 1];
  const hSav = ctx.n.houses[hLagna - 1].sav;
  const savContext =
    hSav >= 30
      ? `Nhà ${hLagna} vốn có điểm hỗ trợ tổng hợp cao (${hSav} điểm SAV), nên những chuyển động thực tế tại đây có nền tảng vững để đón nhận.`
      : hSav <= 25
        ? `Vì nhà ${hLagna} có điểm SAV khiêm tốn (${hSav} điểm), bạn nên sắp xếp công việc ở mảng này theo từng bước rõ ràng, vừa sức.`
        : `Nhà ${hLagna} có ${hSav} điểm SAV (mức cân bằng), nên kết quả thực tế đi liền với sự chủ động của bạn.`;
  const lagnaText = `${fill(SKY_LAGNA.lead, { name: nameOf(id), h: hLagna, tag })}${SKY_LAGNA[id]} ${savContext}`;

  const moonGood = GOCHAR_GOOD[id].includes(g.fromMoon);
  const lagnaHouseTone = ctx.tones[hLagna - 1];
  let divergenceNote: string | null = null;
  if (moonGood && lagnaHouseTone === "hard") {
    divergenceNote = `Đối chiếu hai góc nhìn: Tính từ Mặt Trăng (cung thứ ${g.fromMoon}), tâm thế của bạn khá vững và chủ động; nhờ vậy bạn đủ bình tĩnh để tháo gỡ những bài toán thực tế tại nhà ${hLagna} (${tag}) tính từ Cung mọc.`;
  } else if (!moonGood && lagnaHouseTone === "good") {
    divergenceNote = `Đối chiếu hai góc nhìn: Dù nhà ${hLagna} (${tag}) tính từ Cung mọc có nền tảng thực tế thuận lợi, vị trí cung thứ ${g.fromMoon} tính từ Mặt Trăng lại làm tâm trí dễ bận tâm hơn thường lệ — hãy tin vào kết quả công việc thực tế thay vì lo xa.`;
  } else if (moonGood && lagnaHouseTone === "good") {
    divergenceNote = `Đối chiếu hai góc nhìn: Cả góc nhìn cảm xúc từ Mặt Trăng (cung thứ ${g.fromMoon}) lẫn góc nhìn cấu trúc từ Cung mọc (nhà ${hLagna} - ${tag}) đều đồng thuận nâng đỡ bạn trong giai đoạn này.`;
  }

  return {
    moonText,
    lagnaText,
    divergenceNote,
    text: [moonText, lagnaText, divergenceNote].filter(Boolean).join(" "),
  };
}

export function readSky(ctx: Ctx): SkyReading {
  const tr = ctx.transit;
  const stays = new Map((tr.stays ?? []).map((s) => [s.id, s]));
  const why: string[] = [];

  const planets: SkyPlanet[] = SLOW.map((id) => {
    const g = tr.grahas[id];
    const st = stays.get(id);
    const gochara = buildPlanetGochara(ctx, id);
    why.push(
      `${nameOf(id)} tại ${SIGNS[g.sign]} ${fmtDeg(g.deg)}: cung thứ ${g.fromMoon} từ Mặt Trăng (${GOCHAR_GOOD[id].includes(g.fromMoon) ? "thuận cổ điển" : "cần lưu tâm"}${g.bindus !== null ? `, BAV ${g.bindus}/8` : ""})${ctx.noTime ? "" : ` · nhà ${g.fromLagna} từ Cung mọc (SAV ${ctx.n.houses[g.fromLagna - 1].sav})`}.`,
    );
    return {
      id, name: nameOf(id), sign: SIGNS[g.sign], deg: fmtDeg(g.deg), retro: g.retro && id !== "rahu" && id !== "ketu",
      fromLagna: ctx.noTime ? null : g.fromLagna, fromMoon: g.fromMoon, bindus: g.bindus, support: g.support,
      stay: st?.since && st?.until ? fill(STAY_LABEL, { from: mmYYYY(st.since), to: mmYYYY(st.until) }) : null,
      moonText: gochara.moonText,
      lagnaText: gochara.lagnaText,
      divergenceNote: gochara.divergenceNote,
      text: gochara.text,
    };
  });

  const moonSign = ctx.n.grahas.moon.sign;
  const phase = tr.sadeSati.phase;
  const sade = phase === "none"
    ? { phase, title: SADE_SATI.none.title, text: `${fill(SADE_SATI.none.text, { sign: SIGNS[mod(moonSign - 1, 12)] })} ${SADE_SATI.what}` }
    : { phase, title: SADE_SATI[phase].title, text: `${SADE_SATI[phase].text} ${SADE_SATI.what}` };

  const specials: SkyReading["specials"] = [];
  if (tr.ashtamaShani) specials.push(SPECIALS.ashtama);
  if (tr.kantakaShani) specials.push(SPECIALS.kantaka);
  if (tr.jupiterFromMoon.good) specials.push(SPECIALS.jupiterGood);

  const tm = tr.moon;
  const theme = ctx.noTime
    ? fill(DAY_THEME_NOTIME, { sign: SIGNS[tr.grahas.moon.sign], h: tm.fromMoon })
    : `${DAY_THEME[tm.fromLagna - 1]} Tính từ Mặt Trăng lúc sinh, Mặt Trăng hôm nay đi qua cung thứ ${tm.fromMoon} (${SIGNS[tr.grahas.moon.sign]}).`;
  const day = {
    title: `Nhịp Mặt Trăng ngày ${ddmmyyyy(ctx.now)}`,
    paragraphs: [theme, tm.chandraBala ? CHANDRA.good : CHANDRA.hard, `${TARA_TEXT[tm.tara.n]}`],
    chandra: tm.chandraBala, tara: tm.tara,
  };
  why.push(`Mặt Trăng ngày ${ddmmyyyy(ctx.now)}: cung thứ ${tm.fromMoon} từ Mặt Trăng gốc (Chandra Bala: ${tm.chandraBala ? "thuận" : "cần điềm tĩnh"}), Tara Bala bậc ${tm.tara.n} (${tm.tara.kind}).`);

  const hits = tr.hits.slice(0, 3).map((h) => {
    const t = h.transit as Slow;
    const nName = h.natal === "lagna" ? "cung mọc" : nameOf(h.natal);
    const role = h.natal === "lagna" ? HIT_LAGNA_ROLE : PLANETS[h.natal].role;
    return {
      title: `${nameOf(h.transit)} ${h.kind === "trùng" ? "trùng với" : "đối diện"} ${nName}`,
      text: fill(HIT_TEXT, { t: nameOf(h.transit), kind: h.kind === "trùng" ? "đứng trùng" : "đứng đối diện", n: nName, orb: h.orb.toFixed(1).replace(".", ","), role, effect: HIT_EFFECT[t] }),
    };
  });

  return {
    ms: ctx.now,
    dateLabel: ddmmyyyy(ctx.now),
    intro: SKY_INTRO,
    moonLensIntro: MOON_LENS_INTRO,
    lagnaLensIntro: ctx.noTime ? null : LAGNA_LENS_INTRO,
    planets,
    sade,
    specials,
    day,
    hits,
    why,
  };
}

// ---------------------------------------------------------------- the message of the month

export function readToday(ctx: Ctx): TodayReading {
  const tr = ctx.transit;
  const [maha, antar, prat, fine, finest] = ctx.chain;
  const trust = (lvl: 1 | 2 | 3 | 4 | 5) => levelTrust(lvl, ctx.rel);
  const season: string[] = [];
  const skyLines: string[] = [];
  const why: string[] = [];

  if (maha) {
    const through = (ctx.now - maha.startMs) / (maha.endMs - maha.startMs);
    const closing = maha.endMs - ctx.now < 540 * 86_400_000 || through > 0.85;
    const where = closing ? "late" : through < 0.15 ? "early" : "middle";
    season.push(fill(TODAY_SEASON[where], { title: CHAPTER[maha.lord].title, to: mmYYYY(maha.endMs), now: lowerFirst(CHAPTER[maha.lord].now) }));
    why.push(`Đại vận ${nameOf(maha.lord)}: đến ${mmYYYY(maha.endMs)} (${trust(1)})`);
  }
  if (antar && trust(2) !== "chỉ tham khảo") {
    const withPrat = prat && trust(3) !== "chỉ tham khảo";
    season.push(withPrat
      ? fill(TODAY_PARTS.antarPrat, {
        antar: nameOf(antar.lord), clause: PLANETS[antar.lord].antar, prat: nameOf(prat.lord), clause2: PLANETS[prat.lord].antar,
        to: `${trust(3) === "gần đúng" ? "khoảng " : ""}${ddmmyyyy(prat.endMs)}`,
      })
      : fill(TODAY_PARTS.antar, { antar: nameOf(antar.lord), clause: PLANETS[antar.lord].antar }));
  }
  if (antar) why.push(`Tiểu vận ${nameOf(antar.lord)}: đến ${mmYYYY(antar.endMs)} (${trust(2)})`);
  if (prat) why.push(`Chặng ${nameOf(prat.lord)}: đến ${ddmmyyyy(prat.endMs)} (${trust(3)})`);
  const nextMaha = maha ? ctx.n.dasha.find((d) => d.startMs >= maha.endMs - 86_400_000) : undefined;
  if (maha && nextMaha && maha.endMs - ctx.now < 540 * 86_400_000 && trust(1) !== "chỉ tham khảo") {
    season.push(fill(TODAY_PARTS.next, { title: CHAPTER[nextMaha.lord].title, from: `${trust(1) === "chắc" ? "" : "khoảng "}${mmYYYY(nextMaha.startMs)}` }));
  }
  if (fine && trust(4) === "chắc") {
    season.push(fill(TODAY_PARTS.fine, { fine: nameOf(fine.lord), clause: PLANETS[fine.lord].antar }));
  }
  if (fine) why.push(`Nhịp ${nameOf(fine.lord)}: đến ${ddmmyyyy(fine.endMs)} (${trust(4)})`);
  if (finest) why.push(`Nhịp ngắn nhất ${nameOf(finest.lord)}: đến ${ddmmyyyy(finest.endMs)} (${trust(5)})`);

  const ov = findOverlaps(ctx)[0];
  if (ov) skyLines.push(fill(OVERLAP_TODAY, { n: ov.n, tag: ov.tag, who: ov.who, planet: nameOf(ov.planet), effect: ov.effect }));
  const sade = tr.sadeSati.phase;
  const hit = tr.hits.find((h) => h.orb <= 1.5 && (h.transit === "saturn" || h.transit === "jupiter" || h.transit === "rahu" || h.transit === "ketu"));
  let sky = "";
  if (sade === "peak") sky = TODAY_SKY.sadePeak;
  else if (sade === "rising") sky = TODAY_SKY.sadeRising;
  else if (sade === "setting") sky = TODAY_SKY.sadeSetting;
  else if (tr.ashtamaShani) sky = TODAY_SKY.ashtama;
  else if (hit) {
    const t = hit.transit as "saturn" | "jupiter" | "rahu" | "ketu";
    sky = fill(TODAY_SKY.hit, {
      t: nameOf(hit.transit), kind: hit.kind === "trùng" ? "đứng trùng" : "đứng đối diện",
      n: hit.natal === "lagna" ? "cung mọc" : nameOf(hit.natal),
      role: hit.natal === "lagna" ? "bản thân bạn" : PLANETS[hit.natal].role.split(",")[0],
      effect: HIT_TODAY[t],
    });
  } else if (tr.jupiterFromMoon.good) sky = TODAY_SKY.jupiter;
  if (sky) skyLines.push(sky);
  why.push(`Sao Thổ: cung thứ ${tr.saturnFromMoon} tính từ Mặt Trăng${tr.sadeSati.phase !== "none" ? " (đang trong Sade Sati)" : ""}`);
  why.push(`Sao Mộc: cung thứ ${tr.jupiterFromMoon.house} tính từ Mặt Trăng (${tr.jupiterFromMoon.good ? "thuận" : "chưa thuận"})`);

  const vn = new Date(ctx.now + 7 * 3_600_000);
  const y = vn.getUTCFullYear(), mo = vn.getUTCMonth();
  const monthStart = Date.UTC(y, mo, 1) - 7 * 3_600_000, monthEnd = Date.UTC(y, mo + 1, 1) - 7 * 3_600_000;
  const sunA = transitAt(ctx.n, monthStart + 43_200_000).grahas.sun;
  const sunB = transitAt(ctx.n, monthEnd - 43_200_000).grahas.sun;
  const worth = (s: "tốt" | "vừa" | "khó") => (s === "tốt" ? 1 : s === "khó" ? -1 : 0);
  const score = (worth(sunA.support) + worth(sunB.support)) / 2;
  const rhythm = score >= 0.5 ? "good" : score <= -0.5 ? "hard" : "mixed";
  const moved = sunA.sign !== sunB.sign;
  const sunLines: string[] = [];
  if (ctx.noTime) {
    sunLines.push(moved
      ? fill(MONTH_SUN.twoNoTime, { s1: SIGNS[sunA.sign], s2: SIGNS[sunB.sign], h1: sunA.fromMoon, h2: sunB.fromMoon })
      : fill(MONTH_SUN.oneNoTime, { sign: SIGNS[sunA.sign], h: sunA.fromMoon }));
  } else {
    const t1 = MONTH_THEME[sunA.fromLagna - 1], t2 = MONTH_THEME[sunB.fromLagna - 1];
    sunLines.push(moved
      ? fill(MONTH_SUN.two, { h1: sunA.fromLagna, main1: t1.main, good1: t1.good, care1: t1.care, h2: sunB.fromLagna, main2: t2.main, good2: t2.good, care2: t2.care })
      : fill(MONTH_SUN.one, { h: sunA.fromLagna, main: t1.main, good: t1.good, care: t1.care }));
  }
  if (rhythm !== "mixed") sunLines.push(rhythm === "good" ? MONTH_SUN.good : MONTH_SUN.hard);
  why.push(`Mặt Trời trong tháng: ${SIGNS[sunA.sign]}${moved ? ` rồi ${SIGNS[sunB.sign]}` : ""}${ctx.noTime ? "" : `, nhà ${sunA.fromLagna}${moved ? ` rồi nhà ${sunB.fromLagna}` : ""}`}`);
  why.push(`Mặt Trời tính từ Mặt Trăng lúc sinh: cung thứ ${sunA.fromMoon}${moved ? ` rồi thứ ${sunB.fromMoon}` : ""} (${rhythm === "good" ? "thuận" : rhythm === "hard" ? "chưa thuận" : "vừa"})`);

  let lead: GrahaId | undefined = maha?.lord;
  for (const lvl of [2, 3, 4] as const) {
    const node = ctx.chain[lvl - 1];
    if (node && (trust(lvl) === "chắc" || (lvl === 2 && trust(lvl) !== "chỉ tham khảo"))) lead = node.lord;
  }
  const action = lead ? ACTION[lead][rhythm] : "";

  const ask = ctx.noTime ? (maha ? CHAPTER[maha.lord].ask : MONTH_ASK[0]) : MONTH_ASK[sunA.fromLagna - 1];
  const trustNote = ctx.noTime
    ? TODAY_NOTIME_NOTE
    : `Lời nhắn dùng đến bậc ${[1, 2, 3, 4, 5].filter((l) => trust(l as 1) !== "chỉ tham khảo").length} của đại vận, vì các bậc sâu hơn chưa đủ chắc với giờ sinh bạn cung cấp.`;

  return {
    ms: ctx.now, monthLabel: mmYYYY(ctx.now), title: fill(TODAY_TITLE, { month: mmYYYY(ctx.now) }),
    paragraphs: [season.join(" "), skyLines.join(" "), sunLines.join(" "), action].filter(Boolean), ask, why, trustNote,
  };
}

export { firstSentence };
