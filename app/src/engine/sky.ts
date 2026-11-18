// The sky right now: used by the home page ("Bầu trời hôm nay") and for transits.
import { nakshatra } from "caelus";
import { engine, ZODIAC, jdFromMs } from "./instance.ts";
import { GRAHAS, asGraha, mod, signOf, degInSign, type GrahaId } from "./constants.ts";
import { solarToLunar } from "./lunar-vn.ts";
import type { NakshatraInfo } from "./types.ts";

export interface SkyGraha { id: GrahaId; lon: number; sign: number; deg: number; retro: boolean }
export interface SkyNow {
  ms: number;
  grahas: SkyGraha[];
  moonNak: NakshatraInfo;
  elongation: number; // Moon - Sun, 0..360
  illumination: number; // 0..1
  waxing: boolean;
  phaseName: string;
  lunar: { day: number; month: number; year: number; leap: boolean };
}

const ENGINE_BODY: Record<GrahaId, string> = {
  sun: "sun", moon: "moon", mars: "mars", mercury: "mercury", jupiter: "jupiter",
  venus: "venus", saturn: "saturn", rahu: "true_node", ketu: "true_node",
};

export function phaseName(elong: number): string {
  const e = mod(elong, 360);
  if (e < 11 || e >= 349) return "Trăng non";
  if (e < 79) return "Trăng lưỡi liềm đầu tháng";
  if (e < 101) return "Trăng thượng huyền";
  if (e < 169) return "Trăng khuyết đang đầy";
  if (e < 191) return "Trăng tròn";
  if (e < 259) return "Trăng khuyết đang vơi";
  if (e < 281) return "Trăng hạ huyền";
  return "Trăng lưỡi liềm cuối tháng";
}

export function skyAt(ms: number): SkyNow {
  const jd = jdFromMs(ms);
  const grahas: SkyGraha[] = GRAHAS.map((id) => {
    const p = engine.position(ENGINE_BODY[id], jd, { zodiac: ZODIAC });
    const lon = id === "ketu" ? mod(p.lon + 180, 360) : p.lon;
    return { id, lon, sign: signOf(lon), deg: degInSign(lon), retro: id === "rahu" || id === "ketu" ? true : p.retrograde };
  });
  const sun = grahas.find((g) => g.id === "sun")!;
  const moon = grahas.find((g) => g.id === "moon")!;
  const elongation = mod(moon.lon - sun.lon, 360);
  const n = nakshatra(moon.lon);
  // The Vietnamese calendar runs on UTC+7: use the date there.
  const vn = new Date(ms + 7 * 3_600_000);
  const lunar = solarToLunar(vn.getUTCDate(), vn.getUTCMonth() + 1, vn.getUTCFullYear(), 7);
  return {
    ms, grahas,
    moonNak: { index: n.index, name: n.name, pada: n.pada, lord: asGraha(n.lord), pos: n.pos },
    elongation,
    illumination: (1 - Math.cos((elongation * Math.PI) / 180)) / 2,
    waxing: elongation < 180,
    phaseName: phaseName(elongation),
    lunar,
  };
}
