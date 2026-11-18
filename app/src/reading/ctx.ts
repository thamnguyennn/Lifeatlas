// The context every composer shares: the chart, the moment being read, and the strength, dasha and transit numbers
// that go with that moment. Built once per reading, and rebuilt cheaply when the reader picks another day.
import { dashaChain, dashaOrigin, dashaReliability, TIME_WINDOW_MIN, type DNode, type Reliability } from "../engine/dasha5.ts";
import { shadbala, type Shadbala } from "../engine/shadbala.ts";
import { transitAt, type Transit } from "../engine/transit.ts";
import type { Natal } from "../engine/types.ts";
import { scoreHouse, toneOf, type Tone } from "./shared.ts";

export interface ComposeOptions {
  /** The name typed in the form, used only for the greeting. */
  name?: string;
  /** True when the birth time is unknown: Lagna, houses and divisional charts are left out. */
  noTime?: boolean;
  /** How far the birth time may be off, in minutes either way. Defaults to the "exact" window. */
  windowMin?: number;
}

export interface Ctx {
  uncertainMoon?: boolean;
  n: Natal;
  now: number;
  noTime: boolean;
  windowMin: number;
  name?: string;
  sb: Shadbala | null;
  scored: { score: number; why: string[] }[];
  tones: Tone[];
  /** The running period at each of the five levels at `now`. */
  chain: DNode[];
  rel: Reliability;
  transit: Transit;
}

export function makeCtx(n: Natal, now: number, opts: ComposeOptions = {}): Ctx {
  const noTime = !!opts.noTime;
  const windowMin = opts.windowMin ?? (noTime ? TIME_WINDOW_MIN.unknown : TIME_WINDOW_MIN.exact);
  const scored = n.houses.map((h) => scoreHouse(n, h));
  const base = {
    n, noTime, windowMin, name: opts.name,
    sb: noTime ? null : shadbala(n),
    scored,
    tones: n.houses.map((h, i) => toneOf(scored[i].score, h.n)),
  };
  return withTime({ ...base, now, chain: [], rel: undefined as unknown as Reliability, transit: undefined as unknown as Transit }, now);
}

/** The same chart read at another moment. Only the parts that depend on the date are recomputed. */
export function withTime(ctx: Ctx, ms: number): Ctx {
  const origin = dashaOrigin(ctx.n.grahas.moon.lon, ctx.n.utcMs);
  return {
    ...ctx,
    now: ms,
    chain: dashaChain(origin, ms),
    rel: dashaReliability(ctx.n.utcMs, ms, ctx.windowMin),
    transit: transitAt(ctx.n, ms, { stays: true }),
  };
}
