// The whole reading as plain text, for the "Sao chép bài đọc" button (paste into Notes, Docs or Zalo).
import type { Prepared } from "./logic.ts";
import { birthSubtitle, TONE_SHORT, TONE_TEXT } from "./format.ts";
import type { PeriodRead } from "../reading/types.ts";

export function readingToText(p: Prepared): string {
  const { reading: r, values, noTime } = p;
  const out: string[] = [];
  const title = (t: string) => out.push("", t.toUpperCase(), "—".repeat(Math.min(t.length, 36)), "");
  const sub = (t: string) => out.push(t.toUpperCase(), "");
  const para = (t: string) => out.push(t, "");
  const paras = (list: string[]) => list.forEach(para);
  const ask = (label: string, t: string | null | undefined) => { if (t) para(`${label}: ${t}`); };
  const period = (x: PeriodRead) => {
    out.push(`${x.name} ${x.lordName} (${x.from} – ${x.to}, ${x.span}; độ tin cậy: ${x.trust})`, "");
    paras(x.paragraphs);
  };

  out.push(values.name ? `LÁ SỐ JYOTISH CỦA ${values.name.toUpperCase()}` : "LÁ SỐ JYOTISH");
  out.push(birthSubtitle(p));
  title("Tổng quan");
  const X = r.overview.explore;
  sub("Khám phá bản thân từ ngoài vào trong"); para(X.lead);
  for (const p of X.parts) { out.push(`${p.title} · ${p.role}`, ""); paras(p.paragraphs); }
  sub("Những đặc điểm nổi bật");
  for (const h of X.highlights) { out.push(h.title, ""); para(h.text); }
  sub("Bức tranh tổng thể"); para(X.summary);

  if (!noTime && r.houseMap) {
    title("12 khía cạnh của cuộc sống");
    paras(r.houseMap.intro);
    for (const h of r.houses) {
      out.push(`NHÀ ${h.n} · ${h.theme} (Độ nâng đỡ: ${h.supportLevel} · Mức biểu hiện: ${h.expressiveLevel})`);
      out.push(`${h.ask} Cung ${h.signName}, ${h.lordName} cai quản và đang ở nhà ${h.lordHouse}.`, "");
      for (const s of h.sections) {
        out.push(`— ${s.title}`, "");
        paras(s.paragraphs);
        for (const b of s.blocks ?? []) { out.push(b.label, ""); paras(b.paragraphs); }
      }
      out.push("");
    }
  }

  title("Bài học kiếp này");
  const a = r.nodes;
  sub(`Rahu và Ketu · ${a.headline}`);
  para(a.intro);
  paras(a.axis);
  sub(a.ketu.title); paras(a.ketu.paragraphs);
  sub(a.rahu.title); paras(a.rahu.paragraphs);
  paras(a.bridge);
  ask("Một câu hỏi", a.ask);

  if (!noTime && r.vargas) {
    title("Biểu đồ chuyên sâu");
    for (const v of r.vargas) {
      sub(`${v.code} · ${v.name}`);
      para(v.question); paras(v.summary);
      for (const pt of v.points) { sub(pt.title); paras(pt.paragraphs); }
      para(v.trust.note);
      if (v.why.length) { sub("Vì sao mình nói điều này?"); paras(v.why); }
    }
  }

  title("Đại vận và tiểu vận");
  para(r.timeline.intro);
  para(r.timeline.birth);
  para(r.timeline.reliability.note);
  for (const m of r.timeline.mahas) {
    const mark = m.state === "now" ? " · đang diễn ra" : m.state === "past" ? " · đã qua" : "";
    out.push(`ĐẠI VẬN ${m.name.toUpperCase()} · ${m.read.title}: ${m.from} – ${m.to}, tuổi ${m.ageFrom}–${m.ageTo} · ${TONE_TEXT[m.tone]}${mark}`, "");
    paras(m.read.paragraphs);
    para(`Các tiểu vận: ${m.antars.map((x) => `${x.lordName} ${x.from}–${x.to}${x.state === "now" ? " (hiện tại)" : ""}`).join("; ")}.`);
  }
  if (!noTime && r.timeline.houseWindows.length > 0) {
    sub("Khi nào từng khía cạnh được đánh thức trong 20 năm tới");
    for (const hw of r.timeline.houseWindows) {
      para(`Nhà ${hw.n} (${hw.tag}): ${hw.windows.join(" · ")}`);
    }
  }

  sub(`Bạn đang ở đâu trong các giai đoạn (${r.ladder.dateLabel})`);
  for (const x of r.ladder.levels) period(x);
  paras(r.ladder.blend);
  para(r.ladder.trustNote);

  sub(`Bầu trời hiện tại (${r.sky.dateLabel})`);
  para(r.sky.intro);
  out.push(r.sky.sade.title, ""); para(r.sky.sade.text);
  for (const s of r.sky.specials) { out.push(s.title, ""); para(s.text); }
  for (const pl of r.sky.planets) {
    para(`${pl.name} ở ${pl.sign} ${pl.deg}${pl.retro ? " (đi lùi)" : ""}. Từ Mặt Trăng: ${pl.moonText}${pl.lagnaText ? ` Từ Cung mọc: ${pl.lagnaText}` : ""}${pl.divergenceNote ? ` ${pl.divergenceNote}` : ""}`);
  }
  out.push(r.sky.day.title, ""); paras(r.sky.day.paragraphs);
  for (const h of r.sky.hits) para(`${h.title}. ${h.text}`);

  title(`Dự đoán ${r.forecast.year}`);
  paras(r.forecast.intro);
  for (const e of r.forecast.key) para(`${e.date} · ${e.title}. ${e.text}`);
  for (const mo of r.forecast.months) { sub(`${mo.label} · ${mo.headline}`); paras(mo.paragraphs); }
  para(r.forecast.trustNote);

  title("Tra cứu: các hành tinh");
  for (const g of r.overview.planets) {
    const state = [g.dignity !== "—" ? g.dignity : "", ...g.flags].filter(Boolean).join(", ");
    out.push(`${g.name} (${g.sanskrit}): ${g.sign} ${g.deg}${noTime ? "" : `, nhà ${g.house}`}, sao ${g.nakshatra} pada ${g.pada}${state ? ` · ${state}` : ""} · Navamsa ${g.navamsa}`);
  }
  out.push("");

  out.push("—", "Bài đọc mang tính tham khảo và tự suy ngẫm. Nó không thay thế lời khuyên y tế, pháp lý hay tài chính, và không dự đoán sự kiện cụ thể.");
  return out.join("\n");
}
