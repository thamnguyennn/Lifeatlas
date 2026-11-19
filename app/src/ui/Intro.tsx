import { Component, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createFilm, FILM_END, type FilmLayout } from "./intro-film.ts";
import { prefersReducedMotion } from "./hooks.ts";

// The opening film, shown before the birth form on a first visit. It can be skipped at any moment, replayed from the footer,
// and it never touches the chart engine or the reading. Seen-state lives in localStorage; if the browser clears it, the film comes back.

export const INTRO_KEY = "lifeatlas.intro.seen";
export function introSeen() { try { return localStorage.getItem(INTRO_KEY) === "1"; } catch { return false; } }
function markSeen() { try { localStorage.setItem(INTRO_KEY, "1"); } catch { /* storage can be blocked; the film may simply show again */ } }

export type IntroExit = "skip" | "start" | "error";

const CUES = [
  { a: 1.2, b: 3.9, text: "Hàng nghìn năm trước, khi con người ngước nhìn bầu trời đêm…" },
  { a: 4.1, b: 6.6, text: "…họ đã bắt đầu đặt những câu hỏi về các vì sao." },
  { a: 7.6, b: 11.2, text: "Trên vùng đất Ấn Độ cổ, những quan sát ấy dần trở thành một truyền thống tri thức…" },
  { a: 11.4, b: 14.6, text: "…được gìn giữ và tiếp nối qua nhiều thế hệ." },
  { a: 15.6, b: 19.2, text: "Trong Jyotish, mỗi chuyển động trên bầu trời trở thành một phần của ngôn ngữ biểu tượng…" },
  { a: 19.5, b: 22.6, text: "…một cách để con người suy ngẫm về cuộc sống." },
  { a: 23.4, b: 27.5, text: "Và từ khoảnh khắc một người chào đời, Jyotish dựng nên một tấm bản đồ bầu trời riêng." },
  { a: 27.8, b: 30.8, text: "Mình muốn bạn xem tấm bản đồ ấy như một món quà của vũ trụ…" },
  { a: 31.7, b: 34.6, text: "Để đôi khi, giữa những ngày vội vã…" },
  { a: 34.9, b: 38.6, text: "…bạn có thể dừng lại, nhìn về chính mình bằng một góc nhìn khác." },
];
const END = { title: 41.0, sub: 41.9, l1: 42.8, cta: FILM_END };

// The film is drawn on a 44-second clock, but the quiet gaps between the spoken lines play faster,
// so it lasts about 40 seconds while every caption keeps its full reading time.
const FAST: [number, number, number][] = [[0, 1.2, 1.6], [6.6, 7.6, 2], [14.6, 15.6, 2], [22.6, 23.4, 2], [30.8, 31.7, 2], [38.6, 46, 1.6]];
function filmTime(real: number) {
  let t = 0, r = real;
  for (const [a, b, s] of FAST) {
    if (t + r <= a) return t + r;
    r -= a - t; t = a;
    const span = (b - a) / s;
    if (r <= span) return a + r * s;
    r -= span; t = b;
  }
  return t + r;
}
function realTime(film: number) {
  let real = 0, t = 0;
  for (const [a, b, s] of FAST) {
    if (film <= a) return real + film - t;
    real += a - t; t = a;
    if (film <= b) return real + (film - a) / s;
    real += (b - a) / s; t = b;
  }
  return real + film - t;
}

function quality() {
  const n = navigator as Navigator & { deviceMemory?: number };
  const cores = n.hardwareConcurrency ?? 4, mem = n.deviceMemory ?? 4;
  const small = Math.min(window.innerWidth, window.innerHeight) < 500;
  return cores <= 4 || mem <= 3 ? 0.55 : small ? 0.75 : 1;
}

function Caption({ text, out }: { text: string; out: boolean }) {
  const words = text.split(" ");
  return (
    <p className={`intro-cap${out ? " out" : ""}`}>
      {words.map((wd, i) => <span key={i} className="w" style={{ ["--i" as string]: `${i * 0.11}s` } as CSSProperties}>{wd}{i < words.length - 1 ? " " : ""}</span>)}
    </p>
  );
}


function Film({ onExit, onClosing }: { onExit: (k: IntroExit) => void; onClosing: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const gateRef = useRef(false);
  const clock = useRef(0);
  const [phase, setPhase] = useState({ cue: -1, out: false, end: 0 });
  const [lay, setLay] = useState<FilmLayout>({ ringX: 0, ringY: 0, ringR: 0, short: false });
  const [caps, setCaps] = useState(true);
  const [closing, setClosing] = useState(false);
  const reduced = useRef(prefersReducedMotion()).current;
  const exited = useRef(false);

  const leave = useCallback((k: IntroExit) => {
    if (exited.current) return;
    exited.current = true;
    markSeen();
    setClosing(true); onClosing();
    window.setTimeout(() => onExit(k), k === "error" ? 0 : 1100);
  }, [onExit, onClosing]);

  useEffect(() => {
    skipRef.current?.focus({ preventScroll: true });
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") leave("skip"); };
    window.addEventListener("keydown", onKey);
    return () => { document.documentElement.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [leave]);

  useEffect(() => {
    const cv = canvasRef.current!;
    let film: ReturnType<typeof createFilm>;
    try { film = createFilm(cv, quality()); } catch { leave("error"); return; }
    const size = () => setLay(film.resize(cv.clientWidth || window.innerWidth, cv.clientHeight || window.innerHeight));
    size();
    if (reduced) {
      // a still, readable version: the last frame, with all the words shown at once
      try { film.frame(FILM_END + 0.6); } catch { leave("error"); }
      const onR = () => { size(); try { film.frame(FILM_END + 0.6); } catch { /* ignore */ } };
      window.addEventListener("resize", onR);
      return () => window.removeEventListener("resize", onR);
    }
    let raf = 0, last = performance.now(), key = "";
    // used by the browser checks to jump to a moment of the film
    (window as unknown as { __introSeek?: (t: number) => void }).__introSeek = (t: number) => { clock.current = realTime(t); };
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (!document.hidden && !gateRef.current) clock.current += dt;
      const t = filmTime(clock.current);
      try { film.frame(t); } catch { leave("error"); return; }
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, t / FILM_END)})`;
      let cue = -1, out = false;
      for (let i = 0; i < CUES.length; i++) if (t >= CUES[i].a && t < CUES[i].b + 0.6) { cue = i; out = t >= CUES[i].b; }
      const end = t >= END.cta ? 5 : t >= END.l1 ? 3 : t >= END.sub ? 2 : t >= END.title ? 1 : 0;
      const k = `${cue}|${out}|${end}`;
      if (k !== key) { key = k; setPhase({ cue, out, end }); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onVis = () => { if (!document.hidden) last = performance.now(); };
    window.addEventListener("resize", size);
    document.addEventListener("visibilitychange", onVis);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", size); document.removeEventListener("visibilitychange", onVis); };
  }, [reduced, leave]);

  const style = { ["--ringX" as string]: `${lay.ringX}px`, ["--ringY" as string]: `${lay.ringY}px`, ["--ringR" as string]: `${lay.ringR}px` } as CSSProperties;
  const end = reduced ? 5 : phase.end;

  return (
    <div className={`intro${closing ? " closing" : ""}${reduced ? " still" : ""}${lay.short ? " short" : ""}`} role="dialog" aria-modal="true" aria-label="Đoạn mở đầu của Life Atlas" style={style}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="intro-bar">
        {!reduced && (
          <button type="button" className="intro-btn" onClick={() => setCaps(!caps)} aria-pressed={caps} aria-label={caps ? "Tắt phụ đề" : "Bật phụ đề"}>
            <span className="cc" aria-hidden="true">CC</span><span className="lbl">{caps ? "Phụ đề: bật" : "Phụ đề: tắt"}</span>
          </button>
        )}
        <button type="button" ref={skipRef} className="intro-btn intro-skip" onClick={() => leave("skip")} aria-label="Bỏ qua đoạn mở đầu">
          Bỏ qua <span aria-hidden="true">→</span>
        </button>
      </div>

      {reduced && (
        <div className="intro-poem">
          {[0, 2, 4, 6, 8].map((i) => <p key={i}>{CUES[i].text} {CUES[i + 1].text.replace(/^…/, "")}</p>)}
        </div>
      )}
      {!reduced && caps && phase.cue >= 0 && <div className="intro-caps" aria-live="polite"><Caption key={phase.cue} text={CUES[phase.cue].text} out={phase.out} /></div>}

      <div className="intro-end" aria-hidden={end === 0}>
        <div className="ie-title">
          <h1 className={`ie-in${end >= 1 ? " on" : ""}`}>LIFE ATLAS</h1>
          <p className={`ie-sub ie-in${end >= 2 ? " on" : ""}`}>Bản đồ cuộc đời</p>
        </div>
        <div className="ie-lower">
          <p className={`ie-in${end >= 3 ? " on" : ""}`}>Để mình kể cho bạn nghe câu chuyện về chính bạn…</p>
          <button type="button" className={`ie-cta ie-in${end >= 5 ? " on" : ""}`} tabIndex={end >= 5 ? 0 : -1} onClick={() => leave("start")}>
            Bắt đầu câu chuyện của mình
          </button>
        </div>
      </div>
      {!reduced && <div className="intro-progress" ref={barRef} aria-hidden="true" />}
    </div>
  );
}

class Guard extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFail(); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** If anything in the film fails, the site opens straight away. */
export function Intro({ onExit, onClosing }: { onExit: (k: IntroExit) => void; onClosing: () => void }) {
  return <Guard onFail={() => { markSeen(); onExit("error"); }}><Film onExit={onExit} onClosing={onClosing} /></Guard>;
}
