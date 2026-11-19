// The map of the report: seven parts, each a short run of pages. The strip under the header shows the parts, a second strip shows the
// pages of the current part, and "Tiếp theo" walks through every page in order. Nothing here reads a chart; it only decides what exists.
import type { Prepared } from "./logic.ts";

export interface PageDef {
  id: string;
  /** The part this page belongs to. */
  part: string;
  /** Short label in the strip of pages. */
  nav: string;
  /** Label on the Back and Next buttons. */
  label: string;
}

export interface PartDef {
  id: string;
  /** Label in the strip of parts. */
  label: string;
  pages: PageDef[];
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function buildParts(p: Prepared): PartDef[] {
  const { reading: r, noTime } = p;
  const out: PartDef[] = [];
  const add = (id: string, label: string, pages: Omit<PageDef, "part">[]) => out.push({ id, label, pages: pages.map((pg) => ({ ...pg, part: id })) });



  add("overview", "Tổng quan", [{ id: "ov", nav: "Tổng quan", label: "Tổng quan" }]);

  if (!noTime) {
    add("houses", "12 khía cạnh", [
      { id: "h-map", nav: "Bản đồ", label: "Mười hai khía cạnh" },
      ...r.houses.map((h) => ({ id: `h-${h.n}`, nav: String(h.n), label: `Nhà ${h.n}: ${h.tag}` })),
    ]);
  }

  add("lessons", "Bài học kiếp này", [{ id: "axis", nav: "Rahu và Ketu", label: "Rahu và Ketu" }]);

  if (r.vargas) {
    add("vargas", "Biểu đồ chuyên sâu", r.vargas.map((v) => ({ id: `v-${v.n}`, nav: v.code, label: `${v.code}: ${cap(v.short)}` })));
  }

  add("time", "Đại vận và tiểu vận", [
    { id: "t-chapters", nav: "Các giai đoạn đời", label: "Các giai đoạn đời" },
    { id: "t-now", nav: "Bạn đang ở đâu", label: "Bạn đang ở đâu, và Gochara" },
  ]);

  add("explore", "Khám phá thêm", [
    { id: "x-compat", nav: "So sánh hai lá số", label: "So sánh hai lá số" },
    ...r.explore.map((g) => ({ id: `x-${g.id}`, nav: g.title.split(" và ")[0], label: g.title })),
  ]);
  add("y2027", "Dự đoán 2027", [{ id: "y2027", nav: "2027", label: "Dự đoán 2027" }]);
  return out;
}

export const flatPages = (parts: PartDef[]): PageDef[] => parts.flatMap((p) => p.pages);
