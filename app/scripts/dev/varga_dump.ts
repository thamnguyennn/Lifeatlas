import { computeNatal } from "../../src/engine/core.ts";
import { compose } from "../../src/reading/compose.ts";
const arg = process.argv[2] ?? "1990-05-23T01:40";
const [d, t] = arg.split("T"); const [y, m, dd] = d.split("-").map(Number); const [hh, mm] = t.split(":").map(Number);
const win = Number(process.argv[3] ?? 5);
const n = computeNatal(Date.UTC(y, m - 1, dd, hh, mm), 16.46, 107.59);
const r = compose(n, Date.UTC(2026, 10, 19), { name: "Minh Anh", noTime: false, windowMin: win });
for (const v of r.vargas ?? []) {
  console.log(`\n===== ${v.code} ${v.name} [${v.trust.level}]\n${v.question}`);
  v.summary.forEach((p) => console.log("S:", p));
  v.points.forEach((p) => { console.log("  #", p.title); p.paragraphs.forEach((x) => console.log("   ", x)); });
  console.log("T:", v.trust.note); v.why.forEach((w) => console.log("  w:", w));
}
