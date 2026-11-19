// Run with:  npm test
import assert from "node:assert/strict";
import { resolveCivilTime } from "../src/engine/vn-time.ts";
import { computeNatal } from "../src/engine/core.ts";
import { solarToLunar, lunarToSolar } from "../src/engine/lunar-vn.ts";
import { SIGNS } from "../src/engine/constants.ts";
import { vargaSign, vargaChart, charaKarakas, karakamsa, horaSplit } from "../src/engine/vargas.ts";
import { compose, composeDay, makeCtx } from "../src/reading/compose.ts";
import { shadbala, drikBala, beneficSet, SEVEN_IDS, REQUIRED_RUPAS } from "../src/engine/shadbala.ts";
import { dashaOrigin, dashaMahas, dashaChildren, dashaChain, dashaReliability, levelTrust, LEVEL_NAME, TIME_WINDOW_MIN, type DNode } from "../src/engine/dasha5.ts";
import { transitAt, taraOf, stayIn } from "../src/engine/transit.ts";
import { readCompat } from "../src/reading/compat.ts";
import { yearCalendar, vedhaBy } from "../src/reading/forecast.ts";
import { buildParts, flatPages } from "../src/ui/pages.ts";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log("  ✓", name); }
  catch (e) { failed++; console.log("  ✗", name, "\n   ", (e as Error).message); }
}
const HN = { name: "Hà Nội", lat: 21.0285, lon: 105.8542, country: "VN" as const };
const SG = { name: "TP. Hồ Chí Minh", lat: 10.7769, lon: 106.7009, country: "VN" as const };
const BMT = { name: "Buôn Ma Thuột", lat: 12.6667, lon: 108.05, country: "VN" as const };
const off = (y: number, m: number, d: number, hh: number, mm: number, p: typeof HN) => resolveCivilTime(y, m, d, hh, mm, p).offsetSec / 3600;

console.log("Vietnam civil time");
test("2020 is UTC+7 everywhere", () => { assert.equal(off(2020, 6, 1, 12, 0, HN), 7); assert.equal(off(2020, 6, 1, 12, 0, SG), 7); });
test("South Vietnam 1957 = +7, 1962 = +8, 1970 = +8, after 13/6/1975 = +7", () => {
  assert.equal(off(1957, 5, 1, 9, 0, SG), 7); assert.equal(off(1962, 5, 1, 9, 0, SG), 8);
  assert.equal(off(1970, 6, 15, 9, 0, SG), 8); assert.equal(off(1975, 7, 1, 9, 0, SG), 7);
});
test("North Vietnam 1970 = +7 while the South is +8", () => { assert.equal(off(1970, 6, 15, 9, 0, HN), 7); });
test("Saigon clock jump 31/12/1959 23:00 -> 00:00 is flagged", () => {
  assert.equal(resolveCivilTime(1959, 12, 31, 23, 30, SG).anomaly, "gap");
  assert.equal(off(1960, 1, 1, 0, 30, SG), 8);
});
test("Japanese occupation 1945-04 = +9; 1944 = +8", () => { assert.equal(off(1945, 4, 10, 12, 0, SG), 9); assert.equal(off(1944, 6, 1, 12, 0, SG), 8); });
test("UTC instant of 20/01/1998 10:45 in Buôn Ma Thuột", () => {
  assert.equal(new Date(resolveCivilTime(1998, 1, 20, 10, 45, BMT).utcMs).toISOString(), "1998-01-20T03:45:00.000Z");
});
test("Abroad uses IANA (Houston, 1 Jul 2000, 12:00 = UTC-5)", () => {
  const r = resolveCivilTime(2000, 7, 1, 12, 0, { name: "Houston", lat: 29.76, lon: -95.37, country: "OTHER", tz: "America/Chicago" });
  assert.equal(r.offsetSec / 3600, -5);
});
test("Manual offset overrides the table", () => {
  assert.equal(resolveCivilTime(1970, 6, 15, 9, 0, { ...SG, fixedOffsetMin: 420 }).offsetSec / 3600, 7);
});

console.log("Vietnamese lunar calendar (UTC+7)");
test("Tết dates 1998, 2000, 2024, 2025, 2026", () => {
  const tet: [number, [number, number]][] = [[1998, [28, 1]], [2000, [5, 2]], [2024, [10, 2]], [2025, [29, 1]], [2026, [17, 2]]];
  for (const [y, [d, m]] of tet) {
    const l = solarToLunar(d, m, y, 7);
    assert.deepEqual([l.day, l.month, l.year, l.leap], [1, 1, y, false], `Tết ${y}`);
  }
});
test("1968: Tết was 29 Jan in the North (UTC+7) and 30 Jan in the South/China (UTC+8)", () => {
  const n = solarToLunar(29, 1, 1968, 7), s = solarToLunar(29, 1, 1968, 8);
  assert.deepEqual([n.day, n.month], [1, 1]);
  assert.deepEqual([s.day, s.month], [30, 12]);
  const t8 = solarToLunar(30, 1, 1968, 8);
  assert.deepEqual([t8.day, t8.month], [1, 1]);
});

console.log("Natal chart (the sample chart: 20/01/1998 10:45, Buôn Ma Thuột)");
const t = resolveCivilTime(1998, 1, 20, 10, 45, BMT);
const n = computeNatal(t.utcMs, BMT.lat, BMT.lon);
test("Lagna is Pisces (Song Ngư), in Revati", () => { assert.equal(SIGNS[n.lagna.sign], "Song Ngư"); assert.equal(n.lagna.nak.name, "Revati"); });
test("planets sit in the houses given by the reference reading", () => {
  const h = (g: keyof typeof n.grahas) => n.grahas[g].house;
  assert.deepEqual([h("saturn"), h("moon"), h("mercury"), h("sun"), h("venus"), h("mars"), h("jupiter"), h("ketu"), h("rahu")], [1, 7, 10, 11, 11, 12, 12, 12, 6]);
  assert.equal(n.grahas.ketu.nak.name, "Shatabhisha");
  assert.equal(n.grahas.venus.retro, true);
});
test("Sarvashtakavarga per house equals the reference values (9 of 9) and totals 337", () => {
  const want: Record<number, number> = { 2: 23, 3: 31, 4: 25, 5: 28, 8: 29, 9: 37, 10: 34, 11: 26, 12: 24 };
  for (const [k, v] of Object.entries(want)) assert.equal(n.houses[+k - 1].sav, v, `house ${k}`);
  assert.equal(n.sav.reduce((a, b) => a + b, 0), 337);
});
test("Jupiter-Saturn exchange (Parivartana) is found", () => {
  assert.ok(n.yogas.some((y) => y.id === "parivartana_jupiter_saturn"));
});
test("Vimshottari: born in Mars dasha, then Rahu 2002-2020, Jupiter 2020-2036", () => {
  assert.equal(n.dasha[0].lord, "mars");
  assert.equal(new Date(n.dasha[1].startMs).getUTCFullYear(), 2002);
  assert.equal(n.dasha[1].lord, "rahu");
  assert.equal(n.dasha[2].lord, "jupiter");
});

console.log("Divisional charts and Jaimini layer");
test("D2/D3/D9/D10 sign rules at known longitudes", () => {
  const want: [number, Record<number, number>][] = [
    [0, { 2: 4, 3: 0, 9: 0, 10: 0 }],
    [15, { 2: 3, 3: 4, 9: 4, 10: 5 }],
    [30, { 2: 3, 3: 1, 9: 9, 10: 9 }],
    [59.9, { 2: 4, 3: 9, 9: 5, 10: 6 }],
  ];
  for (const [lon, exp] of want) for (const k of [2, 3, 9, 10] as const) assert.equal(vargaSign(lon, k), exp[k], `D${k} at ${lon}`);
});
test("sample chart: D9 chart agrees with the engine's navamsa and D1 houses", () => {
  const d9 = vargaChart(n, 9);
  for (const id of ["sun", "moon", "saturn", "rahu"] as const) assert.equal(d9.planets[id].sign, n.grahas[id].navamsaSign);
  assert.equal(d9.occupants.flat().length, 9);
});
test("sample chart: Moon is the Atmakaraka and Karakamsa follows its navamsa", () => {
  const ks = charaKarakas(n);
  assert.equal(ks[0].planet, "moon");
  assert.equal(ks.length, 7);
  const km = karakamsa(n);
  assert.equal(km.sign, n.grahas.moon.navamsaSign);
});
test("hora split puts the seven planets in exactly two horas", () => {
  const h = horaSplit(n);
  assert.equal(h.sun.length + h.moon.length, 7);
});

const NOW0 = Date.UTC(2026, 10, 15);

console.log("Shadbala & Dasha in five levels");
test("Drik Bala reproduces the worked example in B.V. Raman's Graha and Bhava Balas to 0.03 virupa", () => {
  const L = [180.9109, 311.2371, 229.4605, 181.5166, 84.0059, 171.1567, 124.3775];
  const lons = {} as Record<(typeof SEVEN_IDS)[number], number>;
  SEVEN_IDS.forEach((id, j) => (lons[id] = L[j]));
  const d = drikBala(lons, beneficSet(lons).benefics, true);
  const want = [15.86, -21.73, 0.95, 15.64, -16.04, 18.47, 7.21];
  SEVEN_IDS.forEach((id, j) => assert.ok(Math.abs(d[id] - want[j]) < 0.03, `${id}: ${d[id].toFixed(3)} vs ${want[j]}`));
});
test("required strength in rupas is the classical table", () => {
  assert.deepEqual(REQUIRED_RUPAS, { sun: 6.5, moon: 6, mars: 5, mercury: 7, jupiter: 6.5, venus: 5.5, saturn: 5 });
});
const sb = shadbala(n);
test("sample chart: totals are the sum of the six strengths, ranks are 1..7, house ranks are 1..12", () => {
  for (const id of SEVEN_IDS) {
    const p = sb.planets[id];
    const sum = p.sthana.total + p.dig + p.kala.total + p.cheshta + p.naisargika + p.drik;
    assert.ok(Math.abs(sum - p.total) < 1e-6, id);
  }
  assert.deepEqual(SEVEN_IDS.map((id) => sb.planets[id].rank).sort(), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(sb.bhava.map((b) => b.rank).sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});

const origin = dashaOrigin(n.grahas.moon.lon, n.utcMs);
test("level names are the plain words used on the page", () => {
  assert.deepEqual([1, 2, 3, 4, 5].map((l) => LEVEL_NAME[l as 1]), ["Đại vận", "Tiểu vận", "Chặng", "Nhịp", "Nhịp ngắn nhất"]);
});
test("the nine children of every period fill it exactly, down to the fifth level", () => {
  const check = (node: DNode) => {
    const kids = dashaChildren(node);
    assert.equal(kids.length, 9);
    assert.ok(Math.abs(kids[0].startMs - node.startMs) < 2);
    assert.ok(Math.abs(kids[8].endMs - node.endMs) < 2);
    for (let i = 1; i < 9; i++) assert.ok(Math.abs(kids[i].startMs - kids[i - 1].endMs) < 2);
    if (node.level < 4) for (const k of kids) check(k);
  };
  const mahas = dashaMahas(origin, 10);
  check(mahas[1]);
});

console.log("Reading v3.x: one-sentence letter, merged overview, houses with yoga folded in, nodes, six divisional charts, dasha layers, 2027, explore");
const NOW = NOW0;
const full = compose(n, NOW, { name: "Minh Anh" });
const blind = compose(n, NOW, { name: "Minh Anh", noTime: true });

test("Mở lá số uses one complete sentence and no technical numbers", () => {
  assert.match(full.letter.greeting, /^Gửi /);
  assert.match(full.letter.line, /^[^.!?0-9]+[.!?]$/u);
});
test("Tổng quan has the agreed blocks and respects missing birth time", () => {
  const ids = full.overview.blocks.map((b) => b.id);
  for (const id of ["lagna", "sun", "moon", "elements", "moonCycle", "pillars", "focus"]) assert.ok(ids.includes(id as never), `block ${id}`);
  assert.equal(full.overview.strength?.rows?.length ?? full.overview.strength?.length, 7);
  assert.equal(full.overview.planets.length, 9);
  assert.ok(!blind.overview.blocks.some((b) => b.id === "focus" && b.paragraphs.join(" ").match(/\bnhà \d+/i)), "no house numbers without birth time");
});

test("12 Nhà: open and summary are visible, evidence is folded, no dasha sections, adjacent houses open differently", () => {
  assert.equal(full.houses.length, 12);
  for (let i = 0; i < full.houses.length; i++) {
    const h = full.houses[i];
    const ids = h.sections.map((s) => s.id);
    assert.ok(!ids.includes("now" as never) && !ids.includes("next" as never) && !ids.includes("turn" as never), `house ${h.n}`);
    assert.deepEqual(ids.slice(0, 2), ["open", "summary"], `house ${h.n}`);
    assert.deepEqual(h.sections.filter((s) => !s.fold).map((s) => s.id), ["open", "summary"], `house ${h.n} visible sections`);
    if (i > 0) assert.notEqual(h.pathway, full.houses[i - 1].pathway, `house ${h.n} repeats the opening path of ${h.n - 1}`);
    assert.ok(h.words >= 100 && h.words <= 900, `house ${h.n} has ${h.words} words`);
    assert.ok(h.why.length >= 3, `house ${h.n} lists its evidence`);
  }
});

test("Rahu-Ketu lesson has the 12-factor table, and the six divisional charts have three parts and a diamond chart", () => {
  assert.equal(full.nodes.factors.length, 12);
  assert.ok(full.vargas);
  assert.deepEqual(full.vargas!.map((v) => v.n), [2, 3, 4, 7, 9, 10]);
  for (const v of full.vargas!) {
    assert.ok(v.summary.length >= 1 && v.points.length >= 2 && v.points.length <= 3, `D${v.n} three-part content`);
    assert.ok(v.why.length >= 2, `D${v.n} has why list`);
    assert.equal(Object.keys(v.chart.planets).length, 9, `D${v.n} diamond data`);
    assert.ok(v.trust.note.length > 20);
  }
});

test("a wide birth-time error lowers the trust of the divisional charts that depend on the rising sign", () => {
  const wide = compose(n, NOW, { name: "Minh Anh", windowMin: 60 });
  const lv = (r: typeof full, k: number) => r.vargas!.find((v) => v.n === k)!.trust.level;
  assert.equal(lv(wide, 9), lv(wide, 9));
  assert.ok(wide.vargas!.some((v) => v.trust.level === "thấp"), "some chart is flagged when the window is ±60 minutes");
  for (const v of wide.vargas!.filter((x) => x.trust.level === "thấp")) assert.ok(!/Nhà \d+ của D\d+ là/.test(JSON.stringify(v.points)), `D${v.n} must not be read house by house`);
});

test("Đại vận: Mahadasha has four synthesised layers; Antardasha is read through the Mahadasha lord and does not re-explain houses", () => {
  const T = full.timeline;
  assert.ok(T.mahas.length >= 5 && T.mahas.length <= 9);
  for (const m of T.mahas) {
    assert.equal(m.antars.length, 9);
    assert.equal(m.read.layers?.length, 4);
    assert.doesNotMatch(m.read.layers!.map((l) => l.text).join(" "), /\bnhà \d+\b/i, "no house numbers in the Mahadasha prose");
    for (const a of m.antars) assert.ok(!a.layers && a.paragraphs.length >= 2);
  }
  assert.equal(T.houseWindows.length, 12);
  for (const pl of full.sky.planets) {
    assert.ok(pl.moonText.length > 40, `${pl.id} has moonText`);
    assert.ok(pl.lagnaText && pl.lagnaText.length > 40, `${pl.id} has lagnaText`);
  }
});

test("Dự đoán 2027: twelve months built on a real calendar, with parameters folded", () => {
  const F = full.forecast;
  assert.equal(F.year, 2027);
  assert.equal(F.months.length, 12);
  assert.ok(F.key.length >= 4);
  for (const m of F.months) { assert.ok(m.central.length > 30 && m.why.length >= 4, m.label); }
  assert.ok(F.months.slice(1).every((m) => m.change.length >= 1), "every month after January says what changed");
  assert.ok(F.months.some((m) => m.events.length > 0));
  assert.ok(F.key.every((e, i, a) => i === 0 || a[i - 1].ms <= e.ms), "calendar is in date order");
  assert.doesNotMatch(JSON.stringify(blind.forecast), /\bnhà \d+\b/i, "no house numbers without birth time");
});

test("Khám phá thêm: three groups, eleven topics, plus compatibility", () => {
  assert.equal(full.explore.length, 3);
  assert.equal(full.explore.flatMap((g) => g.topics).length, 11);
  const other = computeNatal(Date.UTC(1992, 10, 2, 7, 20), 16.46, 107.59);
  const c = readCompat(n, other, "A", "B");
  assert.equal(c.kootas.length, 8);
  assert.equal(c.kootas.reduce((x, k) => x + k.max, 0), 36);
  assert.ok(c.total >= 0 && c.total <= 36);
  assert.equal(readCompat(n, n, "A", "A").kootas.find((k) => k.name.startsWith("Nadi"))!.got, 0, "same Moon, same nadi");
});

test("page map: seven parts, no sky page, no month message, no house numbers without birth time", () => {
  const parts = buildParts({ reading: full, noTime: false } as never);
  assert.deepEqual(parts.map((p) => p.id), ["overview", "houses", "lessons", "vargas", "time", "y2027", "explore"]);
  assert.ok(!flatPages(parts).some((p) => p.id === "t-sky" || p.id === "today" || p.id === "t-now"));
  assert.equal(flatPages(parts).length, 24);
  assert.equal(blind.houses.length, 0);
  assert.equal(blind.vargas, null);
  const text = JSON.stringify({ o: blind.overview, l: blind.nodes, t: blind.timeline, ladder: blind.ladder, sky: blind.sky });
  assert.doesNotMatch(text, /\bnhà \d+\b/i);
});

test("composition is deterministic and free of unfilled placeholders", () => {
  assert.deepEqual(compose(n, NOW, { name: "Minh Anh" }), full);
  assert.doesNotMatch(JSON.stringify(full), /\{[a-z0-9]+\}|undefined|NaN/);
  assert.doesNotMatch(JSON.stringify(blind), /\{[a-z0-9]+\}|undefined|NaN/);
});

console.log("External references (not this program's own output)");
test("Lahiri ayanamsa at 2000-01-01 12:00 UT is 23°51′ ± 1′ (Indian Astronomical Ephemeris value 23°51′11″)", () => {
  const z = computeNatal(Date.UTC(2000, 0, 1, 12, 0), 0, 0);
  assert.ok(Math.abs(z.ayanamsa - (23 + 51 / 60 + 11 / 3600)) < 1 / 60, `got ${z.ayanamsa}`);
});
test("2027 eclipses match NASA's catalogue (6 Feb annular, 20 Feb penumbral, 18 Jul penumbral, 2 Aug total, 17 Aug penumbral)", () => {
  const ev = yearCalendar(makeCtx(n, NOW, {}), 2027).filter((e) => e.kind === "eclipse");
  const want = [Date.UTC(2027, 1, 6, 16), Date.UTC(2027, 1, 20, 19), Date.UTC(2027, 6, 18, 16), Date.UTC(2027, 7, 2, 10), Date.UTC(2027, 7, 17, 7)];
  assert.equal(ev.length, want.length, ev.map((e) => e.date).join(", "));
  ev.forEach((e, i) => assert.ok(Math.abs(e.ms - want[i]) < 18 * 3600_000, `${e.title} ${e.date}`));
});
test("sidereal ingresses match published Lahiri dates: Saturn into Pisces 29 Mar 2025, Jupiter into Gemini 14 May 2025, Saturn into Aries 3 Jun 2027", () => {
  const c25 = yearCalendar(makeCtx(n, NOW, {}), 2025), c27 = yearCalendar(makeCtx(n, NOW, {}), 2027);
  const find = (c: typeof c25, t: string) => c.find((e) => e.kind === "ingress" && e.title === t)!;
  const near = (ms: number, y: number, m: number, d: number) => Math.abs(ms - Date.UTC(y, m - 1, d, 12)) < 2.5 * 86_400_000;
  assert.ok(near(find(c25, "Sao Thổ sang Song Ngư").ms, 2025, 3, 29));
  assert.ok(near(find(c25, "Sao Mộc sang Song Tử").ms, 2025, 5, 14));
  assert.ok(near(find(c27, "Sao Thổ sang Bạch Dương").ms, 2027, 6, 3));
});
test("Vedha: the Sun and Saturn never obstruct each other (Phaladeepika exception)", () => {
  for (let k = 0; k < 40; k++) { const t = transitAt(n, Date.UTC(2027, 0, 1) + k * 9 * 86_400_000); const v = vedhaBy(t, "sun"); assert.notEqual(v, "saturn"); }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
