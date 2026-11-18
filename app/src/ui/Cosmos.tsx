import { useEffect, useRef } from "react";
import { prefersReducedMotion, type Theme } from "./hooks.ts";
import { skyAt } from "../engine/sky.ts";
import type { GrahaId } from "../engine/constants.ts";

// The backdrop: stars, drifting shooting stars, and the nine grahas circling the Earth in the old order
// (Moon, Mercury, Venus, Sun, Mars, Jupiter, Saturn, then the lunar nodes). Each planet starts at its real position in the zodiac
// when the page opens; after that it moves faster than the sky does, so the motion can be seen. Nothing here is information, only atmosphere.

interface Star { x: number; y: number; r: number; base: number; tw: number; ph: number; layer: number; hue: number }
interface Shoot { x: number; y: number; vx: number; vy: number; life: number; max: number }
interface Body { id: GrahaId; ring: number; a0: number; period: number; size: number; dir: 1 | -1 }

type RGB = [number, number, number];
const NIGHT: RGB[] = [[240, 235, 220], [240, 217, 166], [165, 182, 255]];
const DAY: RGB[] = [[132, 97, 51], [150, 118, 70], [101, 118, 138]];
const COL_NIGHT: Record<GrahaId, RGB> = {
  sun: [255, 214, 120], moon: [214, 228, 255], mars: [255, 132, 116], mercury: [120, 228, 192], jupiter: [255, 216, 116],
  venus: [255, 192, 226], saturn: [166, 190, 236], rahu: [196, 164, 255], ketu: [196, 164, 255],
};
const COL_DAY: Record<GrahaId, RGB> = {
  sun: [170, 115, 20], moon: [90, 115, 170], mars: [170, 60, 55], mercury: [30, 125, 105], jupiter: [160, 110, 20],
  venus: [160, 65, 120], saturn: [75, 95, 135], rahu: [110, 80, 175], ketu: [110, 80, 175],
};

// Orbit radius (share of R), seconds for one lap, and dot size, in the old geocentric order.
const LAYOUT: { id: GrahaId; ring: number; period: number; size: number }[] = [
  { id: "moon", ring: 0.3, period: 52, size: 4.2 },
  { id: "mercury", ring: 0.4, period: 84, size: 3 },
  { id: "venus", ring: 0.5, period: 120, size: 4 },
  { id: "sun", ring: 0.62, period: 170, size: 6.5 },
  { id: "mars", ring: 0.74, period: 250, size: 3.8 },
  { id: "jupiter", ring: 0.86, period: 380, size: 5.6 },
  { id: "saturn", ring: 1.0, period: 560, size: 5 },
];
const TILT = -0.3, SQUASH = 0.4;
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, a).toFixed(3)})`;

export function Cosmos({ theme, calm }: { theme: Theme; calm: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  const calmRef = useRef(calm);
  themeRef.current = theme;
  calmRef.current = calm;

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = prefersReducedMotion();
    let w = 0, h = 0, dpr = 1, raf = 0, last = 0, shootAt = 4000 + Math.random() * 6000, elapsed = 0, clock = 0;
    let stars: Star[] = [];
    const shoots: Shoot[] = [];
    const m = { x: 0, y: 0, tx: 0, ty: 0 };
    const view = { k: calmRef.current ? 1 : 0 };

    // real starting positions (sidereal longitude), degrees to canvas angle: eastward motion looks counter-clockwise
    const bodies: Body[] = (() => {
      const lon: Partial<Record<GrahaId, number>> = {};
      try { for (const g of skyAt(Date.now()).grahas) lon[g.id] = g.lon; } catch { /* the backdrop still works with an even spread */ }
      const out: Body[] = LAYOUT.map((l, i) => ({ ...l, a0: -((lon[l.id] ?? i * 51) * Math.PI) / 180, dir: 1 as const }));
      const rahu = lon.rahu ?? 40;
      out.push({ id: "rahu", ring: 1.12, period: 900, size: 4.6, a0: -(rahu * Math.PI) / 180, dir: -1 });
      out.push({ id: "ketu", ring: 1.12, period: 900, size: 4.6, a0: -((rahu + 180) * Math.PI) / 180, dir: -1 });
      return out;
    })();

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      const n = Math.round(Math.min(240, Math.max(90, (w * h) / 8500)));
      stars = Array.from({ length: n }, () => {
        const layer = Math.random() < 0.6 ? 0 : Math.random() < 0.7 ? 1 : 2;
        return {
          x: Math.random() * w, y: Math.random() * h, layer,
          r: [0.6, 1.0, 1.5][layer] * (0.7 + Math.random() * 0.6),
          base: [0.35, 0.55, 0.8][layer] * (0.6 + Math.random() * 0.4),
          tw: 0.4 + Math.random() * 1.6, ph: Math.random() * Math.PI * 2, hue: Math.floor(Math.random() * 3),
        };
      });
    };

    const draw = (t: number) => {
      // About 30 frames a second is plenty for twinkling and slow orbits, and it saves battery.
      if (!reduce && t - last < 30 && last !== 0) { raf = requestAnimationFrame(draw); return; }
      const dt = Math.min(64, t - last || 16); last = t; elapsed += dt; if (!reduce) clock += dt;
      const night = themeRef.current === "night";
      const pal = night ? NIGHT : DAY;
      const col = night ? COL_NIGHT : COL_DAY;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      m.x += (m.tx - m.x) * 0.04; m.y += (m.ty - m.y) * 0.04;
      // on the landing page the planets recede into a dim corner as the reader scrolls past the first screen
      const away = Math.min(1, Math.max(0, (window.scrollY || 0) / (h * 0.85))) * 0.9;
      view.k += ((calmRef.current ? 1 : away) - view.k) * (reduce ? 1 : 0.06);
      const k = view.k;

      // stars
      for (const s of stars) {
        const par = (s.layer + 1) * 5;
        const x = s.x + m.x * par, y = s.y + m.y * par;
        const tw = reduce ? 1 : 0.65 + 0.35 * Math.sin((t / 1000) * s.tw + s.ph);
        const a = s.base * tw * (night ? 1 : 0.55);
        const c = pal[s.hue];
        ctx.fillStyle = rgba(c, a);
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, Math.PI * 2); ctx.fill();
        if (night && s.layer === 2) {
          ctx.fillStyle = rgba(c, a * 0.12);
          ctx.beginPath(); ctx.arc(x, y, s.r * 4.2, 0, Math.PI * 2); ctx.fill();
        }
      }

      // the nine grahas around the Earth: large and bright on the landing page, a faint corner on the report pages
      const narrow = w < 760;
      const R = Math.min(w, h * 1.15) * (narrow ? 0.5 : 0.46) * (1 - 0.22 * k);
      const cx = (narrow ? w * 0.5 : w * 0.7) * (1 - k) + w * 0.86 * k - m.x * 22;
      const cy = (narrow ? h * 0.3 : h * 0.45) * (1 - k) + h * 0.24 * k - m.y * 14;
      const vis = (night ? 1 : 0.7) * (1 - 0.62 * k);
      const cs = Math.cos(TILT), sn = Math.sin(TILT);
      const at = (r: number, ang: number): [number, number, number] => {
        const ux = r * Math.cos(ang), uy = r * SQUASH * Math.sin(ang);
        return [cx + ux * cs - uy * sn, cy + ux * sn + uy * cs, Math.sin(ang)];
      };
      ctx.lineWidth = 1;
      for (const l of LAYOUT) {
        ctx.strokeStyle = rgba(night ? [212, 181, 123] : [132, 97, 51], 0.16 * vis);
        ctx.beginPath(); ctx.ellipse(cx, cy, l.ring * R, l.ring * R * SQUASH, TILT, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.setLineDash([2, 7]);
      ctx.strokeStyle = rgba([196, 164, 255], (night ? 0.2 : 0.16) * vis);
      ctx.beginPath(); ctx.ellipse(cx, cy, 1.12 * R, 1.12 * R * SQUASH, TILT, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      // the Earth at the centre, a small warm light that breathes
      const breath = reduce ? 1 : 0.85 + 0.15 * Math.sin(t / 1400);
      const eg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.16);
      eg.addColorStop(0, rgba(night ? [255, 232, 176] : [150, 105, 40], 0.5 * vis * breath));
      eg.addColorStop(1, rgba(night ? [255, 232, 176] : [150, 105, 40], 0));
      ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(cx, cy, R * 0.16, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgba(night ? [255, 240, 205] : [140, 98, 38], 0.8 * vis);
      ctx.beginPath(); ctx.arc(cx, cy, 2.4, 0, Math.PI * 2); ctx.fill();

      const sc = Math.min(1.4, Math.max(0.7, w / 1100));
      const pos = bodies.map((b) => {
        const ang = b.a0 - b.dir * (clock / 1000) * ((Math.PI * 2) / b.period);
        const [x, y, depth] = at(b.ring * R, ang);
        return { b, ang, x, y, depth };
      }).sort((p, q) => p.depth - q.depth);

      for (const { b, ang, x, y, depth } of pos) {
        const c = col[b.id];
        const front = 0.72 + 0.28 * ((depth + 1) / 2);
        const node = b.id === "rahu" || b.id === "ketu";
        // a short fading trail behind the body
        for (let i = 1; i <= 9; i++) {
          const back = ang + b.dir * i * 0.05 * (b.ring > 0.7 ? 0.6 : 1);
          const [tx, ty] = at(b.ring * R, back);
          ctx.fillStyle = rgba(c, (0.26 - i * 0.026) * vis * front);
          ctx.beginPath(); ctx.arc(tx, ty, Math.max(0.6, b.size * sc * (1 - i * 0.09) * 0.5), 0, Math.PI * 2); ctx.fill();
        }
        const rr = b.size * sc * front;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rr * 5.5);
        g.addColorStop(0, rgba(c, 0.55 * vis * front)); g.addColorStop(1, rgba(c, 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rr * 5.5, 0, Math.PI * 2); ctx.fill();
        if (node) {
          ctx.fillStyle = rgba(night ? [8, 10, 24] : [246, 241, 230], 0.9 * vis);
          ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = rgba(c, 0.9 * vis * front); ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.stroke();
          ctx.strokeStyle = rgba(c, 0.35 * vis * front); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(x, y, rr * 1.9, b.id === "rahu" ? 0.3 : 3.44, b.id === "rahu" ? 2.9 : 6.04); ctx.stroke();
        } else {
          ctx.fillStyle = rgba(c, 0.95 * vis * front);
          ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill();
          if (b.id === "saturn") {
            ctx.strokeStyle = rgba(c, 0.7 * vis * front); ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.ellipse(x, y, rr * 2.1, rr * 0.7, TILT - 0.25, 0, Math.PI * 2); ctx.stroke();
          }
          if (b.id === "sun") {
            ctx.strokeStyle = rgba(c, 0.5 * vis * front); ctx.lineWidth = 1;
            for (let r = 0; r < 12; r++) {
              const a = (r * Math.PI) / 6 + (reduce ? 0 : clock / 9000);
              ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * rr * 1.5, y + Math.sin(a) * rr * 1.5); ctx.lineTo(x + Math.cos(a) * rr * (r % 2 ? 2.1 : 2.7), y + Math.sin(a) * rr * (r % 2 ? 2.1 : 2.7)); ctx.stroke();
            }
          }
        }
      }

      // shooting stars (night only)
      if (!reduce && night) {
        if (elapsed > shootAt) {
          elapsed = 0; shootAt = 9000 + Math.random() * 9000;
          const sx = Math.random() * w * 0.8, sy = Math.random() * h * 0.4;
          shoots.push({ x: sx, y: sy, vx: 0.55 + Math.random() * 0.3, vy: 0.22 + Math.random() * 0.15, life: 0, max: 900 });
        }
        for (let i = shoots.length - 1; i >= 0; i--) {
          const s = shoots[i];
          s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt;
          const kk = 1 - s.life / s.max;
          if (kk <= 0) { shoots.splice(i, 1); continue; }
          const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 130, s.y - s.vy * 130);
          g.addColorStop(0, `rgba(240,225,190,${(0.9 * kk).toFixed(3)})`); g.addColorStop(1, "rgba(240,225,190,0)");
          ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.beginPath();
          ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 130, s.y - s.vy * 130); ctx.stroke();
        }
      }
      if (!reduce && !document.hidden) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => { m.tx = e.clientX / w - 0.5; m.ty = e.clientY / h - 0.5; };
    const onResize = () => { build(); if (reduce) draw(0); };
    const onVis = () => { if (!document.hidden && !reduce) { last = 0; raf = requestAnimationFrame(draw); } };
    build(); draw(0);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // under reduced motion the canvas is drawn once; redraw when the theme or the page type flips
  useEffect(() => { if (prefersReducedMotion()) window.dispatchEvent(new Event("resize")); }, [theme, calm]);

  return <canvas ref={ref} className="starfield" aria-hidden="true" />;
}
