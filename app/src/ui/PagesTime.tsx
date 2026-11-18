// The pages about time: the chapters of life (dasha, five levels), where you stand in them today, the sky today, and the day's message.
import { useMemo, useRef, useState } from "react";
import type { Prepared } from "./logic.ts";
import type { MahaRow, PeriodRead, TodayReading, Trust } from "../reading/types.ts";
import type { DayReading } from "../reading/compose.ts";
import { readChildren, readTrend } from "../reading/compose.ts";
import type { Ctx } from "../reading/compose.ts";
import { LEVEL_NAME } from "../engine/dasha5.ts";
import { YEAR_MS } from "../engine/core.ts";
import { Gloss } from "./Gloss.tsx";
import { Glyph, SignGlyph } from "./Glyph.tsx";
import { signIndex } from "../engine/constants.ts";
import { TONE_TEXT } from "./format.ts";
import { Emblem } from "./Emblem.tsx";

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

function MahaCard({ ctx, m, open, onToggle, setRef }: { ctx: Ctx; m: MahaRow; open: boolean; onToggle: () => void; setRef: (el: HTMLElement | null) => void }) {
  const stateText = m.state === "now" ? "Đang diễn ra" : m.state === "past" ? "Đã qua" : "Sắp tới";
  return (
    <article ref={setRef} className={`dcard card tone-${m.tone} ${m.state} ${open ? "open" : ""}`}>
      <button type="button" className="dhead" aria-expanded={open} onClick={onToggle}>
        <Emblem id={m.lord} size={40} title="" className="dg" />
        <span className="dt"><strong>Đại vận {m.name}</strong><small>{m.from} – {m.to} · <span className="nw">tuổi {m.ageFrom}–{m.ageTo}</span></small></span>
        {m.litHouses && m.litHouses.length > 0 && (
          <span className="chip lit-houses">Nhà {m.litHouses.join(", ")}</span>
        )}
        <span className={`chip state-${m.state}`}>{stateText}</span>
        <span className={`chip tone-${m.tone}`}>{TONE_TEXT[m.tone]}</span>
        <TrustChip t={m.read.trust} />
        <span className="chev" aria-hidden="true" />
      </button>
      {open && (
        <div className="dbody">
          <p className="chapter-title">{m.read.title}</p>
          <Paras list={m.read.paragraphs} />
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
  const refs = useRef<(HTMLElement | null)[]>([]);
  const pct = (a: number) => `${Math.max(0, Math.min(100, (a / cap) * 100))}%`;
  const go = (i: number) => { setOpen(i); setTimeout(() => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" }), 60); };
  return (
    <>
      <p className="eyebrow reveal">Đại vận và tiểu vận</p>
      <h2 className="reveal">Các giai đoạn đời của bạn</h2>
      <p className="faint reveal"><Gloss text={t.intro} /></p>
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
      {!noTime && t.houseWindows && t.houseWindows.length > 0 && (
        <section className="card prose house-windows reveal">
          <h3>Khi nào từng khía cạnh được đánh thức trong 20 năm tới</h3>
          <p className="faint">Toàn bộ dòng thời gian kích hoạt 12 nhà được gom về đây để bạn nhìn trọn vẹn sự chuyển giao giữa các mảng đời mà không bị lặp lại ở từng trang nhà.</p>
          <div className="hw-grid">
            {t.houseWindows.map((hw) => (
              <div key={hw.n} className="hw-item">
                <h4>Nhà {hw.n} · {hw.tag} <small>({hw.lordName})</small></h4>
                <p><Gloss text={hw.windows.length ? hw.windows.join(" · ") : "Chạy nền ổn định qua các đại vận hiện tại."} /></p>
              </div>
            ))}
          </div>
        </section>
      )}
      <details className="params reveal">
        <summary>Xem cách tính các giai đoạn</summary>
        <p className="birthline">{t.birth}</p>
        <aside className={`callout check trust-note lv${t.reliability.stableLevels}`}><p>{t.reliability.note}</p></aside>
      </details>
    </>
  );
}

// ------------------------------------------------------------------ where you stand today
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
              <Paras list={p.paragraphs} />
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
    </>
  );
}

// ------------------------------------------------------------------ the sky today
export function SkyPage({ prepared, day, dayMs, onDay }: { prepared: Prepared; day: DayReading; dayMs: number | null; onDay: (ms: number | null) => void }) {
  const S = day.sky;
  return (
    <>
      <p className="eyebrow reveal">Đại vận và tiểu vận</p>
      <h2 className="reveal">Bầu trời hiện tại</h2>
      <DayPicker prepared={prepared} dayMs={dayMs} onChange={onDay} />
      <p className="faint reveal">Ngày {S.dateLabel}. <Gloss text={S.intro} /></p>

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

      <section className="card block reveal">
        <h3>{S.day.title}</h3>
        <Paras list={S.day.paragraphs} />
        <details className="params mini">
          <summary>Xem Chandra Bala và Tara Bala</summary>
          <ul className="chips">
            <li>Chandra Bala: {S.day.chandra ? "thuận" : "nên làm chậm lại"}</li>
            <li>Tara Bala: {S.day.tara.kind}</li>
          </ul>
        </details>
      </section>

      {S.hits.length > 0 && (
        <>
          <h3 className="sub-h reveal">Nơi bầu trời chạm vào lá số lúc bạn sinh</h3>
          <div className="hits">
            {S.hits.map((h) => <article key={h.title} className="card hit reveal"><h4>{h.title}</h4><p><Gloss text={h.text} /></p></article>)}
          </div>
        </>
      )}

      <details className="params reveal why-drawer">
        <summary>Vì sao mình nói điều này?</summary>
        <ul className="why">{S.why.map((w, i) => <li key={i}>{w}</li>)}</ul>
      </details>
    </>
  );
}

// ------------------------------------------------------------------ the message of the month
const ym = (ms: number) => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; };
/** The month asked for is read at its middle, except this month, which is read from today. */
export const monthToMs = (y: number, m: number, now: number) => {
  const nd = new Date(now);
  return nd.getFullYear() === y && nd.getMonth() === m - 1 ? now : new Date(y, m - 1, 15, 12).getTime();
};

export function MonthPicker({ prepared, monthMs, onChange }: { prepared: Prepared; monthMs: number | null; onChange: (ms: number | null) => void }) {
  const first = prepared.natal.utcMs + 86_400_000;
  const last = prepared.natal.utcMs + 110 * YEAR_MS;
  const now = prepared.ctx.now;
  const cur = monthMs ?? now;
  const set = (y: number, m: number) => { const ms = monthToMs(y, m, now); if (ms >= first && ms <= last) onChange(ms); };
  const shift = (k: number) => { const d = new Date(cur); set(d.getFullYear(), d.getMonth() + 1 + k); };
  return (
    <div className="daypick reveal">
      <label>
        <span>Xem tháng</span>
        <input type="month" value={ym(cur)} min={ym(first)} max={ym(last)}
          onChange={(e) => { const m = /^(\d{4})-(\d{2})$/.exec(e.target.value); if (m) set(+m[1], +m[2]); }} />
      </label>
      <button type="button" className="btn ghost" onClick={() => shift(-1)} aria-label="Tháng trước">←</button>
      <button type="button" className="btn ghost" onClick={() => shift(1)} aria-label="Tháng sau">→</button>
      {monthMs !== null && <button type="button" className="linkbtn" onClick={() => onChange(null)}>Về tháng này</button>}
    </div>
  );
}

export function TodayPage({ prepared, today, monthMs, onMonth }: { prepared: Prepared; today: TodayReading; monthMs: number | null; onMonth: (ms: number | null) => void }) {
  const T = today;
  return (
    <>
      <p className="eyebrow reveal">Lời nhắn tháng này</p>
      <MonthPicker prepared={prepared} monthMs={monthMs} onChange={onMonth} />
      <article className="today card glow reveal">
        <p className="today-date">{monthMs === null ? "Tháng này" : "Tháng"} {T.monthLabel}</p>
        <h2>{T.title}</h2>
        {T.paragraphs.map((p, i) => <p key={i} className="today-msg"><Gloss text={p} /></p>)}
        <p className="p-ask"><span>Một câu hỏi để mang theo</span>{T.ask}</p>
      </article>
      <details className="params reveal why-drawer">
        <summary>Vì sao mình nói điều này?</summary>
        <ul className="why">{T.why.map((w, i) => <li key={i}>{w}</li>)}</ul>
        <p className="faint small">{T.trustNote}</p>
      </details>
    </>
  );
}
