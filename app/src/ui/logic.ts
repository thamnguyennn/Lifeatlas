// Glue between the form and the engine: dates, civil time, Lagna ambiguity, and the finished reading.
import { resolveCivilTime, type PlaceInput, type ResolvedTime } from "../engine/vn-time.ts";
import { computeNatal, ascendantLon } from "../engine/core.ts";
import { solarToLunar, lunarToSolar, type LunarDate } from "../engine/lunar-vn.ts";
import { composeFrom, makeCtx, type Ctx, type Reading } from "../reading/compose.ts";
import { TIME_WINDOW_MIN } from "../engine/dasha5.ts";
import { CANH_GIO } from "../engine/places.ts";
import { signOf, SIGNS } from "../engine/constants.ts";
import { jdFromMs, msFromJd } from "../engine/instance.ts";
import { engine, ZODIAC } from "../engine/instance.ts";
import { nakshatra } from "caelus";
import type { Natal } from "../engine/types.ts";

export type CalendarKind = "solar" | "lunar";
export type TimeKind = "exact" | "canh" | "unknown";

export interface FormValues {
  name: string;
  calendar: CalendarKind;
  day: number;
  month: number;
  year: number;
  leap: boolean;
  timeKind: TimeKind;
  hh: number;
  mm: number;
  canhId: string;
  place: PlaceInput;
}

export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;

const daysInSolarMonth = (m: number, y: number) => new Date(y, m, 0).getDate();

/**
 * The Vietnamese lunar calendar is computed for UTC+7, except that South Vietnam kept UTC+8
 * from 1960 until 13 June 1975, and its calendar followed. This is why 1968 has two Tết dates.
 */
export function lunarTzFor(place: PlaceInput, solar: [number, number, number]): number {
  if (place.country !== "VN" || place.lat >= 17) return 7;
  const [d, m, y] = solar;
  const t = Date.UTC(y, m - 1, d);
  return t >= Date.UTC(1960, 0, 1) && t < Date.UTC(1975, 5, 13) ? 8 : 7;
}

export interface DateResult {
  ok: boolean;
  error?: string;
  solar?: [number, number, number]; // d, m, y
  lunar?: LunarDate;
  tz?: number;
}

export function resolveDate(f: Pick<FormValues, "calendar" | "day" | "month" | "year" | "leap" | "place">): DateResult {
  const { calendar, day, month, year, leap, place } = f;
  if (!Number.isFinite(year) || year < MIN_YEAR || year > MAX_YEAR) return { ok: false, error: `Năm cần nằm trong khoảng ${MIN_YEAR}–${MAX_YEAR}.` };
  if (!Number.isFinite(month) || month < 1 || month > 12) return { ok: false, error: "Tháng cần từ 1 đến 12." };
  if (!Number.isFinite(day) || day < 1 || day > 31) return { ok: false, error: "Ngày không hợp lệ." };
  if (calendar === "solar") {
    if (day > daysInSolarMonth(month, year)) return { ok: false, error: `Tháng ${month}/${year} chỉ có ${daysInSolarMonth(month, year)} ngày.` };
    const tz = lunarTzFor(place, [day, month, year]);
    return { ok: true, solar: [day, month, year], lunar: solarToLunar(day, month, year, tz), tz };
  }
  // lunar input: try the South's UTC+8 rule first when it can apply, and keep it only if the result lands in range
  const attempts = place.country === "VN" && place.lat < 17 && year >= 1959 && year <= 1976 ? [8, 7] : [7];
  for (const tz of attempts) {
    const s = lunarToSolar(day, month, year, leap, tz);
    if (!s) continue;
    if (lunarTzFor(place, s) !== tz) continue;
    return { ok: true, solar: s, lunar: { day, month, year, leap }, tz };
  }
  return {
    ok: false,
    error: leap
      ? `Năm ${year} âm lịch không có tháng ${month} nhuận.`
      : `Ngày ${day}/${month}/${year} âm lịch không tồn tại (tháng này có thể chỉ có 29 ngày).`,
  };
}

// --------------------------------------------------------------------------------------------

export interface LagnaChoice { sign: number; fromMin: number; toMin: number; midMin: number }

/** Scan a clock range and report where the Lagna changes sign. */
export function lagnaSegments(
  solar: [number, number, number], fromMin: number, toMin: number, place: PlaceInput,
): LagnaChoice[] {
  const [d, m, y] = solar;
  const at = (min: number) => {
    const dayShift = Math.floor(min / 1440);
    const mm = ((min % 1440) + 1440) % 1440;
    const date = new Date(Date.UTC(y, m - 1, d + dayShift));
    const t = resolveCivilTime(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), Math.floor(mm / 60), mm % 60, place);
    return jdFromMs(t.utcMs);
  };
  const segs: LagnaChoice[] = [];
  const step = 2;
  for (let t = fromMin; t < toMin; t += step) {
    const sign = signOf(ascendantLon(at(t + 0.5), place.lat, place.lon));
    const last = segs[segs.length - 1];
    if (last && last.sign === sign) last.toMin = Math.min(t + step, toMin);
    else segs.push({ sign, fromMin: t, toMin: Math.min(t + step, toMin), midMin: 0 });
  }
  for (const s of segs) s.midMin = Math.round((s.fromMin + s.toMin) / 2);
  // a sign that appears twice in a row after merging stays one segment; tiny slivers (< 6 min) are dropped
  return segs.filter((s) => s.toMin - s.fromMin >= 6 || segs.length === 1);
}

export const fmtClock = (min: number) => {
  const m = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

// --------------------------------------------------------------------------------------------

export interface Prepared {
  values: FormValues;
  date: DateResult & { ok: true };
  localMin: number; // minutes since local midnight actually used
  time: ResolvedTime;
  natal: Natal;
  /** The context the reading was made in, kept so the UI can read the same chart on another day. */
  ctx: Ctx;
  reading: Reading;
  noTime: boolean;
  /** canh giờ: the sign choices when the range spans a Lagna change */
  choices: LagnaChoice[];
  chosenMin: number;
  /** unknown time: what the Moon could be at the start and end of the day */
  moonSpan?: { from: string; to: string; signFrom: string; signTo: string };
}

export function localMinuteOf(v: FormValues): number {
  if (v.timeKind === "exact") return v.hh * 60 + v.mm;
  if (v.timeKind === "canh") {
    const c = CANH_GIO.find((x) => x.id === v.canhId) ?? CANH_GIO[0];
    return Math.round((c.from + c.to) / 2);
  }
  return 12 * 60;
}

export function prepare(v: FormValues, chosenMin?: number, now = Date.now()): Prepared {
  const date = resolveDate(v);
  if (!date.ok || !date.solar) throw new Error(date.error ?? "Ngày không hợp lệ");
  const solar = date.solar;

  let choices: LagnaChoice[] = [];
  let localMin = localMinuteOf(v);
  if (v.timeKind === "canh") {
    const c = CANH_GIO.find((x) => x.id === v.canhId) ?? CANH_GIO[0];
    choices = lagnaSegments(solar, c.from, c.to, v.place);
    if (choices.length > 1) {
      const biggest = [...choices].sort((a, b) => b.toMin - b.fromMin - (a.toMin - a.fromMin))[0];
      localMin = chosenMin !== undefined && choices.some((s) => chosenMin >= s.fromMin && chosenMin <= s.toMin) ? chosenMin : biggest.midMin;
    } else if (choices.length === 1) localMin = choices[0].midMin;
  }
  const [d, m, y] = solar;
  const time = resolveCivilTime(y, m, d, Math.floor(localMin / 60), localMin % 60, v.place);
  const natal = computeNatal(time.utcMs, v.place.lat, v.place.lon);
  const ctx = makeCtx(natal, now, { name: v.name, noTime: v.timeKind === "unknown", windowMin: TIME_WINDOW_MIN[v.timeKind] });


  let moonSpan: Prepared["moonSpan"];
  if (v.timeKind === "unknown") {
    const t0 = resolveCivilTime(y, m, d, 0, 0, v.place), t1 = resolveCivilTime(y, m, d, 23, 59, v.place);
    const l0 = engine.position("moon", jdFromMs(t0.utcMs), { zodiac: ZODIAC }).lon;
    const l1 = engine.position("moon", jdFromMs(t1.utcMs), { zodiac: ZODIAC }).lon;
    moonSpan = { from: nakshatra(l0).name, to: nakshatra(l1).name, signFrom: SIGNS[signOf(l0)], signTo: SIGNS[signOf(l1)] };
  }
  ctx.uncertainMoon = !!moonSpan && moonSpan.signFrom !== moonSpan.signTo;
  const reading = composeFrom(ctx);
  return { values: v, date: date as Prepared["date"], localMin, time, natal, ctx, reading, noTime: v.timeKind === "unknown", choices, chosenMin: localMin, moonSpan };
}

export const msToDate = (ms: number) => new Date(ms);
export { msFromJd };
