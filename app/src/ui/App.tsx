import { useCallback, useEffect, useState } from "react";
import { Cosmos } from "./Cosmos.tsx";
import { Landing } from "./Landing.tsx";
import { Cast } from "./Cast.tsx";
import { Report } from "./Report.tsx";
import { Method } from "./Method.tsx";
import { useGlow, useNow, useReveal, useTheme } from "./hooks.ts";
import { prepare, type FormValues, type Prepared } from "./logic.ts";
import { Glyph } from "./Glyph.tsx";
import { Intro, introSeen, type IntroExit } from "./Intro.tsx";

type Stage = "landing" | "casting" | "report";

function useHashPage() {
  const [hash, setHash] = useState(() => location.hash);
  useEffect(() => {
    const on = () => setHash(location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  // Only a plain #name travels reliably through the artifact frame; the older #/phuong-phap form still works.
  return hash === "#phuong-phap" || hash.startsWith("#/phuong-phap") ? "method" : "home";
}

export function App() {
  const [theme, toggleTheme] = useTheme();
  const page = useHashPage();
  const now = useNow();
  const [stage, setStage] = useState<Stage>("landing");
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [last, setLast] = useState<FormValues | undefined>();
  const [error, setError] = useState<string | null>(null);
  // the opening film: "play" while it covers the page, "fading" while it dissolves, "off" afterwards
  const [intro, setIntro] = useState<"play" | "fading" | "off">(() => (introSeen() ? "off" : "play"));

  useGlow();
  useReveal(`${page}-${stage}-${prepared?.chosenMin ?? 0}`);

  const submit = useCallback((v: FormValues) => {
    try {
      const p = prepare(v, undefined, Date.now());
      setPrepared(p); setLast(v); setError(null); setStage("casting");
      try { if (location.hash) history.replaceState(null, "", location.pathname + location.search); } catch { /* some frames refuse history changes */ }
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const choose = useCallback((mid: number) => {
    if (!last) return;
    setPrepared(prepare(last, mid, Date.now()));
  }, [last]);

  useEffect(() => { document.title = page === "method" ? "Phương pháp, Life Atlas" : "Life Atlas"; }, [page]);

  const introExit = useCallback((k: IntroExit) => {
    setIntro("off");
    if (k === "start" && stage === "landing" && page !== "method") {
      requestAnimationFrame(() => {
        const form = document.getElementById("form");
        form?.scrollIntoView({ behavior: "smooth", block: "start" });
        (form?.querySelector("input") as HTMLInputElement | null)?.focus({ preventScroll: true });
      });
    }
  }, [stage, page]);

  const home = () => { if (location.hash) location.hash = ""; setStage("landing"); window.scrollTo({ top: 0 }); };

  return (
    <>
      <a className="skip" href="#main">Bỏ qua, tới nội dung</a>
      {intro === "play" && <Intro onExit={introExit} onClosing={() => setIntro("fading")} />}
      {intro !== "play" && <Cosmos theme={theme} calm={page === "method" || stage === "report"} />}
      <div className="nebula" aria-hidden="true"><i /><i /><i /></div>
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <button type="button" className="brand" onClick={home} aria-label="Life Atlas, về trang đầu">
          <Glyph name="sun" size={22} className="brand-g" /><span>Life Atlas</span>
        </button>
        <nav className="topnav" aria-label="Điều hướng chính">
          <a href="#phuong-phap" className={page === "method" ? "on" : ""}>Phương pháp</a>
          <button type="button" className="iconbtn" onClick={toggleTheme} aria-label={theme === "night" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"} title={theme === "night" ? "Giao diện sáng" : "Giao diện tối"}>
            {theme === "night"
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7" /></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" /></svg>}
          </button>
        </nav>
      </header>

      {error && <div className="toast" role="alert">{error} <button type="button" onClick={() => setError(null)}>Đóng</button></div>}

      {page === "method" ? <Method /> : (
        <>
          {stage === "landing" && <Landing now={now} initial={last} onSubmit={submit} />}
          {stage === "casting" && prepared && <Cast prepared={prepared} onDone={() => { setStage("report"); window.scrollTo({ top: 0 }); }} />}
          {stage === "report" && prepared && <Report prepared={prepared} now={now} onEdit={() => { setStage("landing"); window.scrollTo({ top: 0 }); }} onChoose={choose} />}
        </>
      )}
      {!(stage === "casting" && page !== "method") && (
        <footer className="sitefoot">
          <p>Life Atlas · Jyotish (Lahiri · Whole Sign · Vimshottari)</p>
          <p><a href="#phuong-phap">Phương pháp và độ chính xác</a> · <button type="button" className="linkbtn replay" onClick={() => setIntro("play")}>Xem lại đoạn mở đầu</button></p>
        </footer>
      )}
    </>
  );
}
