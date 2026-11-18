// Voice rules shared by the reading lint and by scripts/voice-check.ts (drafts). See STYLE.md, "Giọng văn: bản đối chiếu".
// Upgraded for Life Atlas v3.0 (Section VII editorial rules).
export const BANNED = [
  // mannered or mystical filler
  "hành trình", "vũ trụ", "định mệnh", "số phận", "kỳ diệu", "thăng hoa", "tuyệt đối", "chắc chắn sẽ", "không thể tránh",
  "mê hoặc", "huyền diệu", "thiêng liêng", "năng lượng", "rung động", "thức tỉnh", "ánh sáng nội tâm",
  "trong bức tranh tổng thể", "nhìn chung", "điều quan trọng cần lưu ý", "hãy nhớ rằng", "đừng quên rằng",
  // plain-language rules: words the reader said were hard, hurtful or mechanical (see STYLE.md)
  "bản án", "phán quyết", "chín muồi", "chín mùi", "cơn đói", "nhiều đời", "tiền cảnh", "trục nghiệp", "chống đỡ",
  "hiện diện", "bản sắc", "cần chăm", "đan xen", "chủ nhà", "chủ cung", "cát lợi", "hóa giải", "kích hoạt", "tự thân", "tiềm thức", "mẫu hình", "điều bạn mệt", "Hệ Jaimini",
  "mình đã đọc lá số của bạn",
  // the Sun and Moon are named by what they stand for, never by inside and outside
  "bên trong", "bên ngoài", "vẻ ngoài", "con người bên",
  // Life Atlas v3.0 Section VII banned clichés
  "đây là lời nhắc", "bạn cần học cách", "học cách", "hai thế giới cùng phát triển", "một bên muốn", "không phải vì",
];

const wordRe = (alts: string[]) => new RegExp(`(?<![\\p{L}])(?:${alts.join("|")})(?![\\p{L}])`, "iu");

// Soft rules: counted and sampled, never failed, until the atoms are rewritten. Each one maps to a complaint the reader made.
const RULES: [string, RegExp][] = [
  ["vague metaphor (êm / căng)", wordRe(["êm", "êm ả", "êm đềm", "dễ căng(?! thẳng)", "quan hệ căng(?! thẳng)"])],
  ["hard to follow (readers asked for plain words)", wordRe(["có lúc chật", "lung lay", "chùng xuống", "khó uốn", "đi qua lửa", "thắng bằng duyên", "mùa nhỏ", "sức riêng"])],
  ["use 'giai đoạn', not 'chương', for dasha periods", wordRe(["chương này", "chương hiện tại", "mỗi chương", "những chương"])],
  ["jargon phrase (cách cục, thế hỗ trợ, nội lực, tín hiệu, cách ghép, sức nặng)", wordRe(["cách cục", "thế hỗ trợ", "nội lực", "tín hiệu", "cách ghép", "sức nặng"])],
  ["clipped phrase (a compound cut short: nghiêm for nghiêm khắc, chắc for chắc chắn, bị quản for bị quản lý)", /(?<![\p{L}])(?:thầy nghiêm|người nghiêm|rất nghiêm|thường chắc|rất chắc|khá chắc|bị quản)(?![\p{L}])(?! (?:khắc|túc|chắn|lý))/iu],
  ["too specialized (use the plain version in STYLE.md)", wordRe(["tương thích", "về mặt", "tư tưởng", "vị tha", "vô điều kiện", "thấu cảm", "bẩm sinh", "nghịch lý", "ngắt kết nối", "yếu tố", "đại diện cho"])],
  ["claim the sources do not make (kết quả muộn hơn, ít điểm hỗ trợ)", wordRe(["kết quả muộn hơn", "ít điểm hỗ trợ(?![^.]*(?:được nâng đỡ ít hơn|nhà khó))"])],
];
const JARGON = ["shadbala", "bhava bala", "sav", "ashtakavarga", "nakshatra", "chòm sao", "kendra", "dusthana", "yoga", "mahadasha", "antardasha", "navamsa", "karakamsa", "atmakaraka", "jaimini"];
const ABSTRACT = ["kỷ luật", "trách nhiệm", "nguồn lực", "phát triển", "năng lực", "tiềm năng", "giá trị", "chiều sâu", "khía cạnh", "lĩnh vực", "mức độ", "trạng thái"];

/** The names of the soft rules a sentence breaks. */
export function softRules(sentence: string): string[] {
  const out: string[] = [];
  for (const [rule, re] of RULES) if (re.test(sentence)) out.push(rule);
  const low = sentence.toLowerCase();
  if (JARGON.filter((j) => new RegExp(`(?<![\\p{L}])${j}(?![\\p{L}])`, "u").test(low)).length >= 2) out.push("two or more technical terms in one sentence");
  if (ABSTRACT.filter((a) => low.includes(a)).length >= 2) out.push("dry: two or more abstract nouns in one sentence");
  return out;
}
