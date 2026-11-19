import type { HouseReading, Section, Tone } from "../reading/types.ts";
import { SignGlyph } from "./Glyph.tsx";
import { signIndex } from "../engine/constants.ts";
import { Gloss } from "./Gloss.tsx";
import { HOUSE_SECTION_TITLES } from "../reading/content/house-deep.ts";

export const toneLabel = (n: number, t: Tone) =>
  t === "mixed" ? "Có thuận có khó" : t === "good" ? ([6, 8, 12].includes(n) ? "Ít khó khăn" : "Thuận lợi") : "Nhiều khó khăn";

/** Twelve bars: Sarvashtakavarga points per house, with the average (28) marked. */
export function SavBars({ houses, onPick }: { houses: HouseReading[]; onPick: (n: number) => void }) {
  const max = 40;
  return (
    <figure className="savbars">
      <div className="bars" role="list">
        <div className="avg" style={{ bottom: `${(28 / max) * 100}%` }}><span>trung bình 28</span></div>
        {houses.map((h, i) => (
          <button key={h.n} role="listitem" type="button" className={`bar ${h.sav >= 31 ? "hi" : h.sav <= 25 ? "lo" : ""}`}
            style={{ ["--h" as string]: `${(h.sav / max) * 100}%`, ["--d" as string]: `${i * 45}ms` }}
            onClick={() => onPick(h.n)} aria-label={`Nhà ${h.n}: ${h.sav} điểm SAV`}>
            <i /><b>{h.sav}</b><span>{h.n}</span>
          </button>
        ))}
      </div>
      <figcaption>SAV là cách Jyotish chấm điểm mức được nâng đỡ của từng nhà (tổng 337 điểm, trung bình mỗi nhà 28, vẽ bằng đường đứt). Cột cao là có nhiều hỗ trợ. Riêng nhà 6, 8, 12, ít điểm lại nhẹ nhàng hơn.</figcaption>
    </figure>
  );
}

/** The map page: twelve tiles, each a door to one house. */
export function HouseTiles({ houses, onPick }: { houses: HouseReading[]; onPick: (n: number) => void }) {
  return (
    <div className="htiles">
      {houses.map((h) => (
        <button key={h.n} type="button" className={`htile card glow tone-${h.tone}`} onClick={() => onPick(h.n)} aria-label={`Mở nhà ${h.n}: ${h.tag}`}>
          <span className="hnum"><b>{h.n}</b><SignGlyph sign={signIndex(h.signName)} size={18} /></span>
          <span className="ht-body">
            <strong>{h.tag}</strong>
            <small>{h.ask}</small>
            <span className="ht-meta">
              <span className={`chip tone-${h.tone}`}>{h.supportLevel}</span>
              
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

function SectionView({ s, onYoga }: { s: Section; onYoga: (id: string) => void }) {
  return (
    <section className={`hsec hs-${s.id}`}>
      {s.id !== "open" && <h3>{s.title}</h3>}
      {s.paragraphs.map((p, i) => <p key={i} className={s.id === "summary" && i === 0 ? "central" : s.id === "open" ? "hs-intro" : undefined}><Gloss text={p} /></p>)}
      {s.blocks && (
        <div className="hblocks">
          {s.blocks.map((b, i) => (
            <div className="hblock" key={i}>
              <p className="hb-title">{b.label}</p>
              {b.paragraphs.map((p, j) => <p key={j}><Gloss text={p} /></p>)}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** One house, as a page: a short essay in sections, then the numbers behind it, collapsed. */
export function HousePage({ h, onYoga, printing = false }: { h: HouseReading; onYoga: (id: string) => void; printing?: boolean }) {
  const shown = h.sections.filter((s) => !s.fold);
  const layers = h.sections.filter((s) => s.fold);
  return (
    <article className={`housepage tone-${h.tone}`}>
      <header className="hp-head">
        <span className="hnum big"><b>{h.n}</b><SignGlyph sign={signIndex(h.signName)} size={22} /></span>
        <div>
          <p className="eyebrow">Nhà {h.n}</p>
          <h2>{h.tag.charAt(0).toUpperCase() + h.tag.slice(1)}</h2>
          <p className="hp-ask">{h.ask}</p>
        </div>
        <ul className="hp-chips">
          <li><span className={`chip tone-${h.tone}`}>{h.supportLevel === "thuận lợi" ? "Nhiều thuận lợi" : h.supportLevel === "cần rèn giũa" ? "Cần xây dựng từng bước" : "Có thuận, có khó"}</span></li>
        </ul>
      </header>
      <div className="hp-body card prose">
        {shown.map((s) => <SectionView key={s.id} s={s} onYoga={onYoga} />)}
      </div>
      <details className="layers" open={printing}>
        <summary>Vì sao mình nói điều này?</summary>
        <div className="prose">
          <ul className="why">{h.why.length ? h.why.map((w, i) => <li key={i}>{w}</li>) : <li>Không có yếu tố nào cộng hoặc trừ điểm.</li>}</ul>
          {layers.map((s) => <SectionView key={s.id} s={s} onYoga={onYoga} />)}
        </div>
      </details>
    </article>
  );
}
