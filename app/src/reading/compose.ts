// The composer: facts from the engine -> hand-written atoms -> a reading.
// Nothing here invents astrology. Every sentence comes from src/reading/content/*, and every choice between sentences is
// made by a rule that is written down in the "Phương pháp" page.
import { SIGNS, NAKSHATRA_VI, fmtDeg } from "../engine/constants.ts";
import { makeCtx, withTime, type ComposeOptions, type Ctx } from "./ctx.ts";
import { stability } from "./stability.ts";
import { readExplore } from "./explore.ts";
import { readForecast } from "./forecast.ts";
import { readVargas } from "./vargas3.ts";
import { readNodes } from "./nodes.ts";
import { readHousePage, type Told } from "./housepage.ts";
import { HOUSE_MAP } from "./content/house-deep.ts";
import { readLetter, readOverview } from "./overview3.ts";
import { readLadder, readTimeline } from "./timeline.ts";
import { readSky } from "./skypage.ts";
import { readYogas } from "./yogapage.ts";
import type { Reading } from "./types.ts";

export type { Reading, Tone, HouseReading, VargaReading, YogaReading, PeriodRead, MahaRow } from "./types.ts";
export type { ComposeOptions, Ctx } from "./ctx.ts";
export { scoreHouse, toneOf, TONE_CUTS } from "./shared.ts";
export { makeCtx, withTime };
export { readChildren, readTrend } from "./timeline.ts";

export function compose(n: import("../engine/types.ts").Natal, now: number, opts: ComposeOptions = {}): Reading {
  return composeFrom(makeCtx(n, now, opts));
}

export function composeFrom(ctx: Ctx): Reading {
  const n = ctx.n;
  const noTime = ctx.noTime;
  return {
    meta: {
      lagna: SIGNS[n.lagna.sign], moon: SIGNS[n.grahas.moon.sign], sun: SIGNS[n.grahas.sun.sign],
      moonNak: NAKSHATRA_VI[n.grahas.moon.nak.name] ?? n.grahas.moon.nak.name,
      lagnaNak: NAKSHATRA_VI[n.lagna.nak.name] ?? n.lagna.nak.name,
      ayanamsa: fmtDeg(n.ayanamsa), noTime, windowMin: ctx.windowMin,
      lagnaShift: noTime ? [] : stability(n, ctx.windowMin).lagna.map((x) => SIGNS[x]),
    },
    letter: readLetter(ctx),
    overview: readOverview(ctx),
    houseMap: noTime ? null : HOUSE_MAP,
    houses: noTime ? [] : (() => { const told: Told = new Map(); return n.houses.map((h) => readHousePage(ctx, h, told)); })(),
    yogas: readYogas(n, noTime),
    nodes: readNodes(ctx),
    vargas: noTime ? null : readVargas(ctx),
    forecast: readForecast(ctx),
    explore: readExplore(ctx),
    timeline: readTimeline(ctx),
    ladder: readLadder(ctx),
    sky: readSky(ctx),
  };
}

/** The parts of a reading that depend on the day: used when the reader picks another date. */
export function composeDay(ctx: Ctx, ms: number) {
  const c = withTime(ctx, ms);
  return { ladder: readLadder(c), sky: readSky(c) };
}

export type DayReading = ReturnType<typeof composeDay>;
