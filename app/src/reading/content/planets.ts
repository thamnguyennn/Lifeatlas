// Hand-written reading atoms, part 2: the nine grahas, their condition, and the link frames.
import type { GrahaId } from "../../engine/constants.ts";

export interface PlanetText {
  role: string; // what it stands for, in plain words
  gift: string;
  shadow: string;
  dasha: string; // theme of its major period (Mahadasha)
  antar: string; // one clause for a sub-period (Antardasha)
}

export const PLANETS: Record<GrahaId, PlanetText> = {
  sun: {
    role: "ý chí, uy tín, cha và quyền hạn", gift: "tự tin, ngay thẳng, biết dẫn dắt", shadow: "cái tôi lớn, khó nhún",
    dasha: "Đại vận Mặt Trời (6 năm) đưa chuyện vị thế, uy tín và ý chí lên hàng đầu. Đây là giai đoạn bạn muốn tự đứng lên, được ghi nhận và làm chủ một điều gì đó; quan hệ với cha hoặc người có quyền thường trở thành chủ đề. Cái tôi, tim và mắt cần được để ý.",
    antar: "chuyện vị thế, ý chí và người có quyền lên tiếng",
  },
  moon: {
    role: "tâm trí, cảm xúc, mẹ và sự nuôi dưỡng", gift: "nhạy cảm, biết chăm sóc, trực giác tốt", shadow: "dễ dao động, hay lo",
    dasha: "Đại vận Mặt Trăng (10 năm) đặt cảm xúc, gia đình và sự an toàn trong lòng vào trung tâm. Nhà cửa, mẹ, nơi ở và những mối quan tâm chăm sóc dễ nổi lên; tâm trạng nhạy hơn bình thường nên nhịp sinh hoạt đều và giấc ngủ rất quan trọng.",
    antar: "cảm xúc, gia đình và chuyện nhà cửa lên tiếng",
  },
  mars: {
    role: "hành động, can đảm, sức bật và tranh đấu", gift: "dám làm, biết bảo vệ, quyết liệt", shadow: "nóng nảy, liều, dễ va chạm",
    dasha: "Đại vận Sao Hỏa (7 năm) là giai đoạn hành động: bạn có sức bật, muốn khởi đầu và dám tranh đấu cho điều mình muốn. Đất đai, nhà cửa và công việc cần thể lực dễ liên quan; hãy để ý nóng giận, va chạm và chấn thương.",
    antar: "hành động, sức bật và chuyện cạnh tranh lên tiếng",
  },
  mercury: {
    role: "trí tuệ, lời nói, buôn bán và học hỏi", gift: "nhanh trí, khéo ăn nói, linh hoạt", shadow: "hay lo nghĩ, phân tán",
    dasha: "Đại vận Sao Thủy (17 năm) là giai đoạn của trí tuệ, học hỏi, giao tiếp và buôn bán. Bạn có nhiều ý tưởng, nhiều mối quan hệ và nhiều việc cùng lúc; điều cần để ý là phân tán và lo nghĩ quá mức.",
    antar: "học hỏi, giao tiếp và chuyện buôn bán lên tiếng",
  },
  jupiter: {
    role: "trí khôn, niềm tin, thầy học, con cái và tài lộc", gift: "rộng lượng, lạc quan, khôn ngoan", shadow: "chủ quan, hứa nhiều, phóng đại",
    dasha: "Đại vận Sao Mộc (16 năm) thường là giai đoạn mở rộng: học vấn, niềm tin, thầy giỏi, con cái và tài lộc có cơ hội phát triển. Bạn dễ có người nâng đỡ; điều cần để ý là chủ quan, hứa nhiều và tăng cân.",
    antar: "học vấn, niềm tin và người nâng đỡ lên tiếng",
  },
  venus: {
    role: "tình cảm, hòa hợp, nghệ thuật và tiện nghi", gift: "có duyên, có gu, hòa nhã", shadow: "ham hưởng thụ, chiều bản thân, né điều khó",
    dasha: "Đại vận Sao Kim (20 năm) là giai đoạn của tình cảm, hòa hợp, nghệ thuật và tiện nghi. Quan hệ, hôn nhân, tiền từ cái đẹp hoặc dịch vụ dễ phát triển; điều cần để ý là ham hưởng thụ và chiều bản thân quá mức.",
    antar: "tình cảm, hòa hợp và tiện nghi lên tiếng",
  },
  saturn: {
    role: "kỷ luật, thời gian, trách nhiệm và thử thách", gift: "kiên nhẫn, chín chắn, đáng tin", shadow: "nặng nề, trì hoãn, tự khắt khe",
    dasha: "Đại vận Sao Thổ (19 năm) là giai đoạn của kỷ luật và trách nhiệm: mọi thứ đến chậm hơn và đòi kiên nhẫn, nhưng điều bạn xây trong thời gian này thường bền. Công việc nặng hơn, bạn trưởng thành rõ rệt; cần giữ xương khớp và tinh thần.",
    antar: "kỷ luật, trách nhiệm và những việc đòi kiên nhẫn lên tiếng",
  },
  rahu: {
    role: "khát khao, điều mới lạ, tham vọng và nước ngoài", gift: "dám phá lệ, nhạy với xu hướng", shadow: "dễ ám ảnh, bất mãn, ảo tưởng",
    dasha: "Đại vận Rahu (18 năm) là giai đoạn khát khao và đổi thay: bạn bị hút về điều mới, nước ngoài, công nghệ hay một vị thế chưa từng có. Cơ hội đến nhanh và bất ngờ, nhưng không phải thứ gì sáng cũng là vàng; hãy kiểm chứng trước khi dấn sâu.",
    antar: "khát khao, điều mới lạ và chuyện nước ngoài lên tiếng",
  },
  ketu: {
    role: "buông bỏ, trực giác và những kỹ năng mang theo từ trước", gift: "tách bạch, sâu sắc, tự thấu hiểu", shadow: "thờ ơ, xa cách, lạc hướng",
    dasha: "Đại vận Ketu (7 năm) là giai đoạn buông bỏ và quay vào trong: một số thứ từng quan trọng nhạt dần, trực giác và nhu cầu tìm ý nghĩa mạnh lên. Có thể có chia ly hoặc đổi hướng; thiền, nghiên cứu hay tâm linh hợp với thời kỳ này.",
    antar: "buông bỏ, trực giác và nhu cầu tìm ý nghĩa lên tiếng",
  },
};

/** Condition sentences. {p} = planet, {sign} = sign name. */
export const CONDITION = {
  exalted: "{p} đang ở cung {sign}, cung mạnh nhất của nó: những điều nó đại diện thường thuận và nổi bật.",
  moolatrikona: "{p} đang ở cung {sign}, một đoạn rất vững của nó, nên nó làm việc ổn định và đáng tin.",
  own: "{p} nằm trong chính cung của mình ({sign}), như người ở nhà mình: tự tin và ít bị cản trở.",
  friend: "{p} đang ở cung {sign} của một hành tinh thân thiện, nên nó làm việc thuận và được hỗ trợ.",
  neutral: "{p} đang ở cung {sign}, một cung trung tính với nó: kết quả phụ thuộc nhiều vào các yếu tố khác trong lá số.",
  enemy: "{p} đang ở cung {sign} của một hành tinh không thân, nên điều nó đại diện hay gặp cản trở và cần bạn bền bỉ hơn.",
  debilitated: "{p} đang ở cung {sign}, vị trí yếu nhất của nó: điều nó đại diện cần nhiều nỗ lực hơn, nhưng cũng là chỗ bạn rèn được nhiều bản lĩnh.",
  retro: "{p} đang nghịch hành (nhìn từ Trái Đất thì có vẻ đi lùi): chuyện của nó hay đi theo vòng, quay lại xem xét hơn là đi thẳng một mạch.",
  combust: "{p} nằm quá gần Mặt Trời nên ánh sáng của nó bị lấn át: phần thực tế của điều nó đại diện dễ yếu đi, còn phần tinh thần thì thường được gạn cho sâu hơn.",
  vargottama: "{p} đứng cùng một cung ở cả lá số chính và lá số phụ D9, dấu hiệu cho thấy sức mạnh của nó rất rõ nét.",
  digBala: "{p} đứng đúng nhà mà nó có nhiều sức nhất, nên ở đây nó có thêm lực.",
} as const;

/**
 * How the lord of a house (H) is placed in house P. {L} lord, {H} house, {P} house where it sits,
 * {dH} / {dP} the domain phrases. Three variants per class so a reading never repeats a sentence.
 */
export type LinkClass = "same" | "support" | "action" | "gain" | "effort" | "letgo";

/** A planet casting a full aspect onto a house. {dH} = domain of the house being looked at. */
export const ASPECT_TEXT: Partial<Record<GrahaId, string>> = {
  sun: "Mặt Trời nhìn vào nhà này, mang sự tự tin và ý chí đến chuyện {dH}; bạn được hỗ trợ khi làm việc có trách nhiệm, nhưng cần nhún khi gặp ý kiến trái chiều.",
  moon: "Mặt Trăng nhìn vào nhà này, làm chuyện {dH} gắn với cảm xúc và sự quan tâm; mọi thứ dễ lên xuống theo tâm trạng nên cần một nhịp ổn định.",
  mars: "Sao Hỏa nhìn vào nhà này, thêm sức bật và sự quyết liệt cho chuyện {dH}; bạn dám hành động ở đây nhưng dễ nóng và va chạm.",
  mercury: "Sao Thủy nhìn vào nhà này, đưa lý trí và khả năng trao đổi vào chuyện {dH}; bạn xử lý tốt bằng thông tin và nói chuyện rõ ràng.",
  jupiter: "Sao Mộc nhìn vào nhà này bằng cái nhìn che chở: chuyện {dH} được nâng đỡ bởi sự khôn ngoan, may mắn và người lớn giúp đỡ.",
  venus: "Sao Kim nhìn vào nhà này, làm mềm và làm đẹp chuyện {dH}; bạn dễ có thiện cảm và quan hệ dễ chịu ở đây, chỉ cần tránh né vấn đề khó.",
  saturn: "Sao Thổ nhìn vào nhà này, đặt kỷ luật và thử thách lên chuyện {dH}; mọi thứ đến chậm và đòi kiên nhẫn, nhưng kết quả bạn có được thường bền.",
};

/**
 * Mars, Jupiter and Saturn cast more than one aspect, so each distance gets its own sentence;
 * otherwise a chart where one planet looks at three houses would repeat itself three times.
 * Key = how many houses it counts from the planet to the house it looks at.
 */
export const ASPECT_BY_DISTANCE: Partial<Record<GrahaId, Record<number, string>>> = {
  mars: {
    4: "Sao Hỏa nhìn vào nhà này, thêm sức bật cho chuyện {dH}; bạn dám làm và làm nhanh, nhưng dễ vội nên cần kiên nhẫn hơn một chút.",
    7: "Sao Hỏa nhìn thẳng vào nhà này, thêm sự quyết liệt cho chuyện {dH}; bạn sẵn sàng tranh đấu ở đây, chỉ cần để ý chuyện nóng nảy và va chạm.",
    8: "Sao Hỏa nhìn vào nhà này từ xa, khiến chuyện {dH} có những lúc căng bất ngờ hoặc phải đổi cách làm; hãy bình tĩnh trước khi phản ứng và đừng quyết định trong cơn nóng.",
  },
  jupiter: {
    5: "Sao Mộc nhìn vào nhà này, rải sự khôn ngoan và may mắn lên chuyện {dH}; bạn dễ gặp người hướng dẫn tốt ở đây.",
    7: "Sao Mộc nhìn thẳng vào nhà này bằng cái nhìn che chở: chuyện {dH} được nâng đỡ bởi sự khôn ngoan và người lớn giúp đỡ.",
    9: "Sao Mộc nhìn vào nhà này, mang thiện chí và sự nâng đỡ đến chuyện {dH}; những chuyện tưởng khó thường có đường thoát nhờ có người giúp.",
  },
  saturn: {
    3: "Sao Thổ nhìn vào nhà này, đặt kỷ luật lên chuyện {dH}; mọi thứ đến chậm hơn nhưng nền bạn xây ở đây có độ bền.",
    7: "Sao Thổ nhìn thẳng vào nhà này, đòi hỏi trách nhiệm và sự kiên nhẫn trong chuyện {dH}; kết quả đến muộn nhưng đáng tin.",
    10: "Sao Thổ nhìn vào nhà này, tạo áp lực phải làm cho nghiêm túc chuyện {dH}; bạn có thể thấy nặng nề, nhưng đây cũng là chỗ bạn trưởng thành rõ nhất.",
  },
};
