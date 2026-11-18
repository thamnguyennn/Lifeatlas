// Text that both the report header and the plain-text export need, kept in one place.
import type { Prepared } from "./logic.ts";
import { CANH_GIO } from "../engine/places.ts";
import { LUNAR_YEAR_NAMES } from "../engine/lunar-vn.ts";
import type { Tone } from "../reading/compose.ts";

const pad = (n: number) => String(n).padStart(2, "0");

export const TONE_TEXT: Record<Tone, string> = { good: "nhiều thuận lợi", mixed: "có thuận có khó", hard: "nhiều khó khăn" };
export const TONE_SHORT: Record<Tone, string> = { good: "Thuận lợi", mixed: "Có thuận có khó", hard: "Nhiều khó khăn" };

export function birthTimeText(p: Prepared): string {
  const { values } = p;
  if (values.timeKind === "exact") return `${pad(values.hh)}:${pad(values.mm)}`;
  if (values.timeKind === "canh") return CANH_GIO.find((c) => c.id === values.canhId)?.name ?? "canh giờ";
  return "không rõ giờ";
}

/** "23/05/1990 dương lịch (29/4 Canh Ngọ âm lịch) · 08:40 · Huế" */
export function birthSubtitle(p: Prepared): string {
  const solar = p.date.solar!;
  const lunar = p.date.lunar!;
  return `${pad(solar[0])}/${pad(solar[1])}/${solar[2]} dương lịch (${lunar.day}/${lunar.month}${lunar.leap ? " nhuận" : ""} ${LUNAR_YEAR_NAMES(lunar.year)} âm lịch) · ${birthTimeText(p)} · ${p.values.place.name}`;
}
