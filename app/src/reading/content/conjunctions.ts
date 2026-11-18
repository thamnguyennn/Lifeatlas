// Two planets in the same sign: what the pair tends to give and what to watch.
// Source: the notebook "Chiêm tinh học", answer of 17/11/2026, mostly from "Conjunctions @ The Speed of Light",
// with Scientific Hindu Astrology Part 1, ASPECTS.pdf, mahadasha.pdf and single-pair notes in the notebook.
// Retold in plain, gentle words; illness and violence are left out on purpose. Rahu and Ketu are always opposite, so they never pair.
import { GRAHAS, type GrahaId } from "../../engine/constants.ts";

export const CONJ: Record<string, { gift: string; care: string }> = {
  "sun+moon": { gift: "ý chí và cảm xúc đi cùng một hướng, nên bạn kiên định và dễ có chỗ đứng", care: "lòng ít khi được yên, và trong tình cảm nên dành khoảng lặng để lắng nghe người kia" },
  "sun+mars": { gift: "can đảm, quyết đoán, hợp với vai trò dẫn dắt hay điều hành", care: "tính nóng, dễ nổi giận và dễ va chạm" },
  "sun+mercury": { gift: "đầu óc sắc, nói giỏi, hợp với học thuật, kinh doanh và quản lý", care: "khi hai sao quá sát nhau, dễ chủ quan và tin mình đúng quá mức" },
  "sun+jupiter": { gift: "tử tế, có nguyên tắc, được người có vị thế quý, hợp làm thầy, làm luật hay dẫn dắt", care: "dễ tự cao hoặc cứng nhắc trong niềm tin của mình" },
  "sun+venus": { gift: "có gu thẩm mỹ, có sức hút, tiền bạc thường khá lên sau khi lập gia đình", care: "kỳ vọng trong tình cảm dễ cao quá, khiến chuyện vợ chồng hay trục trặc" },
  "sun+saturn": { gift: "kỷ luật, có trách nhiệm, làm bền và trọng bổn phận", care: "áp lực đè nặng, và quan hệ với cha thường cần thời gian mới êm" },
  "sun+rahu": { gift: "dám vượt khuôn cũ, khao khát làm nên tên tuổi", care: "dễ ảo tưởng về mình hoặc dính thị phi" },
  "sun+ketu": { gift: "trực giác sâu, sẵn lòng buông danh lợi để tìm điều thật", care: "dễ thiếu tự tin và thấy xa cách với cha" },
  "moon+mars": { gift: "năng nổ, nhạy với tiền và quyết tâm làm giàu", care: "dễ bốc đồng và cảm xúc thất thường" },
  "moon+mercury": { gift: "đầu óc linh hoạt, giàu tưởng tượng, khéo ăn nói và giỏi xoay xở", care: "dễ bồn chồn, lo nghĩ nhiều và hay đổi ý" },
  "moon+jupiter": { gift: "rộng lượng, lạc quan, hiểu biết và dễ được tiếng tốt (Gajakesari)", care: "khi hai sao yếu, dễ chủ quan hoặc chiều cảm xúc quá" },
  "moon+venus": { gift: "duyên dáng, có khiếu nghệ thuật và dễ được nhiều người mến", care: "cả nể, ham hưởng thụ và dễ mơ mộng trong tình yêu" },
  "moon+saturn": { gift: "chịu khó, điềm tĩnh, chịu đựng giỏi và rất thực tế", care: "lòng hay nặng trĩu và dễ thấy cô đơn" },
  "moon+rahu": { gift: "trực giác nhạy, thích khám phá điều mới lạ", care: "hay lo vô cớ và dễ bị người khác tác động đến cảm xúc" },
  "moon+ketu": { gift: "nội tâm tĩnh, trực giác mạnh, hợp với việc đào sâu tâm lý hay tâm linh", care: "dễ thấy lạc lõng giữa đời thường và xa cách với mẹ" },
  "mars+mercury": { gift: "nghĩ nhanh, tranh luận sắc, giỏi kỹ thuật và công nghệ", care: "lời nói dễ gắt và hay căng thẳng" },
  "mars+jupiter": { gift: "can đảm có hướng, chính trực, giỏi dẫn dắt và quản lý", care: "dễ áp đặt và nóng vội bắt người khác theo mình" },
  "mars+venus": { gift: "sức hút mạnh, đam mê nghệ thuật, sáng tạo dồi dào", care: "ham muốn và hành động dễ giằng co, tình cảm lúc nóng lúc lạnh" },
  "mars+saturn": { gift: "bền, lì, chịu áp lực giỏi, hợp với xây dựng, cơ khí hay việc khó", care: "dồn nén lâu rồi bùng ra; nên cẩn thận khi làm việc nguy hiểm" },
  "mars+rahu": { gift: "dám nghĩ dám làm, tham vọng lớn, sức làm việc bùng nổ", care: "dễ liều và vượt rào" },
  "mars+ketu": { gift: "gan dạ, dám dấn thân vì mục tiêu, giỏi việc cần chính xác như kỹ thuật", care: "hành động vội và dễ va chạm bất ngờ" },
  "mercury+jupiter": { gift: "hiểu rộng, khéo cư xử, hợp dạy học, viết và tư vấn", care: "dễ tự hào về hiểu biết của mình" },
  "mercury+venus": { gift: "khéo nói, duyên dáng, có khiếu ngoại giao, thẩm mỹ và kinh doanh", care: "ham vui và dễ chú trọng cái hào nhoáng" },
  "mercury+saturn": { gift: "nghĩ chặt chẽ, kỷ luật, giỏi tính toán chi tiết và nghiên cứu sâu", care: "dễ bi quan, khô khan và hay soi lỗi nhỏ" },
  "mercury+rahu": { gift: "đầu óc mưu lược, nhạy với công nghệ, đàm phán và cái mới", care: "nghĩ quá nhiều đến quá tải, và cần giữ lời cho thật" },
  "mercury+ketu": { gift: "trực giác trừu tượng, giỏi giải mã thông tin và tư duy toán học", care: "giao tiếp dễ vụng và quyết định đôi khi thiếu cân nhắc" },
  "jupiter+venus": { gift: "hiểu biết rộng về văn hóa nghệ thuật, sống hòa nhã, đủ đầy và được kính trọng", care: "dễ giằng co giữa lý tưởng cao và ham hưởng thụ" },
  "jupiter+saturn": { gift: "điềm đạm, công tâm, thực tế, hợp với luật, xét xử hay quản lý", care: "nhiều trách nhiệm, thành công thường đến chậm" },
  "jupiter+rahu": { gift: "dám đặt câu hỏi với điều cũ, có khiếu phát minh và tìm cái mới", care: "dễ chống thầy hoặc tưởng mình đã hiểu hết" },
  "jupiter+ketu": { gift: "hướng thiện, hiểu quy luật sâu xa và trực giác tâm linh mạnh", care: "dễ thờ ơ với chuyện tiền bạc và đời sống thường ngày" },
  "venus+saturn": { gift: "chung thủy, thực tế trong tình cảm, có trách nhiệm với gia đình", care: "duyên thường đến muộn và cách thể hiện tình cảm hơi lạnh" },
  "venus+rahu": { gift: "sức hút khác biệt, sáng tạo độc đáo, dễ hợp với người nước ngoài", care: "dễ say mê mù quáng hoặc bị lừa trong tình cảm" },
  "venus+ketu": { gift: "cảm nhận cái đẹp tinh tế mà không màng danh tiếng", care: "hay thất vọng trong tình cảm và dễ buông một mối quan hệ" },
  "saturn+rahu": { gift: "kiên nhẫn, mưu lược, có sức làm việc lớn và quản được việc phức tạp", care: "trong lòng hay giằng co giữa khuôn phép và muốn phá rào" },
  "saturn+ketu": { gift: "khắc kỷ, bền bỉ làm việc một mình, hợp nghiên cứu điều cổ xưa", care: "dễ thấy nặng nề và buông xuôi" },
};

export function conjOf(a: GrahaId, b: GrahaId) {
  const [x, y] = GRAHAS.indexOf(a) < GRAHAS.indexOf(b) ? [a, b] : [b, a];
  return CONJ[`${x}+${y}`];
}

/** {a} and {b} are names; {gift} and {care} come from CONJ. */
export const CONJ_LINE = "{a} và {b} ngồi cùng nhau thường cho {gift}. Điều cần để ý: {care}.";
