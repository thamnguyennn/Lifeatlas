// Hand-written reading atoms, part 9: the nine Vimshottari periods as chapters of a life.
// title = a short name; asks = what the chapter asks of you; scene = a pattern that tends to show up;
// trap = where people usually stumble; ask = a question; now = one sentence used when the chapter is the current one.

import type { GrahaId } from "../../engine/constants.ts";

export interface Chapter { title: string; asks: string; scene: string; trap: string; ask: string; now: string }

export const CHAPTER: Record<GrahaId, Chapter> = {
  sun: {
    title: "tự đứng lên",
    asks: "Giai đoạn này đòi bạn xác định mình là ai và đứng trên đôi chân của mình. Công việc, vị thế, chuyện với cha và với những người có quyền đều được soi lại.",
    scene: "Điều hay gặp là bạn không còn chịu ở dưới người khác khi thấy mình làm được tốt hơn, và muốn được ghi nhận rõ ràng.",
    trap: "Cái bẫy là cái tôi bị đụng đến và những cuộc tranh quyền. Tim, mắt và xương cũng nên được để ý.",
    ask: "Bạn muốn đứng lên vì điều gì, ngoài việc để không ai sai bảo mình?",
    now: "Điều đang được hỏi là bạn muốn đứng ở đâu và đứng vì điều gì.",
  },
  moon: {
    title: "về với cảm xúc và nơi chốn",
    asks: "Giai đoạn này đưa cảm xúc, gia đình, nơi ở và sự an toàn trong lòng lên hàng đầu. Mẹ, những người chăm sóc và việc chăm sóc người khác dễ trở thành chủ đề.",
    scene: "Điều hay gặp là bạn nhạy hơn, nhớ nhà hơn, và muốn một nhịp sống êm dưới chân.",
    trap: "Cái bẫy là để tâm trạng lên xuống kéo theo quyết định. Giấc ngủ và giờ ăn đều đặn quan trọng hơn bình thường.",
    ask: "Điều gì đang làm bạn thấy an toàn, và điều gì chỉ trông giống an toàn?",
    now: "Những năm này, chuyện nhà và chuyện lòng đòi được ưu tiên hơn lịch làm việc.",
  },
  mars: {
    title: "hành động",
    asks: "Giai đoạn này đòi bạn hành động: khởi sự, tranh đấu cho điều mình muốn, vượt qua nỗi sợ.",
    scene: "Điều hay gặp là bạn có sức bật, nóng hơn thường lệ, và sốt ruột với mọi thứ chậm.",
    trap: "Cái bẫy là nóng nảy, liều và va chạm, kể cả với người thân. Vận động cơ thể giúp bạn xả bớt.",
    ask: "Điều gì bạn sẽ dám làm nếu thôi chờ đến khi chắc chắn?",
    now: "Những năm này, việc chờ thêm thường tốn hơn việc thử sớm.",
  },
  mercury: {
    title: "học và trao đổi",
    asks: "Giai đoạn này đẩy trí óc, giao tiếp, buôn bán, học hành và kỹ năng lên phía trước.",
    scene: "Điều hay gặp là bạn học nhiều thứ, gặp nhiều người, và đổi hướng nghề ít nhất một lần.",
    trap: "Cái bẫy là phân tán và nghĩ ngợi nhiều. Thần kinh và giấc ngủ cần được để ý.",
    ask: "Trong tất cả những gì bạn đang học, điều nào bạn sẽ thật sự dùng?",
    now: "Những năm này, điều bạn học và người bạn trò chuyện cùng định hướng nhiều hơn bạn nghĩ.",
  },
  jupiter: {
    title: "mở rộng và tìm ý nghĩa",
    asks: "Giai đoạn này mở rộng đời sống: học vấn cao, người thầy, niềm tin, con cái và vận may. Nó hay mang đến những cơ hội đến từ điều bạn đã gieo từ trước.",
    scene: "Điều hay gặp là bạn nhìn xa hơn, rộng lượng hơn, và gặp một người hoặc một ý tưởng đổi cách bạn nghĩ.",
    trap: "Cái bẫy là ôm quá nhiều, lạc quan quá mức, và tăng cân hay tăng nợ mà không để ý.",
    ask: "Khi cơ hội mở ra, bạn sẵn lòng cam kết với điều gì?",
    now: "Những năm này, một lời mời hay một người thầy đến đúng lúc có thể mở cả một hướng mới.",
  },
  venus: {
    title: "yêu, thưởng thức và gắn kết",
    asks: "Giai đoạn này đưa tình yêu, hôn nhân, tiền bạc, thẩm mỹ và sự thoải mái lên cao.",
    scene: "Điều hay gặp là bạn chăm diện mạo và không gian sống hơn, quan hệ lãng mạn nặng ký hơn, và bạn chi cho điều làm mình dễ chịu.",
    trap: "Cái bẫy là mê sự thoải mái, tiêu theo cảm giác, và yêu bằng cách lý tưởng hóa.",
    ask: "Điều gì khiến bạn thật sự thấy được yêu, ngoài những thứ làm bạn thấy dễ chịu?",
    now: "Những năm này, bạn hợp với những gì làm lòng mềm ra: người, nơi chốn, cái đẹp.",
  },
  saturn: {
    title: "trách nhiệm và bền bỉ",
    asks: "Giai đoạn này đòi sự nghiêm túc: gánh trách nhiệm, làm việc đều, xây thứ lâu dài và chịu cô đơn khi cần.",
    scene: "Điều hay gặp là thời gian nặng hơn và kết quả chậm hơn, nhưng thứ bạn dựng ở đây thường đứng rất lâu.",
    trap: "Cái bẫy là khắt khe với mình, lạnh lùng và kiệt sức. Xương khớp và tâm trạng thấp cần được để ý.",
    ask: "Điều gì đáng để bạn kiên nhẫn xây trong giai đoạn này?",
    now: "Những năm này, thứ gì xây chậm mà chắc thì đáng để giữ.",
  },
  rahu: {
    title: "khao khát và đổi hướng",
    asks: "Giai đoạn này kéo bạn ra khỏi khuôn quen: tham vọng, cơ hội lạ, nước ngoài, công nghệ, những người khác lối. Bạn muốn nhiều hơn mức cũ cho phép.",
    scene: "Điều hay gặp là cuộc sống đổi hướng nhanh, có cảm giác không bao giờ đủ, và những người, nơi chốn bất ngờ bước vào.",
    trap: "Cái bẫy là chạy theo cái lạ, ảo tưởng, nghi ngờ và nghĩ quá nhiều. Tâm trí cần một chỗ neo.",
    ask: "Điều bạn đang đuổi theo là điều bạn cần, hay điều bạn tưởng mình thiếu?",
    now: "Những năm này, điều mới lạ hấp dẫn bạn hơn thường lệ.",
  },
  ketu: {
    title: "buông và quay vào trong",
    asks: "Giai đoạn này bóc dần những thứ bạn từng bám: vai trò, mối quan hệ, mục tiêu đã hết sức hút. Nó mời bạn quay về với chính mình.",
    scene: "Điều hay gặp là bạn thấy chán điều từng say mê, muốn ít người xung quanh hơn, và có những quyết định buông bất ngờ.",
    trap: "Cái bẫy là rút lui quá nhiều và thấy mất phương hướng. Bạn cần một thực hành tĩnh tâm và một người để nói thật.",
    ask: "Điều gì đã xong với bạn mà bạn chưa cho phép mình rời đi?",
    now: "Những năm này, bớt đi một thứ thường nhẹ hơn thêm một thứ.",
  },
};

// ---------------------------------------------------------------- what a chapter lights up
// A Dasha chapter pulls forward the houses its lord rules (DASHA_LIT) and plays out through the house where that lord sits (DASHA_STAGE).
// These are written for the chapter frame, so they never repeat the sentences of the "Mười hai nhà" section.

/** DASHA_LIT[h - 1]: the chapter lights up house h. */
export const DASHA_LIT: string[] = [
  "Chuyện của chính bạn lên trước: cách bạn nhìn mình, sức khỏe và hình ảnh bạn mang ra ngoài đều được hỏi lại. Giai đoạn này hay đến cùng cảm giác muốn sống đúng với mình hơn là đúng với kỳ vọng.",
  "Tiền, lời nói và gia đình gốc lên tiếng. Bạn thấy rõ mình đang giữ gì, tiêu vào đâu, và những câu nói trong nhà đã định giá bạn ra sao.",
  "Chuyện tự tay làm lên tiếng: điều bạn dám bắt đầu, kỹ năng bạn luyện, anh chị em hay người đồng trang lứa. Giai đoạn này thưởng cho người chịu làm và chịu nói ra.",
  "Chuyện nhà lên tiếng: nơi ở, mẹ, cảm giác có chỗ về. Nhiều người trong giai đoạn này dọn nhà, sửa nhà, hoặc cuối cùng cũng hỏi mình đâu là nơi thấy yên.",
  "Niềm vui và sáng tạo lên tiếng: tình yêu mới, con cái, thứ bạn làm vì thích. Giai đoạn này hỏi lần cuối cùng bạn chơi thật là khi nào.",
  "Việc hằng ngày, sức khỏe và những cuộc cạnh tranh lên tiếng. Giai đoạn này đòi kỷ luật, và cơ thể báo sớm nếu bạn gồng quá.",
  "Hôn nhân và hợp tác lên tiếng: ai ở cạnh bạn, ai đứng đối diện, ai đáng để cam kết. Quan hệ gần nhất trở thành tấm gương rõ nhất.",
  "Những chuyện sâu lên tiếng: biến cố, tiền chung, điều giấu kín, những lần phải bỏ cái cũ. Giai đoạn này thường khó chịu lúc đầu và để lại thứ vững nhất về sau.",
  "Niềm tin, người thầy, việc học cao và những chuyến đi xa lên tiếng. Giai đoạn này hay mang đến một người hoặc một ý tưởng đổi cách bạn hiểu đời.",
  "Sự nghiệp và vị thế lên tiếng: điều bạn được biết đến, trách nhiệm bạn gánh, người nhìn vào việc bạn làm. Công việc có xu hướng đòi bạn nhiều hơn và trả lại nhiều hơn.",
  "Thành quả, bạn bè và mục tiêu lớn lên tiếng. Giai đoạn này hay đưa bạn vào những vòng người mới, và điều bạn gieo từ trước bắt đầu có kết quả.",
  "Đời sống nội tâm lên tiếng: giấc ngủ, nơi xa, thời gian một mình, những chi phí âm thầm. Giai đoạn này cần khoảng lặng, và bạn đỡ mệt khi có chỗ để rút lui.",
];

/** DASHA_STAGE[p - 1]: the lord of the chapter sits in house p, so the chapter plays out there. */

/** DASHA_STAGE[p - 1]: the lord of the chapter sits in house p, so the chapter plays out there. Read after: Giai đoạn “…” diễn ra */
export const DASHA_STAGE: string[] = [
  "ngay trên con người bạn: bạn là người đứng ra làm, và người ngoài thấy sự đổi thay ở bạn trước khi thấy kết quả.",
  "qua tiền bạc và lời nói: thu nhập, cách bạn định giá mình, những cuộc nói chuyện trong gia đình.",
  "qua việc tự tay làm: bạn phải tự bắt đầu, tự luyện, và hay làm cùng anh chị em hoặc bạn đồng trang lứa.",
  "qua nhà cửa và đời sống nội tâm: nơi ở, mẹ, và cảm giác yên hay không yên khi về đến cửa.",
  "qua sáng tạo, tình yêu và con cái: bạn học bằng niềm vui nhiều hơn bằng nghĩa vụ.",
  "qua công việc hằng ngày và sức khỏe: thay đổi nằm ở thói quen, nhịp làm việc và cách bạn chăm cơ thể.",
  "qua người đối diện: bạn đời, đối tác, khách hàng. Bạn hiểu mình hơn qua cách họ phản hồi.",
  "qua những chuyển đổi sâu: một mất mát, một cuộc khủng hoảng hay một lần nhìn thẳng vào điều ẩn. Nó khó chịu lúc đầu và làm bạn chắc hơn về sau.",
  "qua niềm tin và những chuyến đi: học thêm, gặp người thầy, đi xa hoặc đổi cách nhìn đời.",
  "qua công việc và vị thế: người ta thấy bạn làm gì, và bạn thấy rõ mình muốn đi đến đâu.",
  "qua bạn bè, mạng lưới và thu nhập: người quen mở cửa, mục tiêu lớn dần rõ hơn.",
  "khá kín: trong giấc ngủ, ở những nơi xa, trong những lúc một mình. Ít ai thấy, nhưng bạn thấy rất rõ.",
];
