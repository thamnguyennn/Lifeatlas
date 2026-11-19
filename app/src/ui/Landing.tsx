import { useMemo } from "react";
import { skyAt, phaseName } from "../engine/sky.ts";
import { SIGNS } from "../engine/constants.ts";
import { LUNAR_YEAR_NAMES } from "../engine/lunar-vn.ts";
import { ZodiacWheel } from "./ZodiacWheel.tsx";
import { SignGlyph } from "./Glyph.tsx";
import { Intake } from "./Intake.tsx";
import type { FormValues } from "./logic.ts";

export function Landing({ now, initial, onSubmit }: { now: number; initial?: FormValues; onSubmit: (v: FormValues) => void }) {
  const sky = useMemo(() => skyAt(now), [Math.floor(now / 600_000)]);
  const moon = sky.grahas.find((g) => g.id === "moon")!;
  const sun = sky.grahas.find((g) => g.id === "sun")!;
  const lunarLabel = `${sky.lunar.day}/${sky.lunar.month}${sky.lunar.leap ? " nhuận" : ""} ${LUNAR_YEAR_NAMES(sky.lunar.year)}`;

  return (
    <main id="main">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow reveal">Jyotish · Chiêm tinh Vệ Đà</p>
          <h1 className="reveal" style={{ ["--d" as string]: "60ms" }}>
            Khi bạn sinh ra, bầu trời đã có một tấm bản đồ gửi đến bạn những thông điệp riêng, <span className="shimmer">hãy để mình kể cho bạn nghe.</span>
          </h1>
          <div className="cta reveal" style={{ ["--d" as string]: "180ms" }}>
            <a className="btn primary" href="#form">Mở lá số của bạn</a>
          </div>
          <ul className="skychips reveal" style={{ ["--d" as string]: "240ms" }} aria-label="Bầu trời lúc này">
            <li><span className="k">Bầu trời lúc này</span></li>
            <li>Âm lịch <b>{lunarLabel}</b></li>
            <li><SignGlyph sign={sun.sign} size={14} /><span>Mặt Trời ở <b>{SIGNS[sun.sign]}</b></span></li>
            <li><SignGlyph sign={moon.sign} size={14} /><span>Mặt Trăng ở <b>{SIGNS[moon.sign]}</b>, chòm sao <b>{sky.moonNak.name}</b></span></li>
            <li>{phaseName(sky.elongation)}</li>
          </ul>
        </div>
        <div className="hero-wheel" aria-hidden="false">
          <ZodiacWheel planets={sky.grahas.map((g) => ({ id: g.id, lon: g.lon, retro: g.retro }))} label="Bánh xe 12 cung với vị trí thật của các hành tinh lúc này" />
        </div>
      </section>

      <section className="intake-wrap single">
        <div className="reveal" style={{ ["--d" as string]: "80ms" }}>
          <Intake initial={initial} onSubmit={onSubmit} />
        </div>
      </section>

      <section className="author-end" aria-label="Lời tự sự của tác giả">
        <details className="author-note">
          <summary>Lời tự sự của tác giả</summary>
          <p>Tôi tạo nên Life Atlas với mong muốn bạn có một khoảng lặng để nhìn lại chính mình. Biết đâu, khi đọc lá số, bạn sẽ nhận ra một điều mình vẫn cảm thấy nhưng chưa từng gọi thành tên; hoặc tìm được chút bình tâm trước một ngã rẽ. Tôi tin cuộc đời không nằm sẵn trong bất kỳ lá số nào. Điều quan trọng vẫn là cách ta sống và những lựa chọn từ hôm nay.</p>
        </details>
      </section>
    </main>
  );
}
