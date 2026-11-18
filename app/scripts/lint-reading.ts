// Reading lint: placeholders, banned words, repeats, long sentences, page sizes, and structural rules for Life Atlas v3.0.
// Run: npm run lint:reading [charts]
import { computeNatal } from "../src/engine/core.ts";
import { compose, composeDay, makeCtx, type Reading } from "../src/reading/compose.ts";
import { TIME_WINDOW_MIN } from "../src/engine/dasha5.ts";
import { BANNED, softRules } from "./voice-rules.ts";

const soft = new Map<string, Map<string, number>>();
const flag = (rule: string, sentence: string) => { const m = soft.get(rule) ?? soft.set(rule, new Map()).get(rule)!; m.set(sentence, (m.get(sentence) ?? 0) + 1); };
const softCheck = (sentence: string) => { for (const rule of softRules(sentence)) flag(rule, sentence); };

/** Every string in the reading, with the path it was found at. */
function* walk(v: unknown, path: string): Generator<[string, string]> {
  if (typeof v === "string") yield [path, v];
  else if (Array.isArray(v)) for (const x of v) yield* walk(x, path);
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) yield* walk(x, path ? `${path}.${k}` : k);
}

const SKIP = /(^|\.)(meta|id|ids|tone|band|trust|state|kind|sa|code|chips|facts|why|trustNote|yogaIds|pathIds|from|to|span|dateLabel|path|sanskrit|lordName|signName|savLabel|occupants|deg|sign|name|short|how|label|planet|title|tag|theme|ask|plain|pathway|expressiveLevel|supportLevel)(\.|$)/;
const split = (s: string) => s.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter((x) => x.length > 12);
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

let seed = 777;
const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
const NOW = Date.UTC(2026, 10, 15);

let problems = 0, longHouses = 0;
const fail = (msg: string) => { console.log("PROBLEM", msg); problems++; };
const periodDupHist: number[] = [];
const dupHist: number[] = [], wordHist: number[] = [], houseWords: number[] = [], visWords: number[] = [], todayWords: number[] = [], longest: [number, string][] = [];
const charts = Number(process.argv[2] ?? 300);

for (let i = 0; i < charts; i++) {
  const ms = Date.UTC(1925, 0, 1) + rnd() * (Date.UTC(2020, 0, 1) - Date.UTC(1925, 0, 1));
  const n = computeNatal(ms, 8 + rnd() * 15, 102 + rnd() * 8);
  const noTime = i % 5 === 0;
  const kind = noTime ? "unknown" : i % 5 === 1 ? "canh" : "exact";
  let r: Reading;
  try { r = compose(n, NOW, { name: "Minh Anh", noTime, windowMin: TIME_WINDOW_MIN[kind] }); }
  catch (e) { fail(`compose failed for ${new Date(ms).toISOString()}: ${(e as Error).message}`); continue; }
  const tag = `chart ${i} (${kind})`;
  if (i % 25 === 24) console.error(`  ... ${i + 1}/${charts} charts, ${problems} problem(s) so far`);

  // structure
  if (noTime) {
    if (r.houses.length || r.vargas || r.houseMap) fail(`${tag}: a chart without a birth time must not carry houses or divisional charts`);
  } else {
    if (r.houses.length !== 12) fail(`${tag}: ${r.houses.length} houses`);
    if (!r.vargas || r.vargas.length !== 3) fail(`${tag}: vargas missing`);
  }
  if (r.letter.paragraphs.length !== 1) fail(`${tag}: letter has ${r.letter.paragraphs.length} paragraphs (expected 1)`);
  if (r.timeline.mahas.length < 5) fail(`${tag}: only ${r.timeline.mahas.length} mahadashas`);
  if (r.today.paragraphs.length < 2 || r.today.paragraphs.length > 4) fail(`${tag}: today has ${r.today.paragraphs.length} paragraphs`);
  const todayText = r.today.paragraphs.join(" ");
  todayWords.push(words(todayText));
  if (split(todayText).length > 11) fail(`${tag}: today message has ${split(todayText).length} sentences`);
  for (const l of r.ladder.levels) if (!["chắc", "gần đúng", "chỉ tham khảo"].includes(l.trust)) fail(`${tag}: bad trust label ${l.trust}`);
  for (let hi = 0; hi < r.houses.length; hi++) {
    const h = r.houses[hi];
    const w = h.words;
    houseWords.push(w);
    if (w > 950) longHouses++;
    if (w < 260 || w > 1700) fail(`${tag}: house ${h.n} has ${w} words`);
    const vis = h.sections.filter((s) => !s.fold).reduce((a, s) => a + words([...s.paragraphs, ...(s.blocks ?? []).flatMap((b) => b.paragraphs)].join(" ")), 0);
    visWords.push(vis);
    if (vis > 800) fail(`${tag}: house ${h.n} shows ${vis} words before the folded layers`);
    if (h.sections.some((s) => s.id === "now" || s.id === "next")) fail(`${tag}: house ${h.n} still has timing section`);
    if (hi > 0 && h.pathway === r.houses[hi - 1].pathway) fail(`${tag}: house ${h.n} repeats pathway ${h.pathway}`);
    for (const s of h.sections) for (const p of [...s.paragraphs, ...(s.blocks ?? []).flatMap((b) => b.paragraphs)]) {
      for (const m of p.matchAll(/đã kể (?:kỹ )?ở nhà (\d+)/g)) if (+m[1] >= h.n) fail(`${tag}: house ${h.n} points to house ${m[1]}`);
    }
  }

  // text rules
  const seen = new Map<string, number>();
  let w = 0;
  for (const [where, t] of walk(r, "")) {
    if (/\{|\}|undefined|NaN|\bnull\b|\[object/.test(t)) fail(`${tag}: bad token in ${where}: ${t.slice(0, 100)}`);
    if (SKIP.test(`.${where}.`) && words(t) < 6) continue;
    w += words(t);
    const low = t.toLowerCase();
    for (const b of BANNED) if (low.includes(b)) fail(`${tag}: banned "${b}" in ${where}`);
    const structural = /(^|\.)(title|span|label|value|facts|why|tag|ask|theme|role|houseWindows)(\.|$)/.test(where);
    for (const s of split(t)) {
      const k = s.toLowerCase();
      if (!structural) seen.set(`${/^(timeline|ladder)/.test(where) ? "P" : "R"}|${k}`, (seen.get(`${/^(timeline|ladder)/.test(where) ? "P" : "R"}|${k}`) ?? 0) + 1);
      if (!structural) softCheck(s);
      const wc = words(s);
      if (wc > 58) longest.push([wc, s]);
    }
  }
  if (noTime) {
    for (const [where, t] of walk({ o: r.overview, l: r.lessons, t: r.timeline, ladder: r.ladder, sky: r.sky, today: r.today }, "")) {
      if (/\bnhà \d+\b/i.test(t) && !SKIP.test(`.${where}.`)) fail(`${tag}: house number in a chart without a birth time (${where}): ${t.slice(0, 90)}`);
    }
  }
  try { const d = composeDay(makeCtx(n, NOW, { noTime, windowMin: TIME_WINDOW_MIN[kind] }), NOW + 400 * 86_400_000); if (!d.today.paragraphs.length) fail(`${tag}: empty day`); }
  catch (e) { fail(`${tag}: composeDay failed: ${(e as Error).message}`); }

  let dups = 0, pdups = 0;
  for (const [k, c] of seen) if (c > 1) { if (k.startsWith("P|")) pdups += c - 1; else dups += c - 1; }
  dupHist.push(dups); periodDupHist.push(pdups); wordHist.push(w);
}

const avg = (a: number[]) => (a.reduce((x, y) => x + y, 0) / Math.max(1, a.length)).toFixed(1);
console.log(`charts ${charts}: avg words ${avg(wordHist)} (min ${Math.min(...wordHist)}, max ${Math.max(...wordHist)})`);
console.log(`house pages: avg ${avg(houseWords)} words (min ${Math.min(...houseWords)}, max ${Math.max(...houseWords)})`);
console.log(`house pages, visible part: avg ${avg(visWords)} words (max ${Math.max(...visWords)})`);
console.log(`house pages over 950 words: ${longHouses} of ${houseWords.length} (${((100 * longHouses) / Math.max(1, houseWords.length)).toFixed(1)}%)`);
console.log(`today message: avg ${avg(todayWords)} words (max ${Math.max(...todayWords)})`);
console.log(`repeated sentences in the reading proper: avg ${avg(dupHist)}, max ${Math.max(...dupHist)}, readings with 0: ${dupHist.filter((x) => x === 0).length}`);
console.log(`repeated sentences in dasha chapters and ladder: avg ${avg(periodDupHist)}, max ${Math.max(...periodDupHist)}`);
longest.sort((a, b) => b[0] - a[0]);
const uniqLong = [...new Map(longest.map(([c, s]) => [s, c])).entries()].slice(0, 6);
if (uniqLong.length) { console.log("long sentences (> 58 words):"); for (const [s, c] of uniqLong) console.log(" ", c, s.slice(0, 140)); }
const allDistinct = new Set<string>();
for (const m of soft.values()) for (const k of m.keys()) allDistinct.add(k);
console.log(`voice check (soft, not failing): ${allDistinct.size} distinct sentences flagged`);
console.log(problems ? `${problems} problem(s)` : "no placeholder / banned-word / structure problems");
process.exit(problems ? 1 : 0);
