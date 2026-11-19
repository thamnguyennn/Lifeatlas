// The Overview page: a letter, one sentence about the whole chart, then the blocks of the overview.
import type { Prepared } from "./logic.ts";
import { Gloss } from "./Gloss.tsx";
import { SignGlyph } from "./Glyph.tsx";
import { signIndex } from "../engine/constants.ts";
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

function Block({ b, prepared }: { b: OverviewBlock; prepared: Prepared }) {
  const { reading: r } = prepared;
  const keystone = b.id === "lagna" || b.id === "sun" || b.id === "moon";
  return (
    <article className={`card ov-block ov-${b.id}${keystone ? " key" : ""} reveal`}>
      <header>
        {b.sign && <SignGlyph sign={signIndex(b.sign)} size={42} className="key-g" />}
        <div>
          {keystone && <p className="eyebrow">{b.title}</p>}
          {keystone ? <h3>{b.sign ?? "Mặt Trăng"}</h3> : <h3>{b.title}</h3>}
          {b.role && <p className="key-role">{b.role}</p>}
        </div>
      </header>
      <Paras list={b.paragraphs} />
      {b.facts && <p className="ov-facts">{b.facts}</p>}
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
      <Why lines={b.why} />
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
        <ul className="skychips lg" aria-label="Ba điểm gốc của lá số">
          {L.chips.map((c) => (
            <li key={c.label}><SignGlyph sign={signIndex(c.value)} size={22} /><span>{c.label}<b>{c.value}</b><small className="chip-role">{c.role}</small></span></li>
          ))}
        </ul>
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
