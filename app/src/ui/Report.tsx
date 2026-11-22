import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { flushSync } from "react-dom";
import type { Prepared } from "./logic.ts";
import { fmtClock } from "./logic.ts";
import { CANH_GIO } from "../engine/places.ts";
import { SIGNS } from "../engine/constants.ts";
import { composeDay, type DayReading } from "../reading/compose.ts";
import { SignGlyph } from "./Glyph.tsx";
import { HousePage } from "./Houses.tsx";
import {
  AxisPage, HouseMapPage, VargaPage,
} from "./PagesA.tsx";
import { OverviewPage } from "./PagesOverview.tsx";
import { ChaptersPage, NowPage, ForecastPage, ExploreHub } from "./PagesTime.tsx";
import { buildParts, flatPages, type PageDef } from "./pages.ts";
import { birthSubtitle } from "./format.ts";
import { readingToText } from "./export-text.ts";
import { useReveal } from "./hooks.ts";

const hashPage = () => { try { return decodeURIComponent(location.hash.slice(1)); } catch { return ""; } };

// Printing is blocked inside an embedding frame, so the print button only shows on a standalone page.
const FRAMED = (() => { try { return window.self !== window.top; } catch { return true; } })();

export function Report({ prepared, onEdit, onChoose, now }: {
  prepared: Prepared; onEdit: () => void; onChoose: (midMin: number) => void; now: number;
}) {
  const { reading: r, values, noTime } = prepared;
  const parts = useMemo(() => buildParts(prepared), [prepared]);
  const pages = useMemo(() => flatPages(parts), [parts]);
  const known = (id: string) => pages.some((p) => p.id === id);

  // Coming back from the Method page, the browser entry remembers which page we were on.
  const [pageId, setPageId] = useState(() => {
    const id = hashPage();
    let remembered = false;
    try { remembered = (history.state as { atlasPage?: string } | null)?.atlasPage === id; } catch { /* no history access */ }
    return remembered && known(id) ? id : pages[0].id;
  });
  const cur = known(pageId) ? pageId : pages[0].id;
  const idx = pages.findIndex((p) => p.id === cur);
  const part = parts.find((p) => p.pages.some((pg) => pg.id === cur)) ?? parts[0];
  const topRef = useRef<HTMLDivElement>(null);
  const partNavRef = useRef<HTMLUListElement>(null);
  const pageNavRef = useRef<HTMLUListElement>(null);
  const pageRef = useRef<HTMLElement>(null);

  const [yogaFocus, setYogaFocus] = useState<string | null>(null);
  // The report shows one page at a time. While the browser prints, every page is put on the sheet, one part after another.
  const [printAll, setPrintAll] = useState(false);
  useEffect(() => {
    const before = () => flushSync(() => setPrintAll(true));
    const after = () => setPrintAll(false);
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => { window.removeEventListener("beforeprint", before); window.removeEventListener("afterprint", after); };
  }, []);
  const [dayMs, setDayMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);
  const exportText = useMemo(() => readingToText(prepared), [prepared]);

  const day: DayReading = useMemo(
    () => (dayMs === null ? { ladder: r.ladder, sky: r.sky } : composeDay(prepared.ctx, dayMs)),
    [dayMs, r, prepared.ctx],
  );


  useReveal(`${cur}|${dayMs}`);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setManualCopy(true); // the frame refused clipboard access: show the text so it can be copied by hand
    }
  };

  const toTop = () => requestAnimationFrame(() => {
    topRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
    pageRef.current?.focus({ preventScroll: true });
  });
  const go = (id: string, o: { push?: boolean; scroll?: boolean } = {}) => {
    const { push = true, scroll = true } = o;
    setPageId(id);
    if (push) { try { history.pushState({ atlasPage: id }, "", `#${id}`); } catch { /* history can be blocked in a frame; paging still works */ } }
    if (scroll) toTop();
  };

  useEffect(() => {
    try { history.scrollRestoration = "manual"; } catch { /* optional nicety */ }
    const onPop = () => {
      const id = hashPage();
      if (known(id)) go(id, { push: false });
      else if (id === "" || id === "form" || id === "open") go(pages[0].id, { push: false });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [pages]);

  // keep the current pill visible in each strip (they scroll sideways on narrow screens)
  useEffect(() => {
    for (const ul of [partNavRef.current, pageNavRef.current]) {
      const el = ul?.querySelector<HTMLElement>("a.on");
      if (ul && el) ul.scrollTo({ left: el.offsetLeft - ul.clientWidth / 2 + el.clientWidth / 2, behavior: "auto" });
    }
  }, [cur]);

  const edit = () => {
    try { history.replaceState(null, "", location.pathname + location.search); } catch { /* ignore */ }
    onEdit();
  };
  const pickHouse = (n: number) => go(`h-${n}`);
  const pickYoga = (id: string) => {
    setYogaFocus(id);
    go("yogas", { scroll: false });
    setTimeout(() => document.getElementById(`yoga-${id}`)?.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }), 90);
  };

  const canh = values.timeKind === "canh" ? CANH_GIO.find((c) => c.id === values.canhId) : null;
  const checkNotes = prepared.time.notes.filter((n) => n.level === "check");

  const renderPage = (id: string): ReactElement | null => {
    const houseNo = /^h-(\d+)$/.exec(id);
    const varga = /^v-(\d+)$/.exec(id);
    if (id === "ov") return <OverviewPage prepared={prepared} />;
    if (id === "h-map") return <HouseMapPage prepared={prepared} selected={null} onPick={pickHouse} />;
    if (houseNo && r.houses[+houseNo[1] - 1]) return <HousePage h={r.houses[+houseNo[1] - 1]} onYoga={pickYoga} printing={printAll} />;
    if (id === "axis") return <AxisPage prepared={prepared} />;
    if (varga) return <VargaPage prepared={prepared} n={+varga[1] as 2 | 9 | 10} />;
    if (id === "t-chapters") return <ChaptersPage prepared={prepared} now={now} />;
    if (id === "t-now") return <NowPage prepared={prepared} day={day} dayMs={dayMs} onDay={setDayMs} />;
    if (id === "x-hub") return <ExploreHub prepared={prepared} />;
    if (id === "y2027") return <ForecastPage prepared={prepared} />;
    return null;
  };
  const body = renderPage(cur);

  return (
    <main id="main" className="report">
      <header className="rhead">
        <div>
          <p className="eyebrow">Lá số Jyotish</p>
          <h1>{values.name ? <>Lá số của <span className="shimmer">{values.name}</span></> : <span className="shimmer">Lá số của bạn</span>}</h1>
          <p className="rsub">{birthSubtitle(prepared)}</p>
        </div>
        <div className="rhead-actions">
          <button className="btn ghost" type="button" onClick={edit}>← Sửa thông tin</button>
          <button className="btn ghost" type="button" onClick={copy}>{copied ? "Đã sao chép ✓" : "Sao chép bài đọc"}</button>
          {!FRAMED && <button className="btn ghost" type="button" onClick={() => window.print()}>In / lưu PDF</button>}
        </div>
      </header>

      {checkNotes.length > 0 && (
        <aside className="callout check reveal"><strong>Về giờ sinh của bạn</strong>{checkNotes.map((n, i) => <p key={i}>{n.text}</p>)}
          <p>Nếu bạn biết chắc múi giờ đúng, hãy quay lại “Sửa thông tin” và chọn múi giờ thủ công.</p></aside>
      )}
      {prepared.choices.length > 1 && (
        <aside className="callout check reveal">
          <strong>Trong {canh?.name.toLowerCase()}, cung mọc đổi từ {SIGNS[prepared.choices[0].sign]} sang {SIGNS[prepared.choices[prepared.choices.length - 1].sign]}</strong>
          <p>Vì chỉ biết canh giờ, mình chưa biết bạn thuộc đoạn nào. Hãy chọn đoạn gần với giờ bạn nhớ nhất; toàn bộ bài đọc sẽ thay đổi theo.</p>
          <div className="choices">
            {prepared.choices.map((c) => (
              <button key={c.fromMin} type="button" className={`choice ${prepared.chosenMin >= c.fromMin && prepared.chosenMin <= c.toMin ? "on" : ""}`} onClick={() => onChoose(c.midMin)}>
                <SignGlyph sign={c.sign} size={16} /> Cung mọc {SIGNS[c.sign]}<small>{fmtClock(c.fromMin)}–{fmtClock(c.toMin)}</small>
              </button>
            ))}
          </div>
        </aside>
      )}
      {!noTime && prepared.choices.length <= 1 && prepared.reading.meta.lagnaShift.length > 1 && (
        <aside className="callout check reveal">
          <strong>Trong sai số ±{prepared.reading.meta.windowMin} phút, cung mọc có thể là {prepared.reading.meta.lagnaShift.join(" hoặc ")}.</strong>
        </aside>
      )}
      {noTime && (
        <aside className="callout check reveal">
          <strong>Chưa có giờ sinh nên chưa dựng được cung mọc và 12 nhà</strong>
          <p>Dưới đây là phần không phụ thuộc nhiều vào giờ: Mặt Trăng, vị trí các hành tinh, bài học kiếp này và các giai đoạn đời.
            Mặt Trăng đi khoảng 13 độ mỗi ngày, nên trong ngày sinh của bạn nó nằm ở chòm sao <b>{prepared.moonSpan?.from}</b>
            {prepared.moonSpan && prepared.moonSpan.from !== prepared.moonSpan.to ? <> rồi sang chòm sao <b>{prepared.moonSpan.to}</b>. Vì hai chòm sao này khác nhau, các giai đoạn đời chỉ là một trong hai khả năng (mình lấy giữa trưa).</> : <>. Cả ngày chỉ ở một chòm sao nên các giai đoạn đời lớn khá chắc chắn.</>}
            {prepared.moonSpan && prepared.moonSpan.signFrom !== prepared.moonSpan.signTo && <> Mặt Trăng cũng đổi cung trong ngày ({prepared.moonSpan.signFrom} sang {prepared.moonSpan.signTo}), nên cung Mặt Trăng chưa chắc.</>}
          </p>
        </aside>
      )}

      <div className="rnav" role="navigation" aria-label="Các phần của bài đọc">
        <ul ref={partNavRef} className="parts">
          {parts.map((p, i) => (
            <li key={p.id}><a href={`#${p.pages[0].id}`} className={part.id === p.id ? "on" : ""} aria-current={part.id === p.id ? "true" : undefined}
              onClick={(e) => { e.preventDefault(); go(part.id === p.id ? cur : p.pages[0].id); }}><span className="n" aria-hidden="true">{i + 1}</span>{p.label}</a></li>
          ))}
        </ul>
        {part.pages.length > 1 && (
          <ul ref={pageNavRef} className="subpages" aria-label={`Các trang của phần ${part.label}`}>
            {part.pages.map((p) => (
              <li key={p.id}><a href={`#${p.id}`} className={cur === p.id ? "on" : ""} aria-current={cur === p.id ? "page" : undefined} title={p.label} aria-label={p.label}
                onClick={(e) => { e.preventDefault(); go(p.id); }}>{p.nav}</a></li>
            ))}
          </ul>
        )}
        <div className="rprog" role="progressbar" aria-label="Tiến độ đọc" aria-valuemin={1} aria-valuemax={pages.length} aria-valuenow={idx + 1} aria-valuetext={`Trang ${idx + 1} trong ${pages.length}`}>
          <i style={{ width: `${((idx + 1) / pages.length) * 100}%` }} />
        </div>
      </div>
      <div ref={topRef} className="page-top" />

      {printAll
        ? pages.map((pg, i) => (
          <section key={pg.id} className={`sec rpage current page-${pg.part}${i === 0 || pages[i - 1].part !== pg.part ? " part-start" : ""}`} aria-label={pg.label} data-page={pg.id}>
            {renderPage(pg.id)}
          </section>
        ))
        : (
          <section key={cur} ref={pageRef} tabIndex={-1} className={`sec rpage current page-${part.id}`} aria-label={pages[idx]?.label} data-page={cur}>
            {body}
            <Pager pages={pages} idx={idx} go={go} />
          </section>
        )}

      <footer className="rfoot">
        <p>Bài đọc mang tính tham khảo và tự suy ngẫm. Nó không thay thế lời khuyên y tế, pháp lý hay tài chính, và không dự đoán sự kiện cụ thể.
          Muốn biết cách tính và độ chắc chắn của từng phần, xem trang <a href="#phuong-phap">Phương pháp</a>.</p>
      </footer>
      {manualCopy && <CopyDialog text={exportText} onClose={() => setManualCopy(false)} />}
    </main>
  );
}

function nextText(cur: PageDef, next: PageDef): string {
  if (cur.id === "h-map") return "Đọc nhà 1";
  if (/^h-\d+$/.test(cur.id) && /^h-\d+$/.test(next.id)) return "Nhà tiếp theo";
  return "Tiếp theo";
}

function Pager({ pages, idx, go }: { pages: PageDef[]; idx: number; go: (id: string) => void }) {
  const cur = pages[idx], prev = pages[idx - 1], next = pages[idx + 1];
  const newPart = next && next.part !== cur.part;
  return (
    <nav className="pager" aria-label="Chuyển trang">
      {prev
        ? <button type="button" className="btn ghost pg-prev" aria-label={`Trang trước: ${prev.label}`} onClick={() => go(prev.id)}><span aria-hidden="true">←</span> <span className="pg-long">{/^h-\d+$/.test(cur.id) && /^h-\d+$/.test(prev.id) ? "Nhà trước" : "Trước"}</span><span className="pg-short">Trước</span></button>
        : <span />}
      <span className="pg-count" aria-hidden="true">{idx + 1} / {pages.length}</span>
      {next
        ? <button type="button" className={`btn primary pg-next${newPart ? " newpart" : ""}`} onClick={() => go(next.id)}>{nextText(cur, next)}<small>{next.label}</small><span aria-hidden="true">→</span></button>
        : <button type="button" className="btn ghost pg-next" onClick={() => go(pages[0].id)}>Về lời mở đầu <span aria-hidden="true">↑</span></button>}
    </nav>
  );
}

function CopyDialog({ text, onClose }: { text: string; onClose: () => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal card" role="dialog" aria-modal="true" aria-labelledby="copy-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="copy-title">Sao chép bài đọc</h2>
        <p className="faint">Trình duyệt không cho tự động sao chép ở đây. Toàn bộ chữ đã được chọn sẵn: nhấn Ctrl+C (hoặc Cmd+C trên máy Mac), rồi dán vào ghi chú hoặc tài liệu của bạn.</p>
        <textarea id="copy-text" ref={ref} readOnly value={text} aria-label="Toàn bộ bài đọc dạng chữ" />
        <button type="button" className="btn primary" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}
