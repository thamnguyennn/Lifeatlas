// Civil clock time -> UTC.
//
// A birth chart is only as good as the UTC instant behind it, and Vietnam's
// clocks were not always UTC+7. Generic IANA/ICU data covers only one
// "Asia/Ho_Chi_Minh" (the South) and treats the North as Bangkok, so we keep
// our own table for Vietnam, built from the tz database and Wikipedia's
// "Time in Vietnam", and we say plainly where sources disagree.

export interface PlaceInput {
  name: string;
  lat: number;
  lon: number;
  country: "VN" | "OTHER";
  /** IANA zone for places outside Vietnam. */
  tz?: string;
  /** A manual UTC offset in minutes (overrides everything else). */
  fixedOffsetMin?: number;
}

export interface TimeNote { level: "info" | "check"; text: string }

export interface ResolvedTime {
  utcMs: number;
  offsetSec: number;
  label: string; // e.g. "UTC+7"
  notes: TimeNote[];
  /** The local time falls in a clock gap or a repeated hour. */
  anomaly: "none" | "gap" | "repeat";
}

interface Segment {
  start: number; // UTC ms, inclusive
  end: number; // UTC ms, exclusive
  offSec: number;
  notes: TimeNote[];
}

const H = 3600;
/** UTC ms of a wall-clock moment that was read on a clock running at `offSec`. */
const at = (y: number, m: number, d: number, hh: number, mm: number, offSec: number) =>
  Date.UTC(y, m - 1, d, hh, mm) - offSec * 1000;
const NEG_INF = -8.64e15;
const POS_INF = 8.64e15;

const T_LMT_END = at(1906, 7, 1, 0, 0, 7 * H + 400);
const T_PLMT_END = at(1911, 5, 1, 0, 0, 7 * H + 390);
const T_1942 = at(1942, 12, 31, 23, 0, 7 * H);
const T_1945A = at(1945, 3, 14, 23, 0, 8 * H);
const T_1945B = at(1945, 9, 2, 0, 0, 9 * H);
const T_1947 = at(1947, 4, 1, 0, 0, 7 * H);
const N_1954 = at(1954, 10, 1, 0, 0, 7 * H);
const N_1967 = at(1967, 8, 8, 0, 0, 7 * H);
const S_1955 = at(1955, 7, 1, 0, 0, 8 * H);
const S_1959 = at(1959, 12, 31, 23, 0, 7 * H);
const T_1975 = at(1975, 6, 13, 0, 0, 8 * H);

const info = (text: string): TimeNote => ({ level: "info", text });
const check = (text: string): TimeNote => ({ level: "check", text });

const COMMON_EARLY: Segment[] = [
  { start: NEG_INF, end: T_LMT_END, offSec: 7 * H + 400, notes: [check("Trước 1906, Việt Nam dùng giờ địa phương (khoảng UTC+7:07).")] },
  { start: T_LMT_END, end: T_PLMT_END, offSec: 7 * H + 390, notes: [info("Giai đoạn 1906–1911 dùng giờ Pháp ở Đông Dương (UTC+7:06:30).")] },
  { start: T_PLMT_END, end: T_1942, offSec: 7 * H, notes: [] },
  { start: T_1942, end: T_1945A, offSec: 8 * H, notes: [check("1943–1945: Đông Dương dùng UTC+8. Nếu có giấy khai sinh ghi giờ, hãy đối chiếu.")] },
  { start: T_1945A, end: T_1945B, offSec: 9 * H, notes: [check("Từ 3/1945 đến 9/1945, giờ Tokyo (UTC+9) được dùng dưới thời Nhật chiếm đóng.")] },
  { start: T_1945B, end: T_1947, offSec: 7 * H, notes: [info("Sau 9/1945, giờ dân sự Việt Nam trở lại UTC+7.")] },
];

const NORTH: Segment[] = [
  ...COMMON_EARLY,
  { start: T_1947, end: N_1954, offSec: 7 * H, notes: [check("Miền Bắc 1947–1954 là vùng chiến sự: một số khu vực dùng UTC+8, tài liệu không nêu ranh giới cụ thể.")] },
  { start: N_1954, end: N_1967, offSec: 7 * H, notes: [check("Miền Bắc 1954–1967: Wikipedia ghi UTC+7, nhưng một số tài liệu ghi UTC+8 cho đến 8/8/1967. Hãy đối chiếu giấy khai sinh nếu có.")] },
  { start: N_1967, end: T_1975, offSec: 7 * H, notes: [info("Miền Bắc dùng UTC+7 (giờ Hà Nội).")] },
  { start: T_1975, end: POS_INF, offSec: 7 * H, notes: [] },
];

const SOUTH: Segment[] = [
  ...COMMON_EARLY,
  { start: T_1947, end: S_1955, offSec: 8 * H, notes: [check("Miền Nam 1947–1955 (giờ Sài Gòn) dùng UTC+8 theo cơ sở dữ liệu múi giờ.")] },
  { start: S_1955, end: S_1959, offSec: 7 * H, notes: [] },
  { start: S_1959, end: T_1975, offSec: 8 * H, notes: [info("Miền Nam dùng UTC+8 (giờ Sài Gòn) từ 1/1/1960 đến 13/6/1975, sớm hơn miền Bắc 1 giờ.")] },
  { start: T_1975, end: POS_INF, offSec: 7 * H, notes: [] },
];

/** The 17th parallel splits the two zones before reunification. */
export const isNorthVN = (lat: number) => lat >= 17.0;

const fmtOffset = (offSec: number) => {
  const sign = offSec < 0 ? "-" : "+";
  const a = Math.abs(offSec);
  const h = Math.floor(a / 3600), m = Math.floor((a % 3600) / 60), s = a % 60;
  return `UTC${sign}${h}${m || s ? ":" + String(m).padStart(2, "0") : ""}${s ? ":" + String(s).padStart(2, "0") : ""}`;
};

function resolveSegments(localMs: number, segs: Segment[]): ResolvedTime {
  const hits = segs.filter((s) => {
    const utc = localMs - s.offSec * 1000;
    return utc >= s.start && utc < s.end;
  });
  if (hits.length > 0) {
    const s = hits[0];
    return {
      utcMs: localMs - s.offSec * 1000, offsetSec: s.offSec, label: fmtOffset(s.offSec),
      notes: s.notes, anomaly: hits.length > 1 ? "repeat" : "none",
    };
  }
  // A clock gap (the clock jumped forward): read the time on the old clock.
  const i = segs.findIndex((s) => localMs - s.offSec * 1000 >= s.end);
  const s = segs[Math.max(0, i)];
  return {
    utcMs: localMs - s.offSec * 1000, offsetSec: s.offSec, label: fmtOffset(s.offSec),
    notes: [...s.notes, check("Giờ này rơi vào lúc đồng hồ được vặn tới (không tồn tại). Mình đọc nó theo đồng hồ cũ.")],
    anomaly: "gap",
  };
}

function tzOffsetMs(utcMs: number, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
  });
  const p: Record<string, string> = {};
  for (const part of dtf.formatToParts(new Date(utcMs))) p[part.type] = part.value;
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

function resolveIana(localMs: number, tz: string): ResolvedTime {
  let utc = localMs - tzOffsetMs(localMs, tz);
  utc = localMs - tzOffsetMs(utc, tz);
  const off = tzOffsetMs(utc, tz);
  const roundTrip = utc + off;
  const gap = roundTrip !== localMs;
  const notes: TimeNote[] = [info("Múi giờ lịch sử lấy từ cơ sở dữ liệu IANA của trình duyệt.")];
  if (gap) notes.push(check("Giờ này rơi vào lúc đồng hồ được vặn tới. Mình đã điều chỉnh về thời điểm gần nhất."));
  return { utcMs: utc, offsetSec: off / 1000, label: fmtOffset(off / 1000), notes, anomaly: gap ? "gap" : "none" };
}

export function resolveCivilTime(
  y: number, m: number, d: number, hh: number, mm: number, place: PlaceInput,
): ResolvedTime {
  const localMs = Date.UTC(y, m - 1, d, hh, mm);
  if (place.fixedOffsetMin !== undefined) {
    const offSec = place.fixedOffsetMin * 60;
    return {
      utcMs: localMs - offSec * 1000, offsetSec: offSec, label: fmtOffset(offSec),
      notes: [info("Bạn đã nhập múi giờ thủ công.")], anomaly: "none",
    };
  }
  if (place.country === "VN") {
    return resolveSegments(localMs, isNorthVN(place.lat) ? NORTH : SOUTH);
  }
  return resolveIana(localMs, place.tz ?? "UTC");
}
