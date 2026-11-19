import { computeNatal } from "../../src/engine/core.ts";
import { compose } from "../../src/reading/compose.ts";
const [d, t] = (process.argv[2] ?? "1990-05-23T01:40").split("T"); const [y, m, dd] = d.split("-").map(Number); const [hh, mm] = t.split(":").map(Number);
const n = computeNatal(Date.UTC(y, m - 1, dd, hh, mm), 16.46, 107.59);
const r = compose(n, Date.UTC(2026, 10, 19), { name: "A", noTime: false, windowMin: 5 });
const now = r.timeline.mahas.find((x) => x.state === "now")!;
console.log("MAHA", now.name, now.from, now.to);
for (const l of now.read.layers!) console.log(`\n[${l.title}]\n${l.text}`);
for (const a of now.antars.slice(0, 3)) { console.log(`\n--- ${a.title} (${a.from}–${a.to})`); a.paragraphs.forEach((p) => console.log(p)); }
