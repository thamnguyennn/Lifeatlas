// "Dự báo năm 2027", month by month. Fixed method:
//   • ephemeris: caelus, sidereal Lahiri, true node for Rahu/Ketu; dates are given in Vietnam time (UTC+7);
//   • a real event calendar for the whole year, found by walking it day by day: every planet changing sign, every planet turning
//     retrograde or direct, slow planets standing exactly on (or opposite) a natal planet or the rising degree, solar and lunar
//     eclipses (new/full moon within the node limits), Vimshottari sub-periods that begin inside the month, and the days the Moon
//     crosses the 8th sign from the natal Moon (Chandrashtama);
//   • Gochara counted both from the rising sign (which area of life) and from the Moon (how it feels), with Ashtakavarga bindus
//     and the classical Vedha pairs (Phaladeepika) that cancel a favourable transit;
//   • a month is read from the transits *through* the month (start, middle, end), not from one day.
// The areas a month talks about are the two or three houses that carry the most weight that month; a month never has to say
// something about every part of life. No date is called lucky or dangerous.
import { SIGNS, mod, type GrahaId } from "../engine/constants.ts";
import { dashaChain, dashaChildren, dashaMahas, dashaOrigin, type DNode } from "../engine/dasha5.ts";
import { transitAt, GOCHAR_GOOD, type Transit } from "../engine/transit.ts";
import { skyAt } from "../engine/sky.ts";
import { aspectOffsets } from "../engine/rules.ts";
import type { Ctx } from "./ctx.ts";
import type { Tone } from "./shared.ts";
import { HOUSE_TAG } from "./content/houses-signs.ts";
import { CHAPTER } from "./content/chapters.ts";
import { nameOf, ddmmyyyy, joinVi } from "./util.ts";

export type EventKind = "ingress" | "retro" | "direct" | "hit" | "eclipse" | "dasha" | "moon8";
export interface ForecastEvent { ms: number; date: string; kind: EventKind; planet: GrahaId | null; title: string; text: string }
export interface ForecastArea { house: number; title: string; tone: Tone; text: string }
export interface ForecastMonth {
  month: number;
  label: string;
  headline: string;
  /** The central statement. */
  central: string;
  areas: ForecastArea[];
  events: ForecastEvent[];
  /** What is new compared with the month before. */
  change: string[];
  tone: Tone;
  focus: string;
  /** Kept for the text export: central + areas + change. */
  paragraphs: string[];
  why: string[];
}
export interface Forecast { year: number; intro: string[]; key: ForecastEvent[]; months: ForecastMonth[]; method: string[]; trustNote: string }

const DAY = 86_400_000, VN = 7 * 3600_000, YEAR = 2027;
const ALL: GrahaId[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"];
const MOVERS: GrahaId[] = ["sun", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"];
const SLOW: GrahaId[] = ["jupiter", "saturn", "rahu", "ketu"];
const WEIGHT: Record<GrahaId, number> = { jupiter: 3, saturn: 3, rahu: 2, ketu: 1.6, mars: 1.4, sun: 1, venus: 0.9, mercury: 0.8, moon: 0 };
const NATAL_NAME = (id: GrahaId | "lagna") => (id === "lagna" ? "điểm mọc" : nameOf(id));
const area = (h: number) => HOUSE_TAG[h - 1];

const MEANING: Record<GrahaId, string> = {
  jupiter: "mở ra cơ hội, hiểu biết và người nâng đỡ", saturn: "đòi kỷ luật, kiên nhẫn và trách nhiệm", rahu: "kéo về phía điều mới và khát vọng lớn hơn",
  ketu: "đẩy bạn bớt bám víu và chọn lọc lại", mars: "tiếp sức bật nhưng cũng dễ làm nóng chuyện", sun: "đưa chuyện ấy ra ánh sáng, cần bạn có mặt",
  venus: "làm mềm và dễ chịu hơn", mercury: "đưa nhiều trao đổi, giấy tờ và tính toán", moon: "",
};

/** Vedha (Phaladeepika): good house from the Moon → the house whose occupant cancels it. */
const VEDHA: Record<GrahaId, Record<number, number>> = {
  sun: { 3: 9, 6: 12, 10: 4, 11: 5 }, moon: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 }, mars: { 3: 12, 6: 9, 11: 5 },
  mercury: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 8, 11: 12 }, jupiter: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 },
  venus: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 }, saturn: { 3: 12, 6: 9, 11: 5 }, rahu: { 3: 12, 6: 9, 11: 5 }, ketu: { 3: 12, 6: 9, 11: 5 },
};
const NO_VEDHA = (a: GrahaId, b: GrahaId) => (a === "sun" && b === "saturn") || (a === "saturn" && b === "sun") || (a === "moon" && b === "mercury") || (a === "mercury" && b === "moon");

export function vedhaBy(t: Transit, id: GrahaId): GrahaId | null {
  const h = t.grahas[id].fromMoon;
  const v = VEDHA[id][h];
  if (!v) return null;
  return ALL.find((o) => o !== id && !NO_VEDHA(id, o) && !((id === "rahu" && o === "ketu") || (id === "ketu" && o === "rahu")) && t.grahas[o].fromMoon === v) ?? null;
}

/** Narrow a change found between two daily samples down to about ten minutes. */
function refine(a: number, b: number, changed: (ms: number) => boolean): number {
  for (let i = 0; i < 8; i++) { const m = (a + b) / 2; if (changed(m)) b = m; else a = m; }
  return b;
}
const gl = (ms: number, id: GrahaId) => skyAt(ms).grahas.find((g) => g.id === id)!;

const angDist = (a: number, b: number) => { const d = mod(a - b, 360); return d > 180 ? 360 - d : d; };

// ------------------------------------------------------------------ the calendar

export function yearCalendar(ctx: Ctx, year = YEAR): ForecastEvent[] {
  const n = ctx.n, out: ForecastEvent[] = [];
  const start = Date.UTC(year, 0, 1) - VN, end = Date.UTC(year + 1, 0, 1) - VN;
  let prev: Transit | null = null;
  const runs = new Map<string, { ms: number; orb: number; kind: string }>();
  const moon8 = mod(n.grahas.moon.sign + 7, 12);
  let in8 = false;
  const flush = (k: string, r: { ms: number; orb: number; kind: string }) => {
    const [t, nat] = k.split("|") as [GrahaId, GrahaId | "lagna"];
    if (r.orb > 1.5 || (nat === "lagna" && ctx.noTime)) return;
    out.push({ ms: r.ms, date: ddmmyyyy(r.ms), kind: "hit", planet: t, title: `${nameOf(t)} ${r.kind === "trùng" ? "đi qua" : "đối diện"} ${NATAL_NAME(nat)} gốc`,
      text: `${nameOf(t)} ${r.kind === "trùng" ? "đi qua đúng vị trí" : "đứng đối diện vị trí"} của ${nat === "lagna" ? "điểm mọc" : `${nameOf(nat)} lúc bạn sinh`} (sai lệch ${r.orb.toFixed(1)}°); nó ${MEANING[t]}, và những tuần quanh ngày này là lúc điều đó rõ nhất.` });
  };
  for (let ms = start; ms < end; ms += DAY) {
    const t = transitAt(n, ms);
    if (prev) {
      for (const id of MOVERS) {
        const a = prev.grahas[id], b = t.grahas[id];
        if (a.sign !== b.sign && !(id === "ketu")) {
          const h = ctx.noTime ? null : b.fromLagna;
          const at = refine(ms - DAY, ms, (x) => gl(x, id).sign !== a.sign);
          out.push({ ms: at, date: ddmmyyyy(at), kind: "ingress", planet: id, title: `${nameOf(id)} sang ${SIGNS[b.sign]}`,
            text: `${nameOf(id)} chuyển sang ${SIGNS[b.sign]}${id === "rahu" ? ` (Ketu sang ${SIGNS[t.grahas.ketu.sign]})` : ""}${h ? `, đi vào vùng ${area(h)} của lá số` : ""}, cung thứ ${b.fromMoon} tính từ Mặt Trăng của bạn.` });
        }
        if (id !== "rahu" && id !== "ketu" && id !== "sun" && a.retro !== b.retro)
          { const at = refine(ms - DAY, ms, (x) => gl(x, id).retro !== a.retro);
          out.push({ ms: at, date: ddmmyyyy(at), kind: b.retro ? "retro" : "direct", planet: id, title: `${nameOf(id)} ${b.retro ? "bắt đầu đi lùi" : "đi thẳng trở lại"}`,
            text: b.retro ? `${nameOf(id)} bắt đầu đi lùi ở ${SIGNS[b.sign]}: việc thuộc về nó hợp để xem lại, sửa, hoàn thiện hơn là khởi sự mới.` : `${nameOf(id)} đi thẳng trở lại ở ${SIGNS[b.sign]}: việc từng chậm lại bắt đầu có đà.` }); }
      }
      // eclipses: new or full moon close to the nodes
      const e0 = mod(prev.grahas.moon.lon - prev.grahas.sun.lon, 360), e1 = mod(t.grahas.moon.lon - t.grahas.sun.lon, 360);
      const newMoon = e1 < e0, fullMoon = e0 < 180 && e1 >= 180;
      if (newMoon || fullMoon) {
        const node = angDist(t.grahas.sun.lon, t.grahas.rahu.lon), near = Math.min(node, 180 - node);
        if ((newMoon && near < 17) || (fullMoon && near < 17)) {
          const el = (x: number) => { const k = skyAt(x); return mod(k.grahas.find((g) => g.id === "moon")!.lon - k.grahas.find((g) => g.id === "sun")!.lon, 360); };
          const at = refine(ms - DAY, ms, (x) => newMoon ? el(x) < 180 : el(x) >= 180);
          const sky = skyAt(at), mo = sky.grahas.find((g) => g.id === "moon")!;
          const sign = mo.sign, h = ctx.noTime ? null : mod(sign - n.lagna.sign, 12) + 1;
          const penumbral = fullMoon && near >= 11.5;
          out.push({ ms: at, date: ddmmyyyy(at), kind: "eclipse", planet: null, title: newMoon ? `Nhật thực ở ${SIGNS[sky.grahas.find((g) => g.id === "sun")!.sign]}` : `Nguyệt thực${penumbral ? " nửa tối" : ""} ở ${SIGNS[sign]}`,
            text: `${newMoon ? "Nhật thực" : "Nguyệt thực"} rơi vào ${h ? `vùng ${area(h)}` : `cung thứ ${mod(sign - n.grahas.moon.sign, 12) + 1} tính từ Mặt Trăng`}. Truyền thống xem thực là lúc nên bớt khởi sự việc lớn và quan sát nhiều hơn; ảnh hưởng rõ hơn khi nó chạm cung của Mặt Trăng hay cung mọc.` });
        }
      }
    }
    // Chandrashtama: Moon in the 8th sign from the natal Moon
    const now8 = t.grahas.moon.sign === moon8;
    if (now8 && !in8) out.push({ ms, date: ddmmyyyy(ms), kind: "moon8", planet: "moon", title: "Mặt Trăng qua cung thứ 8 từ Mặt Trăng gốc", text: "Khoảng hai ngày rưỡi tâm trạng dễ chùng và dễ mệt; hợp để làm chậm, tránh tranh cãi và quyết định vội." });
    in8 = now8;
    const seen = new Set<string>();
    for (const h of t.hits) {
      if (!SLOW.includes(h.transit)) continue;
      const k = `${h.transit}|${h.natal}`; seen.add(k);
      const r = runs.get(k);
      if (!r) runs.set(k, { ms, orb: h.orb, kind: h.kind }); else if (h.orb < r.orb) { r.ms = ms; r.orb = h.orb; }
    }
    for (const [k, r] of [...runs]) if (!seen.has(k)) { flush(k, r); runs.delete(k); }
    prev = t;
  }
  for (const [k, r] of runs) flush(k, r);
  // sub-periods (Antardasha) starting inside the year
  const origin = dashaOrigin(n.grahas.moon.lon, n.utcMs);
  for (const m of dashaMahas(origin, 12)) {
    if (m.endMs < start || m.startMs > end) continue;
    if (m.startMs >= start) out.push({ ms: m.startMs, date: ddmmyyyy(m.startMs), kind: "dasha", planet: m.lord, title: `Bắt đầu đại vận ${nameOf(m.lord)}`, text: `Một giai đoạn lớn mới bắt đầu: “${CHAPTER[m.lord].title}”.` });
    for (const a of dashaChildren(m)) if (a.startMs >= start && a.startMs < end && a.startMs !== m.startMs)
      out.push({ ms: a.startMs, date: ddmmyyyy(a.startMs), kind: "dasha", planet: a.lord, title: `Bắt đầu tiểu vận ${nameOf(a.lord)}`, text: `Trong đại vận ${nameOf(m.lord)}, tiểu vận ${nameOf(a.lord)} bắt đầu.` });
  }
  return out.sort((a, b) => a.ms - b.ms);
}

// ------------------------------------------------------------------ one month

interface Look { t: Transit; ms: number }

function houseFrom(ctx: Ctx, t: Transit, id: GrahaId) { return ctx.noTime ? t.grahas[id].fromMoon : t.grahas[id].fromLagna; }

function monthAreas(ctx: Ctx, looks: Look[], chain: DNode[]): { scores: number[]; notes: Map<number, { plus: string[]; minus: string[]; who: GrahaId[] }> } {
  const scores = Array(12).fill(0) as number[];
  const notes = new Map<number, { plus: string[]; minus: string[]; who: GrahaId[] }>();
  const note = (h: number) => { if (!notes.has(h)) notes.set(h, { plus: [], minus: [], who: [] }); return notes.get(h)!; };
  const mid = looks[1].t;
  for (const id of MOVERS) {
    const hs = [...new Set(looks.map((l) => houseFrom(ctx, l.t, id)))];
    for (const h of hs) {
      scores[h - 1] += WEIGHT[id] / hs.length;
      const g = mid.grahas[id], N = note(h);
      if (!N.who.includes(id)) N.who.push(id);
      const good = GOCHAR_GOOD[id].includes(g.fromMoon), v = good ? vedhaBy(mid, id) : null;
      if (houseFrom(ctx, mid, id) !== h) continue;
      if (good && !v) N.plus.push(`${nameOf(id)} ${MEANING[id]}${g.bindus !== null && g.bindus >= 5 ? ", và vị trí này được nhiều điểm hỗ trợ trong lá số của bạn" : ""}`);
      else if (good && v) N.minus.push(`${nameOf(id)} lẽ ra thuận nhưng bị ${nameOf(v)} chắn (Vedha), nên kết quả không trọn`);
      else if (["jupiter", "venus", "mercury"].includes(id)) N.plus.push(`${nameOf(id)} ${MEANING[id]}, dù tính từ Mặt Trăng đây không phải vị trí mạnh nhất của nó`);
      else N.minus.push(`${nameOf(id)} ${MEANING[id]}${g.bindus !== null && g.bindus <= 3 ? ", và vị trí này ít điểm hỗ trợ trong lá số của bạn" : ""}`);
    }
  }
  // the full aspects of the slow planets also put weight on a house
  for (const id of ["jupiter", "saturn", "mars"] as GrahaId[]) {
    const from = houseFrom(ctx, mid, id);
    for (const off of aspectOffsets(id)) { if (off === 7 || off === 1) { /* 7th is counted for all */ } const h = mod(from + off - 2, 12) + 1; scores[h - 1] += WEIGHT[id] * 0.35; }
  }
  // the houses the running lords rule and occupy
  if (!ctx.noTime) for (const [k, node] of chain.slice(0, 2).entries()) {
    const n = ctx.n, owned = n.houses.filter((h) => h.lord === node.lord).map((h) => h.n), pos = n.grahas[node.lord].house;
    for (const h of [...owned, pos]) scores[h - 1] += k === 0 ? 1.2 : 1.6;
  }
  return { scores, notes };
}

const MONTHS = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function readForecast(ctx: Ctx): Forecast {
  const n = ctx.n, noTime = ctx.noTime;
  const origin = dashaOrigin(n.grahas.moon.lon, n.utcMs);
  const cal = yearCalendar(ctx);
  const months: ForecastMonth[] = [];
  let prevSigns: Record<string, number> | null = null, prevAntar: GrahaId | null = null, prevTop: number[] = [];
  for (let m = 0; m < 12; m++) {
    const from = Date.UTC(YEAR, m, 1) - VN, to = Date.UTC(YEAR, m + 1, 1) - VN;
    const looks: Look[] = [from + 2 * DAY, from + 15 * DAY, to - 3 * DAY].map((ms) => ({ ms, t: transitAt(n, ms) }));
    const mid = looks[1].t;
    const chain = dashaChain(origin, looks[1].ms), maha = chain[0], antar = chain[1];
    const evs = cal.filter((e) => e.ms >= from && e.ms < to);
    const { scores, notes } = monthAreas(ctx, looks, chain);
    const top = scores.map((s, i) => ({ h: i + 1, s })).sort((a, b) => b.s - a.s).filter((x) => notes.get(x.h)?.plus.length || notes.get(x.h)?.minus.length).slice(0, 3)
      .filter((x, i, a) => i === 0 || x.s >= a[0].s * 0.55);
    const areas: ForecastArea[] = top.map(({ h }) => {
      const N = notes.get(h)!;
      const tone: Tone = N.plus.length > N.minus.length ? "good" : N.minus.length > N.plus.length ? "hard" : "mixed";
      const title = noTime ? `Cung thứ ${h} tính từ Mặt Trăng` : cap(area(h));
      const bits = [...N.plus.slice(0, 2), ...N.minus.slice(0, 2)];
      const text = `${cap(bits[0])}${bits[1] ? `; ${bits.slice(1).join("; ")}` : ""}. ${({ good: ["Đây là mảng dễ tiến triển trong tháng.", "Việc ở mảng này dễ trôi hơn thường lệ.", "Tháng này hợp để đẩy mảng này đi tiếp."], hard: ["Mảng này nên đi chậm và chuẩn bị kỹ.", "Ở mảng này, giữ nhịp quan trọng hơn mở rộng.", "Mảng này cần thêm thời gian và sự kiên nhẫn trong tháng."], mixed: ["Mảng này có cả lực đẩy lẫn lực cản, nên làm từng phần một.", "Ở mảng này, thuận và khó đan xen; chọn việc chính trước.", "Mảng này tiến được nếu bạn không ôm quá nhiều cùng lúc."] } as Record<Tone, string[]>)[tone][(h + m) % 3]}`;
      return { house: h, title, tone, text };
    });
    // the central statement: the strongest new thing of the month
    const dashaEv = evs.find((e) => e.kind === "dasha");
    const ecl = evs.find((e) => e.kind === "eclipse");
    const slowIn = evs.find((e) => e.kind === "ingress" && e.planet && SLOW.includes(e.planet));
    const hit = evs.find((e) => e.kind === "hit");
    const lead = areas[0];
    let central: string;
    if (dashaEv) central = `${dashaEv.title} ngày ${dashaEv.date.slice(0, 5)} là thay đổi lớn nhất của tháng: nhịp bên trong của giai đoạn đổi theo ${nameOf(dashaEv.planet!)}, nên những gì nổi lên trong tháng nên được đọc như phần mở đầu của chặng mới.`;
    else if (slowIn) central = `${slowIn.title} (${slowIn.date.slice(0, 5)}) đổi nền của nhiều tháng tới${noTime ? "" : `: trọng tâm dịch về chuyện ${area(houseFrom(ctx, looks[2].t, slowIn.planet!))}`}.`;
    else if (hit) central = `Điểm nhấn của tháng là lúc ${hit.title.toLowerCase()} (quanh ${hit.date.slice(0, 5)}); ${hit.text.split("; nó ")[1] ?? ""}`.replace(/; $/, ".");
    else if (ecl) central = `${ecl.title} (${ecl.date.slice(0, 5)}) là mốc cần để ý; phần còn lại của tháng ${lead ? `xoay quanh chuyện ${noTime ? lead.title.toLowerCase() : area(lead.house)}` : "khá yên"}.`;
    else if (lead) central = `Tháng này sức nặng dồn về chuyện ${noTime ? lead.title.toLowerCase() : area(lead.house)}, ${lead.tone === "good" ? "với nhiều điều kiện thuận" : lead.tone === "hard" ? "với nhiều đòi hỏi hơn là thuận lợi" : "vừa có lực đẩy vừa có lực cản"}.`;
    else central = "Tháng này bầu trời không có thay đổi lớn nào chạm vào lá số của bạn; một tháng hợp để giữ nhịp.";
    // what changed since last month
    const signs: Record<string, number> = {}; for (const id of MOVERS) signs[id] = mid.grahas[id].sign;
    const change: string[] = [];
    if (prevSigns) {
      for (const id of ["jupiter", "saturn", "rahu", "mars", "venus", "mercury"] as GrahaId[]) if (signs[id] !== prevSigns[id]) change.push(`${nameOf(id)} đã sang ${SIGNS[signs[id]]}${noTime ? "" : ` (vùng ${area(mid.grahas[id].fromLagna)})`}.`);
      if (prevAntar && antar.lord !== prevAntar) change.push(`Tiểu vận đã đổi sang ${nameOf(antar.lord)}.`);
      const newTop = areas.map((a) => a.house).filter((h) => !prevTop.includes(h));
      if (newTop.length && !noTime) change.push(`Mảng mới được chú ý: ${joinVi(newTop.map(area))}.`);
      if (!change.length) change.push("Không có thay đổi lớn so với tháng trước; các xu hướng của tháng trước vẫn tiếp tục.");
    }
    prevSigns = signs; prevAntar = antar.lord; prevTop = areas.map((a) => a.house);
    const tone: Tone = areas[0]?.tone ?? "mixed";
    const topH = areas.map((a) => a.house);
    const lords = chain.slice(0, 2).map((c) => c.lord);
    const keyEvents = evs.filter((e) => {
      if (e.kind === "moon8") return evs.filter((x) => x.kind === "moon8").indexOf(e) === 0;
      if (e.kind === "ingress" && e.planet && ["sun", "mercury", "venus"].includes(e.planet)) {
        const t = transitAt(n, e.ms + 3600_000);
        return lords.includes(e.planet) || t.grahas[e.planet].fromMoon === 1 || (!noTime && (t.grahas[e.planet].fromLagna === 1 || topH.includes(t.grahas[e.planet].fromLagna)));
      }
      return true;
    });
    months.push({
      month: m + 1, label: MONTHS[m], headline: lead ? (noTime ? lead.title : cap(area(lead.house))) : "Một tháng yên", central, areas, events: keyEvents, change, tone,
      focus: lead ? lead.title : "",
      paragraphs: [central, ...areas.map((a) => `${a.title}: ${a.text}`), ...change],
      why: [
        `Vimshottari giữa tháng: đại vận ${nameOf(maha.lord)}, tiểu vận ${nameOf(antar.lord)}, ${chain[2] ? `tiểu-tiểu vận ${nameOf(chain[2].lord)}` : ""}.`,
        ...ALL.map((id) => { const g = mid.grahas[id]; const v = GOCHAR_GOOD[id].includes(g.fromMoon) ? vedhaBy(mid, id) : null; return `${nameOf(id)}: ${SIGNS[g.sign]} ${g.deg.toFixed(0)}°${g.retro && id !== "rahu" && id !== "ketu" ? " (lùi)" : ""}, ${noTime ? "" : `nhà ${g.fromLagna} từ cung mọc, `}cung ${g.fromMoon} từ Mặt Trăng, ${g.support}${g.bindus !== null ? `, BAV ${g.bindus}/8` : ""}${v ? `, bị ${nameOf(v)} Vedha` : ""}.`; }),
        `Trọng lượng các nhà trong tháng: ${scores.map((s, i) => `${i + 1}:${s.toFixed(1)}`).join(" ")}.`,
        "Vị trí đọc ở ngày 3, 16 và ngày cuối tháng; trọng lượng gồm hành tinh đi qua, góc chiếu đầy đủ của Mộc, Thổ, Hỏa và các nhà của chủ đại vận, tiểu vận.",
      ].filter(Boolean),
    });
  }
  const key = cal.filter((e) => (e.kind === "ingress" && e.planet && (SLOW.includes(e.planet) || e.planet === "mars")) || e.kind === "eclipse" || e.kind === "dasha" || (e.kind === "hit") || ((e.kind === "retro" || e.kind === "direct") && e.planet && ["jupiter", "saturn", "mercury", "venus", "mars"].includes(e.planet)));
  return {
    year: YEAR,
    intro: [
      "Mỗi tháng được tính từ lịch bầu trời thật của năm 2027 đặt lên lá số của bạn và đại vận, tiểu vận đang chạy. Mình chỉ nói về những mảng thật sự được nhấn mạnh trong tháng ấy, nên có tháng chỉ có một hai mảng.",
      "Không có ngày nào được gọi là may hay rủi. Các mốc là những thay đổi thiên văn có thật; con số nằm trong mục “Vì sao mình nói điều này?”.",
    ],
    key, months,
    method: [
      "Ephemeris caelus, hoàng đạo sidereal Lahiri, Rahu/Ketu theo nút thật (true node); ngày giờ theo giờ Việt Nam (UTC+7).",
      "Gochara tính từ cung mọc (mảng đời) và từ Mặt Trăng (cảm nhận), có điểm Ashtakavarga (BAV) và Vedha theo Phaladeepika.",
      "Nhật thực/nguyệt thực: trăng non cách nút dưới 17°, trăng tròn cách nút dưới 11,5°.",
      "Chạm điểm gốc: Mộc, Thổ, Rahu, Ketu trùng hoặc đối hành tinh gốc/điểm mọc trong 1,5°.",
    ],
    trustNote: noTime ? "Chưa có giờ sinh nên mình tính các mảng đời theo Mặt Trăng của bạn thay vì cung mọc." : "",
  };
}
