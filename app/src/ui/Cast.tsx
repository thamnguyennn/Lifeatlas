import { useEffect, useState } from "react";
import { ZodiacWheel } from "./ZodiacWheel.tsx";
import { GRAHA_VI, SIGNS, GRAHAS } from "../engine/constants.ts";
import { prefersReducedMotion } from "./hooks.ts";
import { Emblem } from "./Emblem.tsx";
import { DEITY } from "./deities.ts";
import type { Prepared } from "./logic.ts";

/** A short ritual while the chart is "drawn". The numbers shown are the real ones that were just computed. */
export function Cast({ prepared, onDone }: { prepared: Prepared; onDone: () => void }) {
  const reduce = prefersReducedMotion();
  const { natal } = prepared;
  const [rot, setRot] = useState(reduce ? natal.lagna.lon : -240);
  const [shown, setShown] = useState(reduce ? 9 : 0);
  const [step, setStep] = useState(reduce ? 3 : 0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (reduce) { const t = setTimeout(onDone, 700); return () => clearTimeout(t); }
    const T_SPIN = 1900, T_PLANETS = 1150, T_END = T_SPIN + T_PLANETS + 700;
    const t0 = performance.now();
    let raf = 0;
    const ease = (x: number) => 1 - Math.pow(1 - x, 4);
    const from = -240, to = natal.lagna.lon;
    const tick = (t: number) => {
      const e = t - t0;
      const k = Math.min(1, e / T_SPIN);
      setRot(from + (to - from) * ease(k));
      if (e > T_SPIN) setShown(Math.min(9, Math.floor(((e - T_SPIN) / T_PLANETS) * 9) + 1));
      setStep(e < 500 ? 0 : e < T_SPIN ? 1 : e < T_SPIN + T_PLANETS ? 2 : 3);
      if (e > T_END - 350) setLeaving(true);
      if (e >= T_END) { onDone(); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const key = (ev: KeyboardEvent) => { if (ev.key === "Escape" || ev.key === "Enter") onDone(); };
    window.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", key); };
  }, []);

  const lines = [
    `Đổi giờ địa phương sang giờ chuẩn quốc tế (${prepared.time.label})`,
    `Tìm cung mọc: ${SIGNS[natal.lagna.sign]}`,
    `Đặt 9 hành tinh lên bầu trời lúc bạn sinh`,
    `Tính đại vận từ sao của Mặt Trăng: ${natal.grahas.moon.nak.name}`,
  ];
  const last = shown > 0 ? GRAHAS[Math.min(8, shown - 1)] : null;

  return (
    <div className={`cast ${leaving ? "leaving" : ""}`} role="dialog" aria-modal="true" aria-label="Đang dựng lá số" onClick={onDone}>
      <div className="cast-wheel">
        <ZodiacWheel
          planets={GRAHAS.map((id) => ({ id, lon: natal.grahas[id].lon, retro: natal.grahas[id].retro }))}
          rot={rot} visible={shown} lagnaLon={natal.lagna.lon} idle={false} label="Bánh xe lá số đang được dựng"
        />
      </div>
      <ol className="cast-steps">
        {lines.map((l, i) => (
          <li key={i} className={i < step ? "done" : i === step ? "now" : ""}>{l}</li>
        ))}
      </ol>
      <p className="cast-now" aria-live="polite">
        {last ? <><Emblem id={last} size={30} title="" /><span>{GRAHA_VI[last]} · {SIGNS[natal.grahas[last].sign]} · {DEITY[last].name}</span></> : " "}
      </p>
      <p className="cast-skip">Nhấn bất kỳ đâu để bỏ qua</p>
    </div>
  );
}
