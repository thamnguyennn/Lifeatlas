import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type Theme = "night" | "parchment";

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.getAttribute("data-skin") as Theme) || "night");
  useEffect(() => {
    document.documentElement.setAttribute("data-skin", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", theme === "night" ? "#0a0e1f" : "#f4efe4");
    try { localStorage.setItem("atlas-theme", theme); } catch { /* storage can be blocked; the theme still works for this visit */ }
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "night" ? "parchment" : "night"))];
}

export const prefersReducedMotion = () =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll reveal that never hides content at rest.
 * Elements already on screen get the class "in" (and a short entrance, "enter").
 * Elements below the fold get "pre" (dimmed and shifted) until they arrive, then "in".
 * Without IntersectionObserver or with reduced motion everything is simply shown.
 */
export function useReveal(dep: unknown) {
  useLayoutEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in):not(.pre)"));
    if (!els.length) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    const vh = window.innerHeight;
    for (const e of els) {
      if (e.getBoundingClientRect().top < vh * 0.96) e.classList.add("in", "enter");
      else { e.classList.add("pre"); io.observe(e); }
    }
    return () => io.disconnect();
  }, [dep]);
}

/** Pointer-follow glow on any element with class "glow". One listener for the whole page. */
export function useGlow() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const onMove = (e: PointerEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>(".glow");
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty("--mx", `${e.clientX - r.left}px`);
      t.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
}

export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), intervalMs); return () => clearInterval(id); }, [intervalMs]);
  return now;
}

export function useInterval(fn: () => void, ms: number | null) {
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => { if (ms === null) return; const id = setInterval(() => ref.current(), ms); return () => clearInterval(id); }, [ms]);
}
