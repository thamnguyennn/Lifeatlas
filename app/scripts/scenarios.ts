// Finds real charts for each test situation the brief asks for, reads them fully and checks the output.
// Writes docs/TEST_SCENARIOS.md.   node --experimental-strip-types --no-warnings scripts/scenarios.ts
import { writeFileSync } from "node:fs";
import { computeNatal } from "../src/engine/core.ts";
import { compose, makeCtx } from "../src/reading/compose.ts";
import { buildFacts } from "../src/reading/facts.ts";
import { stability } from "../src/reading/stability.ts";
import { vargaChart } from "../src/engine/vargas.ts";
import { SIGNS, mod, type GrahaId } from "../src/engine/constants.ts";
import type { Natal } from "../src/engine/types.ts";

const SEVEN: GrahaId[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
const NOW = Date.UTC(2026, 10, 19);
type Test = { id: string; what: string; ok: (n: Natal) => boolean };
const good = (n: Natal) => { const F = buildFacts(makeCtx(n, NOW, { windowMin: 5 })); return F.houses.filter((h) => h.tier === "top").length; };
const TESTS: Test[] = [
  { id: "favourable", what: "Nhiều yếu tố tương đối thuận lợi (≥4 hành tinh vượng/tự cung)", ok: (n) => SEVEN.filter((g) => ["exalted", "own", "moolatrikona"].includes(n.grahas[g].dignity)).length >= 4 },
  { id: "contrary", what: "Nhiều chỉ dấu trái chiều (≥2 hành tinh suy, chủ cung mọc ở nhà 6/8/12)", ok: (n) => SEVEN.filter((g) => n.grahas[g].dignity === "debilitated").length >= 2 && [6, 8, 12].includes(n.grahas[n.houses[0].lord].house) },
  { id: "stellium", what: "Nhiều hành tinh đồng cung (≥4 trong một cung)", ok: (n) => SIGNS.some((_, s) => SEVEN.filter((g) => n.grahas[g].sign === s).length >= 4) },
  { id: "dusthana-lords", what: "Chủ nhà nằm ở nhà 6, 8, 12 (≥5 chủ nhà)", ok: (n) => n.houses.filter((h) => [6, 8, 12].includes(h.lordHouse)).length >= 5 },
  { id: "d1-vs-d9", what: "D1 và D9/D10 khác điều kiện (một hành tinh vượng/tự cung ở D1 nhưng suy ở D9 hoặc D10, hoặc ngược lại)", ok: (n) => [9, 10].some((v) => SEVEN.some((g) => { const p = vargaChart(n, v as 9 | 10).planets[g]; const good = (d: string) => ["exalted", "own", "moolatrikona"].includes(d); return (good(p.d1Dignity) && p.dignity === "debilitated") || (p.d1Dignity === "debilitated" && good(p.dignity)); })) },
  { id: "quiet", what: "Ít chỉ dấu nổi bật (không yoga mạnh, không hành tinh vượng/suy)", ok: (n) => SEVEN.every((g) => !["exalted", "debilitated"].includes(n.grahas[g].dignity)) && !n.yogas.some((y) => y.strength === "strong") },
  { id: "sun-moon", what: "Mặt Trời và Mặt Trăng đồng cung, sát nhau (<12°)", ok: (n) => Math.abs(mod(n.grahas.moon.lon - n.grahas.sun.lon + 180, 360) - 180) < 12 },
  { id: "one-element", what: "Nhiều hành tinh cùng nguyên tố (≥5 trong 7)", ok: (n) => [0, 1, 2, 3].some((e) => SEVEN.filter((g) => n.grahas[g].sign % 4 === e).length >= 5) },
  { id: "empty-houses", what: "Nhiều nhà trống (≥7 nhà không có hành tinh)", ok: (n) => n.houses.filter((h) => !h.occupants.length).length >= 7 },
  { id: "unstable-d9", what: "Sai số ±15 phút làm đổi cung mọc D9 hoặc D10", ok: (n) => { const s = stability(n, 15); return s.varga[9].lagna.length > 1 || s.varga[10].lagna.length > 1; } },
  { id: "dasha-in-month", what: "Tiểu vận đổi ngay trong một tháng của năm 2027", ok: (n) => compose(n, NOW, { name: "A", windowMin: 5 }).forecast.months.some((m) => m.events.some((e) => e.kind === "dasha")) },
];

const lines: string[] = ["# Bộ lá số thử nghiệm", "", "Mỗi tình huống được tìm bằng cách quét các ngày sinh thật (Huế, 16.46°B 107.59°Đ) cho đến khi gặp lá số thỏa điều kiện; sau đó đọc toàn bộ lá số và kiểm tra đầu ra.", "", "| Tình huống | Lá số tìm được | Kết quả kiểm tra |", "|---|---|---|"];
let fails = 0;
for (const T of TESTS) {
  let hit: { n: Natal; when: string } | null = null;
  for (let k = 0; k < 900 && !hit; k++) {
    const ms = Date.UTC(1950, 0, 1) + k * 29.3 * 86_400_000 + (k % 24) * 3600_000 + (k * 7 % 60) * 60_000;
    const n = computeNatal(ms, 16.46, 107.59);
    if (T.ok(n)) hit = { n, when: new Date(ms + 7 * 3600_000).toISOString().slice(0, 16).replace("T", " ") };
  }
  if (!hit) { lines.push(`| ${T.what} | không tìm thấy trong khoảng quét | – |`); continue; }
  const r = compose(hit.n, NOW, { name: "A", windowMin: T.id === "unstable-d9" ? 15 : 5 });
  const text = JSON.stringify(r);
  const problems: string[] = [];
  if (/undefined|NaN|\{[a-z]+\}/.test(text)) problems.push("có placeholder");
  if (r.houses.some((h) => h.why.length < 3)) problems.push("nhà thiếu bằng chứng");
  if (r.vargas!.length !== 6) problems.push("thiếu D-chart");
  if (r.explore.flatMap((g) => g.topics).some((t) => !t.points.length)) problems.push("chủ đề khám phá rỗng");
  if (T.id === "unstable-d9" && !r.vargas!.some((v) => v.trust.level !== "chắc")) problems.push("không cảnh báo độ ổn định");
  if (T.id === "sun-moon" && !r.overview.blocks.find((b) => b.id === "moon")!.paragraphs.some((p) => /sát Mặt Trời|cùng một cung/.test(p))) problems.push("không phân tích Mặt Trời–Mặt Trăng gần nhau");
  if (T.id === "empty-houses" && r.overview.blocks.find((b) => b.id === "focus")!.paragraphs.join(" ").includes("kém") && !r.overview.blocks.find((b) => b.id === "focus")!.paragraphs.join(" ").includes("không có nghĩa")) problems.push("suy diễn nhà trống là kém");
  if (problems.length) fails++;
  lines.push(`| ${T.what} | ${hit.when} (cung mọc ${r.meta.lagna}, Mặt Trăng ${r.meta.moon}) | ${problems.length ? "LỖI: " + problems.join(", ") : "đạt"} |`);
  console.log(T.id, hit.when, problems.length ? problems.join(", ") : "ok");
}
lines.push("", `Tổng: ${TESTS.length} tình huống, ${fails} lỗi.`);
writeFileSync("docs/TEST_SCENARIOS.md", lines.join("\n") + "\n");
process.exit(fails ? 1 : 0);
