// "Dự đoán 2027": a month-by-month reading built from three things only.
//   1. a real calendar of what the sky does in the year (slow planets changing sign, turning retrograde or direct, and slow planets
//      standing exactly on a natal planet or on the rising degree), found by walking the year day by day with the ephemeris;
//   2. the natal chart (D1): which house each transiting planet falls in and how that house stands in the chart;
//   3. the Vimshottari period running in the month.
// No sentence here is a prediction of an event; each says where the weight falls and how to meet it.
import { SIGNS, type GrahaId } from "../engine/constants.ts";
import { dashaChain, dashaOrigin } from "../engine/dasha5.ts";
import { transitAt, GOCHAR_GOOD, type Transit } from "../engine/transit.ts";
import type { Ctx } from "./ctx.ts";
import type { Tone } from "./shared.ts";
import { HOUSE_TAG } from "./content/houses-signs.ts";
import { CHAPTER } from "./content/chapters.ts";
import { nameOf, ddmmyyyy, joinVi, lowerFirst } from "./util.ts";

export interface ForecastEvent { ms: number; date: string; kind: "ingress" | "retro" | "direct" | "hit"; planet: GrahaId; title: string; text: string }
export interface ForecastMonth {
  month: number;
  label: string;
  /** The area of life the month lights up. */
  focus: string;
  tone: Tone;
  headline: string;
  paragraphs: string[];
  events: ForecastEvent[];
  why: string[];
}
export interface Forecast {
  year: number;
  intro: string[];
  key: ForecastEvent[];
  months: ForecastMonth[];
  trustNote: string;
}

const DAY = 86_400_000;
const YEAR = 2027;
const SLOW: GrahaId[] = ["jupiter", "saturn", "rahu", "ketu", "mars"];
const HIT_PLANETS: GrahaId[] = ["jupiter", "saturn", "rahu", "ketu"];
const NATAL_NAME = (id: GrahaId | "lagna") => (id === "lagna" ? "cung mọc" : nameOf(id));

const MEANING: Record<string, string> = {
  jupiter: "mở ra cơ hội, sự hiểu biết và người đỡ đầu",
  saturn: "đòi sự kỷ luật, kiên nhẫn và trách nhiệm",
  rahu: "kéo bạn về phía điều mới lạ và khát vọng lớn hơn",
  ketu: "gọi bạn bớt bám víu và quay về điều thật sự cần",
  mars: "tiếp thêm sức bật nhưng cũng dễ làm nóng chuyện",
};

function calendar(ctx: Ctx): ForecastEvent[] {
  const out: ForecastEvent[] = [];
  const start = Date.UTC(YEAR, 0, 1) - 7 * 3600_000, step = DAY;
  let prev: Transit | null = null;
  const runs = new Map<string, { ms: number; orb: number; kind: string }>();
  const flush = (k: string, r: { ms: number; orb: number; kind: string }) => {
    const [t, nat] = k.split("|") as [GrahaId, GrahaId | "lagna"];
    if (r.orb > 1.5) return;
    out.push({
      ms: r.ms, date: ddmmyyyy(r.ms), kind: "hit", planet: t,
      title: `${nameOf(t)} ${r.kind === "trùng" ? "trùng" : "đối"} ${NATAL_NAME(nat)}`,
      text: `${nameOf(t)} ${r.kind === "trùng" ? "đứng đúng trên" : "đứng đối diện"} ${nat === "lagna" ? "điểm mọc" : `${nameOf(nat)} lúc bạn sinh`}; ${MEANING[t]}. Chạm này là chỗ nhấn của vài tuần quanh ngày ấy.`,
    });
  };
  for (let ms = start; ms < Date.UTC(YEAR + 1, 0, 1); ms += step) {
    const t = transitAt(ctx.n, ms);
    if (prev) {
      for (const id of SLOW) {
        const a = prev.grahas[id], b = t.grahas[id];
        if (a.sign !== b.sign) {
          const hLagna = ctx.noTime ? null : b.fromLagna;
          out.push({
            ms, date: ddmmyyyy(ms), kind: "ingress", planet: id, title: `${nameOf(id)} sang ${SIGNS[b.sign]}`,
            text: `${nameOf(id)} chuyển sang ${SIGNS[b.sign]}${hLagna ? `, rơi vào nhà ${hLagna} (${HOUSE_TAG[hLagna - 1]})` : `, cung thứ ${b.fromMoon} tính từ Mặt Trăng của bạn`}; ${MEANING[id]} ở mảng này trong thời gian ở đó.`,
          });
        }
        if (id !== "rahu" && id !== "ketu" && a.retro !== b.retro) {
          out.push({
            ms, date: ddmmyyyy(ms), kind: b.retro ? "retro" : "direct", planet: id,
            title: `${nameOf(id)} ${b.retro ? "bắt đầu đi lùi" : "đi thẳng trở lại"}`,
            text: b.retro ? `${nameOf(id)} bắt đầu đi lùi ở ${SIGNS[b.sign]}: những việc thuộc về nó nên được xem lại, sửa và hoàn thiện hơn là khởi sự mới.` : `${nameOf(id)} đi thẳng trở lại ở ${SIGNS[b.sign]}: những việc từng chậm lại bắt đầu có đà trở lại.`,
          });
        }
      }
    }
    const seen = new Set<string>();
    for (const h of t.hits) {
      if (!HIT_PLANETS.includes(h.transit)) continue;
      const k = `${h.transit}|${h.natal}`; seen.add(k);
      const r = runs.get(k);
      if (!r) runs.set(k, { ms, orb: h.orb, kind: h.kind });
      else if (h.orb < r.orb) { r.ms = ms; r.orb = h.orb; }
    }
    for (const [k, r] of [...runs]) if (!seen.has(k)) { flush(k, r); runs.delete(k); }
    prev = t;
  }
  for (const [k, r] of runs) flush(k, r);
  return out.sort((a, b) => a.ms - b.ms);
}

const TONE_WORD: Record<Tone, string> = { good: "vốn là chỗ thuận của lá số", mixed: "vốn là chỗ có thuận có khó của lá số", hard: "vốn là chỗ cần chăm của lá số" };
const MONTH_NAMES = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

const OPEN = [
  (f: string, w: string) => `Sức nặng của tháng này rơi vào ${f}, ${w}.`,
  (f: string, w: string) => `Mặt Trời soi vào ${f} trong tháng này, ${w}.`,
  (f: string, w: string) => `Tháng này mọi chú ý dồn về ${f}, ${w}.`,
];

export function readForecast(ctx: Ctx): Forecast {
  const n = ctx.n, noTime = ctx.noTime;
  const origin = dashaOrigin(n.grahas.moon.lon, n.utcMs);
  const events = calendar(ctx);
  const months: ForecastMonth[] = [];
  let prevPath = "";
  for (let m = 0; m < 12; m++) {
    const from = Date.UTC(YEAR, m, 1) - 7 * 3600_000, to = Date.UTC(YEAR, m + 1, 1) - 7 * 3600_000, mid = from + 15 * DAY;
    const t = transitAt(n, mid);
    const chain = dashaChain(origin, mid), maha = chain[0], antar = chain[1];
    const evs = events.filter((e) => e.ms >= from && e.ms < to);
    const sun = t.grahas.sun, jup = t.grahas.jupiter, sat = t.grahas.saturn, mars = t.grahas.mars;
    const hSun = noTime ? null : sun.fromLagna;
    const tone: Tone = hSun ? ctx.tones[hSun - 1] : GOCHAR_GOOD.sun.includes(sun.fromMoon) ? "good" : "mixed";
    const focus = hSun ? HOUSE_TAG[hSun - 1] : `cung thứ ${sun.fromMoon} tính từ Mặt Trăng của bạn`;
    const o = OPEN[(m + (hSun ?? sun.fromMoon)) % OPEN.length](focus, hSun ? TONE_WORD[tone] : GOCHAR_GOOD.sun.includes(sun.fromMoon) ? "một vị trí được cổ điển xem là thuận" : "một vị trí cần tiết chế hơn");
    const path = `${maha.lord}>${antar.lord}`;
    const same = path === prevPath; prevPath = path;
    const dasha = same ? `Đại vận ${nameOf(maha.lord)} và tiểu vận ${nameOf(antar.lord)} vẫn đang chạy.` : `Bạn đang ở giai đoạn “${CHAPTER[maha.lord].title}” (đại vận ${nameOf(maha.lord)}), tiểu vận ${nameOf(antar.lord)}: ${lowerFirst(CHAPTER[antar.lord].title)} là nhịp bên trong.`;
    const jh = noTime ? jup.fromMoon : jup.fromLagna, sh = noTime ? sat.fromMoon : sat.fromLagna;
    const backdrop = `Phía sau là hai hành tinh lớn: Sao Mộc ${jup.support === "khó" ? "đang ở vị trí khó nâng đỡ" : "đang nâng đỡ"} ${noTime ? `ở cung thứ ${jh} tính từ Mặt Trăng` : `ở nhà ${jh} (${HOUSE_TAG[jh - 1]})`}, Sao Thổ ${sat.support === "khó" ? "đang đòi nhiều ở" : "đang kỷ luật ở"} ${noTime ? `cung thứ ${sh}` : `nhà ${sh} (${HOUSE_TAG[sh - 1]})`}${sat.retro ? " và đang đi lùi" : ""}.`;
    const ev = evs.length ? `Trong tháng có ${joinVi(evs.map((e) => `${e.title} (${e.date.slice(0, 5)})`))}.` : "Tháng này bầu trời khá yên: không có hành tinh chậm nào đổi cung hay đổi chiều.";
    const good = (jup.support !== "khó" ? 1 : 0) + (sat.support !== "khó" ? 1 : 0) + (tone === "good" ? 1 : 0) - (tone === "hard" ? 1 : 0);
    const advice = good >= 2 ? "Tháng thuận để bắt tay vào việc đã cân nhắc kỹ: ít cản trở hơn bình thường." : good <= 0 ? "Tháng nên đi chậm: ưu tiên giữ nhịp, hoàn tất việc dang dở và tránh quyết định lớn vội vàng." : "Tháng có thuận có khó: chọn một việc quan trọng nhất và làm cho xong trước khi mở thêm việc mới.";
    months.push({
      month: m + 1, label: MONTH_NAMES[m], focus, tone, headline: focus.charAt(0).toUpperCase() + focus.slice(1),
      paragraphs: [`${o} ${dasha}`, `${backdrop} ${ev}`, advice], events: evs,
      why: [
        `Mặt Trời ở ${SIGNS[sun.sign]}${noTime ? "" : `, nhà ${sun.fromLagna}`}, cung thứ ${sun.fromMoon} tính từ Mặt Trăng.`,
        `Sao Mộc ở ${SIGNS[jup.sign]} (nhà ${noTime ? "?" : jup.fromLagna}, từ Mặt Trăng ${jup.fromMoon}, nâng đỡ: ${jup.support}${jup.bindus !== null ? `, ${jup.bindus}/8 điểm` : ""}).`,
        `Sao Thổ ở ${SIGNS[sat.sign]} (nhà ${noTime ? "?" : sat.fromLagna}, từ Mặt Trăng ${sat.fromMoon}, nâng đỡ: ${sat.support}${sat.bindus !== null ? `, ${sat.bindus}/8 điểm` : ""}).`,
        `Sao Hỏa ở ${SIGNS[mars.sign]}, nhà ${noTime ? "?" : mars.fromLagna}.`,
        `Vimshottari giữa tháng: ${chain.slice(0, 3).map((c) => nameOf(c.lord)).join(" › ")}.`,
      ],
    });
  }
  const key = events.filter((e) => e.kind !== "hit" || e.planet === "jupiter" || e.planet === "saturn").filter((e) => e.planet !== "mars").slice(0, 8);
  return {
    year: YEAR,
    intro: [
      "Phần này đi theo từng tháng của năm 2027 và chỉ dựa trên ba thứ: lịch bầu trời thật của năm (hành tinh chậm đổi cung, đổi chiều, chạm vào điểm quan trọng của lá số), lá số gốc của bạn, và đại vận tiểu vận đang chạy.",
      "Mình không đoán sự kiện cụ thể. Mỗi tháng cho biết nặng nhẹ rơi vào đâu và nên đi nhịp nào; những con số nằm trong mục “Vì sao mình nói điều này?”.",
    ],
    key,
    months,
    trustNote: noTime
      ? "Chưa có giờ sinh nên mình tính các mảng đời theo Mặt Trăng của bạn thay vì cung mọc."
      : ctx.windowMin > 15
        ? "Giờ sinh còn sai số khá lớn nên ranh giới giữa các tiểu vận và vài mốc đổi cung có thể lệch vài tuần; hãy đọc các tháng như xu hướng."
        : "Với sai số giờ sinh bạn chọn, các mốc đổi cung của hành tinh chậm gần như không đổi; ranh giới tiểu vận có thể lệch vài ngày.",
  };
}
