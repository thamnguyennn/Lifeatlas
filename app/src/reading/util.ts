// Small helpers shared by the composer files.
import { GRAHA_VI, type GrahaId } from "../engine/constants.ts";
import { YEAR_MS } from "../engine/core.ts";
import type { Natal } from "../engine/types.ts";
import { HOUSES } from "./content/houses-signs.ts";

export const nameOf = (g: GrahaId) => GRAHA_VI[g];
export const domain = (h: number) => HOUSES[h - 1].domain;
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** "A", "A và B", "A, B và C". */
export function joinVi(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} và ${items[items.length - 1]}`;
}

export function fill(tpl: string, vars: Record<string, string | number>): string {
  const out = tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  if (/\{\w+\}/.test(out)) throw new Error(`Unresolved placeholder in: ${out}`);
  return out;
}

export function firstSentence(s: string): string {
  const i = s.indexOf(". ");
  return i < 0 ? s : s.slice(0, i + 1);
}

const vnDate = (ms: number) => new Date(ms + 7 * 3_600_000);
export const mmYYYY = (ms: number) => `${String(vnDate(ms).getUTCMonth() + 1).padStart(2, "0")}/${vnDate(ms).getUTCFullYear()}`;
export const year = (ms: number) => vnDate(ms).getUTCFullYear();
export const ageAt = (n: Natal, ms: number) => (ms - n.utcMs) / YEAR_MS;
export const ddmmyyyy = (ms: number) => {
  const d = vnDate(ms);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
};

/** "khoảng 19 năm", "khoảng 7 tháng", "khoảng 3 tuần", "khoảng 4 ngày", "khoảng 9 giờ". */
export function spanLabel(ms: number): string {
  const days = ms / 86_400_000;
  if (days >= 700) { const y = days / 365.25; return `khoảng ${y >= 10 ? Math.round(y) : Math.round(y * 2) / 2} năm`.replace(".5", " rưỡi").replace(".", ","); }
  if (days >= 60) return `khoảng ${Math.round(days / 30.44)} tháng`;
  if (days >= 14) return `khoảng ${Math.round(days / 7)} tuần`;
  if (days >= 2) return `khoảng ${Math.round(days)} ngày`;
  return `khoảng ${Math.max(1, Math.round(days * 24))} giờ`;
}

/** Labels people add to a name that are not part of it: "Minh An – Test", "TC-03 Test", "Lan (thử)". */
const NOT_A_NAME = /^(test|thử|mẫu|demo|sample|tc)$/i;
/** "Nguyễn Thị Mai" -> "Mai", "Minh Anh (mẫu)" -> "Minh Anh", "Minh An – Test" -> "Minh An". Used in the greeting. */
export function greetName(name?: string): string {
  const w = (name ?? "").replace(/\(.*?\)/g, " ").replace(/[–—\-_,.;:!?"“”/\\|]+/g, " ")
    .trim().split(/\s+/).filter((x) => x && !NOT_A_NAME.test(x) && /\p{L}/u.test(x));
  if (!w.length) return "bạn";
  if (w.length <= 2) return w.join(" ");
  const last = w[w.length - 1], prev = w[w.length - 2];
  return ["thị", "văn"].includes(prev.toLowerCase()) ? last : `${prev} ${last}`;
}
