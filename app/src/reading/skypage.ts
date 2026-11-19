// Life Atlas v3.0 — Gochara (Bầu trời hiện tại) and Lời nhắn tháng này.
// Explicitly separates and compares Gochara from the natal Moon (Chandra Lagna) vs. Gochara from the Ascendant (Udaya Lagna).
import { SIGNS, mod, fmtDeg, type GrahaId } from "../engine/constants.ts";
import { GOCHAR_GOOD, transitAt } from "../engine/transit.ts";
import { levelTrust } from "../engine/dasha5.ts";
import type { Ctx } from "./ctx.ts";
import type { SkyPlanet, SkyReading } from "./types.ts";
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

