import { useMemo } from "react";
import { GLYPH_PATHS } from "./glyph-paths.ts";
import { SIGN_KEYS } from "./Glyph.tsx";
import type { GrahaId } from "../engine/constants.ts";

export interface WheelPlanet { id: GrahaId; lon: number; retro?: boolean }

interface Props {
  planets: WheelPlanet[];
  /** Rotation in degrees (counter-clockwise). Glyphs stay upright. */
  rot?: number;
  /** How many planets are shown (used by the casting animation). */
  visible?: number;
  /** Draw the Ascendant marker at this longitude. */
  lagnaLon?: number;
  /** Slow decorative motion of the inner rings. */
  idle?: boolean;
  className?: string;
  label: string;
}

const rad = (d: number) => (d * Math.PI) / 180;
/** Longitude grows counter-clockwise with 0 degrees (Aries) at the 9 o'clock position, like a chart. */
const pt = (r: number, lon: number): [number, number] => {
  const th = rad(180 + lon);
  return [r * Math.cos(th), -r * Math.sin(th)];
};
const f = (n: number) => n.toFixed(2);

function arcBand(r1: number, r2: number, a: number, b: number) {
  const [x1, y1] = pt(r2, a), [x2, y2] = pt(r2, b), [x3, y3] = pt(r1, b), [x4, y4] = pt(r1, a);
  return `M${f(x1)} ${f(y1)}A${r2} ${r2} 0 0 0 ${f(x2)} ${f(y2)}L${f(x3)} ${f(y3)}A${r1} ${r1} 0 0 1 ${f(x4)} ${f(y4)}Z`;
}

const PLANET_ORDER: GrahaId[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"];

export function ZodiacWheel({ planets, rot = 0, visible, lagnaLon, idle = true, className = "", label }: Props) {
  const geometry = useMemo(() => {
    const signBands = Array.from({ length: 12 }, (_, i) => arcBand(226, 250, i * 30, (i + 1) * 30));
    const signLines = Array.from({ length: 12 }, (_, i) => { const [a, b] = pt(226, i * 30), [c, d] = pt(250, i * 30); return `M${f(a)} ${f(b)}L${f(c)} ${f(d)}`; }).join("");
    const ticks = Array.from({ length: 72 }, (_, i) => {
      const long = i % 6 === 0;
      const [a, b] = pt(long ? 212 : 219, i * 5), [c, d] = pt(226, i * 5);
      return `M${f(a)} ${f(b)}L${f(c)} ${f(d)}`;
    }).join("");
    const nak = Array.from({ length: 27 }, (_, i) => { const [a, b] = pt(186, i * (360 / 27)), [c, d] = pt(206, i * (360 / 27)); return `M${f(a)} ${f(b)}L${f(c)} ${f(d)}`; }).join("");
    const star = (() => { // {12/5} star polygon: every fifth of twelve points
      const p = Array.from({ length: 12 }, (_, i) => pt(150, i * 30));
      let d = "";
      for (let i = 0; i < 12; i++) { const [x, y] = p[(i * 5) % 12]; d += `${i ? "L" : "M"}${f(x)} ${f(y)}`; }
      return d + "Z";
    })();
    const hex = (() => { const p = Array.from({ length: 6 }, (_, i) => pt(112, i * 60 + 15)); return "M" + p.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z"; })();
    const hex2 = (() => { const p = Array.from({ length: 6 }, (_, i) => pt(112, i * 60 + 45)); return "M" + p.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z"; })();
    return { signBands, signLines, ticks, nak, star, hex, hex2 };
  }, []);

  // Spread planets that sit close together onto different radii.
  const placed = useMemo(() => {
    const sorted = [...planets].sort((a, b) => a.lon - b.lon);
    const out: { p: WheelPlanet; r: number; i: number }[] = [];
    for (const p of sorted) {
      const near = out.filter((o) => { const d = Math.abs(((o.p.lon - p.lon + 540) % 360) - 180); return d < 10; }).length;
      out.push({ p, r: 166 - near * 27, i: PLANET_ORDER.indexOf(p.id) });
    }
    return out.sort((a, b) => a.i - b.i);
  }, [planets]);

  const shown = visible ?? planets.length;
  const glyph = (key: string, size: number, rotUpright: number) =>
    `translate(0 0) rotate(${rotUpright}) scale(${size / 100}) translate(-50 -50)`;

  return (
    <svg className={`wheel ${className}`} viewBox="-268 -268 536 536" role="img" aria-label={label}>
      <defs>
        <radialGradient id="wheel-core" r="0.5">
          <stop offset="0" stopColor="var(--gold-2)" stopOpacity="0.30" />
          <stop offset="0.45" stopColor="var(--gold)" stopOpacity="0.07" />
          <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wheel-asc" x1="0" x2="1">
          <stop offset="0" stopColor="var(--gold)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--gold-2)" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <g style={{ transform: `rotate(${-rot}deg)`, transition: "none" }}>
        <circle r="262" className="w-glow" />
        <circle r="200" fill="url(#wheel-core)" />
        {/* sign ring */}
        {geometry.signBands.map((d, i) => <path key={i} d={d} className={i % 2 ? "w-band b" : "w-band a"} />)}
        <path d={geometry.signLines} className="w-line" />
        <circle r="250" className="w-ring" /><circle r="226" className="w-ring" />
        {SIGN_KEYS.map((k, i) => {
          const [x, y] = pt(238, i * 30 + 15);
          return (
            <g key={k} transform={`translate(${f(x)} ${f(y)}) rotate(${rot})`}>
              <g transform={glyph(k, 17, 0)}><path d={GLYPH_PATHS[k]} className="w-sign" /></g>
            </g>
          );
        })}
        <path d={geometry.ticks} className="w-tick" />
        {/* decorative inner rings */}
        <g className={idle ? "wheel-a" : ""}>
          <circle r="206" className="w-ring" /><circle r="186" className="w-ring" />
          <path d={geometry.nak} className="w-tick soft" />
        </g>
        <g className={idle ? "wheel-b" : ""}>
          <path d={geometry.star} className="w-line soft" />
          <path d={geometry.hex} className="w-line soft" /><path d={geometry.hex2} className="w-line soft" />
          <circle r="150" className="w-ring dash" />
        </g>
        <circle r="112" className="w-ring" /><circle r="64" className="w-ring dash" />
        <g className="w-eye">
          <path d="M-30 0Q0 -22 30 0Q0 22 -30 0Z" className="w-line eye" />
          <circle r="9" className="w-eye-core" /><circle r="3.4" className="w-eye-dot" />
        </g>
        {/* ascendant */}
        {lagnaLon !== undefined && (() => {
          const [x1, y1] = pt(70, lagnaLon), [x2, y2] = pt(254, lagnaLon), [x3, y3] = pt(262, lagnaLon);
          return (
            <g className="w-asc">
              <line x1={f(x1)} y1={f(y1)} x2={f(x2)} y2={f(y2)} stroke="url(#wheel-asc)" strokeWidth="1.6" />
              <circle cx={f(x3)} cy={f(y3)} r="5" className="w-asc-dot" />
            </g>
          );
        })()}
        {/* planets */}
        {placed.map(({ p, r }, idx) => {
          const [x, y] = pt(r, p.lon), [lx, ly] = pt(186, p.lon);
          const on = PLANET_ORDER.indexOf(p.id) < shown;
          return (
            <g key={p.id} className={`w-planet ${on ? "on" : ""}`} style={{ transitionDelay: `${idx * 40}ms` }}>
              <line x1={f(lx)} y1={f(ly)} x2={f(x)} y2={f(y)} className="w-link" />
              <g transform={`translate(${f(x)} ${f(y)}) rotate(${rot})`}>
                <circle r="15" className="w-pbg" />
                <g transform={glyph(p.id, 21, 0)}><path d={GLYPH_PATHS[p.id]} className="w-pglyph" /></g>
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
