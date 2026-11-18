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

export function KeysPage({ prepared }: { prepared: Prepared }) {
  const { letter, overview } = prepared.reading;
  return <>
    <article className="letter card reveal"><blockquote className="headline">{letter.line}</blockquote></article>
    <h2 className="reveal">Tổng quan</h2>
    <article className="card prose reveal">
      {overview.synthesis.paragraphs.map((p) => <p key={p}>{p}</p>)}
      <details className="params"><summary>Các cung trong lời đọc này</summary>
        {overview.synthesis.anchors.map((p) => <p key={p}>{p}</p>)}
      </details>
    </article>
  </>;
}

const BAND_CLASS: Record<StrengthRow["band"], string> = { "rất mạnh": "b4", mạnh: "b3", vừa: "b2", yếu: "b1" };

function StrengthBars({ rows }: { rows: StrengthRow[] }) {
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

function PlanetTable({ prepared }: { prepared: Prepared }) {
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

export function CommonPage({ prepared }: { prepared: Prepared }) {
  const ov = prepared.reading.overview;
  return (
    <>
      <p className="eyebrow reveal">Tổng quan</p>
      <h2 className="reveal">Những điểm chung của lá số</h2>
      <div className="commons">
        {ov.common.map((c) => (
          <article key={c.id} className="card common reveal">
            <h3>{c.title}</h3>
            <Paras list={c.paragraphs} />
          </article>
        ))}
      </div>
      {ov.strength && (
        <section className="card strength reveal">
          <h3>Sức mạnh của bảy hành tinh</h3>
          <p><Gloss text={ov.strength.intro} /></p>
          <StrengthBars rows={ov.strength.rows} />
          <p>{ov.strength.best}</p>
          <p>{ov.strength.worst}</p>
        </section>
      )}
      <details className="params reveal">
        <summary>Bảng chín hành tinh</summary>
        <PlanetTable prepared={prepared} />
      </details>
    </>
  );
}

// ------------------------------------------------------------------ 3. twelve aspects of life
export function HouseMapPage({ prepared, selected, onPick }: { prepared: Prepared; selected: number | null; onPick: (n: number) => void }) {
  const { reading: r, natal } = prepared;
  if (!r.houseMap) return null;
  return (
    <>
      <p className="eyebrow reveal">12 khía cạnh cuộc sống</p>
      <h2 className="reveal">Mười hai khía cạnh của cuộc sống</h2>
      <div className="map-intro reveal"><p className="lead"><Gloss text={r.houseMap.intro[0]} /></p></div>
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
      <h3 className="sub-h reveal">Chọn một khía cạnh để đọc</h3>
      <HouseTiles houses={r.houses} onPick={onPick} />
      <details className="params reveal">
        <summary>Xem điểm SAV của 12 nhà</summary>
        <SavBars houses={r.houses} onPick={onPick} />
      </details>
      <details className="params reveal">
        <summary>Cách mình đọc mỗi nhà</summary>
        <ol className="layers" aria-label="Sáu lớp đọc của mỗi nhà">
          <li className="layers-head">Mỗi nhà được đọc qua sáu lớp cấu trúc gốc</li>
          {r.houseMap.layers.map((l, i) => (
            <li key={l.title}><span className="ln">{i + 1}</span><div><b>{l.title}</b><span><Gloss text={l.text} /></span></div></li>
          ))}
        </ol>
      </details>
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

// ------------------------------------------------------------------ 4. lessons of this life
export function AxisPage({ prepared }: { prepared: Prepared }) {
  const a = prepared.reading.lessons.axis;
  return (
    <>
      <p className="eyebrow reveal">Bài học kiếp này</p>
      <h2 className="reveal">Điều bạn đã thạo và điều bạn đến để học</h2>
      <p className="faint reveal"><Gloss text={a.intro} /></p>
      <div className="axis-head card reveal">
        <p className="eyebrow">{a.headline}</p>
        {a.lesson && <p className="axis-lesson">{a.lesson}</p>}
        {a.pull && <p>{a.pull}</p>}
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
      {a.bridge && <div className="summary reveal"><strong>Cách nối hai đầu lại</strong><p>{a.bridge}</p></div>}
      {a.ask && <p className="p-ask reveal"><span>Một câu hỏi để mang theo</span>{a.ask}</p>}
      <details className="params reveal">
        <summary>Thông số của Rahu và Ketu</summary>
        <FactList rows={a.facts.map((f) => [f.label, f.value] as FactRow)} />
      </details>
    </>
  );
}

export function SoulPage({ prepared }: { prepared: Prepared }) {
  const s = prepared.reading.lessons.soul;
  if (!s) return null;
  return (
    <>
      <p className="eyebrow reveal">Bài học kiếp này</p>
      <h2 className="reveal">Hành tinh của linh hồn</h2>
      <p className="faint reveal"><Gloss text={s.intro} /></p>
      <div className="soul-grid">
        <article className="card prose soul-card reveal">
          <p className="eyebrow">Hành tinh dẫn đường · {s.ak.planet}</p>
          <h3>{s.ak.title}</h3>
          <Paras list={s.ak.paragraphs} />
          <p className="p-ask"><span>Một câu hỏi để mang theo</span>{s.ak.ask}</p>
        </article>
        <article className="card prose soul-card reveal">
          <p className="eyebrow">Nơi linh hồn muốn được thể hiện</p>
          <h3>{s.karakamsa.title}</h3>
          <Paras list={s.karakamsa.paragraphs} />
        </article>
      </div>
    </>
  );
}

export function KarakasPage({ prepared }: { prepared: Prepared }) {
  const s = prepared.reading.lessons.soul;
  if (!s) return null;
  return (
    <>
      <p className="eyebrow reveal">Bài học kiếp này</p>
      <h2 className="reveal">Bảy vai trò trong đời</h2>
      <p className="faint reveal"><Gloss text="Hệ Jaimini giao cho bảy hành tinh bảy vai khác nhau, mỗi vai là một người đồng hành trong đời bạn: linh hồn, người cố vấn, anh chị em, mẹ, con cái, đối thủ và bà con, bạn đời." /></p>
      <div className="karakas">
        {s.karakas.map((k) => (
          <article key={k.role} className="card karaka reveal">
            <header>
              <Glyph name={k.planetId} size={30} className="kg" />
              <div>
                <p className="eyebrow">{k.sa}</p>
                <h3>{k.meaning}</h3>
                <p className="k-planet">{k.planet}</p>
              </div>
            </header>
            <Paras list={k.paragraphs} />
          </article>
        ))}
      </div>
    </>
  );
}

// ------------------------------------------------------------------ 5. divisional charts
function HoraBoxes({ hora }: { hora: NonNullable<VargaReading["hora"]> }) {
  const box = (key: "sun" | "moon", title: string, sub: string) => (
    <div className={`hora hora-${key}`}>
      <h4>{title}{hora.lagna === key && <em>Cung mọc của bạn ở nhóm này</em>}</h4>
      <small>{sub}</small>
      <ul>
        {(hora[key] as GrahaId[]).map((g) => <li key={g}><Glyph name={g} size={18} /> {GRAHA_VI[g]}</li>)}
        {hora[key].length === 0 && <li className="faint">Không có hành tinh nào</li>}
      </ul>
    </div>
  );
  return (
    <div className="hora-wrap">
      <h3>D2 · Hora</h3>
      {box("sun", "Nhóm Mặt Trời", "Chủ động, vị thế, tự mình làm")}
      {box("moon", "Nhóm Mặt Trăng", "Quan hệ, trao đổi, chăm sóc")}
    </div>
  );
}

export function VargaPage({ prepared, n }: { prepared: Prepared; n: VargaReading["n"] }) {
  const v = prepared.reading.vargas?.find((x) => x.n === n);
  if (!v) return null;
  return (
    <>
      <p className="eyebrow reveal">Biểu đồ chuyên sâu</p>
      <h2 className="reveal">{v.code} · {v.name}</h2>
      <div className="varga">
        <div className="varga-side card reveal">
          {v.chart ? (
            <>
              <DiamondChart data={{ lagnaSign: v.chart.lagnaSign, planets: v.chart.planets, label: `Lá số ${v.code} (${v.name})` }} />
              <ChartLegend />
            </>
          ) : v.hora ? <HoraBoxes hora={v.hora} /> : null}
        </div>
        <div className="varga-text card prose reveal">
          <h3>{v.short.charAt(0).toUpperCase() + v.short.slice(1)}</h3>
          <p><Gloss text={v.lead} /></p>
          <Paras list={v.paragraphs} />
          {v.why && v.why.length > 0 && (
            <details className="params why-drawer">
              <summary>Vì sao mình nói điều này?</summary>
              <ul className="why">{v.why.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </details>
          )}
          <details className="params"><summary>Xem cách chia lá số này</summary>{v.note && <p className="faint small">{v.note}</p>}<p className="faint small">{v.how}</p></details>
        </div>
      </div>
      {v.houses && (
        <section className="varga-houses card prose reveal">
          <h3>{v.housesTitle}</h3>
          <p><Gloss text={v.housesIntro ?? ""} /></p>
          {v.houses.map((h) => (
            <details key={h.house} className="layers" open={h.house === 1 || (v.n === 9 ? h.house === 7 : h.house === 10)}>
              <summary><b>Nhà {h.house} · {h.sign}</b> · {h.topic}</summary>
              <p><Gloss text={h.text} /></p>
              {h.notes.map((t, i) => <p key={i} className="faint small"><Gloss text={t} /></p>)}
            </details>
          ))}
        </section>
      )}
    </>
  );
}
