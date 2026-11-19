import { computeNatal } from "../../src/engine/core.ts";
import { compose } from "../../src/reading/compose.ts";
import { TIME_WINDOW_MIN } from "../../src/engine/dasha5.ts";
// usage: dasha_dump.ts <mahaIndex> [antarIndex]   (sample chart: fictional "Minh Anh", 23/05/1990 08:40 Huế)
const [mi, ai] = process.argv.slice(2).map(Number);
const n = computeNatal(Date.UTC(1990, 4, 23, 1, 40), 16.46, 107.59);
const r = compose(n, Date.UTC(2026, 10, 16), { name: "Minh Anh", noTime: false, windowMin: TIME_WINDOW_MIN.exact });
const ms = r.timeline.mahas;
const show = (p: any, ind = "") => { console.log(`${ind}## ${p.title} · ${p.from}–${p.to} · ${p.span} · ${p.trust} · ${p.state}`); for (const t of p.paragraphs) console.log(`${ind}${t}`); };
ms.forEach((m, i) => { if (mi !== undefined && !Number.isNaN(mi) && i !== mi) return; console.log(`\n===== ĐẠI VẬN ${i}: ${m.name} (${m.from}–${m.to}) tone=${m.tone}`); console.log(m.theme); show(m.read); m.antars.forEach((a, j) => { if (ai !== undefined && !Number.isNaN(ai) && j !== ai) return; console.log(); show(a, "  "); }); });
