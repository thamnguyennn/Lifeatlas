import { computeNatal } from "../../src/engine/core.ts";
import { compose } from "../../src/reading/compose.ts";
import { TIME_WINDOW_MIN } from "../../src/engine/dasha5.ts";
const want = process.argv.slice(2).map(Number);
const n = computeNatal(Date.UTC(1990, 4, 23, 1, 40), 16.46, 107.59);
const r = compose(n, Date.UTC(2026, 10, 16), { name: "Minh Anh", noTime: false, windowMin: TIME_WINDOW_MIN.exact });
for (const h of r.houses) {
  if (want.length && !want.includes(h.n)) continue;
  console.log(`\n===== NHÀ ${h.n} (${h.words} từ)`);
  for (const s of h.sections) {
    console.log(`\n## ${s.fold ? "[gập] " : ""}${s.id}: ${s.title}`);
    for (const p of s.paragraphs) console.log(p);
    for (const b of s.blocks ?? []) { console.log(`  - ${b.label}`); for (const p of b.paragraphs) console.log(`    ${p}`); }
  }
}
