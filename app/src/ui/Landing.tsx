import { useMemo } from "react";
import { skyAt, phaseName } from "../engine/sky.ts";
import { SIGNS } from "../engine/constants.ts";
import { LUNAR_YEAR_NAMES } from "../engine/lunar-vn.ts";
import { ZodiacWheel } from "./ZodiacWheel.tsx";
import { SignGlyph } from "./Glyph.tsx";
import { Intake, SAMPLE } from "./Intake.tsx";
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
          <p className="lead reveal" style={{ ["--d" as string]: "120ms" }}>
            Cho mình ngày, giờ và nơi bạn sinh. Mình đọc bầu trời lúc đó theo Jyotish, chiêm tinh cổ của Ấn Độ, rồi kể lại bằng lời thường.
          </p>
          <div className="cta reveal" style={{ ["--d" as string]: "180ms" }}>
            <a className="btn primary" href="#form">Mở lá số của bạn</a>
            <button className="btn ghost" type="button" onClick={() => onSubmit(SAMPLE)}>Xem lá số mẫu</button>
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

      <section className="author" aria-label="Lời tự sự của tác giả">
        <article className="author-letter card reveal">
          <p className="eyebrow">Lời tự sự của tác giả</p>
          <h2>Tôi bắt đầu từ <em>những câu hỏi về chính mình.</em></h2>
          <p>Tôi từng tìm hiểu nhiều cách để lý giải cuộc đời, nhưng lại dừng lâu nhất ở chiêm tinh Vệ Đà, hay Jyotish. Tôi thích chiều sâu của một truyền thống được gìn giữ từ thời xa xưa. Càng tìm hiểu, tôi càng thấy một con người không thể được gói gọn trong vài dòng nhận xét hay một lời tiên đoán.</p>
          <p>Tôi tạo nên Life Atlas với mong muốn bạn có một khoảng lặng để nhìn lại chính mình. Biết đâu, khi đọc lá số, bạn sẽ nhận ra một điều mình vẫn cảm thấy nhưng chưa từng gọi thành tên; hoặc tìm được chút bình tâm trước một ngã rẽ. Tôi tin cuộc đời không nằm sẵn trong bất kỳ lá số nào. Điều quan trọng vẫn là cách ta sống và những lựa chọn từ hôm nay.</p>
          <p className="sig">Người tạo nên Life Atlas</p>
        </article>
        <aside className="jyotish-card card reveal" style={{ ["--d" as string]: "100ms" }}>
          <p className="eyebrow">Jyotish trong vài câu</p>
          <p>Jyotish, hay chiêm tinh Vệ Đà, là hệ chiêm tinh cổ của Ấn Độ. Khác với chiêm tinh phương Tây, nó tính theo vị trí thật của các vì sao, nên cung của bạn ở đây có thể khác cung bạn vẫn biết.</p>
          <p>Lá số cho biết lúc bạn sinh, chín hành tinh đứng ở đâu, và mỗi vị trí ứng với một mảng đời. Nó còn chia đời bạn thành những giai đoạn dài, mỗi giai đoạn do một hành tinh dẫn dắt.</p>
        </aside>
      </section>

      <section className="intake-wrap single">
        <div className="reveal" style={{ ["--d" as string]: "80ms" }}>
          <Intake initial={initial} onSubmit={onSubmit} />
        </div>
      </section>
    </main>
  );
}
