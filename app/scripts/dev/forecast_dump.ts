import { computeNatal } from "../../src/engine/core.ts";
import { compose } from "../../src/reading/compose.ts";
const [d, t] = (process.argv[2] ?? "1990-05-23T01:40").split("T"); const [y, m, dd] = d.split("-").map(Number); const [hh, mm] = t.split(":").map(Number);
const t0 = Date.now();
const n = computeNatal(Date.UTC(y, m - 1, dd, hh, mm), 16.46, 107.59);
const r = compose(n, Date.UTC(2026, 10, 19), { name: "A", noTime: process.argv[3] === "notime", windowMin: 5 });
console.error("ms", Date.now() - t0);
console.log("KEY"); r.forecast.key.forEach((e) => console.log(e.date, e.title));
for (const mo of r.forecast.months.slice(0, 3)) { console.log(`\n## ${mo.label} · ${mo.headline}`); mo.paragraphs.forEach((p) => console.log(p)); }
