// Vietnamese lunisolar calendar (Âm lịch Việt Nam).
//
// The Vietnamese calendar is computed with the same astronomy as the Chinese
// one but for UTC+7 (the Chinese calendar uses UTC+8). A new moon that falls
// within an hour of midnight can therefore start a different day, and a leap
// month can land in a different month. Libraries built for the Chinese
// calendar are wrong for those cases; this module takes the time zone as a
// parameter and computes the moon and sun with the validated engine.
//
// Structure follows the widely used algorithm by Hồ Ngọc Đức (month 11 holds
// the winter solstice; a month with no major solar term is the leap month).
import { engine } from "./instance.ts";
import { lunarPhases } from "caelus";

const SYNODIC = 29.530588853;
const EPOCH = 2415021.076998695; // new moon near 1900-01-01
const nmCache = new Map<number, number>();

/** UT Julian day of lunation k (k = 0 is the new moon of Jan 1900). */
function newMoonJd(k: number): number {
  const hit = nmCache.get(k);
  if (hit !== undefined) return hit;
  const approx = EPOCH + SYNODIC * k;
  const found = lunarPhases(engine, approx - 4, approx + 4, 4).filter(([, p]) => p === "new");
  if (found.length === 0) throw new Error(`new moon not found for k=${k}`);
  found.sort((a, b) => Math.abs(a[0] - approx) - Math.abs(b[0] - approx));
  nmCache.set(k, found[0][0]);
  return found[0][0];
}

const newMoonDay = (k: number, tz: number) => Math.floor(newMoonJd(k) + 0.5 + tz / 24);

/** Index (0..11) of the 30-degree solar sector at local midnight starting `dayNumber`. */
const sunSector = (dayNumber: number, tz: number) =>
  Math.floor(engine.longitude("sun", dayNumber - 0.5 - tz / 24) / 30);

export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  return dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

export function jdToDate(jd: number): [number, number, number] {
  const a = jd + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return [e - Math.floor((153 * m + 2) / 5) + 1, m + 3 - 12 * Math.floor(m / 10), 100 * b + d - 4800 + Math.floor(m / 10)];
}

function lunarMonth11(yy: number, tz: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / SYNODIC);
  let nm = newMoonDay(k, tz);
  if (sunSector(nm, tz) >= 9) nm = newMoonDay(k - 1, tz);
  return nm;
}

function leapMonthOffset(a11: number, tz: number): number {
  const k = Math.floor((a11 - EPOCH) / SYNODIC + 0.5);
  let last = 0;
  let i = 1;
  let arc = sunSector(newMoonDay(k + i, tz), tz);
  do {
    last = arc;
    i++;
    arc = sunSector(newMoonDay(k + i, tz), tz);
  } while (arc !== last && i < 14);
  return i - 1;
}

export interface LunarDate { day: number; month: number; year: number; leap: boolean }

export function solarToLunar(dd: number, mm: number, yy: number, tz = 7): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - EPOCH) / SYNODIC);
  let monthStart = newMoonDay(k + 1, tz);
  if (monthStart > dayNumber) monthStart = newMoonDay(k, tz);
  let a11 = lunarMonth11(yy, tz);
  let b11 = a11;
  let year: number;
  if (a11 >= monthStart) {
    year = yy;
    a11 = lunarMonth11(yy - 1, tz);
  } else {
    year = yy + 1;
    b11 = lunarMonth11(yy + 1, tz);
  }
  const day = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let leap = false;
  let month = diff + 11;
  if (b11 - a11 > 365) {
    const leapDiff = leapMonthOffset(a11, tz);
    if (diff >= leapDiff) {
      month = diff + 10;
      if (diff === leapDiff) leap = true;
    }
  }
  if (month > 12) month -= 12;
  if (month >= 11 && diff < 4) year -= 1;
  return { day, month, year, leap };
}

/** Returns the solar date, or null when that lunar date does not exist. */
export function lunarToSolar(day: number, month: number, year: number, leap: boolean, tz = 7): [number, number, number] | null {
  let a11: number, b11: number;
  if (month < 11) {
    a11 = lunarMonth11(year - 1, tz);
    b11 = lunarMonth11(year, tz);
  } else {
    a11 = lunarMonth11(year, tz);
    b11 = lunarMonth11(year + 1, tz);
  }
  const k = Math.floor(0.5 + (a11 - EPOCH) / SYNODIC);
  let off = month - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    const leapOff = leapMonthOffset(a11, tz);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (leap && month !== leapMonth) return null;
    if (leap || off >= leapOff) off += 1;
  } else if (leap) {
    return null;
  }
  const monthStart = newMoonDay(k + off, tz);
  const solar = jdToDate(monthStart + day - 1);
  // Reject days past the end of that month (e.g. day 30 of a 29-day month).
  const back = solarToLunar(solar[0], solar[1], solar[2], tz);
  if (back.day !== day || back.month !== month || back.year !== year || back.leap !== leap) return null;
  return solar;
}

export const LUNAR_YEAR_NAMES = (() => {
  const can = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  const chi = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
  return (year: number) => `${can[(year + 6) % 10]} ${chi[(year + 8) % 12]}`;
})();
