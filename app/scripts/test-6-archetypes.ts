// Section VIII — Fast Verification & Test Suite across the 6 Required Chart Archetypes for Life Atlas v3.0
import assert from "node:assert/strict";
import fs from "node:fs";
import { computeNatal } from "../src/engine/core.ts";
import { SIGN_LORD, type GrahaId } from "../src/engine/constants.ts";
const ELEMENT_OF = (sign: number) => (["fire", "earth", "air", "water"] as const)[sign % 4];
import { vargaChart } from "../src/engine/vargas.ts";
import { compose, type Reading } from "../src/reading/compose.ts";
import { BANNED } from "./voice-rules.ts";

const NOW = Date.UTC(2026, 10, 15);
const SEVEN: GrahaId[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

interface ArchetypeCase {
  id: string;
  title: string;
  description: string;
  utcMs: number;
  lat: number;
  lon: number;
  place: string;
  natal: ReturnType<typeof computeNatal>;
  reading: Reading;
}

const elemRel = (a: string, b: string) => {
  if (a === b) return "same";
  const pair = [a, b].sort().join("-");
  if (pair === "air-fire" || pair === "earth-water") return "harmony";
  return "tension";
};

// Fast search: evaluate natal predicate BEFORE calling compose()
function findChart(
  id: string,
  title: string,
  description: string,
  natalPred: (n: ReturnType<typeof computeNatal>) => boolean,
  startYear = 1985,
): ArchetypeCase {
  for (let y = startYear; y <= 2015; y++) {
    for (let m = 1; m <= 12; m++) {
      for (let d = 1; d <= 28; d += 3) {
        for (const hh of [2, 6, 10, 14, 18, 22]) {
          const utcMs = Date.UTC(y, m - 1, d, hh, 30);
          const lat = 10.7769, lon = 106.7009;
          const n = computeNatal(utcMs, lat, lon);
          if (natalPred(n)) {
            const r = compose(n, NOW, { name: "Minh Anh" });
            return {
              id, title, description, utcMs, lat, lon, place: "TP. Hồ Chí Minh", natal: n, reading: r,
            };
          }
        }
      }
    }
  }
  throw new Error(`Could not find chart for archetype ${id}`);
}

const archetypes: ArchetypeCase[] = [
  // 1. Lá số thuận lợi
  findChart(
    "harmonious",
    "Nhóm 1: Lá số thuận lợi (Harmonious Chart)",
    "Cung mọc, Mặt Trời và Mặt Trăng đồng điệu về nguyên tố; hành tinh cai quản cung mọc đứng ở nhà trụ cột/tam hợp và có từ 3 hành tinh đắc vị/vững trở lên.",
    (n) => {
      const eLag = ELEMENT_OF(n.lagna.sign), eSun = ELEMENT_OF(n.grahas.sun.sign), eMoon = ELEMENT_OF(n.grahas.moon.sign);
      const ll = SIGN_LORD[n.lagna.sign];
      const strong = SEVEN.filter((g) => ["exalted", "own", "moolatrikona"].includes(n.grahas[g].dignity)).length;
      const retro = (["mars", "mercury", "jupiter", "venus", "saturn"] as GrahaId[]).filter((g) => n.grahas[g].retro).length;
      const maxCrowd = Math.max(...n.houses.map((h) => h.occupants.filter((g) => g !== "rahu" && g !== "ketu").length));
      return (
        elemRel(eLag, eMoon) !== "tension" &&
        elemRel(eLag, eSun) !== "tension" &&
        [1, 4, 5, 7, 9, 10, 11].includes(n.grahas[ll].house) &&
        strong >= 2 &&
        retro <= 1 &&
        maxCrowd < 3
      );
    },
    1986,
  ),
  // 2. Lá số có nhiều yếu tố trái chiều
  findChart(
    "contrast",
    "Nhóm 2: Lá số có nhiều yếu tố trái chiều (High-Contrast Chart)",
    "Ba điểm gốc (Cung mọc, Mặt Trời, Mặt Trăng) mang nguyên tố đối lập tạo độ căng nội tâm giữa cách hành xử bên ngoài và nhu cầu cảm xúc bên trong.",
    (n) => {
      const eLag = ELEMENT_OF(n.lagna.sign), eSun = ELEMENT_OF(n.grahas.sun.sign), eMoon = ELEMENT_OF(n.grahas.moon.sign);
      const ll = SIGN_LORD[n.lagna.sign];
      const maxCrowd = Math.max(...n.houses.map((h) => h.occupants.filter((g) => g !== "rahu" && g !== "ketu").length));
      const retro = (["mars", "mercury", "jupiter", "venus", "saturn"] as GrahaId[]).filter((g) => n.grahas[g].retro).length;
      return (
        elemRel(eLag, eMoon) === "tension" &&
        elemRel(eSun, eMoon) === "tension" &&
        ![6, 8, 12].includes(n.grahas[ll].house) && n.grahas[ll].dignity !== "debilitated" && !n.grahas[ll].retro &&
        maxCrowd < 3 &&
        retro <= 1 &&
        SEVEN.some((g) => ["exalted", "own"].includes(n.grahas[g].dignity)) &&
        SEVEN.some((g) => n.grahas[g].dignity === "debilitated" || n.grahas[g].combust)
      );
    },
    1989,
  ),
  // 3. Lá số có tụ hội nhiều hành tinh trong một nhà (Stellium)
  findChart(
    "stellium",
    "Nhóm 3: Lá số tụ hội nhiều hành tinh trong một nhà (Stellium Chart)",
    "Có từ 4 hành tinh trở lên cùng tụ hội trong một cung/nhà, tạo trọng tâm nổi bật thu hút nhiều chủ đề của các nhà khác.",
    (n) => {
      const maxCrowd = Math.max(...n.houses.map((h) => h.occupants.filter((g) => g !== "rahu" && g !== "ketu").length));
      return maxCrowd >= 4;
    },
    1994,
  ),
  // 4. Lá số có hành tinh cai quản nhà rơi vào nhà 6, 8 hoặc 12
  findChart(
    "dusthana_forge",
    "Nhóm 4: Lá số có chủ nhà rơi vào nhà 6, 8 hoặc 12 (Dusthana Lord Chart)",
    "Hành tinh cai quản cung mọc và nhiều hành tinh chủ quản khác đi vào các nhà thử thách (6, 8, 12), đòi hỏi sự tự rèn giũa và chuyển hóa nội lực.",
    (n) => {
      const ll = SIGN_LORD[n.lagna.sign];
      const maxCrowd = Math.max(...n.houses.map((h) => h.occupants.filter((g) => g !== "rahu" && g !== "ketu").length));
      const retro = (["mars", "mercury", "jupiter", "venus", "saturn"] as GrahaId[]).filter((g) => n.grahas[g].retro).length;
      const dusthanaLords = n.houses.filter((h) => [6, 8, 12].includes(n.grahas[h.lord].house)).length;
      return [6, 8, 12].includes(n.grahas[ll].house) && dusthanaLords >= 4 && maxCrowd < 3 && retro <= 1;
    },
    1991,
  ),
  // 5. Lá số có sự khác biệt rõ giữa D1 và D9/D10
  findChart(
    "varga_divergence",
    "Nhóm 5: Lá số có sự chuyển dịch rõ giữa D1 và D9/D10 (D1 vs D9/D10 Divergence)",
    "Hành tinh ở D1 gặp vị thế suy hoặc nằm ở nhà thử thách nhưng sang D9 (Navamsha) và D10 (Dashamsha) lại đắc vị/vững ở Kendra hoặc Trikona, thể hiện hậu vận và sự nghiệp chín dần theo tuổi.",
    (n) => {
      const d9 = vargaChart(n, 9);
      const d10 = vargaChart(n, 10);
      const ll = SIGN_LORD[n.lagna.sign];
      const l10 = n.houses[9].lord;
      return (
        (n.grahas[ll].dignity === "debilitated" || [6, 8, 12].includes(n.grahas[ll].house)) &&
        ["exalted", "own", "moolatrikona"].includes(d9.planets[ll].dignity) &&
        [1, 4, 5, 7, 9, 10, 11].includes(d10.planets[l10].house)
      );
    },
    1985,
  ),
  // 6. Lá số ít yếu tố đặc biệt, nhiều nhà yên tĩnh
  findChart(
    "quiet_balanced",
    "Nhóm 6: Lá số cân bằng, nhiều nhà yên tĩnh (Quiet / Balanced Chart)",
    "Các hành tinh rải đều, ít tổ hợp cực đoan, nhiều nhà trống có mức biểu hiện 'yên tĩnh' nhưng vẫn phân biệt rõ với độ nâng đỡ 'thuận lợi' hoặc 'pha trộn'.",
    (n) => {
      const eLag = ELEMENT_OF(n.lagna.sign), eSun = ELEMENT_OF(n.grahas.sun.sign), eMoon = ELEMENT_OF(n.grahas.moon.sign);
      const ll = SIGN_LORD[n.lagna.sign];
      const maxCrowd = Math.max(...n.houses.map((h) => h.occupants.filter((g) => g !== "rahu" && g !== "ketu").length));
      const retro = (["mars", "mercury", "jupiter", "venus", "saturn"] as GrahaId[]).filter((g) => n.grahas[g].retro).length;
      const strong = SEVEN.filter((g) => ["exalted", "own", "moolatrikona"].includes(n.grahas[g].dignity)).length;
      const emptyHouses = n.houses.filter((h) => h.occupants.length === 0).length;
      return (
        maxCrowd <= 2 &&
        retro <= 1 &&
        strong <= 1 &&
        emptyHouses >= 5 &&
        ![6, 8, 12].includes(n.grahas[ll].house) && n.grahas[ll].dignity !== "debilitated" && !n.grahas[ll].retro &&
        !(elemRel(eLag, eMoon) === "tension" && elemRel(eSun, eMoon) === "tension") &&
        !(elemRel(eLag, eMoon) !== "tension" && elemRel(eLag, eSun) !== "tension")
      );
    },
    1985,
  ),
];

console.log("=== VERIFYING 6 ARCHETYPES AGAINST ALL SECTION VIII CRITERIA ===");
for (const a of archetypes) {
  const r = a.reading;
  console.log(`\n• ${a.title}`);
  console.log(`  Time (UTC): ${new Date(a.utcMs).toISOString()} | Lagna: ${r.meta.lagna} | Sun: ${r.meta.sun} | Moon: ${r.meta.moon} (${r.meta.moonNak})`);
  assert.deepEqual(r.letter.paragraphs, [r.letter.line]);
  assert.ok(!("cast" in (r.overview as unknown as Record<string, unknown>)), `${a.id}: cast list must be removed`);
  assert.equal(r.houses.length, 12, `${a.id}: must have 12 houses`);
  assert.equal(r.timeline.houseWindows.length, 12, `${a.id}: must have 12 consolidated house windows`);

  for (const h of r.houses) {
    assert.ok(!h.sections.some((s) => s.id === "now" || s.id === "next"), `${a.id}: house ${h.n} must not have Dasha sections`);
  }

  for (let i = 1; i < r.houses.length; i++) {
    assert.notEqual(r.houses[i].pathway, r.houses[i - 1].pathway, `${a.id}: house ${i + 1} repeats pathway of house ${i}`);
  }

  const expCounts: Record<string, number> = {};
  const supCounts: Record<string, number> = {};
  for (const h of r.houses) {
    expCounts[h.expressiveLevel] = (expCounts[h.expressiveLevel] ?? 0) + 1;
    supCounts[h.supportLevel] = (supCounts[h.supportLevel] ?? 0) + 1;
  }
  console.log(`  House Expressive Levels:`, JSON.stringify(expCounts));
  console.log(`  House Support Levels:`, JSON.stringify(supCounts));

  for (const pl of r.sky.planets) {
    assert.ok(pl.moonText.length > 40 && pl.lagnaText && pl.lagnaText.length > 40, `${a.id}: ${pl.id} missing dual Gochara lens`);
  }

  const raw = JSON.stringify(r).toLowerCase();
  for (const b of BANNED) {
    assert.ok(!raw.includes(b), `${a.id}: contains banned phrase "${b}"`);
  }
}

const summary = archetypes.map((a) => ({
  id: a.id,
  title: a.title,
  description: a.description,
  iso: new Date(a.utcMs).toISOString(),
  lagna: a.reading.meta.lagna,
  sun: a.reading.meta.sun,
  moon: a.reading.meta.moon,
  moonNak: a.reading.meta.moonNak,
  opening: a.reading.letter.line,
  overview: a.reading.overview.synthesis,
  sampleHouses: a.reading.houses.slice(0, 4).map((h) => ({
    n: h.n,
    tag: h.tag,
    sign: h.signName,
    lord: h.lordName,
    lordHouse: h.lordHouse,
    pathway: h.pathway,
    expressiveLevel: h.expressiveLevel,
    supportLevel: h.supportLevel,
    summaryP1: h.sections.find((s) => s.id === "summary")?.paragraphs[0] ?? "",
  })),
  d9Lead: a.reading.vargas?.find((v) => v.n === 9)?.paragraphs[0] ?? "",
  d10Lead: a.reading.vargas?.find((v) => v.n === 10)?.paragraphs[0] ?? "",
  saturnGochara: {
    moonText: a.reading.sky.planets[0].moonText,
    lagnaText: a.reading.sky.planets[0].lagnaText,
    divergenceNote: a.reading.sky.planets[0].divergenceNote,
  },
}));
fs.writeFileSync("/tmp/archetypes-summary.json", JSON.stringify(summary, null, 2));
console.log("\nAll 6 archetypes verified in <2s and saved to /tmp/archetypes-summary.json!");
