// The opening film of Life Atlas, drawn frame by frame on one canvas. Nothing here is a photo or a video:
// every star, the temple, the observer, the palm leaves, the orbits and the chart are drawn in code.
// The three Sanskrit words are real outlines from Noto Serif Devanagari (see intro-deva.ts).
// Scenes (seconds): 1 sky 0–7 · 2 ancient observers 7–15 · 3 orbits 15–23 · 4 the chart 23–31 · 5 a quiet moment 31–39 · 6 Life Atlas 39–45.
// No birth data is used: the planets in the chart are placed for the picture only.

import { DEVA } from "./intro-deva.ts";

type RGB = [number, number, number];
const GOLD: RGB = [213, 180, 119], PARCH: RGB = [233, 213, 172], WARM: RGB = [255, 196, 120], WHITE: RGB = [255, 246, 226];
const NAVY = "#080D1F";
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, t: number) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const easeIO = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const bump = (t: number, at: number, rise: number, fall: number) => smooth(at - rise, at, t) * (1 - smooth(at, at + fall, t));
function keys(k: [number, number][], t: number) {
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) if (t <= k[i][0]) { const [t0, v0] = k[i - 1], [t1, v1] = k[i]; return lerp(v0, v1, smooth(t0, t1, t)); }
  return k[k.length - 1][1];
}
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${clamp(a).toFixed(3)})`;
function mulberry(a: number) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function gauss(r: () => number) { let u = 0; while (!u) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }
function sprite(c: RGB, size = 64) {
  const cv = document.createElement("canvas"); cv.width = cv.height = size;
  const g = cv.getContext("2d")!; const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gr.addColorStop(0, rgba(c, 1)); gr.addColorStop(0.16, rgba(c, 0.55)); gr.addColorStop(0.45, rgba(c, 0.13)); gr.addColorStop(1, rgba(c, 0));
  g.fillStyle = gr; g.fillRect(0, 0, size, size); return cv;
}

export const FILM_END = 44.3; // the button appears; the last frame keeps breathing after this
export interface FilmLayout { ringX: number; ringY: number; ringR: number; short: boolean }

interface Star { x: number; y: number; z: number; b: number; hue: number; on: number }
interface Gal { r: number; a: number; d: number; b: number; warm: boolean; s: number }
interface Ink { sx: number; sy: number; ring: number; th: number; delay: number; curl: number }
interface Spark { u: number; v: number; delay: number; rx: number; ry: number }
interface Dust { x: number; y: number; z: number; b: number; ph: number }

const PLANETS = [
  // ring, size (world units), colour, house in the picture chart (not anyone's chart)
  { id: "moon", ring: 0, size: 0.05, c: [214, 228, 255] as RGB, house: 4, w: 0.5 },
  { id: "mercury", ring: 1, size: 0.032, c: [120, 228, 192] as RGB, house: 11, w: 0.41 },
  { id: "venus", ring: 2, size: 0.045, c: [255, 192, 226] as RGB, house: 9, w: 0.34 },
  { id: "sun", ring: 3, size: 0.085, c: [255, 214, 120] as RGB, house: 10, w: 0.27 },
  { id: "mars", ring: 4, size: 0.04, c: [255, 132, 116] as RGB, house: 3, w: 0.22 },
  { id: "jupiter", ring: 5, size: 0.066, c: [255, 216, 116] as RGB, house: 1, w: 0.16 },
  { id: "saturn", ring: 6, size: 0.058, c: [166, 190, 236] as RGB, house: 7, w: 0.12 },
];
const RING_R = [0.36, 0.49, 0.62, 0.76, 0.9, 1.05, 1.2, 1.38];
const CH = 0.9; // half-size of the chart
const HOUSE_UV: Record<number, [number, number]> = {
  1: [0, -0.5], 2: [-0.5, -0.833], 3: [-0.833, -0.5], 4: [-0.5, 0], 5: [-0.833, 0.5], 6: [-0.5, 0.833],
  7: [0, 0.5], 8: [0.5, 0.833], 9: [0.833, 0.5], 10: [0.5, 0], 11: [0.833, -0.5], 12: [0.5, -0.833],
};

export function createFilm(canvas: HTMLCanvasElement, quality: number) {
  const maybe = canvas.getContext("2d", { alpha: false });
  if (!maybe) throw new Error("canvas unavailable");
  const ctx: CanvasRenderingContext2D = maybe;
  const rnd = mulberry(20261117);
  const q = quality;
  let w = 0, h = 0, S = 0, cx = 0, cy = 0, dpr = 1, portrait = false;
  const lay: FilmLayout = { ringX: 0, ringY: 0, ringR: 0, short: false };
  let vignette: CanvasGradient | null = null;

  const SP = {
    gold: sprite(GOLD), parch: sprite(PARCH), warm: sprite(WARM), white: sprite(WHITE),
    violet: sprite([150, 122, 236]), blue: sprite([150, 170, 255]),
  };
  const planetSprite = new Map(PLANETS.map((p) => [p.id, sprite(p.c)]));
  const nodeSprite = sprite([196, 164, 255]);

  // ---- data, made once
  const stars: Star[] = Array.from({ length: Math.round(950 * q) }, () => ({
    x: (rnd() * 2 - 1) * 1.7, y: (rnd() * 2 - 1) * 1.7, z: 0.06 + rnd() * 0.94, b: rnd(),
    hue: rnd() < 0.68 ? 0 : rnd() < 0.6 ? 1 : 2, on: 1.1 + Math.pow(rnd(), 0.7) * 3.8,
  }));
  const STAR_C: RGB[] = [[242, 236, 222], [236, 210, 156], [178, 184, 255]];
  const galaxy: Gal[] = Array.from({ length: Math.round(1500 * q) }, () => {
    const core = rnd() < 0.2;
    if (core) { const r = Math.abs(gauss(rnd)) * 0.09; return { r, a: rnd() * Math.PI * 2, d: 0.85 + rnd() * 0.3, b: rnd(), warm: true, s: 0.6 + rnd() * 0.9 }; }
    const rr = Math.pow(rnd(), 0.62); const arm = rnd() < 0.5 ? 0 : Math.PI;
    return { r: rr + gauss(rnd) * 0.03, a: arm + rr * 4.4 + gauss(rnd) * 0.32 * (1.1 - rr * 0.5), d: 0.8 + rnd() * 0.4, b: rnd(), warm: rr < 0.22 || rnd() < 0.15, s: 0.5 + rnd() * 1.1 };
  });
  const band = Array.from({ length: Math.round(800 * q) }, () => ({ u: rnd(), n: gauss(rnd) * 0.5, b: rnd(), warm: rnd() < 0.3, s: 0.5 + rnd() }));
  const sky5 = Array.from({ length: Math.round(260 * q) }, () => ({ x: rnd(), y: Math.pow(rnd(), 1.25), b: rnd(), tw: 0.5 + rnd() * 1.8, ph: rnd() * 6.28 }));
  const dust: Dust[] = Array.from({ length: Math.round(110 * q) }, () => ({ x: rnd(), y: rnd(), z: 0.3 + rnd() * 0.7, b: rnd(), ph: rnd() * 6.28 }));
  const hills = Array.from({ length: 48 }, (_, i) => 0.5 + 0.3 * Math.sin(i * 0.7) + 0.25 * Math.sin(i * 1.9 + 1) + rnd() * 0.18);
  const ridge = Array.from({ length: 64 }, (_, i) => 0.4 + 0.35 * Math.sin(i * 0.33 + 2) + 0.2 * Math.sin(i * 1.3) + rnd() * 0.12);
  const WORDS = (["jyotisa", "navagraha", "naksatra"] as const).map((k) => ({ ...DEVA[k], p: new Path2D(DEVA[k].d) }));
  const inks: Ink[] = [];
  WORDS.forEach((wd, k) => wd.pts.forEach((_, j) => {
    if (j % (q < 0.8 ? 2 : 1)) return;
    inks.push({ sx: k, sy: j, ring: Math.floor(rnd() * 8), th: rnd() * Math.PI * 2, delay: rnd() * 0.9, curl: rnd() - 0.5 });
  }));
  // sample points on the chart lines, for the moment the chart dissolves into light
  const sparks: Spark[] = [];
  const addLine = (u0: number, v0: number, u1: number, v1: number, n: number) => {
    for (let i = 0; i < n; i++) { const k = rnd(); sparks.push({ u: lerp(u0, u1, k), v: lerp(v0, v1, k), delay: rnd() * 1.3, rx: rnd() - 0.5, ry: rnd() }); }
  };
  const nS = q < 0.8 ? 0.6 : 1;
  addLine(-CH, -CH, CH, -CH, 40 * nS); addLine(CH, -CH, CH, CH, 40 * nS); addLine(CH, CH, -CH, CH, 40 * nS); addLine(-CH, CH, -CH, -CH, 40 * nS);
  addLine(0, -CH, CH, 0, 26 * nS); addLine(CH, 0, 0, CH, 26 * nS); addLine(0, CH, -CH, 0, 26 * nS); addLine(-CH, 0, 0, -CH, 26 * nS);
  addLine(-CH, -CH, CH, CH, 50 * nS); addLine(CH, -CH, -CH, CH, 50 * nS);
  const orbitDust = Array.from({ length: Math.round(140 * q) }, () => ({ ring: Math.floor(rnd() * 8), th: rnd() * 6.28, b: rnd() }));

  // ---- layout
  function resize(cw: number, chh: number) {
    w = cw; h = chh; S = Math.min(w, h); cx = w / 2; cy = h / 2; portrait = h > w * 1.05;
    dpr = Math.min(window.devicePixelRatio || 1, q < 0.8 ? 1 : 1.6);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const short = !portrait && h < 560;
    lay.short = short;
    lay.ringX = short ? w * 0.3 : w / 2;
    lay.ringY = short ? h * 0.5 : portrait ? h * 0.37 : h * 0.4;
    lay.ringR = short ? Math.min(h * 0.33, w * 0.2) : Math.min(w * 0.36, h * (portrait ? 0.2 : 0.27));
    vignette = ctx!.createRadialGradient(cx, cy, S * 0.35, cx, cy, Math.hypot(w, h) * 0.62);
    vignette.addColorStop(0, "rgba(4,6,16,0)"); vignette.addColorStop(1, "rgba(4,6,16,0.78)");
    return { ...lay };
  }

  const glow = (img: HTMLCanvasElement, x: number, y: number, r: number, a: number) => {
    if (a <= 0.003 || r <= 0.2) return;
    ctx.globalAlpha = clamp(a); ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
  };

  // ---- camera for the orbits and the chart (scenes 3 and 4)
  function cam(t: number) {
    const yaw = t < 23 ? 0.2 + 0.09 * (t - 15) : lerp(0.92, Math.PI / 2, easeIO(smooth(23, 29.5, t)));
    const pitch = keys([[15, 1.2], [23, 0.4], [29.5, Math.PI / 2]], t);
    const D = keys([[15, 4.3], [22.6, 1.45], [23.4, 1.45], [28.2, portrait ? 2.7 : 2.95]], t);
    const f = S * (portrait ? 1.0 : 0.95);
    return { yaw, pitch, D, f, ox: cx, oy: h * (portrait ? 0.45 : 0.47) + Math.sin(t * 0.6) * S * 0.006 };
  }
  type Cam = ReturnType<typeof cam>;
  function proj(x: number, y: number, z: number, c: Cam): [number, number, number] | null {
    const cs = Math.cos(c.yaw), sn = Math.sin(c.yaw);
    const x1 = x * cs - z * sn, z1 = x * sn + z * cs;
    const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
    const y2 = y * cp + z1 * sp, z2 = -y * sp + z1 * cp;
    const dep = c.D + z2;
    if (dep < 0.16) return null;
    return [c.ox + (x1 * c.f) / dep, c.oy - (y2 * c.f) / dep, dep];
  }
  const chartWorld = (u: number, v: number): [number, number, number] => [-v, 0, -u];
  function ringPoint(i: number, th: number, t: number): [number, number, number] {
    const conv = smooth(23.4, 26.4, t), m = smooth(25.2, 28.2, t);
    const r = lerp(RING_R[i], CH, conv);
    const c = Math.cos(th), s = Math.sin(th);
    const shape = i < 4 ? 1 / (Math.abs(c) + Math.abs(s)) : 1 / Math.max(Math.abs(c), Math.abs(s));
    const k = lerp(1, shape, m);
    // the rings live in chart space from the start, so a circle can turn into the square or the diamond without twisting
    return chartWorld(r * k * c, r * k * s);
  }
  function nodePoint(th: number, t: number): [number, number, number] {
    const r = lerp(RING_R[7], CH, smooth(23.4, 26.4, t)), inc = 0.3, beta = -0.05 * (t - 15);
    const x = r * Math.cos(th), z0 = r * Math.sin(th);
    const y = z0 * Math.sin(inc), z = z0 * Math.cos(inc);
    return [x * Math.cos(beta) - z * Math.sin(beta), y, x * Math.sin(beta) + z * Math.cos(beta)];
  }

  // ---- scene 2 helpers
  const pan2 = (t: number) => S * lerp(0.16, -0.16, smooth(7, 15, t));
  const horizon2 = () => h * (portrait ? 0.63 : 0.66);
  function leafGeo(i: number, t: number) {
    const lw = portrait ? w * 0.9 : Math.min(Math.max(w * 0.84, S * 1.12), 1150), lh = Math.min(lw * (portrait ? 0.19 : 0.15), h * 0.2), gap = lh * 0.34;
    const rise = h * 0.8 * (1 - easeIO(smooth(10.6, 12.4, t)));
    const top = cy - (3 * lh + 2 * gap) / 2 + rise;
    const over = Math.max(0, lw - w * 0.9) / 2;
    const sweep = portrait ? lw * 0.04 : lw * 0.1 + over;
    const pan = lerp(sweep, -sweep, smooth(11, 15.2, t));
    return { x: cx + pan + (portrait ? 0 : [-0.04, 0.05, -0.02][i] * lw), y: top + i * (lh + gap) + lh / 2, lw, lh, rot: [-0.02, 0.012, -0.008][i] };
  }
  function wordPlace(k: number, t: number) {
    const L = leafGeo(k, t); const fs = L.lh * 0.6; const wd = WORDS[k];
    const offset = k === 1 ? L.lw * 0.08 : 0;
    return { L, fs, ox: offset - (wd.w * fs) / 2, base: fs * 0.3 };
  }
  function inkStart(k: number, j: number) {
    const P = wordPlace(k, 14.7); const [px, py] = WORDS[k].pts[j];
    const lx = P.ox + px * P.fs, ly = P.base + py * P.fs; const c = Math.cos(P.L.rot), s = Math.sin(P.L.rot);
    return [P.L.x + lx * c - ly * s, P.L.y + lx * s + ly * c];
  }

  function drawTemple(x: number, base: number, W: number, H: number, light: number) {
    ctx.beginPath();
    // plinth in two steps
    ctx.rect(x - W * 1.55, base - H * 0.035, W * 2.6, H * 0.035);
    ctx.rect(x - W * 1.4, base - H * 0.07, W * 2.3, H * 0.036);
    // mandapa with a stepped roof
    const mx = x - W * 0.95;
    ctx.rect(mx - W * 0.38, base - H * 0.24, W * 0.76, H * 0.17);
    for (let i = 0; i < 4; i++) { const ww = W * (0.46 - i * 0.1); ctx.rect(mx - ww, base - H * (0.27 + i * 0.045), ww * 2, H * 0.046); }
    ctx.moveTo(mx + W * 0.04, base - H * 0.462); ctx.arc(mx, base - H * 0.462, W * 0.04, 0, Math.PI * 2);
    // the tower (a Nagara shikhara): a straight wall, then a convex curve to the ribbed stone disc (amalaka) and the finial
    const b = base - H * 0.07, wall = H * 0.2;
    const tower = (tx: number, tw: number, th: number, top: number) => {
      ctx.moveTo(tx - tw / 2, b); ctx.lineTo(tx - tw / 2, b - top);
      ctx.bezierCurveTo(tx - tw * 0.53, b - top - th * 0.42, tx - tw * 0.36, b - top - th * 0.82, tx - tw * 0.16, b - top - th);
      ctx.lineTo(tx + tw * 0.16, b - top - th);
      ctx.bezierCurveTo(tx + tw * 0.36, b - top - th * 0.82, tx + tw * 0.53, b - top - th * 0.42, tx + tw / 2, b - top);
      ctx.lineTo(tx + tw / 2, b); ctx.closePath();
    };
    const disc = (ex: number, ey: number, rx: number, ry: number) => { ctx.moveTo(ex + rx, ey); ctx.ellipse(ex, ey, rx, ry, 0, 0, Math.PI * 2); };
    ctx.fillStyle = "#060918"; ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = rgba(GOLD, 0.14 * light); ctx.stroke();
    // two half-towers behind, then the main tower in front
    ctx.beginPath();
    for (const sx of [-0.42, 0.42]) { tower(x + W * sx, W * 0.36, H * 0.3, wall * 0.9); disc(x + W * sx, b - wall * 0.9 - H * 0.31, W * 0.08, H * 0.012); }
    ctx.fillStyle = "#070b1c"; ctx.fill(); ctx.strokeStyle = rgba(GOLD, 0.1 * light); ctx.stroke();
    ctx.beginPath();
    tower(x, W, H * 0.66, wall);
    const topY = b - wall - H * 0.66;
    disc(x, topY - H * 0.018, W * 0.21, H * 0.026);
    ctx.moveTo(x + W * 0.05, topY - H * 0.06); ctx.arc(x, topY - H * 0.06, W * 0.05, 0, Math.PI * 2);
    ctx.rect(x - W * 0.008, topY - H * 0.12, W * 0.016, H * 0.06);
    ctx.fillStyle = "#060918"; ctx.fill();
    ctx.strokeStyle = rgba(GOLD, 0.14 * light); ctx.stroke();
    // horizontal courses and vertical ribs on the main tower
    ctx.strokeStyle = rgba(GOLD, 0.07 * light);
    for (let i = 1; i < 8; i++) {
      const k = i / 8, yy = b - wall - H * 0.66 * k, half = W * lerp(0.5, 0.17, Math.pow(k, 1.6));
      ctx.beginPath(); ctx.moveTo(x - half, yy); ctx.lineTo(x + half, yy); ctx.stroke();
    }
    for (const r of [-0.22, 0, 0.22]) {
      ctx.beginPath(); ctx.moveTo(x + W * r, b - wall);
      ctx.quadraticCurveTo(x + W * r * 0.95, b - wall - H * 0.4, x + W * r * 0.35, b - wall - H * 0.64); ctx.stroke();
    }
    // lamplight between the pillars of the mandapa
    ctx.fillStyle = rgba(WARM, 0.32 * light);
    for (let i = 0; i < 3; i++) ctx.fillRect(mx - W * 0.27 + i * W * 0.2, base - H * 0.2, W * 0.08, H * 0.11);
    glow(SP.warm, mx, base - H * 0.15, W * 0.7, 0.18 * light);
  }

  function drawObserver(x: number, feet: number, H: number, light: number) {
    ctx.beginPath();
    ctx.moveTo(x - 0.17 * H, feet);
    ctx.quadraticCurveTo(x - 0.14 * H, feet - 0.5 * H, x - 0.08 * H, feet - 0.78 * H);
    ctx.quadraticCurveTo(x - 0.03 * H, feet - 0.85 * H, x + 0.03 * H, feet - 0.83 * H);
    ctx.quadraticCurveTo(x + 0.11 * H, feet - 0.78 * H, x + 0.12 * H, feet - 0.6 * H);
    ctx.quadraticCurveTo(x + 0.15 * H, feet - 0.3 * H, x + 0.17 * H, feet);
    ctx.closePath();
    ctx.moveTo(x + 0.1 * H, feet - 0.92 * H); ctx.arc(x + 0.035 * H, feet - 0.92 * H, 0.068 * H, 0, Math.PI * 2);
    ctx.moveTo(x - 0.0 * H, feet - 0.97 * H); ctx.ellipse(x - 0.035 * H, feet - 0.965 * H, 0.04 * H, 0.032 * H, -0.5, 0, Math.PI * 2);
    ctx.fillStyle = "#03050c"; ctx.fill();
    ctx.strokeStyle = rgba(GOLD, 0.2 * light); ctx.lineWidth = 1; ctx.stroke();
    // the raised arm, pointing at the stars
    ctx.beginPath(); ctx.moveTo(x + 0.06 * H, feet - 0.75 * H);
    ctx.quadraticCurveTo(x + 0.19 * H, feet - 0.86 * H, x + 0.27 * H, feet - 1.08 * H);
    ctx.lineCap = "round"; ctx.lineWidth = 0.05 * H; ctx.strokeStyle = "#03050c"; ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = rgba(GOLD, 0.16 * light);
    ctx.beginPath(); ctx.moveTo(x + 0.1 * H, feet - 0.82 * H); ctx.quadraticCurveTo(x + 0.21 * H, feet - 0.9 * H, x + 0.285 * H, feet - 1.1 * H); ctx.stroke();
  }

  function drawWanderer(x: number, feet: number, H: number, a: number) {
    // a person seen from behind, a shawl over the shoulders, head raised to the sky
    ctx.beginPath();
    ctx.moveTo(x - 0.15 * H, feet);
    ctx.bezierCurveTo(x - 0.17 * H, feet - 0.3 * H, x - 0.2 * H, feet - 0.55 * H, x - 0.19 * H, feet - 0.68 * H);
    ctx.quadraticCurveTo(x - 0.18 * H, feet - 0.77 * H, x - 0.06 * H, feet - 0.8 * H);
    ctx.lineTo(x - 0.035 * H, feet - 0.84 * H);
    ctx.lineTo(x + 0.035 * H, feet - 0.84 * H);
    ctx.lineTo(x + 0.06 * H, feet - 0.8 * H);
    ctx.quadraticCurveTo(x + 0.18 * H, feet - 0.77 * H, x + 0.19 * H, feet - 0.68 * H);
    ctx.bezierCurveTo(x + 0.2 * H, feet - 0.55 * H, x + 0.17 * H, feet - 0.3 * H, x + 0.15 * H, feet);
    ctx.closePath();
    ctx.moveTo(x + 0.068 * H, feet - 0.905 * H); ctx.ellipse(x, feet - 0.91 * H, 0.066 * H, 0.074 * H, 0.12, 0, Math.PI * 2);
    ctx.fillStyle = "#02040b"; ctx.globalAlpha = a; ctx.fill();
    ctx.strokeStyle = rgba(PARCH, 0.24); ctx.lineWidth = 1; ctx.stroke();
    // the fold of the shawl
    ctx.strokeStyle = rgba(PARCH, 0.08); ctx.beginPath();
    ctx.moveTo(x - 0.17 * H, feet - 0.66 * H); ctx.quadraticCurveTo(x, feet - 0.5 * H, x + 0.16 * H, feet - 0.62 * H); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function strokeProgress(pts: [number, number][], prog: number) {
    if (prog <= 0 || pts.length < 2) return;
    const n = (pts.length - 1) * clamp(prog);
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i <= Math.floor(n); i++) ctx.lineTo(pts[i][0], pts[i][1]);
    const fr = n - Math.floor(n), i0 = Math.floor(n);
    if (fr > 0 && i0 + 1 < pts.length) ctx.lineTo(lerp(pts[i0][0], pts[i0 + 1][0], fr), lerp(pts[i0][1], pts[i0 + 1][1], fr));
    ctx.stroke();
  }

  // ---- one frame
  function frame(t: number) {
    const c = ctx!;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
    c.fillStyle = NAVY; c.fillRect(0, 0, w, h);

    const sc2 = smooth(6.8, 7.6, t) * (1 - smooth(14.8, 16.0, t));
    const land = sc2 * (1 - smooth(10.6, 12.2, t));
    const lift = -h * 0.8 * easeIO(smooth(10.6, 12.4, t));
    const sc5 = smooth(31.0, 32.8, t) * (1 - smooth(38.4, 39.8, t));
    const pan = pan2(t);

    // sky light for scenes 2 and 5
    const skyA = Math.max(land, sc5);
    if (skyA > 0.01) {
      const hz = t < 20 ? horizon2() + lift : h * (portrait ? 0.66 : 0.68);
      const g = c.createLinearGradient(0, hz - h * 0.9, 0, hz);
      g.addColorStop(0, "rgba(8,13,31,0)"); g.addColorStop(0.55, "rgba(23,20,59,0.9)"); g.addColorStop(1, "rgba(81,64,120,0.85)");
      c.globalAlpha = skyA; c.fillStyle = g; c.fillRect(0, 0, w, hz);
      c.globalAlpha = 1;
    }

    // stars, flying slowly towards the viewer
    const starA = keys([[0, 1], [7, 1], [7.6, 0.8], [14.5, 0.75], [15.5, 1], [30.5, 0.8], [32, 0.3], [38.5, 0.3], [40, 0.14], [46, 0.2]], t);
    const fp = S * 0.55;
    c.globalCompositeOperation = "lighter";
    for (const st of stars) {
      const sx = cx + (st.x / st.z) * fp + pan * 0.15 * (1 - st.z);
      const sy = cy + (st.y / st.z) * fp + (t < 13 ? lift * 0.1 : 0);
      if (sx < -4 || sy < -4 || sx > w + 4 || sy > h + 4) continue;
      const a = (0.3 + 0.7 * st.b) * smooth(st.on, st.on + 1.2, t) * starA * smooth(1, 0.82, st.z) * (0.75 + 0.25 * Math.sin(t * (1 + st.b * 2) + st.x * 9));
      if (a < 0.02) continue;
      const r = clamp((0.45 + st.b * 1.0) / (st.z * 1.1 + 0.25), 0.4, 3);
      c.globalAlpha = a; c.fillStyle = rgba(STAR_C[st.hue], 1);
      c.fillRect(sx - r / 2, sy - r / 2, r, r);
      if (r > 1.8) glow(st.hue === 2 ? SP.blue : SP.parch, sx, sy, r * 4, a * 0.25);
    }

    // scene 1: the first point of light, then a galaxy the camera falls into
    const first = smooth(0.3, 1.2, t) * (1 - smooth(6.6, 7.4, t));
    if (first > 0) {
      glow(SP.white, cx, cy, S * (0.012 + 0.004 * Math.sin(t * 3)), first);
      const G = smooth(1.3, 3.4, t) * (1 - smooth(6.7, 7.3, t));
      if (G > 0) {
        const k = Math.pow(smooth(1.4, 7.3, t), 1.6);
        const base = S * 0.09 * Math.pow(26, k);
        const rot = 0.35 + t * 0.05, tilt = -0.35, sq = 0.42;
        const ct = Math.cos(tilt), stl = Math.sin(tilt);
        for (const p of galaxy) {
          const sc = base * Math.pow(Math.pow(26, k), p.d - 1);
          const a = p.a + rot;
          const ux = Math.cos(a) * p.r * sc, uy = Math.sin(a) * p.r * sc * sq;
          const x = cx + ux * ct - uy * stl, y = cy + ux * stl + uy * ct;
          if (x < -5 || y < -5 || x > w + 5 || y > h + 5) continue;
          c.globalAlpha = (0.22 + 0.5 * p.b) * G;
          c.fillStyle = p.warm ? "rgb(240,210,150)" : p.b > 0.5 ? "rgb(170,160,255)" : "rgb(150,120,220)";
          const s = p.s * (1 + k * 0.8);
          c.fillRect(x, y, s, s);
        }
        glow(SP.gold, cx, cy, base * 0.45, 0.55 * G);
        glow(SP.violet, cx, cy, base * 1.4, 0.18 * G);
      }
    }

    // scene 5: a wide sky over still water, and someone standing quietly
    if (sc5 > 0.01) {
      const hz = h * (portrait ? 0.66 : 0.68);
      const Z = 1 + 0.17 * easeIO(smooth(31.5, 39.5, t));
      const fx = cx - (portrait ? 0 : 0.1) * S, fH = S * (portrait ? 0.24 : 0.19), feet = hz + S * 0.05;
      const fy = feet - fH;
      c.save(); c.translate(fx, fy); c.scale(Z, Z); c.translate(-fx, -fy);
      // the band of the galaxy
      const bx0 = portrait ? -w * 0.1 : w * 0.02, by0 = hz * 0.98, bx1 = portrait ? w * 1.1 : w * 0.98, by1 = h * 0.02;
      const bl = Math.hypot(bx1 - bx0, by1 - by0), nx = -(by1 - by0) / bl, ny = (bx1 - bx0) / bl, bw = S * 0.16;
      const drawBand = (mirror: boolean) => {
        for (let i = 0; i < 9; i++) {
          const u = i / 8; let x = lerp(bx0, bx1, u), y = lerp(by0, by1, u);
          if (mirror) { y = 2 * hz - y; if (y > h * 1.2) continue; }
          glow(i % 3 === 1 ? SP.gold : SP.violet, x, y, bw * 1.5, (mirror ? 0.05 : 0.16) * sc5);
        }
        for (const p of band) {
          let x = lerp(bx0, bx1, p.u) + nx * p.n * bw, y = lerp(by0, by1, p.u) + ny * p.n * bw;
          if (mirror) { y = 2 * hz - y; x += Math.sin(t * 1.3 + y * 0.05) * 2; if (y > h * 1.1) continue; }
          if (!mirror && y > hz) continue;
          c.globalAlpha = (0.22 + 0.6 * p.b) * sc5 * (mirror ? 0.3 : 1);
          c.fillStyle = p.warm ? "rgb(240,214,160)" : "rgb(190,186,255)";
          c.fillRect(x, y, p.s, p.s);
        }
      };
      drawBand(false);
      for (const s of sky5) {
        const x = s.x * w, y = s.y * hz;
        const a = (0.3 + 0.7 * s.b) * sc5 * (0.6 + 0.4 * Math.sin(t * s.tw + s.ph));
        c.globalAlpha = a; c.fillStyle = "rgb(242,236,222)"; const r = 0.6 + s.b * 1.4; c.fillRect(x, y, r, r);
        const my = 2 * hz - y;
        if (my < h) { c.globalAlpha = a * 0.3; c.fillRect(x + Math.sin(t * 1.4 + my * 0.06) * 2.5, my, r * 1.6, r * 0.6); }
      }
      c.globalCompositeOperation = "source-over";
      // far mountains on the horizon
      c.globalAlpha = sc5; c.fillStyle = "#0b0d22"; c.beginPath(); c.moveTo(-10, hz);
      ridge.forEach((v, i) => c.lineTo((i / (ridge.length - 1)) * (w + 20) - 10, hz - v * S * 0.06));
      c.lineTo(w + 10, hz); c.closePath(); c.fill();
      // still water
      const lg = c.createLinearGradient(0, hz, 0, h);
      lg.addColorStop(0, "rgba(28,24,64,0.55)"); lg.addColorStop(1, "rgba(5,8,20,0.9)");
      c.fillStyle = lg; c.fillRect(-w, hz, w * 3, h);
      c.globalCompositeOperation = "lighter"; drawBand(true); c.globalCompositeOperation = "source-over";
      c.fillStyle = rgba(PARCH, 0.06 * sc5); c.fillRect(-w, hz, w * 3, 1);
      // the rock and the person
      c.globalAlpha = sc5; c.fillStyle = "#02040b"; c.beginPath();
      c.moveTo(fx - S * 0.9, h + 10); c.quadraticCurveTo(fx - S * 0.3, feet + S * 0.02, fx - fH * 0.4, feet);
      c.lineTo(fx + fH * 0.5, feet + 1); c.quadraticCurveTo(fx + S * 0.25, feet + S * 0.04, fx + S * 0.5, h + 10); c.closePath(); c.fill();
      glow(SP.parch, fx, feet - fH * 0.9, fH * 0.9, 0.16 * sc5);
      drawWanderer(fx, feet, fH, sc5);
      c.restore();
    }

    // scene 2a: a temple, an observer and a lamp under the stars
    if (land > 0.01) {
      const hz = horizon2() + lift;
      c.globalCompositeOperation = "source-over";
      c.globalAlpha = land; c.fillStyle = "#0b0f26"; c.beginPath(); c.moveTo(-20, hz + 2);
      hills.forEach((v, i) => c.lineTo((i / (hills.length - 1)) * (w + 40) - 20 + pan * 0.25, hz - v * S * 0.07));
      c.lineTo(w + 20, hz + 2); c.lineTo(w + 20, h); c.lineTo(-20, h); c.closePath(); c.fill();
      // sky diagram: a few stars joined by light, and the arc of a measuring instrument
      const ox = cx - (portrait ? 0.2 : 0.28) * S + pan, ty = h * (portrait ? 0.82 : 0.8) + lift, fH = S * (portrait ? 0.3 : 0.26);
      const cons: [number, number][] = (portrait
        ? [[0.6, 0.09], [0.7, 0.06], [0.82, 0.08], [0.88, 0.15], [0.79, 0.19], [0.68, 0.16]]
        : [[0.72, 0.15], [0.79, 0.09], [0.87, 0.13], [0.92, 0.23], [0.85, 0.3], [0.76, 0.27]])
        .map(([fx, fy]) => [cx + (fx - 0.5) * Math.min(w, S * 1.8) + pan * 0.3, fy * h + lift * 0.6]);
      c.globalCompositeOperation = "lighter";
      c.strokeStyle = rgba(GOLD, 0.55 * land); c.lineWidth = 1;
      strokeProgress([...cons, cons[0]], smooth(8.6, 11.0, t));
      cons.forEach(([x, y], i) => glow(SP.parch, x, y, S * 0.018, land * smooth(8.4 + i * 0.25, 8.9 + i * 0.25, t)));
      const eyeX = ox + 0.03 * fH, eyeY = ty - 0.92 * fH, arcR = S * 0.32;
      const arcP = smooth(9.2, 11.2, t);
      if (arcP > 0) {
        c.strokeStyle = rgba(GOLD, 0.32 * land); c.beginPath();
        c.arc(eyeX, eyeY, arcR, -Math.PI * 0.47, -Math.PI * 0.47 + Math.PI * 0.28 * arcP); c.stroke();
        for (let d = 0; d <= 50; d += 5) {
          const an = -Math.PI * 0.47 + (d / 180) * Math.PI; if (d / 50 > arcP) break;
          const l = d % 15 === 0 ? 0.06 : 0.03;
          c.beginPath(); c.moveTo(eyeX + Math.cos(an) * arcR, eyeY + Math.sin(an) * arcR);
          c.lineTo(eyeX + Math.cos(an) * arcR * (1 - l), eyeY + Math.sin(an) * arcR * (1 - l)); c.stroke();
        }
      }
      c.globalCompositeOperation = "source-over"; c.globalAlpha = land;
      drawTemple(cx + (portrait ? 0.2 : 0.1) * S + pan * 0.55, hz + S * 0.02, S * (portrait ? 0.24 : 0.2), S * (portrait ? 0.6 : 0.56), land);
      // terrace in front
      c.globalAlpha = land; c.fillStyle = "#04060f"; c.fillRect(-10, ty, w + 20, h - ty + 10);
      c.fillStyle = rgba(WARM, 0.12 * land); c.fillRect(-10, ty, w + 20, 1);
      drawObserver(ox, ty, fH, land);
      // oil lamp
      const lx = ox + fH * 0.5, fl = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 7.3);
      c.globalAlpha = land; c.fillStyle = "#1a120a";
      c.beginPath(); c.ellipse(lx, ty - fH * 0.02, fH * 0.07, fH * 0.025, 0, 0, Math.PI); c.fill();
      c.globalCompositeOperation = "lighter";
      glow(SP.warm, lx, ty - fH * 0.07, fH * 1.1 * fl, 0.5 * land);
      c.globalAlpha = land; c.fillStyle = "rgb(255,214,140)"; c.beginPath();
      c.moveTo(lx, ty - fH * (0.12 + 0.01 * fl)); c.quadraticCurveTo(lx + fH * 0.025, ty - fH * 0.05, lx, ty - fH * 0.035);
      c.quadraticCurveTo(lx - fH * 0.025, ty - fH * 0.05, lx, ty - fH * (0.12 + 0.01 * fl)); c.fill();
      c.globalCompositeOperation = "source-over";
    }

    // scene 2b: palm-leaf manuscripts, the words written in light
    const ms = sc2 * smooth(10.8, 12.0, t) * (1 - smooth(14.9, 15.9, t));
    if (ms > 0.01) {
      // the lamp beside the leaves
      glow(SP.warm, leafGeo(0, t).x - leafGeo(0, t).lw * 0.55, cy, S * 0.6, 0.35 * ms);
      for (let i = 0; i < 3; i++) {
        const L = leafGeo(i, t);
        c.save(); c.translate(L.x, L.y); c.rotate(L.rot); c.globalAlpha = ms;
        const r = L.lh * 0.45;
        c.beginPath(); c.roundRect(-L.lw / 2, -L.lh / 2, L.lw, L.lh, r);
        const lg = c.createLinearGradient(-L.lw / 2, 0, L.lw / 2, 0);
        lg.addColorStop(0, "rgb(214,186,132)"); lg.addColorStop(0.5, "rgb(176,148,98)"); lg.addColorStop(1, "rgb(118,96,62)");
        c.fillStyle = lg; c.fill();
        c.strokeStyle = "rgba(60,40,18,0.6)"; c.lineWidth = 1.2; c.stroke();
        c.strokeStyle = "rgba(90,64,30,0.18)"; c.lineWidth = 1;
        for (let k = 1; k < 6; k++) { const yy = -L.lh / 2 + (L.lh * k) / 6; c.beginPath(); c.moveTo(-L.lw / 2 + r, yy); c.lineTo(L.lw / 2 - r, yy); c.stroke(); }
        // string holes and the cord
        for (const hx of [-L.lw * 0.3, L.lw * 0.3]) {
          c.fillStyle = "rgba(20,12,6,0.85)"; c.beginPath(); c.arc(hx, 0, L.lh * 0.065, 0, Math.PI * 2); c.fill();
        }
        c.restore();
      }
      // a circle diagram with twelve divisions and twenty-seven ticks on the middle leaf
      {
        const L = leafGeo(1, t); const p = smooth(12.2, 13.8, t);
        c.save(); c.translate(L.x, L.y); c.rotate(L.rot); c.translate(-L.lw * 0.26, 0);
        const rr = L.lh * 0.36;
        c.globalCompositeOperation = "lighter";
        c.strokeStyle = rgba([255, 226, 160], 0.9 * ms); c.lineWidth = Math.max(1, L.lh * 0.012);
        c.beginPath(); c.arc(0, 0, rr, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); c.stroke();
        c.beginPath(); c.arc(0, 0, rr * 0.55, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); c.stroke();
        for (let i = 0; i < 12; i++) { if (i / 12 > p) break; const a = -Math.PI / 2 + (i / 12) * Math.PI * 2; c.beginPath(); c.moveTo(Math.cos(a) * rr * 0.55, Math.sin(a) * rr * 0.55); c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); c.stroke(); }
        for (let i = 0; i < 27; i++) { if (i / 27 > p) break; const a = -Math.PI / 2 + (i / 27) * Math.PI * 2; c.beginPath(); c.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); c.lineTo(Math.cos(a) * rr * 1.12, Math.sin(a) * rr * 1.12); c.stroke(); }
        glow(SP.warm, 0, 0, rr * 1.6, 0.25 * ms * p * (1 - smooth(13.8, 14.6, t)));
        c.restore(); c.globalCompositeOperation = "source-over";
      }
      // the three words: light runs across each one from left to right, and ink settles behind it
      const reveal = [[11.8, 13.2], [12.6, 14.0], [13.3, 14.6]];
      WORDS.forEach((wd, k) => {
        const P = wordPlace(k, t); const [a0, a1] = reveal[k]; const e = smooth(a0, a1, t);
        if (e <= 0) return;
        const leave = 1 - smooth(14.5, 15.1, t);
        c.save(); c.translate(P.L.x, P.L.y); c.rotate(P.L.rot); c.translate(P.ox, P.base); c.scale(P.fs, P.fs);
        c.beginPath(); c.rect(-0.1, -1.4, wd.w * e + 0.1, 2.2); c.clip();
        c.globalAlpha = ms * smooth(a0 + 0.3, a1 + 0.5, t) * 0.9 * leave; c.fillStyle = "rgb(52,30,14)"; c.fill(wd.p);
        c.globalCompositeOperation = "lighter";
        c.globalAlpha = ms * (1 - 0.6 * smooth(a1, a1 + 0.8, t)) * leave;
        c.strokeStyle = "rgb(255,222,150)"; c.lineWidth = 2.2 / P.fs; c.stroke(wd.p);
        c.restore();
        if (e < 1) {
          const lx = P.ox + wd.w * P.fs * e, ly = P.base - P.fs * 0.35; const cs = Math.cos(P.L.rot), sn = Math.sin(P.L.rot);
          c.globalCompositeOperation = "lighter";
          glow(SP.warm, P.L.x + lx * cs - ly * sn, P.L.y + lx * sn + ly * cs, P.fs * 0.7, 0.8 * ms);
          c.globalCompositeOperation = "source-over";
        }
      });
    }

    // scenes 3 and 4: orbits, then the chart
    const sc34 = smooth(14.9, 16.0, t) * (1 - smooth(30.6, 31.9, t));
    const cm = cam(t);
    if (sc34 > 0.01) {
      c.globalCompositeOperation = "lighter";
      const conv = smooth(23.4, 26.4, t), m = smooth(25.2, 28.2, t);
      const drawP = smooth(15.3, 18.2, t);
      // rings (the inner one becomes the diamond, the fifth the square, the others fade into them)
      for (let i = 0; i < 8; i++) {
        const keep = i === 0 || i === 4;
        const a = (i === 7 ? 0.42 : 0.26) * (1 - m) + (keep ? 0.85 * m : 0);
        if (a < 0.01) continue;
        c.strokeStyle = rgba(GOLD, a * sc34); c.lineWidth = keep && m > 0.5 ? 1.5 : 1;
        c.beginPath(); let pen = false;
        const N = 120, upto = Math.round(N * drawP);
        for (let s = 0; s <= upto; s++) {
          const th = (s / N) * Math.PI * 2 + i * 0.7;
          const P = proj(...ringPoint(i, th, t), cm);
          if (!P) { pen = false; continue; }
          if (!pen) { c.moveTo(P[0], P[1]); pen = true; } else c.lineTo(P[0], P[1]);
        }
        c.stroke();
      }
      // the outer ring carries the twelve signs and the twenty-seven nakshatras as ticks
      const tickA = smooth(16.5, 18.5, t) * (1 - conv) * sc34;
      if (tickA > 0.01) {
        c.strokeStyle = rgba(GOLD, 0.5 * tickA);
        for (let i = 0; i < 39; i++) {
          const th = i < 12 ? (i / 12) * Math.PI * 2 : ((i - 12) / 27) * Math.PI * 2;
          const l = i < 12 ? 0.08 : 0.035;
          const [x, , z] = ringPoint(7, th, t);
          const A = proj(x, 0, z, cm), B = proj(x * (1 + l), 0, z * (1 + l), cm);
          if (A && B) { c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke(); }
        }
      }
      // the Moon's path, tilted: where it crosses the ecliptic are Rahu and Ketu
      const nodeA = smooth(17.5, 19.5, t) * (1 - conv) * sc34;
      if (nodeA > 0.01) {
        c.setLineDash([3, 6]); c.strokeStyle = rgba([196, 164, 255], 0.4 * nodeA); c.beginPath(); let pen = false;
        for (let s = 0; s <= 120; s++) { const P = proj(...nodePoint((s / 120) * Math.PI * 2, t), cm); if (!P) { pen = false; continue; } if (!pen) { c.moveTo(P[0], P[1]); pen = true; } else c.lineTo(P[0], P[1]); }
        c.stroke(); c.setLineDash([]);
      }
      // dust sliding along the rings
      for (const d of orbitDust) {
        const P = proj(...ringPoint(d.ring, d.th + 0.15 * (t - 15) * (1 - m), t), cm);
        if (!P) continue;
        c.globalAlpha = (0.25 + 0.5 * d.b) * sc34 * drawP; c.fillStyle = "rgb(240,214,160)"; c.fillRect(P[0], P[1], 1.4, 1.4);
      }
      // the Earth at the centre
      const E = proj(0, 0, 0, cm);
      if (E) glow(SP.gold, E[0], E[1], (0.12 * cm.f) / E[2], 0.45 * sc34 * (1 - conv));
      // the nine grahas
      const home = smooth(25.6, 28.6, t);
      const bodies: { x: number; y: number; z: number; size: number; sp: HTMLCanvasElement; node: boolean; c: RGB; appear: number }[] = [];
      PLANETS.forEach((p, idx) => {
        const th = idx * 0.9 + p.w * (t - 15);
        const [rx, ry, rz] = ringPoint(p.ring, th, t);
        const [hx, hy, hz] = chartWorld(...HOUSE_UV[p.house].map((v) => v * CH) as [number, number]);
        bodies.push({ x: lerp(rx, hx, home), y: lerp(ry, hy, home), z: lerp(rz, hz, home), size: lerp(p.size, 0.03, home), sp: planetSprite.get(p.id)!, node: false, c: p.c, appear: smooth(15.8 + idx * 0.35, 16.6 + idx * 0.35, t) });
      });
      [0, Math.PI].forEach((th, k) => {
        const [rx, ry, rz] = nodePoint(th, t);
        const [hx, hy, hz] = chartWorld(...HOUSE_UV[k ? 12 : 6].map((v) => v * CH) as [number, number]);
        bodies.push({ x: lerp(rx, hx, home), y: lerp(ry, hy, home), z: lerp(rz, hz, home), size: lerp(0.045, 0.03, home), sp: nodeSprite, node: true, c: [196, 164, 255], appear: smooth(18.6 + k * 0.3, 19.4 + k * 0.3, t) });
      });
      const projected = bodies.map((b) => ({ b, P: proj(b.x, b.y, b.z, cm) })).filter((o) => o.P).sort((a, b) => b.P![2] - a.P![2]);
      for (const { b, P } of projected) {
        const [x, y, dep] = P!; const r = Math.min((b.size * cm.f) / dep, S * 0.024); const a = b.appear * sc34;
        if (a < 0.01) continue;
        glow(b.sp, x, y, r * 6, 0.45 * a);
        c.globalAlpha = a;
        if (b.node) { c.strokeStyle = rgba(b.c, 0.95); c.lineWidth = 1.4; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke(); }
        else { c.fillStyle = rgba(b.c, 1); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
        if (home > 0.5) { c.strokeStyle = rgba(GOLD, 0.5 * a * home); c.lineWidth = 1; c.beginPath(); c.arc(x, y, r * 2, 0, Math.PI * 2); c.stroke(); }
      }
      // the two diagonals finish the North Indian chart
      const diag = smooth(27.4, 29.2, t);
      if (diag > 0) {
        c.globalAlpha = 1; c.strokeStyle = rgba(GOLD, 0.85 * sc34); c.lineWidth = 1.5;
        for (const [u0, v0, u1, v1] of [[-CH, -CH, CH, CH], [CH, -CH, -CH, CH]]) {
          const pts: [number, number][] = [];
          for (let s = 0; s <= 20; s++) { const k = s / 20; const P = proj(...chartWorld(lerp(u0, u1, k), lerp(v0, v1, k)), cm); if (P) pts.push([P[0], P[1]]); }
          strokeProgress(pts, diag);
        }
      }
      const C0 = proj(0, 0, 0, cm);
      if (C0) glow(SP.gold, C0[0], C0[1], S * lerp(0.05, 0.75, smooth(28.4, 31, t)), 0.4 * bump(t, 29.6, 1.2, 1.6));
    }

    // ink lifting off the leaves and flying into the orbits
    if (t > 14.3 && t < 18.6) {
      c.globalCompositeOperation = "lighter";
      for (const ik of inks) {
        const [sx, sy] = inkStart(ik.sx, ik.sy);
        const e = easeIO(smooth(14.7 + ik.delay, 16.9 + ik.delay, t));
        const P = proj(...ringPoint(ik.ring, ik.th + 0.15 * (t - 15), t), cm);
        const tx = P ? P[0] : cx, ty = P ? P[1] : cy;
        const curl = Math.sin(Math.PI * e) * S * 0.2 * ik.curl;
        const x = lerp(sx, tx, e) + curl, y = lerp(sy, ty, e) - Math.sin(Math.PI * e) * S * 0.08;
        const a = smooth(14.3, 14.8, t) * (1 - smooth(17.6, 18.6, t));
        glow(SP.warm, x, y, S * 0.012, 0.7 * a);
        c.globalAlpha = a; c.fillStyle = "rgb(255,236,190)"; c.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
      }
    }

    // the chart dissolving into sparks of light
    if (t > 30.4 && t < 34.5) {
      c.globalCompositeOperation = "lighter";
      const c30 = cam(30.7);
      for (const s of sparks) {
        const P = proj(...chartWorld(s.u, s.v), c30); if (!P) continue;
        const tau = t - 30.7 - s.delay * 0.8;
        const dx = P[0] - cx, dy = P[1] - c30.oy;
        const k = Math.max(0, tau);
        const x = P[0] + dx * 0.35 * k + Math.sin(k * 2 + s.rx * 9) * S * 0.015;
        const y = P[1] + dy * 0.25 * k - S * 0.12 * k * (0.5 + s.ry);
        const a = smooth(30.4, 30.9, t) * (1 - smooth(0.6, 2.4, k));
        glow(SP.gold, x, y, S * 0.01, a * 0.8);
      }
    }

    // scene 6: darkness, one star, a ring of light
    const sc6 = smooth(38.8, 40.0, t);
    if (sc6 > 0) {
      c.globalCompositeOperation = "source-over";
      c.globalAlpha = sc6 * 0.55; c.fillStyle = NAVY; c.fillRect(0, 0, w, h);
      c.globalCompositeOperation = "lighter";
      const X = lay.ringX, Y = lay.ringY, RR = lay.ringR;
      const star = smooth(38.9, 40.4, t);
      const breathe = t > 44 ? 0.88 + 0.12 * Math.sin((t - 44) * 1.2) : 1;
      glow(SP.white, X, Y, S * lerp(0.012, 0.05, smooth(39.6, 40.6, t)) * (1 - smooth(40.5, 41.6, t)), star);
      const open = 1 - Math.pow(1 - smooth(40.4, 42.2, t), 3);
      if (open > 0) {
        const r = RR * open;
        glow(SP.gold, X, Y, RR * 2.6, 0.3 * bump(t, 40.7, 0.4, 2.2));
        for (const [lw, a] of [[9, 0.07], [4, 0.16], [1.4, 0.8]]) {
          c.globalAlpha = a * breathe; c.strokeStyle = "rgb(226,196,138)"; c.lineWidth = lw;
          c.beginPath(); c.arc(X, Y, r, 0, Math.PI * 2); c.stroke();
        }
        const rot = t * 0.02;
        c.globalAlpha = 0.5 * open * breathe; c.lineWidth = 1;
        for (let i = 0; i < 27; i++) {
          const a = rot + (i / 27) * Math.PI * 2;
          c.beginPath(); c.moveTo(X + Math.cos(a) * r * 1.04, Y + Math.sin(a) * r * 1.04); c.lineTo(X + Math.cos(a) * r * 1.08, Y + Math.sin(a) * r * 1.08); c.stroke();
        }
        c.globalAlpha = 0.22 * open; c.setLineDash([2, 7]);
        c.beginPath(); c.arc(X, Y, r * 1.16, -rot * 1.5, -rot * 1.5 + Math.PI * 2); c.stroke(); c.setLineDash([]);
        for (let i = 0; i < 12; i++) {
          const a = -rot * 2 + (i / 12) * Math.PI * 2;
          glow(SP.gold, X + Math.cos(a) * r, Y + Math.sin(a) * r, S * 0.01, 0.55 * open * breathe);
        }
      }
    }

    // gold dust everywhere, drifting up
    c.globalCompositeOperation = "lighter";
    const dustA = keys([[0, 0], [3, 0.6], [7, 0.75], [15, 0.5], [23, 0.6], [31, 0.65], [39, 0.4], [44, 0.55]], t);
    for (const d of dust) {
      const x = ((d.x * w + pan * d.z * 0.4 + Math.sin(t * 0.3 + d.ph) * 14) % (w + 20) + w + 20) % (w + 20) - 10;
      const y = ((((d.y - t * 0.011 * d.z) % 1) + 1) % 1) * h;
      glow(SP.gold, x, y, 2.4 + d.z * 4, (0.2 + 0.5 * d.b) * dustA * d.z);
    }

    // light flashes between scenes
    c.globalCompositeOperation = "lighter";
    const f1 = bump(t, 7.0, 0.8, 0.9), f5 = bump(t, 31.3, 0.6, 1.0) * 0.55, f3 = bump(t, 15.1, 0.5, 0.8) * 0.25;
    for (const f of [f1, f5, f3]) {
      if (f > 0.005) { glow(SP.white, cx, cy, S * (0.3 + 1.6 * f), f); c.globalAlpha = f * 0.75; c.fillStyle = "rgb(233,213,172)"; c.fillRect(0, 0, w, h); }
    }
    c.globalCompositeOperation = "source-over";
    if (vignette) { c.globalAlpha = 1; c.fillStyle = vignette; c.fillRect(0, 0, w, h); }
    // fade in from black at the very start
    const black = 1 - smooth(0, 0.5, t);
    if (black > 0) { c.globalAlpha = black; c.fillStyle = "#000"; c.fillRect(0, 0, w, h); }
    c.globalAlpha = 1;
  }

  return { resize, frame, layout: () => ({ ...lay }) };
}
