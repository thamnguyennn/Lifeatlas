// The Overview page: a letter, one sentence about the whole chart, then the blocks of the overview.
import type { Prepared } from "./logic.ts";
import { Gloss } from "./Gloss.tsx";
import { Glyph, SignGlyph } from "./Glyph.tsx";
import { signIndex, SIGNS as SIGN_VI } from "../engine/constants.ts";
import { StrengthBars, PlanetTable } from "./PagesA.tsx";
import type { OverviewBlock } from "../reading/types.ts";

const Paras = ({ list }: { list: string[] }) => <>{list.map((p, i) => <p key={i}><Gloss text={p} /></p>)}</>;

function Why({ lines }: { lines: string[] }) {
  if (!lines.length) return null;
  return (
    <details className="params why">
      <summary>Vì sao mình nói điều này?</summary>
      <ul>{lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
    </details>
  );
}

const EL_NAME: Record<string, string> = { fire: "Lửa", earth: "Đất", air: "Khí", water: "Nước" };
/** The four alchemical triangles: fire and air point up, water and earth point down; air and earth carry a bar. */
export function ElementIcon({ e, size = 22 }: { e: string; size?: number }) {
  const up = e === "fire" || e === "air", bar = e === "air" || e === "earth";
  return (
    <svg className={`el-ico el-${e}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={up ? "M12 3 L21 20 H3 Z" : "M12 21 L3 4 H21 Z"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      {bar && <path d={up ? "M7 14 H17" : "M7 10 H17"} stroke="currentColor" strokeWidth="1.8" />}
    </svg>
  );
}
/** The Moon as it looked at birth: the lit part drawn from the Sun–Moon distance. */
export function MoonPhase({ elong, size = 44 }: { elong: number; size?: number }) {
  const r = 18, k = Math.cos((elong * Math.PI) / 180); // 1 new, -1 full
  const waxing = elong < 180;
  const rx = Math.abs(k) * r;
  const lit = `M22 4 A18 18 0 0 ${waxing ? 1 : 0} 22 40 A${rx} 18 0 0 ${(k > 0) === waxing ? 0 : 1} 22 4 Z`;
  return (
    <svg className="moon-ico" width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r="18" fill="color-mix(in srgb, var(--bg-2) 80%, black)" stroke="var(--line)" />
      <path d={lit} fill="var(--c-moon, #cfe0ff)" opacity="0.92" />
    </svg>
  );
}

function BlockIcons({ b }: { b: OverviewBlock }) {
  const m = b.meta;
  if (b.portrait && m?.signs?.[0]) return <SignGlyph sign={m.signs[0].sign} size={34} />;
  if (b.id === "keys" && m?.signs) return (
    <ul className="key-signs">{m.signs.map((x) => <li key={x.label}><SignGlyph sign={x.sign} size={30} /><span><small>{x.label}</small><b>{SIGN_VI[x.sign]}</b></span></li>)}</ul>
  );
  if (b.id === "elements" && m?.elements) return (
    <ul className="el-row">{Object.entries(m.elements).map(([e, c]) => <li key={e} className={`el-${e}`}><ElementIcon e={e} /><span>{EL_NAME[e]}</span><b>{c}</b></li>)}</ul>
  );
  if (b.id === "moonCycle" && m?.elong !== undefined) return <MoonPhase elong={m.elong} />;
  if (b.id === "pillars" && m?.planets?.length) return <span className="pl-row">{m.planets.map((id) => <Glyph key={id} name={id} size={30} className={`pg c-${id}`} />)}</span>;
  if (b.id === "focus") return <span className="focus-ico" aria-hidden="true">◈</span>;
  return null;
}

function Block({ b, prepared }: { b: OverviewBlock; prepared: Prepared }) {
  const { reading: r } = prepared;
  return (
    <article className={`card ov-block ov-${b.id} reveal`}>
      <header className="ov-head">
        {b.id !== "keys" && b.id !== "elements" && <span className="ov-ico"><BlockIcons b={b} /></span>}
        <div>
          <h3>{b.title}</h3>
          {b.role && <p className="key-role">{b.role}</p>}
        </div>
      </header>
      {(b.id === "keys" || b.id === "elements") && <BlockIcons b={b} />}
      {b.facts && b.id !== "elements" && <p className="keyline">{b.facts}</p>}
      {b.portrait && <>
        <p className="motif">{b.portrait.motif}</p>
        {b.portrait.beats.map((x) => (
          <div key={x.h} className="beat"><h4>{x.h}</h4><p><Gloss text={x.p} /></p></div>
        ))}
        {b.paragraphs.length > 0 && <h4 className="beat-own">Riêng trong lá số của bạn</h4>}
      </>}
      <Paras list={b.paragraphs} />
      {b.id === "pillars" && r.overview.strength && (
        <details className="params">
          <summary>Xem sức mạnh bảy hành tinh</summary>
          <StrengthBars rows={r.overview.strength} />
        </details>
      )}
      {b.id === "focus" && r.overview.focusShare && (
        <ul className="focus-bars" aria-label="Trọng lượng của lá số theo từng vùng đời sống">
          {r.overview.focusShare.map((f) => (
            <li key={f.title}><span>{f.title}</span><span className="fb"><i style={{ width: `${Math.max(3, f.pct)}%` }} /></span><b>{f.pct}%</b></li>
          ))}
        </ul>
      )}
      <Why lines={b.portrait ? [b.portrait.why, ...b.why] : b.why} />
    </article>
  );
}

export function OverviewPage({ prepared }: { prepared: Prepared }) {
  const { reading: r } = prepared;
  const L = r.letter;
  return (
    <>
      <p className="eyebrow reveal">Tổng quan</p>
      <article className="letter card reveal">
        <p className="greet">{L.greeting}</p>
        <blockquote className="headline">{L.line}</blockquote>
      </article>
      <div className="ov-blocks">
        {r.overview.blocks.map((b) => <Block key={b.id} b={b} prepared={prepared} />)}
      </div>
      <details className="params reveal">
        <summary>Bảng chín hành tinh</summary>
        <PlanetTable prepared={prepared} />
      </details>
    </>
  );
}
