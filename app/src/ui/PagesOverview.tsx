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
  if ((b.portrait || b.id === "lagna") && m?.signs?.[0]) return <SignGlyph sign={m.signs[0].sign} size={34} />;
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
      {b.pairs && b.pairs.map((x) => (
        <div key={x.h} className="beat pair"><h4>{x.h}</h4><p><Gloss text={x.p} /></p></div>
      ))}
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
  const X = r.overview.explore;
  return (
    <>
      <p className="eyebrow reveal">Tổng quan</p>
      <section className="ov5-sec reveal">
        <h2 className="ov5-h">Khám phá bản thân từ ngoài vào trong</h2>
        <p className="ov5-lead">{X.lead}</p>
        <div className="ov-blocks">
          {X.parts.map((p) => (
            <article key={p.key} className={`card ov-block ov5-part ov5-${p.key} reveal`}>
              <header className="ov-head">
                <span className="ov-ico"><SignGlyph sign={p.sign} size={34} /></span>
                <div><h3>{p.title}</h3><p className="key-role">{p.role}</p></div>
              </header>
              <Paras list={p.paragraphs} />
            </article>
          ))}
        </div>
      </section>
      <section className="ov5-sec reveal">
        <h2 className="ov5-h">Những đặc điểm nổi bật</h2>
        <article className="card ov-block ov5-high reveal">
          {X.highlights.map((h) => (
            <div key={h.key} className={`ov5-row ov5-${h.key}`}>
              <h4>{h.title}</h4>
              {h.elements && <ul className="el-row">{Object.entries(h.elements).map(([e, c]) => <li key={e} className={`el-${e}`}><ElementIcon e={e} /><span>{EL_NAME[e]}</span><b>{c}</b></li>)}</ul>}
              {h.planets && h.planets.length > 0 && <span className="pl-row">{h.planets.map((id) => <Glyph key={id} name={id} size={26} className={`pg c-${id}`} />)}</span>}
              <p><Gloss text={h.text} /></p>
            </div>
          ))}
        </article>
      </section>
      <section className="ov5-sec reveal">
        <h2 className="ov5-h">Bức tranh tổng thể</h2>
        <article className="card ov-block ov5-sum reveal"><p><Gloss text={X.summary} /></p></article>
      </section>
      <details className="params ov5-basis reveal">
        <summary>Cơ sở luận giải</summary>
        {X.basis.map((b) => (
          <div key={b.h} className="ov5-basis-grp"><h4>{b.h}</h4><ul>{b.lines.map((l, i) => <li key={i}>{l}</li>)}</ul></div>
        ))}
        {r.overview.strength && <><h4>Sức mạnh bảy hành tinh (Shadbala)</h4><StrengthBars rows={r.overview.strength} /></>}
        <h4>Bảng chín hành tinh</h4>
        <PlanetTable prepared={prepared} />
      </details>
    </>
  );
}
