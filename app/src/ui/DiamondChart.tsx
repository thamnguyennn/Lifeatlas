import { useMemo } from "react";
import { GRAHAS, GRAHA_ABBR, GRAHA_VI, SIGNS, mod, type GrahaId } from "../engine/constants.ts";
import type { Natal } from "../engine/types.ts";

type Pt = [number, number];
/** North-Indian chart: house 1 on top, houses run counter-clockwise. */
const HOUSE_POLY: Pt[][] = [
  [[200, 0], [300, 100], [200, 200], [100, 100]],
  [[0, 0], [200, 0], [100, 100]],
  [[0, 0], [100, 100], [0, 200]],
  [[100, 100], [0, 200], [100, 300], [200, 200]],
  [[0, 200], [100, 300], [0, 400]],
  [[0, 400], [100, 300], [200, 400]],
  [[200, 200], [100, 300], [200, 400], [300, 300]],
  [[200, 400], [300, 300], [400, 400]],
  [[400, 400], [300, 300], [400, 200]],
  [[200, 200], [300, 300], [400, 200], [300, 100]],
  [[400, 200], [300, 100], [400, 0]],
  [[400, 0], [300, 100], [200, 0]],
];

const centroid = (p: Pt[]): Pt => [p.reduce((a, q) => a + q[0], 0) / p.length, p.reduce((a, q) => a + q[1], 0) / p.length];
const nearestToCenter = (p: Pt[]): Pt => [...p].sort((a, b) => Math.hypot(a[0] - 200, a[1] - 200) - Math.hypot(b[0] - 200, b[1] - 200))[0];

/** Everything a chart needs: the Lagna sign and the sign of each planet (0 = Bạch Dương). */
export interface ChartData {
  lagnaSign: number;
  planets: Partial<Record<GrahaId, number>>;
  retro?: Partial<Record<GrahaId, boolean>>;
  label: string;
}

export function rasiData(natal: Natal): ChartData {
  const planets: Partial<Record<GrahaId, number>> = {};
  const retro: Partial<Record<GrahaId, boolean>> = {};
  for (const g of GRAHAS) {
    planets[g] = natal.grahas[g].sign;
    retro[g] = natal.grahas[g].retro && g !== "rahu" && g !== "ketu" && g !== "sun" && g !== "moon";
  }
  return { lagnaSign: natal.lagna.sign, planets, retro, label: "Lá số chính (Rasi)" };
}

export function DiamondChart({ data, selected = null, onPick }: {
  data: ChartData; selected?: number | null; onPick?: (n: number) => void;
}) {
  const cells = useMemo(() => {
    const list = Array.from({ length: 12 }, (_, i) => ({ n: i + 1, sign: mod(data.lagnaSign + i, 12), planets: [] as GrahaId[] }));
    for (const g of GRAHAS) {
      const s = data.planets[g];
      if (s === undefined) continue;
      list[mod(s - data.lagnaSign, 12)].planets.push(g);
    }
    return list;
  }, [data]);

  return (
    <svg className="diamond" viewBox="-6 -6 412 412" role="img"
      aria-label={`${data.label}, kiểu Bắc Ấn, nhà 1 ở trên cùng`}>
      <g className="d-faces">
        {HOUSE_POLY.map((poly, i) => (
          <polygon key={i} className={`dh ${selected === i + 1 ? "on" : ""} ${onPick ? "" : "still"}`} points={poly.map((p) => p.join(",")).join(" ")}
            onClick={onPick ? () => onPick(i + 1) : undefined}
            {...(onPick ? {
              tabIndex: 0, role: "button", "aria-label": `Nhà ${i + 1}, cung ${SIGNS[cells[i].sign]}`,
              onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(i + 1); } },
            } : {})} />
        ))}
      </g>
      <g className="d-lines" fill="none">
        <path pathLength={1} d="M0 0H400V400H0Z" />
        <path pathLength={1} d="M0 0L400 400M400 0L0 400" />
        <path pathLength={1} d="M200 0L400 200L200 400L0 200Z" />
      </g>
      {cells.map((c, i) => {
        const poly = HOUSE_POLY[i];
        const ctr = centroid(poly), near = nearestToCenter(poly);
        const sx = near[0] + (ctr[0] - near[0]) * 0.3, sy = near[1] + (ctr[1] - near[1]) * 0.3;
        const kite = i % 3 === 0;
        const px = ctr[0] + (kite ? 0 : (ctr[0] - near[0]) * 0.12), py = ctr[1] + (kite ? 0 : (ctr[1] - near[1]) * 0.12);
        const cols = !kite && c.planets.length > 3 ? 2 : 1;
        const rows = Math.ceil(c.planets.length / cols);
        return (
          <g key={c.n} className="d-cell" style={{ pointerEvents: "none" }}>
            <text x={sx} y={sy} className="d-sign" textAnchor="middle" dominantBaseline="middle">{c.sign + 1}</text>
            {c.n === 1 && (
              <text x={px} y={py - 34} className="d-asc" textAnchor="middle" dominantBaseline="middle">Asc</text>
            )}
            {c.planets.map((g, k) => {
              const col = k % cols, row = Math.floor(k / cols);
              const x = px + (cols === 2 ? (col ? 17 : -17) : 0);
              const y = py + (row - (rows - 1) / 2) * 18 + (c.n === 1 ? 6 : 0);
              return (
                <text key={g} x={x} y={y} className={`d-planet p-${g}`} textAnchor="middle" dominantBaseline="middle"
                  style={{ ["--i" as string]: String(GRAHAS.indexOf(g)) }}>
                  {GRAHA_ABBR[g]}{data.retro?.[g] && <tspan className="d-r" dy="-5" dx="1">R</tspan>}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export function ChartLegend() {
  return (
    <ul className="legend" aria-label="Chú giải ký hiệu hành tinh">
      {GRAHAS.map((g) => <li key={g}><b>{GRAHA_ABBR[g]}</b> {GRAHA_VI[g]}</li>)}
      <li><b>R</b> nghịch hành</li>
    </ul>
  );
}
