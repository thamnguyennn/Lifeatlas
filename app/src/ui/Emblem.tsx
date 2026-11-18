import { useMemo, type ReactNode } from "react";
import type { GrahaId } from "../engine/constants.ts";
import { GRAHA_VI } from "../engine/constants.ts";
import { DEITY } from "./deities.ts";

// An emblem for each graha: a lotus ring around a simple symbol. The symbols are drawn here, not copied from any artwork,
// and they stay symbolic: no figure of any god is drawn. The colour comes from the page's own planet colours (--c-sun and so on).

const rad = (d: number) => (d * Math.PI) / 180;
const P = (r: number, deg: number): [number, number] => [50 + r * Math.cos(rad(deg - 90)), 50 + r * Math.sin(rad(deg - 90))];
const f = (n: number) => n.toFixed(2);

const PETALS: Record<GrahaId, number> = { sun: 12, moon: 15, mars: 8, mercury: 9, jupiter: 12, venus: 10, saturn: 7, rahu: 9, ketu: 9 };

function petalRing(n: number): string {
  let d = "";
  const half = (180 / n) * 0.84;
  for (let i = 0; i < n; i++) {
    const th = (360 / n) * i;
    const [tx, ty] = P(48, th), [lx, ly] = P(37, th - half), [rx, ry] = P(37, th + half);
    const [ax, ay] = P(44, th - half * 0.95), [bx, by] = P(44, th + half * 0.95);
    d += `M${f(lx)} ${f(ly)}Q${f(ax)} ${f(ay)} ${f(tx)} ${f(ty)}Q${f(bx)} ${f(by)} ${f(rx)} ${f(ry)}Z`;
  }
  return d;
}

const horseshoe = (
  <>
    <path d="M33 66A19 19 0 1 1 67 66" />
    <circle cx="33" cy="70.6" r="4.4" className="f2" /><circle cx="67" cy="70.6" r="4.4" className="f2" />
  </>
);

const SYMBOL: Record<GrahaId, () => ReactNode> = {
  sun: () => (
    <>
      <circle cx="50" cy="50" r="9" className="f" />
      {Array.from({ length: 12 }, (_, i) => {
        const [a, b] = P(14, i * 30), [c, d] = P(i % 2 ? 20 : 26, i * 30);
        return <path key={i} d={`M${f(a)} ${f(b)}L${f(c)} ${f(d)}`} />;
      })}
    </>
  ),
  moon: () => (
    <>
      <path d="M60 28A24 24 0 1 0 60 72A30 30 0 0 1 60 28Z" className="f" />
      <circle cx="68" cy="34" r="1.8" className="f" /><circle cx="72" cy="50" r="1.3" className="f" /><circle cx="66" cy="66" r="1.8" className="f" />
    </>
  ),
  mars: () => (
    <>
      <path d="M50 19C58.5 31 58.5 44 50 54C41.5 44 41.5 31 50 19Z" className="f2" />
      <path d="M50 54V82M41 59H59M45 67H55" />
    </>
  ),
  mercury: () => (
    <>
      <circle cx="50" cy="50" r="17" /><circle cx="50" cy="50" r="5" className="f" />
      <circle cx="50" cy="50" r="23" strokeDasharray="3 3.95" strokeWidth="3.4" opacity="0.7" />
      {Array.from({ length: 8 }, (_, i) => {
        const [a, b] = P(5, i * 45), [c, d] = P(17, i * 45);
        return <path key={i} d={`M${f(a)} ${f(b)}L${f(c)} ${f(d)}`} />;
      })}
    </>
  ),
  jupiter: () => (
    <>
      <circle cx="50" cy="50" r="5" className="f" />
      {[0, 180].map((rot) => (
        <g key={rot} transform={`rotate(${rot} 50 50)`}>
          <path d="M50 45V21M50 21C40 26 40 36 46.5 41M50 21C60 26 60 36 53.5 41" />
        </g>
      ))}
    </>
  ),
  venus: () => (
    <>
      {[-64, -32, 0, 32, 64].map((a) => <ellipse key={a} cx="50" cy="45" rx="6.4" ry="17" transform={`rotate(${a} 50 63)`} className="f2" />)}
      <path d="M33 68Q50 77 67 68" />
    </>
  ),
  saturn: () => (
    <>
      <path d="M36 27H64L50 50ZM36 73H64L50 50Z" /><path d="M50 50L40 73H60Z" className="f2" />
      <path d="M32 27H68M32 73H68" />
    </>
  ),
  rahu: () => <>{horseshoe}</>,
  ketu: () => <g transform="rotate(180 50 50)">{horseshoe}</g>,
};

export function Emblem({ id, size = 56, spin = false, title, className = "" }: { id: GrahaId; size?: number; spin?: boolean; title?: string; className?: string }) {
  const ring = useMemo(() => petalRing(PETALS[id]), [id]);
  const small = size < 44;
  const label = title ?? `Biểu tượng của ${GRAHA_VI[id]}, gắn với ${DEITY[id].name}`;
  return (
    <svg
      className={`emblem e-${id}${small ? " sm" : ""}${spin ? " spin" : ""} ${className}`} width={size} height={size} viewBox="0 0 100 100"
      role={title === "" ? undefined : "img"} aria-label={title === "" ? undefined : label} aria-hidden={title === "" ? true : undefined} focusable="false"
    >
      <circle cx="50" cy="50" r="49" className="em-halo" />
      {!small && <path d={ring} className="em-petals" />}
      <circle cx="50" cy="50" r={small ? 47 : 34} className="em-rim" />
      <g className="em-sym">{SYMBOL[id]()}</g>
    </svg>
  );
}
