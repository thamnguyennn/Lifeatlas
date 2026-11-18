import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { GLOSSARY } from "../reading/content/yogas.ts";

/** Which words open which glossary entry. Order matters: the first match of each entry is used. */
const PATTERNS: [RegExp, string][] = [
  [/Sarvashtakavarga|\bSAV\b/, "sav"], [/Vargottama/, "vargottama"], [/Moolatrikona/, "moolatrikona"], [/Dig Bala/, "digbala"],
  [/Navamsa/, "navamsa"], [/Parivartana/, "parivartana"], [/Yogakaraka/, "yogakaraka"], [/Viparita/, "viparita"],
  [/Neecha Bhanga/, "neechabhanga"], [/Kemadruma/, "kemadruma"], [/Gajakesari/, "gajakesari"], [/Raja Yoga/, "raja"],
  [/Dhana Yoga/, "dhana"], [/cháy sáng/i, "chaysang"], [/nghịch hành/i, "nghichhanh"], [/cung hãm|đắc vị/i, "cungdacvi"],
  [/góc chiếu/i, "gocchieu"], [/Antardasha|tiểu vận/i, "antardasha"], [/Lagna/, "lagna"],
  [/Atmakaraka/, "atmakaraka"], [/Karakamsa/, "karakamsa"], [/\bHora\b|hora/, "hora"], [/Dasamsa/, "dasamsa"], [/Rahu và Ketu/, "trucnghiep"], [/hành tinh cai quản/i, "chunha"], [/trụ cột/i, "trucot"],
  [/Shadbala/, "shadbala"], [/Bhava Bala/, "bhavabala"], [/Sade Sati/, "sadesati"], [/Chandra Bala/, "chandrabala"], [/Tara Bala/, "tarabala"],
  [/\btransit\b|Gochar/i, "gochar"], [/Chara Karaka|chara karaka/, "charakaraka"], [/Pratyantardasha|chặng nhỏ/, "pratyantar"],
];

function Term({ k, children }: { k: string; children: ReactNode }) {
  const g = GLOSSARY[k];
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !btn.current || !pop.current) { setPos(null); return; }
    const b = btn.current.getBoundingClientRect(), p = pop.current.getBoundingClientRect();
    const left = Math.max(8, Math.min(window.innerWidth - p.width - 8, b.left + b.width / 2 - p.width / 2));
    const above = b.top - p.height - 10 > 8;
    setPos({ left, top: above ? b.top - p.height - 10 : b.bottom + 10 });
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("scroll", close, { passive: true, capture: true });
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("scroll", close, true); window.removeEventListener("keydown", key); };
  }, [open]);

  if (!g) return <>{children}</>;
  return (
    <span className="term-wrap" onMouseLeave={() => setOpen(false)}>
      <button
        ref={btn} type="button" className="term" aria-expanded={open}
        onClick={() => setOpen((o) => !o)} onMouseEnter={() => setOpen(true)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
      >{children}</button>
      {open && (
        <span ref={pop} role="tooltip" className="term-pop" style={pos ? { left: pos.left, top: pos.top } : { visibility: "hidden", left: 0, top: 0 }}>
          <strong>{g.term}</strong>
          <span>{g.text}</span>
        </span>
      )}
    </span>
  );
}

/** Renders a paragraph and turns the first mention of each technical word into a small explainer. */
export function Gloss({ text }: { text: string }) {
  const hits: { s: number; e: number; k: string }[] = [];
  for (const [re, k] of PATTERNS) {
    const m = re.exec(text);
    if (!m) continue;
    const s = m.index, e = s + m[0].length;
    if (hits.some((h) => s < h.e && e > h.s)) continue;
    hits.push({ s, e, k });
  }
  if (!hits.length) return <>{text}</>;
  hits.sort((a, b) => a.s - b.s);
  const out: ReactNode[] = [];
  let at = 0;
  hits.forEach((h, i) => {
    if (h.s > at) out.push(text.slice(at, h.s));
    out.push(<Term key={i} k={h.k}>{text.slice(h.s, h.e)}</Term>);
    at = h.e;
  });
  if (at < text.length) out.push(text.slice(at));
  return <>{out}</>;
}
