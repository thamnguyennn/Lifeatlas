// The pages that read the chart itself: opening, overview, houses, yogas, lessons of this life and the divisional charts.
// Every sentence on these pages comes from the reading; this file only lays it out.
import { useState } from "react";
import type { Prepared } from "./logic.ts";
import type { PlanetRow, StrengthRow, VargaReading } from "../reading/types.ts";
import { DiamondChart, ChartLegend, rasiData } from "./DiamondChart.tsx";
import { HouseTiles, SavBars } from "./Houses.tsx";
import { Gloss } from "./Gloss.tsx";
import { Glyph, SignGlyph } from "./Glyph.tsx";
import { GRAHA_VI, signIndex, type GrahaId } from "../engine/constants.ts";
import { firstSentence } from "../reading/util.ts";
import { TONE_SHORT } from "./format.ts";

const Paras = ({ list }: { list: string[] }) => <>{list.map((p, i) => <p key={i}><Gloss text={p} /></p>)}</>;

type FactRow = [label: string, value: string];
export function FactList({ rows }: { rows: FactRow[] }) {
  return <dl className="factlist">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
}

const BAND_CLASS: Record<StrengthRow["band"], string> = { "rất mạnh": "b4", mạnh: "b3", vừa: "b2", yếu: "b1" };

export function StrengthBars({ rows }: { rows: StrengthRow[] }) {
  const max = Math.max(200, ...rows.map((r) => r.pct + 10));
  return (
    <figure className="sbars" style={{ ["--mark" as string]: `${(100 / max) * 100}%` }}>
      <div className="sb-grid" role="list">
        {rows.map((r, i) => (
          <div className="sb-row" role="listitem" key={r.id} style={{ ["--d" as string]: `${i * 70}ms` }}>
            <span className="sb-name"><Glyph name={r.id} size={18} />{r.name}</span>
            <span className={`sb-bar ${BAND_CLASS[r.band]}`}><i style={{ ["--w" as string]: `${(r.pct / max) * 100}%` }} /></span>
            <span className="sb-val"><b>{r.pct}%</b> <small>{r.band}</small></span>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function PlanetTable({ prepared }: { prepared: Prepared }) {
  const { reading: r, noTime } = prepared;
  const [open, setOpen] = useState<string | null>(null);
  const rows: PlanetRow[] = r.overview.planets;
  return (
    <div className={`ptable${noTime ? " nohouse" : ""}`} role="group" aria-label="Bảng hành tinh">
      <div className="prow head" aria-hidden="true">
        <span>Hành tinh</span><span>Cung · độ</span>
        {!noTime && <span>Nhà</span>}
        <span>Chòm sao (nakshatra)</span><span>Trạng thái</span><span>D9 (Navamsa)</span>
      </div>
      {rows.map((p) => (
        <div key={p.id} className={`pgroup ${open === p.id ? "open" : ""}`}>
          <button type="button" className="prow" aria-expanded={open === p.id} onClick={() => setOpen(open === p.id ? null : p.id)}>
            <span data-l="Hành tinh" className="pname"><Glyph name={p.id} size={22} className="pg" /><b>{p.name}</b><small>{p.sanskrit}</small></span>
            <span data-l="Cung · độ"><SignGlyph sign={signIndex(p.sign)} size={14} /> {p.sign} {p.deg}</span>
            {!noTime && <span data-l="Nhà">Nhà {p.house}</span>}
            <span data-l="Chòm sao">{p.nakshatra} <small>pada {p.pada}</small></span>
            <span data-l="Trạng thái" className="pstate">
              {p.dignity !== "—" && p.dignity !== "Trung tính" && <em className={`d-${p.dignity}`}>{p.dignity}</em>}
              {p.flags.map((f) => <em key={f} className="flag">{f}</em>)}
              {p.dignity === "Trung tính" && !p.flags.length && <span className="faint">Trung tính</span>}
            </span>
            <span data-l="D9">{p.navamsa}</span>
          </button>
          {open === p.id && (
            <div className="pdetail">
              <p><b>Chòm sao {p.nakshatra}</b>, pada {p.pada}, hành tinh cai quản: {p.nakLord}.</p>
              <p>{p.nakText}</p>
              {p.strengthNote && <p>{p.strengthNote}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ 3. twelve aspects of life
export function HouseMapPage({ prepared, selected, onPick }: { prepared: Prepared; selected: number | null; onPick: (n: number) => void }) {
  const { reading: r, natal } = prepared;
  if (!r.houseMap) return null;
  return (
    <>
      <p className="eyebrow reveal">Mười hai lĩnh vực đời sống</p>
      <h2 className="reveal">12 nhà – 12 khía cạnh cuộc sống</h2>
      <div className="map-grid one">
        <div className="card ov-chart reveal">
          <div className="chart-head"><h3>Lá số của bạn</h3></div>
          <DiamondChart data={rasiData(natal)} selected={selected} onPick={onPick} />
          <details className="params">
            <summary>Xem chú giải ký hiệu</summary>
            <ChartLegend />
            <p className="faint small">Nhà 1 ở trên cùng, các nhà đi ngược chiều kim đồng hồ. Bấm vào một nhà để đọc.</p>
          </details>
        </div>
      </div>
      <HouseTiles houses={r.houses} onPick={onPick} />
    </>
  );
}

// ------------------------------------------------------------------ yogas
export function YogaPage({ prepared, focus, onHouse }: { prepared: Prepared; focus: string | null; onHouse: (n: number) => void }) {
  const { reading: r, noTime } = prepared;
  const onHousePage = new Set(r.houses.flatMap((h) => h.yogaIds));
  return (
    <>
      <p className="eyebrow reveal">{noTime ? "Tổng quan" : "12 khía cạnh cuộc sống"}</p>
      <h2 className="reveal">Yoga: những tổ hợp sách cổ đặt tên</h2>
      <p className="faint reveal"><Gloss text={r.yogas.intro} /></p>
      {noTime && r.yogas.list.length > 0 && <p className="faint reveal">Vì chưa có giờ sinh, mình chỉ giữ những yoga không phụ thuộc vào cung mọc.</p>}
      <div className="yogas">
        {r.yogas.list.map((y) => (
          <article key={y.id} id={`yoga-${y.id}`} className={`yoga card glow reveal tone-${y.tone} ${focus === y.id ? "focus" : ""}`}>
            <header>
              <h3>{y.name}</h3>
              <span className={`chip tone-${y.tone}`}>{TONE_SHORT[y.tone]} · {y.strength}</span>
            </header>
            <p><Gloss text={onHousePage.has(y.id) ? firstSentence(y.text) : y.text} /></p>
            {(y.chips.length > 0 || y.detail) && (
              <details className="params">
                <summary>Xem điều kiện của yoga này</summary>
                {y.chips.length > 0 && <ul className="chips">{y.chips.map((c) => <li key={c}>{c}</li>)}</ul>}
                {y.detail && <p className="detail">{y.detail}</p>}
              </details>
            )}
            {y.houses.length > 0 && (
              <p className="yoga-houses">{onHousePage.has(y.id) ? "Đọc kỹ ở: " : "Đọc ở: "}{y.houses.map((h) => <button key={h} type="button" className="linkbtn" onClick={() => onHouse(h)}>Nhà {h}</button>)}</p>
            )}
          </article>
        ))}
      </div>
    </>
  );
}

// ------------------------------------------------------------------ 4. lessons of this life: Rahu and Ketu
export function AxisPage({ prepared }: { prepared: Prepared }) {
  const a = prepared.reading.nodes;
  return (
    <>
      <p className="eyebrow reveal">Bài học kiếp này</p>
      <h2 className="reveal">Rahu và Ketu: điều bạn đã quen và điều bạn đang hướng tới</h2>
      <p className="faint reveal"><Gloss text={a.intro} /></p>
      <div className="axis-head card reveal">
        <p className="eyebrow">{a.headline}</p>
        {a.axis.map((p, i) => <p key={i} className={i === 0 ? "axis-lesson" : undefined}><Gloss text={p} /></p>)}
      </div>
      <div className="axis-grid">
        <article className="card prose axis-end ketu reveal">
          <header><Glyph name="ketu" size={26} className="ng" /><h3>{a.ketu.title}</h3></header>
          <Paras list={a.ketu.paragraphs} />
        </article>
        <article className="card prose axis-end rahu reveal">
          <header><Glyph name="rahu" size={26} className="ng" /><h3>{a.rahu.title}</h3></header>
          <Paras list={a.rahu.paragraphs} />
        </article>
      </div>
      {a.bridge.length > 0 && <div className="summary reveal"><strong>Cách nối hai đầu lại</strong>{a.bridge.map((p, i) => <p key={i}>{p}</p>)}</div>}
      {a.ask && <p className="p-ask reveal"><span>Một câu hỏi để mang theo</span>{a.ask}</p>}
      <details className="params reveal">
        <summary>Vì sao mình nói điều này?</summary>
        <div className="factor-table" role="table" aria-label="Mười hai câu hỏi về Rahu và Ketu">
          <div className="ft-row ft-head" role="row"><span>Yếu tố</span><span>Rahu</span><span>Ketu</span></div>
          {a.factors.map((f) => (
            <div className="ft-row" role="row" key={f.n}>
              <span role="cell"><b>{f.n}. {f.name}</b><small>{f.question}</small></span>
              <span role="cell">{f.rahu}</span>
              <span role="cell">{f.ketu}</span>
            </div>
          ))}
        </div>
      </details>
    </>
  );
}

// ------------------------------------------------------------------ 5. divisional charts
function HoraBoxes({ hora }: { hora: NonNullable<VargaReading["hora"]> }) {
  const box = (key: "sun" | "moon", title: string, sub: string) => (
    <div className={`hora hora-${key}`}>
      <h4>{title}</h4>
      <small>{sub}</small>
      <ul>
        {(hora[key] as GrahaId[]).map((g) => <li key={g}><Glyph name={g} size={18} /> {GRAHA_VI[g]}</li>)}
        {hora[key].length === 0 && <li className="faint">Không có hành tinh nào</li>}
      </ul>
    </div>
  );
  return (
    <div className="hora-wrap">
      {box("sun", "Hora Mặt Trời", "Chủ động, tự mình nắm")}
      {box("moon", "Hora Mặt Trăng", "Quan hệ, trao đổi, thị trường")}
    </div>
  );
}

const VARGA_KEY: Record<number, GrahaId> = { 2: "jupiter", 3: "mars", 4: "moon", 7: "jupiter", 9: "venus", 10: "sun" };

export function VargaPage({ prepared, n }: { prepared: Prepared; n: VargaReading["n"] }) {
  const v = prepared.reading.vargas?.find((x) => x.n === n);
  if (!v) return null;
  return (
    <>
      <p className="eyebrow reveal">Biểu đồ chuyên sâu</p>
      <h2 className={`reveal varga-title vt-${v.n}`}><Glyph name={VARGA_KEY[v.n]} size={34} className={`pg c-${VARGA_KEY[v.n]}`} /> {v.code} · {v.name}</h2>
      <p className="lead reveal">{v.question}</p>
      <div className="varga">
        <div className="varga-side card reveal">
          <DiamondChart data={{ lagnaSign: v.chart.lagnaSign, planets: v.chart.planets, label: `Lá số ${v.code} (${v.name})` }} />
          <ChartLegend />
        </div>
        <div className="varga-text card prose reveal">
          <h3 className="central-h">Nhận định chung</h3>
          <p className="central"><Gloss text={v.summary[0]} /></p>
          <Paras list={v.summary.slice(1)} />
          <h3>Những điểm nổi bật</h3>
          {v.points.map((pt) => (
            <div key={pt.title} className="varga-point">
              <h4>{pt.title}</h4>
              <Paras list={pt.paragraphs} />
            </div>
          ))}
          <h3>3 · Độ ổn định trong sai số giờ sinh</h3>
          <p className={`trust trust-${v.trust.level === "chắc" ? "ok" : "warn"}`}><b>{v.trust.level === "chắc" ? "Cấu trúc ổn định" : v.trust.level === "không" ? "Chưa đủ dữ liệu" : "Cần thận trọng"}.</b> <Gloss text={v.trust.note} /></p>
          {v.why.length > 0 && (
            <details className="params why-drawer">
              <summary>Vì sao mình nói điều này?</summary>
              <ul className="why">{v.why.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </details>
          )}
        </div>
      </div>
    </>
  );
}
