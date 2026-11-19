import { computeNatal } from "../../src/engine/core.ts";
import { compose } from "../../src/reading/compose.ts";
import { readCompat } from "../../src/reading/compat.ts";
const mk = (s: string) => { const [d, t] = s.split("T"); const [y, m, dd] = d.split("-").map(Number); const [hh, mm] = t.split(":").map(Number); return computeNatal(Date.UTC(y, m - 1, dd, hh, mm), 16.46, 107.59); };
const n = mk("1990-05-23T01:40");
const r = compose(n, Date.UTC(2026, 10, 19), { name: "A", windowMin: 5 });
for (const g of r.explore) for (const t of g.topics.filter((x) => ["career", "inner", "marriage"].includes(x.id))) { console.log(`\n## ${t.title}\n${t.lead}`); t.points.forEach((p) => console.log(" -", p.title + ":", p.text)); }
const c = readCompat(n, mk("1992-11-02T14:20"), "A", "B");
console.log("\nCOMPAT", c.total, c.band); c.summary.forEach((x) => console.log(x)); c.kootas.forEach((k) => console.log(k.name, k.got + "/" + k.max)); c.points.forEach((p) => console.log(p.title + ":", p.text));
