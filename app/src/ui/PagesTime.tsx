// The pages about time: the chapters of life (dasha, five levels), where you stand in them today, the sky today, and the day's message.
import { useMemo, useRef, useState } from "react";
import type { Prepared } from "./logic.ts";
import type { MahaRow, PeriodRead, Trust } from "../reading/types.ts";
import type { DayReading } from "../reading/compose.ts";
import { readChildren, readTrend } from "../reading/compose.ts";
import type { Ctx } from "../reading/compose.ts";
import { LEVEL_NAME } from "../engine/dasha5.ts";
import { YEAR_MS } from "../engine/core.ts";
import { Intake } from "./Intake.tsx";
import { prepare } from "./logic.ts";
import { readCompat } from "../reading/compat.ts";
import { Gloss } from "./Gloss.tsx";
import { Glyph, SignGlyph } from "./Glyph.tsx";
import { signIndex } from "../engine/constants.ts";
import { TONE_TEXT } from "./format.ts";
import { Emblem } from "./Emblem.tsx";
import { HOUSE_SHORT } from "../reading/facts.ts";

const Paras = ({ list }: { list: string[] }) => <>{list.map((p, i) => <p key={i}><Gloss text={p} /></p>)}</>;
const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (ms: number) => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

// ------------------------------------------------------------------ choosing the day
export function DayPicker({ prepared, dayMs, onChange }: { prepared: Prepared; dayMs: number | null; onChange: (ms: number | null) => void }) {
  const first = prepared.natal.utcMs + 86_400_000;
  const last = prepared.natal.utcMs + 110 * YEAR_MS;
  const cur = dayMs ?? prepared.ctx.now;
  const set = (ms: number) => { if (ms >= first && ms <= last) onChange(ms); };
  const shift = (days: number) => { const d = new Date(cur); d.setDate(d.getDate() + days); d.setHours(12, 0, 0, 0); set(d.getTime()); };
  return (
    <div className="daypick reveal">
      <label>
        <span>Xem ngày</span>
        <input type="date" value={ymd(cur)} min={ymd(first)} max={ymd(last)}
          onChange={(e) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.target.value); if (m) set(new Date(+m[1], +m[2] - 1, +m[3], 12).getTime()); }} />
      </label>
      <button type="button" className="btn ghost" onClick={() => shift(-1)} aria-label="Ngày trước">←</button>
      <button type="button" className="btn ghost" onClick={() => shift(1)} aria-label="Ngày sau">→</button>
      {dayMs !== null && <button type="button" className="linkbtn" onClick={() => onChange(null)}>Về hôm nay</button>}
    </div>
  );
}

const TRUST_CLASS: Record<Trust, string> = { chắc: "hi", "gần đúng": "mid", "chỉ tham khảo": "lo" };
function TrustChip({ t }: { t: Trust }) {
  if (t === "chắc") return null;
  return <span className={`chip tchip tchip-${TRUST_CLASS[t]}`} title="Độ tin cậy của mốc này, tính từ độ chính xác của giờ sinh bạn đã nhập">Độ tin cậy: {t}</span>;
}

/** Which way a sub-period goes, worked out only when it is opened because it needs four looks at the sky. */
function Trend({ ctx, p }: { ctx: Ctx; p: PeriodRead }) {
  const t = useMemo(() => readTrend(ctx, p), [ctx, p]);
  if (!t) return null;
  return <p className="trend"><span className={`chip trend-${t.kind}`}>{t.label}</span> <Gloss text={t.text} /></p>;
}

// ------------------------------------------------------------------ the chapters, one level at a time
function PeriodItem({ ctx, p }: { ctx: Ctx; p: PeriodRead }) {
  const [open, setOpen] = useState(false);
  const [kids, setKids] = useState<PeriodRead[] | null>(null);
  const [showKids, setShowKids] = useState(false);
  const toggleKids = () => {
    if (!kids) setKids(readChildren(ctx, p));
    setShowKids((s) => !s);
  };
  return (
    <li className={`pitem lv${p.level} ${p.state}${open ? " open" : ""}`}>
      <button type="button" className="phead" aria-expanded={open} onClick={() => setOpen(!open)}>
        <Glyph name={p.lord} size={18} className="pg" />
        <span className="pt"><b>{p.lordName}</b><small>{p.from} – {p.to} · {p.span}</small></span>
        {p.state === "now" && <span className="chip state-now">đang diễn ra</span>}
        {p.tone && p.level <= 2 && <span className={`chip tone-${p.tone}`}>{TONE_TEXT[p.tone]}</span>}
        <TrustChip t={p.trust} />
        <span className="chev" aria-hidden="true" />
      </button>
      {open && (
        <div className="pbody">
          <Paras list={p.paragraphs} />
          {p.level === 2 && <Trend ctx={ctx} p={p} />}
          {p.level < 5 && (
            <button type="button" className="linkbtn" aria-expanded={showKids} onClick={toggleKids}>
              {showKids ? "Gập lại" : `Chia nhỏ thành chín đoạn (${LEVEL_NAME[(p.level + 1) as 2 | 3 | 4 | 5].toLowerCase()})`}
            </button>
          )}
          {showKids && kids && <PeriodList ctx={ctx} items={kids} />}
        </div>
      )}
    </li>
  );
}

function PeriodList({ ctx, items }: { ctx: Ctx; items: PeriodRead[] }) {
  return <ul className="plist">{items.map((p) => <PeriodItem key={`${p.level}-${p.fromMs}`} ctx={ctx} p={p} />)}</ul>;
}

function Layers({ p }: { p: PeriodRead }) {
  if (!p.layers) return <Paras list={p.paragraphs} />;
  return <>{p.layers.map((l) => <div key={l.title} className="dlayer"><h4>{l.title}</h4><p><Gloss text={l.text} /></p></div>)}</>;
}
function MahaCard({ ctx, m, open, onToggle, setRef }: { ctx: Ctx; m: MahaRow; open: boolean; onToggle: () => void; setRef: (el: HTMLElement | null) => void }) {
  const stateText = m.state === "now" ? "Đang diễn ra" : m.state === "past" ? "Đã qua" : "Sắp tới";
  return (
    <article ref={setRef} className={`dcard card tone-${m.tone} ${m.state} ${open ? "open" : ""}`}>
      <button type="button" className="dhead" aria-expanded={open} onClick={onToggle}>
        <Emblem id={m.lord} size={40} title="" className="dg" />
        <span className="dt"><strong>Đại vận {m.name}</strong><small>{m.from} – {m.to} · <span className="nw">tuổi {m.ageFrom}–{m.ageTo}</span></small></span>
        {m.litHouses && m.litHouses.length > 0 && (
          <span className="chip lit-houses">{m.litHouses.slice(0, 2).map((h) => HOUSE_SHORT[h - 1]).join(" · ")}</span>
        )}
        <span className={`chip state-${m.state}`}>{stateText}</span>
        <span className={`chip tone-${m.tone}`}>{TONE_TEXT[m.tone]}</span>
        <TrustChip t={m.read.trust} />
        <span className="chev" aria-hidden="true" />
      </button>
      {open && (
        <div className="dbody">
          <p className="chapter-title">{m.read.title}</p>
          <Layers p={m.read} />
          <h4 className="sub-h">Chín tiểu vận trong giai đoạn này</h4>
          <PeriodList ctx={ctx} items={m.antars} />
          <details className="params why-drawer">
            <summary>Vì sao mình nói điều này?</summary>
            <ul className="why">{m.why.length ? m.why.map((w, i) => <li key={i}>{w}</li>) : <li>Không có yếu tố nào cộng hoặc trừ điểm.</li>}</ul>
          </details>
        </div>
      )}
    </article>
  );
}

export function ChaptersPage({ prepared, now }: { prepared: Prepared; now: number }) {
  const { natal, reading: r, noTime, ctx } = prepared;
  const t = r.timeline;
  const ageNow = (now - natal.utcMs) / YEAR_MS;
  const cap = 90;
  const curIdx = Math.max(0, t.mahas.findIndex((d) => d.state === "now"));
  const [open, setOpen] = useState<number>(curIdx);
  const curM = t.mahas[curIdx]?.state === "now" ? t.mahas[curIdx] : null;
  const curA = curM?.antars.find((a) => a.state === "now") ?? null;
  const refs = useRef<(HTMLElement | null)[]>([]);
  const pct = (a: number) => `${Math.max(0, Math.min(100, (a / cap) * 100))}%`;
  const go = (i: number) => { setOpen(i); setTimeout(() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" }), 60); };
  return (
    <>
      <p className="eyebrow reveal">Đại vận và tiểu vận</p>
      <h2 className="reveal">Các giai đoạn đời của bạn</h2>
      {curM && (
        <div className="now-card card reveal" role="group" aria-label="Giai đoạn hiện tại">
          <div><small>Đại vận hiện tại</small><b>{curM.name}</b><span>{curM.from} – {curM.to}</span></div>
          {curA && <div><small>Tiểu vận hiện tại</small><b>{curA.lordName}</b><span>{curA.from} – {curA.to}</span></div>}
          <button type="button" className="btn ghost" onClick={() => go(curIdx)}>Đọc giai đoạn này ↓</button>
        </div>
      )}
      {noTime && <p className="birthline reveal">Vì chưa có giờ sinh, các mốc thời gian có thể lệch.</p>}
      <div className="timeline reveal" aria-label="Các đại vận theo tuổi">
        <div className="tl-bar">
          {t.mahas.map((d, i) => {
            const from = d.ageFrom, to = Math.min(d.ageTo, cap);
            if (to <= from) return null;
            return (
              <button key={i} type="button" className={`tl-seg tone-${d.tone} ${d.state}`} style={{ left: pct(from), width: `calc(${pct(to)} - ${pct(from)})`, ["--i" as string]: String(i) }}
                onClick={() => go(i)} title={`${d.name}: tuổi ${d.ageFrom}–${d.ageTo}`} aria-label={`Đại vận ${d.name}, tuổi ${d.ageFrom} đến ${d.ageTo}`}>
                <Glyph name={d.lord} size={16} /><span>{d.name.replace("Sao ", "")}</span>
              </button>
            );
          })}
          {ageNow >= 0 && ageNow <= cap && <div className="tl-now" style={{ left: pct(ageNow) }}><span>Bạn · {Math.floor(ageNow)} tuổi</span></div>}
        </div>
        <div className="tl-axis">{[0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map((a) => <span key={a} style={{ left: pct(a) }}>{a}</span>)}</div>
      </div>
      <div className="dlist">
        {t.mahas.map((m, i) => <MahaCard key={i} ctx={ctx} m={m} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} setRef={(el) => { refs.current[i] = el; }} />)}
      </div>
      <details className="params reveal">
        <summary>Xem cách tính các giai đoạn</summary>
        <p className="birthline">{t.birth}</p>
        <aside className={`callout check trust-note lv${t.reliability.stableLevels}`}><p>{t.reliability.note}</p></aside>
      </details>
    </>
  );
}

// ------------------------------------------------------------------ where you stand today
function GocharaSection({ day }: { day: DayReading }) {
  const S = day.sky;
  return (
    <section className="gochara reveal">
      <h3 className="sub-h">Gochara: các hành tinh đang đi qua đâu</h3>
      <p className="faint"><Gloss text={S.intro} /></p>
      <section className={`card block sade phase-${S.sade.phase} reveal`}>
        <h3>{S.sade.title}</h3>
        <p><Gloss text={S.sade.text} /></p>
      </section>
      {S.specials.map((sp) => (
        <section key={sp.title} className="card block reveal"><h3>{sp.title}</h3><p><Gloss text={sp.text} /></p></section>
      ))}

      <h3 className="sub-h reveal">Các hành tinh chậm đang đi qua đâu</h3>
      <div className="skyplanets">
        {S.planets.map((pl) => (
          <article key={pl.id} className={`card sp support-${pl.support} reveal`}>
            <header>
              <Glyph name={pl.id} size={26} className="sg" />
              <div>
                <h4>{pl.name}</h4>
                <p className="sp-pos"><SignGlyph sign={signIndex(pl.sign)} size={14} /> {pl.sign} {pl.deg}{pl.retro ? " · đang đi lùi" : ""}</p>
              </div>
              <span className={`chip sup-${pl.support}`}>nâng đỡ: {pl.support}</span>
            </header>
            <div className="gochara-lenses">
              <div className="lens-block">
                <p className="lens-label">Góc nhìn từ Mặt Trăng · Trải nghiệm cảm xúc (cung thứ {pl.fromMoon})</p>
                <p><Gloss text={pl.moonText} /></p>
              </div>
              {pl.lagnaText && pl.fromLagna !== null && (
                <div className="lens-block">
                  <p className="lens-label">Góc nhìn từ Cung mọc · Bối cảnh thực tế (nhà {pl.fromLagna})</p>
                  <p><Gloss text={pl.lagnaText} /></p>
                </div>
              )}
              {pl.divergenceNote && (
                <p className="lens-divergence"><Gloss text={pl.divergenceNote} /></p>
              )}
            </div>
            <details className="params mini">
              <summary>Xem vị trí so với lá số</summary>
              <ul className="sp-meta">
                {pl.fromLagna !== null && <li>Nhà {pl.fromLagna} tính từ cung mọc</li>}
                <li>Cung thứ {pl.fromMoon} tính từ Mặt Trăng của bạn{pl.bindus !== null ? ` · điểm BAV: ${pl.bindus}/8` : ""}</li>
                {pl.stay && <li>{pl.stay}</li>}
              </ul>
            </details>
          </article>
        ))}
      </div>

    </section>
  );
}

export function NowPage({ prepared, day, dayMs, onDay }: { prepared: Prepared; day: DayReading; dayMs: number | null; onDay: (ms: number | null) => void }) {
  const L = day.ladder;
  return (
    <>
      <p className="eyebrow reveal">Đại vận và tiểu vận</p>
      <h2 className="reveal">Bạn đang ở đâu trong các giai đoạn</h2>
      <DayPicker prepared={prepared} dayMs={dayMs} onChange={onDay} />
      <p className="faint reveal">Ngày {L.dateLabel}: cả năm bậc đang chạy cùng lúc, từ giai đoạn lớn nhất đến nhỏ nhất.</p>
      <ol className="ladder">
        {L.levels.map((p) => (
          <li key={p.level} className={`rung lv${p.level} reveal`}>
            <div className="rung-side">
              <Emblem id={p.lord} size={44} title="" className="rg" />
              <span className="rung-lv">{p.name}</span>
              <small>{p.sanskrit}</small>
            </div>
            <div className="rung-main card">
              <header>
                <h3>{p.level === 1 ? p.title : p.lordName}</h3>
                {p.tone && p.level <= 2 && <span className={`chip tone-${p.tone}`}>{TONE_TEXT[p.tone]}</span>}
                <TrustChip t={p.trust} />
              </header>
              <p className="rung-dates">{p.level > 1 && <>{p.path.join(" → ")} · </>}{p.from} – {p.to} · {p.span}</p>
              <Layers p={p} />
              {p.level === 2 && <Trend ctx={prepared.ctx} p={p} />}
            </div>
          </li>
        ))}
      </ol>
      {L.blend.length > 0 && (
        <section className="card block glow reveal">
          <h3>Đặt cạnh bầu trời của ngày này</h3>
          <Paras list={L.blend} />
        </section>
      )}
      <details className="params reveal">
        <summary>Xem độ chắc chắn của các mốc</summary>
        <aside className="callout check"><p>{L.trustNote}</p></aside>
      </details>
      <GocharaSection day={day} />
    </>
  );
}

// ------------------------------------------------------------------ the sky today
// ------------------------------------------------------------------ explore more
const ICON: Record<string, string> = { compat: "∞", love: "♡", marriage: "◎", talent: "✦", career: "◆", money: "◈", leader: "▲", study: "✧", health: "☼", family: "⌂", dharma: "☸", inner: "☯" };

function TopicView({ t, onBack }: { t: { id: string; title: string; ask: string; lead: string; basis?: string; points: { title: string; text: string }[]; why: string[]; needsTime: boolean }; onBack: () => void }) {
  return (
    <article className="topic-view swap-in">
      <button type="button" className="btn ghost back" onClick={onBack}>← Tất cả chủ đề</button>
      <p className="eyebrow">{ICON[t.id]} Khám phá thêm</p>
      <h3 className="topic-title">{t.title}</h3>
      <p className="topic-ask">{t.ask}</p>
      <p className="central"><Gloss text={t.lead} /></p>
      {t.basis && <p className="keyline">Dựa trên: {t.basis}</p>}
      <div className="facets">
        {t.points.map((p) => <section key={p.title} className="card facet"><h4>{p.title}</h4><p><Gloss text={p.text} /></p></section>)}
      </div>
      {t.why.length > 0 && <details className="params why-drawer"><summary>Vì sao mình nói điều này?</summary><ul className="why">{t.why.map((w, k) => <li key={k}>{w}</li>)}</ul></details>}
    </article>
  );
}

export function ExploreHub({ prepared }: { prepared: Prepared }) {
  const [open, setOpen] = useState<string | null>(null);
  const groups = prepared.reading.explore;
  const all = groups.flatMap((g) => g.topics);
  const go = (id: string | null) => { setOpen(id); setTimeout(() => document.querySelector(".rpage")?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }), 30); };
  if (open === "compat") return <><button type="button" className="btn ghost back" onClick={() => go(null)}>← Tất cả chủ đề</button><CompatPage prepared={prepared} /></>;
  const t = all.find((x) => x.id === open);
  if (t) return <TopicView t={t} onBack={() => go(null)} />;
  return (
    <>
      <p className="eyebrow reveal">Câu hỏi của bạn</p>
      <h2 className="reveal">Khám phá thêm</h2>
      <p className="lead reveal">Những câu hỏi cụ thể về bản thân và cuộc sống, được trả lời từ nhiều phần của lá số cùng lúc. Chọn một chủ đề để mở.</p>
      {groups.map((g, gi) => (
        <section key={g.id} className={`x-group g-${g.id} reveal`}>
          <header><h3>{g.title}</h3><p className="faint">{g.intro}</p></header>
          <div className="x-cards">
            {gi === 0 && (
              <button type="button" className="x-card" onClick={() => go("compat")}>
                <span className="x-ico" aria-hidden="true">{ICON.compat}</span><b>Độ hòa hợp của hai lá số</b><small>Nhập thông tin người thứ hai để so sánh</small>
              </button>
            )}
            {g.topics.map((x) => (
              <button key={x.id} type="button" className="x-card" onClick={() => go(x.id)}>
                <span className="x-ico" aria-hidden="true">{ICON[x.id]}</span><b>{x.title}</b><small>{x.ask}</small>
              </button>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export function CompatPage({ prepared }: { prepared: Prepared }) {
  const [other, setOther] = useState<Prepared | null>(null);
  const [err, setErr] = useState("");
  const nameA = prepared.values.name?.trim() || "Bạn";
  const c = useMemo(() => (other ? readCompat(prepared.natal, other.natal, nameA, other.values.name?.trim() || "Người kia", { noTimeA: prepared.noTime, noTimeB: other.noTime }) : null), [other, prepared, nameA]);
  return (
    <>
      <p className="eyebrow reveal">Khám phá thêm</p>
      <h2 className="reveal">Độ hòa hợp của hai lá số</h2>
      <p className="lead reveal">Nhập ngày, giờ và nơi sinh của một người nữa để xem hai lá số hòa hợp đến đâu về cảm xúc, tính khí và sự đồng hành. Dữ liệu chỉ xử lý trên máy bạn.</p>
      {!c && (
        <div className="card block reveal compat-form">
          <Intake onSubmit={(v) => { try { setOther(prepare(v)); setErr(""); } catch (e) { setErr(String((e as Error).message)); } }} />
          {err && <p className="errors">{err}</p>}
        </div>
      )}
      {c && other && (
        <>
          <div className="card block prose reveal"><h3>{c.total}/36 · {c.band}</h3><Paras list={c.summary} /></div>
          <h3 className="sub-h reveal">Tám khía cạnh</h3>
          <ul className="koota reveal">
            {c.kootas.map((k) => <li key={k.name}><b>{k.name}</b><span className="kscore">{k.got}/{k.max}</span><small>{k.note}</small><i style={{ width: `${(k.got / k.max) * 100}%` }} /></li>)}
          </ul>
          {c.points.map((p) => <div key={p.title} className="card block prose reveal"><h4>{p.title}</h4><p><Gloss text={p.text} /></p></div>)}
          <details className="params reveal why-drawer"><summary>Vì sao mình nói điều này?</summary><ul className="why">{c.why.map((w, i) => <li key={i}>{w}</li>)}</ul></details>
          <button type="button" className="btn" onClick={() => setOther(null)}>So sánh với người khác</button>
        </>
      )}
    </>
  );
}

// ------------------------------------------------------------------ 2027
export function ForecastPage({ prepared }: { prepared: Prepared }) {
  const F = prepared.reading.forecast;
  const [sel, setSel] = useState(() => { const d = new Date(); return d.getFullYear() === F.year ? d.getMonth() : 0; });
  const m = F.months[sel];
  const KIND: Record<string, string> = { ingress: "Đổi cung", retro: "Đi lùi", direct: "Đi thẳng", hit: "Chạm điểm gốc", eclipse: "Thực", dasha: "Vận", moon8: "Mặt Trăng" };
  return (
    <>
      <p className="eyebrow reveal">Năm tới</p>
      <h2 className="reveal">Dự báo năm {F.year}</h2>
      <div className="intro-card reveal"><Paras list={F.intro} /></div>
      <div className="month-tabs reveal" role="tablist" aria-label="Chọn tháng">
        {F.months.map((x, i) => (
          <button key={x.month} type="button" role="tab" aria-selected={i === sel} className={`mt tone-${x.tone} ${i === sel ? "on" : ""}`} onClick={() => setSel(i)}>
            <b>{x.month}</b><small>{x.headline}</small>
          </button>
        ))}
      </div>
      <article key={m.month} className="fc-month-view swap-in" role="tabpanel" aria-label={m.label}>
        <header className="fc-head"><p className="eyebrow">{m.label} / {F.year}</p><h3>{m.headline}</h3></header>
        <p className="central"><Gloss text={m.central} /></p>
        {m.areas.length > 0 && (
          <div className="fc-areas">
            {m.areas.map((a) => (
              <section key={a.house} className={`card area tone-${a.tone}`}>
                <h4>{a.title}</h4>
                {a.planets && <p className="keyline">{a.planets}</p>}
                <p><Gloss text={a.text} /></p>
              </section>
            ))}
          </div>
        )}
        {m.events.length > 0 && (
          <section className="fc-dates">
            <h4>Các mốc trong tháng</h4>
            <ol>{m.events.map((e) => <li key={e.ms + e.title}><time>{e.date.slice(0, 5)}</time><span className={`kind k-${e.kind}`}>{KIND[e.kind]}</span><div><b>{e.title}</b><small>{e.text}</small></div></li>)}</ol>
          </section>
        )}
        {m.change.length > 0 && (
          <section className="fc-change"><h4>Điều thay đổi so với tháng trước</h4><ul>{m.change.map((c, i) => <li key={i}>{c}</li>)}</ul></section>
        )}
        <details className="params why-drawer"><summary>Vì sao mình nói điều này?</summary><ul className="why">{m.why.map((w, i) => <li key={i}>{w}</li>)}</ul></details>
        <div className="fc-nav">
          <button type="button" className="btn ghost" disabled={sel === 0} onClick={() => setSel(sel - 1)}>← {sel > 0 ? F.months[sel - 1].label : ""}</button>
          <button type="button" className="btn ghost" disabled={sel === 11} onClick={() => setSel(sel + 1)}>{sel < 11 ? F.months[sel + 1].label : ""} →</button>
        </div>
      </article>
      <details className="params reveal">
        <summary>Phương pháp tính và các mốc lớn cả năm</summary>
        <ul className="why">{F.method.map((x, i) => <li key={i}>{x}</li>)}</ul>
        <ul className="fc-key">{F.key.map((e) => <li key={e.ms + e.title}><b>{e.date}</b> · {e.title}</li>)}</ul>
      </details>
      {F.trustNote && <aside className="callout check reveal"><p>{F.trustNote}</p></aside>}
    </>
  );
}
