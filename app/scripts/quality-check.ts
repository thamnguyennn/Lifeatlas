// Kiểm tra chất lượng văn bản trên một bộ lá số đa dạng: câu trùng, mở đầu trùng, cụm từ bị cấm, độ dài, lá số không giờ.
// Chạy:  npm run lint:reading
import { computeNatal } from "../src/engine/core.ts";
import { compose } from "../src/reading/compose.ts";

const CHARTS: [string, string, number, number][] = [
  ["1990-05-23T01:40", "Huế", 16.46, 107.59], ["1985-09-03T06:30", "Hà Nội", 21.03, 105.85], ["1972-12-25T14:05", "Sài Gòn", 10.78, 106.7],
  ["2000-02-14T22:10", "Đà Nẵng", 16.05, 108.2], ["1964-07-08T04:15", "Cần Thơ", 10.03, 105.78], ["1996-11-30T11:50", "Hải Phòng", 20.84, 106.69],
  ["1978-03-17T18:25", "Đà Lạt", 11.94, 108.44], ["2008-08-08T08:08", "Vinh", 18.67, 105.69], ["1955-01-29T23:40", "Nha Trang", 12.24, 109.19],
  ["1993-06-21T13:00", "Quy Nhơn", 13.78, 109.22], ["1981-10-10T03:20", "Huế", 16.46, 107.59], ["2015-04-04T16:45", "Hà Nội", 21.03, 105.85],
];
const BANNED = [/không phải [^.]{2,40} mà là/i, /đây là lời nhắc/i, /bạn cần học cách/i, /hai thế giới cùng phát triển/i, /hãy tin vào bản thân/i, /vũ trụ muốn/i,
  /lên tiếng/i, /mạch bạn nên dựa/i, /sáng lên rõ nhất/i, /chỗ dựa trong chuyện nghề/i, /không tự đến/i, /nền vững/i, /nền mỏng/i, /đang dạy bạn bài học/i, /mọi điều sẽ đến/i,
  /chỗ mạnh nhất/i, /chỗ cần chăm/i, /mạch nâng đỡ/i, /pha trộn/i, /undefined|NaN|\{[a-z]+\}/];
const NOW = Date.UTC(2026, 10, 19);
const sentences = (t: string) => t.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 30);

let bad = 0;
const fail = (m: string) => { bad++; console.log("  ✗", m); };
const letters = new Set<string>();
for (const [when, place, lat, lon] of CHARTS) {
  const [d, t] = when.split("T"); const [y, m, dd] = d.split("-").map(Number); const [hh, mm] = t.split(":").map(Number);
  const n = computeNatal(Date.UTC(y, m - 1, dd, hh - 7, mm), lat, lon);
  const r = compose(n, NOW, { name: "A", windowMin: 5 });
  const tag = `${when} ${place}`;
  // letter
  if (letters.has(r.letter.line)) fail(`${tag}: câu mở đầu trùng với lá số khác`);
  letters.add(r.letter.line);
  // houses
  const opens = r.houses.map((h) => (h.sections.find((x) => x.id === "summary")!.paragraphs[0] ?? "").split(" ").slice(0, 5).join(" "));
  const uniqOpen = new Set(opens).size;
  if (uniqOpen < 8) fail(`${tag}: chỉ có ${uniqOpen}/12 mở đầu nhà khác nhau`);
  const seen = new Map<string, number>();
  for (const h of r.houses) for (const s of h.sections.filter((x) => !x.fold)) for (const sent of s.paragraphs.flatMap(sentences)) { const k = sent.toLowerCase(); if (seen.has(k) && seen.get(k) !== h.n) fail(`${tag}: câu lặp ở nhà ${seen.get(k)} và ${h.n}: “${sent.slice(0, 70)}…”`); seen.set(k, h.n); }
  // banned phrases anywhere
  const text = JSON.stringify({ l: r.letter, o: r.overview.blocks.map((b) => b.paragraphs), h: r.houses.map((h) => h.sections), n: [r.nodes.axis, r.nodes.rahu, r.nodes.ketu, r.nodes.bridge], v: r.vargas!.map((v) => [v.summary, v.points]), d: r.timeline.mahas.map((m) => [m.read.paragraphs, m.antars.map((a) => a.paragraphs)]), f: r.forecast.months.map((m) => [m.central, m.areas, m.change]), e: r.explore.map((g) => g.topics.map((t) => [t.lead, t.points])) });
  for (const re of BANNED) if (re.test(text)) fail(`${tag}: có cụm bị cấm ${re}`);
  // no house numbers in the prose of the overview, the dasha chapter, the forecast or explore
  const prose = JSON.stringify({ o: r.overview.blocks.map((b) => b.paragraphs), d: r.timeline.mahas.map((m) => m.read.layers), f: r.forecast.months.map((m) => [m.central, m.areas.map((a) => a.text)]), e: r.explore.map((g) => g.topics.map((t) => [t.lead, t.points])) });
  const nums = prose.match(/\bnhà \d+\b/gi) ?? [];
  if (nums.length) fail(`${tag}: ${nums.length} số nhà trong văn xuôi (${nums.slice(0, 3).join(", ")})`);
  // every why drawer has content
  const emptyWhy = [...r.houses.map((h) => h.why), ...r.overview.blocks.map((b) => b.why), ...r.vargas!.map((v) => v.why), ...r.forecast.months.map((m) => m.why)].filter((w) => !w.length || w.some((x) => !x.trim())).length;
  if (emptyWhy) fail(`${tag}: ${emptyWhy} mục "Vì sao" rỗng hoặc có dòng trống`);
  // sentences shared between chapters
  const chap = { ov: r.overview.blocks.flatMap((b) => b.paragraphs), h: r.houses.flatMap((h) => h.sections.flatMap((x) => x.paragraphs)), v: r.vargas!.flatMap((v) => [...v.summary, ...v.points.flatMap((p) => p.paragraphs)]), d: r.timeline.mahas.flatMap((m) => m.read.paragraphs), e: r.explore.flatMap((g) => g.topics.flatMap((t) => [t.lead, ...t.points.map((p) => p.text)])) };
  const owner = new Map<string, string>();
  let cross = 0;
  for (const [k, list] of Object.entries(chap)) for (const sent of list.flatMap(sentences)) { const key = sent.toLowerCase(); const o = owner.get(key); if (o && o !== k) cross++; else owner.set(key, k); }
  if (cross > 2) fail(`${tag}: ${cross} câu lặp giữa các chương`);
  // varga overlap
  const vs = r.vargas!.flatMap((v) => v.points.flatMap((p) => p.paragraphs.flatMap(sentences)));
  const dup = vs.length - new Set(vs).size;
  if (dup > 3) fail(`${tag}: ${dup} câu trùng giữa các biểu đồ chuyên sâu`);
  console.log(`  ${tag}: câu lặp giữa chương ${cross} · mở đầu nhà ${uniqOpen}/12 · từ/nhà ${Math.min(...r.houses.map((h) => h.words))}–${Math.max(...r.houses.map((h) => h.words))} · D-chart câu trùng ${dup}`);
  // no birth time
  const b = compose(n, NOW, { name: "A", noTime: true });
  if (/\bnhà \d+\b/i.test(JSON.stringify({ o: b.overview, n: b.nodes, f: b.forecast, e: b.explore }))) fail(`${tag}: lá số không giờ nhắc số nhà`);
}
console.log(bad ? `\n${bad} vấn đề` : "\nKhông có vấn đề nào");
process.exit(bad ? 1 : 0);
