// Rahu and Ketu, read in three layers at once: each node, the axis between them, and their ties to the rest of the chart.
// The reading follows the twelve questions a Jyotishi asks about a node (house, sign, dispositor, nakshatra, nakshatra lord,
// pada and D9, company, aspects received, yoga, functional lordship, dasha, divisional charts and transit). The story
// speaks plainly about the few that matter most; the twelve answers are kept in a folded table for anyone who wants to check.
import { SIGNS, SIGN_LORD, NAKSHATRA_VI, fmtDeg, mod, type GrahaId } from "../engine/constants.ts";
import { vargaSign } from "../engine/vargas.ts";
import { dashaMahas, dashaOrigin } from "../engine/dasha5.ts";
import type { Ctx } from "./ctx.ts";
import { buildFacts, isGood, HOUSE_SHORT, type Facts, type PlanetFact } from "./facts.ts";
import { friendGrade } from "./timeline.ts";
import { AXIS, AXIS_INTRO, RAHU_SIGN, KETU_SIGN, WITH_RAHU, WITH_KETU } from "./content/axis.ts";
import { NAK } from "./content/nakshatra.ts";
import { HOUSE_TAG } from "./content/houses-signs.ts";
import { ELEMENT_OF, ELEMENT_VI } from "./content/overview.ts";
import { PLANETS } from "./content/planets.ts";
import { nameOf, joinVi, lowerFirst, mmYYYY } from "./util.ts";

export interface NodeFactor { n: number; name: string; question: string; rahu: string; ketu: string }
export interface NodesReading {
  intro: string;
  headline: string;
  /** The story of the axis: what pulls in each direction and who steers each end. */
  axis: string[];
  rahu: { title: string; paragraphs: string[] };
  ketu: { title: string; paragraphs: string[] };
  bridge: string[];
  ask: string | null;
  factors: NodeFactor[];
}

const plainNak = (t: string) => t.replace(/^(Rahu|Ketu) ở chòm sao [^ ]+( [A-Z][a-z]+)? (cho thấy|mang theo) /, (_m, _a, _b, v) => (v === "cho thấy" ? "" : "Bạn mang theo ")).replace(/^./, (c) => c.toUpperCase());
const plainWith = (t: string) => t.replace(/^[^:]+ cùng cung với (Rahu|Ketu): /, "").replace(/^./, (c) => c.toUpperCase());
const nak = (name: string) => NAKSHATRA_VI[name] ?? name;
const gradeWord = (p: PlanetFact) => (p.grade === "strong" ? "rất vững" : p.grade === "good" ? "khá vững" : p.grade === "weak" ? "còn yếu" : "ở mức vừa");

/** Who steers a node: the lord of the sign it stands in, said in terms of where that planet goes and how well it stands. */
function steer(F: Facts, node: "rahu" | "ketu", noTime: boolean): string {
  const g = F.planets[node].g;
  const d = F.planets[SIGN_LORD[g.sign]];
  const nm = nameOf(d.id), who = node === "rahu" ? "Rahu" : "Ketu";
  const role = node === "rahu" ? "khát vọng" : "điều đã thạo";
  if (noTime || !d.house) return `${who} nằm trong cung của ${nm}, nên ${role} này đi theo cách của ${nm}: ${lowerFirst(PLANETS[d.id].gift)}.`;
  const tag = HOUSE_TAG[d.house - 1];
  const lord = d.lorded.length ? ` Vì ${nm} còn cai quản ${joinVi(d.lorded.map((h) => HOUSE_SHORT[h - 1]))}, ${role} ấy cũng chảy về các mảng này.` : "";
  const cond = d.grade === "strong" || d.grade === "good" ? `${nm} ${gradeWord(d)}, nên người dẫn đường này đáng tin.` : d.grade === "weak" ? `${nm} còn yếu, nên người dẫn đường này cần được nuôi thêm bằng việc làm cụ thể.` : `${nm} ở mức vừa, đủ để dẫn đường nhưng không phải chỗ để dựa hết.`;
  return `${who} nằm trong cung của ${nm}, và ${nm} đang đứng ở vùng ${tag}, nên ${role} này tìm đường qua chuyện ${tag}. ${cond}${lord}`;
}

function received(F: Facts, node: "rahu" | "ketu"): string[] {
  const asp = F.planets[node].aspectedBy;
  return asp.map((id) => {
    const p = F.planets[id];
    return p.natural === "benefic"
      ? `${nameOf(id)} nhìn vào nhà chứa ${node === "rahu" ? "Rahu" : "Ketu"} bằng ánh nhìn che chở, nên ${node === "rahu" ? "khát vọng" : "điều đã thạo"} này có thêm người dẫn đường và bớt gắt.`
      : `${nameOf(id)} nhìn vào nhà chứa ${node === "rahu" ? "Rahu" : "Ketu"} bằng ánh nhìn nặng, nên ${node === "rahu" ? "khát vọng" : "điều đã thạo"} này đi cùng áp lực và đòi kỷ luật.`;
  });
}

function companions(F: Facts, node: "rahu" | "ketu"): string[] {
  const tbl = node === "rahu" ? WITH_RAHU : WITH_KETU;
  return F.planets[node].conj.filter((o) => o !== "rahu" && o !== "ketu").map((o) => tbl[o]).filter(Boolean);
}

function lordOfNakshatra(F: Facts, node: "rahu" | "ketu", noTime: boolean): string {
  const g = F.planets[node].g;
  const l = F.planets[g.nak.lord];
  const nm = nameOf(l.id), who = node === "rahu" ? "Rahu" : "Ketu";
  return `Chủ của chòm sao ${nak(g.nak.name)} là ${nm}${noTime || !l.house ? "" : `, đang ở vùng ${HOUSE_TAG[l.house - 1]} và ${gradeWord(l)}`}, nên sắc thái của ${node === "rahu" ? "khát vọng" : "sở trường"} này mang thêm màu của ${nm}.`;
}

function yogaNote(ctx: Ctx, node: "rahu" | "ketu"): string[] {
  return ctx.n.yogas.filter((y) => y.grahas.includes(node)).map((y) => `${y.name}: một tổ hợp có ${node === "rahu" ? "Rahu" : "Ketu"} tham gia.`);
}

export function readNodes(ctx: Ctx): NodesReading {
  const F = buildFacts(ctx), n = ctx.n, noTime = ctx.noTime;
  const R = F.planets.rahu, K = F.planets.ketu;
  const A = noTime ? null : AXIS[R.house! - 1];
  const dR = F.planets[SIGN_LORD[R.sign]], dK = F.planets[SIGN_LORD[K.sign]];

  // how the two steering planets stand to each other
  let link = "";
  if (dR.id !== dK.id) {
    const g = friendGrade(ctx, dR.id, dK.id);
    const a = nameOf(dR.id), b = nameOf(dK.id);
    const sameSign = dR.sign === dK.sign;
    const dist = noTime ? 0 : mod(dK.house! - dR.house!, 12) + 1;
    const plainRel = sameSign ? "Khát vọng và sở trường của bạn gặp nhau trực tiếp, nên điều bạn muốn với tới và điều bạn vốn giỏi dễ hòa vào một."
      : [6, 8].includes(dist) ? "Khát vọng và sở trường của bạn hiếm khi trùng đường, nên bạn hay phải cân nhắc giữa điều mới và điều quen."
      : [1, 5, 9].includes(dist) ? "Khát vọng và sở trường của bạn đi khá cùng hướng, nên điều quen tay có thể trở thành bệ đỡ cho điều mới."
      : g === "enemy" || g === "great_enemy" ? "Khát vọng và sở trường của bạn hay kéo về hai phía." : "Khát vọng và sở trường của bạn cùng làm việc mà ít cản nhau.";
    void a; void b;
    const rel = sameSign ? `${a} và ${b} đứng cùng một cung, nên khát vọng và sở trường của bạn gặp nhau trực tiếp`
      : [6, 8].includes(dist) ? `${a} và ${b} đứng ở thế 6/8 so với nhau, nên khát vọng và sở trường của bạn hiếm khi trùng đường và hay phải thương lượng`
      : [1, 5, 9].includes(dist) ? `${a} và ${b} đứng ở thế tam hợp, nên khát vọng và sở trường của bạn đi cùng một hướng khá thuận`
      : g === "friend" ? `${a} và ${b} là hai hành tinh thân nhau, nên khát vọng và sở trường của bạn hiểu nhau`
      : g === "enemy" ? `${a} và ${b} không ưa nhau, nên khát vọng và sở trường của bạn hay kéo bạn về hai phía`
      : `${a} và ${b} ở thế trung lập, nên khát vọng và sở trường của bạn cùng làm việc mà ít cản nhau`;
    link = plainRel;
  }

  const axis: string[] = [];
  if (A) axis.push(`${A.lesson} ${A.pull}`);
  else axis.push("Vì chưa có giờ sinh, mình chưa biết trục này rơi vào nhà nào; phần dưới chỉ đọc những gì không phụ thuộc cung mọc.");
  if (link) axis.push(link);

  const rahuP: string[] = [];
  if (A) rahuP.push(A.rahu);
  rahuP.push(`Điều bạn khao khát ${RAHU_SIGN[R.sign].replace(/^mang kiểu /, "thường là ")}`);
  rahuP.push(plainNak(NAK[R.g.nak.index].quest));
  rahuP.push(...companions(F, "rahu").map(plainWith));

  const ketuP: string[] = [];
  if (A) ketuP.push(A.ketu);
  ketuP.push(`Điều bạn vốn thạo ${KETU_SIGN[K.sign].replace(/^mang kiểu /, "thường là kiểu ")}`);
  ketuP.push(plainNak(NAK[K.g.nak.index].memory));
  ketuP.push(...companions(F, "ketu").map(plainWith));

  // the twelve factors, kept for the folded table
  const origin = dashaOrigin(n.grahas.moon.lon, n.utcMs);
  const mahas = dashaMahas(origin, 12);
  const dasha = (id: GrahaId) => { const m = mahas.find((x) => x.lord === id && x.endMs > n.utcMs && (x.startMs - n.utcMs) / (365.25 * 864e5) < 100); return m ? `${mmYYYY(m.startMs)} – ${mmYYYY(m.endMs)}` : "không rơi vào 100 năm đầu của đời"; };
  const row = (id: "rahu" | "ketu") => {
    const p = F.planets[id], g = p.g, d = F.planets[SIGN_LORD[g.sign]], nl = F.planets[g.nak.lord];
    const tr = ctx.transit.grahas[id];
    return {
      bhava: noTime ? "chưa có giờ sinh" : `nhà ${g.house} (${HOUSE_TAG[g.house - 1]})`,
      rashi: `${SIGNS[g.sign]} ${fmtDeg(g.deg)} (${ELEMENT_VI[ELEMENT_OF(g.sign)]})`,
      disp: `${nameOf(d.id)}${noTime ? "" : `, nhà ${d.house}`}, ${gradeWord(d)}`,
      nak: `${nak(g.nak.name)}, pada ${g.nak.pada}`,
      nakLord: `${nameOf(nl.id)}${noTime ? "" : `, nhà ${nl.house}`}, ${gradeWord(nl)}`,
      pada: `pada ${g.nak.pada}; Navamsa ${SIGNS[g.navamsaSign]}`,
      conj: p.conj.length ? joinVi(p.conj.map(nameOf)) : "không có",
      asp: p.aspectedBy.length ? joinVi(p.aspectedBy.map(nameOf)) : "không có",
      yoga: yogaNote(ctx, id).join(" ") || "không tham gia yoga nào trong danh sách",
      func: noTime ? "cần giờ sinh" : `${nameOf(d.id)} cai quản nhà ${d.lorded.join(" và ") || "—"}`,
      dasha: `Đại vận ${nameOf(id)}: ${dasha(id)}`,
      varga: `D9: ${SIGNS[g.navamsaSign]}; ${noTime ? "" : `D10: ${SIGNS[vargaSign(g.lon, 10)]}; `}hôm nay đi qua ${noTime ? "" : `nhà ${tr.fromLagna} từ cung mọc và `}cung thứ ${tr.fromMoon} từ Mặt Trăng`,
    };
  };
  const r = row("rahu"), k = row("ketu");
  const factors: NodeFactor[] = [
    { n: 1, name: "Bhava", question: "Nằm ở nhà nào?", rahu: r.bhava, ketu: k.bhava },
    { n: 2, name: "Rashi", question: "Nằm trong cung nào?", rahu: r.rashi, ketu: k.rashi },
    { n: 3, name: "Dispositor", question: "Ai cai quản cung đó, đang ở đâu?", rahu: r.disp, ketu: k.disp },
    { n: 4, name: "Nakshatra", question: "Nằm trong tú sao nào?", rahu: r.nak, ketu: k.nak },
    { n: 5, name: "Chủ Nakshatra", question: "Chủ tú sao ở đâu, tình trạng ra sao?", rahu: r.nakLord, ketu: k.nakLord },
    { n: 6, name: "Pada và D9", question: "Thuộc pada nào, rơi vào Navamsa nào?", rahu: r.pada, ketu: k.pada },
    { n: 7, name: "Đồng cung", question: "Đứng cùng cung với hành tinh nào?", rahu: r.conj, ketu: k.conj },
    { n: 8, name: "Góc chiếu nhận", question: "Nhận góc chiếu từ hành tinh nào?", rahu: r.asp, ketu: k.asp },
    { n: 9, name: "Yoga", question: "Tham gia tổ hợp đặc biệt nào?", rahu: r.yoga, ketu: k.yoga },
    { n: 10, name: "Chủ nhà chức năng", question: "Hành tinh liên quan cai quản những nhà nào?", rahu: r.func, ketu: k.func },
    { n: 11, name: "Dasha", question: "Khi nào chủ vận?", rahu: r.dasha, ketu: k.dasha },
    { n: 12, name: "Varga và Gochara", question: "D9, D10 và chuyển vận cho thấy gì?", rahu: r.varga, ketu: k.varga },
  ];

  return {
    intro: AXIS_INTRO,
    headline: noTime ? `Rahu ở ${SIGNS[R.sign]} · Ketu ở ${SIGNS[K.sign]}` : `Rahu ở vùng ${HOUSE_TAG[R.house! - 1]} · Ketu ở vùng ${HOUSE_TAG[K.house! - 1]}`,
    axis,
    rahu: { title: "Rahu: nơi bạn muốn mở rộng", paragraphs: rahuP.filter(Boolean) },
    ketu: { title: "Ketu: nơi bạn chọn lọc và quay vào trong", paragraphs: ketuP.filter(Boolean) },
    bridge: [...(A ? [A.bridge] : []), ...timing(ctx, F)],
    ask: A ? A.ask : null,
    factors,
  };
}

void isGood;

/** Where the axis meets time: a Rahu/Ketu period (or one of their dispositors), and the transiting nodes over the natal axis. */
function timing(ctx: Ctx, F: Facts): string[] {
  const out: string[] = [];
  const [maha, antar] = ctx.chain;
  const dR = SIGN_LORD[F.planets.rahu.sign], dK = SIGN_LORD[F.planets.ketu.sign];
  const who = (id: GrahaId) => (id === "rahu" ? "Rahu" : id === "ketu" ? "Ketu" : id === dR ? `${nameOf(id)}, hành tinh dẫn Rahu` : `${nameOf(id)}, hành tinh dẫn Ketu`);
  const hit = [maha, antar].filter(Boolean).find((x) => [ "rahu", "ketu", dR, dK ].includes(x.lord));
  if (hit) out.push(`Hiện bạn đang ở ${hit.level === 1 ? "đại vận" : "tiểu vận"} của ${who(hit.lord)} (${mmYYYY(hit.startMs)} – ${mmYYYY(hit.endMs)}), nên trục này đang được nhấn mạnh trong đời sống hơn bình thường: những câu hỏi về ${hit.lord === "ketu" || hit.lord === dK ? "điều gì đáng giữ, điều gì nên buông" : "điều mình thật sự muốn với tới"} dễ trở nên cụ thể.`);
  const tr = ctx.transit.grahas.rahu.sign;
  if (tr === F.planets.rahu.sign) out.push("Rahu trên bầu trời hiện đang đi qua đúng cung của Rahu lúc bạn sinh, một lần trở về xảy ra khoảng 18 năm một lần; truyền thống xem đây là lúc những khát vọng cũ được đặt lại trên bàn.");
  else if (tr === F.planets.ketu.sign) out.push("Rahu trên bầu trời hiện đang đi qua cung của Ketu lúc bạn sinh, tức trục đang đảo chiều; những gì quen thuộc có thể bỗng trở nên đáng muốn, và ngược lại.");
  return out;
}
