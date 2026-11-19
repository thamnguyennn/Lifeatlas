import { computeNatal } from "../../src/engine/core.ts";
import { compose } from "../../src/reading/compose.ts";
const [d, t] = (process.argv[2] ?? "1990-05-23T01:40").split("T"); const [y, m, dd] = d.split("-").map(Number); const [hh, mm] = t.split(":").map(Number);
const n = computeNatal(Date.UTC(y, m - 1, dd, hh, mm), 16.46, 107.59);
const r = compose(n, Date.UTC(2026, 10, 19), { name: "A", windowMin: 5, noTime: process.argv[3] === "notime" });
for (const g of r.explore) for (const tp of g.topics) { console.log(`\n## ${tp.title}\n> ${tp.lead}`); tp.points.forEach((p) => console.log(` - ${p.title}: ${p.text}`)); }
