// Life Atlas v3.0 — House narrative composer with 5 deterministic narrative pathways
// and explicit separation of expressive intensity vs. supportiveness.
import { SIGNS, DUSTHANA, type GrahaId } from "../engine/constants.ts";
import { savBand } from "../engine/ashtakavarga.ts";
import { dashaChildren, dashaMahas, dashaOrigin, levelTrust } from "../engine/dasha5.ts";
import { YEAR_MS } from "../engine/core.ts";
import type { HouseInfo, Natal } from "../engine/types.ts";
import type { Ctx } from "./ctx.ts";
import { friendGrade, trustAt } from "./timeline.ts";
import { isBenefic, lordState } from "./shared.ts";
import { HOUSE_TAG } from "./content/houses-signs.ts";
import { PLANET_IN_HOUSE } from "./content/planet-in-house.ts";
import { LORD_IN } from "./content/lord-in-house.ts";
import { SIGN_ON_HOUSE_DEEP } from "./content/house-voice.ts";
import { WHY_CA_HAI, WHY_CAI_QUAN, WHY_O_TRONG } from "./content/house-deep.ts";
import {
  STORY_LORD_LINK, STORY_LORD_HOME, STORY_STATE, STORY_REL, STORY_TOGETHER, STORY_MANY, STORY_EMPTY, STORY_COST_ONE, STORY_COST_MANY,
  STORY_VIEW_ONE, STORY_VIEW_MANY, STORY_SEEK, STORY_NEXT_INTRO, STORY_NEXT_MAHA, STORY_NEXT_ANTAR, STORY_NEXT_NOW, STORY_NEXT_APPROX, STORY_NEXT_HINT, STORY_NEXT_NONE,
} from "./content/story.ts";
import { DASHA_PLANET } from "./content/dasha-story.ts";
import { CONJ_LINE, conjOf } from "./content/conjunctions.ts";
import { domain, fill, joinVi, lowerFirst, mmYYYY, nameOf, ageAt } from "./util.ts";

export interface Beats { nature: string; seek: string; cost: string; view: string; extra: string[] }

export function beats(atom: string): Beats {
  const parts = atom.split(/(?<=\.)\s+/).filter(Boolean);
  const out: Beats = { nature: parts[0] ?? "", seek: "", cost: "", view: "", extra: [] };
  const m = out.nature.match(/,\s*còn bạn tìm\s+(.+?)\.?$/);
  if (m) { out.seek = m[1]; out.nature = out.nature.slice(0, m.index) + "."; }
  for (const p of parts.slice(1)) {
    if (!out.cost && /^Cái giá/.test(p)) out.cost = p;
    else if (!out.view && /^Người ngoài/.test(p)) out.view = p;
    else out.extra.push(p);
  }
  return out;
}

const stripCost = (s: string) => s.replace(/^Cái giá là\s+/, "").replace(/\.$/, "");
const stripView = (s: string) => s.replace(/^Người ngoài thấy\s+/, "").replace(/\.$/, "");

export function stateLine(n: Natal, g: GrahaId): string | null {
  const gr = n.grahas[g];
  const x = nameOf(g);
  if (gr.dignity === "exalted" || gr.dignity === "own" || gr.dignity === "moolatrikona") return fill(STORY_STATE.strong, { x });
  if (gr.dignity === "debilitated") return fill(STORY_STATE.weak, { x });
  if (gr.dignity === "enemy") return fill(STORY_STATE.enemy, { x });
  if (gr.combust && g !== "sun") return fill(STORY_STATE.combust, { x });
  if (gr.retro && g !== "rahu" && g !== "ketu") return fill(STORY_STATE.retro, { x });
  return null;
}

// ---------------------------------------------------------------- when the house lights up (used by timeline.ts in Đại vận chapter)

/** The next periods in which the planet that rules the house, or a planet inside it, runs the dasha. Only periods that can be trusted. */
export function lightWindows(ctx: Ctx, h: HouseInfo, max = 3): string[] {
  const rel = new Set<GrahaId>([h.lord, ...h.occupants]);
  const why = (g: GrahaId) => (g === h.lord ? (h.occupants.includes(g) ? WHY_CA_HAI : WHY_CAI_QUAN) : WHY_O_TRONG);
  const origin = dashaOrigin(ctx.n.grahas.moon.lon, ctx.n.utcMs);
  const horizon = ctx.now + 20 * YEAR_MS;
  const found: { at: number; lord: GrahaId; running: boolean; text: string }[] = [];
  for (const m of dashaMahas(origin, 12)) {
    if (m.endMs < ctx.now) continue;
    if (m.startMs > horizon) break;
    const running = (a: { startMs: number; endMs: number }) => ctx.now >= a.startMs && ctx.now < a.endMs;
    if (rel.has(m.lord) && levelTrust(1, ctx.rel) !== "chỉ tham khảo") {
      found.push({
        at: m.startMs, lord: m.lord, running: running(m),
        text: fill(STORY_NEXT_MAHA, { p: nameOf(m.lord), why: why(m.lord), from: mmYYYY(m.startMs), to: mmYYYY(m.endMs), a: Math.max(0, Math.round(ageAt(ctx.n, m.startMs))), b: Math.round(ageAt(ctx.n, m.endMs)) }) + (running(m) ? STORY_NEXT_NOW : ""),
      });
    }
    for (const a of dashaChildren(m)) {
      if (a.endMs < ctx.now || a.startMs > horizon || !rel.has(a.lord)) continue;
      const trust = trustAt(ctx, (a.startMs + a.endMs) / 2, 2);
      if (trust === "chỉ tham khảo") continue;
      found.push({
        at: a.startMs, lord: a.lord, running: running(a),
        text: fill(STORY_NEXT_ANTAR, { p: nameOf(a.lord), why: why(a.lord), from: mmYYYY(a.startMs), to: mmYYYY(a.endMs), m: nameOf(m.lord) })
          + (running(a) ? STORY_NEXT_NOW : "") + (trust === "gần đúng" ? STORY_NEXT_APPROX : ""),
      });
    }
  }
  found.sort((x, y) => x.at - y.at);
  const hinted = new Set<GrahaId>();
  const list = found.slice(0, max).map((f) => {
    if (f.running || hinted.has(f.lord)) return f.text;
    hinted.add(f.lord);
    return f.text + fill(STORY_NEXT_HINT, { e1: DASHA_PLANET[f.lord].events[0], e2: DASHA_PLANET[f.lord].events[1], dH: domain(h.n) });
  });
  return list.length ? [STORY_NEXT_INTRO, ...list] : [fill(STORY_NEXT_NONE, { dH: domain(h.n) })];
}
