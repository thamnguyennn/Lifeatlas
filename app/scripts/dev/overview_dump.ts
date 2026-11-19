import { computeNatal } from "../../src/engine/core.ts";
import { compose } from "../../src/reading/compose.ts";
const arg = process.argv[2] ?? "1990-05-23T01:40";
const [d, t] = arg.split("T"); const [y, m, dd] = d.split("-").map(Number); const [hh, mm] = t.split(":").map(Number);
const lat = Number(process.argv[3] ?? 16.46), lon = Number(process.argv[4] ?? 107.59);
const n = computeNatal(Date.UTC(y, m - 1, dd, hh, mm), lat, lon);
const r = compose(n, Date.UTC(2026, 10, 19), { name: "Minh Anh", noTime: process.argv[5] === "notime", windowMin: 5 });
console.log(r.letter.greeting, r.letter.line, "\n");
for (const b of r.overview.blocks) { console.log(`## ${b.title}${b.sign ? " · " + b.sign : ""}${b.facts ? "  [" + b.facts + "]" : ""}`); for (const p of b.paragraphs) console.log(p); console.log(); }
