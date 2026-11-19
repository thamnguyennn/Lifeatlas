// Dev helper: per-section visible word counts for one lint chart. Run: node --experimental-strip-types --no-warnings scripts/dev/vis_dump.ts <chartIndex> <house>
import { computeNatal } from "../../src/engine/core.ts";
import { compose } from "../../src/reading/compose.ts";
import { TIME_WINDOW_MIN } from "../../src/engine/dasha5.ts";
let seed = 777;
const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
const want = Number(process.argv[2]), hn = Number(process.argv[3]);
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
for (let i = 0; i <= want; i++) {
  const ms = Date.UTC(1925, 0, 1) + rnd() * (Date.UTC(2020, 0, 1) - Date.UTC(1925, 0, 1));
  const n = computeNatal(ms, 8 + rnd() * 15, 102 + rnd() * 8);
  if (i !== want) continue;
  const kind = i % 5 === 0 ? "unknown" : i % 5 === 1 ? "canh" : "exact";
  const r = compose(n, Date.UTC(2026, 10, 15), { name: "Minh Anh", noTime: i % 5 === 0, windowMin: TIME_WINDOW_MIN[kind] });
  const h = r.houses.find((x) => x.n === hn)!;
  for (const s of h.sections.filter((x) => !x.fold)) {
    const t = [...s.paragraphs, ...(s.blocks ?? []).flatMap((b) => b.paragraphs)];
    console.log(`## ${s.id} (${words(t.join(" "))} từ)`);
    for (const p of t) console.log(`  [${words(p)}] ${p}`);
  }
}
